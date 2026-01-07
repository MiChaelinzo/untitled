export type VisualTheme = 'cyberpunk' | 'neon-city' | 'matrix' | 'sunset' | 'ice'

export interface ThemeColors {
  name: string
  description: string
  background: string
  primary: string
  secondary: string
  accent: string
  targetGlow: string
  comboColor: string
  icon: string
}

export const VISUAL_THEMES: Record<VisualTheme, ThemeColors> = {
  cyberpunk: {
    name: 'Cyberpunk',
    description: 'Classic Cloud9 electric aesthetic',
    background: 'oklch(0.15 0.02 240)',
    primary: 'oklch(0.65 0.24 240)',
    secondary: 'oklch(0.25 0.05 240)',
    accent: 'oklch(0.70 0.25 350)',
    targetGlow: 'oklch(0.75 0.18 195)',
    comboColor: 'oklch(0.70 0.25 350)',
    icon: '⚡'
  },
  'neon-city': {
    name: 'Neon City',
    description: 'Tokyo nights with purple and gold',
    background: 'oklch(0.12 0.03 280)',
    primary: 'oklch(0.68 0.22 290)',
    secondary: 'oklch(0.22 0.06 280)',
    accent: 'oklch(0.75 0.20 60)',
    targetGlow: 'oklch(0.72 0.20 290)',
    comboColor: 'oklch(0.75 0.20 60)',
    icon: '🏙️'
  },
  matrix: {
    name: 'Matrix',
    description: 'Green code rain aesthetic',
    background: 'oklch(0.08 0.02 140)',
    primary: 'oklch(0.70 0.22 145)',
    secondary: 'oklch(0.18 0.04 140)',
    accent: 'oklch(0.75 0.25 150)',
    targetGlow: 'oklch(0.72 0.22 145)',
    comboColor: 'oklch(0.80 0.20 120)',
    icon: '💚'
  },
  sunset: {
    name: 'Sunset Blaze',
    description: 'Warm orange and red tones',
    background: 'oklch(0.14 0.03 30)',
    primary: 'oklch(0.65 0.23 45)',
    secondary: 'oklch(0.24 0.05 30)',
    accent: 'oklch(0.68 0.26 25)',
    targetGlow: 'oklch(0.70 0.24 50)',
    comboColor: 'oklch(0.72 0.28 20)',
    icon: '🌅'
  },
  ice: {
    name: 'Arctic Ice',
    description: 'Cool blues and frost white',
    background: 'oklch(0.16 0.02 220)',
    primary: 'oklch(0.68 0.18 210)',
    secondary: 'oklch(0.26 0.04 220)',
    accent: 'oklch(0.85 0.12 200)',
    targetGlow: 'oklch(0.75 0.16 210)',
    comboColor: 'oklch(0.90 0.10 190)',
    icon: '❄️'
  }
}

export function applyVisualTheme(theme: VisualTheme) {
  const colors = VISUAL_THEMES[theme]
  const root = document.documentElement
  
  root.style.setProperty('--background', colors.background)
  root.style.setProperty('--primary', colors.primary)
  root.style.setProperty('--secondary', colors.secondary)
  root.style.setProperty('--accent', colors.accent)
  root.style.setProperty('--cyan', colors.targetGlow)
  root.style.setProperty('--combo-color', colors.comboColor)
}
