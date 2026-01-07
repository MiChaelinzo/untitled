import { motion } from 'framer-motion'
import { TargetSkin } from '@/lib/target-skins'

interface TargetParticlesProps {
  skin: TargetSkin
  x: number
  y: number
  onComplete: () => void
}

interface Particle {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
}

const PARTICLE_CONFIGS: Record<TargetSkin, {
  count: number
  colors: string[]
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon' | 'line'
  speed: number
  spread: number
}> = {
  default: {
    count: 12,
    colors: ['oklch(0.65 0.24 240)', 'oklch(0.70 0.25 350)', 'oklch(0.75 0.18 195)'],
    shape: 'circle',
    speed: 1,
    spread: 100
  },
  bullseye: {
    count: 16,
    colors: ['oklch(0.55 0.25 15)', 'oklch(0.70 0.25 350)', 'oklch(0.85 0.20 60)'],
    shape: 'circle',
    speed: 1.2,
    spread: 120
  },
  crosshair: {
    count: 8,
    colors: ['oklch(0.70 0.25 350)', 'oklch(0.75 0.18 195)'],
    shape: 'line',
    speed: 1.5,
    spread: 80
  },
  hexagon: {
    count: 18,
    colors: ['oklch(0.75 0.18 195)', 'oklch(0.65 0.24 240)', 'oklch(0.80 0.15 210)'],
    shape: 'hexagon',
    speed: 1.1,
    spread: 110
  },
  star: {
    count: 20,
    colors: ['oklch(0.85 0.20 60)', 'oklch(0.90 0.18 80)', 'oklch(0.95 0.15 100)'],
    shape: 'star',
    speed: 0.9,
    spread: 130
  },
  pulse: {
    count: 24,
    colors: ['oklch(0.70 0.25 350)', 'oklch(0.75 0.18 195)', 'oklch(0.80 0.20 300)'],
    shape: 'circle',
    speed: 1.3,
    spread: 140
  }
}

function generateParticles(config: typeof PARTICLE_CONFIGS.default): Particle[] {
  return Array.from({ length: config.count }, (_, i) => ({
    id: i,
    angle: (360 / config.count) * i,
    distance: config.spread * (0.7 + Math.random() * 0.3),
    size: 4 + Math.random() * 4,
    delay: Math.random() * 0.1
  }))
}

function ParticleShape({ 
  shape, 
  size, 
  color 
}: { 
  shape: typeof PARTICLE_CONFIGS.default.shape
  size: number
  color: string 
}) {
  switch (shape) {
    case 'circle':
      return (
        <div 
          className="rounded-full"
          style={{ 
            width: size, 
            height: size, 
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`
          }} 
        />
      )
    case 'square':
      return (
        <div 
          style={{ 
            width: size, 
            height: size, 
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`
          }} 
        />
      )
    case 'triangle':
      return (
        <div 
          style={{ 
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
            filter: `drop-shadow(0 0 ${size * 2}px ${color})`
          }} 
        />
      )
    case 'star':
      return (
        <div 
          className="text-center font-bold"
          style={{ 
            fontSize: size,
            color: color,
            textShadow: `0 0 ${size * 2}px ${color}`,
            lineHeight: 1
          }}
        >
          ★
        </div>
      )
    case 'hexagon':
      return (
        <div 
          className="relative"
          style={{ 
            width: size, 
            height: size * 0.866,
            backgroundColor: color,
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            boxShadow: `0 0 ${size * 2}px ${color}`
          }} 
        />
      )
    case 'line':
      return (
        <div 
          style={{ 
            width: size * 3,
            height: 2,
            backgroundColor: color,
            boxShadow: `0 0 ${size}px ${color}`
          }} 
        />
      )
    default:
      return (
        <div 
          className="rounded-full"
          style={{ 
            width: size, 
            height: size, 
            backgroundColor: color,
            boxShadow: `0 0 ${size * 2}px ${color}`
          }} 
        />
      )
  }
}

export function TargetParticles({ skin, x, y, onComplete }: TargetParticlesProps) {
  const config = PARTICLE_CONFIGS[skin]
  const particles = generateParticles(config)

  return (
    <div 
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      {particles.map((particle) => {
        const color = config.colors[particle.id % config.colors.length]
        const radians = (particle.angle * Math.PI) / 180
        const endX = Math.cos(radians) * particle.distance
        const endY = Math.sin(radians) * particle.distance

        return (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: -particle.size / 2,
              top: -particle.size / 2
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 1, 
              scale: 1,
              rotate: config.shape === 'line' ? particle.angle : 0
            }}
            animate={{ 
              x: endX, 
              y: endY, 
              opacity: 0, 
              scale: 0.3,
              rotate: config.shape === 'line' ? particle.angle : 360
            }}
            transition={{
              duration: 0.6 / config.speed,
              delay: particle.delay,
              ease: 'easeOut'
            }}
            onAnimationComplete={() => {
              if (particle.id === particles.length - 1) {
                onComplete()
              }
            }}
          >
            <ParticleShape 
              shape={config.shape}
              size={particle.size}
              color={color}
            />
          </motion.div>
        )
      })}
      
      {(skin === 'pulse' || skin === 'star') && (
        <>
          <motion.div
            className="absolute rounded-full border-4"
            style={{
              left: -50,
              top: -50,
              width: 100,
              height: 100,
              borderColor: config.colors[0],
              opacity: 0.8
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full border-2"
            style={{
              left: -50,
              top: -50,
              width: 100,
              height: 100,
              borderColor: config.colors[1],
              opacity: 0.6
            }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          />
        </>
      )}
      
      {skin === 'hexagon' && (
        <motion.div
          className="absolute"
          style={{
            left: -40,
            top: -40,
            width: 80,
            height: 80,
            backgroundColor: config.colors[0],
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            opacity: 0.5
          }}
          initial={{ scale: 1, opacity: 0.5, rotate: 0 }}
          animate={{ scale: 1.8, opacity: 0, rotate: 180 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      
      {skin === 'crosshair' && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              left: -60,
              top: -1,
              width: 120,
              height: 2,
              backgroundColor: config.colors[0],
              boxShadow: `0 0 10px ${config.colors[0]}`
            }}
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
          <motion.div
            style={{
              position: 'absolute',
              left: -1,
              top: -60,
              width: 2,
              height: 120,
              backgroundColor: config.colors[1],
              boxShadow: `0 0 10px ${config.colors[1]}`
            }}
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{ scaleY: 1, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </>
      )}
    </div>
  )
}
