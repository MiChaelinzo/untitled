import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, Lock } from '@phosphor-icons/react'
import { TARGET_SKINS, TargetSkin, getUnlockedSkins } from '@/lib/target-skins'
import { PlayerStats } from '@/lib/achievements'

interface TargetSkinSelectorProps {
  currentSkin: TargetSkin
  onSkinChange: (skin: TargetSkin) => void
  stats: PlayerStats
}

export function TargetSkinSelector({ currentSkin, onSkinChange, stats }: TargetSkinSelectorProps) {
  const unlockedSkins = getUnlockedSkins(stats)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold font-['Orbitron']">Target Skins</h3>
        <Badge variant="outline" className="text-xs">
          {unlockedSkins.length}/{Object.keys(TARGET_SKINS).length} Unlocked
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(TARGET_SKINS).map((skin) => {
          const isUnlocked = unlockedSkins.includes(skin.id)
          const isSelected = currentSkin === skin.id

          return (
            <motion.div
              key={skin.id}
              whileHover={isUnlocked ? { scale: 1.05 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
            >
              <Card
                className={`p-4 cursor-pointer transition-all relative ${
                  !isUnlocked
                    ? 'opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/30'
                    : 'hover:ring-1 hover:ring-primary/50'
                }`}
                onClick={() => isUnlocked && onSkinChange(skin.id)}
              >
                {!isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                )}

                {isSelected && isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Check size={16} className="text-primary" weight="bold" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center gap-2">
                  <div className="text-4xl mb-2">{skin.icon}</div>
                  
                  <h4 className="font-bold font-['Orbitron'] text-sm">
                    {skin.name}
                  </h4>
                  
                  <p className="text-xs text-muted-foreground leading-tight">
                    {skin.description}
                  </p>

                  <Badge
                    variant={isUnlocked ? "default" : "secondary"}
                    className="text-xs mt-2"
                  >
                    {isUnlocked ? 'Unlocked' : skin.unlockRequirement}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
