import { motion } from 'framer-motion'
import { formatScore } from '@/lib/game-utils'
import { Lightning, Sparkle } from '@phosphor-icons/react'
import { getNextComboBackground } from '@/lib/combo-backgrounds'

interface GameHUDProps {
  score: number
  combo: number
  round: number
  targetsRemaining: number
}

export function GameHUD({ score, combo, round, targetsRemaining }: GameHUDProps) {
  const nextBackground = getNextComboBackground(combo)
  const showMilestoneIndicator = nextBackground && combo > 0 && combo >= nextBackground.comboThreshold - 5

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
      <div className="flex flex-col gap-2">
        <motion.div
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.2 }}
          className="relative bg-card/90 backdrop-blur-md border-2 border-primary/50 rounded-xl px-6 py-3 glow-cyan"
          style={{
            boxShadow: '0 0 20px oklch(0.78 0.20 200 / 0.3), inset 0 0 20px oklch(0.78 0.20 200 / 0.1)'
          }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />
          
          <div className="text-xs text-primary/80 uppercase tracking-widest font-semibold">Score</div>
          <div className="text-3xl font-bold text-white-core glow-text" style={{ color: 'oklch(0.98 0.02 200)' }}>
            {formatScore(score)}
          </div>
        </motion.div>

        {combo > 1 && (
          <motion.div
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: -20 }}
            className={`relative bg-gradient-to-br from-accent/95 to-accent/80 backdrop-blur-md border-2 rounded-xl px-6 py-3 ${
              showMilestoneIndicator ? 'border-amber-400 glow-intense' : 'border-accent/60'
            }`}
            style={{
              boxShadow: showMilestoneIndicator 
                ? '0 0 30px oklch(0.80 0.20 85 / 0.5), inset 0 0 20px oklch(0.72 0.28 340 / 0.2)'
                : '0 0 20px oklch(0.72 0.28 340 / 0.3), inset 0 0 20px oklch(0.72 0.28 340 / 0.1)'
            }}
          >
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent-foreground/50 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent-foreground/50 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent-foreground/50 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent-foreground/50 rounded-br-md" />
            
            <div className="flex items-center gap-2">
              <Lightning weight="fill" className="text-white-core" size={24} />
              <div className="flex-1">
                <div className="text-xs text-white-core/90 uppercase tracking-widest font-semibold">Combo</div>
                <div className="text-2xl font-bold text-white-core flex items-center gap-2">
                  x{combo}
                  {showMilestoneIndicator && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkle className="text-amber-300" weight="fill" size={18} />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            {showMilestoneIndicator && nextBackground && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-1 pt-1 border-t border-white-core/30"
              >
                <p className="text-[10px] text-white-core/90 flex items-center gap-1 font-medium">
                  <span>{nextBackground.icon}</span>
                  <span>{nextBackground.comboThreshold - combo} more for {nextBackground.name}</span>
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <motion.div 
          className="relative bg-card/90 backdrop-blur-md border-2 border-primary/50 rounded-xl px-6 py-3 glow-cyan"
          style={{
            boxShadow: '0 0 20px oklch(0.78 0.20 200 / 0.3), inset 0 0 20px oklch(0.78 0.20 200 / 0.1)'
          }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary rounded-br-lg" />
          
          <div className="text-xs text-primary/80 uppercase tracking-widest font-semibold">Round</div>
          <div className="text-3xl font-bold text-primary glow-text">
            {round}/3
          </div>
        </motion.div>

        <motion.div 
          className="relative bg-card/90 backdrop-blur-md border-2 border-primary/50 rounded-xl px-6 py-3"
          style={{
            boxShadow: '0 0 15px oklch(0.78 0.20 200 / 0.2), inset 0 0 15px oklch(0.78 0.20 200 / 0.08)'
          }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/70 rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/70 rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/70 rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/70 rounded-br-lg" />
          
          <div className="text-xs text-primary/80 uppercase tracking-widest font-semibold">Targets</div>
          <div className="text-2xl font-bold text-foreground">
            {targetsRemaining}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
