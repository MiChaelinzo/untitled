import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Crown, Medal, Trophy, Calendar, DownloadSimple } from '@phosphor-icons/react'
import { LeaderboardEntry, Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FilteredLeaderboardProps {
  leaderboard: LeaderboardEntry[]
  onExport: (format: 'csv' | 'json') => void
}

type TimeFilter = 'all' | 'today' | 'week' | 'month'
type DifficultyFilter = 'all' | Difficulty

export function FilteredLeaderboard({ leaderboard, onExport }: FilteredLeaderboardProps) {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('all')

  const filterByTime = (entry: LeaderboardEntry): boolean => {
    if (timeFilter === 'all') return true

    const now = Date.now()
    const entryTime = entry.timestamp

    switch (timeFilter) {
      case 'today':
        return now - entryTime < 24 * 60 * 60 * 1000
      case 'week':
        return now - entryTime < 7 * 24 * 60 * 60 * 1000
      case 'month':
        return now - entryTime < 30 * 24 * 60 * 60 * 1000
      default:
        return true
    }
  }

  const filterByDifficulty = (entry: LeaderboardEntry): boolean => {
    if (difficultyFilter === 'all') return true
    return entry.difficulty === difficultyFilter
  }

  const filteredLeaderboard = leaderboard
    .filter(filterByTime)
    .filter(filterByDifficulty)
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)

  const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400'
      case 'medium':
        return 'text-blue-400'
      case 'hard':
        return 'text-orange-400'
      case 'insane':
        return 'text-red-400'
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={24} weight="fill" className="text-yellow-400" />
    if (rank === 2) return <Medal size={24} weight="fill" className="text-gray-400" />
    if (rank === 3) return <Medal size={24} weight="fill" className="text-orange-400" />
    return <span className="text-muted-foreground">#{rank}</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-primary" weight="fill" />
          <h2 className="text-2xl font-bold font-['Orbitron']">Leaderboard</h2>
          <Badge variant="outline">
            {filteredLeaderboard.length} {filteredLeaderboard.length === 1 ? 'Entry' : 'Entries'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={timeFilter} onValueChange={(value) => setTimeFilter(value as TimeFilter)}>
            <SelectTrigger className="w-[140px]">
              <Calendar size={16} className="mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={difficultyFilter}
            onValueChange={(value) => setDifficultyFilter(value as DifficultyFilter)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
              <SelectItem value="insane">Insane</SelectItem>
            </SelectContent>
          </Select>

          {filteredLeaderboard.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <DownloadSimple size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('json')}>
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {filteredLeaderboard.length === 0 ? (
        <Card className="p-8 text-center">
          <Trophy size={48} className="mx-auto text-muted-foreground mb-4" weight="duotone" />
          <p className="text-muted-foreground">No entries found for the selected filters.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or play a game to get on the board!
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredLeaderboard.map((entry, index) => (
              <motion.div
                key={`${entry.name}-${entry.timestamp}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-4 ${
                    index < 3 ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 text-center font-bold font-['Orbitron']">
                        {getRankIcon(index + 1)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{entry.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Round {entry.rounds}</span>
                          <span>•</span>
                          <span className={getDifficultyColor(entry.difficulty)}>
                            {DIFFICULTY_CONFIG[entry.difficulty].name}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold font-['Orbitron'] text-primary">
                        {formatScore(entry.score)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
