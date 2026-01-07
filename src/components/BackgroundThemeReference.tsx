import { BACKGROUND_THEMES, BackgroundVariant, getBackgroundInfo } from '@/lib/background-themes'

export function BackgroundThemeReference() {
  const allBackgrounds: BackgroundVariant[] = [
    'particles', 'waves', 'grid', 'nebula', 'matrix', 
    'aurora', 'constellation', 'hexagon', 'spirals', 
    'binary-rain', 'geometric'
  ]

  return (
    <div className="space-y-6 p-6 bg-card/30 backdrop-blur rounded-lg border border-primary/20">
      <div>
        <h3 className="text-lg font-bold font-['Orbitron'] mb-2">Background Theme Collections</h3>
        <p className="text-sm text-muted-foreground">
          Backgrounds are organized into curated themes for easy browsing
        </p>
      </div>

      <div className="grid gap-4">
        {Object.entries(BACKGROUND_THEMES).map(([key, theme]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{theme.icon}</span>
              <h4 className="font-bold font-['Orbitron']">{theme.name}</h4>
              <span className="text-xs text-muted-foreground">
                ({theme.backgrounds.length} backgrounds)
              </span>
            </div>
            <p className="text-sm text-muted-foreground pl-8">
              {theme.description}
            </p>
            <ul className="pl-8 space-y-1">
              {theme.backgrounds.map(bg => (
                <li key={bg.variant} className="text-sm">
                  <span className="font-mono text-primary">{bg.variant}</span>
                  <span className="text-muted-foreground"> - {bg.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
