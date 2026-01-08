import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Sparkle } from '@phosphor-icons/react'
import { SpecialGameMode } from '@/lib/special-game-modes'

interface SpecialGameModeBannerProps {
  mode: SpecialGameMode
  onPlayNow: () => void
  onDismiss: () => void
}

export function SpecialGameModeBanner({ mode, onPlayNow, onDismiss }: SpecialGameModeBannerProps) {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <div
        className="relative p-6 rounded-2xl border-2 shadow-2xl overflow-hidden backdrop-blur-md"
        style={{
          borderColor: mode.theme.primaryColor,
          background: `linear-gradient(135deg, ${mode.theme.backgroundColor}95 0%, ${mode.theme.primaryColor}40 100%)`
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle, ${mode.theme.accentColor} 0%, transparent 70%)`
          }}
        />

        <div className="relative z-10 flex items-start gap-4">
          <div 
            className="text-5xl p-4 rounded-xl shrink-0"
            style={{
              background: mode.theme.primaryColor + '30',
              boxShadow: `0 0 30px ${mode.theme.primaryColor}60`
            }}
          >
            {mode.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkle 
                    size={20} 
                    weight="fill" 
                    style={{ color: mode.theme.accentColor }}
                  />
                  <span 
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: mode.theme.accentColor }}
                  >
                    Limited Time Event
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {mode.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mode.description}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X size={20} weight="bold" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Button
                onClick={onPlayNow}
                className="gap-2"
                style={{
                  background: `linear-gradient(135deg, ${mode.theme.primaryColor} 0%, ${mode.theme.accentColor} 100%)`,
                  color: 'white',
                  boxShadow: `0 0 20px ${mode.theme.primaryColor}50`
                }}
              >
                <Sparkle size={18} weight="fill" />
                Play Now
              </Button>

              <div className="flex gap-2">
                {mode.mechanics.specialTargets.slice(0, 3).map((target) => (
                  <div 
                    key={target.id}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium"
                    style={{
                      background: mode.theme.primaryColor + '25',
                      color: mode.theme.primaryColor,
                      border: `1px solid ${mode.theme.primaryColor}40`
                    }}
                  >
                    <span className="text-base">{target.icon}</span>
                    <span>{target.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${mode.theme.primaryColor} 0%, ${mode.theme.accentColor} 100%)`
          }}
        />
      </div>
    </motion.div>
  )
}
