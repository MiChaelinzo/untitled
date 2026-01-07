export type BackgroundVariant = 
  | 'particles' 
  | 'waves' 
  | 'grid' 
  | 'nebula' 
  | 'matrix' 
  | 'aurora' 
  | 'constellation' 
  | 'hexagon' 
  | 'spirals' 
  | 'binary-rain' 
  | 'geometric'

export interface BackgroundTheme {
  name: string
  description: string
  icon: string
  backgrounds: {
    variant: BackgroundVariant
    name: string
    description: string
  }[]
}

export const BACKGROUND_THEMES: Record<string, BackgroundTheme> = {
  nature: {
    name: 'Nature',
    description: 'Organic, flowing patterns inspired by the natural world',
    icon: '🌿',
    backgrounds: [
      {
        variant: 'waves',
        name: 'Ocean Waves',
        description: 'Flowing wave patterns reminiscent of ocean tides'
      },
      {
        variant: 'aurora',
        name: 'Aurora Borealis',
        description: 'Shimmering northern lights dancing across the sky'
      },
      {
        variant: 'spirals',
        name: 'Nautilus Spirals',
        description: 'Organic spiral forms found throughout nature'
      }
    ]
  },
  tech: {
    name: 'Tech',
    description: 'Digital, futuristic patterns for the modern era',
    icon: '💻',
    backgrounds: [
      {
        variant: 'grid',
        name: 'Cyber Grid',
        description: 'Pulsing technological grid network'
      },
      {
        variant: 'matrix',
        name: 'Matrix Code',
        description: 'Cascading digital characters and symbols'
      },
      {
        variant: 'binary-rain',
        name: 'Binary Rain',
        description: 'Streams of binary code flowing downward'
      },
      {
        variant: 'hexagon',
        name: 'Hex Network',
        description: 'Interconnected hexagonal tech pattern'
      },
      {
        variant: 'geometric',
        name: 'Geometric Shapes',
        description: 'Abstract geometric forms in motion'
      }
    ]
  },
  space: {
    name: 'Space',
    description: 'Cosmic patterns from the depths of the universe',
    icon: '🌌',
    backgrounds: [
      {
        variant: 'constellation',
        name: 'Star Constellation',
        description: 'Connected stars forming cosmic patterns'
      },
      {
        variant: 'nebula',
        name: 'Cosmic Nebula',
        description: 'Swirling nebula clouds in deep space'
      },
      {
        variant: 'particles',
        name: 'Stellar Particles',
        description: 'Floating particles like distant stars'
      }
    ]
  }
}

export function getThemeForBackground(variant: BackgroundVariant): string {
  for (const [themeKey, theme] of Object.entries(BACKGROUND_THEMES)) {
    if (theme.backgrounds.some(bg => bg.variant === variant)) {
      return themeKey
    }
  }
  return 'tech'
}

export function getBackgroundInfo(variant: BackgroundVariant) {
  for (const theme of Object.values(BACKGROUND_THEMES)) {
    const bg = theme.backgrounds.find(b => b.variant === variant)
    if (bg) {
      return {
        ...bg,
        theme: theme.name,
        themeIcon: theme.icon
      }
    }
  }
  return null
}
