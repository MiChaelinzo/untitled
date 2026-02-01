import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Target as TargetType } from '@/lib/game-types'
import { TargetSkin } from '@/lib/target-skins'

interface TargetProps {
  target: TargetType
  onHit: (reactionTime: number) => void
  onMiss: () => void
  size?: number
  skin?: TargetSkin
}

export function Target({ target, onHit, onMiss, size = 80, skin = 'default' }: TargetProps) {
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
  
  const cyanRing = 'oklch(0.78 0.20 200)'
  const magentaCore = 'oklch(0.72 0.28 340)'
  const whiteCore = 'oklch(0.98 0.02 200)'
  const urgencyColor = progress < 30 ? 'oklch(0.65 0.25 15)' : progress < 60 ? magentaCore : cyanRing

  const renderSkin = () => {
    switch (skin) {
      case 'bullseye':
        return (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `radial-gradient(circle, ${urgencyColor} 0%, ${urgencyColor}80 30%, ${urgencyColor}60 60%, ${urgencyColor}40 100%)`,
                boxShadow: `0 0 ${20 * (progress / 100)}px ${urgencyColor}`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[80%] h-[80%] rounded-full border-4" style={{ borderColor: urgencyColor, opacity: 0.6 }} />
              <div className="absolute w-[60%] h-[60%] rounded-full border-4" style={{ borderColor: urgencyColor, opacity: 0.7 }} />
              <div className="absolute w-[40%] h-[40%] rounded-full border-4" style={{ borderColor: urgencyColor, opacity: 0.8 }} />
              <div className="absolute w-[20%] h-[20%] rounded-full" style={{ backgroundColor: urgencyColor }} />
            </div>
          </>
        )
      
      case 'crosshair':
        return (
          <>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute left-1/2 top-0 w-0.5 h-full -translate-x-1/2" style={{ backgroundColor: urgencyColor, boxShadow: `0 0 10px ${urgencyColor}` }} />
              <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2" style={{ backgroundColor: urgencyColor, boxShadow: `0 0 10px ${urgencyColor}` }} />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2" style={{ borderColor: urgencyColor }} />
              <div className="absolute w-2 h-2 rounded-full" style={{ backgroundColor: urgencyColor }} />
            </div>
            <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: `${urgencyColor}40` }} />
          </>
        )
      
      case 'hexagon':
        return (
          <>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: [0, 120, 240, 360], scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                backgroundColor: `${urgencyColor}50`,
                border: `3px solid ${urgencyColor}`,
                boxShadow: `0 0 ${30 * (progress / 100)}px ${urgencyColor}`
              }}
            />
            <div className="absolute inset-[20%]" style={{
              clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              backgroundColor: `${urgencyColor}70`,
              border: `2px solid ${urgencyColor}`
            }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3" style={{
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
                backgroundColor: urgencyColor
              }} />
            </div>
          </>
        )
      
      case 'star':
        return (
          <>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-6xl glow-text" style={{ color: urgencyColor }}>★</div>
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, -360], scale: [0.8, 0.9, 0.8], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-5xl" style={{ color: urgencyColor, filter: 'blur(2px)' }}>★</div>
            </motion.div>
            <div className="absolute inset-0 rounded-full" style={{
              background: `radial-gradient(circle, ${urgencyColor}20 0%, transparent 70%)`,
              boxShadow: `0 0 ${40 * (progress / 100)}px ${urgencyColor}`
            }} />
          </>
        )
      
      case 'pulse':
        return (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [0.9, 1.2, 0.9], opacity: [0.8, 0.3, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                border: `4px solid ${urgencyColor}`,
                boxShadow: `0 0 ${30 * (progress / 100)}px ${urgencyColor}`
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1, 1.1, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              style={{
                border: `3px solid ${urgencyColor}`,
                backgroundColor: `${urgencyColor}20`
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              style={{
                backgroundColor: `${urgencyColor}40`,
                border: `2px solid ${urgencyColor}`
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-4 h-4 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ backgroundColor: urgencyColor, boxShadow: `0 0 10px ${urgencyColor}` }}
              />
            </div>
          </>
        )
      
      default:
        return (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ scale: [1.3, 1.4, 1.3], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: `radial-gradient(circle, transparent 60%, ${cyanRing} 80%, transparent 100%)`,
                boxShadow: `0 0 60px ${cyanRing}, 0 0 100px ${cyanRing}`
              }}
            />
            
            <motion.div
              className="absolute inset-0 rounded-full border-4"
              animate={{ 
                scale: [1, 1.05, 1], 
                opacity: [0.8, 1, 0.8],
                rotate: [0, 360]
              }}
              transition={{ 
                scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' }
              }}
              style={{
                borderColor: cyanRing,
                boxShadow: `
                  0 0 10px ${cyanRing},
                  0 0 20px ${cyanRing},
                  0 0 40px ${cyanRing},
                  inset 0 0 20px ${cyanRing}40
                `
              }}
            />
            
            <motion.div
              className="absolute inset-[12%] rounded-full border-3"
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: 0.3
              }}
              style={{
                borderColor: cyanRing,
                borderWidth: '3px',
                boxShadow: `0 0 15px ${cyanRing}, 0 0 30px ${cyanRing}`
              }}
            />
            
            <motion.div
              className="absolute inset-[25%] rounded-full"
              animate={{ 
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity, 
                ease: 'easeInOut'
              }}
              style={{
                background: `radial-gradient(circle, ${whiteCore} 0%, ${magentaCore} 40%, transparent 80%)`,
                boxShadow: `
                  0 0 20px ${whiteCore},
                  0 0 40px ${magentaCore},
                  0 0 60px ${magentaCore},
                  0 0 80px ${magentaCore}40
                `
              }}
            />
            
            <motion.div
              className="absolute inset-[35%] rounded-full"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 0.6, 
                repeat: Infinity, 
                ease: 'easeInOut'
              }}
              style={{
                backgroundColor: whiteCore,
                boxShadow: `
                  0 0 10px ${whiteCore},
                  0 0 20px ${whiteCore},
                  0 0 30px ${magentaCore},
                  0 0 50px ${magentaCore}
                `
              }}
            />

            <svg className="absolute inset-0 w-full h-full -rotate-90 opacity-80">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke={cyanRing}
                strokeWidth="2"
                strokeDasharray={`${progress * 2.8} 280`}
                style={{
                  filter: `drop-shadow(0 0 8px ${cyanRing})`
                }}
              />
            </svg>

            <motion.div 
              className="absolute inset-0"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: cyanRing,
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 30}deg) translateX(${size * 0.4}px)`,
                    boxShadow: `0 0 4px ${cyanRing}`
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [0.8, 1.2, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </motion.div>
          </>
        )
    }
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        left: target.x - size / 2,
        top: target.y - size / 2
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'backOut' }}
      className="absolute cursor-pointer z-0"
      style={{
        width: size,
        height: size
      }}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        {renderSkin()}
      </div>
    </motion.div>
  )
}
