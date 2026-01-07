import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Target } from '@/components/Target'
import { GameHUD } from '@/components/GameHUD'
import { RoundTransition } from '@/components/RoundTransition'
import { HitFeedback, HitParticles } from '@/components/HitEffects'
import { GameState, ROUND_CONFIG, Target as TargetType } from '@/lib/game-types'
import { generateRandomTarget, calculateScore } from '@/lib/game-utils'

interface GameArenaProps {
  onGameOver: (score: number, round: number, targetsHit: number, targetsMissed: number) => void
}

interface Effect {
  id: string
  type: 'feedback' | 'particles'
  x: number
  y: number
  score?: number
}

export function GameArena({ onGameOver }: GameArenaProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gameState, setGameState] = useState<GameState>({
    phase: 'roundTransition',
    round: 1,
    score: 0,
    combo: 0,
    targetsHit: 0,
    targetsMissed: 0,
    currentTarget: null,
    roundTargetsRemaining: ROUND_CONFIG[1].targets
  })
  const [effects, setEffects] = useState<Effect[]>([])

  const spawnTarget = useCallback(() => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const config = ROUND_CONFIG[gameState.round as keyof typeof ROUND_CONFIG]
    const target = generateRandomTarget(rect.width, rect.height, config.duration, 80)

    setGameState(prev => ({
      ...prev,
      currentTarget: target
    }))
  }, [gameState.round])

  const handleHit = useCallback((reactionTime: number) => {
    const config = ROUND_CONFIG[gameState.round as keyof typeof ROUND_CONFIG]
    const points = calculateScore(reactionTime, config.duration, gameState.combo)

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
            roundTargetsRemaining: ROUND_CONFIG[(prev.round + 1) as keyof typeof ROUND_CONFIG].targets
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
  }, [gameState.currentTarget, gameState.combo, gameState.round, onGameOver])

  const handleMiss = useCallback(() => {
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
            roundTargetsRemaining: ROUND_CONFIG[(prev.round + 1) as keyof typeof ROUND_CONFIG].targets
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
  }, [onGameOver])

  const handleStartRound = useCallback(() => {
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

  const removeEffect = useCallback((id: string) => {
    setEffects(prev => prev.filter(e => e.id !== id))
  }, [])

  const config = ROUND_CONFIG[gameState.round as keyof typeof ROUND_CONFIG]

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-background overflow-hidden">
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
                size={80}
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
    </div>
  )
}
