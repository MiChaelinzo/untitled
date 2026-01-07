import { Difficulty } from './game-types'

export interface PerformanceMetrics {
  reactionTimes: number[]
  accuracy: number
  missStreak: number
  hitStreak: number
  averageReactionTime: number
  consistencyScore: number
  targetsAttempted: number
  timeInCurrentDifficulty: number
}

export interface AdaptiveDifficultyConfig {
  targetDuration: number
  targetSize: number
  spawnDelay: number
  scoreMultiplier: number
  aiAdjustmentLevel: number
}

export interface DifficultyAdjustment {
  shouldAdjust: boolean
  direction: 'easier' | 'harder' | 'maintain'
  reason: string
  confidence: number
  newConfig?: AdaptiveDifficultyConfig
}

export class AdaptiveDifficultySystem {
  private metrics: PerformanceMetrics
  private baseConfig: AdaptiveDifficultyConfig
  private currentConfig: AdaptiveDifficultyConfig
  private adjustmentHistory: DifficultyAdjustment[]
  private lastAdjustmentTime: number
  private targetAccuracy = 0.75
  private targetReactionTime = 1500
  private minAdjustmentInterval = 15000
  
  constructor(baseDifficulty: Difficulty) {
    this.metrics = {
      reactionTimes: [],
      accuracy: 1.0,
      missStreak: 0,
      hitStreak: 0,
      averageReactionTime: 0,
      consistencyScore: 1.0,
      targetsAttempted: 0,
      timeInCurrentDifficulty: 0
    }
    
    this.baseConfig = this.getDifficultyConfig(baseDifficulty)
    this.currentConfig = { ...this.baseConfig }
    this.adjustmentHistory = []
    this.lastAdjustmentTime = Date.now()
  }
  
  private getDifficultyConfig(difficulty: Difficulty): AdaptiveDifficultyConfig {
    const configs: Record<Difficulty, AdaptiveDifficultyConfig> = {
      easy: {
        targetDuration: 3500,
        targetSize: 95,
        spawnDelay: 800,
        scoreMultiplier: 1.0,
        aiAdjustmentLevel: 0.3
      },
      medium: {
        targetDuration: 2500,
        targetSize: 75,
        spawnDelay: 600,
        scoreMultiplier: 1.5,
        aiAdjustmentLevel: 0.5
      },
      hard: {
        targetDuration: 1750,
        targetSize: 65,
        spawnDelay: 400,
        scoreMultiplier: 2.0,
        aiAdjustmentLevel: 0.7
      },
      insane: {
        targetDuration: 1200,
        targetSize: 50,
        spawnDelay: 300,
        scoreMultiplier: 3.0,
        aiAdjustmentLevel: 0.9
      }
    }
    
    return configs[difficulty]
  }
  
  recordHit(reactionTime: number): void {
    this.metrics.reactionTimes.push(reactionTime)
    this.metrics.targetsAttempted++
    this.metrics.hitStreak++
    this.metrics.missStreak = 0
    
    this.updateMetrics()
  }
  
  recordMiss(): void {
    this.metrics.targetsAttempted++
    this.metrics.missStreak++
    this.metrics.hitStreak = 0
    
    this.updateMetrics()
  }
  
  private updateMetrics(): void {
    if (this.metrics.reactionTimes.length > 0) {
      const sum = this.metrics.reactionTimes.reduce((a, b) => a + b, 0)
      this.metrics.averageReactionTime = sum / this.metrics.reactionTimes.length
      
      const variance = this.metrics.reactionTimes.reduce((acc, time) => {
        return acc + Math.pow(time - this.metrics.averageReactionTime, 2)
      }, 0) / this.metrics.reactionTimes.length
      
      const stdDev = Math.sqrt(variance)
      this.metrics.consistencyScore = Math.max(0, 1 - (stdDev / this.metrics.averageReactionTime))
    }
    
    const hitsCount = this.metrics.reactionTimes.length
    this.metrics.accuracy = this.metrics.targetsAttempted > 0 
      ? hitsCount / this.metrics.targetsAttempted 
      : 1.0
  }
  
  async analyzePerformance(): Promise<DifficultyAdjustment> {
    const now = Date.now()
    const timeSinceLastAdjustment = now - this.lastAdjustmentTime
    
    if (timeSinceLastAdjustment < this.minAdjustmentInterval || this.metrics.targetsAttempted < 5) {
      return {
        shouldAdjust: false,
        direction: 'maintain',
        reason: 'Insufficient data or too soon for adjustment',
        confidence: 0
      }
    }
    
    const promptText = `You are an AI game difficulty analyst. Analyze the following player performance metrics and determine if the game difficulty should be adjusted.

Player Performance Metrics:
- Average Reaction Time: ${this.metrics.averageReactionTime.toFixed(0)}ms
- Accuracy: ${(this.metrics.accuracy * 100).toFixed(1)}%
- Current Hit Streak: ${this.metrics.hitStreak}
- Current Miss Streak: ${this.metrics.missStreak}
- Consistency Score: ${(this.metrics.consistencyScore * 100).toFixed(1)}%
- Targets Attempted: ${this.metrics.targetsAttempted}

Current Difficulty Settings:
- Target Duration: ${this.currentConfig.targetDuration}ms
- Target Size: ${this.currentConfig.targetSize}px
- Spawn Delay: ${this.currentConfig.spawnDelay}ms
- AI Adjustment Level: ${(this.currentConfig.aiAdjustmentLevel * 100).toFixed(0)}%

Target Performance Goals:
- Target Accuracy: ${(this.targetAccuracy * 100).toFixed(0)}%
- Target Reaction Time: ${this.targetReactionTime}ms

Analyze if the player is:
1. Performing too well (consistently above target metrics) - suggest making it HARDER
2. Struggling (consistently below target metrics) - suggest making it EASIER
3. Performing at optimal challenge level - suggest MAINTAIN

Consider:
- A hit streak of 8+ suggests the game is too easy
- A miss streak of 3+ suggests the game is too hard
- Accuracy significantly above 85% suggests too easy
- Accuracy below 60% suggests too hard
- Very fast reaction times (<800ms avg) suggest too easy
- Very slow reaction times (>2500ms avg) suggest too hard

Return a JSON object with this exact structure:
{
  "adjustment": {
    "shouldAdjust": boolean,
    "direction": "easier" | "harder" | "maintain",
    "reason": "brief explanation of why this adjustment is recommended",
    "confidence": number between 0 and 1,
    "targetDurationChange": number (negative to decrease, positive to increase, in ms),
    "targetSizeChange": number (negative to decrease, positive to increase, in px),
    "spawnDelayChange": number (negative to decrease, positive to increase, in ms)
  }
}`
    
    try {
      const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
      const parsed = JSON.parse(response)
      const adjustment = parsed.adjustment
      
      if (adjustment.shouldAdjust && adjustment.direction !== 'maintain') {
        const scaleFactor = this.currentConfig.aiAdjustmentLevel * 0.5
        
        const newConfig: AdaptiveDifficultyConfig = {
          targetDuration: Math.max(800, Math.min(5000, 
            this.currentConfig.targetDuration + (adjustment.targetDurationChange * scaleFactor)
          )),
          targetSize: Math.max(40, Math.min(120, 
            this.currentConfig.targetSize + (adjustment.targetSizeChange * scaleFactor)
          )),
          spawnDelay: Math.max(200, Math.min(1200, 
            this.currentConfig.spawnDelay + (adjustment.spawnDelayChange * scaleFactor)
          )),
          scoreMultiplier: this.currentConfig.scoreMultiplier,
          aiAdjustmentLevel: this.currentConfig.aiAdjustmentLevel
        }
        
        this.currentConfig = newConfig
        this.lastAdjustmentTime = now
        
        const result: DifficultyAdjustment = {
          shouldAdjust: true,
          direction: adjustment.direction,
          reason: adjustment.reason,
          confidence: adjustment.confidence,
          newConfig
        }
        
        this.adjustmentHistory.push(result)
        return result
      }
      
      return {
        shouldAdjust: false,
        direction: adjustment.direction,
        reason: adjustment.reason,
        confidence: adjustment.confidence
      }
      
    } catch (error) {
      console.error('Error analyzing performance with AI:', error)
      return this.fallbackAnalysis()
    }
  }
  
  private fallbackAnalysis(): DifficultyAdjustment {
    let direction: 'easier' | 'harder' | 'maintain' = 'maintain'
    let reason = ''
    let shouldAdjust = false
    let confidence = 0.7
    
    if (this.metrics.missStreak >= 3) {
      direction = 'easier'
      reason = 'Player struggling with consecutive misses'
      shouldAdjust = true
    } else if (this.metrics.hitStreak >= 10 && this.metrics.accuracy > 0.85) {
      direction = 'harder'
      reason = 'Player performing exceptionally well'
      shouldAdjust = true
    } else if (this.metrics.accuracy < 0.6 && this.metrics.targetsAttempted >= 8) {
      direction = 'easier'
      reason = 'Accuracy below target threshold'
      shouldAdjust = true
    } else if (this.metrics.accuracy > 0.9 && this.metrics.averageReactionTime < 1000) {
      direction = 'harder'
      reason = 'Excellent accuracy and reaction time'
      shouldAdjust = true
    }
    
    if (shouldAdjust) {
      const modifier = direction === 'easier' ? 1.15 : 0.85
      const newConfig: AdaptiveDifficultyConfig = {
        targetDuration: Math.max(800, Math.min(5000, this.currentConfig.targetDuration * modifier)),
        targetSize: Math.max(40, Math.min(120, this.currentConfig.targetSize * modifier)),
        spawnDelay: Math.max(200, Math.min(1200, this.currentConfig.spawnDelay * modifier)),
        scoreMultiplier: this.currentConfig.scoreMultiplier,
        aiAdjustmentLevel: this.currentConfig.aiAdjustmentLevel
      }
      
      this.currentConfig = newConfig
      this.lastAdjustmentTime = Date.now()
      
      const result: DifficultyAdjustment = {
        shouldAdjust: true,
        direction,
        reason,
        confidence,
        newConfig
      }
      
      this.adjustmentHistory.push(result)
      return result
    }
    
    return {
      shouldAdjust: false,
      direction: 'maintain',
      reason: 'Performance within optimal range',
      confidence
    }
  }
  
  getCurrentConfig(): AdaptiveDifficultyConfig {
    return { ...this.currentConfig }
  }
  
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }
  
  getAdjustmentHistory(): DifficultyAdjustment[] {
    return [...this.adjustmentHistory]
  }
  
  reset(): void {
    this.metrics = {
      reactionTimes: [],
      accuracy: 1.0,
      missStreak: 0,
      hitStreak: 0,
      averageReactionTime: 0,
      consistencyScore: 1.0,
      targetsAttempted: 0,
      timeInCurrentDifficulty: 0
    }
    this.currentConfig = { ...this.baseConfig }
    this.adjustmentHistory = []
    this.lastAdjustmentTime = Date.now()
  }
}
