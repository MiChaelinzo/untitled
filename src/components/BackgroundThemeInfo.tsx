import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Info } from '@phosphor-icons/react'
import { BACKGROUND_THEMES } from '@/lib/background-themes'

export function BackgroundThemeInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex gap-3">
          <Info size={24} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="font-bold text-sm">Themed Background Collections</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We've organized all backgrounds into three curated themes to help you find the perfect atmosphere:
            </p>
            <div className="grid gap-2 mt-3">
              {Object.entries(BACKGROUND_THEMES).map(([key, theme]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className="text-lg">{theme.icon}</span>
                  <div>
                    <span className="font-bold text-xs">{theme.name}</span>
                    <span className="text-xs text-muted-foreground"> - {theme.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/10">
              Each theme changes both the canvas animation and the ambient gradient colors to create a cohesive visual experience.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
