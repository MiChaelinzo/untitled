import { PlayerStats } from './achievements'
import { ThemeUnlockable, UnlockRequirement } from './theme-rewards'

export type SeasonalEventType = 
  | 'winter-holiday'
  | 'lunar-new-year'
  | 'valentines'
  | 'spring-festival'
  | 'summer-games'
  | 'halloween'
  | 'anniversary'
  | 'championship'
  | 'black-friday'
  | 'esports-worlds'

export interface SeasonalEvent {
  id: string
  type: SeasonalEventType
  name: string
  description: string
  icon: string
  theme: EventTheme
  startDate: number
  endDate: number
  isActive: boolean
  challenges: EventChallenge[]
  rewards: EventReward[]
  leaderboard?: EventLeaderboard
  specialModifier?: GameModifier
}

export interface EventTheme {
  primaryColor: string
  accentColor: string
  backgroundColor: string
  particleEffect: 'snow' | 'fireworks' | 'hearts' | 'leaves' | 'confetti' | 'sparkles' | 'flames' | 'stars'
  backgroundVariant?: string
  soundPack?: string
}

export interface EventChallenge {
  id: string
  eventId: string
  name: string
  description: string
  icon: string
  requirement: EventRequirement
  reward: EventReward
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  unlockRequirement?: string
}

export interface EventRequirement {
  type: 'score' | 'targets' | 'combo' | 'games' | 'streak' | 'perfect' | 'collection' | 'time-trial'
  target: number
  gameMode?: string
  timeLimit?: number
  specificConditions?: Record<string, any>
}

export interface EventReward {
  id: string
  name: string
  description: string
  icon: string
  type: 'theme' | 'background' | 'skin' | 'badge' | 'title' | 'avatar-frame' | 'emote' | 'spray' | 'trophy'
  rarity: 'limited' | 'exclusive' | 'legendary' | 'mythic'
  glowColor: string
  value?: string
  expiresAt?: number
  isPermanent: boolean
  isRecurring?: boolean
  seasonYear?: number
}

export interface EventLeaderboard {
  eventId: string
  topPlayers: EventLeaderboardEntry[]
  rewardTiers: LeaderboardRewardTier[]
}

export interface EventLeaderboardEntry {
  userId: string
  username: string
  score: number
  rank: number
  avatarUrl?: string
  title?: string
}

export interface LeaderboardRewardTier {
  minRank: number
  maxRank: number
  rewards: EventReward[]
  name: string
  icon: string
}

export interface GameModifier {
  id: string
  name: string
  description: string
  effects: {
    scoreMultiplier?: number
    speedMultiplier?: number
    targetSizeModifier?: number
    specialTargets?: string[]
    particleEffects?: string[]
  }
}

export interface PlayerEventProgress {
  eventId: string
  completedChallenges: string[]
  earnedRewards: string[]
  eventScore: number
  challengeProgress?: Record<string, number>
  leaderboardRank?: number
  lastUpdated: number
}

export const SEASONAL_EVENTS: SeasonalEvent[] = [
  {
    id: 'test-event-2025',
    type: 'championship',
    name: '🎮 Test Championship',
    description: 'Test your skills and earn exclusive rewards!',
    icon: '⚡',
    theme: {
      primaryColor: 'oklch(0.65 0.24 240)',
      accentColor: 'oklch(0.75 0.18 195)',
      backgroundColor: 'oklch(0.15 0.02 240)',
      particleEffect: 'stars'
    },
    startDate: new Date('2025-01-01').getTime(),
    endDate: new Date('2025-12-31').getTime(),
    isActive: true,
    challenges: [
      {
        id: 'test-score-100',
        eventId: 'test-event-2025',
        name: 'Quick Start',
        description: 'Score 100 points in any game',
        icon: '🎯',
        tier: 'bronze',
        requirement: { type: 'score', target: 100 },
        reward: {
          id: 'test-bronze-badge',
          name: 'Quick Start Badge',
          description: 'You started the journey!',
          icon: '🥉',
          type: 'badge',
          rarity: 'limited',
          glowColor: 'oklch(0.55 0.18 35)',
          isPermanent: true,
          seasonYear: 2025
        }
      },
      {
        id: 'test-targets-50',
        eventId: 'test-event-2025',
        name: 'Target Practice',
        description: 'Hit 50 targets across all games',
        icon: '🎪',
        tier: 'silver',
        requirement: { type: 'targets', target: 50 },
        reward: {
          id: 'test-silver-badge',
          name: 'Sharpshooter Badge',
          description: 'Your aim is improving!',
          icon: '🥈',
          type: 'badge',
          rarity: 'limited',
          glowColor: 'oklch(0.70 0.08 240)',
          isPermanent: true,
          seasonYear: 2025
        }
      },
      {
        id: 'test-combo-10',
        eventId: 'test-event-2025',
        name: 'Combo Master',
        description: 'Achieve a 10x combo',
        icon: '⚡',
        tier: 'gold',
        requirement: { type: 'combo', target: 10 },
        reward: {
          id: 'test-gold-badge',
          name: 'Combo Master Badge',
          description: 'You got the rhythm!',
          icon: '🥇',
          type: 'badge',
          rarity: 'exclusive',
          glowColor: 'oklch(0.75 0.22 60)',
          isPermanent: true,
          seasonYear: 2025
        }
      },
      {
        id: 'test-games-3',
        eventId: 'test-event-2025',
        name: 'Persistent Player',
        description: 'Complete 3 games during the event',
        icon: '🎮',
        tier: 'silver',
        requirement: { type: 'games', target: 3 },
        reward: {
          id: 'test-persistence-badge',
          name: 'Persistence Badge',
          description: 'Keep going!',
          icon: '💪',
          type: 'badge',
          rarity: 'exclusive',
          glowColor: 'oklch(0.70 0.08 240)',
          isPermanent: true,
          seasonYear: 2025
        }
      },
      {
        id: 'test-perfect-1',
        eventId: 'test-event-2025',
        name: 'Perfect Round',
        description: 'Complete 1 perfect round',
        icon: '✨',
        tier: 'platinum',
        requirement: { type: 'perfect', target: 1 },
        reward: {
          id: 'test-perfect-badge',
          name: 'Perfectionist Badge',
          description: 'Flawless execution!',
          icon: '💎',
          type: 'badge',
          rarity: 'legendary',
          glowColor: 'oklch(0.78 0.15 220)',
          isPermanent: true,
          seasonYear: 2025
        }
      }
    ],
    rewards: [],
    specialModifier: {
      id: 'test-modifier',
      name: 'Championship Mode',
      description: 'Bonus points and effects',
      effects: {
        scoreMultiplier: 1.2,
        particleEffects: ['stars', 'sparkles']
      }
    }
  },
  {
    id: 'winter-wonderland-2024',
    type: 'winter-holiday',
    name: '❄️ Winter Wonderland',
    description: 'Celebrate the season with icy challenges and frosty rewards!',
    icon: '🎄',
    theme: {
      primaryColor: 'oklch(0.78 0.15 220)',
      accentColor: 'oklch(0.85 0.12 180)',
      backgroundColor: 'oklch(0.20 0.05 240)',
      particleEffect: 'snow'
    },
    startDate: new Date('2024-12-15').getTime(),
    endDate: new Date('2025-01-07').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'winter-frost-master',
        eventId: 'winter-wonderland-2024',
        name: 'Frost Master',
        description: 'Score 50,000 points with winter theme active',
        icon: '❄️',
        tier: 'gold',
        requirement: { type: 'score', target: 50000 },
        reward: {
          id: 'winter-frost-trail',
          name: 'Frost Trail',
          description: 'Icy trail effect for your cursor',
          icon: '❄️',
          type: 'theme',
          rarity: 'exclusive',
          glowColor: 'oklch(0.85 0.12 180)',
          isPermanent: false,
          isRecurring: true,
          seasonYear: 2024
        }
      },
      {
        id: 'winter-snowflake-collector',
        eventId: 'winter-wonderland-2024',
        name: 'Snowflake Collector',
        description: 'Hit 500 targets during the event',
        icon: '⛄',
        tier: 'silver',
        requirement: { type: 'targets', target: 500 },
        reward: {
          id: 'winter-snowman-badge',
          name: 'Snowman Badge',
          description: 'Limited edition winter badge',
          icon: '⛄',
          type: 'badge',
          rarity: 'limited',
          glowColor: 'oklch(0.85 0.12 180)',
          isPermanent: true,
          seasonYear: 2024
        }
      },
      {
        id: 'winter-blizzard-combo',
        eventId: 'winter-wonderland-2024',
        name: 'Blizzard Combo',
        description: 'Achieve a 20x combo',
        icon: '🌨️',
        tier: 'platinum',
        requirement: { type: 'combo', target: 20 },
        reward: {
          id: 'winter-blizzard-title',
          name: 'Blizzard King',
          description: 'Master of the winter storm',
          icon: '👑',
          type: 'title',
          rarity: 'legendary',
          glowColor: 'oklch(0.78 0.15 220)',
          isPermanent: true,
          seasonYear: 2024
        }
      }
    ],
    rewards: [],
    specialModifier: {
      id: 'winter-modifier',
      name: 'Winter Magic',
      description: 'Snowflakes fall and targets have a frosty appearance',
      effects: {
        scoreMultiplier: 1.5,
        particleEffects: ['snow', 'sparkles']
      }
    }
  },
  {
    id: 'lunar-celebration-2025',
    type: 'lunar-new-year',
    name: '🧧 Lunar New Year',
    description: 'Ring in the Lunar New Year with golden challenges!',
    icon: '🐉',
    theme: {
      primaryColor: 'oklch(0.75 0.25 45)',
      accentColor: 'oklch(0.70 0.28 15)',
      backgroundColor: 'oklch(0.18 0.04 45)',
      particleEffect: 'fireworks'
    },
    startDate: new Date('2025-01-29').getTime(),
    endDate: new Date('2025-02-12').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'lunar-golden-dragon',
        eventId: 'lunar-celebration-2025',
        name: 'Golden Dragon',
        description: 'Score 88,888 points in a single game',
        icon: '🐉',
        tier: 'platinum',
        requirement: { type: 'score', target: 88888 },
        reward: {
          id: 'lunar-dragon-skin',
          name: 'Dragon Target Skin',
          description: 'Targets shaped like auspicious dragons',
          icon: '🐉',
          type: 'skin',
          rarity: 'legendary',
          glowColor: 'oklch(0.75 0.25 45)',
          value: 'dragon',
          isPermanent: true,
          isRecurring: true,
          seasonYear: 2025
        }
      },
      {
        id: 'lunar-prosperity',
        eventId: 'lunar-celebration-2025',
        name: 'Prosperity Bringer',
        description: 'Complete 8 perfect rounds',
        icon: '💰',
        tier: 'gold',
        requirement: { type: 'perfect', target: 8 },
        reward: {
          id: 'lunar-fortune-badge',
          name: 'Fortune Badge',
          description: 'Blessed with prosperity',
          icon: '🧧',
          type: 'badge',
          rarity: 'exclusive',
          glowColor: 'oklch(0.70 0.28 15)',
          isPermanent: true,
          seasonYear: 2025
        }
      }
    ],
    rewards: [],
    specialModifier: {
      id: 'lunar-modifier',
      name: 'Festival Luck',
      description: 'Fireworks celebrate every combo, bonus points for lucky numbers',
      effects: {
        scoreMultiplier: 1.8,
        particleEffects: ['fireworks', 'sparkles']
      }
    }
  },
  {
    id: 'summer-championship-2024',
    type: 'summer-games',
    name: '🏆 Summer Championship',
    description: 'Compete in the ultimate summer tournament!',
    icon: '🏅',
    theme: {
      primaryColor: 'oklch(0.75 0.22 60)',
      accentColor: 'oklch(0.70 0.25 35)',
      backgroundColor: 'oklch(0.25 0.08 60)',
      particleEffect: 'stars'
    },
    startDate: new Date('2024-07-01').getTime(),
    endDate: new Date('2024-08-31').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'summer-gold-medal',
        eventId: 'summer-championship-2024',
        name: 'Gold Medal',
        description: 'Win 10 games with score above 30,000',
        icon: '🥇',
        tier: 'diamond',
        requirement: { type: 'games', target: 10 },
        reward: {
          id: 'summer-champion-trophy',
          name: 'Summer Champion Trophy',
          description: 'Proof of championship victory',
          icon: '🏆',
          type: 'trophy',
          rarity: 'mythic',
          glowColor: 'oklch(0.75 0.22 60)',
          isPermanent: true,
          seasonYear: 2024
        }
      }
    ],
    rewards: [],
    leaderboard: {
      eventId: 'summer-championship-2024',
      topPlayers: [],
      rewardTiers: [
        {
          minRank: 1,
          maxRank: 1,
          name: 'Champion',
          icon: '👑',
          rewards: [
            {
              id: 'summer-ultimate-champion',
              name: 'Ultimate Champion',
              description: '#1 Summer Champion',
              icon: '👑',
              type: 'title',
              rarity: 'mythic',
              glowColor: 'oklch(0.75 0.22 60)',
              isPermanent: true,
              seasonYear: 2024
            }
          ]
        },
        {
          minRank: 2,
          maxRank: 10,
          name: 'Elite',
          icon: '⭐',
          rewards: [
            {
              id: 'summer-elite-badge',
              name: 'Elite Competitor',
              description: 'Top 10 Summer Performer',
              icon: '⭐',
              type: 'badge',
              rarity: 'legendary',
              glowColor: 'oklch(0.75 0.22 60)',
              isPermanent: true,
              seasonYear: 2024
            }
          ]
        }
      ]
    }
  },
  {
    id: 'halloween-spooktacular-2024',
    type: 'halloween',
    name: '🎃 Spooktacular Halloween',
    description: 'Face your fears and earn spooky rewards!',
    icon: '👻',
    theme: {
      primaryColor: 'oklch(0.65 0.25 35)',
      accentColor: 'oklch(0.58 0.28 290)',
      backgroundColor: 'oklch(0.15 0.04 290)',
      particleEffect: 'flames'
    },
    startDate: new Date('2024-10-15').getTime(),
    endDate: new Date('2024-11-01').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'halloween-ghost-hunter',
        eventId: 'halloween-spooktacular-2024',
        name: 'Ghost Hunter',
        description: 'Hit 666 targets during the event',
        icon: '👻',
        tier: 'gold',
        requirement: { type: 'targets', target: 666 },
        reward: {
          id: 'halloween-ghost-skin',
          name: 'Ghostly Target Skin',
          description: 'Spectral targets that fade in and out',
          icon: '👻',
          type: 'skin',
          rarity: 'exclusive',
          glowColor: 'oklch(0.58 0.28 290)',
          value: 'ghost',
          isPermanent: true,
          isRecurring: true,
          seasonYear: 2024
        }
      },
      {
        id: 'halloween-pumpkin-smasher',
        eventId: 'halloween-spooktacular-2024',
        name: 'Pumpkin Smasher',
        description: 'Achieve a 31x combo',
        icon: '🎃',
        tier: 'platinum',
        requirement: { type: 'combo', target: 31 },
        reward: {
          id: 'halloween-pumpkin-king',
          name: 'Pumpkin King',
          description: 'Ruler of Halloween',
          icon: '🎃',
          type: 'title',
          rarity: 'legendary',
          glowColor: 'oklch(0.65 0.25 35)',
          isPermanent: true,
          seasonYear: 2024
        }
      },
      {
        id: 'halloween-nightmare-mode',
        eventId: 'halloween-spooktacular-2024',
        name: 'Nightmare Mode',
        description: 'Complete 5 games on Insane difficulty',
        icon: '💀',
        tier: 'diamond',
        requirement: { type: 'games', target: 5 },
        reward: {
          id: 'halloween-reaper-badge',
          name: 'Grim Reaper Badge',
          description: 'Conquered the nightmare',
          icon: '💀',
          type: 'badge',
          rarity: 'mythic',
          glowColor: 'oklch(0.58 0.28 290)',
          isPermanent: true,
          seasonYear: 2024
        }
      }
    ],
    rewards: [],
    specialModifier: {
      id: 'halloween-modifier',
      name: 'Spooky Atmosphere',
      description: 'Dark ambiance with ghostly effects',
      effects: {
        scoreMultiplier: 1.66,
        particleEffects: ['flames', 'sparkles'],
        specialTargets: ['pumpkin', 'ghost', 'bat']
      }
    }
  },
  {
    id: 'c9-anniversary-2024',
    type: 'anniversary',
    name: '☁️ Cloud9 Anniversary',
    description: 'Celebrate Cloud9\'s legacy with exclusive rewards!',
    icon: '🎂',
    theme: {
      primaryColor: 'oklch(0.65 0.24 240)',
      accentColor: 'oklch(0.75 0.18 195)',
      backgroundColor: 'oklch(0.15 0.02 240)',
      particleEffect: 'confetti'
    },
    startDate: new Date('2024-09-01').getTime(),
    endDate: new Date('2024-09-30').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'anniversary-legendary',
        eventId: 'c9-anniversary-2024',
        name: 'Cloud9 Legend',
        description: 'Score 99,999 points to honor C9',
        icon: '☁️',
        tier: 'diamond',
        requirement: { type: 'score', target: 99999 },
        reward: {
          id: 'anniversary-c9-badge',
          name: 'Cloud9 Founder Badge',
          description: 'Exclusive anniversary commemorative badge',
          icon: '☁️',
          type: 'badge',
          rarity: 'mythic',
          glowColor: 'oklch(0.65 0.24 240)',
          isPermanent: true,
          seasonYear: 2024
        }
      },
      {
        id: 'anniversary-dedication',
        eventId: 'c9-anniversary-2024',
        name: 'Dedicated Fan',
        description: 'Play 99 games during anniversary',
        icon: '🎮',
        tier: 'platinum',
        requirement: { type: 'games', target: 99 },
        reward: {
          id: 'anniversary-super-fan',
          name: 'Super Fan',
          description: 'True C9 supporter',
          icon: '💙',
          type: 'title',
          rarity: 'legendary',
          glowColor: 'oklch(0.75 0.18 195)',
          isPermanent: true,
          seasonYear: 2024
        }
      }
    ],
    rewards: []
  },
  {
    id: 'esports-worlds-2024',
    type: 'esports-worlds',
    name: '🌍 Esports Worlds',
    description: 'Join the world championship celebration!',
    icon: '🏆',
    theme: {
      primaryColor: 'oklch(0.75 0.22 60)',
      accentColor: 'oklch(0.68 0.22 290)',
      backgroundColor: 'oklch(0.18 0.04 240)',
      particleEffect: 'stars'
    },
    startDate: new Date('2024-11-01').getTime(),
    endDate: new Date('2024-11-30').getTime(),
    isActive: false,
    challenges: [
      {
        id: 'worlds-champion',
        eventId: 'esports-worlds-2024',
        name: 'World Champion',
        description: 'Reach top 100 on event leaderboard',
        icon: '🏆',
        tier: 'diamond',
        requirement: { type: 'score', target: 150000 },
        reward: {
          id: 'worlds-champion-trophy',
          name: 'Worlds Champion Trophy',
          description: 'Elite championship trophy',
          icon: '🏆',
          type: 'trophy',
          rarity: 'mythic',
          glowColor: 'oklch(0.75 0.22 60)',
          isPermanent: true,
          seasonYear: 2024
        }
      },
      {
        id: 'worlds-pro-player',
        eventId: 'esports-worlds-2024',
        name: 'Pro Player',
        description: 'Complete 50 perfect rounds',
        icon: '⭐',
        tier: 'platinum',
        requirement: { type: 'perfect', target: 50 },
        reward: {
          id: 'worlds-pro-title',
          name: 'Pro Player',
          description: 'Professional level achieved',
          icon: '⚡',
          type: 'title',
          rarity: 'legendary',
          glowColor: 'oklch(0.68 0.22 290)',
          isPermanent: true,
          seasonYear: 2024
        }
      }
    ],
    rewards: [],
    leaderboard: {
      eventId: 'esports-worlds-2024',
      topPlayers: [],
      rewardTiers: [
        {
          minRank: 1,
          maxRank: 1,
          name: 'World Champion',
          icon: '👑',
          rewards: [
            {
              id: 'worlds-champion-ultimate',
              name: 'World Champion 2024',
              description: 'The ultimate champion',
              icon: '👑',
              type: 'title',
              rarity: 'mythic',
              glowColor: 'oklch(0.75 0.22 60)',
              isPermanent: true,
              seasonYear: 2024
            }
          ]
        },
        {
          minRank: 2,
          maxRank: 50,
          name: 'Elite',
          icon: '⭐',
          rewards: [
            {
              id: 'worlds-elite-frame',
              name: 'Elite Frame',
              description: 'Elite competitor avatar frame',
              icon: '⭐',
              type: 'avatar-frame',
              rarity: 'legendary',
              glowColor: 'oklch(0.68 0.22 290)',
              isPermanent: true,
              seasonYear: 2024
            }
          ]
        }
      ]
    }
  }
]

export function getActiveEvents(events: SeasonalEvent[] = SEASONAL_EVENTS): SeasonalEvent[] {
  const now = Date.now()
  return events.filter(event => now >= event.startDate && now <= event.endDate)
}

export function getUpcomingEvents(events: SeasonalEvent[] = SEASONAL_EVENTS, daysAhead: number = 14): SeasonalEvent[] {
  const now = Date.now()
  const futureDate = now + (daysAhead * 24 * 60 * 60 * 1000)
  return events.filter(event => event.startDate > now && event.startDate <= futureDate)
}

export function checkEventChallengeProgress(
  challenge: EventChallenge,
  gameData: {
    score: number
    targetsHit: number
    combo: number
    difficulty: string
    perfectRounds: number
  },
  currentProgress: number = 0
): { progress: number; isComplete: boolean } {
  const { requirement } = challenge
  let progress = currentProgress

  switch (requirement.type) {
    case 'score':
      if (gameData.score >= requirement.target) {
        progress = requirement.target
      }
      break
    
    case 'targets':
      progress += gameData.targetsHit
      break
    
    case 'combo':
      if (gameData.combo >= requirement.target) {
        progress = Math.max(progress, requirement.target)
      }
      break
    
    case 'games':
      progress += 1
      break
    
    case 'perfect':
      progress += gameData.perfectRounds
      break
    
    case 'streak':
      if (gameData.score >= (requirement.specificConditions?.minScore || 0)) {
        progress += 1
      } else {
        progress = 0
      }
      break
  }

  return {
    progress: Math.min(progress, requirement.target),
    isComplete: progress >= requirement.target
  }
}

export function convertEventRewardToUnlockable(reward: EventReward): ThemeUnlockable {
  const typeMap: Record<string, any> = {
    'theme': 'visual-theme',
    'background': 'background',
    'skin': 'target-skin',
    'badge': 'profile-badge',
    'title': 'title',
    'trophy': 'profile-badge'
  }

  return {
    id: reward.id,
    type: typeMap[reward.type] || 'profile-badge',
    name: reward.name,
    description: reward.description,
    icon: reward.icon,
    rarity: reward.rarity === 'limited' ? 'epic' : reward.rarity === 'exclusive' ? 'legendary' : 'mythic',
    glowColor: reward.glowColor,
    value: reward.value,
    requirement: { type: 'level', target: 1 }
  }
}

export function isEventRewardExpired(reward: EventReward): boolean {
  if (reward.isPermanent) return false
  if (!reward.expiresAt) return false
  return Date.now() > reward.expiresAt
}

export function getEventProgress(
  eventId: string,
  playerProgress?: PlayerEventProgress
): PlayerEventProgress {
  if (playerProgress && playerProgress.eventId === eventId) {
    return playerProgress
  }
  
  return {
    eventId,
    completedChallenges: [],
    earnedRewards: [],
    eventScore: 0,
    challengeProgress: {},
    lastUpdated: Date.now()
  }
}

export function getTierColor(tier: string): string {
  switch (tier) {
    case 'bronze':
      return 'oklch(0.55 0.18 35)'
    case 'silver':
      return 'oklch(0.70 0.08 240)'
    case 'gold':
      return 'oklch(0.75 0.22 60)'
    case 'platinum':
      return 'oklch(0.78 0.15 220)'
    case 'diamond':
      return 'oklch(0.68 0.18 210)'
    default:
      return 'oklch(0.65 0.24 240)'
  }
}

export function getRarityGlow(rarity: string): string {
  switch (rarity) {
    case 'limited':
      return '0 0 20px currentColor'
    case 'exclusive':
      return '0 0 30px currentColor, 0 0 60px currentColor'
    case 'legendary':
      return '0 0 40px currentColor, 0 0 80px currentColor'
    case 'mythic':
      return '0 0 50px currentColor, 0 0 100px currentColor, 0 0 150px currentColor'
    default:
      return '0 0 20px currentColor'
  }
}

export function formatTimeRemaining(endDate: number): string {
  const now = Date.now()
  const remaining = endDate - now
  
  if (remaining <= 0) return 'Ended'
  
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
  
  if (days > 0) return `${days}d ${hours}h remaining`
  if (hours > 0) return `${hours}h ${minutes}m remaining`
  return `${minutes}m remaining`
}

export function sortEventsByDate(events: SeasonalEvent[]): SeasonalEvent[] {
  return [...events].sort((a, b) => {
    const now = Date.now()
    const aActive = now >= a.startDate && now <= a.endDate
    const bActive = now >= b.startDate && now <= b.endDate
    
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    
    return a.startDate - b.startDate
  })
}
