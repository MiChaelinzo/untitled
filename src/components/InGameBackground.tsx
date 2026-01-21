import { motion } from 'framer-motion'
import { Difficulty } from '@/lib/game-types'
import { useEffect, useState } from 'react'
import { EventGameModeId } from '@/lib/event-game-modes'
import { getComboBackgroundVariant, ComboBackgroundVariant } from '@/lib/combo-backgrounds'

interface InGameBackgroundProps {
  difficulty: Difficulty
  score: number
  combo: number
  round: number
  eventGameModeId?: EventGameModeId
  onBackgroundUnlock?: (variant: ComboBackgroundVariant) => void
}

export function InGameBackground({ difficulty, score, combo, round, eventGameModeId, onBackgroundUnlock }: InGameBackgroundProps) {
  const [particleCount, setParticleCount] = useState(50)
  const [intensity, setIntensity] = useState(1)
  const [currentBackground, setCurrentBackground] = useState<ComboBackgroundVariant | null>(null)

  useEffect(() => {
    if (!eventGameModeId) {
      const newBackground = getComboBackgroundVariant(combo)
      
      if (currentBackground && newBackground.id !== currentBackground.id && onBackgroundUnlock) {
        onBackgroundUnlock(newBackground)
      }
      
      setCurrentBackground(newBackground)
      setIntensity(newBackground.intensity)
    } else {
      const difficultyMultiplier = {
        easy: 0.6,
        medium: 1,
        hard: 1.5,
        insane: 2.5
      }[difficulty]

      const comboBoost = Math.min(combo / 10, 2)
      const roundMultiplier = 1 + (round - 1) * 0.3

      setIntensity(difficultyMultiplier * (1 + comboBoost) * roundMultiplier)
    }
    
    setParticleCount(Math.floor(50 + (difficulty === 'insane' ? 100 : difficulty === 'hard' ? 50 : 0)))
  }, [difficulty, combo, round, eventGameModeId, currentBackground, onBackgroundUnlock])

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
    
    if (currentBackground && !eventGameModeId) {
      return { 
        primary: currentBackground.colorPrimary, 
        secondary: currentBackground.colorSecondary 
      }
    }
    
    if (combo > 20) return { primary: 'rgba(236, 72, 153, 0.4)', secondary: 'rgba(124, 58, 237, 0.3)' }
    if (combo > 10) return { primary: 'rgba(59, 130, 246, 0.4)', secondary: 'rgba(16, 185, 129, 0.3)' }
    if (difficulty === 'insane') return { primary: 'rgba(239, 68, 68, 0.4)', secondary: 'rgba(245, 158, 11, 0.3)' }
    if (difficulty === 'hard') return { primary: 'rgba(249, 115, 22, 0.4)', secondary: 'rgba(234, 179, 8, 0.3)' }
    if (difficulty === 'medium') return { primary: 'rgba(99, 102, 241, 0.4)', secondary: 'rgba(139, 92, 246, 0.3)' }
    return { primary: 'rgba(14, 165, 233, 0.35)', secondary: 'rgba(6, 182, 212, 0.25)' }
  }

  const colors = getColorScheme()
  const activeVariant = currentBackground?.variant || 'particles'

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

  if (!eventGameModeId && currentBackground) {
    switch (activeVariant) {
      case 'particles':
        return <EasyBackground colors={colors} intensity={intensity} />
      case 'waves':
        return <MediumBackground colors={colors} intensity={intensity} />
      case 'aurora':
        return <AuroraBackground colors={colors} intensity={intensity} />
      case 'constellation':
        return <ConstellationBackground colors={colors} intensity={intensity} />
      case 'matrix':
        return <MatrixBackground colors={colors} intensity={intensity} />
      case 'nebula':
        return <NebulaBackground colors={colors} intensity={intensity} combo={combo} />
      case 'binary-rain':
        return <BinaryRainBackground colors={colors} intensity={intensity} />
      case 'spirals':
        return <SpiralsBackground colors={colors} intensity={intensity} />
      case 'geometric':
        return <GeometricBackground colors={colors} intensity={intensity} />
      case 'hexagon':
        return <HexagonBackground colors={colors} intensity={intensity} />
      case 'grid':
        return <HardBackground colors={colors} intensity={intensity} particleCount={particleCount} />
      default:
        return <EasyBackground colors={colors} intensity={intensity} />
    }
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

  return <EasyBackground colors={colors} intensity={intensity} />
}

function EasyBackground({ colors, intensity = 1 }: { colors: { primary: string; secondary: string }; intensity?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {Array.from({ length: Math.floor(50 * intensity) }).map((_, i) => (
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
            opacity: [0.3, 0.6 * intensity, 0.3],
            scale: [1, 1.2 * intensity, 1],
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
          scale: [1, 1.1 * intensity, 1],
          opacity: [0.08, 0.12 * intensity, 0.08],
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

function AuroraBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-cyan-950/15 to-purple-950/20" />
      
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`aurora-${i}`}
          className="absolute w-full blur-2xl"
          style={{
            height: '40%',
            top: `${20 + i * 15}%`,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
            opacity: 0.15,
          }}
          animate={{
            x: [-200, 200, -200],
            opacity: [0.1, 0.2 * intensity, 0.1],
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
          background: `radial-gradient(circle at 50% 30%, ${colors.primary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.3 * intensity, 1],
          opacity: [0.08, 0.15, 0.08],
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

function ConstellationBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black" />
      
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'white',
            boxShadow: `0 0 ${Math.random() * 10 + 5}px rgba(255, 255, 255, 0.8)`,
          }}
          animate={{
            opacity: [0.3, 0.8 * intensity, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {Array.from({ length: 20 }).map((_, i) => (
        <svg key={`line-${i}`} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.15 }}>
          <motion.line
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke={colors.primary}
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        </svg>
      ))}
    </div>
  )
}

function MatrixBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`matrix-${i}`}
          className="absolute font-mono text-xs"
          style={{
            left: `${(i / 20) * 100}%`,
            color: colors.primary,
            textShadow: `0 0 8px ${colors.primary}`,
            opacity: 0.6,
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
          }}
          transition={{
            duration: (5 / intensity) + Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j}>
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.secondary}, transparent 60%)`,
        }}
        animate={{
          scale: [1, 1.2 * intensity, 1],
          opacity: [0.05, 0.12, 0.05],
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

function NebulaBackground({ colors, intensity, combo }: { colors: { primary: string; secondary: string }; intensity: number; combo: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-pink-950/40" />
      
      {Array.from({ length: 6 }).map((_, i) => (
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
            scale: [1, 1.3 * intensity, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 20 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {Array.from({ length: 80 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 2 + 0.5,
            height: Math.random() * 2 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: 'white',
            boxShadow: `0 0 ${Math.random() * 6 + 3}px white`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  )
}

function BinaryRainBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-950/20 to-black" />
      
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`binary-${i}`}
          className="absolute font-mono text-sm"
          style={{
            left: `${(i / 30) * 100}%`,
            color: colors.primary,
            textShadow: `0 0 8px ${colors.primary}`,
            opacity: 0.5,
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
          }}
          transition={{
            duration: (4 / intensity) + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => (
            <div key={j}>
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

function SpiralsBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-amber-950/20 to-background" />
      
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`spiral-${i}`}
          className="absolute inset-0"
          style={{
            background: `conic-gradient(from ${i * 120}deg, transparent, ${colors.primary}, ${colors.secondary}, transparent)`,
            opacity: 0.12,
          }}
          animate={{
            rotate: [i * 120, i * 120 + 360],
          }}
          transition={{
            duration: 40 / intensity,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {Array.from({ length: 60 }).map((_, i) => {
        const angle = (i / 60) * Math.PI * 2
        const radius = 200 + (i % 5) * 80
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 2 === 0 ? colors.primary : colors.secondary,
              boxShadow: `0 0 15px currentColor`,
            }}
            animate={{
              x: [
                Math.cos(angle) * radius + window.innerWidth / 2,
                Math.cos(angle + Math.PI * 2) * radius + window.innerWidth / 2,
              ],
              y: [
                Math.sin(angle) * radius + window.innerHeight / 2,
                Math.sin(angle + Math.PI * 2) * radius + window.innerHeight / 2,
              ],
              opacity: [0.3, 0.7 * intensity, 0.3],
            }}
            transition={{
              duration: 15 / intensity,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )
      })}
    </div>
  )
}

function GeometricBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 via-black to-pink-950/30" />
      
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            width: 150 + Math.random() * 100,
            height: 150 + Math.random() * 100,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            border: `2px solid ${i % 2 === 0 ? colors.primary : colors.secondary}`,
            boxShadow: `0 0 20px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2 * intensity, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 20 + i * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`triangle-${i}`}
          className="absolute"
          style={{
            width: 0,
            height: 0,
            borderLeft: '50px solid transparent',
            borderRight: '50px solid transparent',
            borderBottom: `100px solid ${colors.primary}`,
            opacity: 0.15,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: [0, 360],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

function HexagonBackground({ colors, intensity }: { colors: { primary: string; secondary: string }; intensity: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-fuchsia-950/40" />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            repeating-conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              ${colors.primary} 60deg,
              transparent 120deg
            )
          `,
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

      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`hex-${i}`}
          className="absolute"
          style={{
            width: 80 + Math.random() * 40,
            height: 80 + Math.random() * 40,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: i % 2 === 0 ? colors.primary : colors.secondary,
            boxShadow: `0 0 30px ${i % 2 === 0 ? colors.primary : colors.secondary}`,
          }}
          animate={{
            opacity: [0.1, 0.3 * intensity, 0.1],
            scale: [1, 1.2, 1],
            rotate: [0, 60, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${colors.secondary}, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.5 * intensity, 1],
          opacity: [0.1, 0.25, 0.1],
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
