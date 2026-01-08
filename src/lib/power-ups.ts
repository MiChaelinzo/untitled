export type PowerUpType = 
  | 'time-slow' 
  | 'shield' 
  | 'multi-shot' 
  | 'score-boost' 
  | 'magnet'
  | 'freeze'
  | 'chain-lightning'

export interface PowerUp {
  id: string
  type: PowerUpType
  x: number
  y: number
  size: number
  icon: string
  name: string
  description: string
  duration: number
  spawnTime: number
  lifetime: number
  color: string
}

export interface ActivePowerUp {
  type: PowerUpType
  startTime: number
  duration: number
}

export const POWER_UP_CONFIG: Record<PowerUpType, {
  icon: string
  name: string
  description: string
  duration: number
  lifetime: number
  color: string
  size: number
  rarity: number
}> = {
  'time-slow': {
    icon: '⏰',
    name: 'Time Warp',
    description: 'Slows down target movement by 50%',
    duration: 5000,
    lifetime: 8000,
    color: 'oklch(0.70 0.25 280)',
    size: 50,
    rarity: 0.25
  },
  'shield': {
    icon: '🛡️',
    name: 'Shield',
    description: 'Protect against one missed target',
    duration: 15000,
    lifetime: 10000,
    color: 'oklch(0.75 0.22 220)',
    size: 50,
    rarity: 0.20
  },
  'multi-shot': {
    icon: '⚡',
    name: 'Multi-Shot',
    description: 'Next 5 hits count for double points',
    duration: 10000,
    lifetime: 8000,
    color: 'oklch(0.78 0.25 60)',
    size: 50,
    rarity: 0.25
  },
  'score-boost': {
    icon: '💎',
    name: 'Score Boost',
    description: '2x score multiplier for 8 seconds',
    duration: 8000,
    lifetime: 8000,
    color: 'oklch(0.75 0.28 350)',
    size: 50,
    rarity: 0.30
  },
  'magnet': {
    icon: '🧲',
    name: 'Target Magnet',
    description: 'Slows nearby targets and draws them together',
    duration: 6000,
    lifetime: 8000,
    color: 'oklch(0.68 0.22 15)',
    size: 50,
    rarity: 0.20
  },
  'freeze': {
    icon: '❄️',
    name: 'Freeze Blast',
    description: 'Freezes all targets for 4 seconds',
    duration: 4000,
    lifetime: 8000,
    color: 'oklch(0.80 0.18 220)',
    size: 50,
    rarity: 0.15
  },
  'chain-lightning': {
    icon: '⚡',
    name: 'Chain Lightning',
    description: 'Next hit chains to nearby targets',
    duration: 10000,
    lifetime: 8000,
    color: 'oklch(0.85 0.25 90)',
    size: 50,
    rarity: 0.18
  }
}

export const OCEAN_MODE_POWER_UPS: PowerUpType[] = [
  'time-slow',
  'shield',
  'score-boost',
  'magnet'
]

export const COSMIC_MODE_POWER_UPS: PowerUpType[] = [
  'freeze',
  'multi-shot',
  'chain-lightning',
  'score-boost'
]

export function shouldSpawnPowerUp(
  eventMode: 'ocean-wave' | 'cosmic-gravity',
  lastSpawnTime: number,
  currentTime: number
): boolean {
  const MIN_SPAWN_INTERVAL = 8000
  const MAX_SPAWN_INTERVAL = 15000
  const SPAWN_CHANCE = 0.3
  
  if (currentTime - lastSpawnTime < MIN_SPAWN_INTERVAL) {
    return false
  }
  
  if (currentTime - lastSpawnTime > MAX_SPAWN_INTERVAL) {
    return true
  }
  
  return Math.random() < SPAWN_CHANCE
}

export function createPowerUp(
  eventMode: 'ocean-wave' | 'cosmic-gravity',
  arenaWidth: number,
  arenaHeight: number
): PowerUp {
  const availablePowerUps = eventMode === 'ocean-wave' 
    ? OCEAN_MODE_POWER_UPS 
    : COSMIC_MODE_POWER_UPS
  
  const weightedPowerUps: PowerUpType[] = []
  availablePowerUps.forEach(type => {
    const config = POWER_UP_CONFIG[type]
    const weight = Math.floor(config.rarity * 10)
    for (let i = 0; i < weight; i++) {
      weightedPowerUps.push(type)
    }
  })
  
  const type = weightedPowerUps[Math.floor(Math.random() * weightedPowerUps.length)]
  const config = POWER_UP_CONFIG[type]
  
  const padding = 80
  const x = padding + Math.random() * (arenaWidth - padding * 2)
  const y = padding + Math.random() * (arenaHeight - padding * 2)
  
  return {
    id: `powerup-${Date.now()}-${Math.random()}`,
    type,
    x,
    y,
    size: config.size,
    icon: config.icon,
    name: config.name,
    description: config.description,
    duration: config.duration,
    spawnTime: Date.now(),
    lifetime: config.lifetime,
    color: config.color
  }
}

export function applyPowerUpEffect(
  type: PowerUpType,
  gameState: any,
  setGameState: (updater: (prev: any) => any) => void
): void {
  switch (type) {
    case 'time-slow':
    case 'shield':
    case 'multi-shot':
    case 'score-boost':
    case 'magnet':
    case 'freeze':
    case 'chain-lightning':
      break
  }
}

export function isPowerUpExpired(powerUp: PowerUp, currentTime: number): boolean {
  return currentTime - powerUp.spawnTime > powerUp.lifetime
}

export function isActivePowerUpExpired(activePowerUp: ActivePowerUp, currentTime: number): boolean {
  return currentTime - activePowerUp.startTime > activePowerUp.duration
}

export function getPowerUpModifiers(activePowerUps: ActivePowerUp[]) {
  let timeMultiplier = 1.0
  let scoreMultiplier = 1.0
  let hasShield = false
  let multiShotActive = false
  let magnetActive = false
  let freezeActive = false
  let chainLightningActive = false
  
  activePowerUps.forEach(powerUp => {
    switch (powerUp.type) {
      case 'time-slow':
        timeMultiplier *= 0.5
        break
      case 'score-boost':
        scoreMultiplier *= 2.0
        break
      case 'shield':
        hasShield = true
        break
      case 'multi-shot':
        multiShotActive = true
        break
      case 'magnet':
        magnetActive = true
        break
      case 'freeze':
        freezeActive = true
        break
      case 'chain-lightning':
        chainLightningActive = true
        break
    }
  })
  
  return {
    timeMultiplier,
    scoreMultiplier,
    hasShield,
    multiShotActive,
    magnetActive,
    freezeActive,
    chainLightningActive
  }
}
