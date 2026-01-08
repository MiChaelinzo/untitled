export interface CustomDifficulty {
  id: string
  name: string
  description: string
  targetDuration: [number, number, number]
  targetSize: [number, number, number]
  targetsPerRound: [number, number, number]
  scoreMultiplier: number
  spawnDelay: number
  color: string
  icon: string
  createdAt: number
  timesPlayed: number
  highScore: number
}

export function createCustomDifficulty(
  name: string,
  description: string,
  params: {
    targetDuration: [number, number, number]
    targetSize: [number, number, number]
    targetsPerRound: [number, number, number]
    scoreMultiplier: number
    spawnDelay: number
  }
): CustomDifficulty {
  return {
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    targetDuration: params.targetDuration,
    targetSize: params.targetSize,
    targetsPerRound: params.targetsPerRound,
    scoreMultiplier: params.scoreMultiplier,
    spawnDelay: params.spawnDelay,
    color: 'oklch(0.60 0.20 280)',
    icon: 'wrench',
    createdAt: Date.now(),
    timesPlayed: 0,
    highScore: 0
  }
}

export function validateCustomDifficulty(difficulty: Partial<CustomDifficulty>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (!difficulty.name || difficulty.name.length < 3) {
    errors.push('Name must be at least 3 characters')
  }
  
  if (!difficulty.targetDuration || difficulty.targetDuration.some(d => d < 500 || d > 10000)) {
    errors.push('Target duration must be between 500ms and 10000ms')
  }
  
  if (!difficulty.targetSize || difficulty.targetSize.some(s => s < 30 || s > 150)) {
    errors.push('Target size must be between 30px and 150px')
  }
  
  if (!difficulty.targetsPerRound || difficulty.targetsPerRound.some(t => t < 5 || t > 50)) {
    errors.push('Targets per round must be between 5 and 50')
  }
  
  if (!difficulty.scoreMultiplier || difficulty.scoreMultiplier < 0.5 || difficulty.scoreMultiplier > 5) {
    errors.push('Score multiplier must be between 0.5x and 5x')
  }
  
  if (!difficulty.spawnDelay || difficulty.spawnDelay < 100 || difficulty.spawnDelay > 3000) {
    errors.push('Spawn delay must be between 100ms and 3000ms')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

export const PRESET_CUSTOM_DIFFICULTIES: Partial<CustomDifficulty>[] = [
  {
    name: 'Sniper Mode',
    description: 'Tiny targets, generous time',
    targetDuration: [5000, 4000, 3500],
    targetSize: [40, 35, 30],
    targetsPerRound: [15, 20, 25],
    scoreMultiplier: 2.5,
    spawnDelay: 800
  },
  {
    name: 'Blitz',
    description: 'Large targets, ultra fast',
    targetDuration: [800, 600, 500],
    targetSize: [100, 95, 90],
    targetsPerRound: [30, 35, 40],
    scoreMultiplier: 2.0,
    spawnDelay: 200
  },
  {
    name: 'Zen Mode',
    description: 'Relaxed practice',
    targetDuration: [6000, 5000, 4000],
    targetSize: [110, 100, 90],
    targetsPerRound: [10, 12, 15],
    scoreMultiplier: 1.0,
    spawnDelay: 1200
  },
  {
    name: 'Chaos',
    description: 'Random everything',
    targetDuration: [2000, 1500, 1000],
    targetSize: [70, 60, 50],
    targetsPerRound: [25, 30, 35],
    scoreMultiplier: 3.0,
    spawnDelay: 300
  }
]
