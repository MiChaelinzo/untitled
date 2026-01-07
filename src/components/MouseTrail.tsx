import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TrailPoint {
  x: number
  y: number
  id: number
}

interface MouseTrailProps {
  enabled?: boolean
  variant?: 'dots' | 'glow' | 'sparkle' | 'line'
  color?: string
}

export function MouseTrail({ enabled = true, variant = 'glow', color = 'primary' }: MouseTrailProps) {
  const [trail, setTrail] = useState<TrailPoint[]>([])

  useEffect(() => {
    if (!enabled) return

    let idCounter = 0
    let lastX = 0
    let lastY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      )

      if (distance > 5) {
        lastX = e.clientX
        lastY = e.clientY

        setTrail(prev => {
          const newPoint: TrailPoint = {
            x: e.clientX,
            y: e.clientY,
            id: idCounter++
          }
          const updated = [...prev, newPoint].slice(-20)
          return updated
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled])

  if (!enabled) return null

  const colorMap: Record<string, string> = {
    primary: 'rgb(100, 150, 255)',
    accent: 'rgb(255, 100, 150)',
    cyan: 'rgb(100, 255, 200)'
  }

  const trailColor = colorMap[color] || colorMap.primary

  if (variant === 'line') {
    return (
      <svg className="fixed inset-0 pointer-events-none z-50">
        <motion.path
          d={trail.length > 1 ? `M ${trail.map(p => `${p.x},${p.y}`).join(' L ')}` : ''}
          fill="none"
          stroke={trailColor}
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    )
  }

  return (
    <AnimatePresence>
      {trail.map((point, index) => {
        const opacity = (index / trail.length) * 0.8
        const scale = (index / trail.length) * 0.6 + 0.4

        if (variant === 'dots') {
          return (
            <motion.div
              key={point.id}
              className="fixed rounded-full pointer-events-none z-50"
              style={{
                left: point.x,
                top: point.y,
                width: 8,
                height: 8,
                backgroundColor: trailColor,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity, scale }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            />
          )
        }

        if (variant === 'sparkle') {
          return (
            <motion.div
              key={point.id}
              className="fixed pointer-events-none z-50"
              style={{
                left: point.x,
                top: point.y,
                transform: 'translate(-50%, -50%)'
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{ opacity, scale, rotate: 360 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path
                  d="M8 0 L9 7 L16 8 L9 9 L8 16 L7 9 L0 8 L7 7 Z"
                  fill={trailColor}
                  opacity={opacity}
                />
              </svg>
            </motion.div>
          )
        }

        return (
          <motion.div
            key={point.id}
            className="fixed rounded-full pointer-events-none z-50"
            style={{
              left: point.x,
              top: point.y,
              width: 24 * scale,
              height: 24 * scale,
              backgroundColor: trailColor,
              filter: 'blur(8px)',
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: opacity * 0.5, scale }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4 }}
          />
        )
      })}
    </AnimatePresence>
  )
}
