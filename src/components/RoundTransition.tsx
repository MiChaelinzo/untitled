import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@phosphor-icons/react'

interface RoundTransitionProps {
  round: number
  roundName: string
  onContinue: () => void
}

export function RoundTransition({ round, roundName, onContinue }: RoundTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-20"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-center space-y-8"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground uppercase tracking-widest mb-2"
          >
            Round {round}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-primary glow-text"
          >
            {roundName}
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={onContinue}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 glow-box"
          >
            Start Round <ArrowRight className="ml-2" weight="bold" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
