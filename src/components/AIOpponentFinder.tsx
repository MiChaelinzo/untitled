import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sparkle,
  Lightning,
  CircleNotch,
  Sword,
  Trophy,
  TrendUp,
  CheckCircle,
  Info
} from '@phosphor-icons/react'
import {
  PlayerSkillProfile,
  findMatchingOpponents,
  generateMatchPreview
} from '@/lib/ai-matchmaking'
import { Difficulty } from '@/lib/game-types'
import { toast } from 'sonner'

interface AIOpponentFinderProps {
  playerProfile: PlayerSkillProfile
  availablePlayers: PlayerSkillProfile[]
  onChallengeOpponent: (opponentId: string, difficulty: Difficulty) => void
  onClose: () => void
}

export function AIOpponentFinder({
  playerProfile,
  availablePlayers,
  onChallengeOpponent,
  onClose
}: AIOpponentFinderProps) {
  const [isSearching, setIsSearching] = useState(false)
  const [matches, setMatches] = useState<any[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [matchPreview, setMatchPreview] = useState<string>('')
  const [loadingPreview, setLoadingPreview] = useState(false)

  useEffect(() => {
    handleFindOpponents()
  }, [])

  const handleFindOpponents = async () => {
    if (availablePlayers.length === 0) {
      toast.info('No opponents available', {
        description: 'Add friends to find opponents'
      })
      return
    }

    setIsSearching(true)
    try {
      const result = await findMatchingOpponents(playerProfile, availablePlayers, 5)
      setMatches(result.matches)
      setAiAnalysis(result.aiAnalysis)
      
      if (result.matches.length > 0) {
        toast.success('Found matching opponents!', {
          description: `${result.matches.length} players at your skill level`
        })
      } else {
        toast.info('No matches found', {
          description: 'Try adding more friends to the system'
        })
      }
    } catch (error) {
      toast.error('Failed to find opponents')
      console.error(error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleViewMatch = async (match: any) => {
    setSelectedMatch(match)
    setLoadingPreview(true)
    
    try {
      const preview = await generateMatchPreview(playerProfile, match.opponent)
      setMatchPreview(preview)
    } catch (error) {
      console.error('Failed to generate preview:', error)
      setMatchPreview('This should be an exciting match!')
    } finally {
      setLoadingPreview(false)
    }
  }

  const getSkillTier = (rating: number): { label: string; color: string } => {
    if (rating >= 3500) return { label: 'Pro', color: 'text-accent' }
    if (rating >= 2500) return { label: 'Advanced', color: 'text-primary' }
    if (rating >= 1500) return { label: 'Intermediate', color: 'text-cyan' }
    return { label: 'Beginner', color: 'text-muted-foreground' }
  }

  const getMatchQuality = (score: number): { label: string; color: string } => {
    if (score >= 0.9) return { label: 'Perfect Match', color: 'text-accent' }
    if (score >= 0.75) return { label: 'Great Match', color: 'text-primary' }
    if (score >= 0.6) return { label: 'Good Match', color: 'text-cyan' }
    return { label: 'Fair Match', color: 'text-muted-foreground' }
  }

  return (
    <div className="flex flex-col h-full gap-6 p-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
            <Sparkle weight="fill" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              AI Opponent Finder
              <Badge variant="outline" className="text-accent border-accent">
                BETA
              </Badge>
            </h2>
            <p className="text-sm text-muted-foreground">
              Find perfectly matched opponents for competitive play
            </p>
          </div>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <Card className="p-4 bg-primary/10 border-primary/30">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Avatar className="w-12 h-12">
              <AvatarImage src={playerProfile.avatarUrl} />
              <AvatarFallback>{playerProfile.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-lg">{playerProfile.username}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={`${getSkillTier(playerProfile.skillRating).color} border-current`}>
                {getSkillTier(playerProfile.skillRating).label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Rating: {playerProfile.skillRating}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Consistency</span>
                  <span>{(playerProfile.consistencyScore * 100).toFixed(0)}%</span>
                </div>
                <Progress value={playerProfile.consistencyScore * 100} className="h-1" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {playerProfile.playStyle}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {isSearching ? (
        <Card className="p-12 text-center">
          <CircleNotch className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
          <h3 className="text-xl font-bold mb-2">Analyzing Players...</h3>
          <p className="text-muted-foreground">
            AI is finding the best opponents for your skill level
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 overflow-auto">
          {aiAnalysis && (
            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex items-center gap-2 mb-2">
                <Info weight="fill" className="w-5 h-5 text-accent" />
                <span className="font-semibold">AI Analysis</span>
              </div>
              <p className="text-sm">{aiAnalysis}</p>
            </Card>
          )}

          {matches.length === 0 ? (
            <Card className="p-12 text-center">
              <Sword weight="thin" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No Opponents Found</h3>
              <p className="text-muted-foreground mb-4">
                Add more friends to find matching opponents
              </p>
              <Button onClick={handleFindOpponents}>
                <Lightning weight="fill" className="w-4 h-4 mr-2" />
                Search Again
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Trophy weight="fill" className="w-5 h-5 text-primary" />
                  Matched Opponents ({matches.length})
                </h3>
                <Button variant="outline" size="sm" onClick={handleFindOpponents}>
                  <Lightning weight="fill" className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {matches.map((match, index) => {
                const quality = getMatchQuality(match.matchScore)
                const tier = getSkillTier(match.opponent.skillRating)

                return (
                  <motion.div
                    key={match.opponent.userId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                      onClick={() => handleViewMatch(match)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={match.opponent.avatarUrl} />
                            <AvatarFallback>
                              {match.opponent.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{match.opponent.username}</div>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className={`${tier.color} border-current`}>
                                {tier.label}
                              </Badge>
                              <span className="text-muted-foreground">
                                {match.opponent.skillRating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${quality.color} border-current`} variant="outline">
                          {quality.label}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Match Score</span>
                          <span className="font-semibold">
                            {(match.matchScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={match.matchScore * 100} className="h-1" />

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Skill Difference: {match.skillDifference}</span>
                          <Badge variant="secondary" className="text-xs">
                            {match.opponent.playStyle}
                          </Badge>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        {match.reasoning}
                      </div>

                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            onChallengeOpponent(match.opponent.userId, match.opponent.preferredDifficulty)
                            toast.success('Challenge sent!', {
                              description: `Challenged ${match.opponent.username} to ${match.opponent.preferredDifficulty} difficulty`
                            })
                          }}
                        >
                          <Sword weight="fill" className="w-4 h-4 mr-2" />
                          Challenge
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewMatch(match)
                          }}
                        >
                          <TrendUp weight="fill" className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-full max-w-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Sword weight="fill" className="text-primary" />
                    Match Preview
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMatch(null)}
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card className="p-4 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={playerProfile.avatarUrl} />
                      <AvatarFallback>
                        {playerProfile.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold mb-1">{playerProfile.username}</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {playerProfile.skillRating}
                    </div>
                    <Badge variant="outline">{playerProfile.playStyle}</Badge>
                  </Card>

                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-muted-foreground mb-2">VS</div>
                      <Badge className={`${getMatchQuality(selectedMatch.matchScore).color} border-current`} variant="outline">
                        {(selectedMatch.matchScore * 100).toFixed(0)}% Match
                      </Badge>
                    </div>
                  </div>

                  <Card className="p-4 text-center">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                      <AvatarImage src={selectedMatch.opponent.avatarUrl} />
                      <AvatarFallback>
                        {selectedMatch.opponent.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-semibold mb-1">{selectedMatch.opponent.username}</div>
                    <div className="text-2xl font-bold text-primary mb-2">
                      {selectedMatch.opponent.skillRating}
                    </div>
                    <Badge variant="outline">{selectedMatch.opponent.playStyle}</Badge>
                  </Card>
                </div>

                {loadingPreview ? (
                  <Card className="p-8 text-center bg-muted/50">
                    <CircleNotch className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Generating match preview...
                    </p>
                  </Card>
                ) : matchPreview ? (
                  <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle weight="fill" className="w-5 h-5 text-accent" />
                      <span className="font-semibold">AI Commentary</span>
                    </div>
                    <p className="text-sm leading-relaxed">{matchPreview}</p>
                  </Card>
                ) : null}

                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Skill Difference</div>
                      <div className="font-semibold">{selectedMatch.skillDifference} points</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Recommended Difficulty</div>
                      <div className="font-semibold capitalize">{selectedMatch.opponent.preferredDifficulty}</div>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      onChallengeOpponent(selectedMatch.opponent.userId, selectedMatch.opponent.preferredDifficulty)
                      setSelectedMatch(null)
                      toast.success('Challenge sent!', {
                        description: `Challenged ${selectedMatch.opponent.username} to ${selectedMatch.opponent.preferredDifficulty} difficulty`
                      })
                    }}
                  >
                    <Sword weight="fill" className="w-5 h-5 mr-2" />
                    Send Challenge
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
