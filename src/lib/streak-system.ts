export interface DailyStreak {
  currentStreak: number
  longestStreak: number
  lastPlayDate: string
  totalLoginDays: number
  streakRewards: StreakReward[]
  claimedRewards: string[]
  dailyBonusMultiplier: number
  streakMilestones: number[]
  freezeTokens: number
  lastFreezeDate?: string
}

export interface StreakReward {
  id: string
  day: number
  name: string
  description: string
  type: 'xp' | 'title' | 'badge' | 'skin' | 'theme' | 'multiplier' | 'freeze-token' | 'background' | 'trail'
  value: string
  claimed: boolean
  icon?: string
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  bonus?: {
    xp?: number
    multiplier?: number
    tokens?: number
  }
}

export const STREAK_REWARDS: StreakReward[] = [
  {
    id: 'streak-1',
    day: 1,
    name: 'First Step',
    description: 'Welcome bonus',
    type: 'xp',
    value: '100',
    claimed: false,
    icon: '🎯',
    rarity: 'common',
    bonus: { xp: 100 }
  },
  {
    id: 'streak-2',
    day: 2,
    name: 'Coming Back',
    description: '2-day bonus',
    type: 'xp',
    value: '200',
    claimed: false,
    icon: '🔥',
    rarity: 'common',
    bonus: { xp: 200 }
  },
  {
    id: 'streak-3',
    day: 3,
    name: 'Triple Threat',
    description: 'Score multiplier +10%',
    type: 'multiplier',
    value: '1.1',
    claimed: false,
    icon: '⚡',
    rarity: 'rare',
    bonus: { xp: 300, multiplier: 1.1 }
  },
  {
    id: 'streak-5',
    day: 5,
    name: 'Dedicated Player',
    description: 'Unlock special title',
    type: 'title',
    value: 'title-dedicated',
    claimed: false,
    icon: '🏅',
    rarity: 'rare',
    bonus: { xp: 500 }
  },
  {
    id: 'streak-7',
    day: 7,
    name: 'Weekly Warrior',
    description: 'Legendary badge + Freeze Token',
    type: 'badge',
    value: 'badge-weekly-warrior',
    claimed: false,
    icon: '👑',
    rarity: 'epic',
    bonus: { xp: 750, tokens: 1 }
  },
  {
    id: 'streak-10',
    day: 10,
    name: 'Elite Consistency',
    description: 'Score multiplier +25%',
    type: 'multiplier',
    value: '1.25',
    claimed: false,
    icon: '💎',
    rarity: 'epic',
    bonus: { xp: 1000, multiplier: 1.25 }
  },
  {
    id: 'streak-14',
    day: 14,
    name: 'Fortnight Champion',
    description: 'Exclusive target skin',
    type: 'skin',
    value: 'skin-streak-champion',
    claimed: false,
    icon: '🎨',
    rarity: 'epic',
    bonus: { xp: 1500, tokens: 1 }
  },
  {
    id: 'streak-21',
    day: 21,
    name: 'Three Week Legend',
    description: 'Special mouse trail effect',
    type: 'trail',
    value: 'trail-streak-flame',
    claimed: false,
    icon: '✨',
    rarity: 'legendary',
    bonus: { xp: 2500, tokens: 2 }
  },
  {
    id: 'streak-30',
    day: 30,
    name: 'Monthly Master',
    description: 'Exclusive visual theme + 50% multiplier',
    type: 'theme',
    value: 'visual-streak-master',
    claimed: false,
    icon: '🌟',
    rarity: 'legendary',
    bonus: { xp: 5000, multiplier: 1.5, tokens: 3 }
  },
  {
    id: 'streak-50',
    day: 50,
    name: 'Unstoppable Force',
    description: 'Ultra-rare background theme',
    type: 'background',
    value: 'bg-streak-unstoppable',
    claimed: false,
    icon: '🔱',
    rarity: 'legendary',
    bonus: { xp: 10000, multiplier: 2.0, tokens: 5 }
  },
  {
    id: 'streak-100',
    day: 100,
    name: 'Century of Excellence',
    description: 'Ultimate champion bundle',
    type: 'theme',
    value: 'bundle-century',
    claimed: false,
    icon: '👑',
    rarity: 'legendary',
    bonus: { xp: 25000, multiplier: 3.0, tokens: 10 }
  }
]

export function updateStreak(currentStreak: DailyStreak): DailyStreak {
  const today = new Date().toDateString()
  const lastPlay = currentStreak.lastPlayDate ? new Date(currentStreak.lastPlayDate).toDateString() : null
  
  if (lastPlay === today) {
    return currentStreak
  }
  
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()
  
  let newStreak = currentStreak.currentStreak
  let shouldBreakStreak = false
  
  if (lastPlay === yesterdayStr) {
    newStreak += 1
  } else if (lastPlay !== null) {
    shouldBreakStreak = true
    newStreak = 1
  } else {
    newStreak = 1
  }
  
  const newMilestones = [...(currentStreak.streakMilestones || [])]
  if (newStreak > 0 && !newMilestones.includes(newStreak) && STREAK_REWARDS.some(r => r.day === newStreak)) {
    newMilestones.push(newStreak)
  }
  
  const claimedRewards = STREAK_REWARDS
    .filter(r => r.day <= newStreak)
    .map(r => r.id)
    .filter(id => currentStreak.claimedRewards.includes(id))
  
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(currentStreak.longestStreak, newStreak),
    lastPlayDate: today,
    totalLoginDays: currentStreak.totalLoginDays + 1,
    streakRewards: currentStreak.streakRewards,
    claimedRewards: shouldBreakStreak ? [] : claimedRewards,
    dailyBonusMultiplier: calculateBonusMultiplier(newStreak, claimedRewards),
    streakMilestones: newMilestones,
    freezeTokens: currentStreak.freezeTokens || 0
  }
}

export function calculateBonusMultiplier(streak: number, claimedRewards: string[]): number {
  let multiplier = 1.0
  
  STREAK_REWARDS.forEach(reward => {
    if (reward.type === 'multiplier' && reward.day <= streak && claimedRewards.includes(reward.id)) {
      const rewardMultiplier = parseFloat(reward.value)
      if (!isNaN(rewardMultiplier)) {
        multiplier = Math.max(multiplier, rewardMultiplier)
      }
    }
  })
  
  return multiplier
}

export function useStreakFreeze(streak: DailyStreak): { success: boolean; updatedStreak: DailyStreak } {
  const today = new Date().toDateString()
  
  if (streak.freezeTokens <= 0) {
    return { success: false, updatedStreak: streak }
  }
  
  if (streak.lastFreezeDate === today) {
    return { success: false, updatedStreak: streak }
  }
  
  return {
    success: true,
    updatedStreak: {
      ...streak,
      freezeTokens: streak.freezeTokens - 1,
      lastFreezeDate: today,
      lastPlayDate: today
    }
  }
}

export function getAvailableStreakRewards(streak: DailyStreak): StreakReward[] {
  return STREAK_REWARDS.filter(
    reward => streak.currentStreak >= reward.day && !streak.claimedRewards.includes(reward.id)
  )
}

export function claimStreakReward(streak: DailyStreak, rewardId: string): DailyStreak {
  const reward = STREAK_REWARDS.find(r => r.id === rewardId)
  const newClaimedRewards = [...streak.claimedRewards, rewardId]
  
  let newFreezeTokens = streak.freezeTokens || 0
  if (reward?.bonus?.tokens) {
    newFreezeTokens += reward.bonus.tokens
  }
  
  return {
    ...streak,
    claimedRewards: newClaimedRewards,
    freezeTokens: newFreezeTokens,
    dailyBonusMultiplier: calculateBonusMultiplier(streak.currentStreak, newClaimedRewards)
  }
}

export function getDailyBonus(streak: DailyStreak): number {
  const baseBonus = 100
  const streakBonus = Math.min(streak.currentStreak * 50, 2000)
  return Math.floor((baseBonus + streakBonus) * (streak.dailyBonusMultiplier || 1.0))
}

export function getStreakTier(streak: number): { name: string; color: string; emoji: string } {
  if (streak >= 100) return { name: 'Legendary', color: 'text-yellow-400', emoji: '👑' }
  if (streak >= 50) return { name: 'Epic', color: 'text-purple-400', emoji: '🔱' }
  if (streak >= 30) return { name: 'Rare', color: 'text-blue-400', emoji: '💎' }
  if (streak >= 14) return { name: 'Uncommon', color: 'text-green-400', emoji: '⚡' }
  if (streak >= 7) return { name: 'Common', color: 'text-gray-400', emoji: '🔥' }
  return { name: 'Beginner', color: 'text-muted-foreground', emoji: '🎯' }
}

export const DEFAULT_STREAK: DailyStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: '',
  totalLoginDays: 0,
  streakRewards: STREAK_REWARDS,
  claimedRewards: [],
  dailyBonusMultiplier: 1.0,
  streakMilestones: [],
  freezeTokens: 0
}
