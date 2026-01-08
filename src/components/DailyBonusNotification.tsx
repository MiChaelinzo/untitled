import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Fire, X, Gift, Star, Lightning } from '@phosphor-icons/react'
import { DailyStreak, getDailyBonus, getStreakTier } from '@/lib/streak-system'

interface DailyBonusNotificationProps {
  streak: DailyStreak
  onDismiss: () => void
  onViewRewards: () => void
}

export function DailyBonusNotification({ 
  streak, 
  onDismiss, 
  onViewRewards 
}: DailyBonusNotificationProps) {
  const dailyBonus = getDailyBonus(streak)
  const tier = getStreakTier(streak.currentStreak)
  const isNewMilestone = streak.streakMilestones?.includes(streak.currentStreak) || false

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
    >
      <Card className="p-6 bg-gradient-to-br from-orange-500/20 to-accent/20 border-2 border-orange-500/50 shadow-2xl relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-accent/10"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute top-2 right-2 z-10 hover:bg-white/10"
        >
          <X size={20} />
        </Button>

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Fire size={64} weight="fill" className="text-orange-400" />
            </motion.div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-3xl font-bold text-foreground mb-2 glow-text">
              {isNewMilestone ? '🎉 Milestone Reached!' : 'Welcome Back!'}
            </h2>
            <p className="text-muted-foreground">
              Day <strong className="text-foreground text-2xl">{streak.currentStreak}</strong> of your epic journey
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className={`${tier.color} border-current text-lg px-4 py-2`} variant="outline">
              {tier.emoji} {tier.name} Tier
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-primary/20 border border-primary/40 text-center"
            >
              <Lightning size={32} weight="fill" className="text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground">+{dailyBonus}</div>
              <div className="text-xs text-muted-foreground">Daily Bonus XP</div>
            </motion.div>

            {streak.dailyBonusMultiplier > 1.0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-accent/20 border border-accent/40 text-center"
              >
                <Star size={32} weight="fill" className="text-accent mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">
                  {((streak.dailyBonusMultiplier - 1) * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Score Multiplier</div>
              </motion.div>
            )}

            {streak.dailyBonusMultiplier === 1.0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-secondary/20 border border-border/40 text-center"
              >
                <Gift size={32} weight="fill" className="text-muted-foreground mx-auto mb-2" />
                <div className="text-xl font-bold text-foreground">{streak.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Best Streak</div>
              </motion.div>
            )}
          </div>

          {isNewMilestone && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-4 p-4 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-lg font-bold text-yellow-400 mb-2">
                <Gift size={24} weight="fill" />
                <span>New Rewards Unlocked!</span>
                <Gift size={24} weight="fill" />
              </div>
              <p className="text-sm text-muted-foreground">
                Check your rewards to claim exclusive items
              </p>
            </motion.div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onViewRewards}
              className="flex-1 bg-accent hover:bg-accent/80 font-bold text-lg py-6"
            >
              <Gift size={20} weight="fill" className="mr-2" />
              View Rewards
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              className="px-6 py-6"
            >
              Later
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Come back tomorrow to continue your streak!
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
