import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'fram
import {
  CircleNotch,
  Lightn
  TrendUp,
  Info,
} from '@
import {
  findMa
} from '@/
interface AIOp
  avail
  X
} from '@phosphor-icons/react'
import { Difficulty } from '@/lib/game-types'
import {
  PlayerSkillProfile,
  findMatchingOpponents,
  generateMatchPreview
} from '@/lib/ai-matchmaking'

interface AIOpponentFinderProps {
  playerProfile: PlayerSkillProfile
  availablePlayers: PlayerSkillProfile[]
  onChallengeOpponent: (opponent: PlayerSkillProfile, difficulty: Difficulty) => void
  onClose: () => void
}

  useEffect(() => {
  }, [])
  const handleFindO
      toast.info('No o
      })
    }
    setIsSearching(true)
      const result = await findMatchingOpponents(pl
      setAiAnalysis(result.aiAnalysis)
      if (result.matches.length > 0) {
          description: `${result.matches.length} players at yo
      } else {

      }
      toast.error('Failed
    } fi


    setSelectedMatch(match)
    
      const preview = await generateMatchPreview(pla
    } ca
      setMat
     

  const getSkillTier = (
    if (r
    return { label: 'Beginner', color: 'text-muted-foreground' }

    if (score >= 0.9) return { label: 
    if
  }
  return (
      <div className="flex items-center justify-between">
          
          </di
            <h2 className="text-2xl font
              <Badge variant="outline" className="text-accent 
          
       
            </p>
        </div>
          <X className="w-
      </div>
      <Card className="p-4 
     
   

            <div className="text-sm text-muted-fo
            </div>
        </div>

        <
          <h3 className="text-xl font-bold mb-2">Analyzing Players...</h3>
            AI is finding the 
        </Card>
        <div className="flex flex-col gap-4">
            <Card className="p-4 bg-accent/10 border-accen
               
              </div>
     
   

            </p>
              <Lightning weight="fill" className="w-5 h-5 mr-2" />
            </Button>
        </div>
        <div className="space-y-3 overflow-y-auto flex-1">
   

            <Button variant="ghost" size="sm" onClick={handleFindOpponents}>
              Refresh
          </div>
          {aiAnalysis && (
              <div className="flex items-start gap-3">
   


            const tier = getSkillTier(match.opponent.skillRating)
            
              <Card
                className="p-4 bg-card/80 hover:bg-card border-border hover:border-primar
                <div className="flex items-start gap-3 mb-3">
                
               
                  </Avatar>
                    <div classNa
                      <Badge variant="outline" className={tier.color}>
                    
                    <d
                 
                </div>
                <div className="space-y-2 mb-3">
                
                
              
                    <span className="text-muted-foreground">
                  </div>

            

                  <Button
                    className="flex-1"
                      e.stopPropagation(
                    }}
                    <Sword weight="fill" className="w-4 h-4 mr-2" />
                  <
                    variant="outli
                      e.stopPropagation()
                    }}
                    <TrendUp weight="fill" className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>

      {isSearching ? (
        <Card className="p-12 text-center">
          <CircleNotch className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
          <h3 className="text-xl font-bold mb-2">Analyzing Players...</h3>
          <p className="text-muted-foreground">
            AI is finding the best opponents for you
          </p>
        </Card>
      ) : matches.length === 0 ? (
        <div className="flex flex-col gap-4">
          {aiAnalysis && (
            <Card className="p-4 bg-accent/10 border-accent/30">
              <div className="flex items-start gap-3">
                <Info weight="fill" className="w-5 h-5 text-accent mt-0.5" />
                <p className="text-sm">{aiAnalysis}</p>
              </div>
            </Card>
          )}

          <Card className="p-12 text-center">
            <h3 className="text-xl font-bold mb-2">No Opponents Found</h3>
            <p className="text-muted-foreground mb-4">
              Add more players to find opponents
            </p>
            <Button onClick={handleFindOpponents}>
              <Lightning weight="fill" className="w-5 h-5 mr-2" />
              Search Again
            </Button>
          </Card>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy weight="fill" className="w-5 h-5 text-primary" />
              Matched Opponents ({matches.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={handleFindOpponents}>
              <Lightning weight="fill" className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {aiAnalysis && (
            <Card className="p-4 bg-primary/10 border-primary/30 mb-4">
              <div className="flex items-start gap-3">
                <Sparkle weight="fill" className="w-5 h-5 text-primary mt-0.5" />
                <p className="text-sm">{aiAnalysis}</p>
              </div>
            </Card>
          )}

          {matches.map((match, index) => {
            const tier = getSkillTier(match.opponent.skillRating)
            const quality = getMatchQuality(match.matchScore)
            
            return (
              <Card
                key={index}
                className="p-4 bg-card/80 hover:bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={match.opponent.avatarUrl} />
                    <AvatarFallback>
                      {match.opponent.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold">{match.opponent.username}</div>
                      <Badge variant="outline" className={tier.color}>
                        {tier.label}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.opponent.skillRating} rating • {match.opponent.playStyle}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Match Quality</span>
                    <span className={`font-semibold ${quality.color}`}>
                      {(match.matchScore * 100).toFixed(0)}% • {quality.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Skill Difference</span>
                    <span className="font-semibold">±{match.skillDifference}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 p-3 bg-muted/50 rounded-lg">
                  {match.reasoning}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChallengeOpponent(match.opponent, match.opponent.preferredDifficulty)
                    }}
                  >
                    <Sword weight="fill" className="w-4 h-4 mr-2" />
                    Challenge
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewMatch(match)
                    }}
                  >
                    <TrendUp weight="fill" className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedMatch && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMatch(null)}
          >
            <motion.div
              className="bg-card border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Match Preview</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedMatch(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between gap-8 mb-6">
                <Card className="flex-1 p-4 text-center bg-primary/10">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
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
                    <div className="text-4xl font-bold mb-2">VS</div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedMatch.matchScore * 100).toFixed(0)}% Match
                    </div>
                  </div>
                </div>

                <Card className="flex-1 p-4 text-center bg-accent/10">
                  <Avatar className="w-16 h-16 mx-auto mb-2">
                    <AvatarImage src={selectedMatch.opponent.avatarUrl} />
                    <AvatarFallback>
                      {selectedMatch.opponent.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold mb-1">{selectedMatch.opponent.username}</div>
                  <div className="text-2xl font-bold text-accent mb-2">
                    {selectedMatch.opponent.skillRating}
                  </div>
                  <Badge variant="outline">{selectedMatch.opponent.playStyle}</Badge>
                </Card>
              </div>

              {loadingPreview ? (
                <Card className="p-6 text-center bg-muted/50">
                  <CircleNotch className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Generating match analysis...
                  </p>
                </Card>
              ) : (
                <Card className="p-6 bg-muted/50 mb-6">
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle weight="fill" className="w-5 h-5 text-accent" />
                    <div>
                      <h4 className="font-semibold mb-2">Match Analysis</h4>
                      <p className="text-sm">{matchPreview}</p>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Skill Difference</span>
                  <span className="font-semibold">±{selectedMatch.skillDifference}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Recommended Difficulty</span>
                  <Badge>{selectedMatch.opponent.preferredDifficulty}</Badge>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedMatch(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    setSelectedMatch(null)
                    onChallengeOpponent(selectedMatch.opponent, selectedMatch.opponent.preferredDifficulty)
                  }}
                >
                  <Sword weight="fill" className="w-5 h-5 mr-2" />
                  Start Challenge
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
