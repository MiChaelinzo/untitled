import { BackgroundVariant } from './background-themes'

export interface ComboBackgroundVariant {
  id: string
  name: string
  description: string
  comboThreshold: number
  variant: BackgroundVariant
  intensity: number
  colorPrimary: string
  colorSecondary: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export const COMBO_BACKGROUND_VARIANTS: ComboBackgroundVariant[] = [
  {
    id: 'combo-0-default',
    name: 'Standard Arena',
    description: 'The default arena background',
    comboThreshold: 0,
    variant: 'particles',
    intensity: 1.0,
    colorPrimary: 'rgba(99, 102, 241, 0.4)',
    colorSecondary: 'rgba(139, 92, 246, 0.3)',
    icon: '⭐',
    rarity: 'common'
  },
  {
    id: 'combo-5-warming',
    name: 'Warming Up',
    description: 'Energy begins to build',
    comboThreshold: 5,
    variant: 'particles',
    intensity: 1.2,
    colorPrimary: 'rgba(59, 130, 246, 0.45)',
    colorSecondary: 'rgba(96, 165, 250, 0.35)',
    icon: '🔥',
    rarity: 'common'
  },
  {
    id: 'combo-10-energized',
    name: 'Energized',
    description: 'The arena pulses with power',
    comboThreshold: 10,
    variant: 'waves',
    intensity: 1.4,
    colorPrimary: 'rgba(16, 185, 129, 0.5)',
    colorSecondary: 'rgba(52, 211, 153, 0.4)',
    icon: '⚡',
    rarity: 'common'
  },
  {
    id: 'combo-15-aurora',
    name: 'Aurora Flow',
    description: 'Northern lights dance around you',
    comboThreshold: 15,
    variant: 'aurora',
    intensity: 1.5,
    colorPrimary: 'rgba(34, 211, 238, 0.5)',
    colorSecondary: 'rgba(6, 182, 212, 0.4)',
    icon: '🌊',
    rarity: 'rare'
  },
  {
    id: 'combo-20-constellation',
    name: 'Star Ascension',
    description: 'Stars align in your favor',
    comboThreshold: 20,
    variant: 'constellation',
    intensity: 1.6,
    colorPrimary: 'rgba(168, 85, 247, 0.55)',
    colorSecondary: 'rgba(217, 70, 239, 0.45)',
    icon: '✨',
    rarity: 'rare'
  },
  {
    id: 'combo-25-matrix',
    name: 'Digital Overdrive',
    description: 'Enter the matrix of perfection',
    comboThreshold: 25,
    variant: 'matrix',
    intensity: 1.7,
    colorPrimary: 'rgba(59, 130, 246, 0.6)',
    colorSecondary: 'rgba(236, 72, 153, 0.5)',
    icon: '💻',
    rarity: 'epic'
  },
  {
    id: 'combo-30-nebula',
    name: 'Cosmic Mastery',
    description: 'Nebula clouds swirl with your power',
    comboThreshold: 30,
    variant: 'nebula',
    intensity: 1.8,
    colorPrimary: 'rgba(236, 72, 153, 0.6)',
    colorSecondary: 'rgba(168, 85, 247, 0.55)',
    icon: '🌌',
    rarity: 'epic'
  },
  {
    id: 'combo-40-binary-rain',
    name: 'Data Storm',
    description: 'Binary code rains from above',
    comboThreshold: 40,
    variant: 'binary-rain',
    intensity: 2.0,
    colorPrimary: 'rgba(34, 211, 238, 0.65)',
    colorSecondary: 'rgba(59, 130, 246, 0.6)',
    icon: '🌧️',
    rarity: 'epic'
  },
  {
    id: 'combo-50-legendary',
    name: 'Legendary Overdrive',
    description: 'The arena bows to your mastery',
    comboThreshold: 50,
    variant: 'spirals',
    intensity: 2.2,
    colorPrimary: 'rgba(251, 191, 36, 0.7)',
    colorSecondary: 'rgba(245, 158, 11, 0.6)',
    icon: '👑',
    rarity: 'legendary'
  },
  {
    id: 'combo-75-transcendent',
    name: 'Transcendent',
    description: 'You have achieved the impossible',
    comboThreshold: 75,
    variant: 'geometric',
    intensity: 2.5,
    colorPrimary: 'rgba(244, 63, 94, 0.75)',
    colorSecondary: 'rgba(236, 72, 153, 0.7)',
    icon: '💎',
    rarity: 'legendary'
  },
  {
    id: 'combo-100-godlike',
    name: 'Godlike',
    description: 'Reality itself bends to your will',
    comboThreshold: 100,
    variant: 'hexagon',
    intensity: 3.0,
    colorPrimary: 'rgba(139, 92, 246, 0.8)',
    colorSecondary: 'rgba(217, 70, 239, 0.75)',
    icon: '👁️',
    rarity: 'legendary'
  }
]

export function getComboBackgroundVariant(combo: number): ComboBackgroundVariant {
  const sorted = [...COMBO_BACKGROUND_VARIANTS].sort((a, b) => b.comboThreshold - a.comboThreshold)
  
  for (const variant of sorted) {
    if (combo >= variant.comboThreshold) {
      return variant
    }
  }
  
  return COMBO_BACKGROUND_VARIANTS[0]
}

export function getNextComboBackground(currentCombo: number): ComboBackgroundVariant | null {
  const sorted = [...COMBO_BACKGROUND_VARIANTS].sort((a, b) => a.comboThreshold - b.comboThreshold)
  
  for (const variant of sorted) {
    if (variant.comboThreshold > currentCombo) {
      return variant
    }
  }
  
  return null
}

export function getAllUnlockedBackgrounds(highestCombo: number): ComboBackgroundVariant[] {
  return COMBO_BACKGROUND_VARIANTS.filter(bg => bg.comboThreshold <= highestCombo)
}

export function hasUnlockedBackground(combo: number, backgroundId: string): boolean {
  const variant = COMBO_BACKGROUND_VARIANTS.find(bg => bg.id === backgroundId)
  return variant ? combo >= variant.comboThreshold : false
}

export function getRarityColor(rarity: ComboBackgroundVariant['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'text-muted-foreground'
    case 'rare':
      return 'text-blue-400'
    case 'epic':
      return 'text-purple-400'
    case 'legendary':
      return 'text-amber-400'
    default:
      return 'text-foreground'
  }
}

export function getRarityGlow(rarity: ComboBackgroundVariant['rarity']): string {
  switch (rarity) {
    case 'common':
      return 'shadow-sm'
    case 'rare':
      return 'shadow-lg shadow-blue-500/20'
    case 'epic':
      return 'shadow-lg shadow-purple-500/30'
    case 'legendary':
      return 'shadow-xl shadow-amber-500/40'
    default:
      return ''
  }
}
