import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Trophy, Lightning, SpeakerHigh, SpeakerSlash, Waveform, Fire, ChartBar, Medal, DownloadSimple, Target, Users, Palette, Crosshair, UsersThree, Calendar, Sparkle, Globe, Eye, Broadcast, VideoCamera, ShareNetwork } from '@phosphor-icons/react'
import { LeaderboardEntry, Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { soundSystem, SoundTheme } from '@/lib/sound-system'
import { useKV } from '@github/spark/hooks'
import { PlayerStats, ACHIEVEMENTS } from '@/lib/achievements'
import { StatsPanel } from '@/components/StatsPanel'
import { AchievementGrid } from '@/components/AchievementGrid'
import { ChallengesPanel } from '@/components/ChallengesPanel'
import { FriendsPanel } from '@/components/FriendsPanel'
import { FilteredLeaderboard } from '@/components/FilteredLeaderboard'
import { VisualThemeSelector } from '@/components/VisualThemeSelector'
import { TargetSkinSelector } from '@/components/TargetSkinSelector'
import { ThemedBackgroundSelector } from '@/components/ThemedBackgroundSelector'
import { TournamentPanel } from '@/components/TournamentPanel'
import { TeamTournamentPanel } from '@/components/TeamTournamentPanel'
import { RewardsVaultPanel } from '@/components/RewardsVaultPanel'
import { SeasonalEventsPanel } from '@/components/SeasonalEventsPanel'
import { SpecialGameModePanel } from '@/components/SpecialGameModePanel'
import { SpecialGameModeBanner } from '@/components/SpecialGameModeBanner'
import { GlobalStatsCard } from '@/components/GlobalStatsCard'
import { StreakTracker } from '@/components/StreakTracker'
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics'
import { QuickActionsMenu } from '@/components/QuickActionsMenu'
import { CustomDifficultyBuilder } from '@/components/CustomDifficultyBuilder'
import { GlobalLeaderboard } from '@/components/GlobalLeaderboard'
import { CommunityStatsWidget } from '@/components/CommunityStatsWidget'
import { CountrySelector } from '@/components/CountrySelector'
import { ComboBackgroundShowcase } from '@/components/ComboBackgroundShowcase'
import { ProChallengePanel } from '@/components/ProChallengePanel'
import { LiveEventLeaderboard, addLiveEventEntry, LiveEventConfig } from '@/components/LiveEventLeaderboard'
import { AccessibilitySettings } from '@/components/AccessibilitySettings'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { DashboardOverview } from '@/components/DashboardOverview'
import { ReplaysLibrary } from '@/components/ReplaysLibrary'
import { CommunityFeed } from '@/components/CommunityFeed'
import { getActiveGameModes, SPECIAL_GAME_MODES } from '@/lib/special-game-modes'
import { GlobalLeaderboardEntry } from '@/lib/global-leaderboard'
import { exportLeaderboardToCSV, exportLeaderboardToJSON } from '@/lib/export-utils'
import { VisualTheme, applyVisualTheme } from '@/lib/visual-themes'
import { TargetSkin } from '@/lib/target-skins'
import { DEFAULT_GLOBAL_STATS } from '@/lib/global-stats'
import { DEFAULT_STREAK } from '@/lib/streak-system'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { PlayerChallengeData } from '@/lib/challenges'

interface MenuProps {
  onStartGame: (difficulty: Difficulty, isPractice?: boolean, challengeId?: string, useAdaptiveDifficulty?: boolean, gameModeId?: string) => void
  leaderboard: LeaderboardEntry[]
  globalLeaderboard?: GlobalLeaderboardEntry[]
  stats: PlayerStats
  unlockedAchievements: string[]
  challengeData: PlayerChallengeData
  onClaimChallengeReward: (challengeId: string) => void
  currentUserId: string
  currentUsername: string
  currentAvatarUrl?: string
  globalStats?: any
  gameSessions?: any[]
  dailyStreak?: any
  customDifficulties?: any[]
  recentActions?: string[]
  onClaimStreakReward?: (rewardId: string) => void
  onAddRecentAction?: (actionId: string) => void
}

export function Menu({ 
  onStartGame, 
  leaderboard,
  globalLeaderboard,
  stats, 
  unlockedAchievements, 
  challengeData, 
  onClaimChallengeReward, 
  currentUserId, 
  currentUsername, 
  currentAvatarUrl,
  globalStats,
  gameSessions,
  dailyStreak,
  customDifficulties,
  recentActions,
  onClaimStreakReward,
  onAddRecentAction
}: MenuProps) {
  const [soundEnabled, setSoundEnabled] = useKV<boolean>('sound-enabled', true)
  const [soundTheme, setSoundTheme] = useKV<SoundTheme>('sound-theme', 'sci-fi')
  const [selectedDifficulty, setSelectedDifficulty] = useKV<Difficulty>('selected-difficulty', 'medium')
  const [visualTheme, setVisualTheme] = useKV<VisualTheme>('visual-theme', 'cyberpunk')
  const [targetSkin, setTargetSkin] = useKV<TargetSkin>('target-skin', 'default')
  const [useAdaptiveDifficulty, setUseAdaptiveDifficulty] = useKV<boolean>('use-adaptive-difficulty', false)
  const [backgroundVariant, setBackgroundVariant] = useKV<'particles' | 'waves' | 'grid' | 'nebula' | 'matrix' | 'aurora' | 'constellation' | 'hexagon' | 'spirals' | 'binary-rain' | 'geometric'>('background-variant', 'particles')
  const [mouseTrailEnabled, setMouseTrailEnabled] = useKV<boolean>('mouse-trail-enabled', true)
  const [mouseTrailVariant, setMouseTrailVariant] = useKV<'dots' | 'glow' | 'sparkle' | 'line'>('mouse-trail-variant', 'glow')
  const [gameplayParticleIntensity, setGameplayParticleIntensity] = useKV<'low' | 'medium' | 'high'>('gameplay-particle-intensity', 'medium')
  const [activeTab, setActiveTab] = useState('play')
  const [showSpecialModeBanner, setShowSpecialModeBanner] = useState(true)
  const [showGlobalLeaderboard, setShowGlobalLeaderboard] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useKV<boolean>('special-mode-banner-dismissed', false)
  
  const activeGameModes = getActiveGameModes(SPECIAL_GAME_MODES)

  useEffect(() => {
    if (visualTheme) {
      applyVisualTheme(visualTheme)
    }
  }, [visualTheme])

  const toggleSound = () => {
    setSoundEnabled(current => {
      const newValue = !current
      soundSystem.setEnabled(newValue)
      if (newValue) {
        soundSystem.play('hit', 0)
      }
      return newValue
    })
  }

  const handleThemeChange = (theme: SoundTheme) => {
    setSoundTheme(theme)
    soundSystem.setTheme(theme)
    if (soundEnabled) {
      soundSystem.play('hit', 0)
    }
  }

  const difficultyConfig = DIFFICULTY_CONFIG[selectedDifficulty || 'medium'] || DIFFICULTY_CONFIG.medium

  const handleExport = (format: 'csv' | 'json') => {
    if (leaderboard.length === 0) {
      toast.error('No leaderboard data to export')
      return
    }
    
    if (format === 'csv') {
      exportLeaderboardToCSV(leaderboard)
      toast.success('Leaderboard exported as CSV')
    } else {
      exportLeaderboardToJSON(leaderboard)
      toast.success('Leaderboard exported as JSON')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {activeGameModes.length > 0 && showSpecialModeBanner && !bannerDismissed && (
        <SpecialGameModeBanner
          mode={activeGameModes[0]}
          onPlayNow={() => {
            onStartGame(activeGameModes[0].difficulty, false, undefined, false, activeGameModes[0].id)
            setShowSpecialModeBanner(false)
          }}
          onDismiss={() => {
            setShowSpecialModeBanner(false)
            setBannerDismissed(true)
          }}
        />
      )}
      
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Select value={soundTheme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-40 bg-card/50 backdrop-blur border-primary/50">
            <Waveform size={20} className="mr-2 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
            <SelectItem value="retro">Retro Arcade</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="bg-card/50 backdrop-blur border-primary/50 hover:bg-card/70"
        >
          {soundEnabled ? (
            <SpeakerHigh size={24} className="text-primary" />
          ) : (
            <SpeakerSlash size={24} className="text-muted-foreground" />
          )}
        </Button>
      </div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl space-y-6 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <h1 className="text-6xl md:text-7xl font-black text-primary glow-text tracking-tight">
              C9 REFLEX
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-cyan glow-text tracking-tight">
              ARENA
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Test your pro-level reflexes. Hit glowing targets as fast as possible across 3 intense rounds.
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex min-w-full w-max bg-card/50 backdrop-blur">
              <TabsTrigger value="play" className="flex items-center gap-2">
                <Play size={16} weight="fill" />
                <span className="hidden sm:inline">Play</span>
              </TabsTrigger>
              <TabsTrigger value="pro-challenge" className="flex items-center gap-2 relative">
                <Trophy size={16} weight="fill" />
                <span className="hidden sm:inline">Pro Challenge</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan rounded-full animate-pulse" />
              </TabsTrigger>
              <TabsTrigger value="live-event" className="flex items-center gap-2">
                <Broadcast size={16} weight="fill" />
                <span className="hidden sm:inline">Live Event</span>
              </TabsTrigger>
              <TabsTrigger value="special-modes" className="flex items-center gap-2 relative">
                <Sparkle size={16} weight="fill" />
                <span className="hidden sm:inline">Special</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
              </TabsTrigger>
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users size={16} weight="fill" />
                <span className="hidden sm:inline">Friends</span>
              </TabsTrigger>
              <TabsTrigger value="tournament" className="flex items-center gap-2">
                <Trophy size={16} weight="fill" />
                <span className="hidden sm:inline">1v1</span>
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <UsersThree size={16} weight="fill" />
                <span className="hidden sm:inline">Teams</span>
              </TabsTrigger>
              <TabsTrigger value="events" className="flex items-center gap-2 relative">
                <Calendar size={16} weight="fill" />
                <span className="hidden sm:inline">Events</span>
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center gap-2">
                <Medal size={16} weight="fill" />
                <span className="hidden sm:inline">Leaders</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <ChartBar size={16} weight="fill" />
                <span className="hidden sm:inline">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Lightning size={16} weight="fill" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Medal size={16} weight="fill" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2 relative">
                <Target size={16} weight="fill" />
                <span className="hidden sm:inline">Challenges</span>
                {challengeData.activeChallenges.some(c => {
                  const progress = challengeData.progress[c.id]
                  return progress?.completed && !progress?.claimedReward
                }) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
                )}
              </TabsTrigger>
              <TabsTrigger value="customize" className="flex items-center gap-2">
                <Palette size={16} weight="fill" />
                <span className="hidden sm:inline">Customize</span>
              </TabsTrigger>
              <TabsTrigger value="accessibility" className="flex items-center gap-2">
                <Eye size={16} weight="fill" />
                <span className="hidden sm:inline">Accessibility</span>
              </TabsTrigger>
              <TabsTrigger value="replays" className="flex items-center gap-2">
                <VideoCamera size={16} weight="fill" />
                <span className="hidden sm:inline">Replays</span>
              </TabsTrigger>
              <TabsTrigger value="community" className="flex items-center gap-2">
                <ShareNetwork size={16} weight="fill" />
                <span className="hidden sm:inline">Community</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="play" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <div className="max-w-md mx-auto space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                    <Fire weight="fill" className="text-accent" size={20} />
                    Select Difficulty
                  </h3>
                </div>
                <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}>
                  <SelectTrigger className="bg-card/50 backdrop-blur border-primary/50 text-lg font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      <div className="flex flex-col items-start">
                        <span className="font-bold">Easy</span>
                        <span className="text-xs text-muted-foreground">Generous timing and larger targets</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex flex-col items-start">
                        <span className="font-bold">Medium</span>
                        <span className="text-xs text-muted-foreground">Balanced challenge for most players</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hard">
                      <div className="flex flex-col items-start">
                        <span className="font-bold">Hard</span>
                        <span className="text-xs text-muted-foreground">Fast reflexes required</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="insane">
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-accent">Insane</span>
                        <span className="text-xs text-muted-foreground">Pro-level reflexes only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Card className="p-4 bg-primary/10 border-primary/30">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="adaptive-difficulty"
                      checked={useAdaptiveDifficulty || false}
                      onChange={(e) => setUseAdaptiveDifficulty(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-primary/50 bg-card/50 checked:bg-primary cursor-pointer"
                    />
                    <label htmlFor="adaptive-difficulty" className="flex-1 cursor-pointer">
                      <div className="font-bold text-primary flex items-center gap-2">
                        <Lightning weight="fill" size={16} />
                        AI Adaptive Difficulty
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded">NEW</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        AI analyzes your performance and adjusts target speed & size in real-time for optimal challenge
                      </div>
                    </label>
                  </div>
                </Card>
                
                <div className="text-center text-sm text-muted-foreground">
                  Score multiplier: <span className="text-accent font-bold">{difficultyConfig?.scoreMultiplier || 1}x</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={() => onStartGame(selectedDifficulty || 'medium', false, undefined, useAdaptiveDifficulty || false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl px-12 py-8 glow-box group"
                >
                  <Play weight="fill" className="mr-3 group-hover:scale-110 transition-transform" size={32} />
                  Start Game
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onStartGame(selectedDifficulty || 'medium', true, undefined, useAdaptiveDifficulty || false)}
                  className="border-primary/50 hover:bg-primary/10 font-bold text-lg px-8 py-8"
                >
                  <Lightning weight="fill" className="mr-2" size={24} />
                  Practice
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
                <Lightning weight="fill" size={32} className="text-accent mx-auto" />
                <div className="font-bold text-foreground">Round 1: {difficultyConfig?.rounds?.[1]?.name || 'Warm Up'}</div>
                <div className="text-sm text-muted-foreground">
                  {difficultyConfig?.rounds?.[1]?.targets || 10} targets • {((difficultyConfig?.rounds?.[1]?.duration || 3000) / 1000).toFixed(1)}s each
                </div>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
                <Lightning weight="fill" size={32} className="text-primary mx-auto" />
                <div className="font-bold text-foreground">Round 2: {difficultyConfig?.rounds?.[2]?.name || 'Pro League'}</div>
                <div className="text-sm text-muted-foreground">
                  {difficultyConfig?.rounds?.[2]?.targets || 15} targets • {((difficultyConfig?.rounds?.[2]?.duration || 2000) / 1000).toFixed(1)}s each
                </div>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
                <Lightning weight="fill" size={32} className="text-cyan mx-auto" />
                <div className="font-bold text-foreground">Round 3: {difficultyConfig?.rounds?.[3]?.name || 'Championship'}</div>
                <div className="text-sm text-muted-foreground">
                  {difficultyConfig?.rounds?.[3]?.targets || 20} targets • {((difficultyConfig?.rounds?.[3]?.duration || 1500) / 1000).toFixed(1)}s each
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Medal weight="fill" size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Leaderboards</h3>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">🌍 Global Leaderboard</h3>
                    <p className="text-sm text-muted-foreground">
                      Compete with players worldwide. View rankings, regional stats, and trending players.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setShowGlobalLeaderboard(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    View Global
                  </Button>
                </div>
              </Card>

              <div className="text-center text-sm text-muted-foreground mb-2">
                <p>Local Leaderboard</p>
              </div>
              
              <FilteredLeaderboard leaderboard={leaderboard} onExport={handleExport} />
            </div>
          </TabsContent>

          <TabsContent value="tournament" className="space-y-4 mt-6">
            <TournamentPanel
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              currentAvatarUrl={currentAvatarUrl}
              onStartMatch={(difficulty, matchId) => onStartGame(difficulty, false, matchId)}
              playerStats={stats}
            />
          </TabsContent>

          <TabsContent value="teams" className="space-y-4 mt-6">
            <TeamTournamentPanel
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              currentAvatarUrl={currentAvatarUrl}
              onStartMatch={(difficulty, matchId, teamId) => onStartGame(difficulty, false, matchId)}
              playerStats={stats}
            />
          </TabsContent>

          <TabsContent value="customize" className="space-y-8 mt-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <CountrySelector />
              
              <VisualThemeSelector
                currentTheme={visualTheme || 'cyberpunk'}
                onThemeChange={(theme) => {
                  setVisualTheme(theme)
                  toast.success(`Visual theme changed to ${theme}`)
                }}
              />
              
              <TargetSkinSelector
                currentSkin={targetSkin || 'default'}
                onSkinChange={(skin) => {
                  setTargetSkin(skin)
                  toast.success(`Target skin changed to ${skin}`)
                }}
                stats={stats}
              />

              <ThemedBackgroundSelector
                currentBackground={backgroundVariant || 'particles'}
                onBackgroundChange={(bg) => {
                  setBackgroundVariant(bg)
                  toast.success(`Background changed!`)
                }}
              />

              <Card className="p-6 bg-card/50 backdrop-blur">
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Palette weight="fill" size={24} className="text-primary" />
                  Mouse Effects
                </h3>
                <div className="space-y-6">

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Mouse Trail
                      </label>
                      <input
                        type="checkbox"
                        checked={mouseTrailEnabled !== false}
                        onChange={(e) => {
                          setMouseTrailEnabled(e.target.checked)
                          toast.success(`Mouse trail ${e.target.checked ? 'enabled' : 'disabled'}`)
                        }}
                        className="w-5 h-5 rounded border-primary/50 bg-card/50 checked:bg-primary cursor-pointer"
                      />
                    </div>
                    {mouseTrailEnabled !== false && (
                      <Select 
                        value={mouseTrailVariant || 'glow'} 
                        onValueChange={(value: any) => {
                          setMouseTrailVariant(value)
                          toast.success(`Mouse trail style: ${value}`)
                        }}
                      >
                        <SelectTrigger className="bg-background/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="glow">Glow</SelectItem>
                          <SelectItem value="dots">Dots</SelectItem>
                          <SelectItem value="sparkle">Sparkle</SelectItem>
                          <SelectItem value="line">Line</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">
                        Gameplay Particle Trail
                      </label>
                    </div>
                    <Select 
                      value={gameplayParticleIntensity || 'medium'} 
                      onValueChange={(value: any) => {
                        setGameplayParticleIntensity(value)
                        toast.success(`Gameplay particle intensity: ${value}`)
                      }}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minimal particles</SelectItem>
                        <SelectItem value="medium">Medium - Balanced effects</SelectItem>
                        <SelectItem value="high">High - Maximum particles</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Dynamic particle trails during gameplay that respond to cursor speed and combos
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChartBar weight="fill" size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Your Statistics</h3>
            </div>
            <DashboardOverview 
              stats={stats}
              challengeData={challengeData}
              unlockedAchievements={unlockedAchievements}
            />
            {globalLeaderboard && globalLeaderboard.length > 0 && (
              <CommunityStatsWidget globalLeaderboard={globalLeaderboard} />
            )}
            <ComboBackgroundShowcase highestCombo={stats.highestCombo || 0} />
            <StatsPanel stats={stats} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4 mt-6">
            <RewardsVaultPanel
              stats={stats}
              unlockedAchievements={unlockedAchievements}
              playerLevel={challengeData.level}
              totalXP={challengeData.currentXP}
              challengeData={challengeData}
            />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Target weight="fill" size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Daily & Weekly Challenges</h3>
            </div>
            <ChallengesPanel 
              challengeData={challengeData} 
              onClaimReward={onClaimChallengeReward} 
            />
          </TabsContent>

          <TabsContent value="friends" className="space-y-4 mt-6">
            <FriendsPanel
              currentUserId={currentUserId}
              currentUsername={currentUsername}
              currentAvatarUrl={currentAvatarUrl}
              onStartChallenge={(challengeId, difficulty) => onStartGame(difficulty, false, challengeId)}
            />
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-6">
            <SeasonalEventsPanel 
              onStartEventGameMode={(eventId, modeId) => {
                onStartGame('medium', false, undefined, false, `event-${eventId}-${modeId}`)
              }}
            />
          </TabsContent>

          <TabsContent value="special-modes" className="space-y-4 mt-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkle weight="fill" size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Special Game Modes</h3>
            </div>
            <SpecialGameModePanel 
              onStartGameMode={(modeId, difficulty) => onStartGame(difficulty, false, undefined, false, modeId)} 
            />
          </TabsContent>

          <TabsContent value="pro-challenge" className="space-y-6 mt-6">
            <ProChallengePanel
              onStartProChallenge={(proPlayerId, difficulty) => {
                onStartGame(difficulty, false, undefined, false, `pro-${proPlayerId}`)
              }}
              playerBestScores={{}}
            />
          </TabsContent>

          <TabsContent value="live-event" className="space-y-6 mt-6">
            <LiveEventLeaderboard
              onStartEvent={(eventId) => {
                toast.success('Live event started! Start playing to appear on the leaderboard.')
              }}
            />
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6 mt-6">
            <AccessibilitySettings 
              onSettingsChange={() => {
                toast.success('Accessibility settings updated')
              }}
            />
          </TabsContent>


          <TabsContent value="analytics" className="space-y-6 mt-6">
            {gameSessions && gameSessions.length > 0 && (
              <AdvancedAnalytics
                gameSessions={gameSessions}
                totalGamesPlayed={stats.totalGamesPlayed}
                totalTargetsHit={stats.totalTargetsHit}
                totalTargetsMissed={stats.totalTargetsMissed}
                highestScore={stats.highestScore}
                highestCombo={stats.highestCombo}
              />
            )}

            {onAddRecentAction && recentActions && (
              <QuickActionsMenu
                onQuickPlay={() => {
                  onAddRecentAction('quick-play')
                  onStartGame('medium', false)
                }}
                onPractice={() => {
                  onAddRecentAction('practice')
                  onStartGame(selectedDifficulty || 'medium', true)
                }}
                onLastDifficulty={() => {
                  onAddRecentAction('last-difficulty')
                  onStartGame(selectedDifficulty || 'medium', false)
                }}
                onChallenge={() => {
                  onAddRecentAction('challenge')
                  setActiveTab('challenges')
                }}
                onTournament={() => {
                  onAddRecentAction('tournament')
                  setActiveTab('tournament')
                }}
                recentActions={recentActions}
              />
            )}

            {globalStats && <GlobalStatsCard stats={globalStats} />}

            {dailyStreak && onClaimStreakReward && (
              <StreakTracker 
                streak={dailyStreak} 
                onClaimReward={onClaimStreakReward} 
              />
            )}

            {gameSessions && gameSessions.length > 0 && (
              <PerformanceAnalytics sessions={gameSessions} />
            )}

            {customDifficulties !== undefined && (
              <CustomDifficultyBuilder
                customDifficulties={customDifficulties}
                onCreateDifficulty={(difficulty) => {
                  toast.success(`Custom difficulty created: ${difficulty?.name || 'New Difficulty'}`)
                }}
                onDeleteDifficulty={(id) => {
                  toast.success('Custom difficulty deleted')
                }}
                onPlayDifficulty={(difficulty) => {
                  toast.info(`Playing ${difficulty?.name || 'Custom Difficulty'} - Coming soon!`)
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="replays" className="space-y-4 mt-6">
            <ReplaysLibrary currentUserId={currentUserId} />
          </TabsContent>

          <TabsContent value="community" className="space-y-4 mt-6">
            <CommunityFeed currentUserId={currentUserId} />
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Powered by Cloud9 × JetBrains</p>
        </motion.div>
      </motion.div>

      {showGlobalLeaderboard && (
        <GlobalLeaderboard
          leaderboard={globalLeaderboard || []}
          currentUserId={currentUserId}
          onClose={() => setShowGlobalLeaderboard(false)}
        />
      )}
    </div>
  )
}
