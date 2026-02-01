import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
  getTeamNextMatch,
  createTeamTournament
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
    const newTournament = createTeamTournament(
      `${teamSize.toUpperCase()} Team Championship`,
      teamSize,
      difficulty,
      teams
    )
    setTournament(newTournament)
    setShowMatchmaking(false)
  }

  const handleMatchComplete = (matchId: string, teamId: string, score: number) => {
    if (!tournament) return

    const match = tournament.matches.find(m => m.id === matchId)
    if (!match) return

    const updatedTournament = updateTeamMatchScore(tournament, matchId, teamId, score)
    
    const winnerTeam = match.team1.id === match.winnerTeamId ? match.team1 : match.team2
    const userTeam = getUserTeam()
    
    if (userTeam && (match.team1.players.some(p => p.id === currentUserId) || match.team2.players.some(p => p.id === currentUserId))) {
      if (winnerTeam.id === userTeam.id) {
        toast.success('Team Victory!', { description: 'Your team advances to the next round!' })
      } else {
        toast.info('Match Complete', { description: 'Better luck next time!' })
      }
    }

    const advanced = advanceTeamTournament(updatedTournament)
    setTournament(advanced)

    const winner = getTeamTournamentWinner(advanced)
    if (winner) {
      toast.success('Tournament Complete!', { 
        description: `${winner.name} wins the championship!` 
      })
    }
  }

  const simulateTeamMatch = (match: TeamMatch) => {
    const userTeam = getUserTeam()
    if (!userTeam) return

    const botTeam = userTeam.id === match.team1.id ? match.team2 : match.team1
    const botScore = Math.floor(Math.random() * 20000) + 15000
    
    setTimeout(() => {
      handleMatchComplete(match.id, botTeam.id, botScore)
    }, 500)
  }

  const getUserTeam = () => {
    if (!tournament) return null
    return tournament.teams.find(team => 
      team.players.some(p => p.id === currentUserId)
    ) || null
  }

  const generateMockPlayers = (): PlayerSkillProfile[] => {
    const mockStats: PlayerStats = {
      totalGamesPlayed: 50,
      totalTargetsHit: 1000,
      totalTargetsMissed: 200,
      highestScore: 25000,
      highestCombo: 50,
      perfectRounds: 5,
      insaneModeCompleted: 2,
      totalPlayTime: 10000
    }

    return [
      createPlayerSkillProfile('p1', 'Striker', { ...mockStats, highestScore: 28000 }, [27000, 28000, 26000, 27500, 28000]),
      createPlayerSkillProfile('p2', 'Ace', { ...mockStats, highestScore: 30000 }, [29000, 30000, 28000, 29500, 30000]),
      createPlayerSkillProfile('p3', 'Support', { ...mockStats, highestScore: 22000 }, [21000, 22000, 20000, 21500, 22000]),
      createPlayerSkillProfile('p4', 'Guardian', { ...mockStats, highestScore: 24000 }, [23000, 24000, 22000, 23500, 24000]),
      createPlayerSkillProfile('p5', 'Sharpshooter', { ...mockStats, highestScore: 26000 }, [25000, 26000, 24000, 25500, 26000]),
      createPlayerSkillProfile('p6', 'Veteran', { ...mockStats, highestScore: 29000 }, [28000, 29000, 27000, 28500, 29000]),
      createPlayerSkillProfile('p7', 'Captain', { ...mockStats, highestScore: 31000 }, [30000, 31000, 29000, 30500, 31000]),
      createPlayerSkillProfile('p8', 'Rookie', { ...mockStats, highestScore: 20000 }, [19000, 20000, 18000, 19500, 20000])
    ]
  }

  const userTeam = getUserTeam()
  const nextMatch = tournament && userTeam ? getTeamNextMatch(tournament, userTeam.id) : null

  if (showMatchmaking) {
    return (
      <TeamMatchmakingPanel
        availablePlayers={generateMockPlayers()}
        onStartTeamTournament={handleStartTeamTournament}
        onClose={() => setShowMatchmaking(false)}
      />
    )
  }

  if (!tournament) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold font-['Orbitron']">Team Tournaments</h2>
        </div>

        <Card className="p-8 text-center bg-gradient-to-br from-primary/20 to-accent/20 border-primary/50">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center gap-3">
              <Trophy size={40} className="text-accent" weight="fill" />
              <Users size={40} className="text-primary" weight="fill" />
            </div>

            <div>
              <h3 className="text-xl font-bold font-['Orbitron'] mb-2">
                Team-Based Competition
              </h3>
              <p className="text-muted-foreground">
                AI-powered matchmaking for balanced team battles
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-4">
              <div
                className="p-4 rounded-lg bg-card border-2 border-primary cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setSelectedTeamSize('2v2')
                  setShowMatchmaking(true)
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users size={24} weight="fill" className="text-primary" />
                  <div className="text-center">
                    <p className="font-bold font-['Orbitron']">2v2</p>
                    <p className="text-xs text-muted-foreground">Duo Competition</p>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-lg bg-card border-2 border-accent cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => {
                  setSelectedTeamSize('3v3')
                  setShowMatchmaking(true)
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Users size={24} weight="fill" className="text-accent" />
                  <div className="text-center">
                    <p className="font-bold font-['Orbitron']">3v3</p>
                    <p className="text-xs text-muted-foreground">Trio Competition</p>
                  </div>
                </div>
              </div>


            </div>

            <div className="pt-4">
              <Badge variant="outline" className="gap-1">
                <Sparkle size={16} weight="fill" className="text-accent" />
                AI-Powered Matchmaking
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const winner = getTeamTournamentWinner(tournament)
  const currentRoundMatches = tournament.matches.filter(m => m.roundNumber === tournament.currentRound)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-primary" weight="fill" />
          <h2 className="text-2xl font-bold font-['Orbitron']">
            {tournament.name}
          </h2>
        </div>
        <Badge variant="outline">
          Round {tournament.currentRound} of {tournament.rounds}
        </Badge>
      </div>

      {userTeam && (
        <Card className="p-4 bg-gradient-to-r from-primary/20 to-transparent border-primary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold bg-primary text-primary-foreground"
                style={{ backgroundColor: userTeam.color }}
              >
                {userTeam.name?.charAt(0) || 'T'}
              </div>
              <div>
                <p className="font-bold font-['Orbitron']">{userTeam.name}</p>
                <p className="text-sm text-muted-foreground">Your Team</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                {userTeam.wins || 0}W
              </Badge>
              <Badge variant="secondary">
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
          <Card className="p-8 text-center bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-accent">
            <h3 className="text-3xl font-bold font-['Orbitron'] mb-4 flex items-center justify-center gap-2">
              <Crown size={32} className="text-accent" weight="fill" />
              Champion!
            </h3>
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: winner.color }}
              >
                {winner.name?.charAt(0) || 'T'}
              </div>
              <p className="text-2xl font-bold">{winner.name}</p>
              <div className="flex items-center gap-2">
                {winner.players?.map((player) => (
                  <Avatar key={player.id} className="h-8 w-8">
                    <AvatarImage src={player.avatarUrl} />
                    <AvatarFallback>{player.username?.charAt(0) || 'P'}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <Button
              className="mt-6"
              onClick={() => {
                setTournament(null)
                setShowMatchmaking(false)
              }}
            >
              New Tournament
            </Button>
          </Card>
        </motion.div>
      )}

      {!winner && nextMatch && (
        <Card className="p-6 bg-primary/10 border-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold font-['Orbitron']">Your Next Match</h3>
              <p className="text-sm text-muted-foreground">Click to start playing</p>
            </div>
            <Button
              onClick={() => {
                if (userTeam) {
                  onStartMatch(tournament.difficulty, nextMatch.id, userTeam.id)
                }
              }}
            >
              <Play size={20} className="mr-2" weight="fill" />
              Start Match
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4">
            <TeamDisplay team={nextMatch.team1} align="left" showScore={nextMatch.status === 'completed'} score={nextMatch.team1Score} />
            <div className="text-center">
              <Badge variant="outline">VS</Badge>
            </div>
            <TeamDisplay team={nextMatch.team2} align="right" showScore={nextMatch.status === 'completed'} score={nextMatch.team2Score} />
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-['Orbitron']">
          Round {tournament.currentRound} Matches
        </h3>

        {currentRoundMatches.map((match) => {
          const isUserMatch = userTeam && (
            match.team1.id === userTeam.id || match.team2.id === userTeam.id
          )

          return (
            <Card key={match.id} className={`p-4 ${isUserMatch ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs">
                  {match.status === 'completed' ? 'Completed' : match.status === 'in-progress' ? 'In Progress' : 'Scheduled'}
                </Badge>
                {isUserMatch && (
                  <Badge 
                    variant={match.status === 'in-progress' ? 'default' : 'secondary'}
                  >
                    Your Match
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <TeamDisplay team={match.team1} align="left" showScore={match.status === 'completed'} score={match.team1Score} />
                <div className="text-center text-muted-foreground font-bold">VS</div>
                <TeamDisplay team={match.team2} align="right" showScore={match.status === 'completed'} score={match.team2Score} />
              </div>
            </Card>
          )
        })}
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
    return <div className="flex-1" />
  }

  return (
    <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''} flex-1`}>
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
        style={{ backgroundColor: team.color }}
      >
        {team.name?.charAt(0) || 'T'}
      </div>
      <div className={align === 'right' ? 'text-right' : ''}>
        <p className="font-bold">{team.name}</p>
        <p className="text-xs text-muted-foreground">
          {(team.averageSkill || 0).toFixed(0)} AVG
        </p>
      </div>
      {showScore && score !== undefined && (
        <p className="text-lg font-bold font-['Orbitron'] ml-auto">
          {formatScore(score)}
        </p>
      )}
    </div>
  )
}
