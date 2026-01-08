import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChartLine, TrendUp, Target, Clock } from '@phosphor-icons/react'
import { GameSession } from '@/lib/global-stats'
import { motion } from 'framer-motion'

interface PerformanceAnalyticsProps {
  sessions: GameSession[]
}

export function PerformanceAnalytics({ sessions }: PerformanceAnalyticsProps) {
  const recentSessions = sessions.slice(-10).reverse()
  
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0
    const recent = data.slice(-3)
    const older = data.slice(-6, -3)
    if (older.length === 0) return 0
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length
    return ((recentAvg - olderAvg) / olderAvg) * 100
  }

  const scores = sessions.map(s => s.score)
  const accuracy = sessions.map(s => s.targetsHit / (s.targetsHit + s.targetsMissed) * 100)
  const avgReactionTimes = sessions.map(s => {
    const sum = s.reactionTimes.reduce((a, b) => a + b, 0)
    return s.reactionTimes.length > 0 ? sum / s.reactionTimes.length : 0
  })

  const scoreTrend = calculateTrend(scores)
  const accuracyTrend = calculateTrend(accuracy)
  const reactionTrend = calculateTrend(avgReactionTimes)

  const getTrendColor = (trend: number) => {
    if (trend > 5) return 'text-green-400'
    if (trend < -5) return 'text-red-400'
    return 'text-muted-foreground'
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return '📈'
    if (trend < -5) return '📉'
    return '➡️'
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <ChartLine className="text-primary" size={28} weight="fill" />
        <div>
          <h3 className="text-xl font-bold text-foreground">Performance Analytics</h3>
          <p className="text-sm text-muted-foreground">Track your improvement over time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-secondary/30 border border-border/50"
        >
          <div className="flex items-center justify-between mb-2">
            <Target className="text-accent" size={24} />
            <span className={`text-sm font-semibold ${getTrendColor(scoreTrend)}`}>
              {getTrendIcon(scoreTrend)} {Math.abs(scoreTrend).toFixed(0)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {sessions.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length).toLocaleString() : 0}
          </div>
          <div className="text-xs text-muted-foreground">Avg Score Trend</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-lg bg-secondary/30 border border-border/50"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendUp className="text-primary" size={24} />
            <span className={`text-sm font-semibold ${getTrendColor(accuracyTrend)}`}>
              {getTrendIcon(accuracyTrend)} {Math.abs(accuracyTrend).toFixed(0)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {accuracy.length > 0 ? (accuracy.reduce((a, b) => a + b, 0) / accuracy.length).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-muted-foreground">Accuracy Trend</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-lg bg-secondary/30 border border-border/50"
        >
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-cyan" size={24} />
            <span className={`text-sm font-semibold ${getTrendColor(-reactionTrend)}`}>
              {getTrendIcon(-reactionTrend)} {Math.abs(reactionTrend).toFixed(0)}%
            </span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {avgReactionTimes.length > 0 ? Math.round(avgReactionTimes.reduce((a, b) => a + b, 0) / avgReactionTimes.length) : 0}ms
          </div>
          <div className="text-xs text-muted-foreground">Avg Reaction Time</div>
        </motion.div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recent">Recent Games</TabsTrigger>
          <TabsTrigger value="best">Best Performances</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-2">
          {recentSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ChartLine size={48} className="mx-auto mb-3 opacity-30" />
              <p>No games played yet</p>
              <p className="text-sm">Start playing to see your analytics</p>
            </div>
          ) : (
            recentSessions.map((session, index) => {
              const sessionAccuracy = (session.targetsHit / (session.targetsHit + session.targetsMissed)) * 100
              const avgReaction = session.reactionTimes.length > 0
                ? session.reactionTimes.reduce((a, b) => a + b, 0) / session.reactionTimes.length
                : 0

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">
                        {session.score.toLocaleString()} pts
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleDateString()} • {session.difficulty.toUpperCase()}
                        {session.isPractice && ' (Practice)'}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-primary font-semibold">{sessionAccuracy.toFixed(1)}% acc</div>
                      <div className="text-muted-foreground">{Math.round(avgReaction)}ms avg</div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </TabsContent>

        <TabsContent value="best" className="space-y-2">
          {[...sessions]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10)
            .map((session, index) => {
              const sessionAccuracy = (session.targetsHit / (session.targetsHit + session.targetsMissed)) * 100
              const avgReaction = session.reactionTimes.length > 0
                ? session.reactionTimes.reduce((a, b) => a + b, 0) / session.reactionTimes.length
                : 0

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    p-3 rounded-lg border transition-colors
                    ${index === 0 ? 'bg-accent/20 border-accent/50' : 'bg-secondary/20 border-border/30'}
                    hover:border-primary/40
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index < 3 && (
                        <span className="text-2xl">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">
                          {session.score.toLocaleString()} pts
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(session.timestamp).toLocaleDateString()} • {session.difficulty.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-primary font-semibold">{sessionAccuracy.toFixed(1)}% acc</div>
                      <div className="text-muted-foreground">{session.highestCombo}x combo</div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </TabsContent>
      </Tabs>
    </Card>
  )
}
