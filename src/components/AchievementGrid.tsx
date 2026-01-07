import { Achievement, ACHIEVEMENTS } from '@/lib/achievements'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock } from '@phosphor-icons/react'

interface AchievementGridProps {
  unlockedIds: string[]
}

export function AchievementGrid({ unlockedIds }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {ACHIEVEMENTS.map((achievement) => {
        const isUnlocked = unlockedIds.includes(achievement.id)
        
        return (
          <Card
            key={achievement.id}
            className={`p-4 text-center space-y-2 transition-all ${
              isUnlocked
                ? 'bg-accent/10 border-accent/50 hover:bg-accent/20'
                : 'bg-card/30 border-border/50 opacity-60'
            }`}
          >
            <div className="relative">
              <div className={`text-4xl ${!isUnlocked && 'grayscale opacity-50'}`}>
                {achievement.icon}
              </div>
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock size={20} className="text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="font-bold text-sm text-foreground">{achievement.name}</div>
            <div className="text-xs text-muted-foreground">{achievement.description}</div>
            {isUnlocked && (
              <Badge variant="outline" className="text-xs border-accent text-accent">
                Unlocked
              </Badge>
            )}
          </Card>
        )
      })}
    </div>
  )
}
