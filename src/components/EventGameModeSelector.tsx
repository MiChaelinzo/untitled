import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Lock, Sparkle, Lightning, Target, Info } from '@phosphor-icons/react'
import {
  EventGameMode,
  getEventGameMode,
  isGameModeUnlocked,
  getEventModeDescription,
  getMechanicIcon
} from '@/lib/event-game-modes'
import { SeasonalEvent, PlayerEventProgress } from '@/lib/seasonal-events'

interface EventGameModeSelectorProps {
  event: SeasonalEvent
  eventProgress?: PlayerEventProgress
  onSelectMode: (modeId: string) => void
  onClose: () => void
}

export function EventGameModeSelector({
  event,
  eventProgress,
  onSelectMode,
  onClose
}: EventGameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<EventGameMode | null>(null)
  const eventModes = getEventGameMode(event.id)
  
  const eventChallengesCompleted = eventProgress?.completedChallenges?.length || 0
  const eventScore = eventProgress?.eventScore || 0

  if (eventModes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <Card
          className="max-w-md w-full p-6 bg-card/95 border-2 border-primary/30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{event.icon}</div>
            <h2 className="text-2xl font-bold">No Special Modes</h2>
            <p className="text-muted-foreground">
              This event doesn't have special game modes yet. Check back later!
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <Card
        className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-card/95 border-2 border-primary/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <span className="text-4xl">{event.icon}</span>
                Event Game Modes
              </h2>
              <p className="text-muted-foreground">
                {event.name} - Special game modes with unique mechanics
              </p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>

          <Separator />

          {selectedMode ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedMode(null)}
                className="mb-4"
              >
                ← Back to modes
              </Button>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedMode.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">{selectedMode.name}</h3>
                      <p className="text-muted-foreground mt-1">
                        {selectedMode.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="text-sm"
                      style={{
                        backgroundColor: event.theme.primaryColor,
                        color: event.theme.backgroundColor
                      }}
                    >
                      <Lightning className="mr-1" />
                      {Math.round((selectedMode.scoreModifier - 1) * 100)}% Score Bonus
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      <Target className="mr-1" />
                      {selectedMode.mechanics.length} Mechanics
                    </Badge>
                  </div>

                  <Card className="p-4 bg-muted/50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Info />
                      How to Play
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {getEventModeDescription(selectedMode)}
                    </p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkle />
                      Unique Mechanics
                    </h4>
                    <div className="space-y-2">
                      {selectedMode.mechanics.map((mechanic, idx) => (
                        <Card key={idx} className="p-3 bg-muted/30">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">{getMechanicIcon(mechanic.type)}</span>
                            <div>
                              <div className="font-semibold text-sm">{mechanic.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {mechanic.description}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Visual Effects</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMode.visualEffects.map((effect, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {effect.effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMode(null)}
                >
                  Back
                </Button>
                <Button
                  onClick={() => onSelectMode(selectedMode.id)}
                  className="gap-2"
                  style={{
                    backgroundColor: event.theme.primaryColor,
                    color: event.theme.backgroundColor
                  }}
                >
                  <Sparkle />
                  Play This Mode
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {eventModes.map((mode) => {
                const unlocked = isGameModeUnlocked(mode, eventChallengesCompleted, eventScore)

                return (
                  <motion.div
                    key={mode.id}
                    whileHover={unlocked ? { scale: 1.02 } : undefined}
                    whileTap={unlocked ? { scale: 0.98 } : undefined}
                  >
                    <Card
                      className={`p-4 cursor-pointer transition-all ${
                        unlocked
                          ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20'
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => unlocked && setSelectedMode(mode)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl relative">
                          {mode.icon}
                          {!unlocked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Lock className="text-muted-foreground" size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {mode.name}
                            {!unlocked && <Lock size={16} className="text-muted-foreground" />}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {mode.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="text-xs">
                              <Lightning className="mr-1" size={12} />
                              +{Math.round((mode.scoreModifier - 1) * 100)}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {mode.mechanics.length} mechanics
                            </Badge>
                          </div>

                          {!unlocked && mode.unlockRequirement && (
                            <div className="mt-3 text-xs text-muted-foreground">
                              <div className="font-semibold mb-1">Unlock Requirements:</div>
                              {mode.unlockRequirement.eventChallengesCompleted && (
                                <div>
                                  • Complete {mode.unlockRequirement.eventChallengesCompleted} event{' '}
                                  {mode.unlockRequirement.eventChallengesCompleted === 1
                                    ? 'challenge'
                                    : 'challenges'}{' '}
                                  ({eventChallengesCompleted}/
                                  {mode.unlockRequirement.eventChallengesCompleted})
                                </div>
                              )}
                              {mode.unlockRequirement.eventScore && (
                                <div>
                                  • Earn {mode.unlockRequirement.eventScore.toLocaleString()} event
                                  points ({eventScore.toLocaleString()}/
                                  {mode.unlockRequirement.eventScore.toLocaleString()})
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
