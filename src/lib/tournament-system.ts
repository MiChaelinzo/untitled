import { Difficulty } from './game-types'

export type TournamentStatus = 'pending' | 'active' | 'completed'
export type MatchStatus = 'pending' | 'in-progress' | 'completed'

export interface TournamentPlayer {
  id: string
  username: string
  avatarUrl?: string
  seed: number
}

export interface Match {
  id: string
  roundNumber: number
  matchNumber: number
  player1: TournamentPlayer
  player2: TournamentPlayer
  player1Score?: number
  player2Score?: number
  winnerId?: string
  status: MatchStatus
  difficulty: Difficulty
}

export interface Tournament {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  players: TournamentPlayer[]
  matches: Match[]
  rounds: number
  currentRound: number
  status: TournamentStatus
  winnerId?: string
  createdAt: number
  startedAt?: number
  completedAt?: number
}

export function createTournament(
  name: string,
  difficulty: Difficulty,
  players: TournamentPlayer[]
): Tournament {
  if (players.length < 2 || players.length > 16) {
    throw new Error('Tournament must have 2-16 players')
  }

  const powerOfTwo = Math.pow(2, Math.ceil(Math.log2(players.length)))
  const totalRounds = Math.log2(powerOfTwo)

  const matches = generateFirstRoundMatches(players, difficulty)

  return {
    id: `tournament_${Date.now()}`,
    name,
    description: `${players.length}-player tournament on ${difficulty} difficulty`,
    difficulty,
    players,
    matches,
    rounds: totalRounds,
    currentRound: 1,
    status: 'pending',
    createdAt: Date.now()
  }
}

function generateFirstRoundMatches(
  players: TournamentPlayer[],
  difficulty: Difficulty
): Match[] {
  const matches: Match[] = []
  const sortedPlayers = [...players].sort((a, b) => a.seed - b.seed)
  
  let matchNumber = 1
  for (let i = 0; i < sortedPlayers.length; i += 2) {
    if (i + 1 < sortedPlayers.length) {
      matches.push({
        id: `match_1_${matchNumber}`,
        roundNumber: 1,
        matchNumber,
        player1: sortedPlayers[i],
        player2: sortedPlayers[i + 1],
        status: 'pending',
        difficulty
      })
      matchNumber++
    } else {
      matches.push({
        id: `match_1_${matchNumber}`,
        roundNumber: 1,
        matchNumber,
        player1: sortedPlayers[i],
        player2: { ...sortedPlayers[i], username: 'BYE' },
        player1Score: 0,
        player2Score: 0,
        winnerId: sortedPlayers[i].id,
        status: 'completed',
        difficulty
      })
      matchNumber++
    }
  }

  return matches
}

export function advanceTournament(tournament: Tournament): Tournament {
  const currentRoundMatches = tournament.matches.filter(
    m => m.roundNumber === tournament.currentRound
  )

  const allCompleted = currentRoundMatches.every(m => m.status === 'completed')

  if (!allCompleted) {
    return tournament
  }

  if (tournament.currentRound === tournament.rounds) {
    const finalMatch = currentRoundMatches[0]
    return {
      ...tournament,
      status: 'completed',
      winnerId: finalMatch.winnerId,
      completedAt: Date.now()
    }
  }

  const winners = currentRoundMatches
    .filter(m => m.winnerId)
    .map(m => {
      const winner = m.player1.id === m.winnerId ? m.player1 : m.player2
      return winner
    })

  const nextRoundMatches: Match[] = []
  let matchNumber = 1

  for (let i = 0; i < winners.length; i += 2) {
    if (i + 1 < winners.length) {
      nextRoundMatches.push({
        id: `match_${tournament.currentRound + 1}_${matchNumber}`,
        roundNumber: tournament.currentRound + 1,
        matchNumber,
        player1: winners[i],
        player2: winners[i + 1],
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

export function updateMatchScore(
  tournament: Tournament,
  matchId: string,
  playerId: string,
  score: number
): Tournament {
  const matches = tournament.matches.map(match => {
    if (match.id !== matchId) return match

    const isPlayer1 = match.player1.id === playerId
    const updatedMatch = { ...match }

    if (isPlayer1) {
      updatedMatch.player1Score = score
    } else {
      updatedMatch.player2Score = score
    }

    if (updatedMatch.player1Score !== undefined && updatedMatch.player2Score !== undefined) {
      if (updatedMatch.player1Score > updatedMatch.player2Score) {
        updatedMatch.winnerId = match.player1.id
      } else if (updatedMatch.player2Score > updatedMatch.player1Score) {
        updatedMatch.winnerId = match.player2.id
      } else {
        updatedMatch.winnerId = updatedMatch.player1Score >= updatedMatch.player2Score
          ? match.player1.id
          : match.player2.id
      }
      updatedMatch.status = 'completed'
    } else {
      updatedMatch.status = 'in-progress'
    }

    return updatedMatch
  })

  return {
    ...tournament,
    matches
  }
}

export function getTournamentWinner(tournament: Tournament): TournamentPlayer | null {
  if (tournament.status !== 'completed' || !tournament.winnerId) {
    return null
  }

  return tournament.players.find(p => p.id === tournament.winnerId) || null
}

export function getPlayerNextMatch(tournament: Tournament, playerId: string): Match | null {
  const playerMatches = tournament.matches.filter(
    m => (m.player1.id === playerId || m.player2.id === playerId) && m.status === 'pending'
  )

  if (playerMatches.length === 0) return null

  return playerMatches.sort((a, b) => a.roundNumber - b.roundNumber)[0]
}
