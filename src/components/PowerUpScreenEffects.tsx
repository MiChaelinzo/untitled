import { motion } from 'framer-motion'
import { ActivePowerUp, POWER_UP_CONFIG, getPowerUpModifiers } from '@/lib/power-ups'

interface PowerUpScreenEffectsProps {
  activePowerUps: ActivePowerUp[]
}

export function PowerUpScreenEffects({ activePowerUps }: PowerUpScreenEffectsProps) {
  const modifiers = getPowerUpModifiers(activePowerUps)
  
  return (
    <>
      {modifiers.timeMultiplier < 1 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 30%, oklch(0.70 0.25 280 / 0.15) 100%)',
            }}
            animate={{
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {[...Array(20)].map((_, i) => {
            const delay = i * 0.3
            const x = (i % 5) * 25
            const duration = 8 + Math.random() * 4
            
            return (
              <motion.div
                key={`time-particle-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: 'oklch(0.70 0.25 280)',
                  boxShadow: '0 0 10px oklch(0.70 0.25 280)',
                  left: `${x}%`,
                  top: '100%'
                }}
                animate={{
                  y: ['0vh', '-110vh'],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1, 1, 0.5]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            )
          })}
        </motion.div>
      )}

      {modifiers.hasShield && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-4 rounded-3xl border-4"
            style={{
              borderColor: 'oklch(0.75 0.22 220)',
              boxShadow: '0 0 40px oklch(0.75 0.22 220), inset 0 0 40px oklch(0.75 0.22 220 / 0.3)'
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [0.98, 1, 0.98]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {[...Array(12)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 12
            return (
              <motion.div
                key={`shield-particle-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: 'oklch(0.75 0.22 220)',
                  boxShadow: '0 0 15px oklch(0.75 0.22 220)',
                  left: '50%',
                  top: '50%'
                }}
                animate={{
                  x: [0, Math.cos(angle) * 200, Math.cos(angle) * 400],
                  y: [0, Math.sin(angle) * 200, Math.sin(angle) * 400],
                  opacity: [1, 0.5, 0],
                  scale: [1, 1.2, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.25,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            )
          })}
        </motion.div>
      )}

      {modifiers.multiShotActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(45deg, transparent 0%, oklch(0.78 0.25 60 / 0.1) 50%, transparent 100%)',
              backgroundSize: '200% 200%'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`lightning-${i}`}
              className="absolute h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent"
              style={{
                width: `${20 + Math.random() * 30}%`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: '0 0 10px oklch(0.78 0.25 60)'
              }}
              animate={{
                opacity: [0, 1, 0],
                scaleX: [0, 1, 0]
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 1.5
              }}
            />
          ))}
        </motion.div>
      )}

      {modifiers.scoreMultiplier > 1 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(30)].map((_, i) => {
            const x = Math.random() * 100
            const delay = Math.random() * 2
            const duration = 3 + Math.random() * 2
            
            return (
              <motion.div
                key={`gem-${i}`}
                className="absolute text-2xl"
                style={{
                  left: `${x}%`,
                  top: '100%',
                  filter: 'drop-shadow(0 0 8px oklch(0.75 0.28 350))'
                }}
                animate={{
                  y: [0, -window.innerHeight - 50],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360],
                  scale: [0.5, 1, 1, 0.5]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                💎
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {modifiers.magnetActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, oklch(0.68 0.22 15 / 0.2) 0%, transparent 70%)',
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`magnet-ring-${i}`}
              className="absolute border-2 rounded-full"
              style={{
                borderColor: 'oklch(0.68 0.22 15)',
                width: '50%',
                height: '50%',
                left: '25%',
                top: '25%'
              }}
              animate={{
                scale: [0.5, 2],
                opacity: [0.8, 0]
              }}
              transition={{
                duration: 2,
                delay: i * 0.33,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          ))}
        </motion.div>
      )}

      {modifiers.freezeActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, oklch(0.80 0.18 220 / 0.15) 0%, transparent 100%)',
            }}
          />

          {[...Array(40)].map((_, i) => {
            const x = Math.random() * 100
            const delay = Math.random() * 3
            const duration = 4 + Math.random() * 3
            
            return (
              <motion.div
                key={`snowflake-${i}`}
                className="absolute text-lg"
                style={{
                  left: `${x}%`,
                  top: '-5%',
                  filter: 'drop-shadow(0 0 5px oklch(0.80 0.18 220))'
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, Math.sin(i) * 50],
                  opacity: [0, 1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                ❄️
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {modifiers.chainLightningActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, oklch(0.85 0.25 90 / 0.1) 0%, transparent 60%)',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {[...Array(8)].map((_, i) => {
            const startX = Math.random() * 100
            const startY = Math.random() * 100
            
            return (
              <motion.svg
                key={`lightning-bolt-${i}`}
                className="absolute"
                style={{
                  left: `${startX}%`,
                  top: `${startY}%`,
                  width: '200px',
                  height: '200px',
                  filter: 'drop-shadow(0 0 10px oklch(0.85 0.25 90))'
                }}
                animate={{
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <path
                  d="M100 0 L80 80 L120 80 L100 160"
                  stroke="oklch(0.85 0.25 90)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </motion.svg>
            )
          })}
        </motion.div>
      )}
    </>
  )
}
