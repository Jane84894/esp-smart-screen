#!/usr/bin/env node

/**
 * Context Manager for Model Router
 * 
 * Maintains conversation context to improve routing accuracy.
 * Based on context engineering best practices (2026).
 * 
 * Features:
 * - Track conversation topic
 * - Detect context switches
 * - Maintain topic coherence
 * - Context-aware routing
 */

import { createHash } from 'crypto';

class ContextManager {
  constructor(options = {}) {
    this.maxContextLength = options.maxContextLength || 10;
    this.contextWindow = options.contextWindow || 5;
    this.topicThreshold = options.topicThreshold || 0.7;
    this.context = [];
    this.currentTopic = null;
    this.topicHistory = [];
  }
  
  /**
   * Add message to context
   */
  addMessage(message, role = 'user', route = null) {
    const entry = {
      message,
      role,
      route,
      timestamp: Date.now(),
      topic: this.currentTopic
    };
    
    this.context.push(entry);
    
    // Limit context length
    if (this.context.length > this.maxContextLength) {
      this.context.shift();
    }
    
    // Update topic
    if (role === 'user' && route) {
      this.updateTopic(route);
    }
    
    return entry;
  }
  
  /**
   * Update current topic based on route
   */
  updateTopic(newRoute) {
    // If same as current, reinforce
    if (this.currentTopic === newRoute) {
      return;
    }
    
    // Check if we should switch topic
    const recentRoutes = this.context
      .slice(-this.contextWindow)
      .filter(e => e.route)
      .map(e => e.route);
    
    const routeCount = {};
    recentRoutes.forEach(r => {
      routeCount[r] = (routeCount[r] || 0) + 1;
    });
    
    // Find dominant route
    let dominantRoute = null;
    let maxCount = 0;
    for (const [route, count] of Object.entries(routeCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantRoute = route;
      }
    }
    
    // Switch if dominant route is different and has enough weight
    if (dominantRoute && dominantRoute !== this.currentTopic) {
      if (this.currentTopic) {
        // Save topic change
        this.topicHistory.push({
          from: this.currentTopic,
          to: dominantRoute,
          timestamp: Date.now()
        });
      }
      this.currentTopic = dominantRoute;
    }
  }
  
  /**
   * Get recent context for routing decision
   */
  getRecentContext(count = 5) {
    return this.context.slice(-count);
  }
  
  /**
   * Check if message is likely a follow-up
   */
  isFollowUp(message) {
    // Short messages are often follow-ups
    if (message.length < 20) {
      return true;
    }
    
    // Check for pronouns and references
    const followUpIndicators = [
      '这个', '那个', '它', '他', '她',
      'this', 'that', 'it', 'he', 'she',
      '继续', '然后', '接着',
      'continue', 'then', 'next',
      '为什么', '怎么', '如何',
      'why', 'how', 'what about'
    ];
    
    const lower = message.toLowerCase();
    return followUpIndicators.some(indicator => lower.includes(indicator));
  }
  
  /**
   * Get suggested route based on context
   */
  getSuggestedRoute(message) {
    // If no context, no suggestion
    if (this.context.length === 0) {
      return null;
    }
    
    // If it's a follow-up, suggest current topic
    if (this.isFollowUp(message) && this.currentTopic) {
      return {
        route: this.currentTopic,
        confidence: 'medium',
        reason: 'follow-up'
      };
    }
    
    // Analyze recent context for patterns
    const recent = this.getRecentContext(this.contextWindow);
    const routes = recent.filter(e => e.route).map(e => e.route);
    
    if (routes.length === 0) {
      return null;
    }
    
    // Find most recent route
    const lastRoute = routes[routes.length - 1];
    
    // Check if topic is consistent
    const allSame = routes.every(r => r === lastRoute);
    
    if (allSame && routes.length >= 3) {
      return {
        route: lastRoute,
        confidence: 'high',
        reason: 'consistent_topic'
      };
    }
    
    return {
      route: lastRoute,
      confidence: 'low',
      reason: 'recent_context'
    };
  }
  
  /**
   * Get context statistics
   */
  getStats() {
    const routeCount = {};
    this.context.forEach(e => {
      if (e.route) {
        routeCount[e.route] = (routeCount[e.route] || 0) + 1;
      }
    });
    
    return {
      contextLength: this.context.length,
      currentTopic: this.currentTopic,
      topicChanges: this.topicHistory.length,
      recentRoutes: routeCount,
      isFollowUpLikely: this.context.length > 0 && this.isFollowUp('')
    };
  }
  
  /**
   * Clear context
   */
  clear() {
    this.context = [];
    this.currentTopic = null;
    this.topicHistory = [];
  }
}

/**
 * Context-aware routing enhancement
 */
class ContextAwareRouter {
  constructor(baseRouter, contextManager = null) {
    this.baseRouter = baseRouter;
    this.context = contextManager || new ContextManager();
  }
  
  /**
   * Route with context awareness
   */
  route(message) {
    // Get base routing result
    const baseResult = this.baseRouter.selectModel(message);
    
    // Get context suggestion
    const contextSuggestion = this.context.getSuggestedRoute(message);
    
    // Decide whether to override based on context
    if (contextSuggestion && contextSuggestion.confidence === 'high') {
      // Strong context signal - consider overriding
      if (baseResult.score < 30 && contextSuggestion.route !== baseResult.route) {
        // Weak base match + strong context = use context
        console.error(`[ContextRouter] Overriding ${baseResult.route} → ${contextSuggestion.route} (context: ${contextSuggestion.reason})`);
        
        const result = {
          ...baseResult,
          route: contextSuggestion.route,
          model: this.baseRouter.getModelForRoute(contextSuggestion.route),
          contextOverride: true,
          contextReason: contextSuggestion.reason
        };
        
        this.context.addMessage(message, 'user', result.route);
        return result;
      }
    }
    
    // Use base result
    this.context.addMessage(message, 'user', baseResult.route);
    return baseResult;
  }
  
  /**
   * Record assistant response
   */
  recordResponse(message, route) {
    this.context.addMessage(message, 'assistant', route);
  }
  
  getStats() {
    return {
      base: this.baseRouter.getStats?.() || {},
      context: this.context.getStats()
    };
  }
}

// Export for programmatic use
export { ContextManager, ContextAwareRouter };

// CLI interface
if (process.argv[1] && process.argv[1].includes('context.mjs')) {
  const context = new ContextManager();
  
  const args = process.argv.slice(2);
  
  if (args[0] === 'test') {
    // Simulate conversation
    context.addMessage('帮我写个 Python 函数', 'user', 'coding');
    context.addMessage('好的，这是一个示例...', 'assistant', 'coding');
    context.addMessage('怎么添加错误处理？', 'user', null);
    
    const suggestion = context.getSuggestedRoute('怎么添加错误处理？');
    console.log('Context suggestion:', suggestion);
    console.log('Context stats:', context.getStats());
    
  } else if (args[0] === 'stats') {
    console.log('Context statistics:');
    console.log(JSON.stringify(context.getStats(), null, 2));
    
  } else if (args[0] === 'clear') {
    context.clear();
    console.log('Context cleared');
    
  } else {
    console.log('Usage:');
    console.log('  node context.mjs test   - Test context awareness');
    console.log('  node context.mjs stats  - Show statistics');
    console.log('  node context.mjs clear  - Clear context');
  }
}
