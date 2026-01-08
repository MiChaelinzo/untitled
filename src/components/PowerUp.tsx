import { motion } from 'framer-motion'
import { PowerUp as PowerUpType } from '@/lib/power-ups'

interface PowerUpProps {
  powerUp: PowerUpType
  onClick: () => void
}

export function PowerUp({ powerUp, onClick }: PowerUpProps) {
  const lifePercentage = Math.min(1, (Date.now() - powerUp.spawnTime) / powerUp.lifetime)
  
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        rotate: 0,
        y: [0, -10, 0]
      }}
      exit={{ scale: 0, rotate: 180, opacity: 0 }}
      className="absolute cursor-pointer"
      style={{
        left: powerUp.x,
        top: powerUp.y,
        width: powerUp.size,
        height: powerUp.size,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60"
          style={{
            backgroundColor: powerUp.color,
            boxShadow: `0 0 30px ${powerUp.color}`
          }}
        />
        
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center text-3xl font-bold glow-box"
          style={{
            backgroundColor: powerUp.color,
            color: 'white',
            border: '3px solid rgba(255, 255, 255, 0.5)',
            boxShadow: `0 0 20px ${powerUp.color}, inset 0 0 20px rgba(255, 255, 255, 0.3)`
          }}
        >
          {powerUp.icon}
        </div>

        <motion.div
          className="absolute inset-0 rounded-full border-4"
          style={{
            borderColor: 'rgba(255, 255, 255, 0.7)',
            borderTopColor: 'transparent'
          }}
          animate={{
            rotate: -360
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />

        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(transparent ${lifePercentage * 360}deg, rgba(255, 255, 255, 0.3) ${lifePercentage * 360}deg)`,
            opacity: 0.5
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap"
      >
        <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white border border-white/20">
          {powerUp.name}
        </div>
      </motion.div>
    </motion.div>
  )
}
