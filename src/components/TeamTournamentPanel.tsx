import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Crown,
  Users,
  Play,
  Check,
  Lightning,
  Target,
  Medal,
  Sparkle
} from '@phosphor-icons/react'
import {
  TeamTournament,
  TeamMatch,
  Team,
  TeamSize,
  advanceTeamTournament,
  updateTeamMatchScore,
  getTeamTournamentWinner,
  getTeamNextMatch
} from '@/lib/team-tournament-system'
import { Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { toast } from 'sonner'
import { TeamMatchmakingPanel } from '@/components/TeamMatchmakingPanel'
import { PlayerSkillProfile, createPlayerSkillProfile } from '@/lib/ai-matchmaking'
import { PlayerStats } from '@/lib/achievements'

interface TeamTournamentPanelProps {
  currentUserId: string
  currentUsername: string
  currentAvatarUrl?: string
  onStartMatch: (difficulty: Difficulty, matchId: string, teamId: string) => void
  playerStats?: PlayerStats
}

export function TeamTournamentPanel({
  currentUserId,
  currentUsername,
  currentAvatarUrl,
  onStartMatch,
  playerStats
}: TeamTournamentPanelProps) {
  const [tournament, setTournament] = useState<TeamTournament | null>(null)
  const [showMatchmaking, setShowMatchmaking] = useState(false)
  const [selectedTeamSize, setSelectedTeamSize] = useState<TeamSize>('2v2')

  const handleStartTeamTournament = (teams: Team[], teamSize: TeamSize, difficulty: Difficulty) => {
    const { createTeamTournament } = require('@/lib/team-tournament-system')
    const newTournament = createTeamTournament(
      `${teamSize.toUpperCase()} Team Championship`,
      teamSize,
      difficulty,
      teams
    )
    setTournament(newTournament)
    setShowMatchmaking(false)
    toast.success('Team tournament created!', {
      description: `${teams.length} teams ready to compete`
    })
  }

  const handleMatchComplete = (matchId: string, teamId: string, score: number) => {
    if (!tournament) return

    const updatedTournament = updateTeamMatchScore(tournament, matchId, teamId, score)
    setTournament(updatedTournament)

    const match = updatedTournament.matches.find(m => m.id === matchId)
    if (match?.status === 'completed') {
      const winnerTeam = match.team1.id === match.winnerTeamId ? match.team1 : match.team2
      
      if (match.team1.players.some(p => p.id === currentUserId) || 
          match.team2.players.some(p => p.id === currentUserId)) {
        const userTeam = match.team1.players.some(p => p.id === currentUserId) ? match.team1 : match.team2
        if (userTeam.id === match.winnerTeamId) {
          toast.success('Team Victory!', { description: 'Your team advances to the next round' })
        } else {
          toast.info('Match Complete', { description: 'Better luck next time!' })
        }
      }

      const advanced = advanceTeamTournament(updatedTournament)
      setTournament(advanced)

      if (advanced.status === 'completed') {
        const winner = getTeamTournamentWinner(advanced)
        if (winner?.players.some(p => p.id === currentUserId)) {
          toast.success('🏆 Tournament Champions!', { description: `${winner.name} wins!` })
        }
      }
    }
  }

  const simulateTeamMatch = (match: TeamMatch) => {
    if (!tournament) return

    const userTeam = match.team1.players.some(p => p.id === currentUserId) ? match.team1 : match.team2
    const botTeam = userTeam.id === match.team1.id ? match.team2 : match.team1

    const botScore = Math.floor(Math.random() * 30000) + (botTeam.averageSkill * 5)

    setTimeout(() => {
      const updatedTournament = updateTeamMatchScore(tournament, match.id, botTeam.id, botScore)
      setTournament(updatedTournament)
    }, 1000)
  }

  const getUserTeam = (): Team | null => {
    if (!tournament) return null
    return tournament.teams.find(team => 
      team.players.some(p => p.id === currentUserId)
    ) || null
  }

  const userTeam = getUserTeam()
  const nextMatch = tournament && userTeam ? getTeamNextMatch(tournament, userTeam.id) : null

  const generateMockPlayers = (): PlayerSkillProfile[] => {
    const mockStats = playerStats || {
      totalGamesPlayed: 10,
      totalTargetsHit: 100,
      totalTargetsMissed: 20,
      highestScore: 25000,
      highestCombo: 12,
      perfectRounds: 2,
      insaneModeCompleted: 0,
      totalPlayTime: 120000
    }

    const currentPlayer = createPlayerSkillProfile(
      currentUserId,
      currentUsername,
      mockStats,
      [20000, 22000, 25000, 23000, 24000],
      currentAvatarUrl
    )

    const mockPlayerProfiles: PlayerSkillProfile[] = [
      currentPlayer,
      createPlayerSkillProfile('p1', 'Striker', { ...mockStats, highestScore: 28000 }, [27000, 28000]),
      createPlayerSkillProfile('p2', 'Defender', { ...mockStats, highestScore: 22000 }, [21000, 22000]),
      createPlayerSkillProfile('p3', 'Support', { ...mockStats, highestScore: 24000 }, [23000, 24000]),
      createPlayerSkillProfile('p4', 'Sniper', { ...mockStats, highestScore: 30000 }, [29000, 30000]),
      createPlayerSkillProfile('p5', 'Tank', { ...mockStats, highestScore: 26000 }, [25000, 26000]),
      createPlayerSkillProfile('p6', 'Scout', { ...mockStats, highestScore: 23000 }, [22000, 23000]),
      createPlayerSkillProfile('p7', 'Captain', { ...mockStats, highestScore: 31000 }, [30000, 31000]),
    ]

    return mockPlayerProfiles.slice(0, selectedTeamSize === '2v2' ? 6 : 9)
  }

  if (showMatchmaking) {
    const mockPlayers = generateMockPlayers()
    return (
      <TeamMatchmakingPanel
        availablePlayers={mockPlayers}
        onStartTeamTournament={handleStartTeamTournament}
        onClose={() => setShowMatchmaking(false)}
      />
    )
  }

  if (!tournament) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-primary" weight="fill" />
          <h2 className="text-2xl font-bold font-['Orbitron']">Team Tournaments</h2>
        </div>

        <Card className="p-6">
          <div className="text-center space-y-6">
            <div className="flex justify-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Users size={40} className="text-primary" weight="fill" />
              </div>
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                <Trophy size={40} className="text-accent" weight="fill" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold font-['Orbitron'] mb-2">
                Team-Based Competition
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Form teams of 2 or 3 players and compete in elimination-style tournaments.
                AI-powered matchmaking ensures balanced, competitive matches.
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-transparent border-primary/50 hover:border-primary transition-all cursor-pointer"
                onClick={() => {
                  setSelectedTeamSize('2v2')
                  setShowMatchmaking(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users size={24} weight="fill" className="text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold font-['Orbitron']">2v2 Teams</h4>
                      <p className="text-xs text-muted-foreground">Duo Competition</p>
                    </div>
                  </div>
                  <Badge variant="outline">2 Players</Badge>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-accent/10 to-transparent border-accent/50 hover:border-accent transition-all cursor-pointer"
                onClick={() => {
                  setSelectedTeamSize('3v3')
                  setShowMatchmaking(true)
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Users size={24} weight="fill" className="text-accent" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold font-['Orbitron']">3v3 Teams</h4>
                      <p className="text-xs text-muted-foreground">Trio Competition</p>
                    </div>
                  </div>
                  <Badge variant="outline">3 Players</Badge>
                </div>
              </Card>
            </div>

            <div className="pt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/30 text-sm">
                <Sparkle size={16} weight="fill" className="text-accent" />
                <span className="text-muted-foreground">Powered by AI Matchmaking</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const currentRoundMatches = tournament.matches.filter(
    m => m.roundNumber === tournament.currentRound
  )

  const winner = tournament.status === 'completed' ? getTeamTournamentWinner(tournament) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-primary" weight="fill" />
          <div>
            <h2 className="text-2xl font-bold font-['Orbitron']">{tournament.name}</h2>
            <p className="text-sm text-muted-foreground">
              Round {tournament.currentRound} of {tournament.rounds} • {tournament.teamSize.toUpperCase()} • {DIFFICULTY_CONFIG[tournament.difficulty]?.name || tournament.difficulty}
            </p>
          </div>
        </div>
        <Badge variant={tournament.status === 'completed' ? 'default' : 'secondary'}>
          {tournament.status === 'completed' ? 'Completed' : 'Active'}
        </Badge>
      </div>

      {userTeam && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{ backgroundColor: `${userTeam.color || '#888'}20`, color: userTeam.color || '#888' }}
              >
                {userTeam.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="font-bold font-['Orbitron']">{userTeam.name || 'Your Team'}</p>
                <p className="text-xs text-muted-foreground">Your Team</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">
                <Trophy size={12} className="mr-1" />
                {userTeam.wins || 0}W
              </Badge>
              <Badge variant="outline">
                {userTeam.losses || 0}L
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {winner && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-8 text-center bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 border-primary">
            <Crown size={80} className="mx-auto text-accent mb-4" weight="fill" />
            <h3 className="text-3xl font-bold font-['Orbitron'] mb-4">
              Tournament Champions!
            </h3>
            
            <div 
              className="w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: `${winner.color || '#888'}20`, color: winner.color || '#888' }}
            >
              {winner.name?.charAt(0) || 'T'}
            </div>
            
            <p className="text-2xl font-bold mb-4" style={{ color: winner.color || '#888' }}>
              {winner.name || 'Champion Team'}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {winner.players?.map((player) => (
                <div key={player?.id || Math.random()} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background/50">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={player?.avatarUrl} />
                    <AvatarFallback>{player?.username?.[0] || 'P'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-semibold">{player?.username || 'Player'}</span>
                  {player?.role === 'captain' && (
                    <Crown size={12} weight="fill" className="text-accent" />
                  )}
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => {
                setTournament(null)
                setShowMatchmaking(false)
              }}
            >
              Create New Tournament
            </Button>
          </Card>
        </motion.div>
      )}

      {nextMatch && (
        <Card className="p-6 bg-primary/10 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-['Orbitron']">Your Next Match</h3>
              <p className="text-sm text-muted-foreground">
                Round {nextMatch.roundNumber} • Match {nextMatch.matchNumber}
              </p>
            </div>
            <Button
              onClick={() => {
                if (userTeam) {
                  onStartMatch(tournament.difficulty, nextMatch.id, userTeam.id)
                  simulateTeamMatch(nextMatch)
                }
              }}
            >
              <Play size={20} className="mr-2" weight="fill" />
              Start Match
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <TeamDisplay team={nextMatch.team1} />
            
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <Badge variant="outline" className="text-xs mt-2">
                {tournament.teamSize.toUpperCase()}
              </Badge>
            </div>

            <TeamDisplay team={nextMatch.team2} align="right" />
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-['Orbitron']">
          Round {tournament.currentRound} Matches
        </h3>

        <div className="grid gap-4">
          {currentRoundMatches.map((match) => {
            const isUserMatch = userTeam && (
              match.team1.id === userTeam.id || match.team2.id === userTeam.id
            )

            return (
              <Card key={match.id} className={`p-4 ${isUserMatch ? 'border-primary' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    Match {match.matchNumber}
                  </Badge>
                  <Badge
                    variant={
                      match.status === 'completed'
                        ? 'default'
                        : match.status === 'in-progress'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {match.status === 'completed' && <Check size={12} className="mr-1" />}
                    {match.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="space-y-2">
                    <TeamDisplay team={match.team1} showScore score={match.team1Score} />
                  </div>

                  <div className="text-center text-muted-foreground font-bold">VS</div>

                  <div className="space-y-2">
                    <TeamDisplay team={match.team2} align="right" showScore score={match.team2Score} />
                  </div>
                </div>

                {match.winnerTeamId && (
                  <div className="mt-4 text-center">
                    <Badge variant="default" className="text-xs">
                      <Trophy size={12} className="mr-1" />
                      Winner:{' '}
                      {match.team1?.id === match.winnerTeamId
                        ? (match.team1?.name || 'Team 1')
                        : (match.team2?.name || 'Team 2')}
                    </Badge>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TeamDisplay({ 
  team, 
  align = 'left',
  showScore = false,
  score
}: { 
  team: Team
  align?: 'left' | 'right'
  showScore?: boolean
  score?: number
}) {
  if (!team) {
    return null
  }
  
  return (
    <div className={`space-y-2 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{ backgroundColor: `${team.color || '#888'}20`, color: team.color || '#888' }}
        >
          {team.name?.charAt(0) || 'T'}
        </div>
        <div>
          <p className="font-bold text-sm">{team.name || 'Team'}</p>
          <p className="text-xs text-muted-foreground">
            {(team.averageSkill || 0).toFixed(0)} AVG
          </p>
        </div>
      </div>
      {showScore && score !== undefined && (
        <p className="text-lg font-bold text-primary">
          {formatScore(score)}
        </p>
      )}
    </div>
  )
}
