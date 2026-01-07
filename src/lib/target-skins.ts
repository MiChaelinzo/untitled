export type TargetSkin = 'default' | 'bullseye' | 'crosshair' | 'hexagon' | 'star' | 'pulse'

export interface TargetSkinConfig {
  id: TargetSkin
  name: string
  description: string
  unlockRequirement: string
  unlockCondition: (stats: { totalTargetsHit: number; highestCombo: number; highestScore: number; insaneModeCompleted: number }) => boolean
  icon: string
}

export const TARGET_SKINS: Record<TargetSkin, TargetSkinConfig> = {
  default: {
    id: 'default',
    name: 'Classic Circle',
    description: 'The original Cloud9 target',
    unlockRequirement: 'Default',
    unlockCondition: () => true,
    icon: '⭕'
  },
  bullseye: {
    id: 'bullseye',
    name: 'Bullseye',
    description: 'Classic archery target rings',
    unlockRequirement: 'Hit 50 targets',
    unlockCondition: (stats) => stats.totalTargetsHit >= 50,
    icon: '🎯'
  },
  crosshair: {
    id: 'crosshair',
    name: 'Crosshair',
    description: 'FPS-style targeting reticle',
    unlockRequirement: 'Achieve 5x combo',
    unlockCondition: (stats) => stats.highestCombo >= 5,
    icon: '✛'
  },
  hexagon: {
    id: 'hexagon',
    name: 'Hexagon',
    description: 'Futuristic geometric shape',
    unlockRequirement: 'Score 25,000 points',
    unlockCondition: (stats) => stats.highestScore >= 25000,
    icon: '⬡'
  },
  star: {
    id: 'star',
    name: 'Rising Star',
    description: 'Shine bright like a champion',
    unlockRequirement: 'Complete Insane mode',
    unlockCondition: (stats) => stats.insaneModeCompleted >= 1,
    icon: '⭐'
  },
  pulse: {
    id: 'pulse',
    name: 'Pulse Wave',
    description: 'Animated energy ring',
    unlockRequirement: 'Hit 200 targets',
    unlockCondition: (stats) => stats.totalTargetsHit >= 200,
    icon: '〰️'
  }
}

export function getUnlockedSkins(stats: { totalTargetsHit: number; highestCombo: number; highestScore: number; insaneModeCompleted: number }): TargetSkin[] {
  return Object.values(TARGET_SKINS)
    .filter(skin => skin.unlockCondition(stats))
    .map(skin => skin.id)
}

export function isSkinUnlocked(skinId: TargetSkin, stats: { totalTargetsHit: number; highestCombo: number; highestScore: number; insaneModeCompleted: number }): boolean {
  return TARGET_SKINS[skinId].unlockCondition(stats)
}
