import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, X, Lightning, Target } from '@phosphor-icons/react'
import { ProPlayer, ProChallengeResult } from '@/lib/pro-player-data'
import { Avatar } from '@/components/ui/avatar'

interface ProChallengeResultsProps {
  player: ProPlayer
  result: ProChallengeResult
  onClose: () => void
  onRetry: () => void
}

export function ProChallengeResults({ player, result, onClose, onRetry }: ProChallengeResultsProps) {
  const getRatingColor = () => {
    switch (result.performanceRating) {
      case 'Exceeded':
        return 'text-accent'
      case 'Matched':
        return 'text-cyan'
      case 'Close':
        return 'text-primary'
      default:
        return 'text-muted-foreground'
    }
  }

  const getRatingBadge = () => {
    switch (result.performanceRating) {
      case 'Exceeded':
        return { text: 'EXCEEDED PRO', variant: 'default' as const, icon: <Lightning weight="fill" /> }
      case 'Matched':
        return { text: 'MATCHED PRO', variant: 'secondary' as const, icon: <Trophy weight="fill" /> }
      case 'Close':
        return { text: 'CLOSE CALL', variant: 'outline' as const, icon: <Target weight="fill" /> }
      default:
        return { text: 'KEEP TRAINING', variant: 'outline' as const, icon: <Target weight="fill" /> }
    }
  }

  const badge = getRatingBadge()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <Card className={`relative w-full max-w-2xl p-8 ${result.won ? 'border-accent glow-box' : 'border-primary'}`}>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <X size={20} />
            </Button>

            <div className="space-y-6">
              <div className="text-center space-y-4">
                <Badge className="text-lg px-4 py-2" variant={badge.variant}>
                  <span className="mr-2">{badge.icon}</span>
                  {badge.text}
                </Badge>

                <h2 className={`text-4xl font-bold ${getRatingColor()} glow-text`}>
                  Pro Challenge Complete
                </h2>

                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  {result.message}
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 py-6">
                <div className="text-center space-y-2">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-primary">
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-3xl font-bold">
                      YOU
                    </div>
                  </Avatar>
                  <div className="text-3xl font-bold text-primary">
                    {result.playerScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Your Score</div>
                </div>

                <div className="text-4xl font-bold text-muted-foreground">
                  {result.won ? '>' : '<'}
                </div>

                <div className="text-center space-y-2">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-accent">
                    <img src={player.avatarUrl} alt={player.name} className="object-cover" />
                  </Avatar>
                  <div className="text-3xl font-bold text-accent">
                    {result.proScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">{player.name}'s Score</div>
                </div>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Score Difference</span>
                  <span className={`font-bold ${result.won ? 'text-accent' : 'text-primary'}`}>
                    {result.won ? '+' : '-'}{result.scoreDifference.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pro Player</span>
                  <span className="font-bold">{player.name} ({player.role})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="secondary">{player.difficulty.toUpperCase()}</Badge>
                </div>
                {result.unlockReward && (
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="text-accent font-bold">🎉 Reward Unlocked!</span>
                    <Badge className="bg-accent text-accent-foreground">Pro Badge</Badge>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button onClick={onRetry} className="flex-1" size="lg">
                  <Target size={20} weight="fill" className="mr-2" />
                  Retry Challenge
                </Button>
                <Button onClick={onClose} variant="outline" className="flex-1" size="lg">
                  Back to Menu
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
