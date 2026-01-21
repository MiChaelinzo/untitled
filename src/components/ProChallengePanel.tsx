import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar } from '@/components/ui/avatar'
import { Trophy, Lightning, Target, Medal } from '@phosphor-icons/react'
import { PRO_PLAYERS, ProPlayer } from '@/lib/pro-player-data'

interface ProChallengePanelProps {
  onStartProChallenge: (proPlayerId: string, difficulty: 'hard' | 'insane') => void
  playerBestScores: Record<string, number>
}

export function ProChallengePanel({ onStartProChallenge, playerBestScores }: ProChallengePanelProps) {
  const [selectedGame, setSelectedGame] = useState<'League of Legends' | 'VALORANT'>('League of Legends')
  
  const lolPlayers = PRO_PLAYERS.filter(p => p.game === 'League of Legends')
  const valPlayers = PRO_PLAYERS.filter(p => p.game === 'VALORANT')
  
  const displayPlayers = selectedGame === 'League of Legends' ? lolPlayers : valPlayers

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary glow-text">Pro Challenge</h2>
        <p className="text-muted-foreground">
          Test your reflexes against Cloud9's professional players. Can you match their scores?
        </p>
      </div>

      <Tabs value={selectedGame} onValueChange={(v) => setSelectedGame(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="League of Legends">League of Legends</TabsTrigger>
          <TabsTrigger value="VALORANT">VALORANT</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedGame} className="space-y-4 mt-6">
          <div className="grid gap-4">
            {displayPlayers.map(player => {
              const playerBest = playerBestScores[player.id] || 0
              const hasBeaten = playerBest >= player.ghostScore
              const percentage = playerBest > 0 ? Math.min(100, (playerBest / player.ghostScore) * 100) : 0
              
              return (
                <ProPlayerCard
                  key={player.id}
                  player={player}
                  playerBest={playerBest}
                  hasBeaten={hasBeaten}
                  percentage={percentage}
                  onChallenge={() => onStartProChallenge(player.id, player.difficulty)}
                />
              )
            })}
          </div>

          <Card className="p-6 bg-card/50 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Trophy size={24} weight="duotone" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-bold text-lg">Pro Challenge Rewards</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <Medal size={16} className="text-accent" weight="fill" />
                    <span>Beat a pro's score to unlock exclusive badges</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lightning size={16} className="text-cyan" weight="fill" />
                    <span>Exceed their score by 10%+ for legendary rewards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Target size={16} className="text-primary" weight="fill" />
                    <span>Track your best attempts against each pro</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProPlayerCardProps {
  player: ProPlayer
  playerBest: number
  hasBeaten: boolean
  percentage: number
  onChallenge: () => void
}

function ProPlayerCard({ player, playerBest, hasBeaten, percentage, onChallenge }: ProPlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-6 ${hasBeaten ? 'border-accent glow-box' : 'border-border'} hover:border-primary transition-colors`}>
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <img src={player.avatarUrl} alt={player.name} className="object-cover" />
            </Avatar>
            {hasBeaten && (
              <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1">
                <Trophy size={20} weight="fill" className="text-accent-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground">{player.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {player.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{player.bio}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {player.achievements.slice(0, 3).map(achievement => (
                <Badge key={achievement} variant="outline" className="text-xs border-primary/30">
                  {achievement}
                </Badge>
              ))}
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{player.ghostScore.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Ghost Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan">{player.reactionTime}ms</div>
                <div className="text-xs text-muted-foreground">Avg Reaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{player.accuracy}%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
            </div>

            {playerBest > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your Best</span>
                  <span className="font-bold text-foreground">{playerBest.toLocaleString()}</span>
                </div>
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${hasBeaten ? 'bg-accent' : 'bg-primary'}`}
                  />
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  {hasBeaten ? '✨ Beaten!' : `${percentage.toFixed(0)}% of pro score`}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={onChallenge}
                className="flex-1"
                variant={hasBeaten ? "outline" : "default"}
              >
                <Target size={16} weight="fill" className="mr-2" />
                {hasBeaten ? 'Challenge Again' : 'Accept Challenge'}
              </Button>
              <Badge variant="secondary" className="px-3 flex items-center gap-1">
                {player.difficulty === 'insane' ? (
                  <Lightning size={14} weight="fill" className="text-destructive" />
                ) : (
                  <Target size={14} weight="fill" className="text-primary" />
                )}
                {player.difficulty.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
