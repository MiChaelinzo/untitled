import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  scale: number
}

interface StreakRewardCelebrationProps {
  onComplete: () => void
  rewardName: string
  rewardIcon?: string
  xpBonus?: number
}

export function StreakRewardCelebration({ 
  onComplete, 
  rewardName, 
  rewardIcon,
  xpBonus 
}: StreakRewardCelebrationProps) {
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([])

  useEffect(() => {
    const colors = ['#FF6B6B', '#FFA500', '#FFD700', '#00D9FF', '#A855F7']
    const particles: ConfettiParticle[] = []
    
    for (let i = 0; i < 50; i++) {
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5
      })
    }
    
    setConfetti(particles)

    const timer = setTimeout(onComplete, 3000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
    >
      {confetti.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: particle.color,
            left: `${particle.x}%`
          }}
          initial={{ 
            y: particle.y,
            rotate: particle.rotation,
            scale: particle.scale,
            opacity: 1
          }}
          animate={{ 
            y: ['0vh', '100vh'],
            rotate: [particle.rotation, particle.rotation + 360],
            opacity: [1, 0]
          }}
          transition={{
            duration: 3,
            ease: 'easeIn',
            delay: Math.random() * 0.5
          }}
        />
      ))}
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10 }}
        className="bg-gradient-to-br from-orange-500/90 to-accent/90 p-12 rounded-2xl border-4 border-yellow-400 shadow-2xl backdrop-blur-sm"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="text-8xl mb-4 text-center"
        >
          {rewardIcon || '🎁'}
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-white text-center mb-2 glow-text"
        >
          Reward Unlocked!
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl text-white/90 text-center font-semibold"
        >
          {rewardName}
        </motion.p>

        {xpBonus && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="mt-4 text-center"
          >
            <div className="inline-block bg-yellow-400/20 px-6 py-3 rounded-full border-2 border-yellow-400">
              <span className="text-3xl font-bold text-yellow-400">+{xpBonus} XP</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
