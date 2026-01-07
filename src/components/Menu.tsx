import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Trophy, Lightning } from '@phosphor-icons/react'
import { LeaderboardEntry } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'

interface MenuProps {
  onStartGame: () => void
  leaderboard: LeaderboardEntry[]
}

export function Menu({ onStartGame, leaderboard }: MenuProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <h1 className="text-6xl md:text-7xl font-black text-primary glow-text tracking-tight">
              C9 REFLEX
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-cyan glow-text tracking-tight">
              ARENA
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Test your pro-level reflexes. Hit glowing targets as fast as possible across 3 intense rounds.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            onClick={onStartGame}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl px-12 py-8 glow-box group"
          >
            <Play weight="fill" className="mr-3 group-hover:scale-110 transition-transform" size={32} />
            Start Game
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-accent mx-auto" />
            <div className="font-bold text-foreground">Round 1: Warm Up</div>
            <div className="text-sm text-muted-foreground">10 targets • 3s each</div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-primary mx-auto" />
            <div className="font-bold text-foreground">Round 2: Pro League</div>
            <div className="text-sm text-muted-foreground">15 targets • 2s each</div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-cyan mx-auto" />
            <div className="font-bold text-foreground">Round 3: Championship</div>
            <div className="text-sm text-muted-foreground">20 targets • 1.5s each</div>
          </Card>
        </motion.div>

        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy weight="fill" size={24} className="text-accent" />
              <h3 className="text-2xl font-bold text-foreground">Top Players</h3>
            </div>
            <div className="grid gap-2 max-w-2xl mx-auto max-h-64 overflow-y-auto">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <Card
                  key={index}
                  className="p-4 bg-card/30 backdrop-blur flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-foreground">{entry.name}</span>
                  </div>
                  <span className="text-xl font-bold text-cyan">
                    {formatScore(entry.score)}
                  </span>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Powered by Cloud9 × JetBrains</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
