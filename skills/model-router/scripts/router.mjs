#!/usr/bin/env node

/**
 * Model Router v2.0 - With Cache, Stats, and Classifier
 * 
 * Usage:
 *   node router.mjs "user message"
 * 
 * Features:
 * - Keyword + pattern matching
 * - LRU cache with TTL
 * - Usage statistics tracking
 * - Cost monitoring
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load configuration
const configPath = join(__dirname, '../config/routes.json');
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

// Import cache and stats
import { SemanticCache } from './semantic-cache.mjs';
import { CostMonitor } from './stats.mjs';

// Initialize singleton instances
const cache = new SemanticCache({ enabled: true, threshold: 0.85, ttl: 3600, maxSize: 500 });
const stats = new CostMonitor({ monthlyLimit: 18000, dailyLimit: 1000 });

/**
 * Calculate match score for a route
 */
function calculateScore(message, route) {
  let score = 0;
  const lowerMessage = message.toLowerCase();
  const triggers = route.triggers || {};
  
  // Keyword matching (weighted)
  if (triggers.keywords) {
    for (const keyword of triggers.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }
  }
  
  // Pattern matching (regex)
  if (triggers.patterns) {
    for (const pattern of triggers.patterns) {
      try {
        const regex = new RegExp(pattern);
        if (regex.test(message)) {
          score += 20;
        }
      } catch (e) {
        // Invalid pattern, skip
      }
    }
  }
  
  // Complexity indicators
  if (triggers.complexityIndicators) {
    for (const indicator of triggers.complexityIndicators) {
      try {
        const regex = new RegExp(indicator);
        if (regex.test(message)) {
          score += 15;
        }
      } catch (e) {
        // Invalid pattern, skip
      }
    }
  }
  
  // Length constraints
  if (triggers.minLength && message.length < triggers.minLength) {
    score -= 30;
  }
  if (triggers.maxLength && message.length > triggers.maxLength) {
    score -= 30;
  }
  
  // Priority bonus
  const priorityBonus = { 'high': 10, 'medium': 5, 'low': 0 };
  score += priorityBonus[route.priority] || 0;
  
  return score;
}

/**
 * Select the best model for a given message (with semantic cache and stats)
 */
function selectModel(message) {
  // Check semantic cache first
  const cached = cache.get(message);
  
  if (cached) {
    return {
      ...cached,
      fromCache: true
    };
  }
  
  // Perform routing
  const results = [];
  
  for (const route of config.routes) {
    const score = calculateScore(message, route);
    results.push({
      route: route.name,
      model: score > 0 ? route.model : route.fallback,
      score: score,
      description: route.description
    });
  }
  
  // Sort by score descending, then by priority for tie-breaking
  const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2 };
  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.route === 'reasoning' && b.route === 'coding') return -1;
    if (a.route === 'coding' && b.route === 'reasoning') return 1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  // Return best match
  const best = results[0];
  
  let result;
  if (best.score < 10) {
    result = {
      model: config.defaultModel,
      route: 'default',
      score: 0,
      reasoning: 'No strong match, using default model'
    };
  } else {
    result = {
      model: best.model,
      route: best.route,
      score: best.score,
      reasoning: best.description,
      allMatches: results.filter(r => r.score > 0)
    };
  }
  
  // Cache the result
  cache.set(message, {
    model: result.model,
    route: result.route,
    score: result.score,
    reasoning: result.reasoning
  });
  
  // Record usage statistics
  stats.record(result.model, result.route);
  
  return result;
}

/**
 * Get cache statistics
 */
function getCacheStats() {
  return cache.getStats();
}

/**
 * Get usage statistics
 */
function getUsageStats() {
  return stats.getSummary();
}

/**
 * Clear cache
 */
function clearCache() {
  cache.clear();
}

/**
 * Main function
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node router.mjs "user message"');
    console.error('       node router.mjs --stats     - Show statistics');
    console.error('       node router.mjs --cache     - Show cache stats');
    console.error('       node router.mjs --clear     - Clear cache');
    process.exit(1);
  }
  
  // Handle special commands
  if (args[0] === '--stats') {
    const summary = stats.getSummary();
    console.log('📊 使用统计\n');
    console.log(`今日：${summary.today.total}/${summary.today.limit}`);
    console.log(`本月：${summary.month.total}/${summary.month.limit} (${summary.month.usedPercent})`);
    console.log(`预计：${summary.month.projected} 次 ${summary.month.willExceed ? '⚠️ 将超额' : '✅ 在限额内'}`);
    console.log(`成本：¥${summary.month.cost}`);
    
    if (summary.alerts.length > 0) {
      console.log('\n⚠️ 告警:');
      summary.alerts.forEach(a => console.log(`  ${a.message}`));
    }
    process.exit(0);
  }
  
  if (args[0] === '--cache') {
    const cacheStats = cache.getStats();
    console.log('💾 缓存统计\n');
    console.log(JSON.stringify(cacheStats, null, 2));
    process.exit(0);
  }
  
  if (args[0] === '--clear') {
    cache.clear();
    console.log('✅ 缓存已清空');
    process.exit(0);
  }
  
  // Normal routing
  const message = args.join(' ');
  const result = selectModel(message);
  
  console.log(JSON.stringify(result, null, 2));
}

// Export for programmatic use
export { selectModel, calculateScore, config, getCacheStats, getUsageStats, clearCache };

// Run if called directly
if (process.argv[1] && process.argv[1].includes('router.mjs')) {
  main();
}
