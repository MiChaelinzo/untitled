import { Difficulty } from './game-types'

export type SpecialGameModeType = 
  | 'snowball-fight'
  | 'pumpkin-smash'
  | 'heart-hunt'
  | 'firework-frenzy'
  | 'dragon-dance'
  | 'summer-splash'

export interface SpecialGameMode {
  id: string
  type: SpecialGameModeType
  name: string
  description: string
  icon: string
  theme: GameModeTheme
  mechanics: GameModeMechanics
  scoring: GameModeScoring
  startDate: number
  endDate: number
  isActive: boolean
  difficulty: Difficulty
  rewardMultiplier: number
}

export interface GameModeTheme {
  primaryColor: string
  accentColor: string
  backgroundColor: string
  targetSkin: string
  targetEffects: TargetEffect[]
  backgroundParticles: ParticleConfig
  soundTheme: string
}

export interface TargetEffect {
  type: 'glow' | 'pulse' | 'rotate' | 'shake' | 'trail' | 'sparkle' | 'explode'
  color?: string
  intensity?: number
  duration?: number
}

export interface ParticleConfig {
  type: 'snow' | 'pumpkins' | 'hearts' | 'fireworks' | 'dragons' | 'water'
  density: number
  speed: number
  size: [number, number]
  colors: string[]
}

export interface GameModeMechanics {
  targetBehavior: 'standard' | 'bouncing' | 'spinning' | 'fading' | 'splitting' | 'zigzag'
  specialTargets: SpecialTarget[]
  powerUps: PowerUp[]
  environmentalEffects: EnvironmentalEffect[]
  customRules: GameRule[]
}

export interface SpecialTarget {
  id: string
  name: string
  icon: string
  appearance: string
  probability: number
  scoreMultiplier: number
  effect?: string
  duration?: number
  size?: number
}

export interface PowerUp {
  id: string
  name: string
  icon: string
  description: string
  duration: number
  effect: 'freeze-time' | 'double-points' | 'slow-motion' | 'rapid-fire' | 'shield'
  probability: number
}

export interface EnvironmentalEffect {
  id: string
  name: string
  description: string
  effect: 'wind' | 'gravity' | 'blur' | 'shake' | 'darkness'
  intensity: number
  duration?: number
}

export interface GameRule {
  id: string
  description: string
  condition: string
  effect: string
}

export interface GameModeScoring {
  baseMultiplier: number
  comboBonus: number
  perfectHitBonus: number
  speedBonus: number
  specialTargetBonus: Record<string, number>
  penalties: {
    miss: number
    timeout: number
  }
}

export const SPECIAL_GAME_MODES: SpecialGameMode[] = [
  {
    id: 'snowball-fight-2024',
    type: 'snowball-fight',
    name: '❄️ Snowball Fight',
    description: 'Launch snowballs at frozen targets! Hit special icy targets for bonus points!',
    icon: '⛄',
    difficulty: 'medium',
    rewardMultiplier: 2.0,
    startDate: new Date('2024-12-01').getTime(),
    endDate: new Date('2025-12-31').getTime(),
    isActive: true,
    theme: {
      primaryColor: 'oklch(0.85 0.12 220)',
      accentColor: 'oklch(0.90 0.10 200)',
      backgroundColor: 'oklch(0.18 0.05 240)',
      targetSkin: 'snowball',
      targetEffects: [
        { type: 'glow', color: 'oklch(0.85 0.12 220)', intensity: 0.8 },
        { type: 'sparkle', intensity: 0.6, duration: 1000 }
      ],
      backgroundParticles: {
        type: 'snow',
        density: 100,
        speed: 2,
        size: [2, 6],
        colors: ['oklch(0.95 0.02 240)', 'oklch(0.90 0.05 220)']
      },
      soundTheme: 'winter'
    },
    mechanics: {
      targetBehavior: 'bouncing',
      specialTargets: [
        {
          id: 'ice-crystal',
          name: 'Ice Crystal',
          icon: '💎',
          appearance: 'glowing blue crystal',
          probability: 0.15,
          scoreMultiplier: 3.0,
          effect: 'freeze nearby targets',
          duration: 2000,
          size: 90
        },
        {
          id: 'snowman',
          name: 'Snowman',
          icon: '⛄',
          appearance: 'happy snowman',
          probability: 0.10,
          scoreMultiplier: 5.0,
          effect: 'bonus time',
          duration: 3000,
          size: 120
        },
        {
          id: 'frozen-target',
          name: 'Frozen Target',
          icon: '🧊',
          appearance: 'frozen block',
          probability: 0.20,
          scoreMultiplier: 2.0,
          size: 85
        }
      ],
      powerUps: [
        {
          id: 'blizzard',
          name: 'Blizzard',
          icon: '🌨️',
          description: 'Freeze all targets for 3 seconds',
          duration: 3000,
          effect: 'freeze-time',
          probability: 0.05
        },
        {
          id: 'hot-cocoa',
          name: 'Hot Cocoa',
          icon: '☕',
          description: 'Slow motion for better accuracy',
          duration: 5000,
          effect: 'slow-motion',
          probability: 0.08
        }
      ],
      environmentalEffects: [
        {
          id: 'icy-wind',
          name: 'Icy Wind',
          description: 'Targets drift with the wind',
          effect: 'wind',
          intensity: 0.3
        }
      ],
      customRules: [
        {
          id: 'avalanche-combo',
          description: 'Every 5-hit combo triggers an avalanche of bonus points',
          condition: 'combo % 5 === 0',
          effect: '+500 bonus points'
        },
        {
          id: 'frostbite',
          description: 'Perfect hits freeze target spawn rate for 1 second',
          condition: 'reactionTime < 300',
          effect: 'Slower spawn rate'
        }
      ]
    },
    scoring: {
      baseMultiplier: 2.0,
      comboBonus: 150,
      perfectHitBonus: 300,
      speedBonus: 200,
      specialTargetBonus: {
        'ice-crystal': 1500,
        'snowman': 2500,
        'frozen-target': 1000
      },
      penalties: {
        miss: -100,
        timeout: -50
      }
    }
  },
  {
    id: 'pumpkin-smash-2024',
    type: 'pumpkin-smash',
    name: '🎃 Pumpkin Smash',
    description: 'Smash spooky pumpkins before they disappear! Watch out for trick targets!',
    icon: '🎃',
    difficulty: 'hard',
    rewardMultiplier: 2.5,
    startDate: new Date('2024-10-01').getTime(),
    endDate: new Date('2025-12-31').getTime(),
    isActive: true,
    theme: {
      primaryColor: 'oklch(0.70 0.28 45)',
      accentColor: 'oklch(0.60 0.30 290)',
      backgroundColor: 'oklch(0.12 0.06 290)',
      targetSkin: 'pumpkin',
      targetEffects: [
        { type: 'glow', color: 'oklch(0.70 0.28 45)', intensity: 1.0 },
        { type: 'pulse', intensity: 0.7, duration: 800 },
        { type: 'explode', color: 'oklch(0.70 0.28 45)', duration: 500 }
      ],
      backgroundParticles: {
        type: 'pumpkins',
        density: 30,
        speed: 1.5,
        size: [15, 30],
        colors: ['oklch(0.70 0.28 45)', 'oklch(0.60 0.30 290)', 'oklch(0.55 0.25 15)']
      },
      soundTheme: 'spooky'
    },
    mechanics: {
      targetBehavior: 'zigzag',
      specialTargets: [
        {
          id: 'jack-o-lantern',
          name: 'Jack-o-Lantern',
          icon: '🎃',
          appearance: 'glowing carved pumpkin',
          probability: 0.20,
          scoreMultiplier: 4.0,
          effect: 'explode with extra points',
          duration: 1500,
          size: 100
        },
        {
          id: 'ghost-pumpkin',
          name: 'Ghost Pumpkin',
          icon: '👻',
          appearance: 'transparent ghostly pumpkin',
          probability: 0.15,
          scoreMultiplier: 6.0,
          effect: 'becomes invisible periodically',
          duration: 2000,
          size: 85
        },
        {
          id: 'cursed-pumpkin',
          name: 'Cursed Pumpkin',
          icon: '💀',
          appearance: 'dark purple pumpkin',
          probability: 0.10,
          scoreMultiplier: -2.0,
          effect: 'lose points if hit!',
          size: 95
        },
        {
          id: 'candy-pumpkin',
          name: 'Candy Pumpkin',
          icon: '🍬',
          appearance: 'colorful candy pumpkin',
          probability: 0.12,
          scoreMultiplier: 3.5,
          effect: 'drops candy power-up',
          size: 80
        }
      ],
      powerUps: [
        {
          id: 'witch-brew',
          name: 'Witch Brew',
          icon: '🧪',
          description: 'Double points for 10 seconds',
          duration: 10000,
          effect: 'double-points',
          probability: 0.07
        },
        {
          id: 'ghost-shield',
          name: 'Ghost Shield',
          icon: '👻',
          description: 'Protect from cursed pumpkins',
          duration: 8000,
          effect: 'shield',
          probability: 0.06
        }
      ],
      environmentalEffects: [
        {
          id: 'haunted-fog',
          name: 'Haunted Fog',
          description: 'Mysterious fog obscures vision',
          effect: 'blur',
          intensity: 0.4,
          duration: 5000
        },
        {
          id: 'spooky-shake',
          name: 'Spooky Shake',
          description: 'Screen shakes from thunder',
          effect: 'shake',
          intensity: 0.2,
          duration: 1000
        }
      ],
      customRules: [
        {
          id: 'trick-or-treat',
          description: 'Every 10th hit is either a big bonus (treat) or penalty (trick)',
          condition: 'targetsHit % 10 === 0',
          effect: 'Random: +1000 or -500 points'
        },
        {
          id: 'midnight-madness',
          description: 'Combo above 15 spawns rapid pumpkins',
          condition: 'combo > 15',
          effect: 'Faster spawn rate'
        }
      ]
    },
    scoring: {
      baseMultiplier: 2.5,
      comboBonus: 200,
      perfectHitBonus: 400,
      speedBonus: 250,
      specialTargetBonus: {
        'jack-o-lantern': 2000,
        'ghost-pumpkin': 3000,
        'cursed-pumpkin': -1000,
        'candy-pumpkin': 1750
      },
      penalties: {
        miss: -150,
        timeout: -75
      }
    }
  },
  {
    id: 'heart-hunt-2025',
    type: 'heart-hunt',
    name: '💖 Heart Hunt',
    description: 'Catch floating hearts and spread the love! Chain hearts for combo bonuses!',
    icon: '💝',
    difficulty: 'easy',
    rewardMultiplier: 1.8,
    startDate: new Date('2025-02-10').getTime(),
    endDate: new Date('2025-02-18').getTime(),
    isActive: false,
    theme: {
      primaryColor: 'oklch(0.75 0.22 350)',
      accentColor: 'oklch(0.80 0.18 10)',
      backgroundColor: 'oklch(0.20 0.06 350)',
      targetSkin: 'heart',
      targetEffects: [
        { type: 'glow', color: 'oklch(0.75 0.22 350)', intensity: 0.9 },
        { type: 'pulse', intensity: 1.0, duration: 600 },
        { type: 'sparkle', color: 'oklch(0.85 0.15 350)', intensity: 0.8 }
      ],
      backgroundParticles: {
        type: 'hearts',
        density: 80,
        speed: 1.0,
        size: [8, 20],
        colors: ['oklch(0.75 0.22 350)', 'oklch(0.80 0.18 10)', 'oklch(0.85 0.15 340)']
      },
      soundTheme: 'romantic'
    },
    mechanics: {
      targetBehavior: 'fading',
      specialTargets: [
        {
          id: 'golden-heart',
          name: 'Golden Heart',
          icon: '💛',
          appearance: 'shimmering golden heart',
          probability: 0.12,
          scoreMultiplier: 4.0,
          effect: 'bonus combo points',
          size: 95
        },
        {
          id: 'cupid-heart',
          name: "Cupid's Heart",
          icon: '💘',
          appearance: 'heart with arrow',
          probability: 0.08,
          scoreMultiplier: 7.0,
          effect: 'creates chain reaction',
          duration: 2500,
          size: 110
        },
        {
          id: 'broken-heart',
          name: 'Broken Heart',
          icon: '💔',
          appearance: 'cracked heart',
          probability: 0.10,
          scoreMultiplier: 1.5,
          effect: 'heals when hit',
          size: 85
        }
      ],
      powerUps: [
        {
          id: 'love-potion',
          name: 'Love Potion',
          icon: '💖',
          description: 'All hearts become golden',
          duration: 7000,
          effect: 'double-points',
          probability: 0.09
        },
        {
          id: 'cupid-arrow',
          name: "Cupid's Arrow",
          icon: '🏹',
          description: 'Auto-hit nearby hearts',
          duration: 5000,
          effect: 'rapid-fire',
          probability: 0.06
        }
      ],
      environmentalEffects: [
        {
          id: 'love-breeze',
          name: 'Love Breeze',
          description: 'Hearts float gently upward',
          effect: 'gravity',
          intensity: -0.2
        }
      ],
      customRules: [
        {
          id: 'love-chain',
          description: 'Hitting hearts in quick succession creates a love chain',
          condition: 'timeBetweenHits < 500ms',
          effect: 'Chain bonus multiplier'
        },
        {
          id: 'heartfelt',
          description: 'No penalties for missing broken hearts',
          condition: 'missedTarget === "broken-heart"',
          effect: 'No miss penalty'
        }
      ]
    },
    scoring: {
      baseMultiplier: 1.8,
      comboBonus: 180,
      perfectHitBonus: 350,
      speedBonus: 180,
      specialTargetBonus: {
        'golden-heart': 2000,
        'cupid-heart': 3500,
        'broken-heart': 750
      },
      penalties: {
        miss: -50,
        timeout: -25
      }
    }
  },
  {
    id: 'firework-frenzy-2025',
    type: 'firework-frenzy',
    name: '🎆 Firework Frenzy',
    description: 'Light up the sky with spectacular fireworks! Time your shots perfectly!',
    icon: '🎇',
    difficulty: 'hard',
    rewardMultiplier: 2.3,
    startDate: new Date('2025-07-01').getTime(),
    endDate: new Date('2025-07-10').getTime(),
    isActive: false,
    theme: {
      primaryColor: 'oklch(0.75 0.25 60)',
      accentColor: 'oklch(0.70 0.28 350)',
      backgroundColor: 'oklch(0.10 0.08 240)',
      targetSkin: 'firework',
      targetEffects: [
        { type: 'glow', intensity: 1.2 },
        { type: 'sparkle', intensity: 1.0, duration: 400 },
        { type: 'explode', intensity: 1.5, duration: 600 }
      ],
      backgroundParticles: {
        type: 'fireworks',
        density: 50,
        speed: 3.0,
        size: [10, 40],
        colors: ['oklch(0.75 0.25 60)', 'oklch(0.70 0.28 350)', 'oklch(0.68 0.22 180)', 'oklch(0.72 0.26 120)']
      },
      soundTheme: 'celebration'
    },
    mechanics: {
      targetBehavior: 'spinning',
      specialTargets: [
        {
          id: 'rocket',
          name: 'Rocket',
          icon: '🚀',
          appearance: 'ascending rocket',
          probability: 0.18,
          scoreMultiplier: 5.0,
          effect: 'explodes into smaller targets',
          duration: 1800,
          size: 75
        },
        {
          id: 'roman-candle',
          name: 'Roman Candle',
          icon: '🎆',
          appearance: 'shooting sparks',
          probability: 0.15,
          scoreMultiplier: 3.5,
          effect: 'continuous points',
          duration: 3000,
          size: 90
        },
        {
          id: 'grand-finale',
          name: 'Grand Finale',
          icon: '💥',
          appearance: 'massive burst',
          probability: 0.05,
          scoreMultiplier: 10.0,
          effect: 'huge explosion bonus',
          duration: 2000,
          size: 130
        }
      ],
      powerUps: [
        {
          id: 'sparkler',
          name: 'Sparkler',
          icon: '✨',
          description: 'Triple combo points',
          duration: 8000,
          effect: 'double-points',
          probability: 0.08
        }
      ],
      environmentalEffects: [
        {
          id: 'night-sky',
          name: 'Night Sky',
          description: 'Darker background for better visibility',
          effect: 'darkness',
          intensity: 0.6
        }
      ],
      customRules: [
        {
          id: 'pyrotechnics',
          description: 'Hitting targets in rhythm creates spectacular explosions',
          condition: 'rhythmicHits',
          effect: 'Bonus explosion effects'
        }
      ]
    },
    scoring: {
      baseMultiplier: 2.3,
      comboBonus: 250,
      perfectHitBonus: 500,
      speedBonus: 300,
      specialTargetBonus: {
        'rocket': 2500,
        'roman-candle': 1750,
        'grand-finale': 5000
      },
      penalties: {
        miss: -200,
        timeout: -100
      }
    }
  },
  {
    id: 'dragon-dance-2025',
    type: 'dragon-dance',
    name: '🐉 Dragon Dance',
    description: 'Follow the dragon through mystical challenges! Collect lucky coins!',
    icon: '🐲',
    difficulty: 'medium',
    rewardMultiplier: 2.2,
    startDate: new Date('2025-02-01').getTime(),
    endDate: new Date('2025-02-15').getTime(),
    isActive: false,
    theme: {
      primaryColor: 'oklch(0.75 0.25 45)',
      accentColor: 'oklch(0.70 0.28 15)',
      backgroundColor: 'oklch(0.18 0.04 45)',
      targetSkin: 'dragon',
      targetEffects: [
        { type: 'glow', color: 'oklch(0.75 0.25 45)', intensity: 1.0 },
        { type: 'trail', color: 'oklch(0.70 0.28 15)', intensity: 0.8 }
      ],
      backgroundParticles: {
        type: 'dragons',
        density: 20,
        speed: 2.5,
        size: [20, 50],
        colors: ['oklch(0.75 0.25 45)', 'oklch(0.70 0.28 15)', 'oklch(0.68 0.22 30)']
      },
      soundTheme: 'oriental'
    },
    mechanics: {
      targetBehavior: 'zigzag',
      specialTargets: [
        {
          id: 'lucky-coin',
          name: 'Lucky Coin',
          icon: '🪙',
          appearance: 'golden coin',
          probability: 0.25,
          scoreMultiplier: 2.5,
          effect: 'prosperity bonus',
          size: 70
        },
        {
          id: 'dragon-orb',
          name: 'Dragon Orb',
          icon: '🔮',
          appearance: 'mystical orb',
          probability: 0.10,
          scoreMultiplier: 8.0,
          effect: 'dragon power',
          duration: 2500,
          size: 100
        },
        {
          id: 'lantern',
          name: 'Red Lantern',
          icon: '🏮',
          appearance: 'glowing lantern',
          probability: 0.15,
          scoreMultiplier: 3.0,
          effect: 'lights the way',
          size: 85
        }
      ],
      powerUps: [
        {
          id: 'dragon-power',
          name: 'Dragon Power',
          icon: '🐉',
          description: 'Become the dragon - auto-collect nearby targets',
          duration: 6000,
          effect: 'rapid-fire',
          probability: 0.07
        }
      ],
      environmentalEffects: [],
      customRules: [
        {
          id: 'prosperity',
          description: 'Collecting 8 coins grants extra prosperity bonus',
          condition: 'luckyCoinsCollected % 8 === 0',
          effect: '+888 bonus points'
        }
      ]
    },
    scoring: {
      baseMultiplier: 2.2,
      comboBonus: 220,
      perfectHitBonus: 440,
      speedBonus: 220,
      specialTargetBonus: {
        'lucky-coin': 1250,
        'dragon-orb': 4000,
        'lantern': 1500
      },
      penalties: {
        miss: -110,
        timeout: -55
      }
    }
  },
  {
    id: 'summer-splash-2025',
    type: 'summer-splash',
    name: '🌊 Summer Splash',
    description: 'Make a splash with water balloons! Cool off with aquatic targets!',
    icon: '💧',
    difficulty: 'easy',
    rewardMultiplier: 1.7,
    startDate: new Date('2025-06-15').getTime(),
    endDate: new Date('2026-08-31').getTime(),
    isActive: false,
    theme: {
      primaryColor: 'oklch(0.70 0.18 210)',
      accentColor: 'oklch(0.75 0.20 190)',
      backgroundColor: 'oklch(0.22 0.08 230)',
      targetSkin: 'water',
      targetEffects: [
        { type: 'glow', color: 'oklch(0.70 0.18 210)', intensity: 0.7 },
        { type: 'pulse', intensity: 0.5, duration: 1000 },
        { type: 'explode', color: 'oklch(0.75 0.20 190)', duration: 400 }
      ],
      backgroundParticles: {
        type: 'water',
        density: 60,
        speed: 1.8,
        size: [5, 15],
        colors: ['oklch(0.70 0.18 210)', 'oklch(0.75 0.20 190)', 'oklch(0.80 0.15 200)']
      },
      soundTheme: 'water'
    },
    mechanics: {
      targetBehavior: 'bouncing',
      specialTargets: [
        {
          id: 'water-balloon',
          name: 'Water Balloon',
          icon: '🎈',
          appearance: 'bouncing balloon',
          probability: 0.20,
          scoreMultiplier: 3.0,
          effect: 'splashes on hit',
          size: 95
        },
        {
          id: 'beach-ball',
          name: 'Beach Ball',
          icon: '🏖️',
          appearance: 'colorful beach ball',
          probability: 0.15,
          scoreMultiplier: 2.5,
          effect: 'bounces to create more targets',
          duration: 2000,
          size: 105
        },
        {
          id: 'sunglasses',
          name: 'Cool Shades',
          icon: '😎',
          appearance: 'sunglasses',
          probability: 0.10,
          scoreMultiplier: 5.0,
          effect: 'cool bonus',
          size: 80
        }
      ],
      powerUps: [
        {
          id: 'wave-rider',
          name: 'Wave Rider',
          icon: '🏄',
          description: 'Ride the wave - slow motion mode',
          duration: 6000,
          effect: 'slow-motion',
          probability: 0.10
        }
      ],
      environmentalEffects: [
        {
          id: 'ocean-waves',
          name: 'Ocean Waves',
          description: 'Targets drift with the waves',
          effect: 'wind',
          intensity: 0.25
        }
      ],
      customRules: [
        {
          id: 'splash-zone',
          description: 'Hitting wet targets gives splash bonus',
          condition: 'targetType === "water-balloon"',
          effect: '+300 splash bonus'
        }
      ]
    },
    scoring: {
      baseMultiplier: 1.7,
      comboBonus: 170,
      perfectHitBonus: 340,
      speedBonus: 170,
      specialTargetBonus: {
        'water-balloon': 1500,
        'beach-ball': 1250,
        'sunglasses': 2500
      },
      penalties: {
        miss: -85,
        timeout: -42
      }
    }
  }
]

export function getActiveGameModes(modes: SpecialGameMode[] = SPECIAL_GAME_MODES): SpecialGameMode[] {
  const now = Date.now()
  return modes.filter(mode => now >= mode.startDate && mode.endDate && now <= mode.endDate)
}

export function getUpcomingGameModes(modes: SpecialGameMode[] = SPECIAL_GAME_MODES, daysAhead: number = 7): SpecialGameMode[] {
  const now = Date.now()
  const futureDate = now + (daysAhead * 24 * 60 * 60 * 1000)
  return modes.filter(mode => mode.startDate > now && mode.startDate <= futureDate)
}

export function getGameModeById(id: string, modes: SpecialGameMode[] = SPECIAL_GAME_MODES): SpecialGameMode | undefined {
  return modes.find(mode => mode.id === id)
}

export function formatGameModeTimeRemaining(endDate: number): string {
  const now = Date.now()
  const remaining = endDate - now
  
  if (remaining <= 0) return 'Ended'
  
  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  
  if (days > 0) return `${days}d ${hours}h left`
  if (hours > 0) return `${hours}h left`
  return 'Ending soon!'
}

export function calculateGameModeScore(
  baseScore: number,
  mode: SpecialGameMode,
  combo: number,
  isPerfectHit: boolean,
  reactionTime: number,
  specialTargetId?: string
): number {
  let score = baseScore * mode.scoring.baseMultiplier
  
  score += combo * mode.scoring.comboBonus
  
  if (isPerfectHit) {
    score += mode.scoring.perfectHitBonus
  }
  
  if (reactionTime < 300) {
    score += mode.scoring.speedBonus
  }
  
  if (specialTargetId && mode.scoring.specialTargetBonus[specialTargetId]) {
    score += mode.scoring.specialTargetBonus[specialTargetId]
  }
  
  return Math.round(score * mode.rewardMultiplier)
}
