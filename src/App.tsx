import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { AnimatePresence } from 'framer-motion'
import { Menu } from '@/components/Menu'
import { GameArena } from '@/components/GameArena'
import { GameOver } from '@/components/GameOver'
import { AchievementToast } from '@/components/AchievementToast'
import { UnlockNotification } from '@/components/UnlockNotification'
import { EventNotificationBanner } from '@/components/EventNotificationBanner'
import { Login } from '@/components/Login'
import { DynamicBackground } from '@/components/DynamicBackground'
import { MouseTrail } from '@/components/MouseTrail'
import { LeaderboardEntry, Difficulty } from '@/lib/game-types'
import { soundSystem, SoundTheme } from '@/lib/sound-system'
import { PlayerStats, Achievement, checkNewAchievements } from '@/lib/achievements'
import { Challenge as ChallengeType } from '@/lib/friends-system'
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
import {
  ThemeUnlockable,
  PlayerUnlocks,
  getNewlyUnlocked,
  THEME_UNLOCKABLES
} from '@/lib/theme-rewards'
import {
  SeasonalEvent,
  PlayerEventProgress,
  getActiveEvents,
  checkEventChallengeProgress,
  SEASONAL_EVENTS
} from '@/lib/seasonal-events'

type AppPhase = 'login' | 'menu' | 'playing' | 'gameOver'

function App() {
  const [phase, setPhase] = useState<AppPhase>('login')
  const [leaderboard, setLeaderboard] = useKV<LeaderboardEntry[]>('leaderboard', [])
  const [soundTheme] = useKV<SoundTheme>('sound-theme', 'sci-fi')
  const [soundEnabled] = useKV<boolean>('sound-enabled', true)
  const [backgroundVariant] = useKV<'particles' | 'waves' | 'grid' | 'nebula' | 'matrix' | 'aurora' | 'constellation' | 'hexagon' | 'spirals' | 'binary-rain' | 'geometric'>('background-variant', 'particles')
  const [mouseTrailEnabled] = useKV<boolean>('mouse-trail-enabled', true)
  const [mouseTrailVariant] = useKV<'dots' | 'glow' | 'sparkle' | 'line'>('mouse-trail-variant', 'glow')
  const [isLoggedIn, setIsLoggedIn] = useKV<boolean>('is-logged-in', false)
  const [finalScore, setFinalScore] = useState(0)
  const [finalRound, setFinalRound] = useState(0)
  const [finalTargetsHit, setFinalTargetsHit] = useState(0)
  const [finalTargetsMissed, setFinalTargetsMissed] = useState(0)
  const [currentDifficulty, setCurrentDifficulty] = useState<Difficulty>('medium')
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [useAdaptiveDifficulty, setUseAdaptiveDifficulty] = useState(false)
  const [gameStartTime, setGameStartTime] = useState(0)
  const [currentCombo, setCurrentCombo] = useState(0)
  const [activeChallengeId, setActiveChallengeId] = useState<string | undefined>()
  const [challenges, setChallenges] = useKV<ChallengeType[]>('challenges', [])
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; avatarUrl?: string }>({
    id: `user_${Date.now()}`,
    username: 'Player',
    avatarUrl: undefined
  })
  
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
  const [unlockQueue, setUnlockQueue] = useState<ThemeUnlockable[]>([])
  
  const [playerUnlocks, setPlayerUnlocks] = useKV<PlayerUnlocks>('player-unlocks', {
    unlockedThemes: ['visual-cyberpunk'],
    unlockedBackgrounds: ['bg-particles'],
    unlockedSoundThemes: ['sound-sci-fi'],
    unlockedTargetSkins: ['skin-default'],
    unlockedMouseTrails: ['trail-dots'],
    unlockedProfileBadges: [],
    unlockedTitles: ['title-rookie'],
    equippedVisualTheme: 'visual-cyberpunk',
    equippedBackground: 'bg-particles',
    equippedSoundTheme: 'sound-sci-fi',
    equippedTargetSkin: 'skin-default',
    equippedMouseTrail: 'trail-dots',
    equippedTitle: 'title-rookie'
  })
  
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

  const [eventProgress, setEventProgress] = useKV<Record<string, PlayerEventProgress>>('event-progress', {})
  const [showEventBanner, setShowEventBanner] = useState(false)
  const [eventBannerDismissed, setEventBannerDismissed] = useKV<boolean>('event-banner-dismissed', false)

  useEffect(() => {
    if (soundTheme) soundSystem.setTheme(soundTheme)
    if (soundEnabled !== undefined) soundSystem.setEnabled(soundEnabled)
  }, [soundTheme, soundEnabled])

  useEffect(() => {
    const activeEvents = getActiveEvents(SEASONAL_EVENTS)
    if (activeEvents.length > 0 && !eventBannerDismissed && phase === 'menu') {
      setShowEventBanner(true)
    }
  }, [phase, eventBannerDismissed])

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await window.spark.user()
        if (user) {
          setCurrentUser({
            id: String(user.id),
            username: user.login || 'Player',
            avatarUrl: user.avatarUrl || undefined
          })
          setIsLoggedIn(true)
          setPhase('menu')
        }
      } catch (error) {
        console.error('Failed to load user:', error)
      }
    }
    loadUser()
  }, [])

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

  const handleLogin = (user: { id: string; username: string; email?: string; avatarUrl?: string }) => {
    setCurrentUser({
      id: user.id,
      username: user.username,
      avatarUrl: user.avatarUrl
    })
    setIsLoggedIn(true)
    setPhase('menu')
  }

  const handleSkipLogin = () => {
    setIsLoggedIn(false)
    setPhase('menu')
  }

  const handleStartGame = (difficulty: Difficulty, isPractice: boolean = false, challengeId?: string, useAdaptiveDifficulty?: boolean) => {
    setCurrentDifficulty(difficulty)
    setIsPracticeMode(isPractice)
    setActiveChallengeId(challengeId)
    setGameStartTime(Date.now())
    setCurrentCombo(0)
    setUseAdaptiveDifficulty(useAdaptiveDifficulty || false)
    setPhase('playing')
  }

  const handleGameOver = (score: number, round: number, targetsHit: number, targetsMissed: number) => {
    setFinalScore(score)
    setFinalRound(round)
    setFinalTargetsHit(targetsHit)
    setFinalTargetsMissed(targetsMissed)
    
    const gameTime = Date.now() - gameStartTime
    const isPerfectRound = targetsMissed === 0 && targetsHit > 0
    
    if (activeChallengeId) {
      setChallenges(current => {
        return (current || []).map(challenge => {
          if (challenge.id === activeChallengeId) {
            const isFromUser = challenge.fromUserId === currentUser.id
            const updatedChallenge = {
              ...challenge,
              status: 'completed' as const
            }
            
            if (isFromUser) {
              updatedChallenge.fromScore = score
              updatedChallenge.fromGameData = {
                score,
                targetsHit,
                targetsMissed,
                highestCombo: currentCombo,
                completedAt: Date.now()
              }
            } else {
              updatedChallenge.toScore = score
              updatedChallenge.toGameData = {
                score,
                targetsHit,
                targetsMissed,
                highestCombo: currentCombo,
                completedAt: Date.now()
              }
            }
            
            if (updatedChallenge.fromScore && updatedChallenge.toScore) {
              if (updatedChallenge.fromScore > updatedChallenge.toScore) {
                updatedChallenge.winner = updatedChallenge.fromUserId
              } else if (updatedChallenge.toScore > updatedChallenge.fromScore) {
                updatedChallenge.winner = updatedChallenge.toUserId
              } else {
                updatedChallenge.winner = 'tie'
              }
              
              const isWinner = updatedChallenge.winner === currentUser.id
              const isDraw = updatedChallenge.winner === 'tie'
              
              if (isWinner) {
                toast.success('Challenge Complete - You Won!', {
                  description: `You beat ${isFromUser ? updatedChallenge.toUsername : updatedChallenge.fromUsername}!`
                })
              } else if (isDraw) {
                toast.info('Challenge Complete - Draw!', {
                  description: 'You tied with your opponent!'
                })
              } else {
                toast.info('Challenge Complete', {
                  description: 'Better luck next time!'
                })
              }
            }
            
            return updatedChallenge
          }
          return challenge
        })
      })
      setActiveChallengeId(undefined)
    }
    
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

    const defaultUnlocks: PlayerUnlocks = {
      unlockedThemes: ['visual-cyberpunk'],
      unlockedBackgrounds: ['bg-particles'],
      unlockedSoundThemes: ['sound-sci-fi'],
      unlockedTargetSkins: ['skin-default'],
      unlockedMouseTrails: ['trail-dots'],
      unlockedProfileBadges: [],
      unlockedTitles: ['title-rookie']
    }

    const newlyUnlocked = getNewlyUnlocked(
      THEME_UNLOCKABLES,
      playerUnlocks || defaultUnlocks,
      newStats,
      unlockedAchievements || [],
      challengeData?.level || 1,
      challengeData?.currentXP || 0,
      challengeData
    )

    if (newlyUnlocked.length > 0) {
      setPlayerUnlocks(current => {
        const updated = { ...(current || defaultUnlocks) }
        newlyUnlocked.forEach(unlockable => {
          switch (unlockable.type) {
            case 'visual-theme':
              updated.unlockedThemes = [...updated.unlockedThemes, unlockable.id]
              break
            case 'background':
              updated.unlockedBackgrounds = [...updated.unlockedBackgrounds, unlockable.id]
              break
            case 'sound-theme':
              updated.unlockedSoundThemes = [...updated.unlockedSoundThemes, unlockable.id]
              break
            case 'target-skin':
              updated.unlockedTargetSkins = [...updated.unlockedTargetSkins, unlockable.id]
              break
            case 'mouse-trail':
              updated.unlockedMouseTrails = [...updated.unlockedMouseTrails, unlockable.id]
              break
            case 'profile-badge':
              updated.unlockedProfileBadges = [...updated.unlockedProfileBadges, unlockable.id]
              break
            case 'title':
              updated.unlockedTitles = [...updated.unlockedTitles, unlockable.id]
              break
          }
        })
        return updated
      })
      setUnlockQueue(newlyUnlocked)
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
    
    const activeEvents = getActiveEvents(SEASONAL_EVENTS)
    if (activeEvents.length > 0 && !isPracticeMode) {
      setEventProgress(current => {
        const updated = { ...(current || {}) }
        
        activeEvents.forEach(event => {
          const eventData = updated[event.id] || {
            eventId: event.id,
            completedChallenges: [],
            earnedRewards: [],
            eventScore: 0,
            lastUpdated: Date.now()
          }
          
          eventData.eventScore += score
          
          event.challenges.forEach(challenge => {
            if (!eventData.completedChallenges.includes(challenge.id)) {
              const gameData = {
                score,
                targetsHit,
                combo: currentCombo,
                difficulty: currentDifficulty,
                perfectRounds: isPerfectRound ? 1 : 0
              }
              
              const challengeKey = `${event.id}-${challenge.id}`
              const currentProgress = (current || {})[event.id]?.eventScore || 0
              
              const { progress, isComplete } = checkEventChallengeProgress(
                challenge,
                gameData,
                currentProgress
              )
              
              if (isComplete && !eventData.completedChallenges.includes(challenge.id)) {
                eventData.completedChallenges.push(challenge.id)
                toast.success(`🎉 Event Challenge Complete: ${challenge.name}!`, {
                  description: `Reward: ${challenge.reward.name}`,
                  duration: 5000
                })
              }
            }
          })
          
          eventData.lastUpdated = Date.now()
          updated[event.id] = eventData
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

  const removeUnlock = () => {
    setUnlockQueue(current => current.slice(1))
  }

  return (
    <>
      <DynamicBackground variant={backgroundVariant || 'particles'} />
      <MouseTrail 
        enabled={mouseTrailEnabled !== false} 
        variant={mouseTrailVariant || 'glow'} 
        color="primary" 
      />
      <Toaster theme="dark" position="top-center" />
      
      <AnimatePresence>
        {achievementQueue.length > 0 && (
          <AchievementToast
            achievement={achievementQueue[0]}
            onComplete={removeAchievement}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {unlockQueue.length > 0 && (
          <UnlockNotification
            unlockable={unlockQueue[0]}
            onComplete={removeUnlock}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEventBanner && phase === 'menu' && getActiveEvents(SEASONAL_EVENTS).length > 0 && (
          <EventNotificationBanner
            event={getActiveEvents(SEASONAL_EVENTS)[0]}
            onViewEvent={() => {
              setShowEventBanner(false)
              setEventBannerDismissed(true)
            }}
          />
        )}
      </AnimatePresence>
      
      {phase === 'login' && (
        <Login onLogin={handleLogin} onSkip={handleSkipLogin} />
      )}
      
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
          currentUserId={currentUser.id}
          currentUsername={currentUser.username}
          currentAvatarUrl={currentUser.avatarUrl}
        />
      )}
      
      {phase === 'playing' && (
        <GameArena
          onGameOver={handleGameOver}
          difficulty={currentDifficulty}
          onComboUpdate={setCurrentCombo}
          isPractice={isPracticeMode}
          useAdaptiveDifficulty={useAdaptiveDifficulty}
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
          difficulty={currentDifficulty}
        />
      )}
    </>
  )
}

export default App