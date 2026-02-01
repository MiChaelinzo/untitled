import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage 
  Sparkle,
  CircleNotch,
  Trophy
  Sparkle,
  Lightning,
  CircleNotch,
  Sword,
  Trophy,
  TrendUp,
  CheckCircle,
  Info
import { Difficulty } from '@/

  playerProfile: Play
  onChallengeOpponent: (
}
export function AIOpponentFin
  availablePlayers,
  onClose

  const [aiAnalysis, setAiAnalysi
  const [matchPreview, setMatchPrev

    handleFindOpponents()

 

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
            </div>
              <
                 
            

                {playerProfile.playStyle}
            </div>
        </div>

        <Card className="p-12 text-center">
          <h3 className="text-xl font-bold mb-2">Analyzing Players...</h3>
            AI is fin
        </Card>
        <div className="flex flex-
            <Card className="p-4 bg-accent/10 border-accent/30">
                <Info weight="fill" className="w-5 h-5 tex
              </div>
            </Card>

            <Card className="p-12 text-center">
              <h3 className="text-xl font-bold mb-2
                Add m
              <But
                Search Again
            </Card>
            <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  Matched Opponents ({matches.length})
                <Butto
                  Refresh
              </div>
              {matches.map((match, index) => {
                const tier = getSkillTier
                return
                  
                
              
             

                      
                            <AvatarImage sr
                              {match.opponent.username[0].toUpperCase()}
                          </Avatar>
                            <div className="fon
                              <Badge variant="outline" className=
              
               
           
                        </div>
                          
                      </div>
                      <div className="space-y-2 mb-3">
                          <span className="text-muted-foreground">Matc
                            {(match.matchScore * 100).toFixed(0)}%
                    

                   
            


                        {match.reasoning}

                        <Button
                          className="flex-1"
                            e.stopPropagation()
                  
                            })
                        >
                          Ch
                       
                   
               
                          }}
                          <TrendUp weight="fill" className="w-4 h
                        </Button>
                    </Card>
                )
            </div>
        </div>

        {selectedMatch &&
            initial={{ op
            exit={{ 

            <motion.div
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}

                  <h3 cl
                    Match Pre
                  <Button
                    size="sm"
                  >
                  </Button>

                  <Card c
                      <AvatarImage src={playerProfile.avatarUrl} />
                        {playerProfile.username[0].toUpperCa
                    <
                    <div className="text-2xl font-bold text-primary mb-2">
                    </div>
                  </Card>
                  <div className="flex items-center justify-center">
                      <div className="text-4
                        {(selectedMatch.matchScore * 100).toFixed(0)}% M
                    </div>

                    <Avatar cla
                      <AvatarFallback>
                      </AvatarFallback>
                    <div className="font-semibold mb-1">{selectedMatch.opponent.username}</div>
                      {selectedMatch.opponen
                    <Badge variant="ou
                </div>
                {loadingPreview ? (
                    <CircleNotch clas
                      Generating m
                  </Card>
                  <Card classN
                      <CheckCircle weight="fill" className="w-5 h-5 text-accent" />
                    </div>
                  </Card>


                      <div className="text-muted-foreg
                    </div>
                      <div className="text-muted-foreground">Recommended Difficulty<
                    </div>

                    className="w-
                    onClick={(
                      setSelectedMatch(null)

                    }}
                    <Sword weight="fill" className="w-5 h-5 mr-2" />
                  </Button>
              </Card>
          </motion.div>
      </AnimatePresence>
  )


































































































































































