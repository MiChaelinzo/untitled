import { Difficulty } from './game-types'

export interface GlobalLeaderboardEntry {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  score: number
  difficulty: Difficulty
  targetsHit: number
  targetsMissed: number
  accuracy: number
  highestCombo: number
  timestamp: number
  rank?: number
  country?: string
  region?: string
  badges?: string[]
  title?: string
}

export interface CommunityStats {
  totalPlayers: number
  totalGamesPlayed: number
  totalTargetsHit: number
  averageAccuracy: number
  topScore: number
  mostActiveRegion: string
  mostPopularDifficulty: Difficulty
  totalPlayTime: number
  todayGames: number
  weekGames: number
  monthGames: number
  recentTrends: {
    gamesPlayedTrend: number
    averageScoreTrend: number
    activePlayersTrend: number
  }
}

export interface RegionalStats {
  region: string
  playerCount: number
  averageScore: number
  topScore: number
  topPlayer: string
  gamesPlayed: number
}

export interface TrendingPlayer {
  userId: string
  username: string
  avatarUrl?: string
  recentScore: number
  scoreImprovement: number
  gamesPlayedToday: number
  currentStreak: number
  rank: number
  isRising: boolean
}

export interface LeaderboardFilter {
  timeRange: 'today' | 'week' | 'month' | 'all-time'
  difficulty?: Difficulty
  region?: string
  minGames?: number
}

export interface PlayerRankInfo {
  globalRank: number
  regionalRank?: number
  difficultyRank?: number
  percentile: number
  nearbyPlayers: GlobalLeaderboardEntry[]
}

export const REGIONS = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania'
] as const

export type Region = typeof REGIONS[number]

export const DEFAULT_COMMUNITY_STATS: CommunityStats = {
  totalPlayers: 0,
  totalGamesPlayed: 0,
  totalTargetsHit: 0,
  averageAccuracy: 0,
  topScore: 0,
  mostActiveRegion: 'North America',
  mostPopularDifficulty: 'medium',
  totalPlayTime: 0,
  todayGames: 0,
  weekGames: 0,
  monthGames: 0,
  recentTrends: {
    gamesPlayedTrend: 0,
    averageScoreTrend: 0,
    activePlayersTrend: 0
  }
}

export function calculateAccuracy(targetsHit: number, targetsMissed: number): number {
  const total = targetsHit + targetsMissed
  if (total === 0) return 0
  return (targetsHit / total) * 100
}

export function addGlobalLeaderboardEntry(
  leaderboard: GlobalLeaderboardEntry[],
  entry: Omit<GlobalLeaderboardEntry, 'id' | 'rank' | 'accuracy'>
): GlobalLeaderboardEntry[] {
  const accuracy = calculateAccuracy(entry.targetsHit, entry.targetsMissed)
  
  const newEntry: GlobalLeaderboardEntry = {
    ...entry,
    id: `lb-${entry.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    accuracy
  }

  const updated = [...leaderboard, newEntry]
  return sortAndRankLeaderboard(updated)
}

export function sortAndRankLeaderboard(
  leaderboard: GlobalLeaderboardEntry[]
): GlobalLeaderboardEntry[] {
  const sorted = [...leaderboard].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy
    return a.timestamp - b.timestamp
  })

  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }))
}

export function filterLeaderboard(
  leaderboard: GlobalLeaderboardEntry[],
  filter: LeaderboardFilter
): GlobalLeaderboardEntry[] {
  const now = Date.now()
  const timeRanges = {
    today: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000,
    'all-time': Infinity
  }

  let filtered = leaderboard.filter(entry => {
    const timeRange = timeRanges[filter.timeRange]
    if (now - entry.timestamp > timeRange) return false
    
    if (filter.difficulty && entry.difficulty !== filter.difficulty) return false
    if (filter.region && entry.region !== filter.region) return false
    
    return true
  })

  if (filter.minGames) {
    const playerGameCounts = new Map<string, number>()
    filtered.forEach(entry => {
      playerGameCounts.set(entry.userId, (playerGameCounts.get(entry.userId) || 0) + 1)
    })
    
    filtered = filtered.filter(entry => 
      (playerGameCounts.get(entry.userId) || 0) >= filter.minGames!
    )
  }

  const bestScores = new Map<string, GlobalLeaderboardEntry>()
  filtered.forEach(entry => {
    const existing = bestScores.get(entry.userId)
    if (!existing || entry.score > existing.score) {
      bestScores.set(entry.userId, entry)
    }
  })

  return sortAndRankLeaderboard(Array.from(bestScores.values()))
}

export function calculateCommunityStats(
  leaderboard: GlobalLeaderboardEntry[]
): CommunityStats {
  if (leaderboard.length === 0) return DEFAULT_COMMUNITY_STATS

  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000

  const uniquePlayers = new Set(leaderboard.map(e => e.userId))
  const todayEntries = leaderboard.filter(e => e.timestamp >= oneDayAgo)
  const weekEntries = leaderboard.filter(e => e.timestamp >= oneWeekAgo)
  const monthEntries = leaderboard.filter(e => e.timestamp >= oneMonthAgo)
  const lastWeekEntries = leaderboard.filter(e => 
    e.timestamp >= twoWeeksAgo && e.timestamp < oneWeekAgo
  )

  const regionCounts = new Map<string, number>()
  const difficultyCounts = new Map<Difficulty, number>()
  
  leaderboard.forEach(entry => {
    if (entry.region) {
      regionCounts.set(entry.region, (regionCounts.get(entry.region) || 0) + 1)
    }
    difficultyCounts.set(entry.difficulty, (difficultyCounts.get(entry.difficulty) || 0) + 1)
  })

  const mostActiveRegion = Array.from(regionCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'North America'

  const mostPopularDifficulty = Array.from(difficultyCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium'

  const totalAccuracy = leaderboard.reduce((sum, e) => sum + e.accuracy, 0)
  const topScore = Math.max(...leaderboard.map(e => e.score), 0)
  const totalTargetsHit = leaderboard.reduce((sum, e) => sum + e.targetsHit, 0)

  const activePlayersThisWeek = new Set(weekEntries.map(e => e.userId)).size
  const activePlayersLastWeek = new Set(lastWeekEntries.map(e => e.userId)).size
  const activePlayersTrend = activePlayersLastWeek > 0
    ? ((activePlayersThisWeek - activePlayersLastWeek) / activePlayersLastWeek) * 100
    : 0

  const avgScoreThisWeek = weekEntries.length > 0
    ? weekEntries.reduce((sum, e) => sum + e.score, 0) / weekEntries.length
    : 0
  const avgScoreLastWeek = lastWeekEntries.length > 0
    ? lastWeekEntries.reduce((sum, e) => sum + e.score, 0) / lastWeekEntries.length
    : 0
  const averageScoreTrend = avgScoreLastWeek > 0
    ? ((avgScoreThisWeek - avgScoreLastWeek) / avgScoreLastWeek) * 100
    : 0

  const gamesPlayedTrend = lastWeekEntries.length > 0
    ? ((weekEntries.length - lastWeekEntries.length) / lastWeekEntries.length) * 100
    : 0

  return {
    totalPlayers: uniquePlayers.size,
    totalGamesPlayed: leaderboard.length,
    totalTargetsHit,
    averageAccuracy: totalAccuracy / leaderboard.length,
    topScore,
    mostActiveRegion,
    mostPopularDifficulty,
    totalPlayTime: 0,
    todayGames: todayEntries.length,
    weekGames: weekEntries.length,
    monthGames: monthEntries.length,
    recentTrends: {
      gamesPlayedTrend,
      averageScoreTrend,
      activePlayersTrend
    }
  }
}

export function getRegionalStats(
  leaderboard: GlobalLeaderboardEntry[]
): RegionalStats[] {
  const regionMap = new Map<string, GlobalLeaderboardEntry[]>()
  
  leaderboard.forEach(entry => {
    const region = entry.region || 'Unknown'
    if (!regionMap.has(region)) {
      regionMap.set(region, [])
    }
    regionMap.get(region)!.push(entry)
  })

  return Array.from(regionMap.entries()).map(([region, entries]) => {
    const uniquePlayers = new Map<string, GlobalLeaderboardEntry>()
    entries.forEach(entry => {
      const existing = uniquePlayers.get(entry.userId)
      if (!existing || entry.score > existing.score) {
        uniquePlayers.set(entry.userId, entry)
      }
    })

    const bestScores = Array.from(uniquePlayers.values())
    const topEntry = bestScores.reduce((best, entry) => 
      entry.score > best.score ? entry : best
    , bestScores[0])

    const avgScore = bestScores.reduce((sum, e) => sum + e.score, 0) / bestScores.length

    return {
      region,
      playerCount: uniquePlayers.size,
      averageScore: avgScore,
      topScore: topEntry.score,
      topPlayer: topEntry.username,
      gamesPlayed: entries.length
    }
  }).sort((a, b) => b.topScore - a.topScore)
}

export function getTrendingPlayers(
  leaderboard: GlobalLeaderboardEntry[],
  limit: number = 10
): TrendingPlayer[] {
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000

  const recentEntries = leaderboard.filter(e => e.timestamp >= oneDayAgo)
  const previousEntries = leaderboard.filter(e => 
    e.timestamp >= threeDaysAgo && e.timestamp < oneDayAgo
  )

  const playerStats = new Map<string, {
    username: string
    avatarUrl?: string
    recentScore: number
    previousScore: number
    gamesPlayedToday: number
    latestRank: number
  }>()

  recentEntries.forEach(entry => {
    const existing = playerStats.get(entry.userId)
    if (!existing || entry.score > existing.recentScore) {
      playerStats.set(entry.userId, {
        username: entry.username,
        avatarUrl: entry.avatarUrl,
        recentScore: entry.score,
        previousScore: existing?.previousScore || 0,
        gamesPlayedToday: (existing?.gamesPlayedToday || 0) + 1,
        latestRank: entry.rank || 0
      })
    }
  })

  previousEntries.forEach(entry => {
    const existing = playerStats.get(entry.userId)
    if (existing) {
      existing.previousScore = Math.max(existing.previousScore, entry.score)
    } else {
      playerStats.set(entry.userId, {
        username: entry.username,
        avatarUrl: entry.avatarUrl,
        recentScore: 0,
        previousScore: entry.score,
        gamesPlayedToday: 0,
        latestRank: 0
      })
    }
  })

  const trending: TrendingPlayer[] = Array.from(playerStats.entries())
    .map(([userId, stats]) => {
      const improvement = stats.previousScore > 0
        ? ((stats.recentScore - stats.previousScore) / stats.previousScore) * 100
        : stats.recentScore > 0 ? 100 : 0

      return {
        userId,
        username: stats.username,
        avatarUrl: stats.avatarUrl,
        recentScore: stats.recentScore,
        scoreImprovement: improvement,
        gamesPlayedToday: stats.gamesPlayedToday,
        currentStreak: stats.gamesPlayedToday,
        rank: stats.latestRank,
        isRising: improvement > 0
      }
    })
    .filter(p => p.gamesPlayedToday > 0)
    .sort((a, b) => b.scoreImprovement - a.scoreImprovement)
    .slice(0, limit)

  return trending
}

export function getPlayerRankInfo(
  leaderboard: GlobalLeaderboardEntry[],
  userId: string,
  filter?: LeaderboardFilter
): PlayerRankInfo | null {
  const filtered = filter 
    ? filterLeaderboard(leaderboard, filter)
    : sortAndRankLeaderboard(leaderboard)

  const playerBestScores = new Map<string, GlobalLeaderboardEntry>()
  filtered.forEach(entry => {
    const existing = playerBestScores.get(entry.userId)
    if (!existing || entry.score > existing.score) {
      playerBestScores.set(entry.userId, entry)
    }
  })

  const playerEntry = playerBestScores.get(userId)
  if (!playerEntry) return null

  const sortedPlayers = Array.from(playerBestScores.values())
    .sort((a, b) => b.score - a.score)

  const globalRank = sortedPlayers.findIndex(e => e.userId === userId) + 1
  const percentile = (globalRank / sortedPlayers.length) * 100

  const playerIndex = sortedPlayers.findIndex(e => e.userId === userId)
  const nearbyStart = Math.max(0, playerIndex - 2)
  const nearbyEnd = Math.min(sortedPlayers.length, playerIndex + 3)
  const nearbyPlayers = sortedPlayers.slice(nearbyStart, nearbyEnd)

  let regionalRank: number | undefined
  if (playerEntry.region) {
    const regionalPlayers = sortedPlayers
      .filter(e => e.region === playerEntry.region)
    regionalRank = regionalPlayers.findIndex(e => e.userId === userId) + 1
  }

  let difficultyRank: number | undefined
  if (playerEntry.difficulty) {
    const difficultyPlayers = sortedPlayers
      .filter(e => e.difficulty === playerEntry.difficulty)
    difficultyRank = difficultyPlayers.findIndex(e => e.userId === userId) + 1
  }

  return {
    globalRank,
    regionalRank,
    difficultyRank,
    percentile,
    nearbyPlayers
  }
}

export function exportLeaderboardData(
  leaderboard: GlobalLeaderboardEntry[],
  filter?: LeaderboardFilter
): string {
  const filtered = filter 
    ? filterLeaderboard(leaderboard, filter)
    : sortAndRankLeaderboard(leaderboard)

  const headers = ['Rank', 'Username', 'Score', 'Difficulty', 'Accuracy', 'Combo', 'Date']
  const rows = filtered.map(entry => [
    entry.rank || '',
    entry.username,
    entry.score,
    entry.difficulty,
    `${entry.accuracy.toFixed(1)}%`,
    entry.highestCombo,
    new Date(entry.timestamp).toLocaleDateString()
  ])

  return [headers, ...rows].map(row => row.join(',')).join('\n')
}
