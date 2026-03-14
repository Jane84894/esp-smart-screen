#!/usr/bin/env node

/**
 * Cost Monitor for Model Router
 * 
 * Tracks:
 * - Daily/monthly usage
 * - Per-model breakdown
 * - Cost estimation
 * - Usage prediction
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const STATS_FILE = join(__dirname, '../data/stats.json');

// Cost per request (estimated based on 1.8 万次/月 = ¥40)
const COST_PER_REQUEST = {
  'glm-4.7': 0.001,           // 最便宜
  'qwen3.5-plus': 0.0022,     // 默认
  'qwen3-coder-plus': 0.003,  // 编程专用
  'qwen3-max-2026-01-23': 0.005,  // 最贵
  'MiniMax-M2.5': 0.0035      // 长文本
};

class CostMonitor {
  constructor(options = {}) {
    this.monthlyLimit = options.monthlyLimit || 18000;
    this.dailyLimit = options.dailyLimit || 1000;
    this.stats = this.load();
  }
  
  /**
   * Record a model usage
   */
  record(model, route = null) {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const monthKey = now.toISOString().slice(0, 7); // YYYY-MM
    
    // Initialize if needed
    if (!this.stats.days[dateKey]) {
      this.stats.days[dateKey] = {
        total: 0,
        byModel: {},
        byRoute: {}
      };
    }
    
    if (!this.stats.months[monthKey]) {
      this.stats.months[monthKey] = {
        total: 0,
        byModel: {},
        byRoute: {},
        cost: 0
      };
    }
    
    // Update daily stats
    this.stats.days[dateKey].total++;
    this.stats.days[dateKey].byModel[model] = (this.stats.days[dateKey].byModel[model] || 0) + 1;
    if (route) {
      this.stats.days[dateKey].byRoute[route] = (this.stats.days[dateKey].byRoute[route] || 0) + 1;
    }
    
    // Update monthly stats
    this.stats.months[monthKey].total++;
    this.stats.months[monthKey].byModel[model] = (this.stats.months[monthKey].byModel[model] || 0) + 1;
    if (route) {
      this.stats.months[monthKey].byRoute[route] = (this.stats.months[monthKey].byRoute[route] || 0) + 1;
    }
    this.stats.months[monthKey].cost += COST_PER_REQUEST[model] || 0.0022;
    
    // Update totals
    this.stats.total++;
    this.lastSave = Date.now();
    
    // Auto-save every 10 requests
    if (this.total % 10 === 0) {
      this.save();
    }
  }
  
  /**
   * Get current usage summary
   */
  getSummary() {
    const now = new Date();
    const dateKey = now.toISOString().split('T')[0];
    const monthKey = now.toISOString().slice(0, 7);
    
    const today = this.stats.days[dateKey] || { total: 0 };
    const month = this.stats.months[monthKey] || { total: 0, cost: 0 };
    
    const remaining = this.monthlyLimit - month.total;
    const daysLeft = this.getDaysLeftInMonth();
    const dailyAvg = month.total / now.getDate();
    const projected = dailyAvg * this.getDaysInMonth();
    
    return {
      today: {
        total: today.total,
        limit: this.dailyLimit,
        remaining: this.dailyLimit - today.total
      },
      month: {
        total: month.total,
        limit: this.monthlyLimit,
        remaining: remaining,
        usedPercent: ((month.total / this.monthlyLimit) * 100).toFixed(1) + '%',
        cost: month.cost.toFixed(2),
        projected: Math.round(projected),
        willExceed: projected > this.monthlyLimit
      },
      byModel: month.byModel,
      byRoute: month.byRoute,
      alerts: this.generateAlerts(remaining, projected)
    };
  }
  
  /**
   * Generate alerts based on usage
   */
  generateAlerts(remaining, projected) {
    const alerts = [];
    
    if (remaining < this.monthlyLimit * 0.1) {
      alerts.push({
        level: 'critical',
        message: `⚠️ 仅剩 ${remaining} 次请求！本月额度即将用完`
      });
    } else if (remaining < this.monthlyLimit * 0.2) {
      alerts.push({
        level: 'warning',
        message: `⚡ 剩余 ${remaining} 次请求，建议节约使用`
      });
    }
    
    if (projected > this.monthlyLimit) {
      alerts.push({
        level: 'warning',
        message: `📈 预计本月使用 ${projected} 次，超出 ${(projected - this.monthlyLimit)} 次`
      });
    }
    
    return alerts;
  }
  
  /**
   * Get cost breakdown by model
   */
  getCostBreakdown() {
    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7);
    const month = this.stats.months[monthKey] || { byModel: {} };
    
    const breakdown = {};
    let totalCost = 0;
    
    for (const [model, count] of Object.entries(month.byModel)) {
      const cost = count * (COST_PER_REQUEST[model] || 0.0022);
      breakdown[model] = {
        count,
        cost: cost.toFixed(2),
        percent: ((count / month.total) * 100).toFixed(1) + '%'
      };
      totalCost += cost;
    }
    
    return {
      breakdown,
      total: totalCost.toFixed(2)
    };
  }
  
  /**
   * Get recommendations for cost optimization
   */
  getRecommendations() {
    const summary = this.getSummary();
    const recommendations = [];
    
    // Check if using too many expensive models
    const expensiveModels = ['qwen3-max-2026-01-23', 'MiniMax-M2.5'];
    const expensiveCount = expensiveModels.reduce((sum, model) => {
      return sum + (summary.byModel[model] || 0);
    }, 0);
    
    if (expensiveCount > summary.month.total * 0.3) {
      recommendations.push({
        type: 'cost_saving',
        message: '💡 建议使用更多 glm-4.7 处理简单任务，可节省 70% 成本',
        potentialSaving: '约 30%'
      });
    }
    
    // Check cache usage
    if (!summary.byRoute['cache']) {
      recommendations.push({
        type: 'optimization',
        message: '💡 启用缓存机制可节省 10-20% 重复请求',
        potentialSaving: '10-20%'
      });
    }
    
    return recommendations;
  }
  
  /**
   * Save stats to file
   */
  save() {
    try {
      const dataDir = join(__dirname, '../data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }
      
      writeFileSync(STATS_FILE, JSON.stringify(this.stats, null, 2));
    } catch (e) {
      console.error('Save error:', e.message);
    }
  }
  
  /**
   * Load stats from file
   */
  load() {
    const defaultStats = {
      total: 0,
      days: {},
      months: {},
      createdAt: Date.now()
    };
    
    try {
      if (existsSync(STATS_FILE)) {
        return JSON.parse(readFileSync(STATS_FILE, 'utf-8'));
      }
    } catch (e) {
      // Use default
    }
    
    return defaultStats;
  }
  
  /**
   * Utility: Get days in current month
   */
  getDaysInMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }
  
  /**
   * Utility: Get days left in current month
   */
  getDaysLeftInMonth() {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return lastDay - now.getDate();
  }
}

// Export for programmatic use
export { CostMonitor, COST_PER_REQUEST };

// CLI interface
if (process.argv[1] && process.argv[1].includes('stats.mjs')) {
  const monitor = new CostMonitor();
  
  const args = process.argv.slice(2);
  
  if (args[0] === 'summary') {
    const summary = monitor.getSummary();
    console.log('📊 使用统计摘要\n');
    console.log(`今日：${summary.today.total}/${summary.today.limit} (剩余：${summary.today.remaining})`);
    console.log(`本月：${summary.month.total}/${summary.monthlyLimit} (${summary.month.usedPercent})`);
    console.log(`预计：${summary.month.projected} 次 ${summary.month.willExceed ? '⚠️ 将超额' : '✅ 在限额内'}`);
    console.log(`成本：¥${summary.month.cost}`);
    
    if (summary.alerts.length > 0) {
      console.log('\n⚠️ 告警:');
      summary.alerts.forEach(a => console.log(`  ${a.message}`));
    }
    
    console.log('\n按模型分布:');
    Object.entries(summary.byModel).forEach(([model, count]) => {
      console.log(`  ${model}: ${count} 次`);
    });
    
  } else if (args[0] === 'cost') {
    const breakdown = monitor.getCostBreakdown();
    console.log('💰 成本分析\n');
    Object.entries(breakdown.breakdown).forEach(([model, data]) => {
      console.log(`${model}:`);
      console.log(`  次数：${data.count}`);
      console.log(`  成本：¥${data.cost}`);
      console.log(`  占比：${data.percent}`);
    });
    console.log(`\n总计：¥${breakdown.total}`);
    
  } else if (args[0] === 'recommend') {
    const recs = monitor.getRecommendations();
    console.log('💡 优化建议\n');
    if (recs.length === 0) {
      console.log('✅ 当前使用模式良好，无需优化');
    } else {
      recs.forEach((r, i) => {
        console.log(`${i + 1}. ${r.message}`);
        console.log(`   潜在节省：${r.potentialSaving}\n`);
      });
    }
    
  } else if (args[0] === 'reset') {
    monitor.stats = { total: 0, days: {}, months: {}, createdAt: Date.now() };
    monitor.save();
    console.log('✅ 统计已重置');
    
  } else {
    console.log('Usage:');
    console.log('  node stats.mjs summary   - Show usage summary');
    console.log('  node stats.mjs cost      - Show cost breakdown');
    console.log('  node stats.mjs recommend - Get optimization recommendations');
    console.log('  node stats.mjs reset     - Reset all statistics');
  }
}
