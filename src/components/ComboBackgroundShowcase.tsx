import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  COMBO_BACKGROUND_VARIANTS, 
  getAllUnlockedBackgrounds, 
  getNextComboBackground,
  getRarityColor,
  getRarityGlow
} from '@/lib/combo-backgrounds'
import { Trophy, Lock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface ComboBackgroundShowcaseProps {
  highestCombo: number
}

export function ComboBackgroundShowcase({ highestCombo }: ComboBackgroundShowcaseProps) {
  const unlockedBackgrounds = getAllUnlockedBackgrounds(highestCombo)
  const nextBackground = getNextComboBackground(highestCombo)
  
  const progressToNext = nextBackground 
    ? (highestCombo / nextBackground.comboThreshold) * 100
    : 100

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="text-primary" size={28} weight="bold" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground">Combo Backgrounds</h3>
          <p className="text-sm text-muted-foreground">
            Unlock unique backgrounds by reaching higher combos
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Highest Combo: <span className="text-primary font-bold">{highestCombo}x</span>
          </span>
          <span className="text-sm text-muted-foreground">
            {unlockedBackgrounds.length}/{COMBO_BACKGROUND_VARIANTS.length} Unlocked
          </span>
        </div>
        <Progress value={(unlockedBackgrounds.length / COMBO_BACKGROUND_VARIANTS.length) * 100} className="h-2" />
      </div>

      {nextBackground && (
        <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="text-accent" size={20} weight="bold" />
            <span className="text-sm font-bold text-accent uppercase tracking-wider">
              Next Unlock
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{nextBackground.icon}</span>
            <div className="flex-1">
              <h4 className={`font-bold ${getRarityColor(nextBackground.rarity)}`}>
                {nextBackground.name}
              </h4>
              <p className="text-xs text-muted-foreground">{nextBackground.description}</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-bold text-primary">
                {highestCombo}/{nextBackground.comboThreshold}x combo
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {COMBO_BACKGROUND_VARIANTS.map(variant => {
          const isUnlocked = highestCombo >= variant.comboThreshold
          
          return (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className={`p-3 transition-all duration-300 ${
                  isUnlocked 
                    ? `${getRarityGlow(variant.rarity)} bg-card/80 backdrop-blur-sm border-primary/30 hover:scale-105 cursor-pointer` 
                    : 'bg-muted/20 border-muted opacity-50'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <span className={`text-4xl ${isUnlocked ? '' : 'grayscale blur-[2px]'}`}>
                      {variant.icon}
                    </span>
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="text-muted-foreground" size={20} weight="bold" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center w-full">
                    <h4 className={`text-xs font-bold ${isUnlocked ? getRarityColor(variant.rarity) : 'text-muted-foreground'}`}>
                      {variant.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {variant.comboThreshold}x combo
                    </p>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] uppercase ${
                      isUnlocked ? getRarityColor(variant.rarity) : 'text-muted-foreground'
                    } border-current/30`}
                  >
                    {variant.rarity}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </Card>
  )
}
