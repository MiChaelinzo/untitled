export interface Target {
  id: string
  x: number
  y: number
  spawnTime: number
  duration: number
}

export interface GameState {
  phase: 'menu' | 'playing' | 'roundTransition' | 'gameOver'
  round: number
  score: number
  combo: number
  targetsHit: number
  targetsMissed: number
  currentTarget: Target | null
  roundTargetsRemaining: number
}

export interface LeaderboardEntry {
  name: string
  score: number
  timestamp: number
  rounds: number
}

export const ROUND_CONFIG = {
  1: { targets: 10, duration: 3000, name: 'Warm Up' },
  2: { targets: 15, duration: 2000, name: 'Pro League' },
  3: { targets: 20, duration: 1500, name: 'Championship' }
}

export const MAX_SCORE_PER_TARGET = 1000
export const MIN_SCORE_PER_TARGET = 100
