import { Difficulty } from './game-types'

export interface Friend {
  id: string
  username: string
  avatarUrl?: string
  addedAt: number
  lastActive?: number
}

export interface FriendRequest {
  id: string
  fromUserId: string
  fromUsername: string
  fromAvatarUrl?: string
  toUserId: string
  toUsername: string
  sentAt: number
  status: 'pending' | 'accepted' | 'declined'
}

export interface Challenge {
  id: string
  fromUserId: string
  fromUsername: string
  toUserId: string
  toUsername: string
  difficulty: Difficulty
  createdAt: number
  expiresAt: number
  status: 'pending' | 'accepted' | 'declined' | 'completed'
  fromScore?: number
  toScore?: number
  fromGameData?: ChallengeGameData
  toGameData?: ChallengeGameData
  winner?: string
}

export interface ChallengeGameData {
  score: number
  targetsHit: number
  targetsMissed: number
  highestCombo: number
  completedAt: number
}

export interface PlayerProfile {
  userId: string
  username: string
  avatarUrl?: string
  email?: string
  level: number
  totalWins: number
  totalLosses: number
  winStreak: number
  bestScore: number
  favoriteMode?: Difficulty
  isOnline: boolean
  lastSeen: number
}

export interface ChallengeNotification {
  id: string
  type: 'challenge_received' | 'challenge_accepted' | 'challenge_completed' | 'challenge_won' | 'challenge_lost'
  challengeId: string
  fromUsername: string
  timestamp: number
  read: boolean
}

export function generateChallengeId(): string {
  return `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateFriendRequestId(): string {
  return `fr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function isChallengeExpired(challenge: Challenge): boolean {
  return Date.now() > challenge.expiresAt
}

export function getChallengeTimeRemaining(challenge: Challenge): string {
  const remaining = challenge.expiresAt - Date.now()
  if (remaining <= 0) return 'Expired'
  
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function determineChallengeWinner(challenge: Challenge): string | null {
  if (!challenge.fromScore || !challenge.toScore) return null
  
  if (challenge.fromScore > challenge.toScore) {
    return challenge.fromUserId
  } else if (challenge.toScore > challenge.fromScore) {
    return challenge.toUserId
  }
  return 'tie'
}

export function calculateWinRate(wins: number, losses: number): number {
  const total = wins + losses
  if (total === 0) return 0
  return Math.round((wins / total) * 100)
}

export function searchPlayers(query: string, currentUserId: string, allProfiles: PlayerProfile[]): PlayerProfile[] {
  const normalizedQuery = query.toLowerCase().trim()
  if (!normalizedQuery) return []
  
  return allProfiles
    .filter(profile => 
      profile.userId !== currentUserId && 
      profile.username.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 10)
}
