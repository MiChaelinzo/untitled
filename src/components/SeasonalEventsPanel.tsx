import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Calendar, 
  Trophy, 
  Star, 
  Clock, 
  Gift, 
  Sparkle,
  Crown,
  Flame,
  Lightning
} from '@phosphor-icons/react'
import {
  SeasonalEvent,
  EventChallenge,
  EventReward,
  PlayerEventProgress,
  getActiveEvents,
  getUpcomingEvents,
  formatTimeRemaining,
  getTierColor,
  sortEventsByDate,
  SEASONAL_EVENTS
} from '@/lib/seasonal-events'
import { toast } from 'sonner'

interface SeasonalEventsPanelProps {
  onClose?: () => void
}

export function SeasonalEventsPanel({ onClose }: SeasonalEventsPanelProps) {
  const [selectedEvent, setSelectedEvent] = useState<SeasonalEvent | null>(null)
  const [eventProgress, setEventProgress] = useKV<Record<string, PlayerEventProgress>>('event-progress', {})
  
  const activeEvents = getActiveEvents(SEASONAL_EVENTS)
  const upcomingEvents = getUpcomingEvents(SEASONAL_EVENTS, 30)
  const sortedEvents = sortEventsByDate([...activeEvents, ...upcomingEvents])

  useEffect(() => {
    if (activeEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(activeEvents[0])
    }
  }, [activeEvents, selectedEvent])

  const getEventProgress = (eventId: string): PlayerEventProgress => {
    return (eventProgress || {})[eventId] || {
      eventId,
      completedChallenges: [],
      earnedRewards: [],
      eventScore: 0,
      lastUpdated: Date.now()
    }
  }

  const getChallengeProgress = (challenge: EventChallenge, eventId: string) => {
    const progress = getEventProgress(eventId)
    const isComplete = progress.completedChallenges.includes(challenge.id)
    return {
      isComplete,
      progress: isComplete ? challenge.requirement.target : 0,
      target: challenge.requirement.target
    }
  }

  const claimReward = (challenge: EventChallenge, eventId: string) => {
    if (!challenge || !challenge.reward) {
      toast.error('Invalid challenge or reward')
      return
    }

    const progress = getEventProgress(eventId)
    
    if (progress.completedChallenges.includes(challenge.id)) {
      if (!progress.earnedRewards.includes(challenge.reward.id)) {
        setEventProgress(current => ({
          ...current,
          [eventId]: {
            ...progress,
            earnedRewards: [...progress.earnedRewards, challenge.reward.id]
          }
        }))
        
        toast.success(`Reward Claimed: ${challenge.reward.name || 'Reward'}!`, {
          description: challenge.reward.description || 'New reward unlocked',
          icon: challenge.reward.icon || '🎁'
        })
      } else {
        toast.info('Reward already claimed')
      }
    } else {
      toast.error('Challenge not completed yet')
    }
  }

  const isEventActive = (event: SeasonalEvent) => {
    const now = Date.now()
    return now >= event.startDate && now <= event.endDate
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return '🥉'
      case 'silver': return '🥈'
      case 'gold': return '🥇'
      case 'platinum': return '💎'
      case 'diamond': return '💠'
      default: return '⭐'
    }
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Seasonal Events</h2>
            <p className="text-sm text-muted-foreground">
              Limited-time challenges and exclusive rewards
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {activeEvents.length === 0 && upcomingEvents.length === 0 ? (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Calendar className="w-16 h-16 text-muted-foreground opacity-50" />
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No Events Available</h3>
            <p className="text-sm text-muted-foreground">
              Check back soon for new seasonal events and challenges!
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkle className="w-4 h-4" />
                All Events
              </h3>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {sortedEvents.map(event => {
                    const active = isEventActive(event)
                    const progress = getEventProgress(event.id)
                    const totalChallenges = event.challenges.length
                    const completedChallenges = progress.completedChallenges.length
                    
                    return (
                      <motion.div
                        key={event.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`p-4 cursor-pointer transition-all ${
                            selectedEvent?.id === event.id
                              ? 'border-primary bg-primary/10'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start gap-3">
                            <div 
                              className="text-3xl p-2 rounded-lg"
                              style={{ 
                                backgroundColor: `color-mix(in oklch, ${event.theme.primaryColor} 20%, transparent)`
                              }}
                            >
                              {event.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-sm truncate">
                                  {event.name}
                                </h4>
                                {active && (
                                  <Badge variant="default" className="text-xs">
                                    Live
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                {event.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeRemaining(event.endDate)}</span>
                              </div>
                              {totalChallenges > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    {completedChallenges}/{totalChallenges} challenges
                                  </div>
                                  <Progress 
                                    value={(completedChallenges / totalChallenges) * 100} 
                                    className="h-1"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedEvent && (
                <motion.div
                  key={selectedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card 
                    className="p-6"
                    style={{
                      background: `linear-gradient(135deg, 
                        color-mix(in oklch, ${selectedEvent.theme.backgroundColor} 80%, transparent),
                        color-mix(in oklch, ${selectedEvent.theme.primaryColor} 10%, transparent)
                      )`
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        <div 
                          className="text-5xl p-3 rounded-xl"
                          style={{ 
                            backgroundColor: `color-mix(in oklch, ${selectedEvent.theme.primaryColor} 30%, transparent)`,
                            boxShadow: `0 0 20px color-mix(in oklch, ${selectedEvent.theme.primaryColor} 50%, transparent)`
                          }}
                        >
                          {selectedEvent.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
                          <p className="text-muted-foreground mb-3">{selectedEvent.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeRemaining(selectedEvent.endDate)}</span>
                            </div>
                            {isEventActive(selectedEvent) && (
                              <Badge 
                                variant="default"
                                className="animate-pulse"
                                style={{ 
                                  backgroundColor: selectedEvent.theme.primaryColor 
                                }}
                              >
                                <Flame className="w-3 h-3 mr-1" />
                                Active Now
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <Tabs defaultValue="challenges" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="challenges">
                          <Trophy className="w-4 h-4 mr-2" />
                          Challenges
                        </TabsTrigger>
                        <TabsTrigger value="rewards">
                          <Gift className="w-4 h-4 mr-2" />
                          Rewards
                        </TabsTrigger>
                        <TabsTrigger value="leaderboard">
                          <Crown className="w-4 h-4 mr-2" />
                          Leaderboard
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="challenges" className="mt-6">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            {selectedEvent.challenges.filter(challenge => challenge && challenge.reward).map(challenge => {
                              const { isComplete, progress, target } = getChallengeProgress(
                                challenge,
                                selectedEvent.id
                              )
                              const progressPercent = (progress / target) * 100
                              const hasClaimedReward = getEventProgress(selectedEvent.id)
                                .earnedRewards.includes(challenge.reward.id)

                              return (
                                <Card 
                                  key={challenge.id}
                                  className="p-4"
                                  style={{
                                    borderColor: getTierColor(challenge.tier),
                                    borderWidth: '2px'
                                  }}
                                >
                                  <div className="flex items-start gap-4">
                                    <div 
                                      className="text-3xl p-2 rounded-lg"
                                      style={{ 
                                        backgroundColor: `color-mix(in oklch, ${getTierColor(challenge.tier)} 20%, transparent)`
                                      }}
                                    >
                                      {challenge.icon}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{challenge.name}</h4>
                                        <Badge 
                                          variant="outline"
                                          style={{ 
                                            borderColor: getTierColor(challenge.tier),
                                            color: getTierColor(challenge.tier)
                                          }}
                                        >
                                          {getTierIcon(challenge.tier)} {challenge.tier}
                                        </Badge>
                                        {isComplete && (
                                          <Badge variant="default" className="bg-green-500">
                                            ✓ Complete
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground mb-3">
                                        {challenge.description}
                                      </p>
                                      
                                      <div className="mb-3">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                          <span className="text-muted-foreground">Progress</span>
                                          <span className="font-semibold">
                                            {progress.toLocaleString()} / {target.toLocaleString()}
                                          </span>
                                        </div>
                                        <Progress value={progressPercent} className="h-2" />
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Lightning className="w-4 h-4 text-cyan" />
                                          <span className="text-sm font-semibold">
                                            {challenge.reward?.name || 'Reward'}
                                          </span>
                                          {challenge.reward?.rarity && (
                                            <Badge 
                                              variant="outline"
                                              className="text-xs"
                                              style={{ 
                                                borderColor: challenge.reward.glowColor,
                                                color: challenge.reward.glowColor
                                              }}
                                            >
                                              {challenge.reward.rarity}
                                            </Badge>
                                          )}
                                        </div>
                                        <Button
                                          size="sm"
                                          disabled={!isComplete || hasClaimedReward}
                                          onClick={() => claimReward(challenge, selectedEvent.id)}
                                        >
                                          {hasClaimedReward ? 'Claimed' : 'Claim Reward'}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Card>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="rewards" className="mt-6">
                        <ScrollArea className="h-[400px] pr-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedEvent.challenges.filter(challenge => challenge && challenge.reward).map(challenge => {
                              const hasEarned = getEventProgress(selectedEvent.id)
                                .earnedRewards.includes(challenge.reward.id)
                              
                              return (
                                <Card 
                                  key={challenge.reward.id}
                                  className="p-4 relative overflow-hidden"
                                  style={{
                                    boxShadow: hasEarned 
                                      ? `0 0 20px color-mix(in oklch, ${challenge.reward.glowColor} 50%, transparent)`
                                      : 'none'
                                  }}
                                >
                                  {hasEarned && (
                                    <div className="absolute top-2 right-2">
                                      <Badge variant="default" className="bg-green-500">
                                        ✓ Earned
                                      </Badge>
                                    </div>
                                  )}
                                  <div className="text-4xl mb-3">{challenge.reward?.icon || '🎁'}</div>
                                  <h4 className="font-semibold mb-1">{challenge.reward?.name || 'Reward'}</h4>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    {challenge.reward?.description || 'Special reward'}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    {challenge.reward?.rarity && (
                                      <Badge 
                                        variant="outline"
                                        style={{ 
                                          borderColor: challenge.reward.glowColor,
                                          color: challenge.reward.glowColor
                                        }}
                                      >
                                        {challenge.reward.rarity}
                                      </Badge>
                                    )}
                                    {challenge.reward?.type && (
                                      <Badge variant="secondary" className="text-xs">
                                        {challenge.reward.type}
                                      </Badge>
                                    )}
                                  </div>
                                  {challenge.reward?.isPermanent && (
                                    <div className="mt-2">
                                      <Badge variant="outline" className="text-xs">
                                        <Star className="w-3 h-3 mr-1" />
                                        Permanent
                                      </Badge>
                                    </div>
                                  )}
                                </Card>
                              )
                            })}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="leaderboard" className="mt-6">
                        <Card className="p-6">
                          <div className="text-center py-12">
                            <Crown className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">Leaderboard Coming Soon</h3>
                            <p className="text-sm text-muted-foreground">
                              Compete with players worldwide for exclusive rewards!
                            </p>
                          </div>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
