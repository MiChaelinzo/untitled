import { PlayerStats } from './achievements'
import { Difficulty } from './game-types'

export type ChallengeType = 'daily' | 'weekly'
export type ChallengeDifficulty = 'bronze' | 'silver' | 'gold' | 'platinum'

export interface Challenge {
  id: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  name: string
  description: string
  icon: string
  requirement: ChallengeRequirement
  reward: ChallengeReward
  expiresAt: number
  category: 'accuracy' | 'speed' | 'consistency' | 'endurance' | 'mastery'
}

export interface ChallengeRequirement {
  type: 'score' | 'targets' | 'combo' | 'perfect_rounds' | 'games' | 'difficulty_clear' | 'speed_clear' | 'accuracy_rate'
  target: number
  gameDifficulty?: Difficulty
  timeLimit?: number
}

export interface ChallengeReward {
  xp: number
  badge?: TimeLimitedBadge
  title?: string
}

export interface TimeLimitedBadge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  expiresAt: number
  glowColor: string
}

export interface ChallengeProgress {
  challengeId: string
  progress: number
  completed: boolean
  completedAt?: number
  claimedReward: boolean
}

export interface PlayerChallengeData {
  activeChallenges: Challenge[]
  progress: Record<string, ChallengeProgress>
  completedChallenges: string[]
  earnedBadges: TimeLimitedBadge[]
  lastDailyRefresh: number
  lastWeeklyRefresh: number
  currentXP: number
  level: number
  unlockedTitles: string[]
  activeTitle?: string
}

const CHALLENGE_TEMPLATES = {
  daily: {
    bronze: [
      {
        id: 'daily-quick-10',
        name: 'Quick Reflexes',
        description: 'Hit 10 targets in a single game',
        icon: '⚡',
        category: 'speed' as const,
        requirement: { type: 'targets' as const, target: 10 },
        reward: { xp: 50 }
      },
      {
        id: 'daily-score-5k',
        name: 'Point Starter',
        description: 'Score 5,000 points in a single game',
        icon: '🎯',
        category: 'accuracy' as const,
        requirement: { type: 'score' as const, target: 5000 },
        reward: { xp: 50 }
      },
      {
        id: 'daily-combo-5',
        name: 'Combo Rookie',
        description: 'Achieve a 5x combo',
        icon: '🔥',
        category: 'consistency' as const,
        requirement: { type: 'combo' as const, target: 5 },
        reward: { xp: 50 }
      }
    ],
    silver: [
      {
        id: 'daily-perfect',
        name: 'Flawless Execution',
        description: 'Complete one perfect round (no misses)',
        icon: '💎',
        category: 'accuracy' as const,
        requirement: { type: 'perfect_rounds' as const, target: 1 },
        reward: { xp: 100 }
      },
      {
        id: 'daily-score-15k',
        name: 'Point Climber',
        description: 'Score 15,000 points in a single game',
        icon: '🌟',
        category: 'accuracy' as const,
        requirement: { type: 'score' as const, target: 15000 },
        reward: { xp: 100 }
      },
      {
        id: 'daily-games-3',
        name: 'Triple Threat',
        description: 'Complete 3 games today',
        icon: '🎮',
        category: 'endurance' as const,
        requirement: { type: 'games' as const, target: 3 },
        reward: { xp: 100 }
      }
    ],
    gold: [
      {
        id: 'daily-hard-clear',
        name: 'Hard Mode Challenge',
        description: 'Complete a game on Hard difficulty',
        icon: '⚔️',
        category: 'mastery' as const,
        requirement: { type: 'difficulty_clear' as const, target: 1, gameDifficulty: 'hard' },
        reward: { 
          xp: 200,
          badge: {
            id: 'hard-warrior',
            name: 'Hard Warrior',
            description: 'Conquered Hard Mode',
            icon: '⚔️',
            rarity: 'rare' as const,
            glowColor: '#FFD700'
          }
        }
      },
      {
        id: 'daily-combo-12',
        name: 'Combo Expert',
        description: 'Achieve a 12x combo',
        icon: '⚡',
        category: 'consistency' as const,
        requirement: { type: 'combo' as const, target: 12 },
        reward: { xp: 200 }
      }
    ],
    platinum: [
      {
        id: 'daily-score-30k',
        name: 'Elite Scorer',
        description: 'Score 30,000 points in a single game',
        icon: '👑',
        category: 'accuracy' as const,
        requirement: { type: 'score' as const, target: 30000 },
        reward: { 
          xp: 300,
          title: 'Daily Champion'
        }
      },
      {
        id: 'daily-insane-clear',
        name: 'Insanity Check',
        description: 'Complete a game on Insane difficulty',
        icon: '💀',
        category: 'mastery' as const,
        requirement: { type: 'difficulty_clear' as const, target: 1, gameDifficulty: 'insane' },
        reward: { 
          xp: 300,
          badge: {
            id: 'insane-conqueror',
            name: 'Insane Conqueror',
            description: 'Defeated Insane Mode',
            icon: '💀',
            rarity: 'epic' as const,
            glowColor: '#8B00FF'
          }
        }
      }
    ]
  },
  weekly: {
    bronze: [
      {
        id: 'weekly-targets-100',
        name: 'Target Practice',
        description: 'Hit 100 targets this week',
        icon: '🎯',
        category: 'consistency' as const,
        requirement: { type: 'targets' as const, target: 100 },
        reward: { xp: 200 }
      },
      {
        id: 'weekly-games-10',
        name: 'Dedicated Player',
        description: 'Play 10 games this week',
        icon: '🕹️',
        category: 'endurance' as const,
        requirement: { type: 'games' as const, target: 10 },
        reward: { xp: 200 }
      }
    ],
    silver: [
      {
        id: 'weekly-score-100k',
        name: 'Century Scorer',
        description: 'Accumulate 100,000 points this week',
        icon: '💯',
        category: 'accuracy' as const,
        requirement: { type: 'score' as const, target: 100000 },
        reward: { 
          xp: 400,
          badge: {
            id: 'weekly-warrior',
            name: 'Weekly Warrior',
            description: 'Dominated the weekly challenge',
            icon: '🛡️',
            rarity: 'rare' as const,
            glowColor: '#C0C0C0'
          }
        }
      },
      {
        id: 'weekly-perfect-3',
        name: 'Consistency King',
        description: 'Complete 3 perfect rounds this week',
        icon: '👑',
        category: 'accuracy' as const,
        requirement: { type: 'perfect_rounds' as const, target: 3 },
        reward: { xp: 400 }
      }
    ],
    gold: [
      {
        id: 'weekly-hard-5',
        name: 'Hard Mode Veteran',
        description: 'Complete 5 games on Hard difficulty this week',
        icon: '🏅',
        category: 'mastery' as const,
        requirement: { type: 'difficulty_clear' as const, target: 5, gameDifficulty: 'hard' },
        reward: { 
          xp: 600,
          badge: {
            id: 'weekly-champion',
            name: 'Weekly Champion',
            description: 'A week of excellence',
            icon: '🏆',
            rarity: 'epic' as const,
            glowColor: '#FFD700'
          },
          title: 'Weekly Elite'
        }
      },
      {
        id: 'weekly-combo-15',
        name: 'Combo Legend',
        description: 'Achieve a 15x combo this week',
        icon: '⚡',
        category: 'consistency' as const,
        requirement: { type: 'combo' as const, target: 15 },
        reward: { xp: 600 }
      }
    ],
    platinum: [
      {
        id: 'weekly-insane-3',
        name: 'Insane Week',
        description: 'Complete 3 games on Insane difficulty this week',
        icon: '💀',
        category: 'mastery' as const,
        requirement: { type: 'difficulty_clear' as const, target: 3, gameDifficulty: 'insane' },
        reward: { 
          xp: 1000,
          badge: {
            id: 'legendary-champion',
            name: 'Legendary Champion',
            description: 'Mastered the impossible',
            icon: '🌟',
            rarity: 'legendary' as const,
            glowColor: '#FF00FF'
          },
          title: 'Legendary'
        }
      },
      {
        id: 'weekly-accuracy-95',
        name: 'Precision Master',
        description: 'Maintain 95% accuracy over 5 games this week',
        icon: '🎯',
        category: 'accuracy' as const,
        requirement: { type: 'accuracy_rate' as const, target: 95 },
        reward: { 
          xp: 1000,
          title: 'Precision Master'
        }
      }
    ]
  }
}

function getNextDailyReset(): number {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.getTime()
}

function getNextWeeklyReset(): number {
  const now = new Date()
  const nextMonday = new Date(now)
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7
  nextMonday.setDate(nextMonday.getDate() + daysUntilMonday)
  nextMonday.setHours(0, 0, 0, 0)
  return nextMonday.getTime()
}

export function generateDailyChallenges(): Challenge[] {
  const challenges: Challenge[] = []
  const expiresAt = getNextDailyReset()
  
  const bronzeTemplate = CHALLENGE_TEMPLATES.daily.bronze[Math.floor(Math.random() * CHALLENGE_TEMPLATES.daily.bronze.length)]
  const silverTemplate = CHALLENGE_TEMPLATES.daily.silver[Math.floor(Math.random() * CHALLENGE_TEMPLATES.daily.silver.length)]
  const goldTemplate = CHALLENGE_TEMPLATES.daily.gold[Math.floor(Math.random() * CHALLENGE_TEMPLATES.daily.gold.length)]
  
  const templates = [
    { template: bronzeTemplate, difficulty: 'bronze' as ChallengeDifficulty },
    { template: silverTemplate, difficulty: 'silver' as ChallengeDifficulty },
    { template: goldTemplate, difficulty: 'gold' as ChallengeDifficulty }
  ]
  
  for (const { template, difficulty } of templates) {
    const reward = template.reward as any
    const challenge: Challenge = {
      id: `${template.id}-${Date.now()}`,
      type: 'daily',
      difficulty,
      name: template.name,
      description: template.description,
      icon: template.icon,
      category: template.category,
      requirement: template.requirement as ChallengeRequirement,
      expiresAt,
      reward: {
        xp: reward.xp,
        badge: reward.badge ? {
          ...reward.badge,
          id: `${reward.badge.id}-${Date.now()}`,
          expiresAt: expiresAt + (7 * 24 * 60 * 60 * 1000)
        } : undefined,
        title: reward.title
      }
    }
    challenges.push(challenge)
  }
  
  return challenges
}

export function generateWeeklyChallenges(): Challenge[] {
  const challenges: Challenge[] = []
  const expiresAt = getNextWeeklyReset()
  
  const bronzeTemplate = CHALLENGE_TEMPLATES.weekly.bronze[Math.floor(Math.random() * CHALLENGE_TEMPLATES.weekly.bronze.length)]
  const silverTemplate = CHALLENGE_TEMPLATES.weekly.silver[Math.floor(Math.random() * CHALLENGE_TEMPLATES.weekly.silver.length)]
  const goldTemplate = CHALLENGE_TEMPLATES.weekly.gold[Math.floor(Math.random() * CHALLENGE_TEMPLATES.weekly.gold.length)]
  
  const templates = [
    { template: bronzeTemplate, difficulty: 'bronze' as ChallengeDifficulty },
    { template: silverTemplate, difficulty: 'silver' as ChallengeDifficulty },
    { template: goldTemplate, difficulty: 'gold' as ChallengeDifficulty }
  ]
  
  for (const { template, difficulty } of templates) {
    const reward = template.reward as any
    const challenge: Challenge = {
      id: `${template.id}-${Date.now()}`,
      type: 'weekly',
      difficulty,
      name: template.name,
      description: template.description,
      icon: template.icon,
      category: template.category,
      requirement: template.requirement as ChallengeRequirement,
      expiresAt,
      reward: {
        xp: reward.xp,
        badge: reward.badge ? {
          ...reward.badge,
          id: `${reward.badge.id}-${Date.now()}`,
          expiresAt: expiresAt + (14 * 24 * 60 * 60 * 1000)
        } : undefined,
        title: reward.title
      }
    }
    challenges.push(challenge)
  }
  
  return challenges
}

export function checkChallengeProgress(
  challenge: Challenge,
  currentProgress: number,
  gameData?: {
    score: number
    targetsHit: number
    targetsMissed: number
    combo: number
    difficulty: Difficulty
    perfectRounds: number
  }
): number {
  if (!gameData) return currentProgress

  const { requirement } = challenge
  let newProgress = currentProgress

  switch (requirement.type) {
    case 'score':
      if (gameData.score >= requirement.target) {
        newProgress = Math.max(newProgress, requirement.target)
      }
      break
    
    case 'targets':
      newProgress += gameData.targetsHit
      break
    
    case 'combo':
      if (gameData.combo >= requirement.target) {
        newProgress = Math.max(newProgress, requirement.target)
      }
      break
    
    case 'perfect_rounds':
      newProgress += gameData.perfectRounds
      break
    
    case 'games':
      newProgress += 1
      break
    
    case 'difficulty_clear':
      if (requirement.gameDifficulty && gameData.difficulty === requirement.gameDifficulty) {
        newProgress += 1
      }
      break
    
    case 'accuracy_rate':
      const total = gameData.targetsHit + gameData.targetsMissed
      if (total > 0) {
        const accuracy = (gameData.targetsHit / total) * 100
        if (accuracy >= requirement.target) {
          newProgress += 1
        }
      }
      break
  }

  return newProgress
}

export function isChallengeComplete(challenge: Challenge, progress: number): boolean {
  return progress >= challenge.requirement.target
}

export function shouldRefreshChallenges(data: PlayerChallengeData): {
  refreshDaily: boolean
  refreshWeekly: boolean
} {
  const now = Date.now()
  return {
    refreshDaily: now >= data.lastDailyRefresh + (24 * 60 * 60 * 1000),
    refreshWeekly: now >= data.lastWeeklyRefresh + (7 * 24 * 60 * 60 * 1000)
  }
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function getXPForNextLevel(currentLevel: number): number {
  return (currentLevel ** 2) * 100
}

export function removeExpiredBadges(badges: TimeLimitedBadge[]): TimeLimitedBadge[] {
  const now = Date.now()
  return badges.filter(badge => badge.expiresAt > now)
}
