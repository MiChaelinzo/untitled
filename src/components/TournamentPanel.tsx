import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trophy, Crown, Medal, Play, Check, Sparkle } from '@phosphor-icons/react'
import {
  Tournament,
  Match,
  TournamentPlayer,
  createTournament,
  getPlayerNextMatch,
  getTournamentWinner,
  updateMatchScore
} from '@/lib/tournament-system'
import { Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { toast } from 'sonner'
import { MatchmakingPanel } from '@/components/MatchmakingPanel'
import { PlayerSkillProfile, TournamentMatchup, createPlayerSkillProfile } from '@/lib/ai-matchmaking'
import { PlayerStats } from '@/lib/achievements'

interface TournamentPanelProps {
  currentUserId: string
  currentUsername: string
  currentAvatarUrl?: string
  onStartMatch: (difficulty: Difficulty, matchId: string) => void
  playerStats?: PlayerStats
  activeTournament?: Tournament | null
  onTournamentUpdate?: (tournament: Tournament | null) => void
}

export function TournamentPanel({
  currentUserId,
  currentUsername,
  currentAvatarUrl,
  onStartMatch,
  playerStats,
  activeTournament: externalTournament,
  onTournamentUpdate
}: TournamentPanelProps) {
  const [tournament, setTournament] = useState<Tournament | null>(externalTournament || null)
  const [tournamentName, setTournamentName] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [playerCount, setPlayerCount] = useState<string>('4')
  const [isCreating, setIsCreating] = useState(false)
  const [showMatchmaking, setShowMatchmaking] = useState(false)

  useEffect(() => {
    if (externalTournament !== undefined) {
      setTournament(externalTournament)
    }
  }, [externalTournament])

  useEffect(() => {
    if (onTournamentUpdate) {
      onTournamentUpdate(tournament)
    }
  }, [tournament, onTournamentUpdate])

  const handleCreateTournament = () => {
    if (!tournamentName.trim()) {
      toast.error('Please enter a tournament name')
      return
    }

    const count = parseInt(playerCount)
    if (isNaN(count) || count < 2 || count > 16) {
      toast.error('Player count must be between 2 and 16')
      return
    }

    const players: TournamentPlayer[] = [
      {
        id: currentUserId,
        username: currentUsername,
        avatarUrl: currentAvatarUrl,
        seed: 1
      }
    ]

    for (let i = 2; i <= count; i++) {
      players.push({
        id: `bot_${i}`,
        username: `Player ${i}`,
        seed: i
      })
    }

    const newTournament = createTournament(tournamentName, selectedDifficulty, players)
    setTournament(newTournament)
    setIsCreating(false)
    toast.success('Tournament created! Start playing matches.')
  }

  const simulateBotMatch = (match: Match) => {
    if (!tournament) return

    const botId = match.player1.id === currentUserId ? match.player2.id : match.player1.id
    const botScore = Math.floor(Math.random() * 30000) + 10000

    setTimeout(() => {
      const updatedTournament = updateMatchScore(tournament, match.id, botId, botScore)
      setTournament(updatedTournament)
    }, 500)
  }

  const nextMatch = tournament ? getPlayerNextMatch(tournament, currentUserId) : null

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
      createPlayerSkillProfile(
        'player_2',
        'SpeedRunner',
        { ...mockStats, highestScore: 28000, highestCombo: 15, insaneModeCompleted: 2 },
        [26000, 27000, 28000, 27500, 28000]
      ),
      createPlayerSkillProfile(
        'player_3',
        'SteadyShot',
        { ...mockStats, highestScore: 22000, perfectRounds: 5 },
        [21000, 22000, 21500, 22000, 21800]
      ),
      createPlayerSkillProfile(
        'player_4',
        'Newbie',
        { ...mockStats, totalGamesPlayed: 3, highestScore: 12000, highestCombo: 5 },
        [10000, 11000, 12000]
      ),
      createPlayerSkillProfile(
        'player_5',
        'ProGamer',
        { ...mockStats, highestScore: 35000, highestCombo: 20, insaneModeCompleted: 5, perfectRounds: 8 },
        [33000, 34000, 35000, 34500, 35000]
      ),
      createPlayerSkillProfile(
        'player_6',
        'CasualPlayer',
        { ...mockStats, highestScore: 18000, highestCombo: 8 },
        [16000, 17000, 18000, 17500, 18000]
      )
    ]

    return mockPlayerProfiles
  }

  const handleStartAITournament = (matchups: TournamentMatchup[], difficulty: Difficulty) => {
    const players: TournamentPlayer[] = []
    
    matchups.forEach((matchup, idx) => {
      if (!players.find(p => p.id === matchup.player1.userId)) {
        players.push({
          id: matchup.player1.userId,
          username: matchup.player1.username,
          avatarUrl: matchup.player1.avatarUrl,
          seed: idx * 2 + 1
        })
      }
      if (!players.find(p => p.id === matchup.player2.userId)) {
        players.push({
          id: matchup.player2.userId,
          username: matchup.player2.username,
          avatarUrl: matchup.player2.avatarUrl,
          seed: idx * 2 + 2
        })
      }
    })

    const aiTournament = createTournament('AI Matchmade Tournament', difficulty, players)
    setTournament(aiTournament)
    setShowMatchmaking(false)
    toast.success('AI-powered tournament created!', {
      description: `${players.length} skill-matched players`
    })
  }

  if (showMatchmaking) {
    const mockPlayers = generateMockPlayers()
    return (
      <MatchmakingPanel
        availablePlayers={mockPlayers}
        onStartTournament={handleStartAITournament}
        onClose={() => setShowMatchmaking(false)}
      />
    )
  }

  if (!tournament && !isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-primary" weight="fill" />
          <h2 className="text-2xl font-bold font-['Orbitron']">Tournament Mode</h2>
        </div>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <Trophy size={64} className="mx-auto text-primary" weight="duotone" />
            <h3 className="text-xl font-bold font-['Orbitron']">
              Compete in Bracket Tournaments
            </h3>
            <p className="text-muted-foreground">
              Create tournaments and compete against multiple players in elimination-style brackets.
              Advance through each round to become the champion!
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <Button
                size="lg"
                onClick={() => setIsCreating(true)}
              >
                <Trophy size={20} className="mr-2" />
                Create Tournament
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowMatchmaking(true)}
                className="gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <Sparkle size={20} weight="fill" />
                AI Matchmaking
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (isCreating) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-primary" weight="fill" />
          <h2 className="text-2xl font-bold font-['Orbitron']">Create Tournament</h2>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tournament-name">Tournament Name</Label>
              <Input
                id="tournament-name"
                placeholder="e.g., Cloud9 Championship 2024"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DIFFICULTY_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config?.name || key} - {config?.description || ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player-count">Number of Players</Label>
              <Select value={playerCount} onValueChange={setPlayerCount}>
                <SelectTrigger id="player-count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Players</SelectItem>
                  <SelectItem value="4">4 Players</SelectItem>
                  <SelectItem value="8">8 Players</SelectItem>
                  <SelectItem value="16">16 Players</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateTournament} className="flex-1">
                <Trophy size={20} className="mr-2" />
                Create Tournament
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (!tournament) return null

  const currentRoundMatches = tournament.matches.filter(
    m => m.roundNumber === tournament.currentRound
  )

  const winner = tournament.status === 'completed' ? getTournamentWinner(tournament) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={24} className="text-primary" weight="fill" />
          <div>
            <h2 className="text-2xl font-bold font-['Orbitron']">{tournament.name}</h2>
            <p className="text-sm text-muted-foreground">
              Round {tournament.currentRound} of {tournament.rounds} • {DIFFICULTY_CONFIG[tournament.difficulty].name}
            </p>
          </div>
        </div>
        <Badge variant={tournament.status === 'completed' ? 'default' : 'secondary'}>
          {tournament.status === 'completed' ? 'Completed' : 'Active'}
        </Badge>
      </div>

      {winner && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
            <Crown size={64} className="mx-auto text-accent mb-4" weight="fill" />
            <h3 className="text-2xl font-bold font-['Orbitron'] mb-2">
              Tournament Champion
            </h3>
            <p className="text-xl text-primary font-bold">{winner.username}</p>
            <Button
              className="mt-4"
              onClick={() => {
                setTournament(null)
                setIsCreating(false)
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
                onStartMatch(tournament.difficulty, nextMatch.id)
                simulateBotMatch(nextMatch)
              }}
            >
              <Play size={20} className="mr-2" weight="fill" />
              Start Match
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold">
                {nextMatch.player1?.username?.[0]?.toUpperCase() || 'P'}
              </div>
              <div>
                <p className="font-bold">{nextMatch.player1?.username || 'Player 1'}</p>
                <Badge variant="outline" className="text-xs">Seed {nextMatch.player1?.seed || 1}</Badge>
              </div>
            </div>

            <div className="text-muted-foreground font-bold">VS</div>

            <div className="flex items-center gap-3">
              <div>
                <p className="font-bold text-right">{nextMatch.player2?.username || 'Player 2'}</p>
                <Badge variant="outline" className="text-xs">Seed {nextMatch.player2?.seed || 2}</Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl font-bold">
                {nextMatch.player2?.username?.[0]?.toUpperCase() || 'P'}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-bold font-['Orbitron']">
          Round {tournament.currentRound} Matches
        </h3>

        <div className="grid gap-4">
          {currentRoundMatches.map((match) => {
            const isUserMatch = match.player1.id === currentUserId || match.player2.id === currentUserId

            return (
              <Card key={match.id} className={`p-4 ${isUserMatch ? 'border-primary' : ''}`}>
                <div className="flex items-center justify-between mb-2">
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
                  <div className="text-center">
                    <p className="font-bold text-sm mb-1">{match.player1?.username || 'Player 1'}</p>
                    {match.player1Score !== undefined && (
                      <p className="text-lg font-bold text-primary">
                        {formatScore(match.player1Score)}
                      </p>
                    )}
                  </div>

                  <div className="text-center text-muted-foreground font-bold">VS</div>

                  <div className="text-center">
                    <p className="font-bold text-sm mb-1">{match.player2?.username || 'Player 2'}</p>
                    {match.player2Score !== undefined && (
                      <p className="text-lg font-bold text-accent">
                        {formatScore(match.player2Score)}
                      </p>
                    )}
                  </div>
                </div>

                {match.winnerId && (
                  <div className="mt-3 text-center">
                    <Badge variant="default" className="text-xs">
                      <Trophy size={12} className="mr-1" />
                      Winner:{' '}
                      {match.player1?.id === match.winnerId
                        ? (match.player1?.username || 'Player 1')
                        : (match.player2?.username || 'Player 2')}
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
