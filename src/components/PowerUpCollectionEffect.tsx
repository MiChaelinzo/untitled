import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface PowerUpCollectionEffectProps {
  x: number
  y: number
  color: string
  icon: string
  onComplete: () => void
}

export function PowerUpCollectionEffect({ x, y, color, icon, onComplete }: PowerUpCollectionEffectProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000)
    return () => clearTimeout(timer)
  }, [onComplete])

  const particleCount = 20
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (Math.PI * 2 * i) / particleCount
    const distance = 60 + Math.random() * 40
    const endX = Math.cos(angle) * distance
    const endY = Math.sin(angle) * distance
    
    return { id: i, endX, endY, delay: i * 0.02 }
  })

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 1 }}
        animate={{ 
          scale: [0.8, 2, 0],
          opacity: [1, 0.8, 0]
        }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="w-32 h-32 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 60px 20px ${color}, inset 0 0 30px rgba(255, 255, 255, 0.5)`,
            filter: 'blur(8px)'
          }}
        />
      </motion.div>

      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: [1, 1.5, 0],
          rotate: [0, 180, 360],
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ fontSize: '4rem' }}
      >
        {icon}
      </motion.div>

      {particles.map(particle => (
        <motion.div
          key={particle.id}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: particle.endX,
            y: particle.endY,
            scale: [1, 1.5, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 0.8,
            delay: particle.delay,
            ease: 'easeOut'
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [0, 1.2, 1],
          opacity: [0, 1, 0]
        }}
        transition={{ 
          duration: 1.2,
          times: [0, 0.3, 1],
          ease: 'easeOut'
        }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-8"
      >
        <div 
          className="px-4 py-2 rounded-lg font-bold text-white text-lg whitespace-nowrap"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}, inset 0 0 10px rgba(255, 255, 255, 0.3)`,
            border: '2px solid rgba(255, 255, 255, 0.5)'
          }}
        >
          POWER-UP COLLECTED!
        </div>
      </motion.div>

      {[...Array(8)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 8
        const radius = 80
        return (
          <motion.div
            key={`ring-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              ease: 'easeOut'
            }}
            className="absolute w-16 h-16 rounded-full border-4"
            style={{
              borderColor: color,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${angle}rad)`
            }}
          />
        )
      })}
    </div>
  )
}
