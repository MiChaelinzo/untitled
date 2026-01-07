import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Users,
  Lightning,
  Trophy,
  ArrowLeft,
  Sparkle,
  Target,
  Crown,
  ChartLine
} from '@phosphor-icons/react'
import { PlayerSkillProfile } from '@/lib/ai-matchmaking'
import {
  TeamSize,
  Team,
  TeamMatchmakingResult,
  balanceTeams,
  calculateTeamSynergy,
  predictTeamMatchOutcome
} from '@/lib/team-tournament-system'
import { Difficulty } from '@/lib/game-types'
import { toast } from 'sonner'

interface TeamMatchmakingPanelProps {
  availablePlayers: PlayerSkillProfile[]
  onStartTeamTournament: (teams: Team[], teamSize: TeamSize, difficulty: Difficulty) => void
  onClose: () => void
}

export function TeamMatchmakingPanel({
  availablePlayers,
  onStartTeamTournament,
  onClose
}: TeamMatchmakingPanelProps) {
  const [teamSize, setTeamSize] = useState<TeamSize>('2v2')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [matchmakingResult, setMatchmakingResult] = useState<TeamMatchmakingResult | null>(null)
  const [selectedMatchPreview, setSelectedMatchPreview] = useState<{
    team1: Team
    team2: Team
    prediction?: any
  } | null>(null)
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false)

  const handleAnalyzeTeams = async () => {
    if (availablePlayers.length < (teamSize === '2v2' ? 4 : 6)) {
      toast.error(`Need at least ${teamSize === '2v2' ? 4 : 6} players for ${teamSize}`)
      return
    }

    setIsAnalyzing(true)
    toast.info('Analyzing player skills and creating balanced teams...')

    try {
      const result = await balanceTeams(availablePlayers, teamSize)
      setMatchmakingResult(result)
      
      if (result.teams.length >= 2) {
        toast.success('Teams created!', {
          description: `${result.teams.length} balanced teams with ${(result.balanceScore * 100).toFixed(0)}% fairness`
        })
      } else {
        toast.warning('Not enough players for balanced teams')
      }
    } catch (error) {
      toast.error('Failed to create teams')
      console.error(error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTeamPreview = async (team1: Team, team2: Team) => {
    setSelectedMatchPreview({ team1, team2 })
    setIsLoadingPrediction(true)

    try {
      const prediction = await predictTeamMatchOutcome(team1, team2)
      setSelectedMatchPreview({ team1, team2, prediction })
    } catch (error) {
      console.error('Failed to predict match:', error)
    } finally {
      setIsLoadingPrediction(false)
    }
  }

  const handleStartTournament = () => {
    if (!matchmakingResult || matchmakingResult.teams.length < 2) {
      toast.error('Need at least 2 teams to start tournament')
      return
    }

    onStartTeamTournament(matchmakingResult.teams, teamSize, selectedDifficulty)
  }

  const playersPerTeam = teamSize === '2v2' ? 2 : 3
  const minPlayers = playersPerTeam * 2
  const canAnalyze = availablePlayers.length >= minPlayers

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold font-['Orbitron'] flex items-center gap-2">
              <Users size={28} weight="fill" className="text-primary" />
              Team Matchmaking
            </h2>
            <p className="text-sm text-muted-foreground">
              AI-powered team balancing for fair competition
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Users size={16} className="mr-2" />
          {availablePlayers.length} Players
        </Badge>
      </div>

      {!matchmakingResult && (
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Team Size</label>
              <Select value={teamSize} onValueChange={(v) => setTeamSize(v as TeamSize)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2v2">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span className="font-semibold">2v2</span>
                      <span className="text-muted-foreground text-xs">- Duo Teams</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="3v3">
                    <div className="flex items-center gap-2">
                      <Users size={16} />
                      <span className="font-semibold">3v3</span>
                      <span className="text-muted-foreground text-xs">- Trio Teams</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as Difficulty)}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="insane">Insane</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkle size={16} weight="fill" className="text-accent" />
                Requirements
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Minimum players needed:</span>
                  <Badge variant={canAnalyze ? 'default' : 'destructive'}>
                    {availablePlayers.length} / {minPlayers}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max teams possible:</span>
                  <Badge variant="outline">
                    {Math.floor(availablePlayers.length / playersPerTeam)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleAnalyzeTeams}
            disabled={!canAnalyze || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Lightning size={20} className="mr-2 animate-pulse" weight="fill" />
                Analyzing Players...
              </>
            ) : (
              <>
                <Sparkle size={20} className="mr-2" weight="fill" />
                Create Balanced Teams
              </>
            )}
          </Button>
        </Card>
      )}

      {matchmakingResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-['Orbitron']">
                    AI Analysis Complete
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matchmakingResult.reasoning}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {(matchmakingResult.balanceScore * 100).toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Balance Score</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fairness</span>
                  <span className="font-semibold">
                    {(matchmakingResult.confidence * 100).toFixed(0)}% Confidence
                  </span>
                </div>
                <Progress value={matchmakingResult.balanceScore * 100} className="h-2" />
              </div>
            </div>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-['Orbitron']">
                Teams ({matchmakingResult.teams.length})
              </h3>
              <Button size="sm" variant="outline" onClick={() => setMatchmakingResult(null)}>
                Rebalance
              </Button>
            </div>

            <div className="grid gap-4">
              {matchmakingResult.teams.map((team, index) => {
                const synergy = calculateTeamSynergy(team)
                const nextTeam = matchmakingResult.teams[index + 1]

                return (
                  <div key={team.id}>
                    <Card 
                      className="p-5 transition-all hover:border-primary/50 cursor-pointer"
                      style={{ borderLeftColor: team.color, borderLeftWidth: 4 }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                              style={{ backgroundColor: `${team.color}20`, color: team.color }}
                            >
                              {team.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold font-['Orbitron'] text-lg">{team.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  <Target size={12} className="mr-1" />
                                  {team.averageSkill.toFixed(0)} AVG
                                </Badge>
                                <Badge 
                                  variant={synergy > 0.7 ? 'default' : 'secondary'} 
                                  className="text-xs"
                                >
                                  <ChartLine size={12} className="mr-1" />
                                  {(synergy * 100).toFixed(0)}% Synergy
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {team.players.map((player) => (
                            <div 
                              key={player.id}
                              className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={player.avatarUrl} />
                                  <AvatarFallback>{player.username[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{player.username}</span>
                                    {player.role === 'captain' && (
                                      <Crown size={14} weight="fill" className="text-accent" />
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {player.skillRating}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    {index % 2 === 0 && nextTeam && (
                      <div className="flex justify-center my-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTeamPreview(team, nextTeam)}
                          className="gap-2"
                        >
                          <Lightning size={14} weight="fill" />
                          Preview Match
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Card className="p-4 bg-primary/5 border-primary">
            <Button
              size="lg"
              className="w-full"
              onClick={handleStartTournament}
            >
              <Trophy size={20} className="mr-2" weight="fill" />
              Start {teamSize} Tournament
            </Button>
          </Card>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedMatchPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMatchPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full"
            >
              <Card className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold font-['Orbitron'] mb-2">
                    Match Preview
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {teamSize} Matchup Analysis
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="space-y-3">
                    <div 
                      className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold"
                      style={{ 
                        backgroundColor: `${selectedMatchPreview.team1.color}20`, 
                        color: selectedMatchPreview.team1.color 
                      }}
                    >
                      {selectedMatchPreview.team1.name.charAt(0)}
                    </div>
                    <div className="text-center">
                      <p className="font-bold font-['Orbitron']">
                        {selectedMatchPreview.team1.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMatchPreview.team1.averageSkill.toFixed(0)} AVG
                      </p>
                    </div>
                    {selectedMatchPreview.prediction && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {(selectedMatchPreview.prediction.team1WinProbability * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Chance</div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground mb-2">VS</div>
                    {selectedMatchPreview.prediction && (
                      <Badge 
                        variant={selectedMatchPreview.prediction.competitivenessScore > 0.7 ? 'default' : 'secondary'}
                      >
                        {(selectedMatchPreview.prediction.competitivenessScore * 100).toFixed(0)}% Competitive
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div 
                      className="w-16 h-16 mx-auto rounded-xl flex items-center justify-center text-2xl font-bold"
                      style={{ 
                        backgroundColor: `${selectedMatchPreview.team2.color}20`, 
                        color: selectedMatchPreview.team2.color 
                      }}
                    >
                      {selectedMatchPreview.team2.name.charAt(0)}
                    </div>
                    <div className="text-center">
                      <p className="font-bold font-['Orbitron']">
                        {selectedMatchPreview.team2.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedMatchPreview.team2.averageSkill.toFixed(0)} AVG
                      </p>
                    </div>
                    {selectedMatchPreview.prediction && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">
                          {(selectedMatchPreview.prediction.team2WinProbability * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Win Chance</div>
                      </div>
                    )}
                  </div>
                </div>

                {isLoadingPrediction && (
                  <div className="text-center">
                    <Lightning size={32} className="mx-auto animate-pulse text-primary mb-2" weight="fill" />
                    <p className="text-sm text-muted-foreground">Analyzing matchup...</p>
                  </div>
                )}

                {selectedMatchPreview.prediction && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Sparkle size={16} weight="fill" className="text-accent" />
                        AI Analysis
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedMatchPreview.prediction.analysis}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-semibold">Key Factors</div>
                      <div className="space-y-1">
                        {selectedMatchPreview.prediction.keyFactors.map((factor: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedMatchPreview(null)}
                >
                  Close
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
