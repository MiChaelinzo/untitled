import { motion } from 'framer-motion'
import { formatScore } from '@/lib/game-utils'

interface GameHUDProps {
  score: number
  combo: number
  round: number
  targetsRemaining: number
}

export function GameHUD({ score, round, targetsRemaining }: GameHUDProps) {
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
