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
    if (eventGameModeId === 'winter-frostbite') return { primary: 'rgba(147, 197, 253, 0.7)', secondary: 'rgba(191, 219, 254, 0.5)' }
    if (eventGameModeId === 'lunar-fireworks') return { primary: 'rgba(252, 211, 77, 0.7)', secondary: 'rgba(248, 113, 113, 0.5)' }
    if (eventGameModeId === 'valentines-heartshot') return { primary: 'rgba(244, 114, 182, 0.7)', secondary: 'rgba(251, 207, 232, 0.5)' }
    if (eventGameModeId === 'halloween-phantom') return { primary: 'rgba(249, 115, 22, 0.7)', secondary: 'rgba(168, 85, 247, 0.5)' }
    if (eventGameModeId === 'ocean-wave') return { primary: 'rgba(56, 189, 248, 0.7)', secondary: 'rgba(6, 182, 212, 0.5)' }
    if (eventGameModeId === 'cosmic-gravity') return { primary: 'rgba(168, 85, 247, 0.7)', secondary: 'rgba(236, 72, 153, 0.5)' }
    if (eventGameModeId === 'cyber-speed-run') return { primary: 'rgba(34, 211, 238, 0.7)', secondary: 'rgba(168, 85, 247, 0.5)' }
    if (eventGameModeId === 'neon-pulse') return { primary: 'rgba(236, 72, 153, 0.7)', secondary: 'rgba(59, 130, 246, 0.5)' }
    if (eventGameModeId === 'spring-butterfly') return { primary: 'rgba(74, 222, 128, 0.7)', secondary: 'rgba(251, 191, 36, 0.5)' }
    
    if (combo > 20) return { primary: 'rgba(236, 72, 153, 0.6)', secondary: 'rgba(124, 58, 237, 0.4)' }
    if (combo > 10) return { primary: 'rgba(59, 130, 246, 0.6)', secondary: 'rgba(16, 185, 129, 0.4)' }
    if (difficulty === 'insane') return { primary: 'rgba(239, 68, 68, 0.6)', secondary: 'rgba(245, 158, 11, 0.4)' }
    if (difficulty === 'hard') return { primary: 'rgba(249, 115, 22, 0.6)', secondary: 'rgba(234, 179, 8, 0.4)' }
    if (difficulty === 'medium') return { primary: 'rgba(99, 102, 241, 0.6)', secondary: 'rgba(139, 92, 246, 0.4)' }
    return { primary: 'rgba(14, 165, 233, 0.5)', secondary: 'rgba(6, 182, 212, 0.3)' }
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
      
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 ${Math.random() * 20 + 10}px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 50%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
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

function MediumBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-secondary" />
      
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full h-full"
          style={{
            background: `linear-gradient(${i * 60}deg, ${colors.primary}, transparent, ${colors.secondary})`,
            opacity: 0.15,
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full blur-sm"
          style={{
            width: Math.random() * 6 + 3,
            height: Math.random() * 6 + 3,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 ${Math.random() * 30 + 15}px ${i % 3 === 0 ? colors.primary : colors.secondary}`,
          }}
          animate={{
            y: [0, Math.random() * 200 - 100],
            x: [0, Math.random() * 200 - 100],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, intensity * 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 8 + 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent"
        animate={{
          scale: [1, 1.5 * intensity, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 5,
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
              transparent 2px,
              ${colors.primary} 2px,
              ${colors.primary} 4px
            )
          `,
          opacity: 0.05,
        }}
        animate={{
          y: [0, 40],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2
        const radius = 300 + Math.random() * 200
        
        return (
          <motion.div
            key={`orbit-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: i % 2 === 0 ? colors.primary : colors.secondary,
              boxShadow: `0 0 ${Math.random() * 40 + 20}px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
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
              opacity: [0.3, 1, 0.3],
              scale: [1, intensity * 2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        )
      })}

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`lightning-${i}`}
          className="absolute h-px"
          style={{
            width: Math.random() * 200 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            boxShadow: `0 0 10px ${colors.primary}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: Math.random() * 5 + 2,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 2 * intensity, 1],
          opacity: [0.1, 0.3, 0.1],
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
    if (combo > 0 && combo % 5 === 0) {
      const newExplosion = {
        id: `explosion-${Date.now()}-${Math.random()}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }
      setExplosions(prev => [...prev, newExplosion])
      
      setTimeout(() => {
        setExplosions(prev => prev.filter(e => e.id !== newExplosion.id))
      }, 2000)
    }
  }, [combo])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${colors.primary}, transparent 40%),
            radial-gradient(circle at 80% 50%, ${colors.secondary}, transparent 40%),
            linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(245, 158, 11, 0.1))
          `,
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
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
          opacity: 0.1,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 150 }).map((_, i) => {
        const angle = (i / 150) * Math.PI * 2
        const distance = 200 + (i % 3) * 150
        
        return (
          <motion.div
            key={`vortex-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              background: i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : 'rgba(239, 68, 68, 0.6)',
              boxShadow: `0 0 ${Math.random() * 50 + 30}px currentColor`,
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
              scale: [1, intensity * 2.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 5 / intensity,
              repeat: Infinity,
              ease: "linear",
              delay: (i / 150) * 2,
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
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors.primary}, ${colors.secondary}, transparent)`,
              boxShadow: `0 0 100px ${colors.primary}`,
            }}
          />
        </motion.div>
      ))}

      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`laser-${i}`}
          className="absolute w-1 origin-left"
          style={{
            height: '200vh',
            left: '50%',
            top: '50%',
            background: `linear-gradient(180deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
            boxShadow: `0 0 20px ${colors.primary}`,
          }}
          animate={{
            rotate: [i * 30, i * 30 + 360],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 / intensity,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.1,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, ${colors.secondary}, transparent 50%)`,
            `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 50%)`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ opacity: 0.2 * intensity }}
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
              transparent 50px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              ${colors.secondary} 1px,
              transparent 2px,
              transparent 50px
            )
          `,
          opacity: 0.15,
        }}
        animate={{
          x: [0, 50],
          y: [0, 50],
        }}
        transition={{
          duration: 3 / intensity,
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
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/50 via-cyan-900/30 to-blue-950/50" />
      
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute w-full"
          style={{
            height: '40%',
            bottom: `${i * -30}%`,
            background: `linear-gradient(180deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
            opacity: 0.2,
            borderRadius: '50%',
          }}
          animate={{
            y: [0, -50, 0],
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 30 + 10,
            height: Math.random() * 30 + 10,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * -10}%`,
            background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), ${colors.primary})`,
            boxShadow: `0 0 20px ${colors.primary}, inset -5px -5px 15px rgba(0, 0, 0, 0.2)`,
          }}
          animate={{
            y: [0, -window.innerHeight - 100],
            x: [0, Math.random() * 100 - 50],
            scale: [1, 1.2, 0.8],
            opacity: [0.6, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: "easeOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 80%, ${colors.primary}, transparent 60%)`,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.3 * intensity, 1],
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
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-black to-pink-950/50" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, ${colors.primary}, transparent 40%),
            radial-gradient(circle at 70% 70%, ${colors.secondary}, transparent 40%)
          `,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 200 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 600 + 200
        
        return (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'white',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`,
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
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )
      })}

      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`nebula-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: 400 + Math.random() * 200,
            height: 400 + Math.random() * 200,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `radial-gradient(circle, ${i % 2 === 0 ? colors.primary : colors.secondary}, transparent)`,
          }}
          animate={{
            x: [0, Math.random() * 200 - 100],
            y: [0, Math.random() * 200 - 100],
            scale: [1, 1.5 * intensity, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from ${combo * 10}deg, transparent, ${colors.primary}, transparent)`,
          opacity: 0.15,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 30 / intensity,
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
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-cyan-950/20 to-blue-950/30" />
      
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={`snowflake-${i}`}
          className="absolute text-white/70"
          style={{
            fontSize: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -10}%`,
          }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, Math.sin(i) * 100],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 8 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          ❄
        </motion.div>
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`frost-${i}`}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${i * 60}deg, transparent, ${colors.primary}, transparent)`,
            opacity: 0.1,
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
          }}
          transition={{
            duration: 30 + i * 5,
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
          scale: [1, 1.4 * intensity, 1],
          opacity: [0.15, 0.3, 0.15],
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

function CyberSpeedBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-cyan-950/30" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 20px,
              ${colors.primary} 20px,
              ${colors.primary} 21px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 20px,
              ${colors.secondary} 20px,
              ${colors.secondary} 21px
            )
          `,
          opacity: 0.2,
        }}
        animate={{
          y: [0, 20],
        }}
        transition={{
          duration: 1 / intensity,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`speed-line-${i}`}
          className="absolute h-px"
          style={{
            width: Math.random() * 300 + 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            boxShadow: `0 0 10px ${colors.primary}`,
          }}
          animate={{
            x: [-1000, 1000],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: (1 / intensity) * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`data-stream-${i}`}
          className="absolute w-2"
          style={{
            height: Math.random() * 200 + 100,
            left: `${(i / 8) * 100}%`,
            top: `-${Math.random() * 200}px`,
            background: `linear-gradient(180deg, transparent, ${colors.secondary}, transparent)`,
            boxShadow: `0 0 20px ${colors.secondary}`,
          }}
          animate={{
            y: [0, window.innerHeight + 200],
          }}
          transition={{
            duration: (2 / intensity) + Math.random(),
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary}, transparent 60%)`,
        }}
        animate={{
          scale: [1, 2 * intensity, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
