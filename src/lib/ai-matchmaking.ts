import { PlayerStats } from './achievements'
import { PlayerProfile } from './friends-system'
import { Difficulty } from './game-types'

export interface PlayerSkillProfile {
  userId: string
  username: string
  avatarUrl?: string
  skillRating: number
  consistencyScore: number
  averageReactionTime: number
  preferredDifficulty: Difficulty
  recentPerformance: number[]
  volatility: number
  peakPerformanceTime?: number
  playStyle: 'aggressive' | 'consistent' | 'adaptive'
}

export interface MatchmakingPool {
  id: string
  difficulty: Difficulty
  minPlayers: number
  maxPlayers: number
  players: PlayerSkillProfile[]
  createdAt: number
  status: 'open' | 'matching' | 'ready'
}

export interface MatchmakingResult {
  pools: PlayerGroup[]
  fairnessScore: number
  reasoning: string
  confidence: number
}

export interface PlayerGroup {
  players: PlayerSkillProfile[]
  averageSkill: number
  skillVariance: number
  recommendedDifficulty: Difficulty
}

export interface TournamentMatchup {
  player1: PlayerSkillProfile
  player2: PlayerSkillProfile
  skillDifference: number
  predictedCompetitiveness: number
  recommendedHandicap?: number
}

export function calculateSkillRating(stats: PlayerStats): number {
  const {
    totalGamesPlayed,
    totalTargetsHit,
    totalTargetsMissed,
    highestScore,
    highestCombo,
    perfectRounds,
    insaneModeCompleted
  } = stats

  if (totalGamesPlayed === 0) return 1000

  const accuracy = totalTargetsHit / (totalTargetsHit + totalTargetsMissed)
  const avgScore = highestScore / totalGamesPlayed
  const perfectRatio = perfectRounds / totalGamesPlayed
  const insaneRatio = insaneModeCompleted / totalGamesPlayed

  const skillRating = 
    (accuracy * 2000) +
    (avgScore * 0.01) +
    (highestCombo * 10) +
    (perfectRatio * 500) +
    (insaneRatio * 1000)

  return Math.min(Math.max(Math.round(skillRating), 100), 5000)
}

export function calculateConsistency(recentScores: number[]): number {
  if (recentScores.length < 2) return 0.5

  const mean = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
  const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / recentScores.length
  const stdDev = Math.sqrt(variance)
  const cv = stdDev / mean

  return Math.max(0, Math.min(1, 1 - cv))
}

export function determinePlayStyle(stats: PlayerStats, consistencyScore: number): 'aggressive' | 'consistent' | 'adaptive' {
  const avgTargetsPerGame = stats.totalTargetsHit / Math.max(stats.totalGamesPlayed, 1)
  const perfectRatio = stats.perfectRounds / Math.max(stats.totalGamesPlayed, 1)

  if (consistencyScore > 0.8 && perfectRatio > 0.3) {
    return 'consistent'
  } else if (stats.highestCombo > 15 && avgTargetsPerGame > 20) {
    return 'aggressive'
  } else {
    return 'adaptive'
  }
}

export function createPlayerSkillProfile(
  userId: string,
  username: string,
  stats: PlayerStats,
  recentScores: number[],
  avatarUrl?: string
): PlayerSkillProfile {
  const skillRating = calculateSkillRating(stats)
  const consistencyScore = calculateConsistency(recentScores)
  const playStyle = determinePlayStyle(stats, consistencyScore)

  const avgReactionTime = stats.totalPlayTime / Math.max(stats.totalTargetsHit, 1)
  
  const variance = recentScores.length > 1
    ? Math.sqrt(recentScores.reduce((sum, score) => {
        const mean = recentScores.reduce((s, sc) => s + sc, 0) / recentScores.length
        return sum + Math.pow(score - mean, 2)
      }, 0) / recentScores.length)
    : 0

  let preferredDifficulty: Difficulty = 'medium'
  if (skillRating > 3000) preferredDifficulty = 'insane'
  else if (skillRating > 2000) preferredDifficulty = 'hard'
  else if (skillRating < 1200) preferredDifficulty = 'easy'

  return {
    userId,
    username,
    avatarUrl,
    skillRating,
    consistencyScore,
    averageReactionTime: avgReactionTime,
    preferredDifficulty,
    recentPerformance: recentScores.slice(-10),
    volatility: variance / Math.max(skillRating, 1),
    playStyle
  }
}

export async function analyzeMatchmaking(
  players: PlayerSkillProfile[]
): Promise<MatchmakingResult> {
  if (players.length < 2) {
    return {
      pools: [],
      fairnessScore: 0,
      reasoning: 'Not enough players for matchmaking',
      confidence: 0
    }
  }

  const playerData = players.map(p => ({
    username: p.username,
    skillRating: p.skillRating,
    consistencyScore: p.consistencyScore,
    playStyle: p.playStyle,
    preferredDifficulty: p.preferredDifficulty
  }))

  const promptText = `You are an esports tournament matchmaking AI. Analyze these players and create balanced tournament groups.

Players:
${JSON.stringify(playerData, null, 2)}

Create balanced groups of 2-4 players each. Consider:
- Similar skill ratings (within 500 points ideally)
- Mix of play styles for interesting matches
- Preferred difficulty alignment
- Consistency scores for fair competition

Return a JSON object with this structure:
{
  "groups": [
    {
      "playerUsernames": ["player1", "player2"],
      "averageSkill": 2500,
      "skillVariance": 150,
      "recommendedDifficulty": "hard",
      "reasoning": "why these players match well"
    }
  ],
  "fairnessScore": 0.85,
  "overallReasoning": "explanation of matchmaking strategy",
  "confidence": 0.9
}`

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
    const aiResult = JSON.parse(response)

    const pools: PlayerGroup[] = aiResult.groups.map((group: any) => {
      const groupPlayers = players.filter(p => 
        group.playerUsernames.includes(p.username)
      )
      
      return {
        players: groupPlayers,
        averageSkill: group.averageSkill,
        skillVariance: group.skillVariance,
        recommendedDifficulty: group.recommendedDifficulty as Difficulty
      }
    })

    return {
      pools,
      fairnessScore: aiResult.fairnessScore,
      reasoning: aiResult.overallReasoning,
      confidence: aiResult.confidence
    }
  } catch (error) {
    console.error('AI matchmaking failed, using fallback:', error)
    return fallbackMatchmaking(players)
  }
}

function fallbackMatchmaking(players: PlayerSkillProfile[]): MatchmakingResult {
  const sorted = [...players].sort((a, b) => b.skillRating - a.skillRating)
  const pools: PlayerGroup[] = []

  for (let i = 0; i < sorted.length; i += 2) {
    if (i + 1 < sorted.length) {
      const p1 = sorted[i]
      const p2 = sorted[i + 1]
      pools.push({
        players: [p1, p2],
        averageSkill: (p1.skillRating + p2.skillRating) / 2,
        skillVariance: Math.abs(p1.skillRating - p2.skillRating),
        recommendedDifficulty: p1.preferredDifficulty
      })
    } else {
      pools.push({
        players: [sorted[i]],
        averageSkill: sorted[i].skillRating,
        skillVariance: 0,
        recommendedDifficulty: sorted[i].preferredDifficulty
      })
    }
  }

  return {
    pools,
    fairnessScore: 0.7,
    reasoning: 'Basic skill-based pairing',
    confidence: 0.6
  }
}

export async function predictMatchOutcome(
  player1: PlayerSkillProfile,
  player2: PlayerSkillProfile
): Promise<{
  player1WinProbability: number
  player2WinProbability: number
  competitivenessScore: number
  analysis: string
}> {
  const skillDiff = Math.abs(player1.skillRating - player2.skillRating)
  const avgSkill = (player1.skillRating + player2.skillRating) / 2

  const baseProb = 0.5 + (player1.skillRating - player2.skillRating) / (avgSkill * 4)
  
  const consistencyFactor = (player1.consistencyScore - player2.consistencyScore) * 0.1
  
  const player1Prob = Math.max(0.1, Math.min(0.9, baseProb + consistencyFactor))
  const player2Prob = 1 - player1Prob

  const competitiveness = Math.max(0, 1 - (skillDiff / 1000))

  const promptText = `Analyze this competitive matchup:

Player 1: ${player1.username}
- Skill: ${player1.skillRating}
- Style: ${player1.playStyle}
- Consistency: ${(player1.consistencyScore * 100).toFixed(0)}%

Player 2: ${player2.username}
- Skill: ${player2.skillRating}
- Style: ${player2.playStyle}
- Consistency: ${(player2.consistencyScore * 100).toFixed(0)}%

Predicted win probability: ${(player1Prob * 100).toFixed(0)}% vs ${(player2Prob * 100).toFixed(0)}%

Provide a brief, exciting analysis (2-3 sentences) of what makes this matchup interesting and what to watch for.`

  try {
    const analysis = await window.spark.llm(promptText, 'gpt-4o-mini', false)

    return {
      player1WinProbability: player1Prob,
      player2WinProbability: player2Prob,
      competitivenessScore: competitiveness,
      analysis: analysis.trim()
    }
  } catch (error) {
    return {
      player1WinProbability: player1Prob,
      player2WinProbability: player2Prob,
      competitivenessScore: competitiveness,
      analysis: `This ${competitiveness > 0.7 ? 'highly competitive' : 'interesting'} matchup features ${player1.username} (${player1.playStyle}) vs ${player2.username} (${player2.playStyle}).`
    }
  }
}

export function generateTournamentBracket(
  pools: PlayerGroup[],
  difficulty: Difficulty
): TournamentMatchup[] {
  const matchups: TournamentMatchup[] = []

  pools.forEach(pool => {
    if (pool.players.length >= 2) {
      for (let i = 0; i < pool.players.length; i += 2) {
        if (i + 1 < pool.players.length) {
          const p1 = pool.players[i]
          const p2 = pool.players[i + 1]
          const skillDiff = Math.abs(p1.skillRating - p2.skillRating)
          
          matchups.push({
            player1: p1,
            player2: p2,
            skillDifference: skillDiff,
            predictedCompetitiveness: Math.max(0, 1 - skillDiff / 1000),
            recommendedHandicap: skillDiff > 500 ? Math.round(skillDiff / 100) : undefined
          })
        }
      }
    }
  })

  return matchups
}

export function calculateTournamentSeeding(players: PlayerSkillProfile[]): PlayerSkillProfile[] {
  return [...players].sort((a, b) => {
    if (b.skillRating !== a.skillRating) {
      return b.skillRating - a.skillRating
    }
    if (b.consistencyScore !== a.consistencyScore) {
      return b.consistencyScore - a.consistencyScore
    }
    return b.recentPerformance.slice(-1)[0] - a.recentPerformance.slice(-1)[0]
  })
}

export async function recommendDifficulty(players: PlayerSkillProfile[]): Promise<Difficulty> {
  if (players.length === 0) return 'medium'

  const avgSkill = players.reduce((sum, p) => sum + p.skillRating, 0) / players.length

  if (avgSkill > 3000) return 'insane'
  if (avgSkill > 2000) return 'hard'
  if (avgSkill > 1200) return 'medium'
  return 'easy'
}
