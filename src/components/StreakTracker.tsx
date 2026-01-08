import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Fire, Trophy, Gift, Calendar, Lightning, Snowflake, Star, Crown } from '@phosphor-icons/react'
import { 
  DailyStreak, 
  getAvailableStreakRewards, 
  STREAK_REWARDS,
  getDailyBonus,
  getStreakTier
} from '@/lib/streak-system'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import { StreakRewardCelebration } from '@/components/StreakRewardCelebration'

interface StreakTrackerProps {
  streak: DailyStreak
  onClaimReward: (rewardId: string) => void
}

export function StreakTracker({ streak, onClaimReward }: StreakTrackerProps) {
  const availableRewards = getAvailableStreakRewards(streak)
  const nextMilestone = STREAK_REWARDS.find(r => r.day > streak.currentStreak)
  const dailyBonus = getDailyBonus(streak)
  const tier = getStreakTier(streak.currentStreak)
  const [celebrationReward, setCelebrationReward] = useState<{ name: string; icon?: string; xpBonus?: number } | null>(null)

  const handleClaim = (rewardId: string, rewardName: string, rewardIcon?: string, xpBonus?: number) => {
    onClaimReward(rewardId)
    setCelebrationReward({ name: rewardName, icon: rewardIcon, xpBonus })
    const xpText = xpBonus ? ` (+${xpBonus} XP)` : ''
    toast.success(`Claimed: ${rewardName}!${xpText}`, {
      description: 'Check your rewards vault to equip it'
    })
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/40'
      case 'epic': return 'from-purple-500/20 to-pink-500/20 border-purple-500/40'
      case 'rare': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40'
      case 'common': return 'from-green-500/20 to-emerald-500/20 border-green-500/40'
      default: return 'from-accent/20 to-primary/20 border-accent/40'
    }
  }

  const getRarityBadge = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
      case 'common': return 'bg-green-500/20 text-green-400 border-green-500/50'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  return (
    <>
      <AnimatePresence>
        {celebrationReward && (
          <StreakRewardCelebration
            rewardName={celebrationReward.name}
            rewardIcon={celebrationReward.icon}
            xpBonus={celebrationReward.xpBonus}
            onComplete={() => setCelebrationReward(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-accent/10 border-orange-500/30 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent"
          animate={{ 
            x: ['-100%', '100%']
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                <Fire className="text-orange-400" size={36} weight="fill" />
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  Daily Streak
                  <Badge className={getRarityBadge(tier.name.toLowerCase())} variant="outline">
                    {tier.emoji} {tier.name}
                  </Badge>
                </h3>
                <p className="text-sm text-muted-foreground">Keep playing to earn epic rewards</p>
              </div>
            </div>
            <div className="text-right">
              <motion.div 
                className="text-5xl font-bold text-orange-400 glow-text"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {streak.currentStreak}
              </motion.div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Days</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <motion.div 
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Trophy className="text-yellow-400 mb-2" size={24} weight="fill" />
              <div className="text-2xl font-bold text-foreground">{streak.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </motion.div>
            
            <motion.div 
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-cyan/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Calendar className="text-cyan mb-2" size={24} weight="fill" />
              <div className="text-2xl font-bold text-foreground">{streak.totalLoginDays}</div>
              <div className="text-xs text-muted-foreground">Total Days</div>
            </motion.div>

            <motion.div 
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Lightning className="text-primary mb-2" size={24} weight="fill" />
              <div className="text-2xl font-bold text-foreground">+{dailyBonus}</div>
              <div className="text-xs text-muted-foreground">Daily Bonus XP</div>
            </motion.div>

            <motion.div 
              className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-accent/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <Snowflake className="text-accent mb-2" size={24} weight="fill" />
              <div className="text-2xl font-bold text-foreground">{streak.freezeTokens || 0}</div>
              <div className="text-xs text-muted-foreground">Freeze Tokens</div>
            </motion.div>
          </div>

          {streak.dailyBonusMultiplier > 1.0 && (
            <motion.div 
              className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 justify-center">
                <Star className="text-primary" size={24} weight="fill" />
                <span className="text-lg font-bold text-primary">
                  {((streak.dailyBonusMultiplier - 1) * 100).toFixed(0)}% Score Multiplier Active!
                </span>
                <Star className="text-primary" size={24} weight="fill" />
              </div>
            </motion.div>
          )}

          {nextMilestone && (
            <div className="mb-6 p-5 rounded-lg bg-secondary/20 border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Next Milestone</span>
                  {nextMilestone.icon && <span className="text-xl">{nextMilestone.icon}</span>}
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-primary">{nextMilestone.day} Days</span>
                  {nextMilestone.rarity && (
                    <Badge className={`ml-2 ${getRarityBadge(nextMilestone.rarity)}`} variant="outline">
                      {nextMilestone.rarity}
                    </Badge>
                  )}
                </div>
              </div>
              <Progress 
                value={(streak.currentStreak / nextMilestone.day) * 100} 
                className="h-3 mb-2"
              />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{nextMilestone.name}</span>
                <span className="text-primary font-semibold">
                  {nextMilestone.day - streak.currentStreak} days to go
                </span>
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
                <div className="flex items-center gap-2 text-base font-bold text-accent mb-3">
                  <Gift size={24} weight="fill" className="animate-bounce" />
                  <span>🎉 {availableRewards.length} Reward{availableRewards.length > 1 ? 's' : ''} Available!</span>
                </div>
                {availableRewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg bg-gradient-to-r ${getRarityColor(reward.rarity)} border flex items-center justify-between hover:scale-[1.02] transition-transform`}
                  >
                    <div className="flex items-center gap-3">
                      {reward.icon && <span className="text-3xl">{reward.icon}</span>}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground text-lg">{reward.name}</span>
                          {reward.rarity && (
                            <Badge className={getRarityBadge(reward.rarity)} variant="outline">
                              {reward.rarity}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{reward.description}</div>
                        {reward.bonus && (
                          <div className="flex gap-3 mt-2 text-xs">
                            {reward.bonus.xp && (
                              <span className="text-primary font-semibold">+{reward.bonus.xp} XP</span>
                            )}
                            {reward.bonus.multiplier && (
                              <span className="text-accent font-semibold">
                                {((reward.bonus.multiplier - 1) * 100).toFixed(0)}% Multiplier
                              </span>
                            )}
                            {reward.bonus.tokens && (
                              <span className="text-cyan font-semibold">+{reward.bonus.tokens} Freeze Token{reward.bonus.tokens > 1 ? 's' : ''}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => handleClaim(reward.id, reward.name, reward.icon, reward.bonus?.xp)}
                      className="bg-accent hover:bg-accent/80 font-bold"
                    >
                      <Crown size={20} weight="fill" className="mr-2" />
                      Claim
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
              Milestone Progress
            </h4>
            <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
              {STREAK_REWARDS.map((reward) => {
                const isUnlocked = streak.currentStreak >= reward.day
                const isClaimed = streak.claimedRewards.includes(reward.id)

                return (
                  <motion.div
                    key={reward.id}
                    whileHover={{ scale: 1.1 }}
                    className={`
                      relative aspect-square rounded-lg border-2 transition-all cursor-pointer
                      ${isClaimed ? 'bg-accent/30 border-accent shadow-lg shadow-accent/20' : ''}
                      ${isUnlocked && !isClaimed ? 'bg-primary/20 border-primary animate-pulse' : ''}
                      ${!isUnlocked ? 'bg-secondary/20 border-border/30 opacity-40' : ''}
                    `}
                    title={`${reward.name} - Day ${reward.day}${reward.bonus?.xp ? ` (+${reward.bonus.xp} XP)` : ''}`}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                      {reward.icon && <span className="text-lg mb-1">{reward.icon}</span>}
                      <span className="text-xs font-bold">{reward.day}</span>
                      {isClaimed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Star className="text-accent" size={16} weight="fill" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {(streak.freezeTokens || 0) > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-lg bg-cyan/10 border border-cyan/30"
            >
              <div className="flex items-center gap-2 text-sm text-cyan">
                <Snowflake size={18} weight="fill" />
                <span>
                  <strong>Freeze Tokens:</strong> Use a token to maintain your streak if you miss a day
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
    </>
  )
}
