import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target as TargetType } from '@/lib/game-types'

interface TargetProps {
  target: TargetType
  onHit: (reactionTime: number) => void
  onMiss: () => void
  size?: number
}

export function Target({ target, onHit, onMiss, size = 80 }: TargetProps) {
  const [timeRemaining, setTimeRemaining] = useState(target.duration)

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - target.spawnTime
      const remaining = target.duration - elapsed

      if (remaining <= 0) {
        onMiss()
      } else {
        setTimeRemaining(remaining)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [target, onMiss])

  const handleClick = () => {
    const reactionTime = Date.now() - target.spawnTime
    onHit(reactionTime)
  }

  const progress = (timeRemaining / target.duration) * 100
  const scale = 0.5 + (progress / 100) * 0.5
  const urgencyColor = progress < 30 ? 'oklch(0.55 0.25 15)' : progress < 60 ? 'oklch(0.70 0.25 350)' : 'oklch(0.65 0.24 240)'

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'backOut' }}
      className="absolute cursor-pointer"
      style={{
        left: target.x - size / 2,
        top: target.y - size / 2,
        width: size,
        height: size
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        <motion.div
          className="absolute inset-0 rounded-full glow-box"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            backgroundColor: urgencyColor,
            boxShadow: `0 0 ${20 * (progress / 100)}px ${urgencyColor}, 0 0 ${40 * (progress / 100)}px ${urgencyColor}`
          }}
        />
        
        <div 
          className="absolute inset-0 rounded-full backdrop-blur-sm border-2" 
          style={{
            backgroundColor: `${urgencyColor}30`,
            borderColor: urgencyColor
          }}
        />
        
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="40%"
            fill="none"
            stroke={urgencyColor}
            strokeWidth="3"
            strokeDasharray={`${progress * 2.5} 250`}
            opacity="0.8"
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
