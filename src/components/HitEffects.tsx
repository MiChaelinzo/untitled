import { motion } from 'framer-motion'
import { formatScore } from '@/lib/game-utils'

interface HitFeedbackProps {
  score: number
  x: number
  y: number
  onComplete: () => void
}

export function HitFeedback({ score, x, y, onComplete }: HitFeedbackProps) {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 1, y: 0 }}
      animate={{ scale: 1.5, opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      className="absolute pointer-events-none font-bold text-2xl text-cyan glow-text"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      +{formatScore(score)}
    </motion.div>
  )
}

interface ParticleProps {
  x: number
  y: number
  onComplete: () => void
}

export function HitParticles({ x, y, onComplete }: ParticleProps) {
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2
    const distance = 60 + Math.random() * 40
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    }
  })

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onAnimationComplete={particle.id === 0 ? onComplete : undefined}
          className="absolute w-2 h-2 rounded-full bg-primary"
          style={{
            left: x,
            top: y,
            boxShadow: '0 0 10px oklch(0.65 0.24 240)'
          }}
        />
      ))}
    </>
  )
}
