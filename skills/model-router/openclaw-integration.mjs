#!/usr/bin/env node

/**
 * OpenClaw Model Router Integration
 * 
 * Automatically selects the best model for each request.
 * Called by OpenClaw before spawning agents or making API calls.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load router
const routerPath = join(__dirname, 'router.mjs');
const configPath = join(__dirname, 'config/routes.json');

// Simple router implementation (inline for performance)
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

function calculateScore(message, route) {
  let score = 0;
  const lowerMessage = message.toLowerCase();
  const triggers = route.triggers || {};
  
  if (triggers.keywords) {
    for (const keyword of triggers.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        score += 10;
      }
    }
  }
  
  if (triggers.patterns) {
    for (const pattern of triggers.patterns) {
      try {
        const regex = new RegExp(pattern);
        if (regex.test(message)) {
          score += 20;
        }
      } catch (e) {}
    }
  }
  
  if (triggers.complexityIndicators) {
    for (const indicator of triggers.complexityIndicators) {
      try {
        const regex = new RegExp(indicator);
        if (regex.test(message)) {
          score += 15;
        }
      } catch (e) {}
    }
  }
  
  if (triggers.minLength && message.length < triggers.minLength) score -= 30;
  if (triggers.maxLength && message.length > triggers.maxLength) score -= 30;
  
  const priorityBonus = { 'high': 10, 'medium': 5, 'low': 0 };
  score += priorityBonus[route.priority] || 0;
  
  return score;
}

export function selectModel(message) {
  const results = [];
  
  for (const route of config.routes) {
    const score = calculateScore(message, route);
    results.push({
      route: route.name,
      model: score > 0 ? route.model : route.fallback,
      score: score
    });
  }
  
  results.sort((a, b) => b.score - a.score);
  
  const best = results[0];
  if (best.score < 10) {
    return {
      model: config.defaultModel,
      route: 'default',
      score: 0
    };
  }
  
  return {
    model: best.model,
    route: best.route,
    score: best.score
  };
}

// CLI mode
if (process.argv.length > 2) {
  const message = process.argv.slice(2).join(' ');
  const result = selectModel(message);
  console.log(JSON.stringify(result, null, 2));
}
