import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Robot, Sparkle, TrendUp, Target, Trophy, Sword } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  PlayerSkillProfile,
  findMatchingOpponents,
  generateMatchPreview,
  predictMatchOutcome
} from '@/lib/ai-matchmaking'
import { Difficulty } from '@/lib/game-types'

interface AIOpponentFinderProps {
  playerProfile: PlayerSkillProfile
  onSelectOpponent: (opponent: PlayerSkillProfile, difficulty: Difficulty) => void
  isOpen: boolean
  onClose: () => void
}

export function AIOpponentFinder({
  playerProfile,
  onSelectOpponent,
  isOpen,
  onClose
}: AIOpponentFinderProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [matches, setMatches] = useState<Array<{
    opponent: PlayerSkillProfile
    matchScore: number
    skillDifference: number
    reasoning: string
  }>>([])
  const [aiAnalysis, setAiAnalysis] = useState('')
  const [selectedOpponent, setSelectedOpponent] = useState<PlayerSkillProfile | null>(null)
  const [matchPreview, setMatchPreview] = useState('')
  const [matchPrediction, setMatchPrediction] = useState<{
    player1WinProbability: number
    player2WinProbability: number
    competitivenessScore: number
    analysis: string
  } | null>(null)

  useEffect(() => {
    if (isOpen && matches.length === 0) {
      searchForOpponents()
    }
  }, [isOpen])

  const searchForOpponents = async () => {
    setIsSearching(true)
    setSelectedOpponent(null)
    setMatchPreview('')
    setMatchPrediction(null)

    const mockOpponents: PlayerSkillProfile[] = [
      {
        userId: 'ai_opponent_1',
        username: 'CyberNinja',
        skillRating: playerProfile.skillRating + Math.floor(Math.random() * 400 - 200),
        consistencyScore: 0.75 + Math.random() * 0.2,
        averageReactionTime: 250 + Math.random() * 100,
        preferredDifficulty: playerProfile.preferredDifficulty,
        recentPerformance: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10000 + 15000)),
        volatility: 0.15,
        playStyle: 'aggressive'
      },
      {
        userId: 'ai_opponent_2',
        username: 'PixelMaster',
        skillRating: playerProfile.skillRating + Math.floor(Math.random() * 600 - 300),
        consistencyScore: 0.85 + Math.random() * 0.1,
        averageReactionTime: 200 + Math.random() * 80,
        preferredDifficulty: playerProfile.preferredDifficulty,
        recentPerformance: Array.from({ length: 5 }, () => Math.floor(Math.random() * 12000 + 18000)),
        volatility: 0.08,
        playStyle: 'consistent'
      },
      {
        userId: 'ai_opponent_3',
        username: 'ReflexKing',
        skillRating: playerProfile.skillRating + Math.floor(Math.random() * 500 - 250),
        consistencyScore: 0.7 + Math.random() * 0.2,
        averageReactionTime: 220 + Math.random() * 90,
        preferredDifficulty: playerProfile.preferredDifficulty,
        recentPerformance: Array.from({ length: 5 }, () => Math.floor(Math.random() * 11000 + 16000)),
        volatility: 0.2,
        playStyle: 'adaptive'
      },
      {
        userId: 'ai_opponent_4',
        username: 'QuickDraw',
        skillRating: playerProfile.skillRating + Math.floor(Math.random() * 700 - 350),
        consistencyScore: 0.65 + Math.random() * 0.25,
        averageReactionTime: 180 + Math.random() * 110,
        preferredDifficulty: playerProfile.preferredDifficulty,
        recentPerformance: Array.from({ length: 5 }, () => Math.floor(Math.random() * 13000 + 14000)),
        volatility: 0.18,
        playStyle: 'aggressive'
      },
      {
        userId: 'ai_opponent_5',
        username: 'SteadyShot',
        skillRating: playerProfile.skillRating + Math.floor(Math.random() * 300 - 150),
        consistencyScore: 0.9 + Math.random() * 0.08,
        averageReactionTime: 240 + Math.random() * 70,
        preferredDifficulty: playerProfile.preferredDifficulty,
        recentPerformance: Array.from({ length: 5 }, () => Math.floor(Math.random() * 10000 + 19000)),
        volatility: 0.05,
        playStyle: 'consistent'
      }
    ]

    try {
      const result = await findMatchingOpponents(playerProfile, mockOpponents, 5)
      setMatches(result.matches)
      setAiAnalysis(result.aiAnalysis)
    } catch (error) {
      console.error('Failed to find opponents:', error)
      setAiAnalysis('Unable to find opponents at this time. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectOpponent = async (opponent: PlayerSkillProfile) => {
    setSelectedOpponent(opponent)
    
    try {
      const [preview, prediction] = await Promise.all([
        generateMatchPreview(playerProfile, opponent),
        predictMatchOutcome(playerProfile, opponent)
      ])
      setMatchPreview(preview)
      setMatchPrediction(prediction)
    } catch (error) {
      console.error('Failed to generate match details:', error)
      setMatchPreview('An exciting match awaits!')
    }
  }

  const handleStartMatch = () => {
    if (selectedOpponent) {
      onSelectOpponent(selectedOpponent, playerProfile.preferredDifficulty)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6 bg-card/95 backdrop-blur border-primary/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Robot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Opponent Finder</h2>
                <p className="text-sm text-muted-foreground">
                  Find perfectly matched opponents using AI
                </p>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkle className="w-12 h-12 text-primary" />
              </motion.div>
              <p className="text-lg text-muted-foreground">
                AI is analyzing opponents...
              </p>
            </div>
          ) : selectedOpponent ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-4 bg-accent/10 border-accent/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {playerProfile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {playerProfile.username}
                      </p>
                      <p className="text-xs text-muted-foreground">You</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skill Rating</span>
                      <span className="font-semibold text-foreground">
                        {playerProfile.skillRating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Play Style</span>
                      <Badge variant="secondary" className="text-xs">
                        {playerProfile.playStyle}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Consistency</span>
                      <span className="font-semibold text-foreground">
                        {(playerProfile.consistencyScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-destructive/10 border-destructive/30">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarFallback className="bg-destructive/20 text-destructive font-bold">
                        {selectedOpponent.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedOpponent.username}
                      </p>
                      <p className="text-xs text-muted-foreground">Opponent</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skill Rating</span>
                      <span className="font-semibold text-foreground">
                        {selectedOpponent.skillRating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Play Style</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedOpponent.playStyle}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Consistency</span>
                      <span className="font-semibold text-foreground">
                        {(selectedOpponent.consistencyScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              {matchPrediction && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="text-sm font-semibold mb-3 text-foreground">
                    Win Probability
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {playerProfile.username}
                        </span>
                        <span className="font-semibold text-primary">
                          {(matchPrediction.player1WinProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={matchPrediction.player1WinProbability * 100} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">
                          {selectedOpponent.username}
                        </span>
                        <span className="font-semibold text-destructive">
                          {(matchPrediction.player2WinProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={matchPrediction.player2WinProbability * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {matchPrediction.analysis}
                    </p>
                  </div>
                </Card>
              )}

              {matchPreview && (
                <Card className="p-4 bg-accent/5 border-accent/20">
                  <div className="flex items-start gap-2">
                    <Trophy className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground italic">{matchPreview}</p>
                  </div>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOpponent(null)}
                  className="flex-1"
                >
                  Back to List
                </Button>
                <Button onClick={handleStartMatch} className="flex-1">
                  <Sword className="w-4 h-4 mr-2" />
                  Start Match
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {aiAnalysis && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-start gap-2">
                    <Sparkle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{aiAnalysis}</p>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Recommended Opponents
                </h3>
                <AnimatePresence>
                  {matches.map((match, index) => (
                    <motion.div
                      key={match.opponent.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className="p-4 cursor-pointer hover:bg-accent/10 transition-colors border-border hover:border-primary/50"
                        onClick={() => handleSelectOpponent(match.opponent)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-primary/20 text-primary font-bold">
                                {match.opponent.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">
                                {match.opponent.username}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {match.opponent.playStyle}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Rating: {match.opponent.skillRating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-primary mb-1">
                              <Target className="w-4 h-4" />
                              <span className="text-sm font-semibold">
                                {(match.matchScore * 100).toFixed(0)}% Match
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {Math.abs(match.skillDifference)} SR difference
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3 pl-12">
                          {match.reasoning}
                        </p>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {matches.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No opponents found.</p>
                  <Button
                    onClick={searchForOpponents}
                    variant="outline"
                    className="mt-4"
                  >
                    Search Again
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
