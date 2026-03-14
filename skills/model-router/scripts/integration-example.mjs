#!/usr/bin/env node

/**
 * Model Router - OpenClaw Integration Example
 * 
 * This script demonstrates how to use the router with OpenClaw's sessions_spawn
 * 
 * Usage:
 *   node integration-example.mjs "user message"
 */

import { selectModel } from './router.mjs';

/**
 * Simulate OpenClaw sessions_spawn
 * In real usage, this would call the actual OpenClaw API
 */
async function spawnSubAgent(model, task) {
  console.log(`\n🤖 Spawning sub-agent with model: ${model}`);
  console.log(`📝 Task: ${task}`);
  console.log(`⏳ Waiting for result...`);
  
  // Simulate sub-agent execution
  // In real usage: await sessions_spawn({ model, task, runtime: "subagent" })
  
  return {
    model: model,
    task: task,
    status: "completed",
    result: `[${model}] 处理完成：${task}`
  };
}

/**
 * Main routing function
 */
async function routeAndExecute(message) {
  console.log(`\n🎯 收到消息：${message}\n`);
  
  // Step 1: Select model
  const route = selectModel(message);
  
  console.log(`📊 路由决策:`);
  console.log(`   选用模型：${route.model}`);
  console.log(`   路由类型：${route.route}`);
  console.log(`   匹配分数：${route.score}`);
  console.log(`   推理说明：${route.reasoning}`);
  
  if (route.allMatches && route.allMatches.length > 1) {
    console.log(`\n   其他匹配:`);
    route.allMatches.slice(1, 4).forEach(m => {
      console.log(`   - ${m.route}: ${m.model} (分数：${m.score})`);
    });
  }
  
  // Step 2: Execute with selected model
  const result = await spawnSubAgent(route.model, message);
  
  console.log(`\n✅ 完成:`);
  console.log(`   ${result.result}`);
  
  return result;
}

/**
 * Batch processing example
 */
async function processBatch(messages) {
  console.log(`\n📦 批量处理 ${messages.length} 条消息\n`);
  console.log(`=${'='.repeat(60)}`);
  
  const results = [];
  for (const msg of messages) {
    const result = await routeAndExecute(msg);
    results.push(result);
    console.log(`\n${'='.repeat(60)}\n`);
  }
  
  // Summary
  const modelStats = {};
  results.forEach(r => {
    modelStats[r.model] = (modelStats[r.model] || 0) + 1;
  });
  
  console.log(`📊 模型使用统计:`);
  Object.entries(modelStats).forEach(([model, count]) => {
    console.log(`   ${model}: ${count} 次`);
  });
  
  return results;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // Demo mode with sample messages
  console.log(`🎭 演示模式 - 使用示例消息\n`);
  
  const demoMessages = [
    "你好啊",
    "帮我写个 Python 函数计算斐波那契数列",
    "分析一下人工智能对未来就业市场的影响",
    "打开客厅的灯",
    "帮我写一篇关于气候变化的文章"
  ];
  
  await processBatch(demoMessages);
  
} else {
  // Single message mode
  const message = args.join(' ');
  await routeAndExecute(message);
}
