import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Target } from '@/components/Target'
import { GameHUD } from '@/components/GameHUD'
import { RoundTransition } from '@/components/RoundTransition'
import { HitFeedback, HitParticles } from '@/components/HitEffects'
import { GameState, DIFFICULTY_CONFIG, Target as TargetType, Difficulty } from '@/lib/game-types'
import { generateRandomTarget, calculateScore } from '@/lib/game-utils'
import { soundSystem } from '@/lib/sound-system'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X } from '@phosphor-icons/react'

interface GameArenaProps {
  onGameOver: (score: number, round: number, targetsHit: number, targetsMissed: number) => void
  difficulty: Difficulty
  onComboUpdate?: (combo: number) => void
  isPractice?: boolean
}

interface Effect {
  id: string
  type: 'feedback' | 'particles'
  x: number
  y: number
  score?: number
}

export function GameArena({ onGameOver, difficulty, onComboUpdate, isPractice = false }: GameArenaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty]
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)
  
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

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const config = difficultyConfig.rounds[gameState.round as keyof typeof difficultyConfig.rounds]
    const target = generateRandomTarget(rect.width, rect.height, config.duration, config.targetSize)

    setGameState(prev => ({
      ...prev,
      currentTarget: target
    }))
  }, [gameState.round, difficultyConfig])

  const handleHit = useCallback((reactionTime: number) => {
    const config = difficultyConfig.rounds[gameState.round as keyof typeof difficultyConfig.rounds]
    const points = calculateScore(reactionTime, config.duration, gameState.combo, difficultyConfig.scoreMultiplier)

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
  }, [gameState.currentTarget, gameState.combo, gameState.round, onGameOver, difficultyConfig, onComboUpdate])

  const handleMiss = useCallback(() => {
    soundSystem.play('miss')
    
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
  }, [onGameOver, difficultyConfig])

  const handleStartRound = useCallback(() => {
    soundSystem.play('roundStart')
    setGameState(prev => ({
      ...prev,
      phase: 'playing'
    }))
  }, [])

  useEffect(() => {
    if (gameState.phase === 'playing' && !gameState.currentTarget) {
      const timeout = setTimeout(() => {
        spawnTarget()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [gameState.phase, gameState.currentTarget, spawnTarget])

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
      {isPractice && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 bg-accent/20 border border-accent rounded-lg px-4 py-2">
          <span className="text-accent font-bold uppercase tracking-wider text-sm">Practice Mode</span>
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
            {gameState.currentTarget && (
              <Target
                key={gameState.currentTarget.id}
                target={gameState.currentTarget}
                onHit={handleHit}
                onMiss={handleMiss}
                size={config.targetSize}
              />
            )}
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
              <HitParticles
                key={effect.id}
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
