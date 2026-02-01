import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, FastForward, Rewind, CaretLeft, ChartBar } from '@phosphor-icons/react'
import { GameReplay, ReplayPlaybackState, getEventAtTime, getReactionTimeHeatmap, formatReplayDuration } from '@/lib/replay-system'
import { DIFFICULTY_CONFIG } from '@/lib/game-types'

interface ReplayViewerProps {
  replay: GameReplay
  onClose: () => void
}

export function ReplayViewer({ replay, onClose }: ReplayViewerProps) {
  const [playbackState, setPlaybackState] = useState<ReplayPlaybackState>({
    currentTime: 0,
    isPlaying: false,
    playbackSpeed: 1,
    currentEventIndex: 0
  })
  
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number>(0)
  
  const heatmap = getReactionTimeHeatmap(replay)
  const maxTime = replay.duration

  useEffect(() => {
    if (!playbackState.isPlaying) return
    
    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp
      }
      
      const deltaTime = (timestamp - lastTimeRef.current) * playbackState.playbackSpeed
      lastTimeRef.current = timestamp
      
      setPlaybackState(prev => {
        const newTime = prev.currentTime + deltaTime
        
        if (newTime >= maxTime) {
          return { ...prev, currentTime: maxTime, isPlaying: false }
        }
        
        return { ...prev, currentTime: newTime }
      })
      
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      lastTimeRef.current = 0
    }
  }, [playbackState.isPlaying, playbackState.playbackSpeed, maxTime])

  const togglePlay = () => {
    setPlaybackState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))
  }
  
  const changeSpeed = () => {
    const speeds: Array<0.5 | 1 | 2> = [0.5, 1, 2]
    const currentIndex = speeds.indexOf(playbackState.playbackSpeed)
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]
    setPlaybackState(prev => ({ ...prev, playbackSpeed: nextSpeed }))
  }
  
  const skip = (seconds: number) => {
    setPlaybackState(prev => ({
      ...prev,
      currentTime: Math.max(0, Math.min(maxTime, prev.currentTime + seconds * 1000))
    }))
  }
  
  const currentEvent = getEventAtTime(replay, playbackState.currentTime)
  const progressPercentage = (playbackState.currentTime / maxTime) * 100

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="h-full p-4 md:p-6" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        gap: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <CaretLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold">{replay.username}'s Replay</h2>
            <p className="text-sm text-muted-foreground">
              {formatReplayDuration(replay.duration)} • {replay.finalScore.toLocaleString()} points
            </p>
          </div>
          
          <Badge variant="outline" className="text-sm">
            {DIFFICULTY_CONFIG[replay.difficulty].name}
          </Badge>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '1.5rem',
          height: '100%',
          overflow: 'hidden'
        }} className="max-md:grid-cols-1">
          <Card className="relative overflow-hidden flex items-center justify-center bg-card/50">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            </div>
            
            <AnimatePresence mode="wait">
              {currentEvent?.type === 'spawn' && (
                <motion.div
                  key={`target-${currentEvent.timestamp}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    position: 'absolute',
                    left: `${currentEvent.data.x}%`,
                    top: `${currentEvent.data.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="w-20 h-20 rounded-full border-4 border-primary bg-primary/20 glow-box"
                />
              )}
              
              {currentEvent?.type === 'hit' && (
                <motion.div
                  key={`hit-${currentEvent.timestamp}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 2, 0], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    left: `${currentEvent.data.x}%`,
                    top: `${currentEvent.data.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className="w-24 h-24 rounded-full border-4 border-accent bg-accent/30"
                />
              )}
            </AnimatePresence>
            
            {currentEvent?.type === 'combo' && currentEvent.data.combo && currentEvent.data.combo > 1 && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="text-4xl font-bold text-accent glow-text"
                >
                  {currentEvent.data.combo}x COMBO
                </motion.div>
              </div>
            )}
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <div className="text-6xl font-bold glow-text">
                {currentEvent?.data.score?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Score
              </div>
            </div>
          </Card>

          <div style={{
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
            gap: '1rem',
            overflow: 'auto'
          }}>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <ChartBar className="w-4 h-4" />
                Performance Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <div>
                  <div className="text-2xl font-bold text-primary">{replay.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{replay.maxCombo}x</div>
                  <div className="text-xs text-muted-foreground">Max Combo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan">{replay.averageReactionTime.toFixed(0)}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Reaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{replay.metadata.targetsHit}</div>
                  <div className="text-xs text-muted-foreground">Targets Hit</div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Reaction Time Distribution</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem'
              }}>
                <div className="text-center">
                  <div className="h-16 bg-green-500/20 rounded flex items-end justify-center" style={{ height: `${(heatmap.fast / (heatmap.fast + heatmap.medium + heatmap.slow)) * 100}px` }}>
                    <span className="text-xs font-bold text-green-400 mb-1">{heatmap.fast}</span>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Fast</div>
                  <div className="text-xs text-green-400">&lt;500ms</div>
                </div>
                <div className="text-center">
                  <div className="h-16 bg-yellow-500/20 rounded flex items-end justify-center" style={{ height: `${(heatmap.medium / (heatmap.fast + heatmap.medium + heatmap.slow)) * 100}px` }}>
                    <span className="text-xs font-bold text-yellow-400 mb-1">{heatmap.medium}</span>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Medium</div>
                  <div className="text-xs text-yellow-400">500-1000ms</div>
                </div>
                <div className="text-center">
                  <div className="h-16 bg-red-500/20 rounded flex items-end justify-center" style={{ height: `${(heatmap.slow / (heatmap.fast + heatmap.medium + heatmap.slow)) * 100}px` }}>
                    <span className="text-xs font-bold text-red-400 mb-1">{heatmap.slow}</span>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground">Slow</div>
                  <div className="text-xs text-red-400">&gt;1000ms</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 overflow-auto">
              <h3 className="text-sm font-semibold mb-3">Event Log</h3>
              <div className="space-y-2 text-xs">
                {replay.events.slice(0, 20).map((event, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono">{((event.timestamp - replay.events[0].timestamp) / 1000).toFixed(2)}s</span>
                    <span className="capitalize">{event.type.replace('_', ' ')}</span>
                    {event.data.reactionTime && (
                      <span className="text-primary">{event.data.reactionTime}ms</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-4">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: '1rem',
            alignItems: 'center'
          }}>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => skip(-5)}>
                <Rewind className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={togglePlay}>
                {playbackState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="outline" onClick={() => skip(5)}>
                <FastForward className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={changeSpeed}>
                {playbackState.playbackSpeed}x
              </Button>
            </div>

            <div className="relative">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <input
                type="range"
                min="0"
                max={maxTime}
                value={playbackState.currentTime}
                onChange={(e) => setPlaybackState(prev => ({ ...prev, currentTime: Number(e.target.value) }))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="text-sm text-muted-foreground font-mono">
              {formatReplayDuration(playbackState.currentTime)} / {formatReplayDuration(maxTime)}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
