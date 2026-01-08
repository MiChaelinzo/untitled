import { Difficulty, Target } from './game-types'

export type EventGameModeId = 
  | 'winter-frostbite'
  | 'lunar-fireworks'
  | 'valentines-heartshot'
  | 'halloween-phantom'
  | 'cyber-speed-run'
  | 'ocean-wave'
  | 'cosmic-gravity'
  | 'arcade-retro'
  | 'neon-pulse'
  | 'spring-butterfly'

export interface EventGameMode {
  id: EventGameModeId
  name: string
  description: string
  icon: string
  eventId: string
  mechanics: GameMechanic[]
  visualEffects: VisualEffect[]
  scoreModifier: number
  unlockRequirement?: {
    eventChallengesCompleted?: number
    eventScore?: number
  }
}

export interface GameMechanic {
  type: 'spawn-pattern' | 'target-behavior' | 'scoring' | 'time-manipulation' | 'multi-target' | 'shield' | 'power-up'
  name: string
  description: string
  config: any
}

export interface VisualEffect {
  type: 'particle' | 'background' | 'target-style' | 'trail' | 'screen-effect'
  effect: string
  intensity: number
  color?: string
}

export interface EventTarget extends Target {
  type?: 'normal' | 'bonus' | 'penalty' | 'multi' | 'shield' | 'power-up'
  value?: number
  effect?: string
  velocity?: { x: number; y: number }
  radius?: number
}

export const EVENT_GAME_MODES: EventGameMode[] = [
  {
    id: 'winter-frostbite',
    name: 'Frostbite Rush',
    description: 'Targets freeze and shatter! Hit frozen targets for bonus points, but miss and they multiply!',
    icon: '❄️',
    eventId: 'winter-wonderland-2024',
    scoreModifier: 1.5,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Freeze & Shatter',
        description: 'Targets slow down over time and award bonus points when frozen',
        config: {
          freezeTime: 2000,
          freezeBonus: 2.0,
          shatterEffect: true
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Snowstorm',
        description: 'Multiple targets spawn in clusters',
        config: {
          clusterSize: 3,
          clusterRadius: 150
        }
      },
      {
        type: 'power-up',
        name: 'Ice Blast',
        description: 'Freezes all targets on screen for 3 seconds',
        config: {
          duration: 3000,
          spawnChance: 0.15
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'snow',
        intensity: 1.5
      },
      {
        type: 'target-style',
        effect: 'ice-crystal',
        intensity: 1.0,
        color: 'oklch(0.85 0.12 180)'
      },
      {
        type: 'trail',
        effect: 'frost',
        intensity: 0.8,
        color: 'oklch(0.78 0.15 220)'
      }
    ]
  },
  {
    id: 'lunar-fireworks',
    name: 'Fireworks Frenzy',
    description: 'Targets explode in fireworks! Chain reactions earn massive combos and lucky numbers give bonus points!',
    icon: '🎆',
    eventId: 'lunar-celebration-2025',
    scoreModifier: 1.8,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Chain Reaction',
        description: 'Hit targets create explosions that destroy nearby targets',
        config: {
          explosionRadius: 100,
          chainBonus: 1.5,
          maxChain: 5
        }
      },
      {
        type: 'scoring',
        name: 'Lucky Numbers',
        description: 'Scores ending in 8 or 88 earn bonus points',
        config: {
          luckyEnding: [8, 88, 888],
          bonusMultiplier: 2.0
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Festival Burst',
        description: 'Targets spawn in circular patterns',
        config: {
          pattern: 'circular',
          targetCount: 8,
          radius: 200
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'fireworks',
        intensity: 2.0
      },
      {
        type: 'target-style',
        effect: 'lantern',
        intensity: 1.2,
        color: 'oklch(0.75 0.25 45)'
      },
      {
        type: 'screen-effect',
        effect: 'golden-glow',
        intensity: 0.6,
        color: 'oklch(0.70 0.28 15)'
      }
    ]
  },
  {
    id: 'valentines-heartshot',
    name: 'Heartshot Harmony',
    description: 'Hit paired hearts together! Hitting both hearts in a pair awards massive bonus points!',
    icon: '💕',
    eventId: 'valentines-heartbreaker-2025',
    scoreModifier: 1.4,
    mechanics: [
      {
        type: 'multi-target',
        name: 'Heart Pairs',
        description: 'Targets spawn in connected pairs',
        config: {
          pairBonus: 3.0,
          pairTimeWindow: 1000,
          heartConnection: true
        }
      },
      {
        type: 'target-behavior',
        name: 'Magnetic Hearts',
        description: 'Paired hearts orbit each other',
        config: {
          orbitSpeed: 0.5,
          orbitRadius: 80,
          attractionForce: 0.3
        }
      },
      {
        type: 'scoring',
        name: 'Love Streak',
        description: 'Consecutive pair hits increase multiplier',
        config: {
          streakMultiplier: 0.5,
          maxMultiplier: 5.0
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'hearts',
        intensity: 1.8
      },
      {
        type: 'target-style',
        effect: 'heart-shaped',
        intensity: 1.0,
        color: 'oklch(0.75 0.25 350)'
      },
      {
        type: 'trail',
        effect: 'romantic',
        intensity: 1.0,
        color: 'oklch(0.70 0.28 15)'
      }
    ]
  },
  {
    id: 'halloween-phantom',
    name: 'Phantom Hunt',
    description: 'Targets phase in and out of visibility! Time your shots to hit them when they materialize!',
    icon: '👻',
    eventId: 'halloween-spooktacular-2024',
    scoreModifier: 1.66,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Phase Shift',
        description: 'Targets fade in and out, only hittable when visible',
        config: {
          phaseInterval: 1500,
          visibleDuration: 800,
          fadeTime: 300
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Spectral Swarm',
        description: 'Ghosts spawn in haunting patterns',
        config: {
          pattern: 'spiral',
          spawnDelay: 200,
          ghostTrail: true
        }
      },
      {
        type: 'power-up',
        name: 'Spirit Vision',
        description: 'Temporarily makes all targets fully visible',
        config: {
          duration: 5000,
          spawnChance: 0.1
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'flames',
        intensity: 1.5
      },
      {
        type: 'target-style',
        effect: 'ghostly',
        intensity: 0.7,
        color: 'oklch(0.58 0.28 290)'
      },
      {
        type: 'screen-effect',
        effect: 'dark-vignette',
        intensity: 0.8
      }
    ]
  },
  {
    id: 'cyber-speed-run',
    name: 'Cyber Speed Run',
    description: 'Time attack mode! Faster hits earn bigger bonuses. Maintain your speed streak!',
    icon: '⚡',
    eventId: 'cyber-week-2025',
    scoreModifier: 2.0,
    mechanics: [
      {
        type: 'time-manipulation',
        name: 'Speed Bonus',
        description: 'Faster reaction times award bonus multipliers',
        config: {
          baseTimeWindow: 500,
          bonusPerMs: 2,
          maxBonus: 3.0
        }
      },
      {
        type: 'scoring',
        name: 'Velocity Streak',
        description: 'Consecutive fast hits increase multiplier',
        config: {
          fastThreshold: 300,
          streakBonus: 0.3,
          maxStreak: 10
        }
      },
      {
        type: 'target-behavior',
        name: 'Neon Rush',
        description: 'Targets move faster but award more points',
        config: {
          speedMultiplier: 1.5,
          movementPattern: 'linear'
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'sparkles',
        intensity: 2.0
      },
      {
        type: 'target-style',
        effect: 'neon-glow',
        intensity: 1.5,
        color: 'oklch(0.70 0.28 280)'
      },
      {
        type: 'trail',
        effect: 'lightning',
        intensity: 1.2,
        color: 'oklch(0.65 0.25 15)'
      },
      {
        type: 'screen-effect',
        effect: 'speed-lines',
        intensity: 1.0
      }
    ]
  },
  {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    description: 'Targets flow in wave patterns! Ride the wave and hit targets in sequence for bonus points!',
    icon: '🌊',
    eventId: 'ocean-odyssey-2025',
    scoreModifier: 1.5,
    mechanics: [
      {
        type: 'spawn-pattern',
        name: 'Tidal Wave',
        description: 'Targets spawn in flowing wave patterns',
        config: {
          waveAmplitude: 100,
          waveFrequency: 2,
          waveSpeed: 1.0
        }
      },
      {
        type: 'target-behavior',
        name: 'Current Flow',
        description: 'Targets drift with ocean current',
        config: {
          driftSpeed: 0.3,
          driftDirection: 'horizontal',
          buoyancy: true
        }
      },
      {
        type: 'scoring',
        name: 'Wave Riding',
        description: 'Hit targets in wave sequence for bonus',
        config: {
          sequenceBonus: 2.0,
          sequenceWindow: 1500
        }
      },
      {
        type: 'power-up',
        name: 'Ocean Power-Ups',
        description: 'Collect power-ups for special abilities',
        config: {
          types: ['time-slow', 'shield', 'score-boost', 'magnet'],
          spawnChance: 0.3,
          minInterval: 8000,
          maxInterval: 15000
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'sparkles',
        intensity: 1.2
      },
      {
        type: 'target-style',
        effect: 'bubble',
        intensity: 1.0,
        color: 'oklch(0.68 0.20 220)'
      },
      {
        type: 'background',
        effect: 'water-ripple',
        intensity: 0.7,
        color: 'oklch(0.75 0.18 180)'
      }
    ]
  },
  {
    id: 'cosmic-gravity',
    name: 'Zero Gravity',
    description: 'Targets float in zero gravity! They drift slowly and can be pushed by nearby hits!',
    icon: '🌌',
    eventId: 'cosmic-voyage-2025',
    scoreModifier: 1.9,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Orbital Drift',
        description: 'Targets drift in zero-G with momentum',
        config: {
          driftForce: 0.5,
          friction: 0.95,
          gravity: 0.0
        }
      },
      {
        type: 'target-behavior',
        name: 'Impact Push',
        description: 'Hitting a target pushes nearby targets away',
        config: {
          pushRadius: 120,
          pushForce: 2.0
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Stellar Formation',
        description: 'Targets spawn in constellation patterns',
        config: {
          pattern: 'constellation',
          formations: ['orion', 'cassiopeia', 'ursa']
        }
      },
      {
        type: 'power-up',
        name: 'Cosmic Power-Ups',
        description: 'Collect power-ups for special abilities',
        config: {
          types: ['freeze', 'multi-shot', 'chain-lightning', 'score-boost'],
          spawnChance: 0.3,
          minInterval: 8000,
          maxInterval: 15000
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'stars',
        intensity: 2.0
      },
      {
        type: 'target-style',
        effect: 'celestial',
        intensity: 1.3,
        color: 'oklch(0.68 0.22 290)'
      },
      {
        type: 'background',
        effect: 'nebula',
        intensity: 0.8,
        color: 'oklch(0.75 0.18 60)'
      },
      {
        type: 'trail',
        effect: 'stardust',
        intensity: 1.0
      }
    ]
  },
  {
    id: 'arcade-retro',
    name: 'Retro Blast',
    description: '8-bit style targets! Classic arcade mechanics with power-ups and cascading targets!',
    icon: '👾',
    eventId: 'arcade-legends-2025',
    scoreModifier: 2.5,
    mechanics: [
      {
        type: 'spawn-pattern',
        name: 'Invader Formation',
        description: 'Targets spawn in classic space invader grids',
        config: {
          rows: 4,
          columns: 6,
          movePattern: 'grid-sweep'
        }
      },
      {
        type: 'target-behavior',
        name: 'Brick Break',
        description: 'Hit targets cause adjacent targets to fall',
        config: {
          cascade: true,
          cascadeDelay: 200,
          cascadeBonus: 1.5
        }
      },
      {
        type: 'power-up',
        name: 'Power Pellet',
        description: 'Temporary invincibility and 2x score',
        config: {
          duration: 8000,
          scoreMultiplier: 2.0,
          spawnChance: 0.12
        }
      }
    ],
    visualEffects: [
      {
        type: 'target-style',
        effect: 'pixel-art',
        intensity: 1.0,
        color: 'oklch(0.75 0.25 280)'
      },
      {
        type: 'particle',
        effect: 'sparkles',
        intensity: 1.5
      },
      {
        type: 'screen-effect',
        effect: 'crt-scanlines',
        intensity: 0.5
      }
    ]
  },
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    description: 'Targets pulse with neon energy! Hit them on the beat for rhythm bonuses!',
    icon: '🎆',
    eventId: 'neon-nights-2025',
    scoreModifier: 1.75,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Pulse Beat',
        description: 'Targets pulse rhythmically, bonus for hitting on beat',
        config: {
          pulseInterval: 800,
          beatWindow: 150,
          beatBonus: 2.5
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Circuit Board',
        description: 'Targets spawn along neon circuit paths',
        config: {
          pattern: 'circuit',
          pathGlow: true,
          connectionBonus: 1.5
        }
      },
      {
        type: 'scoring',
        name: 'Sync Multiplier',
        description: 'Consecutive on-beat hits increase multiplier',
        config: {
          syncBonus: 0.5,
          maxMultiplier: 4.0
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'sparkles',
        intensity: 2.0
      },
      {
        type: 'target-style',
        effect: 'neon-pulse',
        intensity: 1.5,
        color: 'oklch(0.70 0.25 330)'
      },
      {
        type: 'background',
        effect: 'grid',
        intensity: 0.6,
        color: 'oklch(0.75 0.18 195)'
      },
      {
        type: 'screen-effect',
        effect: 'chromatic',
        intensity: 0.4
      }
    ]
  },
  {
    id: 'spring-butterfly',
    name: 'Butterfly Chase',
    description: 'Chase fluttering butterflies! They move erratically but award bonus points for gentle touches!',
    icon: '🦋',
    eventId: 'spring-bloom-2025',
    scoreModifier: 1.3,
    mechanics: [
      {
        type: 'target-behavior',
        name: 'Flutter Motion',
        description: 'Targets move in erratic butterfly patterns',
        config: {
          flutterSpeed: 1.2,
          changeDirection: 500,
          unpredictable: true
        }
      },
      {
        type: 'scoring',
        name: 'Gentle Touch',
        description: 'Quick, gentle clicks earn bonus points',
        config: {
          gentleBonus: 1.8,
          clickDuration: 100
        }
      },
      {
        type: 'spawn-pattern',
        name: 'Garden Bloom',
        description: 'Targets emerge from flower positions',
        config: {
          pattern: 'garden',
          bloomAnimation: true,
          flowerPositions: 8
        }
      }
    ],
    visualEffects: [
      {
        type: 'particle',
        effect: 'leaves',
        intensity: 1.5
      },
      {
        type: 'target-style',
        effect: 'butterfly-wings',
        intensity: 1.0,
        color: 'oklch(0.75 0.22 330)'
      },
      {
        type: 'trail',
        effect: 'petal',
        intensity: 0.8,
        color: 'oklch(0.78 0.18 140)'
      }
    ]
  }
]

export function getEventGameMode(eventId: string): EventGameMode[] {
  return EVENT_GAME_MODES.filter(mode => mode.eventId === eventId)
}

export function getGameModeById(id: EventGameModeId): EventGameMode | undefined {
  return EVENT_GAME_MODES.find(mode => mode.id === id)
}

export function isGameModeUnlocked(
  mode: EventGameMode,
  eventChallengesCompleted: number,
  eventScore: number
): boolean {
  if (!mode.unlockRequirement) return true
  
  const req = mode.unlockRequirement
  if (req.eventChallengesCompleted && eventChallengesCompleted < req.eventChallengesCompleted) {
    return false
  }
  if (req.eventScore && eventScore < req.eventScore) {
    return false
  }
  
  return true
}

export function applyEventMechanics(
  mode: EventGameMode,
  gameState: any,
  action: 'spawn' | 'hit' | 'miss' | 'update'
): any {
  const modifiedState = { ...gameState }
  
  mode.mechanics.forEach(mechanic => {
    switch (mechanic.type) {
      case 'scoring':
        if (action === 'hit') {
          modifiedState.scoreModifier = (modifiedState.scoreModifier || 1.0) * mode.scoreModifier
        }
        break
      
      case 'spawn-pattern':
        if (action === 'spawn') {
          modifiedState.spawnConfig = mechanic.config
        }
        break
      
      case 'target-behavior':
        if (action === 'update') {
          modifiedState.targetBehavior = mechanic.config
        }
        break
    }
  })
  
  return modifiedState
}

export function getEventModeDescription(mode: EventGameMode): string {
  const mechanicCount = mode.mechanics.length
  const scoreBonus = Math.round((mode.scoreModifier - 1) * 100)
  return `${mode.description} | ${mechanicCount} unique mechanics | +${scoreBonus}% score bonus`
}

export function getMechanicIcon(type: GameMechanic['type']): string {
  const icons: Record<GameMechanic['type'], string> = {
    'spawn-pattern': '🎯',
    'target-behavior': '🎪',
    'scoring': '💯',
    'time-manipulation': '⏱️',
    'multi-target': '🎲',
    'shield': '🛡️',
    'power-up': '⚡'
  }
  return icons[type] || '🎮'
}
