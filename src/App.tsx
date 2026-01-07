import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { Menu } from '@/components/Menu'
import { GameArena } from '@/components/GameArena'
import { GameOver } from '@/components/GameOver'
import { AchievementToast } from '@/components/AchievementToast'
import { LeaderboardEntry, Difficulty } from '@/lib/game-types'
import { soundSystem, SoundTheme } from '@/lib/sound-system'
import { PlayerStats, Achievement, checkNewAchievements } from '@/lib/achievements'

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
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium')
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [currentCombo, setCurrentCombo] = useState(0)
  
  const [stats, setStats] = useKV<PlayerStats>('player-stats', {
    totalGamesPlayed: 0,
    totalTargetsHit: 0,
    totalTargetsMissed: 0,
    highestScore: 0,
    highestCombo: 0,
    perfectRounds: 0,
    insaneModeCompleted: 0,
    totalPlayTime: 0
  })
  
  const [unlockedAchievements, setUnlockedAchievements] = useKV<string[]>('unlocked-achievements', [])
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([])

  useEffect(() => {
    if (soundTheme) soundSystem.setTheme(soundTheme)
    if (soundEnabled !== undefined) soundSystem.setEnabled(soundEnabled)
  }, [soundTheme, soundEnabled])

  const handleStartGame = (difficulty: Difficulty, isPractice: boolean = false) => {
    setCurrentDifficulty(difficulty)
    setIsPracticeMode(isPractice)
    setGameStartTime(Date.now())
    setCurrentCombo(0)
    setPhase('playing')
  }

  const handleGameOver = (score: number, round: number, targetsHit: number, targetsMissed: number) => {
    setFinalScore(score)
    setFinalRound(round)
    setFinalTargetsHit(targetsHit)
    setFinalTargetsMissed(targetsMissed)
    
    const gameTime = Date.now() - gameStartTime
    const isPerfectRound = targetsMissed === 0 && targetsHit > 0
    
    const previousStats = stats || {
      totalGamesPlayed: 0,
      totalTargetsHit: 0,
      totalTargetsMissed: 0,
      highestScore: 0,
      highestCombo: 0,
      perfectRounds: 0,
      insaneModeCompleted: 0,
      totalPlayTime: 0
    }
    
    const newStats: PlayerStats = {
      totalGamesPlayed: previousStats.totalGamesPlayed + 1,
      totalTargetsHit: previousStats.totalTargetsHit + targetsHit,
      totalTargetsMissed: previousStats.totalTargetsMissed + targetsMissed,
      highestScore: Math.max(previousStats.highestScore, score),
      highestCombo: Math.max(previousStats.highestCombo, currentCombo),
      perfectRounds: previousStats.perfectRounds + (isPerfectRound ? 1 : 0),
      insaneModeCompleted: previousStats.insaneModeCompleted + (currentDifficulty === 'insane' && round === 3 ? 1 : 0),
      totalPlayTime: previousStats.totalPlayTime + gameTime
    }
    
    setStats(newStats)
    
    const newAchievements = checkNewAchievements(previousStats, newStats, unlockedAchievements || [])
    if (newAchievements.length > 0) {
      setUnlockedAchievements(current => [...(current || []), ...newAchievements.map(a => a.id)])
      setAchievementQueue(newAchievements)
    }
    
    setPhase('gameOver')
  }

  const handleSubmitScore = (name: string, email: string) => {
    if (isPracticeMode) {
      toast.info('Practice scores are not saved to the leaderboard')
      return
    }

    const newEntry: LeaderboardEntry = {
      name: name.trim(),
      score: finalScore,
      timestamp: Date.now(),
      rounds: finalRound,
      difficulty: currentDifficulty || 'medium'
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
    setIsPracticeMode(false)
  }

  const removeAchievement = () => {
    setAchievementQueue(current => current.slice(1))
  }

  return (
    <>
      <Toaster theme="dark" position="top-center" />
      
      <AnimatePresence>
        {achievementQueue.length > 0 && (
          <AchievementToast
            achievement={achievementQueue[0]}
            onComplete={removeAchievement}
          />
        )}
      </AnimatePresence>
      
      {phase === 'menu' && (
        <Menu
          onStartGame={handleStartGame}
          leaderboard={leaderboard || []}
          stats={stats || {
            totalGamesPlayed: 0,
            totalTargetsHit: 0,
            totalTargetsMissed: 0,
            highestScore: 0,
            highestCombo: 0,
            perfectRounds: 0,
            insaneModeCompleted: 0,
            totalPlayTime: 0
          }}
          unlockedAchievements={unlockedAchievements || []}
        />
      )}
      
      {phase === 'playing' && (
        <GameArena
          onGameOver={handleGameOver}
          difficulty={currentDifficulty}
          onComboUpdate={setCurrentCombo}
          isPractice={isPracticeMode}
        />
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
          isPractice={isPracticeMode}
        />
      )}
    </>
  )
}

export default App