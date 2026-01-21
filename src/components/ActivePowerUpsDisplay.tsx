import { motion, AnimatePresence } from 'framer-motion'
import { ActivePowerUp, POWER_UP_CONFIG } from '@/lib/power-ups'
import { Card } from '@/components/ui/card'
import { useState, useEffect } from 'react'

interface ActivePowerUpsDisplayProps {
  activePowerUps: ActivePowerUp[]
}

export function ActivePowerUpsDisplay({ activePowerUps }: ActivePowerUpsDisplayProps) {
  const [powerUpStates, setPowerUpStates] = useState<Map<string, { progress: number; isExpiring: boolean }>>(new Map())

  useEffect(() => {
    const interval = setInterval(() => {
      const newStates = new Map<string, { progress: number; isExpiring: boolean }>()
      
      activePowerUps.forEach(powerUp => {
        const key = `${powerUp.type}-${powerUp.startTime}`
        const elapsed = Date.now() - powerUp.startTime
        const remaining = Math.max(0, powerUp.duration - elapsed)
        const progress = remaining / powerUp.duration
        const isExpiring = progress < 0.3
        
        newStates.set(key, { progress, isExpiring })
      })
      
      setPowerUpStates(newStates)
    }, 50)

    return () => clearInterval(interval)
  }, [activePowerUps])
  
  if (activePowerUps.length === 0) {
    return null
  }
  
  return (
    <div className="flex gap-3 flex-wrap">
      <AnimatePresence mode="popLayout">
        {activePowerUps.map((powerUp, index) => {
          const config = POWER_UP_CONFIG[powerUp.type]
          const key = `${powerUp.type}-${powerUp.startTime}`
          const state = powerUpStates.get(key) || { progress: 1, isExpiring: false }
          const elapsed = Date.now() - powerUp.startTime
          const remaining = Math.max(0, powerUp.duration - elapsed)
          
          return (
            <motion.div
              key={key}
              initial={{ scale: 0, y: -30, opacity: 0 }}
              animate={{ 
                scale: state.isExpiring ? [1, 1.05, 1] : 1,
                y: 0,
                opacity: 1
              }}
              exit={{ 
                scale: [1, 1.3, 0],
                opacity: [1, 0.5, 0],
                y: -20
              }}
              transition={{ 
                scale: {
                  duration: state.isExpiring ? 0.3 : 0.5,
                  repeat: state.isExpiring ? Infinity : 0
                },
                opacity: { duration: 0.3 },
                y: { duration: 0.3 }
              }}
              layout
            >
              <Card 
                className="relative overflow-hidden px-4 py-2.5 flex items-center gap-3 min-w-[140px] border-2"
                style={{
                  backgroundColor: config.color,
                  borderColor: state.isExpiring ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.4)',
                  boxShadow: `0 0 ${state.isExpiring ? '25' : '20'}px ${config.color}`,
                  transition: 'border-color 0.3s, box-shadow 0.3s'
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"
                  style={{
                    width: `${(1 - state.progress) * 100}%`,
                    transition: 'width 0.05s linear'
                  }}
                />

                {state.progress < 1 && (
                  <motion.div
                    className="absolute inset-0 border-r-4 border-white/30"
                    style={{
                      width: `${state.progress * 100}%`
                    }}
                    animate={{
                      opacity: state.isExpiring ? [0.3, 0.7, 0.3] : 0.3
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: state.isExpiring ? Infinity : 0
                    }}
                  />
                )}

                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                />
                
                <div className="relative z-10 flex items-center gap-3">
                  <motion.span 
                    className="text-3xl"
                    animate={{
                      rotate: state.isExpiring ? [0, -10, 10, 0] : 0,
                      scale: [1, 1.15, 1]
                    }}
                    transition={{
                      rotate: {
                        duration: 0.4,
                        repeat: state.isExpiring ? Infinity : 0
                      },
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }
                    }}
                  >
                    {config.icon}
                  </motion.span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-none tracking-wide">
                      {config.name.toUpperCase()}
                    </span>
                    <motion.span 
                      className="text-sm font-mono font-bold leading-none mt-1"
                      style={{
                        color: state.isExpiring ? '#ffff00' : 'rgba(255, 255, 255, 0.9)'
                      }}
                      animate={{
                        scale: state.isExpiring ? [1, 1.1, 1] : 1
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: state.isExpiring ? Infinity : 0
                      }}
                    >
                      {(remaining / 1000).toFixed(1)}s
                    </motion.span>
                  </div>
                </div>

                <svg
                  className="absolute bottom-0 left-0 right-0 h-1"
                  style={{ zIndex: 20 }}
                >
                  <motion.rect
                    width={`${state.progress * 100}%`}
                    height="100%"
                    fill="rgba(255, 255, 255, 0.8)"
                    animate={{
                      opacity: state.isExpiring ? [0.8, 1, 0.8] : 0.8
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: state.isExpiring ? Infinity : 0
                    }}
                  />
                </svg>

                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`glow-${i}`}
                    className="absolute inset-0 rounded-lg"
                    style={{
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      pointerEvents: 'none'
                    }}
                    animate={{
                      scale: [1, 1.1, 1.2],
                      opacity: [0.5, 0.2, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.5,
                      repeat: Infinity,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </Card>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
