import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Fire, Trophy, Gift, Calendar } from '@phosphor-icons/react'
import { DailyStreak, getAvailableStreakRewards, STREAK_REWARDS } from '@/lib/streak-system'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface StreakTrackerProps {
  streak: DailyStreak
  onClaimReward: (rewardId: string) => void
}

export function StreakTracker({ streak, onClaimReward }: StreakTrackerProps) {
  const availableRewards = getAvailableStreakRewards(streak)
  const nextMilestone = STREAK_REWARDS.find(r => r.day > streak.currentStreak)

  const handleClaim = (rewardId: string, rewardName: string) => {
    onClaimReward(rewardId)
    toast.success(`Claimed: ${rewardName}!`, {
      description: 'Check your rewards vault to equip it'
    })
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-accent/10 border-orange-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Fire className="text-orange-400 animate-pulse" size={32} weight="fill" />
          <div>
            <h3 className="text-xl font-bold text-foreground">Daily Streak</h3>
            <p className="text-sm text-muted-foreground">Keep playing to earn rewards</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-orange-400">{streak.currentStreak}</div>
          <div className="text-xs text-muted-foreground uppercase">Days</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
          <Trophy className="text-yellow-400 mb-2" size={24} />
          <div className="text-xl font-bold text-foreground">{streak.longestStreak}</div>
          <div className="text-xs text-muted-foreground">Longest Streak</div>
        </div>
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
          <Calendar className="text-cyan mb-2" size={24} />
          <div className="text-xl font-bold text-foreground">{streak.totalLoginDays}</div>
          <div className="text-xs text-muted-foreground">Total Play Days</div>
        </div>
      </div>

      {nextMilestone && (
        <div className="mb-6 p-4 rounded-lg bg-secondary/20 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Next Milestone</span>
            <span className="text-sm font-bold text-primary">{nextMilestone.day} Days</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(streak.currentStreak / nextMilestone.day) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="mt-2 text-xs text-center text-muted-foreground">
            {nextMilestone.day - streak.currentStreak} days until {nextMilestone.name}
          </div>
        </div>
      )}

      <AnimatePresence>
        {availableRewards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-accent">
              <Gift size={20} weight="fill" />
              <span>Rewards Available!</span>
            </div>
            {availableRewards.map((reward) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/40 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-foreground">{reward.name}</div>
                  <div className="text-xs text-muted-foreground">{reward.description}</div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleClaim(reward.id, reward.name)}
                  className="bg-accent hover:bg-accent/80"
                >
                  Claim
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-5 gap-2">
        {STREAK_REWARDS.map((reward) => {
          const isUnlocked = streak.currentStreak >= reward.day
          const isClaimed = streak.claimedRewards.includes(reward.id)

          return (
            <div
              key={reward.id}
              className={`
                relative h-12 rounded-lg border-2 transition-all
                ${isClaimed ? 'bg-accent/30 border-accent' : ''}
                ${isUnlocked && !isClaimed ? 'bg-primary/20 border-primary animate-pulse' : ''}
                ${!isUnlocked ? 'bg-secondary/20 border-border/30 opacity-50' : ''}
              `}
              title={`${reward.name} - Day ${reward.day}`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{reward.day}</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
