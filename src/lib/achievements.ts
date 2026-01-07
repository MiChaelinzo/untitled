export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: (stats: PlayerStats) => boolean
}

export interface PlayerStats {
  totalGamesPlayed: number
  totalTargetsHit: number
  totalTargetsMissed: number
  highestScore: number
  highestCombo: number
  perfectRounds: number
  insaneModeCompleted: number
  totalPlayTime: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    name: 'First Blood',
    description: 'Complete your first game',
    icon: '🎮',
    requirement: (stats) => stats.totalGamesPlayed >= 1
  },
  {
    id: 'sharpshooter',
    name: 'Sharpshooter',
    description: 'Hit 100 targets total',
    icon: '🎯',
    requirement: (stats) => stats.totalTargetsHit >= 100
  },
  {
    id: 'combo-master',
    name: 'Combo Master',
    description: 'Achieve a 10x combo',
    icon: '⚡',
    requirement: (stats) => stats.highestCombo >= 10
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Complete a round without missing',
    icon: '💎',
    requirement: (stats) => stats.perfectRounds >= 1
  },
  {
    id: 'score-hunter',
    name: 'Score Hunter',
    description: 'Score over 50,000 points in one game',
    icon: '👑',
    requirement: (stats) => stats.highestScore >= 50000
  },
  {
    id: 'insane-champion',
    name: 'Insane Champion',
    description: 'Complete a game on Insane difficulty',
    icon: '🔥',
    requirement: (stats) => stats.insaneModeCompleted >= 1
  },
  {
    id: 'dedication',
    name: 'Dedication',
    description: 'Play 10 games',
    icon: '🏆',
    requirement: (stats) => stats.totalGamesPlayed >= 10
  },
  {
    id: 'marathon',
    name: 'Marathon',
    description: 'Spend 30 minutes playing',
    icon: '⏱️',
    requirement: (stats) => stats.totalPlayTime >= 1800000
  }
]

export function checkNewAchievements(
  previousStats: PlayerStats,
  currentStats: PlayerStats,
  unlockedAchievements: string[]
): Achievement[] {
  return ACHIEVEMENTS.filter(achievement => {
    if (unlockedAchievements.includes(achievement.id)) {
      return false
    }
    
    const wasNotMet = !achievement.requirement(previousStats)
    const isNowMet = achievement.requirement(currentStats)
    
    return wasNotMet && isNowMet
  })
}
