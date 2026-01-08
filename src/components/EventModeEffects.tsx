import { motion } from 'framer-motion'
import { EventGameMode } from '@/lib/event-game-modes'

interface EventModeEffectsProps {
  eventGameMode: EventGameMode
}

export function EventModeEffects({ eventGameMode }: EventModeEffectsProps) {
  const getParticleEffect = () => {
    const particleEffect = eventGameMode.visualEffects.find(ve => ve.type === 'particle')
    if (!particleEffect) return null

    switch (particleEffect.effect) {
      case 'snow':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
                style={{
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>
        )

      case 'fireworks':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: 'easeOut',
                }}
              >
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 blur-sm" />
              </motion.div>
            ))}
          </div>
        )

      case 'hearts':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-3xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 20,
                }}
                animate={{
                  y: -50,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
              >
                💖
              </motion.div>
            ))}
          </div>
        )

      case 'stars':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        )

      case 'leaves':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0,
                }}
                animate={{
                  y: window.innerHeight + 10,
                  x: Math.random() * window.innerWidth,
                  rotate: 360,
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 5,
                }}
              >
                🍃
              </motion.div>
            ))}
          </div>
        )

      case 'sparkles':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 60 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        )

      case 'flames':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-6 bg-gradient-to-t from-orange-600 to-yellow-400 rounded-full blur-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: 0,
                }}
                animate={{
                  y: [-50, -window.innerHeight],
                  opacity: [1, 0],
                  scale: [1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  const getScreenEffect = () => {
    const screenEffect = eventGameMode.visualEffects.find(ve => ve.type === 'screen-effect')
    if (!screenEffect) return null

    switch (screenEffect.effect) {
      case 'golden-glow':
        return (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${screenEffect.color || 'oklch(0.70 0.28 15)'}${Math.round(screenEffect.intensity * 20)}%, transparent 70%)`,
              mixBlendMode: 'screen',
            }}
          />
        )

      case 'dark-vignette':
        return (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, transparent 30%, oklch(0.08 0.02 290)${Math.round(screenEffect.intensity * 100)}%)`,
            }}
          />
        )

      case 'speed-lines':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                style={{
                  top: `${Math.random() * 100}%`,
                  width: '100%',
                  opacity: 0.3,
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )

      case 'chromatic':
        return (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              mixBlendMode: 'screen',
              opacity: screenEffect.intensity,
            }}
          >
            <div className="absolute inset-0 bg-red-500 opacity-5 translate-x-1" />
            <div className="absolute inset-0 bg-cyan-500 opacity-5 -translate-x-1" />
          </div>
        )

      case 'crt-scanlines':
        return (
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px, rgba(0,0,0,0.15) 3px)',
                opacity: screenEffect.intensity,
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  const getBackgroundEffect = () => {
    const bgEffect = eventGameMode.visualEffects.find(ve => ve.type === 'background')
    if (!bgEffect) return null

    switch (bgEffect.effect) {
      case 'water-ripple':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 30% 50%, ${bgEffect.color || 'oklch(0.75 0.18 180)'}${Math.round(bgEffect.intensity * 30)}%, transparent 50%), radial-gradient(ellipse at 70% 60%, ${bgEffect.color || 'oklch(0.75 0.18 180)'}${Math.round(bgEffect.intensity * 25)}%, transparent 50%)`,
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border-2"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  width: 100,
                  height: 100,
                  borderColor: `${bgEffect.color || 'oklch(0.75 0.18 180)'}40`,
                }}
                animate={{
                  scale: [0, 2.5],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>
        )

      case 'nebula':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 20% 30%, ${bgEffect.color || 'oklch(0.75 0.18 60)'}${Math.round(bgEffect.intensity * 25)}%, transparent 60%), radial-gradient(ellipse at 80% 70%, oklch(0.68 0.22 290)${Math.round(bgEffect.intensity * 20)}%, transparent 50%), radial-gradient(ellipse at 50% 50%, oklch(0.65 0.18 200)${Math.round(bgEffect.intensity * 15)}%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        )

      case 'grid':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(${bgEffect.color || 'oklch(0.75 0.18 195)'}20 1px, transparent 1px), linear-gradient(90deg, ${bgEffect.color || 'oklch(0.75 0.18 195)'}20 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
                opacity: bgEffect.intensity,
              }}
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      {getParticleEffect()}
      {getScreenEffect()}
      {getBackgroundEffect()}
    </>
  )
}
