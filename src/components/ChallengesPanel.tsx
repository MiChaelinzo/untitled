import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Trophy, Star, Crown, Lightning } from '@phosphor-icons/react'
import { ChallengeCard, BadgeDisplay } from '@/components/ChallengeCard'
import {
  PlayerChallengeData,
  calculateLevel,
  getXPForNextLevel,
  removeExpiredBadges
} from '@/lib/challenges'

interface ChallengesPanelProps {
  challengeData: PlayerChallengeData
  onClaimReward: (challengeId: string) => void
}

export function ChallengesPanel({ challengeData, onClaimReward }: ChallengesPanelProps) {
  const [activeTab, setActiveTab] = useState('daily')
  
  const dailyChallenges = challengeData.activeChallenges.filter(c => c.type === 'daily')
  const weeklyChallenges = challengeData.activeChallenges.filter(c => c.type === 'weekly')
  const activeBadges = removeExpiredBadges(challengeData.earnedBadges)
  
  const currentLevel = calculateLevel(challengeData.currentXP)
  const nextLevelXP = getXPForNextLevel(currentLevel)
  const currentLevelXP = (currentLevel - 1) ** 2 * 100
  const xpProgress = ((challengeData.currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100

  return (
    <div className="space-y-6">
      <Card className="p-6 border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                <Crown size={32} weight="fill" className="text-primary" />
              </div>
              <Badge 
                variant="default" 
                className="absolute -bottom-1 -right-1 px-2 py-0.5 text-xs font-bold"
              >
                {currentLevel}
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-bold glow-text">Level {currentLevel}</h2>
              <p className="text-sm text-muted-foreground">
                {challengeData.currentXP.toLocaleString()} XP
              </p>
            </div>
          </div>
          
          {challengeData.activeTitle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge variant="outline" className="text-lg px-4 py-2 border-accent text-accent glow-box">
                {challengeData.activeTitle}
              </Badge>
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
            <span className="font-bold">
              {(challengeData.currentXP - currentLevelXP).toLocaleString()} / {(nextLevelXP - currentLevelXP).toLocaleString()} XP
            </span>
          </div>
          <Progress value={xpProgress} className="h-3" />
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/30">
          <TabsTrigger value="daily" className="relative">
            <Lightning size={16} weight="fill" className="mr-2" />
            Daily
            {dailyChallenges.some(c => {
              const progress = challengeData.progress[c.id]
              return progress?.completed && !progress?.claimedReward
            }) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="weekly" className="relative">
            <Trophy size={16} weight="fill" className="mr-2" />
            Weekly
            {weeklyChallenges.some(c => {
              const progress = challengeData.progress[c.id]
              return progress?.completed && !progress?.claimedReward
            }) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            )}
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Star size={16} weight="fill" className="mr-2" />
            Badges ({activeBadges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Daily Challenges</h3>
            <p className="text-sm text-muted-foreground">
              Resets in {Math.floor((dailyChallenges[0]?.expiresAt - Date.now()) / (1000 * 60 * 60))}h
            </p>
          </div>
          
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {dailyChallenges.map(challenge => {
                const progress = challengeData.progress[challenge.id] || {
                  challengeId: challenge.id,
                  progress: 0,
                  completed: false,
                  claimedReward: false
                }
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    progress={progress}
                    onClaimReward={() => onClaimReward(challenge.id)}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Weekly Challenges</h3>
            <p className="text-sm text-muted-foreground">
              Resets in {Math.floor((weeklyChallenges[0]?.expiresAt - Date.now()) / (1000 * 60 * 60 * 24))}d
            </p>
          </div>
          
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {weeklyChallenges.map(challenge => {
                const progress = challengeData.progress[challenge.id] || {
                  challengeId: challenge.id,
                  progress: 0,
                  completed: false,
                  claimedReward: false
                }
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    progress={progress}
                    onClaimReward={() => onClaimReward(challenge.id)}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Time-Limited Badges</h3>
            <p className="text-sm text-muted-foreground">
              {activeBadges.length} active
            </p>
          </div>

          {activeBadges.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" weight="duotone" />
              <h4 className="text-lg font-bold mb-2">No Badges Yet</h4>
              <p className="text-sm text-muted-foreground">
                Complete challenges to earn time-limited badges!
              </p>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {activeBadges.map(badge => (
                    <BadgeDisplay key={badge.id} badge={badge} />
                  ))}
                </AnimatePresence>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-bold text-muted-foreground">Badge Rarity Guide</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span>Common</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span>Rare</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <span>Epic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span>Legendary</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {challengeData.unlockedTitles.length > 0 && (
        <Card className="p-4 bg-card/30 backdrop-blur-sm">
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Crown size={16} weight="fill" className="text-accent" />
            Unlocked Titles
          </h4>
          <div className="flex flex-wrap gap-2">
            {challengeData.unlockedTitles.map(title => (
              <Badge
                key={title}
                variant={title === challengeData.activeTitle ? 'default' : 'outline'}
                className="cursor-pointer"
              >
                {title}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
