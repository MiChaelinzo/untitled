import { motion } from 'framer-motion'
import { Achievement } from '@/lib/achievements'
import { Card } from '@/components/ui/card'
import { Trophy } from '@phosphor-icons/react'

interface AchievementToastProps {
  achievement: Achievement
  onComplete: () => void
}

export function AchievementToast({ achievement, onComplete }: AchievementToastProps) {
  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 3000)
      }}
      className="fixed top-4 right-4 z-50 w-80"
    >
      <Card className="p-4 bg-accent/20 border-2 border-accent backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center text-2xl">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={16} weight="fill" className="text-accent" />
              <span className="text-xs text-accent font-bold uppercase tracking-wider">
                Achievement Unlocked!
              </span>
            </div>
            <div className="font-bold text-foreground">{achievement.name}</div>
            <div className="text-sm text-muted-foreground">{achievement.description}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
