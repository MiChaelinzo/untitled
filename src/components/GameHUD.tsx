import { motion } from 'framer-motion'
import { formatScore } from '@/lib/game-utils'
import { Lightning } from '@phosphor-icons/react'

interface GameHUDProps {
  score: number
  combo: number
  round: number
  targetsRemaining: number
}

export function GameHUD({ score, combo, round, targetsRemaining }: GameHUDProps) {
  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
      <div className="flex flex-col gap-2">
        <motion.div
          key={score}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.2 }}
          className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2"
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Score</div>
          <div className="text-2xl font-bold text-cyan glow-text">
            {formatScore(score)}
          </div>
        </motion.div>

        {combo > 1 && (
          <motion.div
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: -20 }}
            className="bg-accent/90 backdrop-blur-sm border border-accent rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Lightning weight="fill" className="text-accent-foreground" size={20} />
            <div>
              <div className="text-xs text-accent-foreground uppercase tracking-wider">Combo</div>
              <div className="text-xl font-bold text-accent-foreground">
                x{combo}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Round</div>
          <div className="text-2xl font-bold text-primary">
            {round}/3
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">Targets</div>
          <div className="text-xl font-bold text-foreground">
            {targetsRemaining}
          </div>
        </div>
      </div>
    </div>
  )
}
