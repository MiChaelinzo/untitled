import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Trophy,
  TrendUp,
  TrendDown,
  Globe,
  Users,
  Target,
  Lightning,
  Crown,
  MedalMilitary,
  Star,
  Download,
  Funnel,
  MapPin,
  Calendar,
  Gauge,
  Flag
} from '@phosphor-icons/react'
import {
  GlobalLeaderboardEntry,
  CommunityStats,
  RegionalStats,
  TrendingPlayer,
  LeaderboardFilter,
  PlayerRankInfo,
  filterLeaderboard,
  calculateCommunityStats,
  getRegionalStats,
  getTrendingPlayers,
  getPlayerRankInfo,
  exportLeaderboardData,
  REGIONS
} from '@/lib/global-leaderboard'
import { Difficulty } from '@/lib/game-types'
import { toast } from 'sonner'
import { 
  COUNTRIES, 
  getCountryFlag, 
  getCountriesByRegion,
  getAllRegions 
} from '@/lib/country-flags'
import { CountryLeaderboard } from './CountryLeaderboard'

interface GlobalLeaderboardProps {
  leaderboard: GlobalLeaderboardEntry[]
  currentUserId: string
  onClose: () => void
}

export function GlobalLeaderboard({ leaderboard, currentUserId, onClose }: GlobalLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'countries' | 'regional' | 'trending' | 'stats'>('global')
  const [filter, setFilter] = useState<LeaderboardFilter>({
    timeRange: 'all-time'
  })

  const availableCountries = useMemo(() => {
    const codes = new Set(leaderboard.map(e => e.countryCode).filter(Boolean))
    return COUNTRIES.filter(c => codes.has(c.code) && c.name && c.flag).sort((a, b) => a.name.localeCompare(b.name))
  }, [leaderboard])

  const filteredLeaderboard = useMemo(() => 
    filterLeaderboard(leaderboard, filter),
    [leaderboard, filter]
  )

  const communityStats = useMemo(() => 
    calculateCommunityStats(leaderboard),
    [leaderboard]
  )

  const regionalStats = useMemo(() => 
    getRegionalStats(leaderboard),
    [leaderboard]
  )

  const trendingPlayers = useMemo(() => 
    getTrendingPlayers(leaderboard, 10),
    [leaderboard]
  )

  const playerRankInfo = useMemo(() => 
    getPlayerRankInfo(leaderboard, currentUserId, filter),
    [leaderboard, currentUserId, filter]
  )

  const handleExport = () => {
    const csv = exportLeaderboardData(leaderboard, filter)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leaderboard-${filter.timeRange}-${Date.now()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Leaderboard exported!')
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank === 2) return 'text-gray-300'
    if (rank === 3) return 'text-amber-600'
    return 'text-muted-foreground'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" weight="fill" />
    if (rank === 2) return <MedalMilitary className="w-5 h-5 text-gray-300" weight="fill" />
    if (rank === 3) return <Star className="w-5 h-5 text-amber-600" weight="fill" />
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  const formatTrend = (value: number) => {
    const formatted = value.toFixed(1)
    if (value > 0) return `+${formatted}%`
    return `${formatted}%`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-card/95 backdrop-blur-xl border-primary/30 shadow-2xl">
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Globe className="w-6 h-6 text-primary" weight="bold" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Global Leaderboard</h2>
                  <p className="text-sm text-muted-foreground">
                    {communityStats.totalPlayers.toLocaleString()} players • {communityStats.totalGamesPlayed.toLocaleString()} games
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  ✕
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Select 
                value={filter.timeRange} 
                onValueChange={(value) => setFilter({ ...filter, timeRange: value as any })}
              >
                <SelectTrigger className="w-[140px]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all-time">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filter.difficulty || 'all'} 
                onValueChange={(value) => setFilter({ ...filter, difficulty: value === 'all' ? undefined : value as Difficulty })}
              >
                <SelectTrigger className="w-[140px]">
                  <Gauge className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="insane">Insane</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filter.region || 'all'} 
                onValueChange={(value) => {
                  setFilter({ 
                    ...filter, 
                    region: value === 'all' ? undefined : value,
                    country: undefined
                  })
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filter.country || 'all'} 
                onValueChange={(value) => setFilter({ ...filter, country: value === 'all' ? undefined : value })}
              >
                <SelectTrigger className="w-[180px]">
                  <Flag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {availableCountries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        {country.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {playerRankInfo && (
                <Badge variant="outline" className="px-3 py-1.5 bg-primary/10 border-primary/30">
                  Your Rank: #{playerRankInfo.globalRank}
                </Badge>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="global">
                  <Trophy className="w-4 h-4 mr-2" />
                  Global
                </TabsTrigger>
                <TabsTrigger value="countries">
                  <Flag className="w-4 h-4 mr-2" />
                  Countries
                </TabsTrigger>
                <TabsTrigger value="regional">
                  <MapPin className="w-4 h-4 mr-2" />
                  Regional
                </TabsTrigger>
                <TabsTrigger value="trending">
                  <TrendUp className="w-4 h-4 mr-2" />
                  Trending
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <Lightning className="w-4 h-4 mr-2" />
                  Stats
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-6">
                <TabsContent value="global" className="mt-0">
                  {filteredLeaderboard.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No entries found for the selected filters</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLeaderboard.slice(0, 50).map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <Card className={`p-4 transition-all hover:bg-accent/5 ${
                            entry.userId === currentUserId ? 'bg-primary/10 border-primary/50' : ''
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-12 flex items-center justify-center">
                                  {getRankIcon(entry.rank || index + 1)}
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-border">
                                  <AvatarImage src={entry.avatarUrl} />
                                  <AvatarFallback>{entry.username[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground truncate">
                                      {entry.username}
                                    </p>
                                    {entry.countryCode && (
                                      <span className="text-lg" title={entry.country || entry.countryCode}>
                                        {getCountryFlag(entry.countryCode)}
                                      </span>
                                    )}
                                    {entry.title && (
                                      <Badge variant="secondary" className="text-xs">
                                        {entry.title}
                                      </Badge>
                                    )}
                                    {entry.badges && entry.badges.length > 0 && (
                                      <div className="flex gap-1">
                                        {entry.badges.slice(0, 2).map((badge, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {badge}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    {entry.region && (
                                      <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {entry.region}
                                      </span>
                                    )}
                                    <span className="capitalize">{entry.difficulty}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-6 text-right">
                                <div>
                                  <p className="text-2xl font-bold text-primary">
                                    {entry.score.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">score</p>
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-foreground">
                                    {entry.accuracy.toFixed(1)}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">accuracy</p>
                                </div>
                                <div>
                                  <p className="text-lg font-semibold text-accent">
                                    {entry.highestCombo}x
                                  </p>
                                  <p className="text-xs text-muted-foreground">combo</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="countries" className="mt-0">
                  <CountryLeaderboard 
                    leaderboard={leaderboard}
                    onSelectCountry={(countryCode) => {
                      setFilter({ ...filter, country: countryCode })
                      setActiveTab('global')
                      const country = COUNTRIES.find(c => c.code === countryCode)
                      if (country) {
                        toast.success(`Filtering by ${country.name}`)
                      }
                    }}
                  />
                </TabsContent>

                <TabsContent value="regional" className="mt-0">
                  <div className="grid gap-4 md:grid-cols-2">
                    {regionalStats.map((stats, index) => (
                      <motion.div
                        key={stats.region}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-5 bg-gradient-to-br from-card to-card/50">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" weight="fill" />
                                {stats.region}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {stats.playerCount} player{stats.playerCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {stats.gamesPlayed} games
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Top Player</span>
                              <span className="font-semibold text-foreground">{stats.topPlayer || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Top Score</span>
                              <span className="font-bold text-primary">{stats.topScore.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Avg Score</span>
                              <span className="font-semibold text-foreground">{Math.round(stats.averageScore).toLocaleString()}</span>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="trending" className="mt-0">
                  {trendingPlayers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <TrendUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No trending players yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {trendingPlayers.map((player, index) => (
                        <motion.div
                          key={player.userId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 hover:bg-accent/5 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-8 text-center">
                                  <span className="text-lg font-bold text-muted-foreground">
                                    {index + 1}
                                  </span>
                                </div>
                                <Avatar className="h-10 w-10 border-2 border-border">
                                  <AvatarImage src={player.avatarUrl} />
                                  <AvatarFallback>{player.username[0]?.toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="font-semibold text-foreground">{player.username}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {player.gamesPlayedToday} game{player.gamesPlayedToday !== 1 ? 's' : ''} today
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-right">
                                <div>
                                  <p className="text-xl font-bold text-primary">
                                    {player.recentScore.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-muted-foreground">recent score</p>
                                </div>
                                <div>
                                  <div className={`flex items-center gap-1 ${
                                    player.scoreImprovement > 0 ? 'text-green-500' : 'text-red-500'
                                  }`}>
                                    {player.scoreImprovement > 0 ? (
                                      <TrendUp className="w-4 h-4" weight="bold" />
                                    ) : (
                                      <TrendDown className="w-4 h-4" weight="bold" />
                                    )}
                                    <span className="text-sm font-bold">
                                      {formatTrend(player.scoreImprovement)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground">improvement</p>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card className="p-5 bg-gradient-to-br from-primary/10 to-primary/5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-primary/20">
                            <Users className="w-5 h-5 text-primary" weight="bold" />
                          </div>
                          <h3 className="font-semibold text-muted-foreground">Total Players</h3>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          {communityStats.totalPlayers.toLocaleString()}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          {communityStats.recentTrends.activePlayersTrend > 0 ? (
                            <TrendUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={communityStats.recentTrends.activePlayersTrend > 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatTrend(communityStats.recentTrends.activePlayersTrend)}
                          </span>
                          <span className="text-muted-foreground">this week</span>
                        </div>
                      </Card>

                      <Card className="p-5 bg-gradient-to-br from-accent/10 to-accent/5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-accent/20">
                            <Trophy className="w-5 h-5 text-accent" weight="bold" />
                          </div>
                          <h3 className="font-semibold text-muted-foreground">Top Score</h3>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          {communityStats.topScore.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {communityStats.totalGamesPlayed.toLocaleString()} total games
                        </p>
                      </Card>

                      <Card className="p-5 bg-gradient-to-br from-cyan/10 to-cyan/5">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-lg bg-cyan/20">
                            <Target className="w-5 h-5 text-cyan" weight="bold" />
                          </div>
                          <h3 className="font-semibold text-muted-foreground">Avg Accuracy</h3>
                        </div>
                        <p className="text-3xl font-bold text-foreground">
                          {communityStats.averageAccuracy.toFixed(1)}%
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {communityStats.totalTargetsHit.toLocaleString()} targets hit
                        </p>
                      </Card>
                    </div>

                    <Card className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Lightning className="w-5 h-5 text-primary" weight="fill" />
                        Activity Overview
                      </h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Today</p>
                          <p className="text-2xl font-bold text-foreground">
                            {communityStats.todayGames.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">games played</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">This Week</p>
                          <p className="text-2xl font-bold text-foreground">
                            {communityStats.weekGames.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1 text-xs mt-1">
                            {communityStats.recentTrends.gamesPlayedTrend > 0 ? (
                              <TrendUp className="w-3 h-3 text-green-500" />
                            ) : (
                              <TrendDown className="w-3 h-3 text-red-500" />
                            )}
                            <span className={communityStats.recentTrends.gamesPlayedTrend > 0 ? 'text-green-500' : 'text-red-500'}>
                              {formatTrend(communityStats.recentTrends.gamesPlayedTrend)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">This Month</p>
                          <p className="text-2xl font-bold text-foreground">
                            {communityStats.monthGames.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">games played</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" weight="fill" />
                        Community Insights
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Most Active Region</span>
                          <Badge variant="secondary" className="font-semibold">
                            {communityStats.mostActiveRegion}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Most Popular Difficulty</span>
                          <Badge variant="secondary" className="font-semibold capitalize">
                            {communityStats.mostPopularDifficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Avg Score Trend</span>
                          <div className="flex items-center gap-2">
                            {communityStats.recentTrends.averageScoreTrend > 0 ? (
                              <TrendUp className="w-4 h-4 text-green-500" />
                            ) : (
                              <TrendDown className="w-4 h-4 text-red-500" />
                            )}
                            <span className={`font-semibold ${
                              communityStats.recentTrends.averageScoreTrend > 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {formatTrend(communityStats.recentTrends.averageScoreTrend)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </Card>
      </motion.div>
    </motion.div>
  )
}
