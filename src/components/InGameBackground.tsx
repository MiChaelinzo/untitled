import { motion } from 'framer-motion'
import { Difficulty } from '@/lib/game-types'
import { useEffect, useState } from 'react'
import { EventGameModeId } from '@/lib/event-game-modes'

interface InGameBackgroundProps {
  difficulty: Difficulty
  score: number
  combo: number
  round: number
  eventGameModeId?: EventGameModeId
}

export function InGameBackground({ difficulty, score, combo, round, eventGameModeId }: InGameBackgroundProps) {
  const [particleCount, setParticleCount] = useState(50)
  const [intensity, setIntensity] = useState(1)

  useEffect(() => {
    const difficultyMultiplier = {
      easy: 0.6,
      medium: 1,
      hard: 1.5,
      insane: 2.5
    }[difficulty]

    const comboBoost = Math.min(combo / 10, 2)
    const roundMultiplier = 1 + (round - 1) * 0.3

    setIntensity(difficultyMultiplier * (1 + comboBoost) * roundMultiplier)
    setParticleCount(Math.floor(50 + (difficulty === 'insane' ? 100 : difficulty === 'hard' ? 50 : 0)))
  }, [difficulty, combo, round])

  const getColorScheme = () => {
    if (eventGameModeId === 'winter-frostbite') return { primary: 'rgba(147, 197, 253, 0.5)', secondary: 'rgba(191, 219, 254, 0.3)' }
    if (eventGameModeId === 'lunar-fireworks') return { primary: 'rgba(252, 211, 77, 0.5)', secondary: 'rgba(248, 113, 113, 0.3)' }
    if (eventGameModeId === 'valentines-heartshot') return { primary: 'rgba(244, 114, 182, 0.5)', secondary: 'rgba(251, 207, 232, 0.3)' }
    if (eventGameModeId === 'halloween-phantom') return { primary: 'rgba(249, 115, 22, 0.5)', secondary: 'rgba(168, 85, 247, 0.3)' }
    if (eventGameModeId === 'ocean-wave') return { primary: 'rgba(56, 189, 248, 0.5)', secondary: 'rgba(6, 182, 212, 0.3)' }
    if (eventGameModeId === 'cosmic-gravity') return { primary: 'rgba(168, 85, 247, 0.5)', secondary: 'rgba(236, 72, 153, 0.3)' }
    if (eventGameModeId === 'cyber-speed-run') return { primary: 'rgba(34, 211, 238, 0.5)', secondary: 'rgba(168, 85, 247, 0.3)' }
    if (eventGameModeId === 'neon-pulse') return { primary: 'rgba(236, 72, 153, 0.5)', secondary: 'rgba(59, 130, 246, 0.3)' }
    if (eventGameModeId === 'spring-butterfly') return { primary: 'rgba(74, 222, 128, 0.5)', secondary: 'rgba(251, 191, 36, 0.3)' }
    
    if (combo > 20) return { primary: 'rgba(236, 72, 153, 0.4)', secondary: 'rgba(124, 58, 237, 0.3)' }
    if (combo > 10) return { primary: 'rgba(59, 130, 246, 0.4)', secondary: 'rgba(16, 185, 129, 0.3)' }
    if (difficulty === 'insane') return { primary: 'rgba(239, 68, 68, 0.4)', secondary: 'rgba(245, 158, 11, 0.3)' }
    if (difficulty === 'hard') return { primary: 'rgba(249, 115, 22, 0.4)', secondary: 'rgba(234, 179, 8, 0.3)' }
    if (difficulty === 'medium') return { primary: 'rgba(99, 102, 241, 0.4)', secondary: 'rgba(139, 92, 246, 0.3)' }
    return { primary: 'rgba(14, 165, 233, 0.35)', secondary: 'rgba(6, 182, 212, 0.25)' }
  }

  const colors = getColorScheme()

  if (eventGameModeId === 'ocean-wave') {
    return <OceanWaveBackground colors={colors} intensity={intensity} />
  }

  if (eventGameModeId === 'cosmic-gravity') {
    return <CosmicGravityBackground colors={colors} intensity={intensity} combo={combo} />
  }

  if (eventGameModeId === 'winter-frostbite') {
    return <WinterBackground colors={colors} intensity={intensity} />
  }

  if (eventGameModeId === 'cyber-speed-run') {
    return <CyberSpeedBackground colors={colors} intensity={intensity} />
  }

  if (difficulty === 'insane') {
    return <InsaneBackground colors={colors} intensity={intensity} combo={combo} />
  }

  if (difficulty === 'hard') {
    return <HardBackground colors={colors} intensity={intensity} particleCount={particleCount} />
  }

  if (difficulty === 'medium') {
    return <MediumBackground colors={colors} intensity={intensity} />
  }

  return <EasyBackground colors={colors} />
}

function EasyBackground({ colors }: { colors: { primary: string; secondary: string } }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 ${Math.random() * 8 + 4}px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function MediumBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary" />
      
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(${i * 60}deg, ${colors.primary}, transparent, ${colors.secondary})`,
            opacity: 0.08,
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1.5,
            height: Math.random() * 3 + 1.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 ${Math.random() * 12 + 6}px ${i % 3 === 0 ? colors.primary : colors.secondary}`,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, intensity * 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 6 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent"
        animate={{
          scale: [1, 1.2 * intensity, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function HardBackground({ 
  colors, 
  intensity, 
  particleCount 
}: { 
  colors: { primary: string; secondary: string }
  intensity: number
  particleCount: number 
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-accent/10" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              ${colors.primary} 3px,
              ${colors.primary} 4px
            )
          `,
          opacity: 0.03,
        }}
        animate={{
          y: [0, 40],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: Math.min(particleCount, 60) }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2
        const radius = 250 + Math.random() * 150
        
        return (
          <motion.div
            key={`orbit-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 2 === 0 ? colors.primary : colors.secondary,
              boxShadow: `0 0 ${Math.random() * 15 + 8}px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
            }}
            animate={{
              x: [
                Math.cos(angle) * radius + window.innerWidth / 2,
                Math.cos(angle + Math.PI) * radius + window.innerWidth / 2,
                Math.cos(angle) * radius + window.innerWidth / 2,
              ],
              y: [
                Math.sin(angle) * radius + window.innerHeight / 2,
                Math.sin(angle + Math.PI) * radius + window.innerHeight / 2,
                Math.sin(angle) * radius + window.innerHeight / 2,
              ],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, intensity * 1.3, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        )
      })}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3 * intensity, 1],
          opacity: [0.08, 0.15, 0.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function InsaneBackground({ 
  colors, 
  intensity, 
  combo 
}: { 
  colors: { primary: string; secondary: string }
  intensity: number
  combo: number
}) {
  const [explosions, setExplosions] = useState<Array<{ id: string; x: number; y: number }>>([])

  useEffect(() => {
    if (combo > 0 && combo % 10 === 0) {
      const newExplosion = {
        id: `explosion-${Date.now()}-${Math.random()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }
      setExplosions(prev => [...prev, newExplosion])
      
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== newExplosion.id))
      }, 3000)
    }
  }, [combo])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${colors.primary}, transparent 50%),
            radial-gradient(circle at 80% 50%, ${colors.secondary}, transparent 50%),
            linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(245, 158, 11, 0.05))
          `,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              ${colors.primary} 30deg,
              transparent 60deg
            )
          `,
          opacity: 0.06,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 40 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 80 }).map((_, i) => {
        const angle = (i / 80) * Math.PI * 2
        const distance = 200 + (i % 3) * 120
        
        return (
          <motion.div
            key={`vortex-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : 'rgba(239, 68, 68, 0.4)',
              boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
            }}
            animate={{
              x: [
                Math.cos(angle) * distance + window.innerWidth / 2,
                Math.cos(angle + Math.PI * 2) * distance + window.innerWidth / 2,
              ],
              y: [
                Math.sin(angle) * distance + window.innerHeight / 2,
                Math.sin(angle + Math.PI * 2) * distance + window.innerHeight / 2,
              ],
              scale: [1, intensity * 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 10 / intensity,
              repeat: Infinity,
              ease: "linear",
              delay: (i / 80) * 3,
            }}
          />
        )
      })}

      {explosions.map(explosion => (
        <motion.div
          key={explosion.id}
          className="absolute"
          style={{
            left: `${explosion.x}%`,
            top: `${explosion.y}%`,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}, ${colors.secondary}, transparent)`,
              boxShadow: `0 0 60px ${colors.primary}`,
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 60%)`,
            `radial-gradient(circle at 50% 50%, ${colors.secondary}, transparent 60%)`,
            `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 60%)`,
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.12 * intensity }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              ${colors.primary} 1px,
              transparent 2px,
              transparent 80px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              ${colors.secondary} 1px,
              transparent 2px,
              transparent 80px
            )
          `,
          opacity: 0.08,
        }}
        animate={{
          x: [0, 80],
          y: [0, 80],
        }}
        transition={{
          duration: 6 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

function OceanWaveBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-cyan-900/20 to-blue-950/30" />
      
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full"
          style={{
            height: '30%',
            bottom: `${i * -25}%`,
            background: `linear-gradient(180deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
            opacity: 0.12,
            borderRadius: '50%',
          }}
          animate={{
            y: [0, -30, 0],
            scaleY: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 20 + 8,
            height: Math.random() * 20 + 8,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * -10}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), ${colors.primary})`,
            boxShadow: `0 0 15px ${colors.primary}, inset -3px -3px 10px rgba(0, 0, 0, 0.15)`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.random() * 80 - 40],
            scale: [1, 1.15, 0.9],
            opacity: [0.4, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.15 * intensity, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function CosmicGravityBackground({ 
  colors, 
  intensity, 
  combo 
}: { 
  colors: { primary: string; secondary: string }
  intensity: number
  combo: number
}) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-black/80 to-pink-950/30" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${colors.primary}, transparent 50%),
            radial-gradient(circle at 70% 70%, ${colors.secondary}, transparent 50%)
          `,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 90 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 120 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 500 + 150
        
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 2 + 0.5,
              height: Math.random() * 2 + 0.5,
              background: 'white',
              boxShadow: `0 0 ${Math.random() * 6 + 3}px rgba(255, 255, 255, 0.6)`,
            }}
            animate={{
              x: [
                Math.cos(angle) * distance + window.innerWidth / 2,
                Math.cos(angle + Math.PI) * distance + window.innerWidth / 2,
                Math.cos(angle) * distance + window.innerWidth / 2,
              ],
              y: [
                Math.sin(angle) * distance + window.innerHeight / 2,
                Math.sin(angle + Math.PI) * distance + window.innerHeight / 2,
                Math.sin(angle) * distance + window.innerHeight / 2,
              ],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 25 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )
      })}

      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 350 + Math.random() * 150,
            height: 350 + Math.random() * 150,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${i % 2 === 0 ? colors.primary : colors.secondary}, transparent)`,
          }}
          animate={{
            x: [0, Math.random() * 150 - 75],
            y: [0, Math.random() * 150 - 75],
            scale: [1, 1.2 * intensity, 1],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 18 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from ${combo * 5}deg, transparent, ${colors.primary}, transparent)`,
          opacity: 0.08,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  )
}

function WinterBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-cyan-950/15 to-blue-950/20" />
      
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={`snowflake-${i}`}
          className="absolute text-white/50"
          style={{
            fontSize: Math.random() * 15 + 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -10}%`,
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, Math.sin(i) * 60],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 12,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          ❄
        </motion.div>
      ))}

      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={`frost-${i}`}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${i * 60}deg, transparent, ${colors.primary}, transparent)`,
            opacity: 0.06,
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
          }}
          transition={{
            duration: 40 + i * 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2 * intensity, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}

function CyberSpeedBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/20 to-cyan-950/20" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 30px,
              ${colors.primary} 30px,
              ${colors.primary} 31px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 30px,
              ${colors.secondary} 30px,
              ${colors.secondary} 31px
            )
          `,
          opacity: 0.1,
        }}
        animate={{
          y: [0, 30],
        }}
        transition={{
          duration: 2 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`speed-line-${i}`}
          className="absolute h-px"
          style={{
            width: Math.random() * 250 + 80,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            boxShadow: `0 0 6px ${colors.primary}`,
          }}
          animate={{
            x: [-800, 800],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: (2 / intensity) * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`data-stream-${i}`}
          className="absolute w-1"
          style={{
            height: Math.random() * 150 + 80,
            left: `${(i / 6) * 100}%`,
            top: `-${Math.random() * 150}px`,
            background: `linear-gradient(180deg, transparent, ${colors.secondary}, transparent)`,
            boxShadow: `0 0 12px ${colors.secondary}`,
          }}
          animate={{
            y: [0, window.innerHeight + 150],
          }}
          transition={{
            duration: (3 / intensity) + Math.random(),
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.4 * intensity, 1],
          opacity: [0.08, 0.18, 0.08],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
