import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from '@phosphor-icons/react'
import { BACKGROUND_THEMES, BackgroundVariant } from '@/lib/background-themes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BackgroundThemeInfo } from '@/components/BackgroundThemeInfo'

interface ThemedBackgroundSelectorProps {
  currentBackground: BackgroundVariant
  onBackgroundChange: (background: BackgroundVariant) => void
}

export function ThemedBackgroundSelector({ 
  currentBackground, 
  onBackgroundChange 
}: ThemedBackgroundSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold font-['Orbitron']">Background Themes</h3>
        <Badge variant="outline" className="text-xs">
          Curated Collections
        </Badge>
      </div>

      <BackgroundThemeInfo />

      <Tabs defaultValue="nature" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur">
          {Object.entries(BACKGROUND_THEMES).map(([key, theme]) => (
            <TabsTrigger 
              key={key} 
              value={key}
              className="flex items-center gap-2"
            >
              <span className="text-lg">{theme.icon}</span>
              <span className="hidden sm:inline">{theme.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(BACKGROUND_THEMES).map(([themeKey, theme]) => (
          <TabsContent key={themeKey} value={themeKey} className="space-y-4 mt-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              {theme.description}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {theme.backgrounds.map((background) => {
                const isSelected = currentBackground === background.variant
                
                return (
                  <motion.div
                    key={background.variant}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all relative overflow-hidden ${
                        isSelected
                          ? 'ring-2 ring-primary shadow-lg shadow-primary/30'
                          : 'hover:ring-1 hover:ring-primary/50'
                      }`}
                      onClick={() => onBackgroundChange(background.variant)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold font-['Orbitron'] text-sm mb-1">
                            {background.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {background.description}
                          </p>
                        </div>
                        {isSelected && (
                          <Check size={20} className="text-primary" weight="bold" />
                        )}
                      </div>

                      <div className="mt-3 h-12 rounded bg-gradient-to-r from-primary/20 via-accent/20 to-cyan/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                        <span className="text-xs font-mono text-muted-foreground uppercase">
                          {background.variant}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
