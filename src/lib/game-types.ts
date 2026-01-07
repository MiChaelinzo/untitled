export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane'

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
  difficulty: Difficulty
}

export interface LeaderboardEntry {
  name: string
  score: number
  timestamp: number
  rounds: number
  difficulty: Difficulty
}

export interface RoundConfig {
  targets: number
  duration: number
  name: string
  targetSize: number
}

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  name: string
  description: string
  rounds: Record<number, RoundConfig>
  scoreMultiplier: number
}> = {
  easy: {
    name: 'Easy',
    description: 'Generous timing and larger targets',
    scoreMultiplier: 1,
    rounds: {
      1: { targets: 10, duration: 4000, name: 'Warm Up', targetSize: 100 },
      2: { targets: 15, duration: 3000, name: 'Pro League', targetSize: 90 },
      3: { targets: 20, duration: 2500, name: 'Championship', targetSize: 80 }
    }
  },
  medium: {
    name: 'Medium',
    description: 'Balanced challenge for most players',
    scoreMultiplier: 1.5,
    rounds: {
      1: { targets: 10, duration: 3000, name: 'Warm Up', targetSize: 80 },
      2: { targets: 15, duration: 2000, name: 'Pro League', targetSize: 75 },
      3: { targets: 20, duration: 1500, name: 'Championship', targetSize: 70 }
    }
  },
  hard: {
    name: 'Hard',
    description: 'Fast reflexes required',
    scoreMultiplier: 2,
    rounds: {
      1: { targets: 15, duration: 2000, name: 'Warm Up', targetSize: 70 },
      2: { targets: 20, duration: 1500, name: 'Pro League', targetSize: 60 },
      3: { targets: 25, duration: 1000, name: 'Championship', targetSize: 55 }
    }
  },
  insane: {
    name: 'Insane',
    description: 'Pro-level reflexes only',
    scoreMultiplier: 3,
    rounds: {
      1: { targets: 20, duration: 1500, name: 'Warm Up', targetSize: 60 },
      2: { targets: 25, duration: 1000, name: 'Pro League', targetSize: 50 },
      3: { targets: 30, duration: 800, name: 'Championship', targetSize: 45 }
    }
  }
}

export const MAX_SCORE_PER_TARGET = 1000
export const MIN_SCORE_PER_TARGET = 100
