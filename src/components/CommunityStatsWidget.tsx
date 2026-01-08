import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, Users, Trophy, Target, TrendUp, TrendDown, MapPin, Gauge } from '@phosphor-icons/react'
import {
  GlobalLeaderboardEntry,
  CommunityStats,
  calculateCommunityStats
} from '@/lib/global-leaderboard'

interface CommunityStatsWidgetProps {
  globalLeaderboard: GlobalLeaderboardEntry[]
}

export function CommunityStatsWidget({ globalLeaderboard }: CommunityStatsWidgetProps) {
  const stats = calculateCommunityStats(globalLeaderboard)

  const formatTrend = (value: number) => {
    const formatted = value.toFixed(1)
    if (value > 0) return `+${formatted}%`
    return `${formatted}%`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Globe className="w-6 h-6 text-primary" weight="bold" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Community Stats</h3>
          <p className="text-sm text-muted-foreground">Real-time global statistics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center p-4 rounded-lg bg-background/50"
        >
          <Users className="w-8 h-8 mx-auto mb-2 text-primary" weight="fill" />
          <p className="text-2xl font-bold text-foreground">{formatNumber(stats.totalPlayers)}</p>
          <p className="text-xs text-muted-foreground">Total Players</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {stats.recentTrends.activePlayersTrend > 0 ? (
              <TrendUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs ${stats.recentTrends.activePlayersTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatTrend(stats.recentTrends.activePlayersTrend)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center p-4 rounded-lg bg-background/50"
        >
          <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" weight="fill" />
          <p className="text-2xl font-bold text-foreground">{formatNumber(stats.topScore)}</p>
          <p className="text-xs text-muted-foreground">Top Score</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(stats.totalGamesPlayed)} games</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center p-4 rounded-lg bg-background/50"
        >
          <Target className="w-8 h-8 mx-auto mb-2 text-cyan" weight="fill" />
          <p className="text-2xl font-bold text-foreground">{stats.averageAccuracy.toFixed(1)}%</p>
          <p className="text-xs text-muted-foreground">Avg Accuracy</p>
          <p className="text-xs text-muted-foreground mt-1">{formatNumber(stats.totalTargetsHit)} hits</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center p-4 rounded-lg bg-background/50"
        >
          <Gauge className="w-8 h-8 mx-auto mb-2 text-primary" weight="fill" />
          <p className="text-2xl font-bold text-foreground capitalize">{stats.mostPopularDifficulty}</p>
          <p className="text-xs text-muted-foreground">Popular Mode</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {stats.recentTrends.averageScoreTrend > 0 ? (
              <TrendUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs ${stats.recentTrends.averageScoreTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatTrend(stats.recentTrends.averageScoreTrend)}
            </span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">Today</p>
          <p className="text-lg font-bold text-foreground">{formatNumber(stats.todayGames)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">This Week</p>
          <p className="text-lg font-bold text-foreground">{formatNumber(stats.weekGames)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-lg font-bold text-foreground">{formatNumber(stats.monthGames)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Most Active Region:</span>
        </div>
        <Badge variant="secondary" className="font-semibold">
          {stats.mostActiveRegion}
        </Badge>
      </div>
    </Card>
  )
}
