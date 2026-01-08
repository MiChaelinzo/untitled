export interface DailyStreak {
  currentStreak: number
  longestStreak: number
  lastPlayDate: string
  totalLoginDays: number
  streakRewards: StreakReward[]
  claimedRewards: string[]
}

export interface StreakReward {
  id: string
  day: number
  name: string
  description: string
  type: 'xp' | 'title' | 'badge' | 'skin' | 'theme'
  value: string
  claimed: boolean
}

export const STREAK_REWARDS: StreakReward[] = [
  {
    id: 'streak-3',
    day: 3,
    name: 'Triple Threat',
    description: '3-day streak bonus',
    type: 'xp',
    value: '500',
    claimed: false
  },
  {
    id: 'streak-5',
    day: 5,
    name: 'Dedicated Player',
    description: '5-day streak title',
    type: 'title',
    value: 'Dedicated',
    claimed: false
  },
  {
    id: 'streak-7',
    day: 7,
    name: 'Weekly Warrior',
    description: '7-day streak badge',
    type: 'badge',
    value: 'badge-weekly-warrior',
    claimed: false
  },
  {
    id: 'streak-14',
    day: 14,
    name: 'Fortnight Champion',
    description: '14-day streak skin',
    type: 'skin',
    value: 'skin-streak-champion',
    claimed: false
  },
  {
    id: 'streak-30',
    day: 30,
    name: 'Monthly Master',
    description: '30-day streak theme',
    type: 'theme',
    value: 'visual-streak-master',
    claimed: false
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
  
  if (lastPlay === yesterdayStr) {
    newStreak += 1
  } else if (lastPlay !== null) {
    newStreak = 1
  } else {
    newStreak = 1
  }
  
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(currentStreak.longestStreak, newStreak),
    lastPlayDate: today,
    totalLoginDays: currentStreak.totalLoginDays + 1,
    streakRewards: currentStreak.streakRewards,
    claimedRewards: currentStreak.claimedRewards
  }
}

export function getAvailableStreakRewards(streak: DailyStreak): StreakReward[] {
  return STREAK_REWARDS.filter(
    reward => streak.currentStreak >= reward.day && !streak.claimedRewards.includes(reward.id)
  )
}

export function claimStreakReward(streak: DailyStreak, rewardId: string): DailyStreak {
  return {
    ...streak,
    claimedRewards: [...streak.claimedRewards, rewardId]
  }
}

export const DEFAULT_STREAK: DailyStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: '',
  totalLoginDays: 0,
  streakRewards: STREAK_REWARDS,
  claimedRewards: []
}
