import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  SpecialGameMode, 
  getActiveGameModes, 
  getUpcomingGameModes,
  formatGameModeTimeRemaining,
  SPECIAL_GAME_MODES 
} from '@/lib/special-game-modes'
import { 
  Clock, 
  Trophy, 
  Fire, 
  Sparkle, 
  Target,
  Info,
  CalendarBlank,
  Star
} from '@phosphor-icons/react'
import { Difficulty } from '@/lib/game-types'

interface SpecialGameModePanelProps {
  onStartGameMode: (modeId: string, difficulty: Difficulty) => void
}

export function SpecialGameModePanel({ onStartGameMode }: SpecialGameModePanelProps) {
  const [selectedMode, setSelectedMode] = useState<SpecialGameMode | null>(null)
  const activeGameModes = getActiveGameModes(SPECIAL_GAME_MODES)
  const upcomingGameModes = getUpcomingGameModes(SPECIAL_GAME_MODES, 30)

  const handlePlayMode = (mode: SpecialGameMode) => {
    onStartGameMode(mode.id, mode.difficulty)
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'oklch(0.70 0.18 150)'
      case 'medium': return 'oklch(0.75 0.22 60)'
      case 'hard': return 'oklch(0.70 0.25 350)'
      case 'insane': return 'oklch(0.60 0.28 290)'
    }
  }

  return (
    <div className="w-full h-full">
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="gap-2">
            <Fire weight="fill" />
            Active Modes ({activeGameModes.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <CalendarBlank weight="fill" />
            Coming Soon ({upcomingGameModes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGameModes.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <Target size={64} weight="duotone" className="text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Active Game Modes</h3>
                  <p className="text-muted-foreground">Check back soon for limited-time events!</p>
                </div>
              </div>
            </Card>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGameModes.map((mode) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card 
                      className="p-6 cursor-pointer border-2 transition-all duration-300 hover:shadow-lg relative overflow-hidden"
                      style={{
                        borderColor: mode.theme.primaryColor,
                        background: `linear-gradient(135deg, ${mode.theme.backgroundColor} 0%, ${mode.theme.primaryColor}15 100%)`
                      }}
                      onClick={() => setSelectedMode(mode)}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10"
                        style={{
                          background: `radial-gradient(circle, ${mode.theme.accentColor} 0%, transparent 70%)`
                        }}
                      />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="text-4xl p-3 rounded-xl"
                              style={{
                                background: mode.theme.primaryColor + '25',
                                boxShadow: `0 0 20px ${mode.theme.primaryColor}50`
                              }}
                            >
                              {mode.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground mb-1">
                                {mode.name}
                              </h3>
                              <div className="flex gap-2">
                                <Badge 
                                  variant="outline"
                                  className="text-xs"
                                  style={{ 
                                    borderColor: getDifficultyColor(mode.difficulty),
                                    color: getDifficultyColor(mode.difficulty)
                                  }}
                                >
                                  {mode.difficulty.toUpperCase()}
                                </Badge>
                                <Badge 
                                  variant="outline"
                                  className="text-xs gap-1"
                                  style={{ 
                                    borderColor: mode.theme.accentColor,
                                    color: mode.theme.accentColor
                                  }}
                                >
                                  <Trophy size={12} weight="fill" />
                                  {mode.rewardMultiplier}x Rewards
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {mode.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-sm" style={{ color: mode.theme.accentColor }}>
                            <Clock size={16} weight="fill" />
                            <span className="font-semibold">
                              {formatGameModeTimeRemaining(mode.endDate)}
                            </span>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePlayMode(mode)
                            }}
                            className="gap-2"
                            style={{
                              background: `linear-gradient(135deg, ${mode.theme.primaryColor} 0%, ${mode.theme.accentColor} 100%)`,
                              color: 'white'
                            }}
                          >
                            <Sparkle size={16} weight="fill" />
                            Play Now
                          </Button>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex flex-wrap gap-2">
                            {mode.mechanics.specialTargets.slice(0, 3).map((target) => (
                              <div 
                                key={target.id}
                                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                                style={{
                                  background: mode.theme.primaryColor + '20',
                                  color: mode.theme.primaryColor
                                }}
                              >
                                <span>{target.icon}</span>
                                <span className="font-medium">{target.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingGameModes.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <CalendarBlank size={64} weight="duotone" className="text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground">New game modes will be announced soon!</p>
                </div>
              </div>
            </Card>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingGameModes.map((mode) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card 
                      className="p-6 border-2 transition-all duration-300 relative overflow-hidden opacity-80"
                      style={{
                        borderColor: mode.theme.primaryColor + '50',
                        background: `linear-gradient(135deg, ${mode.theme.backgroundColor}80 0%, ${mode.theme.primaryColor}10 100%)`
                      }}
                    >
                      <div className="absolute top-4 right-4">
                        <Badge 
                          variant="secondary"
                          className="gap-1"
                          style={{
                            background: mode.theme.primaryColor + '30',
                            color: mode.theme.primaryColor
                          }}
                        >
                          <Star size={12} weight="fill" />
                          Coming Soon
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="text-4xl p-3 rounded-xl"
                          style={{
                            background: mode.theme.primaryColor + '15',
                          }}
                        >
                          {mode.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {mode.name}
                          </h3>
                          <Badge 
                            variant="outline"
                            className="text-xs"
                            style={{ 
                              borderColor: getDifficultyColor(mode.difficulty),
                              color: getDifficultyColor(mode.difficulty)
                            }}
                          >
                            {mode.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">
                        {mode.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm pt-4 border-t border-border">
                        <CalendarBlank size={16} weight="fill" className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Starts {new Date(mode.startDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {selectedMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMode(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card 
              className="max-w-2xl w-full p-8 border-2"
              style={{
                borderColor: selectedMode.theme.primaryColor,
                background: `linear-gradient(135deg, ${selectedMode.theme.backgroundColor} 0%, ${selectedMode.theme.primaryColor}20 100%)`
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="text-5xl p-4 rounded-2xl"
                    style={{
                      background: selectedMode.theme.primaryColor + '30',
                      boxShadow: `0 0 30px ${selectedMode.theme.primaryColor}50`
                    }}
                  >
                    {selectedMode.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">
                      {selectedMode.name}
                    </h2>
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: getDifficultyColor(selectedMode.difficulty),
                          color: getDifficultyColor(selectedMode.difficulty)
                        }}
                      >
                        {selectedMode.difficulty.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="gap-1"
                        style={{ 
                          borderColor: selectedMode.theme.accentColor,
                          color: selectedMode.theme.accentColor
                        }}
                      >
                        <Trophy size={14} weight="fill" />
                        {selectedMode.rewardMultiplier}x Rewards
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMode(null)}
                >
                  <Info size={24} />
                </Button>
              </div>

              <p className="text-foreground mb-6">
                {selectedMode.description}
              </p>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Sparkle size={16} weight="fill" style={{ color: selectedMode.theme.primaryColor }} />
                    Special Targets
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedMode.mechanics.specialTargets.map((target) => (
                      <div 
                        key={target.id}
                        className="p-3 rounded-lg border"
                        style={{
                          background: selectedMode.theme.primaryColor + '10',
                          borderColor: selectedMode.theme.primaryColor + '30'
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{target.icon}</span>
                          <span className="font-semibold text-foreground text-sm">{target.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{target.appearance}</p>
                        <Badge 
                          variant="secondary" 
                          className="mt-2 text-xs"
                          style={{
                            background: selectedMode.theme.accentColor + '20',
                            color: selectedMode.theme.accentColor
                          }}
                        >
                          {target.scoreMultiplier}x points
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedMode.mechanics.powerUps.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Fire size={16} weight="fill" style={{ color: selectedMode.theme.accentColor }} />
                      Power-Ups
                    </h4>
                    <div className="space-y-2">
                      {selectedMode.mechanics.powerUps.map((powerUp) => (
                        <div 
                          key={powerUp.id}
                          className="p-3 rounded-lg border flex items-center gap-3"
                          style={{
                            background: selectedMode.theme.accentColor + '10',
                            borderColor: selectedMode.theme.accentColor + '30'
                          }}
                        >
                          <span className="text-2xl">{powerUp.icon}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground text-sm">{powerUp.name}</p>
                            <p className="text-xs text-muted-foreground">{powerUp.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-2" style={{ color: selectedMode.theme.accentColor }}>
                  <Clock size={20} weight="fill" />
                  <span className="font-semibold">
                    {formatGameModeTimeRemaining(selectedMode.endDate)}
                  </span>
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    handlePlayMode(selectedMode)
                    setSelectedMode(null)
                  }}
                  className="gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${selectedMode.theme.primaryColor} 0%, ${selectedMode.theme.accentColor} 100%)`,
                    color: 'white'
                  }}
                >
                  <Sparkle size={20} weight="fill" />
                  Play Mode
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
