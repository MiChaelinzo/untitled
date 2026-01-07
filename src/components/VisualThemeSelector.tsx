import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Lock } from '@phosphor-icons/react'
import { VISUAL_THEMES, VisualTheme } from '@/lib/visual-themes'

interface VisualThemeSelectorProps {
  currentTheme: VisualTheme
  onThemeChange: (theme: VisualTheme) => void
}

export function VisualThemeSelector({ currentTheme, onThemeChange }: VisualThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold font-['Orbitron']">Visual Theme</h3>
        <Badge variant="outline" className="text-xs">
          Customize Experience
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(VISUAL_THEMES).map(([key, theme]) => {
          const isSelected = currentTheme === key
          
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/30'
                    : 'hover:ring-1 hover:ring-primary/50'
                }`}
                onClick={() => onThemeChange(key as VisualTheme)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{theme.icon}</span>
                    <div>
                      <h4 className="font-bold font-['Orbitron'] text-sm">
                        {theme.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <Check size={20} className="text-primary" weight="bold" />
                  )}
                </div>

                <div className="flex gap-2 mt-3">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-foreground/20"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-foreground/20"
                    style={{ backgroundColor: theme.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-foreground/20"
                    style={{ backgroundColor: theme.targetGlow }}
                    title="Target Glow"
                  />
                  <div
                    className="w-8 h-8 rounded-full border-2 border-foreground/20"
                    style={{ backgroundColor: theme.comboColor }}
                    title="Combo"
                  />
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
