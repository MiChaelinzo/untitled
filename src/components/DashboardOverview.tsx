import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lightning, Target, Fire, Medal, ChartBar } from '@phosphor-icons/react'
import { PlayerStats } from '@/lib/achievements'
import { PlayerChallengeData } from '@/lib/challenges'

interface DashboardOverviewProps {
  stats: PlayerStats
  challengeData: PlayerChallengeData
  unlockedAchievements: string[]
}

export function DashboardOverview({ stats, challengeData, unlockedAchievements }: DashboardOverviewProps) {
  const level = challengeData.level || 1
  const xpProgress = challengeData.currentXP || 0
  const nextLevelXP = level * 1000
  const xpPercentage = (xpProgress / nextLevelXP) * 100

  const quickStats = [
    { icon: Trophy, label: 'High Score', value: stats.highestScore.toLocaleString(), color: 'text-yellow-400' },
    { icon: Lightning, label: 'Max Combo', value: `${stats.highestCombo}x`, color: 'text-blue-400' },
    { icon: Target, label: 'Accuracy', value: `${stats.totalTargetsHit > 0 ? ((stats.totalTargetsHit / (stats.totalTargetsHit + stats.totalTargetsMissed)) * 100).toFixed(1) : 0}%`, color: 'text-green-400' },
    { icon: Fire, label: 'Games Played', value: stats.totalGamesPlayed.toString(), color: 'text-orange-400' },
    { icon: Medal, label: 'Perfect Rounds', value: stats.perfectRounds.toString(), color: 'text-purple-400' },
    { icon: ChartBar, label: 'Level', value: level.toString(), color: 'text-cyan-400' }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '300px 1fr',
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: `
        "profile stats"
        "profile challenges"
      `,
      gap: '1.5rem',
      height: '100%'
    }} className="max-lg:grid-cols-1 max-lg:grid-rows-none max-lg:grid-areas-none">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ gridArea: 'profile' }}
        className="max-lg:col-span-1"
      >
        <Card className="p-6 h-full">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-black text-primary-foreground">
              {level}
            </div>
            <div>
              <h3 className="text-2xl font-bold">Level {level}</h3>
              <p className="text-sm text-muted-foreground">{xpProgress.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</p>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{(nextLevelXP - xpProgress).toLocaleString()} XP to next level</p>
            </div>
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Achievements</span>
                <Badge variant="secondary">{unlockedAchievements.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Challenges</span>
                <Badge variant="secondary">{challengeData.completedChallenges?.length || 0}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ gridArea: 'stats' }}
        className="max-lg:col-span-1"
      >
        <Card className="p-6 h-full">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            {quickStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ gridArea: 'challenges' }}
        className="max-lg:col-span-1"
      >
        <Card className="p-6 h-full">
          <h3 className="text-lg font-semibold mb-4">Active Challenges</h3>
          <div className="space-y-3">
            {challengeData.activeChallenges?.slice(0, 3).map((challenge, idx) => {
              const progress = challengeData.progress?.[challenge.id]
              const isComplete = progress?.completed || false
              const progressPercent = progress ? (progress.progress / challenge.requirement.target) * 100 : 0

              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="p-3 rounded-lg bg-muted/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{challenge.name}</div>
                      <div className="text-xs text-muted-foreground">{challenge.description}</div>
                    </div>
                    {isComplete && (
                      <Badge variant="default" className="ml-2">Complete</Badge>
                    )}
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {progress?.progress || 0} / {challenge.requirement.target}
                  </div>
                </motion.div>
              )
            })}
            {(!challengeData.activeChallenges || challengeData.activeChallenges.length === 0) && (
              <div className="text-center text-muted-foreground py-8">
                <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No active challenges</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
