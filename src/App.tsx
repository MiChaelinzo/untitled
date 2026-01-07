import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Menu } from '@/components/Menu'
import { GameArena } from '@/components/GameArena'
import { GameOver } from '@/components/GameOver'
import { LeaderboardEntry } from '@/lib/game-types'
import { soundSystem, SoundTheme } from '@/lib/sound-system'

type AppPhase = 'menu' | 'playing' | 'gameOver'

function App() {
  const [phase, setPhase] = useState<AppPhase>('menu')
  const [leaderboard, setLeaderboard] = useKV<LeaderboardEntry[]>('leaderboard', [])
  const [soundTheme] = useKV<SoundTheme>('sound-theme', 'sci-fi')
  const [soundEnabled] = useKV<boolean>('sound-enabled', true)
  const [finalScore, setFinalScore] = useState(0)
  const [finalRound, setFinalRound] = useState(0)
  const [finalTargetsHit, setFinalTargetsHit] = useState(0)
  const [finalTargetsMissed, setFinalTargetsMissed] = useState(0)

  useEffect(() => {
    if (soundTheme) soundSystem.setTheme(soundTheme)
    if (soundEnabled !== undefined) soundSystem.setEnabled(soundEnabled)
  }, [soundTheme, soundEnabled])

  const handleStartGame = () => {
    setPhase('playing')
  }

  const handleGameOver = (score: number, round: number, targetsHit: number, targetsMissed: number) => {
    setFinalScore(score)
    setFinalRound(round)
    setFinalTargetsHit(targetsHit)
    setFinalTargetsMissed(targetsMissed)
    setPhase('gameOver')
  }

  const handleSubmitScore = (name: string, email: string) => {
    const newEntry: LeaderboardEntry = {
      name: name.trim(),
      score: finalScore,
      timestamp: Date.now(),
      rounds: finalRound
    }

    setLeaderboard(current => {
      const currentLeaderboard = current || []
      const updated = [...currentLeaderboard, newEntry].sort((a, b) => b.score - a.score)
      return updated
    })

    toast.success('Score saved to leaderboard!', {
      description: `You scored ${finalScore.toLocaleString()} points!`
    })
  }

  const handlePlayAgain = () => {
    setPhase('menu')
    setFinalScore(0)
    setFinalRound(0)
    setFinalTargetsHit(0)
    setFinalTargetsMissed(0)
  }

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      
      {phase === 'menu' && (
        <Menu onStartGame={handleStartGame} leaderboard={leaderboard || []} />
      )}
      
      {phase === 'playing' && (
        <GameArena onGameOver={handleGameOver} />
      )}
      
      {phase === 'gameOver' && (
        <GameOver
          score={finalScore}
          round={finalRound}
          targetsHit={finalTargetsHit}
          targetsMissed={finalTargetsMissed}
          leaderboard={leaderboard || []}
          onPlayAgain={handlePlayAgain}
          onSubmitScore={handleSubmitScore}
        />
      )}
    </>
  )
}

export default App