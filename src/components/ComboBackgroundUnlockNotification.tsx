import { motion, AnimatePresence } from 'framer-motion'
import { ComboBackgroundVariant, getRarityColor, getRarityGlow } from '@/lib/combo-backgrounds'
import { useEffect, useState } from 'react'

interface ComboBackgroundUnlockNotificationProps {
  variant: ComboBackgroundVariant
  onComplete: () => void
}

export function ComboBackgroundUnlockNotification({ 
  variant, 
  onComplete 
}: ComboBackgroundUnlockNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 3500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className={`bg-card/95 backdrop-blur-xl border-2 rounded-xl p-6 ${getRarityGlow(variant.rarity)} min-w-[320px]`}
            style={{
              borderColor: variant.colorPrimary.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')'),
            }}
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 360] }}
                transition={{ 
                  scale: { type: 'spring', damping: 10 },
                  rotate: { duration: 0.6, ease: 'easeOut' }
                }}
                className="text-6xl mb-3"
              >
                {variant.icon}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                  Background Unlocked
                </p>
                <h3 className={`text-2xl font-bold mb-1 ${getRarityColor(variant.rarity)}`}>
                  {variant.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {variant.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="px-2 py-1 bg-primary/20 rounded-md font-semibold text-primary">
                    {variant.comboThreshold}x Combo
                  </span>
                  <span className={`px-2 py-1 rounded-md font-semibold uppercase ${getRarityColor(variant.rarity)} bg-current/10`}>
                    {variant.rarity}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                background: `linear-gradient(135deg, ${variant.colorPrimary}, ${variant.colorSecondary})`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
