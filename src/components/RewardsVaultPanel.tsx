import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  THEME_UNLOCKABLES, 
  ThemeUnlockable, 
  PlayerUnlocks,
  checkUnlockRequirement,
  getNewlyUnlocked,
  groupUnlockablesByType,
  getRarityColor,
  getProgressToUnlock
} from '@/lib/theme-rewards'
import { PlayerStats } from '@/lib/achievements'
import { Lock, Check, Sparkle, Trophy, Palette, MusicNote, Crosshair, Mouse, Medal } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface RewardsVaultPanelProps {
  stats: PlayerStats
  unlockedAchievements: string[]
  playerLevel: number
  totalXP: number
  challengeData?: any
}

export function RewardsVaultPanel({
  stats,
  unlockedAchievements,
  playerLevel,
  totalXP,
  challengeData
}: RewardsVaultPanelProps) {
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

  const defaultUnlocks: PlayerUnlocks = {
    unlockedThemes: ['visual-cyberpunk'],
    unlockedBackgrounds: ['bg-particles'],
    unlockedSoundThemes: ['sound-sci-fi'],
    unlockedTargetSkins: ['skin-default'],
    unlockedMouseTrails: ['trail-dots'],
    unlockedProfileBadges: [],
    unlockedTitles: ['title-rookie']
  }

  const unlocks = playerUnlocks || defaultUnlocks
  const groupedByType = groupUnlockablesByType(THEME_UNLOCKABLES)

  const checkAndUnlockNew = () => {
    const newlyUnlocked = getNewlyUnlocked(
      THEME_UNLOCKABLES,
      unlocks,
      stats,
      unlockedAchievements,
      playerLevel,
      totalXP,
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

      newlyUnlocked.forEach(unlockable => {
        toast.success(`New Unlock: ${unlockable.name}!`, {
          description: unlockable.description,
          icon: unlockable.icon
        })
      })
    }
  }

  const isUnlocked = (unlockableId: string): boolean => {
    return [
      ...unlocks.unlockedThemes,
      ...unlocks.unlockedBackgrounds,
      ...unlocks.unlockedSoundThemes,
      ...unlocks.unlockedTargetSkins,
      ...unlocks.unlockedMouseTrails,
      ...unlocks.unlockedProfileBadges,
      ...unlocks.unlockedTitles
    ].includes(unlockableId)
  }

  const equipUnlockable = (unlockable: ThemeUnlockable) => {
    if (!unlockable || !unlockable.name) {
      toast.error('Invalid unlockable item')
      return
    }
    
    if (!isUnlocked(unlockable.id)) {
      toast.error('Item not unlocked yet')
      return
    }

    setPlayerUnlocks(current => {
      const updated = { ...(current || defaultUnlocks) }
      
      switch (unlockable.type) {
        case 'visual-theme':
          updated.equippedVisualTheme = unlockable.id
          break
        case 'background':
          updated.equippedBackground = unlockable.id
          break
        case 'sound-theme':
          updated.equippedSoundTheme = unlockable.id
          break
        case 'target-skin':
          updated.equippedTargetSkin = unlockable.id
          break
        case 'mouse-trail':
          updated.equippedMouseTrail = unlockable.id
          break
        case 'profile-badge':
          updated.equippedProfileBadge = unlockable.id
          break
        case 'title':
          updated.equippedTitle = unlockable.id
          break
      }
      
      return updated
    })

    toast.success(`Equipped: ${unlockable.name}`)
  }

  const isEquipped = (unlockableId: string): boolean => {
    return [
      unlocks.equippedVisualTheme,
      unlocks.equippedBackground,
      unlocks.equippedSoundTheme,
      unlocks.equippedTargetSkin,
      unlocks.equippedMouseTrail,
      unlocks.equippedProfileBadge,
      unlocks.equippedTitle
    ].includes(unlockableId)
  }

  const renderUnlockable = (unlockable: ThemeUnlockable) => {
    if (!unlockable || !unlockable.name) {
      return null
    }
    
    const unlocked = isUnlocked(unlockable.id)
    const equipped = isEquipped(unlockable.id)
    const progress = unlocked ? null : getProgressToUnlock(unlockable, stats, playerLevel, totalXP)

    return (
      <motion.div
        key={unlockable.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card 
          className={`relative overflow-hidden ${unlocked ? 'bg-card' : 'bg-card/50'} ${equipped ? 'ring-2 ring-primary' : ''}`}
          style={{
            boxShadow: unlocked ? `0 0 20px -5px ${unlockable.glowColor}` : 'none'
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="text-4xl flex items-center justify-center w-12 h-12 rounded-lg"
                  style={{
                    background: unlocked ? `linear-gradient(135deg, ${unlockable.glowColor}30, ${unlockable.glowColor}10)` : 'transparent',
                    border: unlocked ? `1px solid ${unlockable.glowColor}50` : '1px solid oklch(0.30 0.08 240)'
                  }}
                >
                  {unlockable.icon}
                </div>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {unlockable.name}
                    {equipped && <Badge variant="default" className="text-xs">Equipped</Badge>}
                  </CardTitle>
                  <CardDescription className="text-sm">{unlockable.description}</CardDescription>
                </div>
              </div>
              <Badge 
                style={{ 
                  background: getRarityColor(unlockable.rarity),
                  color: 'white'
                }}
                className="capitalize"
              >
                {unlockable.rarity}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {!unlocked && progress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{progress.label}</span>
                  <span className="text-foreground font-medium">
                    {progress.current.toLocaleString()} / {progress.target.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>
            )}
            {!unlocked && unlockable.requirement.type === 'achievement' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock size={16} />
                <span>Unlock achievement: {unlockable.requirement.target}</span>
              </div>
            )}
            {!unlocked && unlockable.requirement.type === 'multi' && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock size={16} />
                  <span>Multiple requirements:</span>
                </div>
                <ul className="text-xs text-muted-foreground ml-6 space-y-1">
                  {unlockable.requirement.subRequirements?.map((req, i) => (
                    <li key={i}>
                      {req.type === 'achievement' && `Achievement: ${req.target}`}
                      {req.type === 'level' && `Level ${req.target}`}
                      {req.type === 'difficulty' && `Beat ${req.target} difficulty`}
                      {req.type === 'score' && `Score ${(req.target as number).toLocaleString()}`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {unlocked && !equipped && (
              <Button 
                onClick={() => equipUnlockable(unlockable)}
                className="w-full mt-2"
                variant="default"
              >
                <Check size={16} className="mr-2" />
                Equip
              </Button>
            )}
            {equipped && (
              <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium mt-2 py-2">
                <Check size={16} />
                Currently Equipped
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'visual-theme': return <Palette size={18} />
      case 'background': return <Sparkle size={18} />
      case 'sound-theme': return <MusicNote size={18} />
      case 'target-skin': return <Crosshair size={18} />
      case 'mouse-trail': return <Mouse size={18} />
      case 'profile-badge': return <Medal size={18} />
      case 'title': return <Trophy size={18} />
      default: return null
    }
  }

  const getTabLabel = (type: string) => {
    switch (type) {
      case 'visual-theme': return 'Themes'
      case 'background': return 'Backgrounds'
      case 'sound-theme': return 'Sounds'
      case 'target-skin': return 'Targets'
      case 'mouse-trail': return 'Trails'
      case 'profile-badge': return 'Badges'
      case 'title': return 'Titles'
      default: return type
    }
  }

  const countUnlocked = (type: string): number => {
    const items = groupedByType[type] || []
    return items.filter(item => isUnlocked(item.id)).length
  }

  const totalItems = (type: string): number => {
    return (groupedByType[type] || []).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Trophy size={32} className="text-primary" />
            Rewards Vault
          </h2>
          <p className="text-muted-foreground mt-1">
            Unlock and equip cosmetic rewards
          </p>
        </div>
        <Button onClick={checkAndUnlockNew} variant="default" size="lg">
          <Sparkle size={20} className="mr-2" />
          Check for Unlocks
        </Button>
      </div>

      <Tabs defaultValue="visual-theme" className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          {Object.keys(groupedByType).map(type => (
            <TabsTrigger key={type} value={type} className="flex items-center gap-2">
              {getTabIcon(type)}
              <span className="hidden lg:inline">{getTabLabel(type)}</span>
              <Badge variant="secondary" className="ml-1">
                {countUnlocked(type)}/{totalItems(type)}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(groupedByType).map(([type, items]) => (
          <TabsContent key={type} value={type} className="mt-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(unlockable => renderUnlockable(unlockable))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
