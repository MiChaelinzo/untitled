import { PlayerStats } from './achievements'
import { VisualTheme } from './visual-themes'
import { BackgroundVariant } from './background-themes'
import { SoundTheme } from './sound-system'
import { TargetSkin } from './target-skins'

export type UnlockableType = 'visual-theme' | 'background' | 'sound-theme' | 'target-skin' | 'mouse-trail' | 'profile-badge' | 'title'

export interface ThemeUnlockable {
  id: string
  type: UnlockableType
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  glowColor: string
  preview?: string
  value?: string
  requirement: UnlockRequirement
}

export interface UnlockRequirement {
  type: 'achievement' | 'level' | 'challenge' | 'score' | 'combo' | 'games' | 'perfect-rounds' | 'difficulty' | 'xp' | 'multi'
  target?: number | string | string[]
  subRequirements?: UnlockRequirement[]
}

export interface PlayerUnlocks {
  unlockedThemes: string[]
  unlockedBackgrounds: string[]
  unlockedSoundThemes: string[]
  unlockedTargetSkins: string[]
  unlockedMouseTrails: string[]
  unlockedProfileBadges: string[]
  unlockedTitles: string[]
  equippedVisualTheme?: string
  equippedBackground?: string
  equippedSoundTheme?: string
  equippedTargetSkin?: string
  equippedMouseTrail?: string
  equippedProfileBadge?: string
  equippedTitle?: string
}

export const THEME_UNLOCKABLES: ThemeUnlockable[] = [
  {
    id: 'visual-cyberpunk',
    type: 'visual-theme',
    name: 'Cyberpunk',
    description: 'Classic Cloud9 electric blue aesthetic',
    icon: '⚡',
    rarity: 'common',
    glowColor: 'oklch(0.65 0.24 240)',
    value: 'cyberpunk',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'visual-neon-city',
    type: 'visual-theme',
    name: 'Neon City',
    description: 'Tokyo nights with purple and gold',
    icon: '🏙️',
    rarity: 'rare',
    glowColor: 'oklch(0.68 0.22 290)',
    value: 'neon-city',
    requirement: { type: 'level', target: 5 }
  },
  {
    id: 'visual-matrix',
    type: 'visual-theme',
    name: 'Matrix',
    description: 'Green code rain aesthetic',
    icon: '💚',
    rarity: 'rare',
    glowColor: 'oklch(0.70 0.22 145)',
    value: 'matrix',
    requirement: { type: 'achievement', target: 'combo-master' }
  },
  {
    id: 'visual-sunset',
    type: 'visual-theme',
    name: 'Sunset Blaze',
    description: 'Warm orange and red tones',
    icon: '🌅',
    rarity: 'epic',
    glowColor: 'oklch(0.65 0.23 45)',
    value: 'sunset',
    requirement: { type: 'score', target: 75000 }
  },
  {
    id: 'visual-ice',
    type: 'visual-theme',
    name: 'Arctic Ice',
    description: 'Cool blues and frost white',
    icon: '❄️',
    rarity: 'legendary',
    glowColor: 'oklch(0.68 0.18 210)',
    value: 'ice',
    requirement: { 
      type: 'multi',
      subRequirements: [
        { type: 'achievement', target: 'perfectionist' },
        { type: 'level', target: 10 }
      ]
    }
  },
  {
    id: 'bg-particles',
    type: 'background',
    name: 'Stellar Particles',
    description: 'Floating particles like distant stars',
    icon: '✨',
    rarity: 'common',
    glowColor: 'oklch(0.70 0.20 240)',
    value: 'particles',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'bg-grid',
    type: 'background',
    name: 'Cyber Grid',
    description: 'Pulsing technological grid network',
    icon: '🔲',
    rarity: 'common',
    glowColor: 'oklch(0.65 0.24 240)',
    value: 'grid',
    requirement: { type: 'games', target: 5 }
  },
  {
    id: 'bg-waves',
    type: 'background',
    name: 'Ocean Waves',
    description: 'Flowing wave patterns',
    icon: '🌊',
    rarity: 'rare',
    glowColor: 'oklch(0.60 0.20 220)',
    value: 'waves',
    requirement: { type: 'achievement', target: 'sharpshooter' }
  },
  {
    id: 'bg-nebula',
    type: 'background',
    name: 'Cosmic Nebula',
    description: 'Swirling nebula clouds in deep space',
    icon: '🌌',
    rarity: 'rare',
    glowColor: 'oklch(0.60 0.25 290)',
    value: 'nebula',
    requirement: { type: 'level', target: 3 }
  },
  {
    id: 'bg-matrix',
    type: 'background',
    name: 'Matrix Code',
    description: 'Cascading digital characters',
    icon: '💻',
    rarity: 'rare',
    glowColor: 'oklch(0.70 0.22 145)',
    value: 'matrix',
    requirement: { type: 'combo', target: 15 }
  },
  {
    id: 'bg-aurora',
    type: 'background',
    name: 'Aurora Borealis',
    description: 'Shimmering northern lights',
    icon: '🌈',
    rarity: 'epic',
    glowColor: 'oklch(0.70 0.20 160)',
    value: 'aurora',
    requirement: { type: 'perfect-rounds', target: 3 }
  },
  {
    id: 'bg-constellation',
    type: 'background',
    name: 'Star Constellation',
    description: 'Connected stars forming cosmic patterns',
    icon: '⭐',
    rarity: 'epic',
    glowColor: 'oklch(0.85 0.15 60)',
    value: 'constellation',
    requirement: { type: 'score', target: 50000 }
  },
  {
    id: 'bg-hexagon',
    type: 'background',
    name: 'Hex Network',
    description: 'Interconnected hexagonal tech pattern',
    icon: '⬡',
    rarity: 'epic',
    glowColor: 'oklch(0.65 0.22 200)',
    value: 'hexagon',
    requirement: { type: 'xp', target: 1000 }
  },
  {
    id: 'bg-spirals',
    type: 'background',
    name: 'Nautilus Spirals',
    description: 'Organic spiral forms found in nature',
    icon: '🌀',
    rarity: 'legendary',
    glowColor: 'oklch(0.70 0.18 320)',
    value: 'spirals',
    requirement: { 
      type: 'multi',
      subRequirements: [
        { type: 'level', target: 8 },
        { type: 'achievement', target: 'perfectionist' }
      ]
    }
  },
  {
    id: 'bg-binary-rain',
    type: 'background',
    name: 'Binary Rain',
    description: 'Streams of binary code flowing downward',
    icon: '💾',
    rarity: 'legendary',
    glowColor: 'oklch(0.60 0.20 145)',
    value: 'binary-rain',
    requirement: { type: 'difficulty', target: 'hard' }
  },
  {
    id: 'bg-geometric',
    type: 'background',
    name: 'Geometric Shapes',
    description: 'Abstract geometric forms in motion',
    icon: '🔷',
    rarity: 'mythic',
    glowColor: 'oklch(0.75 0.25 270)',
    value: 'geometric',
    requirement: { 
      type: 'multi',
      subRequirements: [
        { type: 'difficulty', target: 'insane' },
        { type: 'level', target: 15 }
      ]
    }
  },
  {
    id: 'sound-sci-fi',
    type: 'sound-theme',
    name: 'Sci-Fi',
    description: 'Futuristic laser and energy sounds',
    icon: '🔊',
    rarity: 'common',
    glowColor: 'oklch(0.65 0.24 240)',
    value: 'sci-fi',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'sound-retro',
    type: 'sound-theme',
    name: 'Retro Arcade',
    description: 'Classic 8-bit gaming sounds',
    icon: '🕹️',
    rarity: 'rare',
    glowColor: 'oklch(0.70 0.25 350)',
    value: 'retro',
    requirement: { type: 'games', target: 10 }
  },
  {
    id: 'sound-minimal',
    type: 'sound-theme',
    name: 'Minimal',
    description: 'Clean, subtle audio feedback',
    icon: '🎵',
    rarity: 'rare',
    glowColor: 'oklch(0.75 0.15 200)',
    value: 'minimal',
    requirement: { type: 'achievement', target: 'dedication' }
  },
  {
    id: 'skin-default',
    type: 'target-skin',
    name: 'Default',
    description: 'Classic circular target',
    icon: '🎯',
    rarity: 'common',
    glowColor: 'oklch(0.75 0.18 195)',
    value: 'default',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'skin-neon-ring',
    type: 'target-skin',
    name: 'Neon Ring',
    description: 'Glowing neon outline',
    icon: '⭕',
    rarity: 'rare',
    glowColor: 'oklch(0.70 0.25 350)',
    value: 'neon-ring',
    requirement: { type: 'combo', target: 10 }
  },
  {
    id: 'skin-hexagon',
    type: 'target-skin',
    name: 'Hexagon',
    description: 'Six-sided geometric shape',
    icon: '⬡',
    rarity: 'rare',
    glowColor: 'oklch(0.65 0.22 200)',
    value: 'hexagon',
    requirement: { type: 'score', target: 25000 }
  },
  {
    id: 'skin-star',
    type: 'target-skin',
    name: 'Star',
    description: 'Five-pointed star shape',
    icon: '⭐',
    rarity: 'epic',
    glowColor: 'oklch(0.85 0.15 60)',
    value: 'star',
    requirement: { type: 'achievement', target: 'score-hunter' }
  },
  {
    id: 'skin-diamond',
    type: 'target-skin',
    name: 'Diamond',
    description: 'Brilliant diamond shape',
    icon: '💎',
    rarity: 'epic',
    glowColor: 'oklch(0.68 0.18 210)',
    value: 'diamond',
    requirement: { type: 'perfect-rounds', target: 5 }
  },
  {
    id: 'skin-skull',
    type: 'target-skin',
    name: 'Skull',
    description: 'Dangerous skull icon',
    icon: '💀',
    rarity: 'legendary',
    glowColor: 'oklch(0.55 0.25 15)',
    value: 'skull',
    requirement: { type: 'achievement', target: 'insane-champion' }
  },
  {
    id: 'trail-dots',
    type: 'mouse-trail',
    name: 'Dot Trail',
    description: 'Simple dot particles following cursor',
    icon: '•',
    rarity: 'common',
    glowColor: 'oklch(0.70 0.20 240)',
    value: 'dots',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'trail-glow',
    type: 'mouse-trail',
    name: 'Glow Trail',
    description: 'Glowing light trail effect',
    icon: '✨',
    rarity: 'rare',
    glowColor: 'oklch(0.75 0.20 195)',
    value: 'glow',
    requirement: { type: 'level', target: 3 }
  },
  {
    id: 'trail-sparkle',
    type: 'mouse-trail',
    name: 'Sparkle Trail',
    description: 'Sparkling particle effects',
    icon: '⭐',
    rarity: 'epic',
    glowColor: 'oklch(0.85 0.15 60)',
    value: 'sparkle',
    requirement: { type: 'combo', target: 20 }
  },
  {
    id: 'trail-line',
    type: 'mouse-trail',
    name: 'Line Trail',
    description: 'Smooth line following cursor',
    icon: '〰️',
    rarity: 'rare',
    glowColor: 'oklch(0.70 0.25 350)',
    value: 'line',
    requirement: { type: 'score', target: 30000 }
  },
  {
    id: 'badge-founder',
    type: 'profile-badge',
    name: 'Founder',
    description: 'Early player of C9 Reflex Arena',
    icon: '🏆',
    rarity: 'legendary',
    glowColor: 'oklch(0.75 0.20 60)',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'badge-speedster',
    type: 'profile-badge',
    name: 'Speedster',
    description: 'Master of quick reflexes',
    icon: '⚡',
    rarity: 'epic',
    glowColor: 'oklch(0.70 0.25 350)',
    requirement: { type: 'combo', target: 25 }
  },
  {
    id: 'badge-sharpshooter',
    type: 'profile-badge',
    name: 'Elite Sharpshooter',
    description: 'Unmatched accuracy and precision',
    icon: '🎯',
    rarity: 'epic',
    glowColor: 'oklch(0.75 0.18 195)',
    requirement: { type: 'achievement', target: 'sharpshooter' }
  },
  {
    id: 'badge-perfect',
    type: 'profile-badge',
    name: 'Perfectionist',
    description: 'Never misses a shot',
    icon: '💎',
    rarity: 'legendary',
    glowColor: 'oklch(0.68 0.18 210)',
    requirement: { type: 'perfect-rounds', target: 10 }
  },
  {
    id: 'badge-insane',
    type: 'profile-badge',
    name: 'Insane Master',
    description: 'Conquered the ultimate challenge',
    icon: '💀',
    rarity: 'mythic',
    glowColor: 'oklch(0.55 0.25 15)',
    requirement: { 
      type: 'multi',
      subRequirements: [
        { type: 'achievement', target: 'insane-champion' },
        { type: 'level', target: 20 }
      ]
    }
  },
  {
    id: 'title-rookie',
    type: 'title',
    name: 'Rookie',
    description: 'Just getting started',
    icon: '🌱',
    rarity: 'common',
    glowColor: 'oklch(0.70 0.20 120)',
    requirement: { type: 'level', target: 1 }
  },
  {
    id: 'title-pro',
    type: 'title',
    name: 'Pro',
    description: 'Skilled player',
    icon: '🎮',
    rarity: 'rare',
    glowColor: 'oklch(0.65 0.24 240)',
    requirement: { type: 'level', target: 5 }
  },
  {
    id: 'title-elite',
    type: 'title',
    name: 'Elite',
    description: 'Among the best',
    icon: '⭐',
    rarity: 'epic',
    glowColor: 'oklch(0.85 0.15 60)',
    requirement: { type: 'level', target: 10 }
  },
  {
    id: 'title-legend',
    type: 'title',
    name: 'Legend',
    description: 'Legendary status achieved',
    icon: '👑',
    rarity: 'legendary',
    glowColor: 'oklch(0.75 0.20 60)',
    requirement: { type: 'level', target: 15 }
  },
  {
    id: 'title-mythic',
    type: 'title',
    name: 'Mythic',
    description: 'Beyond legendary',
    icon: '🔥',
    rarity: 'mythic',
    glowColor: 'oklch(0.70 0.25 350)',
    requirement: { 
      type: 'multi',
      subRequirements: [
        { type: 'level', target: 25 },
        { type: 'score', target: 100000 }
      ]
    }
  },
  {
    id: 'title-combo-king',
    type: 'title',
    name: 'Combo King',
    description: 'Master of combos',
    icon: '⚡',
    rarity: 'epic',
    glowColor: 'oklch(0.70 0.25 350)',
    requirement: { type: 'combo', target: 30 }
  },
  {
    id: 'title-sharpshooter',
    type: 'title',
    name: 'Sharpshooter',
    description: 'Perfect accuracy',
    icon: '🎯',
    rarity: 'epic',
    glowColor: 'oklch(0.75 0.18 195)',
    requirement: { type: 'perfect-rounds', target: 15 }
  }
]

export function checkUnlockRequirement(
  requirement: UnlockRequirement,
  stats: PlayerStats,
  unlockedAchievements: string[],
  playerLevel: number,
  totalXP: number,
  challengeData?: any
): boolean {
  switch (requirement.type) {
    case 'level':
      return playerLevel >= (requirement.target as number)
    
    case 'achievement':
      return unlockedAchievements.includes(requirement.target as string)
    
    case 'score':
      return stats.highestScore >= (requirement.target as number)
    
    case 'combo':
      return stats.highestCombo >= (requirement.target as number)
    
    case 'games':
      return stats.totalGamesPlayed >= (requirement.target as number)
    
    case 'perfect-rounds':
      return stats.perfectRounds >= (requirement.target as number)
    
    case 'difficulty':
      if (requirement.target === 'hard') {
        return stats.highestScore >= 20000
      }
      if (requirement.target === 'insane') {
        return stats.insaneModeCompleted >= 1
      }
      return false
    
    case 'xp':
      return totalXP >= (requirement.target as number)
    
    case 'challenge':
      if (!challengeData) return false
      return challengeData.completedChallenges.includes(requirement.target as string)
    
    case 'multi':
      if (!requirement.subRequirements) return false
      return requirement.subRequirements.every(subReq => 
        checkUnlockRequirement(subReq, stats, unlockedAchievements, playerLevel, totalXP, challengeData)
      )
    
    default:
      return false
  }
}

export function getNewlyUnlocked(
  unlockables: ThemeUnlockable[],
  playerUnlocks: PlayerUnlocks,
  stats: PlayerStats,
  unlockedAchievements: string[],
  playerLevel: number,
  totalXP: number,
  challengeData?: any
): ThemeUnlockable[] {
  const allUnlocked = [
    ...playerUnlocks.unlockedThemes,
    ...playerUnlocks.unlockedBackgrounds,
    ...playerUnlocks.unlockedSoundThemes,
    ...playerUnlocks.unlockedTargetSkins,
    ...playerUnlocks.unlockedMouseTrails,
    ...playerUnlocks.unlockedProfileBadges,
    ...playerUnlocks.unlockedTitles
  ]

  return unlockables.filter(unlockable => {
    if (allUnlocked.includes(unlockable.id)) return false
    return checkUnlockRequirement(
      unlockable.requirement,
      stats,
      unlockedAchievements,
      playerLevel,
      totalXP,
      challengeData
    )
  })
}

export function groupUnlockablesByRarity(unlockables: ThemeUnlockable[]): Record<string, ThemeUnlockable[]> {
  const grouped: Record<string, ThemeUnlockable[]> = {
    common: [],
    rare: [],
    epic: [],
    legendary: [],
    mythic: []
  }

  unlockables.forEach(unlockable => {
    grouped[unlockable.rarity].push(unlockable)
  })

  return grouped
}

export function groupUnlockablesByType(unlockables: ThemeUnlockable[]): Record<string, ThemeUnlockable[]> {
  const grouped: Record<string, ThemeUnlockable[]> = {
    'visual-theme': [],
    'background': [],
    'sound-theme': [],
    'target-skin': [],
    'mouse-trail': [],
    'profile-badge': [],
    'title': []
  }

  unlockables.forEach(unlockable => {
    grouped[unlockable.type].push(unlockable)
  })

  return grouped
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'common':
      return 'oklch(0.70 0.15 140)'
    case 'rare':
      return 'oklch(0.65 0.24 240)'
    case 'epic':
      return 'oklch(0.68 0.22 290)'
    case 'legendary':
      return 'oklch(0.75 0.20 60)'
    case 'mythic':
      return 'oklch(0.70 0.25 350)'
    default:
      return 'oklch(0.70 0.20 240)'
  }
}

export function getProgressToUnlock(
  unlockable: ThemeUnlockable,
  stats: PlayerStats,
  playerLevel: number,
  totalXP: number
): { current: number; target: number; percentage: number; label: string } {
  const req = unlockable.requirement

  switch (req.type) {
    case 'level':
      return {
        current: playerLevel,
        target: req.target as number,
        percentage: Math.min(100, (playerLevel / (req.target as number)) * 100),
        label: 'Level'
      }
    
    case 'score':
      return {
        current: stats.highestScore,
        target: req.target as number,
        percentage: Math.min(100, (stats.highestScore / (req.target as number)) * 100),
        label: 'High Score'
      }
    
    case 'combo':
      return {
        current: stats.highestCombo,
        target: req.target as number,
        percentage: Math.min(100, (stats.highestCombo / (req.target as number)) * 100),
        label: 'Highest Combo'
      }
    
    case 'games':
      return {
        current: stats.totalGamesPlayed,
        target: req.target as number,
        percentage: Math.min(100, (stats.totalGamesPlayed / (req.target as number)) * 100),
        label: 'Games Played'
      }
    
    case 'perfect-rounds':
      return {
        current: stats.perfectRounds,
        target: req.target as number,
        percentage: Math.min(100, (stats.perfectRounds / (req.target as number)) * 100),
        label: 'Perfect Rounds'
      }
    
    case 'xp':
      return {
        current: totalXP,
        target: req.target as number,
        percentage: Math.min(100, (totalXP / (req.target as number)) * 100),
        label: 'Total XP'
      }
    
    default:
      return {
        current: 0,
        target: 1,
        percentage: 0,
        label: 'Progress'
      }
  }
}
