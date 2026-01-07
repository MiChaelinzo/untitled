import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DynamicBackgroundProps {
  variant?: 'particles' | 'waves' | 'grid' | 'nebula' | 'matrix'
}

export function DynamicBackground({ variant = 'particles' }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number
    let particles: Particle[] = []
    let waves: Wave[] = []
    let gridLines: GridLine[] = []
    let matrixColumns: MatrixColumn[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number

      constructor() {
        if (!canvas) {
          this.x = 0
          this.y = 0
          this.size = 0
          this.speedX = 0
          this.speedY = 0
          this.opacity = 0
          return
        }
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (!canvas) return
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(100, 150, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Wave {
      y: number
      amplitude: number
      frequency: number
      phase: number
      speed: number
      color: string

      constructor(index: number) {
        if (!canvas) return
        this.y = canvas.height * 0.5 + index * 80
        this.amplitude = 40 + Math.random() * 30
        this.frequency = 0.002 + Math.random() * 0.001
        this.phase = Math.random() * Math.PI * 2
        this.speed = 0.01 + Math.random() * 0.02
        const hue = 200 + index * 20
        this.color = `hsla(${hue}, 70%, 60%, 0.15)`
      }

      update() {
        this.phase += this.speed
      }

      draw() {
        if (!ctx || !canvas) return
        ctx.strokeStyle = this.color
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x += 5) {
          const y = this.y + Math.sin(x * this.frequency + this.phase) * this.amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }
    }

    class GridLine {
      x: number
      y: number
      isVertical: boolean
      opacity: number
      pulseSpeed: number
      pulsePhase: number

      constructor(isVertical: boolean, index: number) {
        this.isVertical = isVertical
        if (!canvas) return
        this.x = isVertical ? (canvas.width / 20) * index : 0
        this.y = isVertical ? 0 : (canvas.height / 20) * index
        this.opacity = 0.1
        this.pulseSpeed = 0.02 + Math.random() * 0.03
        this.pulsePhase = Math.random() * Math.PI * 2
      }

      update() {
        this.pulsePhase += this.pulseSpeed
        this.opacity = 0.05 + Math.sin(this.pulsePhase) * 0.05
      }

      draw() {
        if (!ctx || !canvas) return
        ctx.strokeStyle = `rgba(100, 150, 255, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        if (this.isVertical) {
          ctx.moveTo(this.x, 0)
          ctx.lineTo(this.x, canvas.height)
        } else {
          ctx.moveTo(0, this.y)
          ctx.lineTo(canvas.width, this.y)
        }
        ctx.stroke()
      }
    }

    class MatrixColumn {
      x: number
      y: number
      speed: number
      chars: string[]
      fontSize: number

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.speed = Math.random() * 3 + 2
        this.fontSize = 14
        this.chars = this.generateChars()
      }

      generateChars(): string[] {
        const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const result: string[] = []
        for (let i = 0; i < 20; i++) {
          result.push(chars[Math.floor(Math.random() * chars.length)])
        }
        return result
      }

      update() {
        if (!canvas) return
        this.y += this.speed
        if (this.y > canvas.height) {
          this.y = -this.fontSize * this.chars.length
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.font = `${this.fontSize}px monospace`
        this.chars.forEach((char, i) => {
          const alpha = 1 - (i / this.chars.length)
          ctx.fillStyle = `rgba(100, 255, 150, ${alpha * 0.3})`
          ctx.fillText(char, this.x, this.y + i * this.fontSize)
        })
      }
    }

    if (variant === 'particles') {
      particles = Array.from({ length: 100 }, () => new Particle())
    } else if (variant === 'waves') {
      waves = Array.from({ length: 5 }, (_, i) => new Wave(i))
    } else if (variant === 'grid') {
      for (let i = 0; i <= 20; i++) {
        gridLines.push(new GridLine(true, i))
        gridLines.push(new GridLine(false, i))
      }
    } else if (variant === 'matrix') {
      matrixColumns = Array.from({ length: 50 }, () => new MatrixColumn())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (variant === 'particles') {
        particles.forEach(particle => {
          particle.update()
          particle.draw()
        })

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.strokeStyle = `rgba(100, 150, 255, ${0.15 * (1 - distance / 100)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      } else if (variant === 'waves') {
        waves.forEach(wave => {
          wave.update()
          wave.draw()
        })
      } else if (variant === 'grid') {
        gridLines.forEach(line => {
          line.update()
          line.draw()
        })
      } else if (variant === 'nebula') {
        const gradient = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        )
        gradient.addColorStop(0, 'rgba(100, 50, 200, 0.1)')
        gradient.addColorStop(0.5, 'rgba(50, 100, 255, 0.05)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else if (variant === 'matrix') {
        matrixColumns.forEach(col => {
          col.update()
          col.draw()
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [variant])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '1s' }} 
        />
        <div 
          className="absolute top-1/2 right-1/3 w-80 h-80 bg-cyan/15 rounded-full blur-3xl animate-pulse" 
          style={{ animationDelay: '2s' }} 
        />
      </motion.div>
    </>
  )
}
