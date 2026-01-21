import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TrailParticle {
  x: number
  y: number
  id: number
  velocity: { x: number; y: number }
  life: number
  size: number
  type: 'normal' | 'burst' | 'streak'
}

interface GameplayMouseTrailProps {
  enabled?: boolean
  combo?: number
  isPaused?: boolean
  color?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GameplayMouseTrail({ 
  enabled = true, 
  combo = 0,
  isPaused = false,
  color = 'primary',
  intensity = 'medium'
}: GameplayMouseTrailProps) {
  const [particles, setParticles] = useState<TrailParticle[]>([])
  const [clickBursts, setClickBursts] = useState<Array<{ x: number; y: number; id: number; combo: number }>>([])
  const idCounter = useRef(0)
  const lastPosition = useRef({ x: 0, y: 0 })
  const lastTime = useRef(Date.now())
  const animationFrameRef = useRef<number | undefined>(undefined)

  const maxParticles = intensity === 'high' ? 40 : intensity === 'medium' ? 25 : 15
  const particleLifespan = 800
  const comboMultiplier = Math.min(1 + (combo / 50), 2.5)

  const getColorForCombo = useCallback((currentCombo: number, baseColor: string) => {
    if (currentCombo >= 50) return 'rgb(255, 100, 200)'
    if (currentCombo >= 30) return 'rgb(150, 100, 255)'
    if (currentCombo >= 15) return 'rgb(100, 200, 255)'
    if (currentCombo >= 5) return 'rgb(100, 255, 180)'
    
    const colorMap: Record<string, string> = {
      primary: 'rgb(100, 150, 255)',
      accent: 'rgb(255, 100, 150)',
      cyan: 'rgb(100, 255, 200)'
    }
    return colorMap[baseColor] || colorMap.primary
  }, [])

  const createParticle = useCallback((x: number, y: number, velocity: { x: number; y: number }, type: 'normal' | 'burst' | 'streak' = 'normal'): TrailParticle => {
    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
    const sizeMultiplier = Math.min(speed / 10, 2)
    const currentId = idCounter.current
    idCounter.current += 1
    
    return {
      x,
      y,
      id: currentId,
      velocity,
      life: 1,
      size: (type === 'burst' ? 1.5 : type === 'streak' ? 2 : 1) * sizeMultiplier * comboMultiplier,
      type
    }
  }, [comboMultiplier])

  useEffect(() => {
    if (!enabled || isPaused) {
      setParticles([])
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const deltaTime = now - lastTime.current
      
      if (deltaTime < 16) return

      const deltaX = e.clientX - lastPosition.current.x
      const deltaY = e.clientY - lastPosition.current.y
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
      
      if (distance > 3) {
        const velocity = {
          x: deltaX / deltaTime * 10,
          y: deltaY / deltaTime * 10
        }
        
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
        const isHighSpeed = speed > 2
        
        const particlesToAdd = isHighSpeed ? Math.ceil(distance / 8) : 1
        
        for (let i = 0; i < particlesToAdd; i++) {
          const t = i / particlesToAdd
          const interpX = lastPosition.current.x + deltaX * t
          const interpY = lastPosition.current.y + deltaY * t
          
          setParticles(prev => {
            const newParticles = [
              ...prev,
              createParticle(
                interpX + (Math.random() - 0.5) * 4,
                interpY + (Math.random() - 0.5) * 4,
                {
                  x: velocity.x * 0.2 + (Math.random() - 0.5) * 2,
                  y: velocity.y * 0.2 + (Math.random() - 0.5) * 2
                },
                isHighSpeed ? 'streak' : 'normal'
              )
            ]
            return newParticles.slice(-maxParticles)
          })
        }
        
        lastPosition.current = { x: e.clientX, y: e.clientY }
        lastTime.current = now
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      const burstCount = Math.min(8 + Math.floor(combo / 5), 20)
      
      for (let i = 0; i < burstCount; i++) {
        const angle = (Math.PI * 2 * i) / burstCount
        const speed = 3 + Math.random() * 2
        
        setParticles(prev => [
          ...prev,
          createParticle(
            e.clientX,
            e.clientY,
            {
              x: Math.cos(angle) * speed,
              y: Math.sin(angle) * speed
            },
            'burst'
          )
        ])
      }
      
      const currentId = idCounter.current
      idCounter.current += 1
      
      setClickBursts(prev => [
        ...prev,
        { x: e.clientX, y: e.clientY, id: currentId, combo }
      ])
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
    }
  }, [enabled, isPaused, combo, createParticle, maxParticles])

  useEffect(() => {
    if (!enabled || isPaused || particles.length === 0) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      return
    }

    const updateParticles = () => {
      setParticles(prev => {
        const now = Date.now()
        return prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocity.x,
            y: particle.y + particle.velocity.y,
            velocity: {
              x: particle.velocity.x * 0.95,
              y: particle.velocity.y * 0.95
            },
            life: particle.life - (1 / (particleLifespan / 16))
          }))
          .filter(particle => particle.life > 0)
      })
      
      animationFrameRef.current = requestAnimationFrame(updateParticles)
    }

    animationFrameRef.current = requestAnimationFrame(updateParticles)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [enabled, isPaused, particles.length, particleLifespan])

  if (!enabled) return null

  const currentColor = getColorForCombo(combo, color)

  return (
    <>
      <svg className="fixed inset-0 pointer-events-none z-40" style={{ mixBlendMode: 'screen' }}>
        <defs>
          <radialGradient id="particle-gradient-normal">
            <stop offset="0%" stopColor={currentColor} stopOpacity="0.8" />
            <stop offset="100%" stopColor={currentColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="particle-gradient-burst">
            <stop offset="0%" stopColor={currentColor} stopOpacity="1" />
            <stop offset="50%" stopColor={currentColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={currentColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="particle-gradient-streak">
            <stop offset="0%" stopColor={currentColor} stopOpacity="1" />
            <stop offset="100%" stopColor={currentColor} stopOpacity="0.3" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {particles.map(particle => {
          const opacity = Math.pow(particle.life, 1.5)
          const size = particle.size * 8 * (particle.type === 'streak' ? 1.5 : 1)
          const gradientId = `particle-gradient-${particle.type}`
          
          return (
            <circle
              key={particle.id}
              cx={particle.x}
              cy={particle.y}
              r={size}
              fill={`url(#${gradientId})`}
              opacity={opacity}
              filter={particle.type === 'burst' ? 'url(#glow)' : undefined}
            />
          )
        })}
        
        {particles.length > 5 && (
          <path
            d={`M ${particles.slice(-10).map(p => `${p.x},${p.y}`).join(' L ')}`}
            fill="none"
            stroke={currentColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
        )}
      </svg>

      <AnimatePresence>
        {clickBursts.map(burst => (
          <motion.div
            key={burst.id}
            className="fixed pointer-events-none z-40"
            style={{
              left: burst.x,
              top: burst.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2 + (burst.combo / 20), opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onAnimationComplete={() => {
              setClickBursts(prev => prev.filter(b => b.id !== burst.id))
            }}
          >
            <div
              className="rounded-full"
              style={{
                width: 40 + burst.combo * 2,
                height: 40 + burst.combo * 2,
                border: `2px solid ${currentColor}`,
                boxShadow: `0 0 20px ${currentColor}, inset 0 0 20px ${currentColor}`
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {combo > 0 && combo % 10 === 0 && (
          <motion.div
            className="fixed top-1/2 left-1/2 pointer-events-none z-40 text-center"
            style={{ transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 180 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <div 
              className="text-6xl font-bold"
              style={{ 
                color: currentColor,
                textShadow: `0 0 20px ${currentColor}, 0 0 40px ${currentColor}, 0 0 60px ${currentColor}`
              }}
            >
              {combo}x
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
