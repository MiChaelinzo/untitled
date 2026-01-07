import { Difficulty } from './game-types'
import { PlayerSkillProfile } from './ai-matchmaking'

export type TeamSize = '2v2' | '3v3'
export type TeamTournamentStatus = 'pending' | 'active' | 'completed'
export type TeamMatchStatus = 'pending' | 'in-progress' | 'completed'

export interface TeamPlayer {
  id: string
  username: string
  avatarUrl?: string
  skillRating: number
  role?: 'captain' | 'member'
}

export interface Team {
  id: string
  name: string
  color: string
  players: TeamPlayer[]
  averageSkill: number
  captain: TeamPlayer
  wins: number
  losses: number
}

export interface TeamMatch {
  id: string
  roundNumber: number
  matchNumber: number
  team1: Team
  team2: Team
  team1Score?: number
  team2Score?: number
  team1PlayerScores?: Record<string, number>
  team2PlayerScores?: Record<string, number>
  winnerTeamId?: string
  status: TeamMatchStatus
  difficulty: Difficulty
  scheduledTime?: number
  completedAt?: number
}

export interface TeamTournament {
  id: string
  name: string
  description: string
  teamSize: TeamSize
  difficulty: Difficulty
  teams: Team[]
  matches: TeamMatch[]
  rounds: number
  currentRound: number
  status: TeamTournamentStatus
  winnerTeamId?: string
  createdAt: number
  startedAt?: number
  completedAt?: number
  prize?: string
}

export interface TeamMatchmakingResult {
  teams: Team[]
  balanceScore: number
  reasoning: string
  confidence: number
}

const TEAM_COLORS = [
  '#6B7FFF',
  '#FF6B9D',
  '#FFB86B',
  '#6BFFD6',
  '#C96BFF',
  '#FF6B6B',
  '#6BFFB8',
  '#FFD66B'
]

export function createTeam(
  players: PlayerSkillProfile[],
  teamName?: string,
  color?: string
): Team {
  if (players.length < 2 || players.length > 3) {
    throw new Error('Team must have 2-3 players')
  }

  const averageSkill = players.reduce((sum, p) => sum + p.skillRating, 0) / players.length
  
  const captain = players.reduce((highest, current) => 
    current.skillRating > highest.skillRating ? current : highest
  )

  const teamPlayers: TeamPlayer[] = players.map(p => ({
    id: p.userId,
    username: p.username,
    avatarUrl: p.avatarUrl,
    skillRating: p.skillRating,
    role: p.userId === captain.userId ? 'captain' : 'member'
  }))

  return {
    id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: teamName || `Team ${captain.username}`,
    color: color || TEAM_COLORS[Math.floor(Math.random() * TEAM_COLORS.length)],
    players: teamPlayers,
    averageSkill,
    captain: teamPlayers.find(p => p.id === captain.userId)!,
    wins: 0,
    losses: 0
  }
}

export async function balanceTeams(
  players: PlayerSkillProfile[],
  teamSize: TeamSize
): Promise<TeamMatchmakingResult> {
  const playersPerTeam = teamSize === '2v2' ? 2 : 3
  const numberOfTeams = Math.floor(players.length / playersPerTeam)

  if (numberOfTeams < 2) {
    return {
      teams: [],
      balanceScore: 0,
      reasoning: 'Not enough players for team matchmaking',
      confidence: 0
    }
  }

  const promptText = `You are an esports tournament matchmaking AI. Create balanced ${teamSize} teams from these players.

Players:
${players.map(p => `${p.username} - Skill: ${p.skillRating}, Style: ${p.playStyle}, Consistency: ${(p.consistencyScore * 100).toFixed(0)}%`).join('\n')}

Create ${numberOfTeams} teams with ${playersPerTeam} players each. Goals:
- Balance team average skill ratings (within 300 points ideally)
- Mix play styles within teams for synergy
- Pair consistent players with aggressive players
- Consider chemistry and complementary skills

Return a JSON object with this structure:
{
  "teams": [
    {
      "teamName": "Team Alpha",
      "playerUsernames": ["player1", "player2"],
      "averageSkill": 2500,
      "synergy": "high",
      "reasoning": "why these players work well together"
    }
  ],
  "balanceScore": 0.85,
  "overallReasoning": "explanation of team balance strategy",
  "confidence": 0.9
}`

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
    const aiResult = JSON.parse(response)

    const teams: Team[] = aiResult.teams.map((teamData: any, index: number) => {
      const teamPlayers = players.filter(p => 
        teamData.playerUsernames.includes(p.username)
      )
      return createTeam(teamPlayers, teamData.teamName, TEAM_COLORS[index % TEAM_COLORS.length])
    })

    return {
      teams,
      balanceScore: aiResult.balanceScore,
      reasoning: aiResult.overallReasoning,
      confidence: aiResult.confidence
    }
  } catch (error) {
    console.error('AI team balancing failed, using fallback:', error)
    return fallbackTeamBalance(players, teamSize)
  }
}

function fallbackTeamBalance(
  players: PlayerSkillProfile[],
  teamSize: TeamSize
): TeamMatchmakingResult {
  const playersPerTeam = teamSize === '2v2' ? 2 : 3
  const sorted = [...players].sort((a, b) => b.skillRating - a.skillRating)
  const teams: Team[] = []

  for (let i = 0; i < sorted.length; i += playersPerTeam) {
    if (i + playersPerTeam <= sorted.length) {
      const teamPlayers = sorted.slice(i, i + playersPerTeam)
      teams.push(createTeam(teamPlayers, undefined, TEAM_COLORS[teams.length % TEAM_COLORS.length]))
    }
  }

  return {
    teams,
    balanceScore: 0.7,
    reasoning: 'Basic skill-based team distribution',
    confidence: 0.6
  }
}

export function createTeamTournament(
  name: string,
  teamSize: TeamSize,
  difficulty: Difficulty,
  teams: Team[]
): TeamTournament {
  if (teams.length < 2 || teams.length > 8) {
    throw new Error('Tournament must have 2-8 teams')
  }

  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(teams.length)))
  const totalRounds = Math.log2(powerOfTwo)

  const matches = generateFirstRoundTeamMatches(teams, difficulty)

  return {
    id: `team_tournament_${Date.now()}`,
    name,
    description: `${teams.length}-team ${teamSize} tournament on ${difficulty} difficulty`,
    teamSize,
    difficulty,
    teams,
    matches,
    rounds: totalRounds,
    currentRound: 1,
    status: 'pending',
    createdAt: Date.now()
  }
}

function generateFirstRoundTeamMatches(
  teams: Team[],
  difficulty: Difficulty
): TeamMatch[] {
  const matches: TeamMatch[] = []
  let matchNumber = 1

  for (let i = 0; i < teams.length; i += 2) {
    if (i + 1 < teams.length) {
      matches.push({
        id: `team_match_1_${matchNumber}`,
        roundNumber: 1,
        matchNumber,
        team1: teams[i],
        team2: teams[i + 1],
        status: 'pending',
        difficulty
      })
      matchNumber++
    } else {
      matches.push({
        id: `team_match_1_${matchNumber}`,
        roundNumber: 1,
        matchNumber,
        team1: teams[i],
        team2: teams[i],
        team1Score: 0,
        winnerTeamId: teams[i].id,
        status: 'completed',
        difficulty
      })
      matchNumber++
    }
  }

  return matches
}

export function advanceTeamTournament(tournament: TeamTournament): TeamTournament {
  const currentRoundMatches = tournament.matches.filter(
    m => m.roundNumber === tournament.currentRound
  )

  const allCompleted = currentRoundMatches.every(m => m.status === 'completed')

  if (!allCompleted) {
    return tournament
  }

  if (tournament.currentRound === tournament.rounds) {
    const finalMatch = currentRoundMatches[0]
    const winnerTeam = tournament.teams.find(t => t.id === finalMatch.winnerTeamId)
    
    return {
      ...tournament,
      status: 'completed',
      winnerTeamId: finalMatch.winnerTeamId,
      completedAt: Date.now()
    }
  }

  const winnerTeams = currentRoundMatches
    .filter(m => m.winnerTeamId)
    .map(m => {
      const winner = m.team1.id === m.winnerTeamId ? m.team1 : m.team2
      return winner
    })

  const nextRoundMatches: TeamMatch[] = []
  let matchNumber = 1

  for (let i = 0; i < winnerTeams.length; i += 2) {
    if (i + 1 < winnerTeams.length) {
      nextRoundMatches.push({
        id: `team_match_${tournament.currentRound + 1}_${matchNumber}`,
        roundNumber: tournament.currentRound + 1,
        matchNumber,
        team1: winnerTeams[i],
        team2: winnerTeams[i + 1],
        status: 'pending',
        difficulty: tournament.difficulty
      })
      matchNumber++
    }
  }

  return {
    ...tournament,
    matches: [...tournament.matches, ...nextRoundMatches],
    currentRound: tournament.currentRound + 1
  }
}

export function updateTeamMatchScore(
  tournament: TeamTournament,
  matchId: string,
  teamId: string,
  teamScore: number,
  playerScores?: Record<string, number>
): TeamTournament {
  const matches = tournament.matches.map(match => {
    if (match.id !== matchId) return match

    const isTeam1 = match.team1.id === teamId
    const updatedMatch = { ...match }

    if (isTeam1) {
      updatedMatch.team1Score = teamScore
      if (playerScores) {
        updatedMatch.team1PlayerScores = playerScores
      }
    } else {
      updatedMatch.team2Score = teamScore
      if (playerScores) {
        updatedMatch.team2PlayerScores = playerScores
      }
    }

    if (updatedMatch.team1Score !== undefined && updatedMatch.team2Score !== undefined) {
      if (updatedMatch.team1Score > updatedMatch.team2Score) {
        updatedMatch.winnerTeamId = match.team1.id
      } else if (updatedMatch.team2Score > updatedMatch.team1Score) {
        updatedMatch.winnerTeamId = match.team2.id
      } else {
        updatedMatch.winnerTeamId = updatedMatch.team1Score >= updatedMatch.team2Score
          ? match.team1.id
          : match.team2.id
      }
      updatedMatch.status = 'completed'
      updatedMatch.completedAt = Date.now()
    } else {
      updatedMatch.status = 'in-progress'
    }

    return updatedMatch
  })

  const updatedTeams = tournament.teams.map(team => {
    const completedMatches = matches.filter(m => 
      (m.team1.id === team.id || m.team2.id === team.id) && m.status === 'completed'
    )
    
    const wins = completedMatches.filter(m => m.winnerTeamId === team.id).length
    const losses = completedMatches.filter(m => 
      m.winnerTeamId && m.winnerTeamId !== team.id
    ).length

    return {
      ...team,
      wins,
      losses
    }
  })

  return {
    ...tournament,
    matches,
    teams: updatedTeams
  }
}

export function getTeamNextMatch(
  tournament: TeamTournament,
  teamId: string
): TeamMatch | null {
  const teamMatches = tournament.matches.filter(
    m => (m.team1.id === teamId || m.team2.id === teamId) && m.status === 'pending'
  )

  if (teamMatches.length === 0) return null

  return teamMatches.sort((a, b) => a.roundNumber - b.roundNumber)[0]
}

export function getTeamTournamentWinner(tournament: TeamTournament): Team | null {
  if (tournament.status !== 'completed' || !tournament.winnerTeamId) {
    return null
  }

  return tournament.teams.find(t => t.id === tournament.winnerTeamId) || null
}

export async function predictTeamMatchOutcome(
  team1: Team,
  team2: Team
): Promise<{
  team1WinProbability: number
  team2WinProbability: number
  competitivenessScore: number
  analysis: string
  keyFactors: string[]
}> {
  const skillDiff = Math.abs(team1.averageSkill - team2.averageSkill)
  const avgSkill = (team1.averageSkill + team2.averageSkill) / 2

  const baseProb = 0.5 + (team1.averageSkill - team2.averageSkill) / (avgSkill * 4)
  
  const team1Prob = Math.max(0.1, Math.min(0.9, baseProb))
  const team2Prob = 1 - team1Prob

  const competitiveness = Math.max(0, 1 - (skillDiff / 800))

  const promptText = `Analyze this team matchup:

Team 1: ${team1.name}
${team1.players.map(p => `- ${p.username} (${p.role}) - Skill: ${p.skillRating}`).join('\n')}
Average Skill: ${team1.averageSkill.toFixed(0)}

Team 2: ${team2.name}
${team2.players.map(p => `- ${p.username} (${p.role}) - Skill: ${p.skillRating}`).join('\n')}
Average Skill: ${team2.averageSkill.toFixed(0)}

Predicted win probability: ${(team1Prob * 100).toFixed(0)}% vs ${(team2Prob * 100).toFixed(0)}%

Provide:
1. A brief, exciting analysis (2-3 sentences) of what makes this matchup interesting
2. Three key factors that will determine the match outcome

Return as JSON:
{
  "analysis": "your analysis here",
  "keyFactors": ["factor 1", "factor 2", "factor 3"]
}`

  try {
    const response = await window.spark.llm(promptText, 'gpt-4o-mini', true)
    const aiResult = JSON.parse(response)

    return {
      team1WinProbability: team1Prob,
      team2WinProbability: team2Prob,
      competitivenessScore: competitiveness,
      analysis: aiResult.analysis,
      keyFactors: aiResult.keyFactors
    }
  } catch (error) {
    return {
      team1WinProbability: team1Prob,
      team2WinProbability: team2Prob,
      competitivenessScore: competitiveness,
      analysis: `This ${competitiveness > 0.7 ? 'highly competitive' : 'intriguing'} ${team1.players.length}v${team2.players.length} matchup features ${team1.name} vs ${team2.name}.`,
      keyFactors: [
        'Team coordination and communication',
        'Individual player performance under pressure',
        'Strategic adaptability'
      ]
    }
  }
}

export function calculateTeamSynergy(team: Team): number {
  if (team.players.length < 2) return 1

  const skillVariance = team.players.reduce((variance, player) => {
    return variance + Math.pow(player.skillRating - team.averageSkill, 2)
  }, 0) / team.players.length

  const normalizedVariance = skillVariance / (team.averageSkill * team.averageSkill)
  
  return Math.max(0, Math.min(1, 1 - normalizedVariance))
}
