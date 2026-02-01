import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/but
import { Avatar, AvatarFallback, AvatarImage } 
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
  }
  const handleMatchComplete = (matchId: string, teamId: str

   

      const winnerTeam = match.team1.id === match.winnerTeamId ? match.team1 : matc
      if (match.team1.playe

          toast.success('Team Victory!', { description: 'Your team advances to the nex
          toast.info('Match Complete

      const advanced = advanceTeamTournament(updatedTournament)

        const winner = getTeamTournamentWinner(advanced)
      
      }
  }
  const simulateTeamMatch = (match: TeamMatch) => {

    const botTeam = userTeam.id === match.team1.id ? match.team2 : match.team1
    const botSco
    setTimeout(() => {
      set
  }

    return tournament.teams.find(team => 
    ) || null

  const nextMatch = tournament && userTeam ?
  const generateMockPlayers = (): PlayerSkillProfile[] =
      totalGamesPlayed: 10,
      totalTargetsMissed: 20,
      hig
      i
    }
   

      [20000, 22000, 25000, 23000, 24000],
    )

      createPlayerSkillProfile('p1', 'Striker', { ...mockStats, highestScore: 28000 }, [27000, 28000])
      createPlayerSkillProfile('p3', 'Support', { ...mockStats, highestScore: 

      createPlayerSkillProfile('p7', 'Captain', { ...mockStats, highestScore: 31000

  }
  if (showMatchmaking) {
    return (
        avai
   


    return (
        <div className="flex items-center
          <h2 className="text-2xl font-bold font-['O

   

              </div>
                <Trophy size={40} className="text-accent" weight="fill" />

            <div>
                Team-Based Competition
              <p className=
                AI-powered 
            </div>
            <div className
                onClick
                  setSh
              >
                  <div clas
     

                      <p className="text-xs text-mu
                  </
                </div>

                onClick={() => {
                  setS
     

                      <Users size={24} weight="fill" c
                    
                      <p className="text-xs text-muted-foreground">Trio Competition</p>
                  </div>
                </div>
            </div>
            <div className="pt-4">
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
























































































































































































































