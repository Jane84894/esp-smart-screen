#!/usr/bin/env node

/**
 * Semantic Cache for Model Router
 * 
 * Uses string similarity to cache semantically similar queries.
 * Based on GPTCache and Redis semantic caching patterns.
 * 
 * Features:
 * - Levenshtein distance for similarity
 * - Configurable threshold (default: 0.85)
 * - LRU eviction
 * - Persistent storage
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_FILE = join(__dirname, '../data/semantic-cache.json');

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score (0-1)
 */
function similarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Normalize text for comparison
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5]/gu, '') // Keep Chinese characters
    .replace(/\s+/g, ' ');
}

class SemanticCache {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.threshold = options.threshold || 0.85; // 85% similarity
    this.ttl = options.ttl || 3600; // 1 hour
    this.maxSize = options.maxSize || 500;
    this.cache = []; // Array of {key, normalizedKey, value, timestamp, hits}
    this.stats = {
      hits: 0,
      misses: 0,
      semanticHits: 0,
      exactHits: 0
    };
    
    this.load();
    
    // Auto-save every 5 minutes
    this.saveInterval = setInterval(() => this.save(), 300000);
  }
  
  /**
   * Find similar key in cache
   */
  findSimilar(normalizedKey) {
    for (const item of this.cache) {
      const sim = similarity(normalizedKey, item.normalizedKey);
      if (sim >= this.threshold) {
        return { item, similarity: sim };
      }
    }
    return null;
  }
  
  /**
   * Get from cache (with semantic matching)
   */
  get(key) {
    if (!this.enabled) return null;
    
    const normalized = normalizeText(key);
    const now = Date.now();
    
    // Try exact match first
    const exactIndex = this.cache.findIndex(item => item.key === key);
    if (exactIndex !== -1) {
      const item = this.cache[exactIndex];
      
      // Check expiration
      if (now > item.expires) {
        this.cache.splice(exactIndex, 1);
        this.stats.misses++;
        return null;
      }
      
      // Move to end (LRU)
      this.cache.splice(exactIndex, 1);
      this.cache.push(item);
      item.hits++;
      
      this.stats.exactHits++;
      this.stats.hits++;
      return item.value;
    }
    
    // Try semantic match
    const similar = this.findSimilar(normalized);
    if (similar) {
      const { item, similarity: sim } = similar;
      
      // Check expiration
      if (now > item.expires) {
        const index = this.cache.indexOf(item);
        if (index !== -1) this.cache.splice(index, 1);
        this.stats.misses++;
        return null;
      }
      
      // Move to end (LRU)
      const index = this.cache.indexOf(item);
      if (index !== -1) {
        this.cache.splice(index, 1);
        this.cache.push(item);
      }
      item.hits++;
      
      this.stats.semanticHits++;
      this.stats.hits++;
      
      console.error(`[SemanticCache] Hit: "${key}" matched "${item.key}" (${(sim * 100).toFixed(1)}%)`);
      return item.value;
    }
    
    this.stats.misses++;
    return null;
  }
  
  /**
   * Set in cache
   */
  set(key, value, ttl = null) {
    if (!this.enabled) return;
    
    const normalized = normalizeText(key);
    const now = Date.now();
    
    // Remove if exists (to update position)
    const existingIndex = this.cache.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      this.cache.splice(existingIndex, 1);
    }
    
    // Evict if at max size (remove oldest)
    while (this.cache.length >= this.maxSize) {
      this.cache.shift(); // Remove oldest
    }
    
    this.cache.push({
      key,
      normalizedKey: normalized,
      value,
      expires: now + (ttl || this.ttl) * 1000,
      createdAt: now,
      hits: 0
    });
  }
  
  /**
   * Check if key exists
   */
  has(key) {
    return this.get(key) !== null;
  }
  
  /**
   * Delete from cache
   */
  delete(key) {
    const index = this.cache.findIndex(item => item.key === key);
    if (index !== -1) {
      this.cache.splice(index, 1);
      return true;
    }
    return false;
  }
  
  /**
   * Clear all cache
   */
  clear() {
    this.cache = [];
    this.save();
  }
  
  /**
   * Get statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    const semanticRate = this.stats.hits > 0 ? ((this.stats.semanticHits / this.stats.hits) * 100).toFixed(2) : 0;
    
    return {
      size: this.cache.length,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      exactHits: this.stats.exactHits,
      semanticHits: this.stats.semanticHits,
      hitRate: `${hitRate}%`,
      semanticRate: `${semanticRate}%`,
      threshold: this.threshold,
      ttl: this.ttl
    };
  }
  
  /**
   * Cleanup expired items
   */
  cleanup() {
    const now = Date.now();
    let count = 0;
    
    this.cache = this.cache.filter(item => {
      if (now > item.expires) {
        count++;
        return false;
      }
      return true;
    });
    
    return count;
  }
  
  /**
   * Save to file
   */
  save() {
    try {
      const dataDir = join(__dirname, '../data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }
      
      const data = {
        cache: this.cache,
        stats: this.stats,
        savedAt: Date.now()
      };
      writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('[SemanticCache] Save error:', e.message);
    }
  }
  
  /**
   * Load from file
   */
  load() {
    try {
      if (existsSync(CACHE_FILE)) {
        const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
        
        // Only load non-expired items
        const now = Date.now();
        this.cache = data.cache.filter(item => now < item.expires);
        
        this.stats = data.stats || this.stats;
      }
    } catch (e) {
      console.error('[SemanticCache] Load error:', e.message);
    }
  }
}

// Export for programmatic use
export { SemanticCache, similarity, normalizeText };

// CLI interface
if (process.argv[1] && process.argv[1].includes('semantic-cache.mjs')) {
  const args = process.argv.slice(2);
  const cache = new SemanticCache();
  
  if (args[0] === 'stats') {
    console.log('Semantic Cache Statistics:');
    console.log(JSON.stringify(cache.getStats(), null, 2));
  } else if (args[0] === 'clear') {
    cache.clear();
    console.log('Cache cleared');
  } else if (args[0] === 'cleanup') {
    const count = cache.cleanup();
    console.log(`Removed ${count} expired items`);
  } else if (args[0] === 'test') {
    const test1 = "帮我写个 Python 函数";
    const test2 = "写一个 Python 函数";
    const test3 = "打开客厅的灯";
    
    console.log('Similarity tests:');
    console.log(`"${test1}" vs "${test2}": ${(similarity(normalizeText(test1), normalizeText(test2)) * 100).toFixed(1)}%`);
    console.log(`"${test1}" vs "${test3}": ${(similarity(normalizeText(test1), normalizeText(test3)) * 100).toFixed(1)}%`);
  } else {
    console.log('Usage:');
    console.log('  node semantic-cache.mjs stats    - Show statistics');
    console.log('  node semantic-cache.mjs clear    - Clear cache');
    console.log('  node semantic-cache.mjs cleanup  - Remove expired items');
    console.log('  node semantic-cache.mjs test     - Test similarity');
  }
}
