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
import {
  PlayerChallengeData,
  generateDailyChallenges,
  generateWeeklyChallenges,
  checkChallengeProgress,
  isChallengeComplete,
  shouldRefreshChallenges,
  calculateLevel,
  Challenge
} from '@/lib/challenges'

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
  
  const [challengeData, setChallengeData] = useKV<PlayerChallengeData>('challenge-data', {
    activeChallenges: [],
    progress: {},
    completedChallenges: [],
    earnedBadges: [],
    lastDailyRefresh: 0,
    lastWeeklyRefresh: 0,
    currentXP: 0,
    level: 1,
    unlockedTitles: [],
    activeTitle: undefined
  })

  useEffect(() => {
    if (soundTheme) soundSystem.setTheme(soundTheme)
    if (soundEnabled !== undefined) soundSystem.setEnabled(soundEnabled)
  }, [soundTheme, soundEnabled])

  useEffect(() => {
    if (!challengeData) return
    
    const { refreshDaily, refreshWeekly } = shouldRefreshChallenges(challengeData)
    
    if (refreshDaily || refreshWeekly || challengeData.activeChallenges.length === 0) {
      setChallengeData(current => {
        if (!current) {
          return {
            activeChallenges: [...generateDailyChallenges(), ...generateWeeklyChallenges()],
            progress: {},
            completedChallenges: [],
            earnedBadges: [],
            lastDailyRefresh: Date.now(),
            lastWeeklyRefresh: Date.now(),
            currentXP: 0,
            level: 1,
            unlockedTitles: [],
            activeTitle: undefined
          }
        }
        const now = Date.now()
        const updated: PlayerChallengeData = { ...current }
        
        if (refreshDaily || !current.activeChallenges.some(c => c.type === 'daily')) {
          const dailyChallenges = generateDailyChallenges()
          updated.activeChallenges = [
            ...updated.activeChallenges.filter(c => c.type !== 'daily'),
            ...dailyChallenges
          ]
          updated.lastDailyRefresh = now
        }
        
        if (refreshWeekly || !current.activeChallenges.some(c => c.type === 'weekly')) {
          const weeklyChallenges = generateWeeklyChallenges()
          updated.activeChallenges = [
            ...updated.activeChallenges.filter(c => c.type !== 'weekly'),
            ...weeklyChallenges
          ]
          updated.lastWeeklyRefresh = now
        }
        
        return updated
      })
    }
  }, [challengeData, setChallengeData])

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
    
    if (!isPracticeMode && challengeData) {
      setChallengeData(current => {
        const defaultData: PlayerChallengeData = {
          activeChallenges: [],
          progress: {},
          completedChallenges: [],
          earnedBadges: [],
          lastDailyRefresh: 0,
          lastWeeklyRefresh: 0,
          currentXP: 0,
          level: 1,
          unlockedTitles: [],
          activeTitle: undefined
        }
        const data = current || defaultData
        const updated: PlayerChallengeData = { ...data, progress: { ...data.progress } }
        
        const gameData = {
          score,
          targetsHit,
          targetsMissed,
          combo: currentCombo,
          difficulty: currentDifficulty,
          perfectRounds: isPerfectRound ? 1 : 0
        }
        
        data.activeChallenges.forEach(challenge => {
          const currentProgress = data.progress[challenge.id]?.progress || 0
          const newProgress = checkChallengeProgress(challenge, currentProgress, gameData)
          
          const isComplete = isChallengeComplete(challenge, newProgress)
          const wasComplete = data.progress[challenge.id]?.completed || false
          
          updated.progress[challenge.id] = {
            challengeId: challenge.id,
            progress: newProgress,
            completed: isComplete,
            completedAt: isComplete && !wasComplete ? Date.now() : data.progress[challenge.id]?.completedAt,
            claimedReward: data.progress[challenge.id]?.claimedReward || false
          }
          
          if (isComplete && !wasComplete) {
            toast.success(`Challenge Complete: ${challenge.name}!`, {
              description: 'Check the Challenges tab to claim your reward'
            })
          }
        })
        
        return updated
      })
    }
    
    setPhase('gameOver')
  }

  const handleClaimChallengeReward = (challengeId: string) => {
    setChallengeData(current => {
      const defaultData: PlayerChallengeData = {
        activeChallenges: [],
        progress: {},
        completedChallenges: [],
        earnedBadges: [],
        lastDailyRefresh: 0,
        lastWeeklyRefresh: 0,
        currentXP: 0,
        level: 1,
        unlockedTitles: [],
        activeTitle: undefined
      }
      const data = current || defaultData
      
      const challenge = data.activeChallenges.find(c => c.id === challengeId)
      if (!challenge || data.progress[challengeId]?.claimedReward) return data
      
      const updated: PlayerChallengeData = {
        ...data,
        progress: {
          ...data.progress,
          [challengeId]: {
            ...data.progress[challengeId],
            claimedReward: true
          }
        },
        currentXP: data.currentXP + challenge.reward.xp,
        completedChallenges: [...data.completedChallenges, challengeId]
      }
      
      updated.level = calculateLevel(updated.currentXP)
      
      if (challenge.reward.badge) {
        updated.earnedBadges = [...updated.earnedBadges, challenge.reward.badge]
        toast.success(`Badge Earned: ${challenge.reward.badge.name}!`, {
          description: challenge.reward.badge.description
        })
      }
      
      if (challenge.reward.title && !updated.unlockedTitles.includes(challenge.reward.title)) {
        updated.unlockedTitles = [...updated.unlockedTitles, challenge.reward.title]
        toast.success(`Title Unlocked: ${challenge.reward.title}!`, {
          description: 'Check your profile to equip it'
        })
      }
      
      toast.success(`+${challenge.reward.xp} XP`, {
        description: `Level ${updated.level}`
      })
      
      return updated
    })
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
          challengeData={challengeData || {
            activeChallenges: [],
            progress: {},
            completedChallenges: [],
            earnedBadges: [],
            lastDailyRefresh: 0,
            lastWeeklyRefresh: 0,
            currentXP: 0,
            level: 1,
            unlockedTitles: [],
            activeTitle: undefined
          }}
          onClaimChallengeReward={handleClaimChallengeReward}
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