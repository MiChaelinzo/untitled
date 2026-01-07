import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Users,
  Lightning,
  TrendUp,
  Trophy,
  Target,
  CircleNotch,
  Sparkle,
  CheckCircle
} from '@phosphor-icons/react'
import {
  PlayerSkillProfile,
  MatchmakingResult,
  PlayerGroup,
  TournamentMatchup,
  analyzeMatchmaking,
  generateTournamentBracket,
  calculateTournamentSeeding,
  predictMatchOutcome
} from '@/lib/ai-matchmaking'
import { Difficulty } from '@/lib/game-types'
import { toast } from 'sonner'

interface MatchmakingPanelProps {
  availablePlayers: PlayerSkillProfile[]
  onStartTournament: (matchups: TournamentMatchup[], difficulty: Difficulty) => void
  onClose: () => void
}

export function MatchmakingPanel({
  availablePlayers,
  onStartTournament,
  onClose
}: MatchmakingPanelProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set())
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchmakingResult, setMatchmakingResult] = useState<MatchmakingResult | null>(null)
  const [selectedGroup, setSelectedGroup] = useState<PlayerGroup | null>(null)
  const [matchupPrediction, setMatchupPrediction] = useState<any>(null)

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(playerId)) {
        newSet.delete(playerId)
      } else {
        if (newSet.size < 16) {
          newSet.add(playerId)
        } else {
          toast.error('Maximum 16 players allowed')
        }
      }
      return newSet
    })
  }

  const handleAnalyzeMatchmaking = async () => {
    if (selectedPlayers.size < 2) {
      toast.error('Select at least 2 players')
      return
    }

    setIsAnalyzing(true)
    try {
      const players = availablePlayers.filter(p => selectedPlayers.has(p.userId))
      const result = await analyzeMatchmaking(players)
      setMatchmakingResult(result)
      
      if (result.fairnessScore >= 0.7) {
        toast.success('Balanced matchmaking found!', {
          description: `Fairness score: ${(result.fairnessScore * 100).toFixed(0)}%`
        })
      } else {
        toast.info('Matchmaking complete', {
          description: 'Some skill imbalance detected'
        })
      }
    } catch (error) {
      toast.error('Failed to analyze matchmaking')
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleViewGroupDetails = async (group: PlayerGroup) => {
    setSelectedGroup(group)
    
    if (group.players.length >= 2) {
      try {
        const prediction = await predictMatchOutcome(group.players[0], group.players[1])
        setMatchupPrediction(prediction)
      } catch (error) {
        console.error('Failed to predict match outcome:', error)
      }
    }
  }

  const handleStartTournament = () => {
    if (!matchmakingResult) return

    const players = availablePlayers.filter(p => selectedPlayers.has(p.userId))
    const seededPlayers = calculateTournamentSeeding(players)
    
    const difficulty = matchmakingResult.pools[0]?.recommendedDifficulty || 'medium'
    const matchups = generateTournamentBracket(matchmakingResult.pools, difficulty)

    onStartTournament(matchups, difficulty)
    toast.success('Tournament started!', {
      description: `${seededPlayers.length} players competing on ${difficulty} difficulty`
    })
  }

  const getSkillTier = (rating: number): { label: string; color: string } => {
    if (rating >= 3500) return { label: 'Pro', color: 'text-accent' }
    if (rating >= 2500) return { label: 'Advanced', color: 'text-primary' }
    if (rating >= 1500) return { label: 'Intermediate', color: 'text-cyan' }
    return { label: 'Beginner', color: 'text-muted-foreground' }
  }

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkle weight="fill" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Matchmaking</h2>
            <p className="text-sm text-muted-foreground">
              Powered by intelligent skill analysis
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6 overflow-auto lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users weight="fill" className="w-5 h-5" />
              Available Players ({selectedPlayers.size}/{availablePlayers.length})
            </h3>
            {selectedPlayers.size >= 2 && (
              <Button
                onClick={handleAnalyzeMatchmaking}
                disabled={isAnalyzing}
                size="sm"
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <CircleNotch className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Lightning weight="fill" className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="grid gap-2 overflow-auto max-h-96">
            {availablePlayers.map(player => {
              const isSelected = selectedPlayers.has(player.userId)
              const tier = getSkillTier(player.skillRating)

              return (
                <motion.div
                  key={player.userId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleTogglePlayer(player.userId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={player.avatarUrl} />
                          <AvatarFallback>
                            {player.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{player.username}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <Badge
                              variant="outline"
                              className={`${tier.color} border-current`}
                            >
                              {tier.label}
                            </Badge>
                            <span className="text-muted-foreground">
                              {player.skillRating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Style</div>
                        <Badge variant="secondary" className="text-xs">
                          {player.playStyle}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Consistency</span>
                          <span>{(player.consistencyScore * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={player.consistencyScore * 100} className="h-1" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target weight="fill" className="w-5 h-5" />
            Matchmaking Results
          </h3>

          {!matchmakingResult ? (
            <Card className="p-8 text-center">
              <Users weight="thin" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Select players and click Analyze to generate optimal matchmaking
              </p>
            </Card>
          ) : (
            <div className="flex flex-col gap-4 overflow-auto max-h-96">
              <Card className="p-4 bg-primary/10 border-primary/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendUp weight="bold" className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Fairness Score</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">
                    {(matchmakingResult.fairnessScore * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={matchmakingResult.fairnessScore * 100}
                  className="h-2 mb-3"
                />
                <p className="text-sm text-muted-foreground">
                  {matchmakingResult.reasoning}
                </p>
                <div className="mt-3 text-xs text-muted-foreground">
                  Confidence: {(matchmakingResult.confidence * 100).toFixed(0)}%
                </div>
              </Card>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Tournament Groups</h4>
                  {matchmakingResult.pools.length > 0 && (
                    <Button
                      onClick={handleStartTournament}
                      size="sm"
                      className="gap-2"
                    >
                      <Trophy weight="fill" className="w-4 h-4" />
                      Start Tournament
                    </Button>
                  )}
                </div>

                {matchmakingResult.pools.map((pool, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleViewGroupDetails(pool)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-primary border-primary">
                        Group {index + 1}
                      </Badge>
                      <Badge>{pool.recommendedDifficulty}</Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      {pool.players.map(player => (
                        <div
                          key={player.userId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={player.avatarUrl} />
                            <AvatarFallback className="text-xs">
                              {player.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{player.username}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {player.skillRating}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Avg Skill: {pool.averageSkill.toFixed(0)}</span>
                      <span>Variance: {pool.skillVariance.toFixed(0)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedGroup(null)}
          >
            <Card
              className="w-full max-w-2xl p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Match Prediction</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedGroup(null)}
                >
                  Close
                </Button>
              </div>

              {matchupPrediction && selectedGroup.players.length >= 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedGroup.players.slice(0, 2).map((player, idx) => (
                      <Card key={player.userId} className="p-4 text-center">
                        <Avatar className="w-16 h-16 mx-auto mb-3">
                          <AvatarImage src={player.avatarUrl} />
                          <AvatarFallback>
                            {player.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold mb-1">{player.username}</div>
                        <div className="text-2xl font-bold text-primary mb-2">
                          {idx === 0
                            ? (matchupPrediction.player1WinProbability * 100).toFixed(0)
                            : (matchupPrediction.player2WinProbability * 100).toFixed(0)}
                          %
                        </div>
                        <Badge variant="outline">{player.playStyle}</Badge>
                      </Card>
                    ))}
                  </div>

                  <Card className="p-4 bg-accent/10 border-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle weight="fill" className="w-5 h-5 text-accent" />
                      <span className="font-semibold">Match Analysis</span>
                    </div>
                    <p className="text-sm">{matchupPrediction.analysis}</p>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Competitiveness:{' '}
                      {(matchupPrediction.competitivenessScore * 100).toFixed(0)}%
                    </div>
                  </Card>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
