import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Sparkle } from '@phosphor-icons/react'
import { EventChallenge, getTierColor } from '@/lib/seasonal-events'

interface EventChallengeProgressProps {
  challenges: EventChallenge[]
  progress: Record<string, number>
  completedChallenges: string[]
  isVisible?: boolean
}

export function EventChallengeProgress({ 
  challenges, 
  progress, 
  completedChallenges,
  isVisible = true 
}: EventChallengeProgressProps) {
  if (!isVisible || challenges.length === 0) return null

  const activeChallenges = challenges.filter(c => !completedChallenges.includes(c.id)).slice(0, 3)

  return (
    <AnimatePresence>
      {activeChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          className="fixed top-24 right-6 z-40 space-y-2"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkle className="w-4 h-4 text-primary" weight="fill" />
            <span className="text-xs font-semibold text-primary">Event Challenges</span>
          </div>
          {activeChallenges.map((challenge) => {
            const currentProgress = progress[challenge.id] || 0
            const targetProgress = challenge.requirement.target
            const progressPercent = Math.min((currentProgress / targetProgress) * 100, 100)

            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card 
                  className="p-3 w-64 backdrop-blur-sm bg-card/80 border-2"
                  style={{
                    borderColor: getTierColor(challenge.tier)
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div 
                      className="text-xl shrink-0"
                      style={{
                        filter: `drop-shadow(0 0 8px ${getTierColor(challenge.tier)})`
                      }}
                    >
                      {challenge.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <h4 className="text-xs font-semibold truncate">{challenge.name}</h4>
                      </div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {currentProgress.toLocaleString()} / {targetProgress.toLocaleString()}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-[10px] px-1 py-0"
                          style={{
                            borderColor: getTierColor(challenge.tier),
                            color: getTierColor(challenge.tier)
                          }}
                        >
                          {challenge.tier}
                        </Badge>
                      </div>
                      <Progress 
                        value={progressPercent} 
                        className="h-1.5"
                        style={{
                          backgroundColor: `color-mix(in oklch, ${getTierColor(challenge.tier)} 20%, transparent)`
                        }}
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
