#!/usr/bin/env node

/**
 * Simple Cache Implementation for Model Router
 * 
 * Features:
 * - TTL-based expiration
 * - Max size limit
 * - LRU eviction
 * - Persistent storage (JSON file)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CACHE_FILE = join(__dirname, '../data/cache.json');

class RouterCache {
  constructor(options = {}) {
    this.enabled = options.enabled !== false;
    this.ttl = options.ttl || 3600; // 1 hour default
    this.maxSize = options.maxSize || 1000;
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0
    };
    
    // Load persistent cache
    this.load();
    
    // Auto-save every 5 minutes
    this.saveInterval = setInterval(() => this.save(), 300000);
  }
  
  /**
   * Generate cache key from message
   */
  getKey(message) {
    return createHash('md5')
      .update(message.toLowerCase().trim())
      .digest('hex');
  }
  
  /**
   * Get item from cache
   */
  get(key) {
    if (!this.enabled) return null;
    
    const item = this.cache.get(key);
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    // Check expiration
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    // LRU: move to end
    this.cache.delete(key);
    this.cache.set(key, item);
    
    this.stats.hits++;
    return item.value;
  }
  
  /**
   * Set item in cache
   */
  set(key, value, ttl = null) {
    if (!this.enabled) return;
    
    // Evict if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
      this.stats.evictions++;
    }
    
    this.cache.set(key, {
      value,
      expires: Date.now() + (ttl || this.ttl) * 1000,
      createdAt: Date.now()
    });
  }
  
  /**
   * Check if key exists in cache
   */
  has(key) {
    return this.get(key) !== null;
  }
  
  /**
   * Delete item from cache
   */
  delete(key) {
    return this.cache.delete(key);
  }
  
  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.save();
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      evictions: this.stats.evictions,
      hitRate: `${hitRate}%`,
      ttl: this.ttl
    };
  }
  
  /**
   * Save cache to file
   */
  save() {
    try {
      const dataDir = join(__dirname, '../data');
      if (!existsSync(dataDir)) {
        // Don't create directory, just skip saving
        return;
      }
      
      const data = {
        cache: Array.from(this.cache.entries()),
        stats: this.stats,
        savedAt: Date.now()
      };
      writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
      // Silently ignore save errors
    }
  }
  
  /**
   * Load cache from file
   */
  load() {
    try {
      if (existsSync(CACHE_FILE)) {
        const data = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
        
        // Only load non-expired items
        const now = Date.now();
        data.cache.forEach(([key, item]) => {
          if (now < item.expires) {
            this.cache.set(key, item);
          }
        });
        
        this.stats = data.stats || this.stats;
      }
    } catch (e) {
      // Silently ignore load errors
    }
  }
  
  /**
   * Cleanup expired items
   */
  cleanup() {
    const now = Date.now();
    let count = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }
}

// Export for programmatic use
export { RouterCache };

// CLI interface
if (process.argv[1] && process.argv[1].includes('cache.mjs')) {
  const args = process.argv.slice(2);
  const cache = new RouterCache();
  
  if (args[0] === 'stats') {
    console.log('Cache Statistics:');
    console.log(JSON.stringify(cache.getStats(), null, 2));
  } else if (args[0] === 'clear') {
    cache.clear();
    console.log('Cache cleared');
  } else if (args[0] === 'cleanup') {
    const count = cache.cleanup();
    console.log(`Removed ${count} expired items`);
  } else {
    console.log('Usage:');
    console.log('  node cache.mjs stats    - Show cache statistics');
    console.log('  node cache.mjs clear    - Clear all cache');
    console.log('  node cache.mjs cleanup  - Remove expired items');
  }
}
