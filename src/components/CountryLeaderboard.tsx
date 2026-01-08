import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trophy, Flag, Target } from '@phosphor-icons/react'
import { GlobalLeaderboardEntry } from '@/lib/global-leaderboard'
import { COUNTRIES, getCountryFlag } from '@/lib/country-flags'

interface CountryStats {
  countryCode: string
  countryName: string
  flag: string
  playerCount: number
  totalGames: number
  averageScore: number
  topScore: number
  topPlayer: string
  averageAccuracy: number
}

interface CountryLeaderboardProps {
  leaderboard: GlobalLeaderboardEntry[]
  onSelectCountry?: (countryCode: string) => void
}

export function CountryLeaderboard({ leaderboard, onSelectCountry }: CountryLeaderboardProps) {
  const countryStats = useMemo(() => {
    const statsMap = new Map<string, {
      playerIds: Set<string>
      scores: number[]
      topScore: number
      topPlayer: string
      accuracies: number[]
    }>()

    leaderboard.forEach(entry => {
      if (!entry.countryCode) return

      if (!statsMap.has(entry.countryCode)) {
        statsMap.set(entry.countryCode, {
          playerIds: new Set(),
          scores: [],
          topScore: 0,
          topPlayer: '',
          accuracies: []
        })
      }

      const stats = statsMap.get(entry.countryCode)!
      stats.playerIds.add(entry.userId)
      stats.scores.push(entry.score)
      stats.accuracies.push(entry.accuracy)

      if (entry.score > stats.topScore) {
        stats.topScore = entry.score
        stats.topPlayer = entry.username
      }
    })

    const countryStatsArray: CountryStats[] = []

    statsMap.forEach((stats, countryCode) => {
      const country = COUNTRIES.find(c => c.code === countryCode)
      if (!country) return

      const averageScore = stats.scores.reduce((sum, s) => sum + s, 0) / stats.scores.length
      const averageAccuracy = stats.accuracies.reduce((sum, a) => sum + a, 0) / stats.accuracies.length

      countryStatsArray.push({
        countryCode,
        countryName: country.name,
        flag: country.flag,
        playerCount: stats.playerIds.size,
        totalGames: stats.scores.length,
        averageScore,
        topScore: stats.topScore,
        topPlayer: stats.topPlayer,
        averageAccuracy
      })
    })

    return countryStatsArray.sort((a, b) => b.topScore - a.topScore)
  }, [leaderboard])

  if (countryStats.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No country data available yet</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[500px]">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {countryStats.map((country, index) => (
          <motion.div
            key={country.countryCode}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card 
              className="p-4 hover:bg-accent/5 transition-all cursor-pointer group"
              onClick={() => onSelectCountry?.(country.countryCode)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {country.countryName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {country.playerCount} player{country.playerCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                {index < 3 && (
                  <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
                    #{index + 1}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Top Score
                  </span>
                  <span className="font-bold text-primary">{country.topScore.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Top Player</span>
                  <span className="font-semibold text-foreground truncate max-w-[120px]">
                    {country.topPlayer}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Avg Score</span>
                  <span className="font-semibold text-foreground">
                    {Math.round(country.averageScore).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Avg Accuracy
                  </span>
                  <span className="font-semibold text-accent">
                    {country.averageAccuracy.toFixed(1)}%
                  </span>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    {country.totalGames} game{country.totalGames !== 1 ? 's' : ''} played
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}
