import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Lightning, Fire, Trophy, Target, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface QuickAction {
  id: string
  label: string
  description: string
  icon: typeof Lightning
  color: string
  action: () => void
  lastUsed?: number
}

interface QuickActionsMenuProps {
  onQuickPlay: () => void
  onPractice: () => void
  onLastDifficulty: () => void
  onChallenge: () => void
  onTournament: () => void
  recentActions: string[]
}

export function QuickActionsMenu({
  onQuickPlay,
  onPractice,
  onLastDifficulty,
  onChallenge,
  onTournament,
  recentActions
}: QuickActionsMenuProps) {
  const actions: QuickAction[] = [
    {
      id: 'quick-play',
      label: 'Quick Play',
      description: 'Jump into medium difficulty',
      icon: Lightning,
      color: 'text-yellow-400',
      action: onQuickPlay
    },
    {
      id: 'practice',
      label: 'Practice Mode',
      description: 'Warm up without pressure',
      icon: Target,
      color: 'text-cyan',
      action: onPractice
    },
    {
      id: 'last-difficulty',
      label: 'Last Played',
      description: 'Continue where you left off',
      icon: Clock,
      color: 'text-primary',
      action: onLastDifficulty
    },
    {
      id: 'challenge',
      label: 'Daily Challenge',
      description: 'Complete today\'s objective',
      icon: Fire,
      color: 'text-orange-400',
      action: onChallenge
    },
    {
      id: 'tournament',
      label: 'Tournament',
      description: 'Compete in brackets',
      icon: Trophy,
      color: 'text-accent',
      action: onTournament
    }
  ]

  const sortedActions = [...actions].sort((a, b) => {
    const aIndex = recentActions.indexOf(a.id)
    const bIndex = recentActions.indexOf(b.id)
    if (aIndex === -1 && bIndex === -1) return 0
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Lightning className="text-primary" size={28} weight="fill" />
        <div>
          <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Jump right into the action</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {sortedActions.map((action, index) => {
          const isRecent = recentActions.includes(action.id)
          const Icon = action.icon

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                onClick={action.action}
                variant="outline"
                className={`
                  h-auto flex-col gap-2 p-4 w-full
                  hover:border-primary/50 hover:bg-primary/10
                  transition-all
                  ${isRecent ? 'border-primary/40 bg-primary/5' : ''}
                `}
              >
                <div className="relative">
                  <Icon className={action.color} size={32} weight="duotone" />
                  {isRecent && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm text-foreground">{action.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{action.description}</div>
                </div>
              </Button>
            </motion.div>
          )
        })}
      </div>

      {recentActions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground text-center">
            Recently used actions appear first
          </div>
        </div>
      )}
    </Card>
  )
}
