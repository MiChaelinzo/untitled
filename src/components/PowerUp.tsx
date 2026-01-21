import { motion } from 'framer-motion'
import { PowerUp as PowerUpType } from '@/lib/power-ups'
import { useState, useEffect } from 'react'

interface PowerUpProps {
  powerUp: PowerUpType
  onClick: () => void
}

export function PowerUp({ powerUp, onClick }: PowerUpProps) {
  const [lifePercentage, setLifePercentage] = useState(0)
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - powerUp.spawnTime
      const percentage = Math.min(1, elapsed / powerUp.lifetime)
      setLifePercentage(percentage)
      setIsExpiringSoon(percentage > 0.7)
    }, 50)
    
    return () => clearInterval(interval)
  }, [powerUp.spawnTime, powerUp.lifetime])
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, y: -50 }}
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: 0,
        y: 0
      }}
      exit={{ 
        scale: [1, 0.8, 0],
        rotate: 180,
        opacity: [1, 0.5, 0]
      }}
      transition={{
        scale: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
      whileHover={{ scale: 1.2 }}
      className="absolute cursor-pointer"
      style={{
        left: powerUp.x,
        top: powerUp.y,
        width: powerUp.size,
        height: powerUp.size,
        transform: 'translate(-50%, -50%)',
        zIndex: 50
      }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            backgroundColor: powerUp.color,
            boxShadow: `0 0 40px 10px ${powerUp.color}`
          }}
        />

        <motion.div
          className="absolute inset-0"
          animate={{
            scale: isExpiringSoon ? [1, 1.15, 1] : 1
          }}
          transition={{
            duration: 0.3,
            repeat: isExpiringSoon ? Infinity : 0
          }}
        >
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center text-3xl font-bold"
            style={{
              backgroundColor: powerUp.color,
              color: 'white',
              border: '3px solid rgba(255, 255, 255, 0.6)',
              boxShadow: `0 0 30px ${powerUp.color}, inset 0 0 30px rgba(255, 255, 255, 0.4)`
            }}
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {powerUp.icon}
            </motion.span>
          </div>
        </motion.div>

        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.4)',
            }}
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.5, 0.3, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.66,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}

        <motion.div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: 'transparent',
            borderTopColor: 'rgba(255, 255, 255, 0.8)',
            borderRightColor: 'rgba(255, 255, 255, 0.5)'
          }}
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))' }}
        >
          <circle
            cx="50%"
            cy="50%"
            r="48%"
            fill="none"
            stroke="rgba(255, 0, 0, 0.8)"
            strokeWidth="3"
            strokeDasharray={`${(1 - lifePercentage) * 100} 100`}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dasharray 0.05s linear'
            }}
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1
        }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap pointer-events-none"
      >
        <motion.div 
          className="bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-lg"
          style={{
            border: `2px solid ${powerUp.color}`,
            boxShadow: `0 0 15px ${powerUp.color}`
          }}
          animate={{
            boxShadow: isExpiringSoon 
              ? [`0 0 15px ${powerUp.color}`, `0 0 25px ${powerUp.color}`, `0 0 15px ${powerUp.color}`]
              : `0 0 15px ${powerUp.color}`
          }}
          transition={{
            duration: 0.5,
            repeat: isExpiringSoon ? Infinity : 0
          }}
        >
          {powerUp.name}
        </motion.div>
      </motion.div>

      {[...Array(6)].map((_, i) => {
        const angle = (Math.PI * 2 * i) / 6
        const radius = 35
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: powerUp.color,
              left: '50%',
              top: '50%',
              boxShadow: `0 0 8px ${powerUp.color}`
            }}
            animate={{
              x: [0, Math.cos(angle) * radius, 0],
              y: [0, Math.sin(angle) * radius, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.33,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )
      })}
    </motion.div>
  )
}
