import { useState } from 'react'
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
import { Trophy, Crown, Medal, Play, Check } from '@phosphor-icons/react'
import {
  Tournament,
  Match,
  TournamentPlayer,
  createTournament,
  advanceTournament,
  updateMatchScore,
  getTournamentWinner,
  getPlayerNextMatch
} from '@/lib/tournament-system'
import { Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { toast } from 'sonner'

interface TournamentPanelProps {
  currentUserId: string
  currentUsername: string
  currentAvatarUrl?: string
  onStartMatch: (difficulty: Difficulty, matchId: string) => void
}

export function TournamentPanel({
  currentUserId,
  currentUsername,
  currentAvatarUrl,
  onStartMatch
}: TournamentPanelProps) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [tournamentName, setTournamentName] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')
  const [playerCount, setPlayerCount] = useState<string>('4')
  const [isCreating, setIsCreating] = useState(false)

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

  const handleMatchComplete = (matchId: string, score: number) => {
    if (!tournament) return

    const updatedTournament = updateMatchScore(tournament, matchId, currentUserId, score)
    setTournament(updatedTournament)

    const match = updatedTournament.matches.find(m => m.id === matchId)
    if (match?.status === 'completed') {
      if (match.winnerId === currentUserId) {
        toast.success('Match won! Advancing to next round.')
      } else {
        toast.info('Match complete. Better luck next time!')
      }

      const advanced = advanceTournament(updatedTournament)
      setTournament(advanced)

      if (advanced.status === 'completed') {
        const winner = getTournamentWinner(advanced)
        if (winner?.id === currentUserId) {
          toast.success('🏆 Tournament Champion! Congratulations!')
        }
      }
    }
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
            <Button
              size="lg"
              className="mt-4"
              onClick={() => setIsCreating(true)}
            >
              <Trophy size={20} className="mr-2" />
              Create Tournament
            </Button>
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
                      {config.name} - {config.description}
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
                {nextMatch.player1.username[0].toUpperCase()}
              </div>
              <div>
                <p className="font-bold">{nextMatch.player1.username}</p>
                <Badge variant="outline" className="text-xs">Seed {nextMatch.player1.seed}</Badge>
              </div>
            </div>

            <div className="text-muted-foreground font-bold">VS</div>

            <div className="flex items-center gap-3">
              <div>
                <p className="font-bold text-right">{nextMatch.player2.username}</p>
                <Badge variant="outline" className="text-xs">Seed {nextMatch.player2.seed}</Badge>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl font-bold">
                {nextMatch.player2.username[0].toUpperCase()}
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
                    <p className="font-bold text-sm mb-1">{match.player1.username}</p>
                    {match.player1Score !== undefined && (
                      <p className="text-lg font-bold text-primary">
                        {formatScore(match.player1Score)}
                      </p>
                    )}
                  </div>

                  <div className="text-center text-muted-foreground font-bold">VS</div>

                  <div className="text-center">
                    <p className="font-bold text-sm mb-1">{match.player2.username}</p>
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
                      {match.player1.id === match.winnerId
                        ? match.player1.username
                        : match.player2.username}
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
