import { motion, AnimatePresence } from 'framer-motion'
import { ThemeUnlockable, getRarityColor } from '@/lib/theme-rewards'
import { Sparkle } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { soundSystem } from '@/lib/sound-system'

interface UnlockNotificationProps {
  unlockable: ThemeUnlockable
  onComplete: () => void
}

export function UnlockNotification({ unlockable, onComplete }: UnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    soundSystem.play('combo', 10)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  const rarityColor = getRarityColor(unlockable.rarity)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 20px -5px ${rarityColor}`,
                `0 0 40px -5px ${rarityColor}`,
                `0 0 20px -5px ${rarityColor}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative bg-card border-2 rounded-2xl p-6 min-w-[400px]"
            style={{
              borderColor: rarityColor,
              background: `linear-gradient(135deg, ${rarityColor}10, oklch(0.18 0.03 240))`,
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute -top-4 -right-4"
            >
              <Sparkle size={32} className="text-accent" weight="fill" />
            </motion.div>

            <div className="text-center space-y-3">
              <div className="text-sm font-bold uppercase tracking-wider" style={{ color: rarityColor }}>
                {unlockable.rarity} Unlocked!
              </div>

              <div className="text-6xl">{unlockable.icon}</div>

              <div>
                <h3 className="text-2xl font-black text-foreground">
                  {unlockable.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {unlockable.description}
                </p>
              </div>

              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Check Rewards Vault to equip
              </div>
            </div>

            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${rarityColor}20, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
