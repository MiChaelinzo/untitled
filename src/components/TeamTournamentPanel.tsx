import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
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
  TeamTournament,
  TeamTournament,
  TeamMatch,
  Team,
  TeamSize,ament,
  advanceTeamTournament,
  updateTeamMatchScore,
  getTeamTournamentWinner,
  getTeamNextMatchent-system'
} from '@/lib/team-tournament-system''@/lib/game-types'
import { Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { toast } from 'sonner'} from '@/components/TeamMatchmakingPanel'
import { TeamMatchmakingPanel } from '@/components/TeamMatchmakingPanel'atchmaking'
import { PlayerSkillProfile, createPlayerSkillProfile } from '@/lib/ai-matchmaking'
import { PlayerStats } from '@/lib/achievements'
interface TeamTournamentPanelProps {
interface TeamTournamentPanelProps {
  currentUserId: stringng
  currentUsername: stringng
  currentAvatarUrl?: string: Difficulty, matchId: string, teamId: string) => void
  onStartMatch: (difficulty: Difficulty, matchId: string, teamId: string) => void
  playerStats?: PlayerStats
}
export function TeamTournamentPanel({
export function TeamTournamentPanel({
  currentUserId,e,
  currentUsername,,
  currentAvatarUrl,
  onStartMatch,
  playerStatsmentPanelProps) {
}: TeamTournamentPanelProps) {ment] = useState<TeamTournament | null>(null)
  const [tournament, setTournament] = useState<TeamTournament | null>(null)
  const [showMatchmaking, setShowMatchmaking] = useState(false)Size>('2v2')
  const [selectedTeamSize, setSelectedTeamSize] = useState<TeamSize>('2v2')
  const handleStartTeamTournament = (teams: Team[], teamSize: TeamSize, difficulty: Difficulty) => {
  const handleStartTeamTournament = (teams: Team[], teamSize: TeamSize, difficulty: Difficulty) => {
    const { createTeamTournament } = require('@/lib/team-tournament-system')
    const newTournament = createTeamTournament(hip`,
      `${teamSize.toUpperCase()} Team Championship`,
      teamSize,y,
      difficulty,
      teams
    )etTournament(newTournament)
    setTournament(newTournament)
    setShowMatchmaking(false)
  }onst handleMatchComplete = (matchId: string, teamId: str
  const handleMatchComplete = (matchId: string, teamId: str
   
   
      const winnerTeam = match.team1.id === match.winnerTeamId ? match.team1 : matc
      const winnerTeam = match.team1.id === match.winnerTeamId ? match.team1 : matc
      if (match.team1.playe
          toast.success('Team Victory!', { description: 'Your team advances to the nex
          toast.success('Team Victory!', { description: 'Your team advances to the nex
          toast.info('Match Complete
      const advanced = advanceTeamTournament(updatedTournament)
      const advanced = advanceTeamTournament(updatedTournament)
        const winner = getTeamTournamentWinner(advanced)
        const winner = getTeamTournamentWinner(advanced)
      }
      }
  }onst simulateTeamMatch = (match: TeamMatch) => {
  const simulateTeamMatch = (match: TeamMatch) => {
    const botTeam = userTeam.id === match.team1.id ? match.team2 : match.team1
    const botTeam = userTeam.id === match.team1.id ? match.team2 : match.team1
    const botSco) => {
    setTimeout(() => {
      set
  }
    return tournament.teams.find(team => 
    return tournament.teams.find(team => 
    ) || null
  const nextMatch = tournament && userTeam ?
  const nextMatch = tournament && userTeam ?lProfile[] =
  const generateMockPlayers = (): PlayerSkillProfile[] =
      totalGamesPlayed: 10,0,
      totalTargetsMissed: 20,
      hig
      i
    }
   
      [20000, 22000, 25000, 23000, 24000],
      [20000, 22000, 25000, 23000, 24000],
    )
      createPlayerSkillProfile('p1', 'Striker', { ...mockStats, highestScore: 28000 }, [27000, 28000])
      createPlayerSkillProfile('p1', 'Striker', { ...mockStats, highestScore: 28000 }, [27000, 28000])
      createPlayerSkillProfile('p3', 'Support', { ...mockStats, highestScore: 
      createPlayerSkillProfile('p7', 'Captain', { ...mockStats, highestScore: 31000
      createPlayerSkillProfile('p7', 'Captain', { ...mockStats, highestScore: 31000
  }
  }f (showMatchmaking) {
  if (showMatchmaking) {
    return (
        avai
   

    return (
    return ( className="flex items-center
        <div className="flex items-centerld font-['O
          <h2 className="text-2xl font-bold font-['O
   
   
              </div>
              </div>phy size={40} className="text-accent" weight="fill" />
                <Trophy size={40} className="text-accent" weight="fill" />
            <div>
            <div>eam-Based Competition
                Team-Based Competition
              <p className=
                AI-powered 
            </div>lassName
            <div className
                onClick
                  setSh
              >   <div clas
                  <div clas
     
                      <p className="text-xs text-mu
                      <p className="text-xs text-mu
                  </v>
                </div>
                onClick={() => {
                onClick={() => {
                  setS
     
                      <Users size={24} weight="fill" c
                      <Users size={24} weight="fill" c
                      <p className="text-xs text-muted-foreground">Trio Competition</p>
                      <p className="text-xs text-muted-foreground">Trio Competition</p>
                  </div>
                </div>
            </div>lassName="pt-4">
            <div className="pt-4"> weight="fill" className="text-accent" />
                <Sparkle size={16} weight="fill" className="text-accent" />
              </div>
     

  }
  c

  const winner = tournam
  return (
      <div c
          <Users size={24} 
            <h2 className="text-2xl fo
              Round {tournament.currentRound} of {tournam
          </div>
        
     


            <div cla
            
              >
              </div>
                <p className="font-bold font-['Orbitron']">{userTeam
              </div>
            <d

              </Badge>
                {userTeam.losses || 0}L
            </div>
        </Card>

        <motion.div
          animate={{ scale: 1, opacity: 1 }}
          <Card className="p-8 text-center bg-gradient-to-br from-primary/
            <h3 clas
            </h3>

              sty
              {winner.name?.charAt(0) || 'T'}
            
              {winn

              {winner.players?.map((player) => (
                  <Avatar className="h-6 w-6">
                  
                  

                </div>
            </div>
            <Button
              onClick={() => {
                setShowMatchmaking(false)
            >
            </B
        </motion.div>

        <Card className="p-6 bg-primary/10 border-primary">
            <div>
              <p className
              </p>
            <Button
                if (userTeam) {
                  simulate
              }}
              <Play size={20} className="mr-2" weight="fill"
            </Button>


            <div className="text-center">
              <Badge variant="ou
              </Badge>

          </div>
      )}
      <div className="space-y-4">
          Round {tournament.currentRound} Matches

          {currentRoundMatches.map((match) => {
              match.team1.

              <Card key={match.id} className={`p-4 ${isUserMatch ? 'border-prima
                  <Badge variant="outline" className="text-xs">
                  </Badge>
                    vari
                        ? 'default'
                      
                    }
                  


                  <div className="space-y-2">
                  </div>
                  <div className="text-center text-muted-foreground font-bold">VS</div>
                  <d
                  

               
            
     
   

              </Card>
          })}
   



  showScor
}: { 
  align?: 'left' | 'right'
  score?: number
  if (!team) {
  }
  return (
      <div className={`flex items-center gap-2 ${align ==
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
        >
        </div>
          <p c
            {(team.averageSkill || 0).toFixed(0)} AVG
        </div>
      {showScore
          {f

  )

























































































































































































































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
