export interface GlobalStats {
  totalGamesPlayed: number
  totalTargetsHit: number
  totalTargetsMissed: number
  allTimeHighScore: number
  allTimeHighCombo: number
  fastestReactionTime: number
  totalPlayersRecorded: number
  averageAccuracy: number
  mostPopularDifficulty: string
  totalPerfectRounds: number
  lastUpdated: number
}

export interface GameSession {
  id: string
  timestamp: number
  score: number
  difficulty: string
  targetsHit: number
  targetsMissed: number
  highestCombo: number
  reactionTimes: number[]
  isPractice: boolean
}

export function updateGlobalStats(
  currentStats: GlobalStats,
  gameSession: GameSession
): GlobalStats {
  const accuracy = gameSession.targetsHit / (gameSession.targetsHit + gameSession.targetsMissed)
  const avgReactionTime = gameSession.reactionTimes.length > 0
    ? gameSession.reactionTimes.reduce((a, b) => a + b, 0) / gameSession.reactionTimes.length
    : 0
  const fastestInSession = gameSession.reactionTimes.length > 0
    ? Math.min(...gameSession.reactionTimes)
    : Infinity

  return {
    totalGamesPlayed: currentStats.totalGamesPlayed + 1,
    totalTargetsHit: currentStats.totalTargetsHit + gameSession.targetsHit,
    totalTargetsMissed: currentStats.totalTargetsMissed + gameSession.targetsMissed,
    allTimeHighScore: Math.max(currentStats.allTimeHighScore, gameSession.score),
    allTimeHighCombo: Math.max(currentStats.allTimeHighCombo, gameSession.highestCombo),
    fastestReactionTime: Math.min(
      currentStats.fastestReactionTime === 0 ? Infinity : currentStats.fastestReactionTime,
      fastestInSession
    ),
    totalPlayersRecorded: currentStats.totalPlayersRecorded,
    averageAccuracy: (
      (currentStats.averageAccuracy * currentStats.totalGamesPlayed + accuracy) /
      (currentStats.totalGamesPlayed + 1)
    ),
    mostPopularDifficulty: currentStats.mostPopularDifficulty || gameSession.difficulty,
    totalPerfectRounds: currentStats.totalPerfectRounds + (gameSession.targetsMissed === 0 ? 1 : 0),
    lastUpdated: Date.now()
  }
}

export function formatGlobalStats(stats: GlobalStats) {
  return {
    'Total Games Played': stats.totalGamesPlayed.toLocaleString(),
    'Targets Hit': stats.totalTargetsHit.toLocaleString(),
    'All-Time High Score': stats.allTimeHighScore.toLocaleString(),
    'Best Combo': `${stats.allTimeHighCombo}x`,
    'Fastest Reaction': stats.fastestReactionTime > 0 && stats.fastestReactionTime < Infinity 
      ? `${stats.fastestReactionTime.toFixed(0)}ms` 
      : 'N/A',
    'Average Accuracy': `${(stats.averageAccuracy * 100).toFixed(1)}%`,
    'Perfect Rounds': stats.totalPerfectRounds.toLocaleString(),
    'Most Popular Mode': stats.mostPopularDifficulty.charAt(0).toUpperCase() + stats.mostPopularDifficulty.slice(1)
  }
}

export const DEFAULT_GLOBAL_STATS: GlobalStats = {
  totalGamesPlayed: 0,
  totalTargetsHit: 0,
  totalTargetsMissed: 0,
  allTimeHighScore: 0,
  allTimeHighCombo: 0,
  fastestReactionTime: 0,
  totalPlayersRecorded: 0,
  averageAccuracy: 0,
  mostPopularDifficulty: 'medium',
  totalPerfectRounds: 0,
  lastUpdated: Date.now()
}
