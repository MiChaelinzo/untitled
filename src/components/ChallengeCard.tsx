import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Clock, Sparkle } from '@phosphor-icons/react'
import { Challenge, ChallengeProgress, TimeLimitedBadge } from '@/lib/challenges'

interface ChallengeCardProps {
  challenge: Challenge
  progress: ChallengeProgress
  onClaimReward?: () => void
}

const DIFFICULTY_COLORS = {
  bronze: {
    bg: 'bg-[#CD7F32]/20',
    border: 'border-[#CD7F32]',
    text: 'text-[#CD7F32]',
    glow: '#CD7F32'
  },
  silver: {
    bg: 'bg-[#C0C0C0]/20',
    border: 'border-[#C0C0C0]',
    text: 'text-[#C0C0C0]',
    glow: '#C0C0C0'
  },
  gold: {
    bg: 'bg-[#FFD700]/20',
    border: 'border-[#FFD700]',
    text: 'text-[#FFD700]',
    glow: '#FFD700'
  },
  platinum: {
    bg: 'bg-[#E5E4E2]/20',
    border: 'border-[#E5E4E2]',
    text: 'text-[#E5E4E2]',
    glow: '#E5E4E2'
  }
}

const CATEGORY_ICONS = {
  accuracy: '🎯',
  speed: '⚡',
  consistency: '🔥',
  endurance: '💪',
  mastery: '👑'
}

export function ChallengeCard({ challenge, progress, onClaimReward }: ChallengeCardProps) {
  const difficultyStyle = DIFFICULTY_COLORS[challenge.difficulty]
  const progressPercent = Math.min((progress.progress / challenge.requirement.target) * 100, 100)
  const isComplete = progress.completed
  const canClaim = isComplete && !progress.claimedReward
  
  const timeRemaining = challenge.expiresAt - Date.now()
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
  const isExpiringSoon = hoursRemaining < 24

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`relative overflow-hidden border-2 ${difficultyStyle.border} ${difficultyStyle.bg} backdrop-blur-sm p-4`}
        style={{
          boxShadow: isComplete ? `0 0 20px ${difficultyStyle.glow}40` : 'none'
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{challenge.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{challenge.name}</h3>
                <Badge variant="outline" className={`text-xs ${difficultyStyle.text} ${difficultyStyle.border}`}>
                  {challenge.type === 'daily' ? 'Daily' : 'Weekly'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </div>
          </div>
          <span className="text-xl">{CATEGORY_ICONS[challenge.category]}</span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-bold">
              {progress.progress} / {challenge.requirement.target}
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Sparkle className="text-accent" size={16} weight="fill" />
              <span className="font-bold text-accent">{challenge.reward.xp} XP</span>
            </div>
            {challenge.reward.badge && (
              <div className="flex items-center gap-1">
                <Trophy className="text-accent" size={16} weight="fill" />
                <span className="text-xs text-muted-foreground">+ Badge</span>
              </div>
            )}
            {challenge.reward.title && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">+ Title</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs ${isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'}`}>
              <Clock size={14} />
              <span>{hoursRemaining}h left</span>
            </div>
            {canClaim && (
              <Button 
                size="sm" 
                onClick={onClaimReward}
                className="glow-box"
                style={{ color: difficultyStyle.glow }}
              >
                Claim
              </Button>
            )}
          </div>
        </div>

        {isComplete && !canClaim && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none"
          >
            <Badge variant="default" className="text-lg px-4 py-2">
              ✓ Completed
            </Badge>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

interface BadgeDisplayProps {
  badge: TimeLimitedBadge
  isNew?: boolean
}

const RARITY_STYLES = {
  common: {
    bg: 'bg-gray-500/20',
    border: 'border-gray-500',
    text: 'text-gray-300',
    glow: '#9CA3AF'
  },
  rare: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500',
    text: 'text-blue-300',
    glow: '#60A5FA'
  },
  epic: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500',
    text: 'text-purple-300',
    glow: '#A78BFA'
  },
  legendary: {
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500',
    text: 'text-yellow-300',
    glow: '#FCD34D'
  }
}

export function BadgeDisplay({ badge, isNew }: BadgeDisplayProps) {
  const rarityStyle = RARITY_STYLES[badge.rarity]
  const timeRemaining = badge.expiresAt - Date.now()
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysRemaining < 3

  return (
    <motion.div
      initial={isNew ? { scale: 0, rotate: -180 } : false}
      animate={isNew ? { scale: 1, rotate: 0 } : {}}
      transition={{ type: 'spring', duration: 0.6 }}
      whileHover={{ scale: 1.05, rotate: 5 }}
      className="relative"
    >
      <Card 
        className={`p-4 border-2 ${rarityStyle.border} ${rarityStyle.bg} backdrop-blur-sm text-center`}
        style={{
          boxShadow: `0 0 20px ${badge.glowColor || rarityStyle.glow}40`
        }}
      >
        <div className="text-4xl mb-2">{badge.icon}</div>
        <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
        <p className="text-xs text-muted-foreground mb-2">{badge.description}</p>
        <Badge variant="outline" className={`text-xs ${rarityStyle.text} ${rarityStyle.border}`}>
          {badge.rarity.toUpperCase()}
        </Badge>
        <div className={`flex items-center justify-center gap-1 text-xs mt-2 ${isExpiringSoon ? 'text-destructive' : 'text-muted-foreground'}`}>
          <Clock size={12} />
          <span>{daysRemaining}d left</span>
        </div>
      </Card>
      {isNew && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${badge.glowColor || rarityStyle.glow}`
          }}
        />
      )}
    </motion.div>
  )
}
