import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Target } from '@/components/Target'
import { GameHUD } from '@/components/GameHUD'
import { RoundTransition } from '@/components/RoundTransition'
import { HitFeedback } from '@/components/HitEffects'
import { TargetParticles } from '@/components/TargetParticles'
import { EventChallengeProgress } from '@/components/EventChallengeProgress'
import { EventModeEffects } from '@/components/EventModeEffects'
import { GameState, DIFFICULTY_CONFIG, Target as TargetType, Difficulty } from '@/lib/game-types'
import { generateRandomTarget, calculateScore } from '@/lib/game-utils'
import { soundSystem } from '@/lib/sound-system'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, TrendUp, TrendDown, Equals } from '@phosphor-icons/react'
import { TargetSkin } from '@/lib/target-skins'
import { useKV } from '@github/spark/hooks'
import { AdaptiveDifficultySystem } from '@/lib/adaptive-difficulty'
import { toast } from 'sonner'
import { getActiveEvents, SEASONAL_EVENTS, PlayerEventProgress } from '@/lib/seasonal-events'
import { EventGameMode, getGameModeById, EventGameModeId, EventTarget } from '@/lib/event-game-modes'
import { 
  PhysicsTarget, 
  createPhysicsTarget, 
  updatePhysicsTarget, 
  OCEAN_PHYSICS_CONFIG, 
  COSMIC_PHYSICS_CONFIG,
  applyImpulse
} from '@/lib/target-physics'

interface GameArenaProps {
  onGameOver: (score: number, round: number, targetsHit: number, targetsMissed: number) => void
  difficulty: Difficulty
  onComboUpdate?: (combo: number) => void
  isPractice?: boolean
  useAdaptiveDifficulty?: boolean
  eventGameModeId?: EventGameModeId
}

interface Effect {
  id: string
  type: 'feedback' | 'particles'
  x: number
  y: number
  score?: number
}

export function GameArena({ onGameOver, difficulty, onComboUpdate, isPractice = false, useAdaptiveDifficulty = false, eventGameModeId }: GameArenaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty]
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  const [targetSkin] = useKV<TargetSkin>('target-skin', 'default')
  const adaptiveSystemRef = useRef<AdaptiveDifficultySystem | null>(null)
  const [showAdaptiveIndicator, setShowAdaptiveIndicator] = useState(false)
  const [lastAdjustmentDirection, setLastAdjustmentDirection] = useState<'easier' | 'harder' | 'maintain'>('maintain')
  const [eventProgress] = useKV<Record<string, PlayerEventProgress>>('event-progress', {})
  
  const activeEvents = getActiveEvents(SEASONAL_EVENTS)
  const currentEvent = activeEvents.length > 0 ? activeEvents[0] : null
  const currentEventProgress = currentEvent ? eventProgress?.[currentEvent.id] : undefined
  
  const eventGameMode = eventGameModeId ? getGameModeById(eventGameModeId) : null
  const [eventModeState, setEventModeState] = useState<any>({
    speedStreak: 0,
    lastHitTime: 0,
    pairTargets: new Map(),
    frozenTargets: new Set(),
    visibilityStates: new Map()
  })
  
  const isPhysicsMode = eventGameModeId === 'ocean-wave' || eventGameModeId === 'cosmic-gravity'
  const [physicsTargets, setPhysicsTargets] = useState<PhysicsTarget[]>([])
  const physicsAnimationRef = useRef<number | null>(null)
  
  useEffect(() => {
    if (useAdaptiveDifficulty && !adaptiveSystemRef.current) {
      adaptiveSystemRef.current = new AdaptiveDifficultySystem(difficulty)
    }
  }, [useAdaptiveDifficulty, difficulty])
  
  const [gameState, setGameState] = useState<GameState>({
    phase: 'roundTransition',
    round: 1,
    score: 0,
    combo: 0,
    targetsHit: 0,
    targetsMissed: 0,
    currentTarget: null,
    roundTargetsRemaining: difficultyConfig.rounds[1].targets,
    difficulty
  })
  const [effects, setEffects] = useState<Effect[]>([])
  
  const [currentTargetDuration, setCurrentTargetDuration] = useState(difficultyConfig.rounds[1].duration)
  const [currentTargetSize, setCurrentTargetSize] = useState(difficultyConfig.rounds[1].targetSize)

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const config = difficultyConfig.rounds[gameState.round as keyof typeof difficultyConfig.rounds]
    
    let duration = config.duration
    let targetSize = config.targetSize
    
    if (useAdaptiveDifficulty && adaptiveSystemRef.current) {
      const adaptiveConfig = adaptiveSystemRef.current.getCurrentConfig()
      duration = adaptiveConfig.targetDuration
      targetSize = adaptiveConfig.targetSize
      setCurrentTargetDuration(duration)
      setCurrentTargetSize(targetSize)
    }

    if (eventGameMode) {
      eventGameMode.mechanics.forEach(mechanic => {
        if (mechanic.type === 'time-manipulation' && mechanic.config.speedMultiplier) {
          duration = duration / mechanic.config.speedMultiplier
        }
        
        if (mechanic.type === 'target-behavior') {
          if (mechanic.name === 'Freeze & Shatter') {
            setTimeout(() => {
              setEventModeState((prev: any) => {
                const frozen = new Set(prev.frozenTargets || [])
                frozen.add(gameState.currentTarget?.id)
                return { ...prev, frozenTargets: frozen }
              })
            }, mechanic.config.freezeTime)
          }
          
          if (mechanic.name === 'Phase Shift') {
            const { phaseInterval, visibleDuration } = mechanic.config
            let isVisible = true
            const intervalId = setInterval(() => {
              isVisible = !isVisible
              setEventModeState((prev: any) => {
                const states = new Map(prev.visibilityStates || new Map())
                states.set(gameState.currentTarget?.id, isVisible)
                return { ...prev, visibilityStates: states }
              })
            }, isVisible ? visibleDuration : phaseInterval - visibleDuration)
            
            setTimeout(() => clearInterval(intervalId), duration)
          }
        }
      })
    }
    
    const target = generateRandomTarget(rect.width, rect.height, duration, targetSize)

    if (isPhysicsMode && (eventGameModeId === 'ocean-wave' || eventGameModeId === 'cosmic-gravity')) {
      const eventTarget: EventTarget = {
        ...target,
        type: 'normal',
        velocity: { x: 0, y: 0 }
      }
      
      const physicsType = eventGameModeId === 'ocean-wave' ? 'ocean' : 'cosmic'
      const config = physicsType === 'ocean' ? OCEAN_PHYSICS_CONFIG : COSMIC_PHYSICS_CONFIG
      const physicsTarget = createPhysicsTarget(eventTarget, config, physicsType)
      
      setPhysicsTargets([physicsTarget])
    } else {
      setGameState(prev => ({
        ...prev,
        currentTarget: target
      }))
    }
  }, [gameState.round, difficultyConfig, useAdaptiveDifficulty, eventGameMode, gameState.currentTarget, isPhysicsMode, eventGameModeId])

  const handleHit = useCallback(async (reactionTime: number) => {
    const config = difficultyConfig.rounds[gameState.round as keyof typeof difficultyConfig.rounds]
    let points = calculateScore(reactionTime, config.duration, gameState.combo, difficultyConfig.scoreMultiplier)

    if (eventGameMode) {
      let eventMultiplier = eventGameMode.scoreModifier

      eventGameMode.mechanics.forEach(mechanic => {
        if (mechanic.type === 'time-manipulation' && mechanic.name === 'Speed Bonus') {
          const { baseTimeWindow, bonusPerMs, maxBonus } = mechanic.config
          if (reactionTime < baseTimeWindow) {
            const bonus = Math.min((baseTimeWindow - reactionTime) / 100 * bonusPerMs, maxBonus)
            eventMultiplier *= (1 + bonus)
            toast.success(`⚡ Speed Bonus! ${bonus.toFixed(1)}x`, { duration: 1000 })
          }
        }

        if (mechanic.type === 'scoring' && mechanic.name === 'Velocity Streak') {
          const { fastThreshold, streakBonus, maxStreak } = mechanic.config
          const now = Date.now()
          if (reactionTime < fastThreshold && now - eventModeState.lastHitTime < 1000) {
            const newStreak = Math.min((eventModeState.speedStreak || 0) + 1, maxStreak)
            setEventModeState((prev: any) => ({ ...prev, speedStreak: newStreak, lastHitTime: now }))
            eventMultiplier *= (1 + newStreak * streakBonus)
            if (newStreak > 2) {
              toast.success(`🔥 Velocity Streak ${newStreak}x!`, { duration: 1500 })
            }
          } else {
            setEventModeState((prev: any) => ({ ...prev, speedStreak: 0, lastHitTime: now }))
          }
        }

        if (mechanic.type === 'scoring' && mechanic.name === 'Lucky Numbers') {
          const { luckyEnding, bonusMultiplier } = mechanic.config
          const scoreEnding = points % 1000
          if (luckyEnding.some((num: number) => scoreEnding === num || scoreEnding % 10 === num % 10)) {
            eventMultiplier *= bonusMultiplier
            toast.success(`🎆 Lucky Number! ${bonusMultiplier}x`, { duration: 2000 })
          }
        }

        if (mechanic.type === 'target-behavior' && mechanic.name === 'Freeze & Shatter') {
          const { freezeBonus } = mechanic.config
          if (eventModeState.frozenTargets?.has(gameState.currentTarget?.id)) {
            eventMultiplier *= freezeBonus
            toast.success(`❄️ Frozen Shatter! ${freezeBonus}x`, { duration: 1500 })
          }
        }

        if (mechanic.type === 'target-behavior' && mechanic.name === 'Pulse Beat') {
          const { beatBonus } = mechanic.config
          const targetAge = Date.now() - (gameState.currentTarget?.spawnTime || 0)
          const pulsePhase = targetAge % mechanic.config.pulseInterval
          if (pulsePhase < mechanic.config.beatWindow || pulsePhase > mechanic.config.pulseInterval - mechanic.config.beatWindow) {
            eventMultiplier *= beatBonus
            toast.success(`🎵 Perfect Beat! ${beatBonus}x`, { duration: 1500 })
          }
        }

        if (mechanic.type === 'scoring' && mechanic.name === 'Gentle Touch') {
          const { gentleBonus } = mechanic.config
          if (reactionTime < 500) {
            eventMultiplier *= gentleBonus
          }
        }
      })

      points = Math.round(points * eventMultiplier)
    }

    if (useAdaptiveDifficulty && adaptiveSystemRef.current) {
      adaptiveSystemRef.current.recordHit(reactionTime)
      
      const adjustment = await adaptiveSystemRef.current.analyzePerformance()
      if (adjustment.shouldAdjust) {
        setLastAdjustmentDirection(adjustment.direction)
        setShowAdaptiveIndicator(true)
        
        const icon = adjustment.direction === 'harder' ? '📈' : adjustment.direction === 'easier' ? '📉' : '➡️'
        toast.info(`${icon} AI Difficulty Adjusted`, {
          description: adjustment.reason,
          duration: 3000
        })
        
        setTimeout(() => setShowAdaptiveIndicator(false), 3000)
      }
    }

    soundSystem.play('hit', gameState.combo)
    
    if (gameState.combo > 0 && gameState.combo % 3 === 0) {
      soundSystem.play('combo', gameState.combo)
    }

    if (gameState.currentTarget && containerRef.current) {
      const target = gameState.currentTarget
      const effectId = `effect-${Date.now()}`
      
      setEffects(prev => [
        ...prev,
        {
          id: `${effectId}-feedback`,
          type: 'feedback',
          x: target.x,
          y: target.y,
          score: points
        },
        {
          id: `${effectId}-particles`,
          type: 'particles',
          x: target.x,
          y: target.y
        }
      ])
      
      if (isPhysicsMode && eventGameModeId === 'cosmic-gravity') {
        setPhysicsTargets(targets => 
          targets.map(t => 
            applyImpulse(t, { x: 3, y: 3 }, { x: target.x, y: target.y })
          )
        )
      }
    }

    if (isPhysicsMode) {
      setPhysicsTargets([])
    }

    setGameState(prev => {
      const newTargetsRemaining = prev.roundTargetsRemaining - 1
      const newCombo = prev.combo + 1
      const newScore = prev.score + points

      if (onComboUpdate) {
        onComboUpdate(newCombo)
      }

      if (newTargetsRemaining === 0) {
        if (prev.round === 3) {
          setTimeout(() => {
            onGameOver(newScore, prev.round, prev.targetsHit + 1, prev.targetsMissed)
          }, 500)
          return {
            ...prev,
            phase: 'gameOver',
            score: newScore,
            combo: newCombo,
            targetsHit: prev.targetsHit + 1,
            currentTarget: null,
            roundTargetsRemaining: 0
          }
        } else {
          return {
            ...prev,
            phase: 'roundTransition',
            round: prev.round + 1,
            score: newScore,
            combo: newCombo,
            targetsHit: prev.targetsHit + 1,
            currentTarget: null,
            roundTargetsRemaining: difficultyConfig.rounds[(prev.round + 1) as keyof typeof difficultyConfig.rounds].targets
          }
        }
      }

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        targetsHit: prev.targetsHit + 1,
        currentTarget: null,
        roundTargetsRemaining: newTargetsRemaining
      }
    })
  }, [gameState.currentTarget, gameState.combo, gameState.round, onGameOver, difficultyConfig, onComboUpdate, useAdaptiveDifficulty, eventGameMode, eventModeState, isPhysicsMode, eventGameModeId])

  const handleMiss = useCallback(async () => {
    if (useAdaptiveDifficulty && adaptiveSystemRef.current) {
      adaptiveSystemRef.current.recordMiss()
      
      const adjustment = await adaptiveSystemRef.current.analyzePerformance()
      if (adjustment.shouldAdjust) {
        setLastAdjustmentDirection(adjustment.direction)
        setShowAdaptiveIndicator(true)
        
        const icon = adjustment.direction === 'harder' ? '📈' : adjustment.direction === 'easier' ? '📉' : '➡️'
        toast.info(`${icon} AI Difficulty Adjusted`, {
          description: adjustment.reason,
          duration: 3000
        })
        
        setTimeout(() => setShowAdaptiveIndicator(false), 3000)
      }
    }
    
    soundSystem.play('miss')
    
    if (isPhysicsMode) {
      setPhysicsTargets([])
    }
    
    setGameState(prev => {
      const newTargetsRemaining = prev.roundTargetsRemaining - 1

      if (newTargetsRemaining === 0) {
        if (prev.round === 3) {
          setTimeout(() => {
            onGameOver(prev.score, prev.round, prev.targetsHit, prev.targetsMissed + 1)
          }, 500)
          return {
            ...prev,
            phase: 'gameOver',
            combo: 0,
            targetsMissed: prev.targetsMissed + 1,
            currentTarget: null,
            roundTargetsRemaining: 0
          }
        } else {
          return {
            ...prev,
            phase: 'roundTransition',
            round: prev.round + 1,
            combo: 0,
            targetsMissed: prev.targetsMissed + 1,
            currentTarget: null,
            roundTargetsRemaining: difficultyConfig.rounds[(prev.round + 1) as keyof typeof difficultyConfig.rounds].targets
          }
        }
      }

      return {
        ...prev,
        combo: 0,
        targetsMissed: prev.targetsMissed + 1,
        currentTarget: null,
        roundTargetsRemaining: newTargetsRemaining
      }
    })
  }, [onGameOver, difficultyConfig, useAdaptiveDifficulty, isPhysicsMode])

  const handleStartRound = useCallback(() => {
    soundSystem.play('roundStart')
    setGameState(prev => ({
      ...prev,
      phase: 'playing'
    }))
  }, [])

  useEffect(() => {
    if (gameState.phase === 'playing' && !gameState.currentTarget && physicsTargets.length === 0) {
      const timeout = setTimeout(() => {
        spawnTarget()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [gameState.phase, gameState.currentTarget, spawnTarget, physicsTargets.length])

  useEffect(() => {
    if (!isPhysicsMode || physicsTargets.length === 0 || gameState.phase !== 'playing') {
      return
    }

    let lastTime = Date.now()
    
    const updatePhysics = () => {
      const now = Date.now()
      const deltaTime = now - lastTime
      lastTime = now

      if (!containerRef.current) return

      const bounds = {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      }

      setPhysicsTargets(targets => {
        if (targets.length === 0) return targets

        const physicsType = eventGameModeId === 'ocean-wave' ? 'ocean' : 'cosmic'
        const config = physicsType === 'ocean' ? OCEAN_PHYSICS_CONFIG : COSMIC_PHYSICS_CONFIG

        return targets.map(target => 
          updatePhysicsTarget(target, config, bounds, deltaTime, physicsType)
        )
      })

      physicsAnimationRef.current = requestAnimationFrame(updatePhysics)
    }

    physicsAnimationRef.current = requestAnimationFrame(updatePhysics)

    return () => {
      if (physicsAnimationRef.current) {
        cancelAnimationFrame(physicsAnimationRef.current)
      }
    }
  }, [isPhysicsMode, physicsTargets.length, gameState.phase, eventGameModeId])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && gameState.phase === 'playing') {
        setShowQuitConfirm(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.phase])

  const handleQuit = () => {
    onGameOver(gameState.score, gameState.round, gameState.targetsHit, gameState.targetsMissed)
  }

  const removeEffect = useCallback((id: string) => {
    setEffects(prev => prev.filter(e => e.id !== id))
  }, [])

  const config = difficultyConfig.rounds[gameState.round as keyof typeof difficultyConfig.rounds]

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
      {eventGameMode && <EventModeEffects eventGameMode={eventGameMode} />}
      
      {isPractice && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-accent/20 border border-accent rounded-lg px-4 py-2">
          <span className="text-accent font-bold uppercase tracking-wider text-sm">Practice Mode</span>
        </div>
      )}
      
      {eventGameMode && (
        <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-accent/30 to-primary/30 border border-accent rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{eventGameMode.icon}</span>
            <div className="flex flex-col">
              <span className="text-accent font-bold uppercase tracking-wider text-xs">{eventGameMode.name}</span>
              <span className="text-primary text-xs">+{Math.round((eventGameMode.scoreModifier - 1) * 100)}% Bonus</span>
            </div>
          </div>
        </div>
      )}
      
      {useAdaptiveDifficulty && (
        <div className="absolute top-4 left-4 z-20 bg-primary/20 border border-primary rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold uppercase tracking-wider text-sm">AI Adaptive</span>
            {showAdaptiveIndicator && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {lastAdjustmentDirection === 'harder' && <TrendUp className="text-accent" weight="bold" size={18} />}
                {lastAdjustmentDirection === 'easier' && <TrendDown className="text-cyan" weight="bold" size={18} />}
                {lastAdjustmentDirection === 'maintain' && <Equals className="text-primary" weight="bold" size={18} />}
              </motion.div>
            )}
          </div>
        </div>
      )}

      {gameState.phase === 'playing' && (
        <>
          <GameHUD
            score={gameState.score}
            combo={gameState.combo}
            round={gameState.round}
            targetsRemaining={gameState.roundTargetsRemaining}
          />

          <AnimatePresence>
            {gameState.currentTarget && !isPhysicsMode && (
              <Target
                key={gameState.currentTarget.id}
                target={gameState.currentTarget}
                onHit={handleHit}
                onMiss={handleMiss}
                size={config.targetSize}
                skin={targetSkin || 'default'}
              />
            )}
            {isPhysicsMode && physicsTargets.map(physicsTarget => (
              <Target
                key={physicsTarget.id}
                target={physicsTarget}
                onHit={handleHit}
                onMiss={handleMiss}
                size={config.targetSize}
                skin={targetSkin || 'default'}
              />
            ))}
          </AnimatePresence>

          {effects.map(effect => (
            effect.type === 'feedback' && effect.score ? (
              <HitFeedback
                key={effect.id}
                score={effect.score}
                x={effect.x}
                y={effect.y}
                onComplete={() => removeEffect(effect.id)}
              />
            ) : effect.type === 'particles' ? (
              <TargetParticles
                key={effect.id}
                skin={targetSkin || 'default'}
                x={effect.x}
                y={effect.y}
                onComplete={() => removeEffect(effect.id)}
              />
            ) : null
          ))}
        </>
      )}

      {gameState.phase === 'roundTransition' && (
        <RoundTransition
          round={gameState.round}
          roundName={config.name}
          onContinue={handleStartRound}
        />
      )}

      {currentEvent && currentEventProgress && !isPractice && gameState.phase === 'playing' && (
        <EventChallengeProgress
          challenges={currentEvent.challenges}
          progress={currentEventProgress.challengeProgress || {}}
          completedChallenges={currentEventProgress.completedChallenges || []}
          isVisible={true}
        />
      )}

      {showQuitConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-30"
        >
          <Card className="p-6 bg-card border-border max-w-md mx-4">
            <div className="space-y-4">
              <div className="text-center">
                <X size={48} weight="fill" className="text-destructive mx-auto mb-2" />
                <h3 className="text-xl font-bold text-foreground mb-2">Quit Game?</h3>
                <p className="text-muted-foreground">
                  Your current progress will be saved, but you won't complete all rounds.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowQuitConfirm(false)}
                  className="flex-1"
                >
                  Continue Playing
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleQuit}
                  className="flex-1"
                >
                  Quit Game
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
