import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface DynamicBackgroundProps {
  variant?: 'particles' | 'waves' | 'grid' | 'nebula' | 'matrix' | 'aurora' | 'constellation' | 'hexagon' | 'spirals' | 'binary-rain' | 'geometric'
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
    let auroraLayers: AuroraLayer[] = []
    let stars: Star[] = []
    let hexagons: Hexagon[] = []
    let spirals: Spiral[] = []
    let binaryDrops: BinaryDrop[] = []
    let geometricShapes: GeometricShape[] = []

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
        this.size = Math.random() * 1.5 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.15
        this.speedY = (Math.random() - 0.5) * 0.15
        this.opacity = Math.random() * 0.3 + 0.1
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
        
        ctx.shadowBlur = 8
        ctx.shadowColor = `rgba(100, 150, 255, ${this.opacity * 0.5})`
        ctx.fill()
        ctx.shadowBlur = 0
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

    class AuroraLayer {
      y: number
      amplitude: number
      frequency: number
      phase: number
      speed: number
      height: number
      color1: string
      color2: string

      constructor(index: number) {
        if (!canvas) return
        this.y = canvas.height * 0.3 + index * 50
        this.amplitude = 60 + Math.random() * 40
        this.frequency = 0.001 + Math.random() * 0.001
        this.phase = Math.random() * Math.PI * 2
        this.speed = 0.005 + Math.random() * 0.01
        this.height = 100 + Math.random() * 150
        const hue1 = 150 + index * 30
        const hue2 = hue1 + 40
        this.color1 = `hsla(${hue1}, 70%, 60%, 0.15)`
        this.color2 = `hsla(${hue2}, 70%, 50%, 0.1)`
      }

      update() {
        this.phase += this.speed
      }

      draw() {
        if (!ctx || !canvas) return
        const gradient = ctx.createLinearGradient(0, this.y, 0, this.y + this.height)
        gradient.addColorStop(0, this.color1)
        gradient.addColorStop(0.5, this.color2)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = this.y + Math.sin(x * this.frequency + this.phase) * this.amplitude
          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.lineTo(canvas.width, this.y + this.height)
        ctx.lineTo(0, this.y + this.height)
        ctx.closePath()
        ctx.fill()
      }
    }

    class Star {
      x: number
      y: number
      size: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1.5 + 0.5
        this.opacity = Math.random() * 0.6 + 0.3
        this.twinkleSpeed = 0.008 + Math.random() * 0.012
        this.twinklePhase = Math.random() * Math.PI * 2
      }

      update() {
        this.twinklePhase += this.twinkleSpeed
        this.opacity = 0.3 + Math.sin(this.twinklePhase) * 0.3
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = `rgba(220, 230, 255, ${this.opacity})`
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 6
        ctx.shadowColor = `rgba(220, 230, 255, ${this.opacity * 0.8})`
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    class Hexagon {
      x: number
      y: number
      size: number
      rotation: number
      rotationSpeed: number
      opacity: number
      pulsePhase: number
      pulseSpeed: number

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 30 + 20
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.01
        this.opacity = Math.random() * 0.2 + 0.1
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.02 + Math.random() * 0.02
      }

      update() {
        this.rotation += this.rotationSpeed
        this.pulsePhase += this.pulseSpeed
        this.opacity = 0.1 + Math.sin(this.pulsePhase) * 0.1
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        ctx.strokeStyle = `rgba(100, 150, 255, ${this.opacity})`
        ctx.lineWidth = 1.5
        ctx.beginPath()
        
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i
          const x = Math.cos(angle) * this.size
          const y = Math.sin(angle) * this.size
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      }
    }

    class Spiral {
      centerX: number
      centerY: number
      angle: number
      radius: number
      maxRadius: number
      rotationSpeed: number
      expansionSpeed: number
      color: string
      opacity: number

      constructor() {
        if (!canvas) return
        this.centerX = Math.random() * canvas.width
        this.centerY = Math.random() * canvas.height
        this.angle = 0
        this.radius = 0
        this.maxRadius = 150 + Math.random() * 100
        this.rotationSpeed = 0.05 + Math.random() * 0.03
        this.expansionSpeed = 0.5 + Math.random() * 0.3
        const hue = Math.random() * 60 + 180
        this.color = `hsl(${hue}, 70%, 60%)`
        this.opacity = 0.3
      }

      update() {
        this.angle += this.rotationSpeed
        this.radius += this.expansionSpeed
        
        if (this.radius > this.maxRadius) {
          this.radius = 0
          this.angle = 0
        }
      }

      draw() {
        if (!ctx) return
        ctx.strokeStyle = `${this.color.replace(')', `, ${this.opacity})`)}`
        ctx.lineWidth = 2
        ctx.beginPath()
        
        for (let i = 0; i < this.radius; i += 5) {
          const currentAngle = this.angle + (i / this.radius) * Math.PI * 4
          const currentRadius = (i / this.radius) * this.maxRadius
          const x = this.centerX + Math.cos(currentAngle) * currentRadius
          const y = this.centerY + Math.sin(currentAngle) * currentRadius
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }
    }

    class BinaryDrop {
      x: number
      y: number
      speed: number
      length: number
      chars: string[]
      fontSize: number
      glowIntensity: number

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height - canvas.height
        this.speed = Math.random() * 4 + 3
        this.length = Math.floor(Math.random() * 15) + 10
        this.fontSize = 16
        this.chars = []
        this.glowIntensity = Math.random() * 0.5 + 0.5
        
        for (let i = 0; i < this.length; i++) {
          this.chars.push(Math.random() > 0.5 ? '1' : '0')
        }
      }

      update() {
        if (!canvas) return
        this.y += this.speed
        
        if (Math.random() > 0.95) {
          const randomIndex = Math.floor(Math.random() * this.chars.length)
          this.chars[randomIndex] = Math.random() > 0.5 ? '1' : '0'
        }
        
        if (this.y > canvas.height + this.length * this.fontSize) {
          this.y = -this.length * this.fontSize
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.font = `bold ${this.fontSize}px monospace`
        
        this.chars.forEach((char, i) => {
          const alpha = (1 - (i / this.chars.length)) * 0.8
          const y = this.y + i * this.fontSize
          
          if (i === 0) {
            ctx.shadowBlur = 10 * this.glowIntensity
            ctx.shadowColor = `rgba(0, 255, 150, ${alpha})`
            ctx.fillStyle = `rgba(150, 255, 200, ${alpha})`
          } else {
            ctx.shadowBlur = 0
            ctx.fillStyle = `rgba(0, 255, 150, ${alpha * 0.5})`
          }
          
          ctx.fillText(char, this.x, y)
        })
        
        ctx.shadowBlur = 0
      }
    }

    class GeometricShape {
      x: number
      y: number
      size: number
      type: 'triangle' | 'square' | 'pentagon' | 'circle'
      rotation: number
      rotationSpeed: number
      speedX: number
      speedY: number
      opacity: number
      pulsePhase: number
      pulseSpeed: number
      color: string

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 40 + 20
        const types: ('triangle' | 'square' | 'pentagon' | 'circle')[] = ['triangle', 'square', 'pentagon', 'circle']
        this.type = types[Math.floor(Math.random() * types.length)]
        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.02
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.3 + 0.1
        this.pulsePhase = Math.random() * Math.PI * 2
        this.pulseSpeed = 0.02 + Math.random() * 0.02
        const hue = Math.random() * 360
        this.color = `hsl(${hue}, 70%, 60%)`
      }

      update() {
        if (!canvas) return
        this.x += this.speedX
        this.y += this.speedY
        this.rotation += this.rotationSpeed
        this.pulsePhase += this.pulseSpeed
        
        if (this.x < -this.size) this.x = canvas.width + this.size
        if (this.x > canvas.width + this.size) this.x = -this.size
        if (this.y < -this.size) this.y = canvas.height + this.size
        if (this.y > canvas.height + this.size) this.y = -this.size
      }

      draw() {
        if (!ctx) return
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)
        
        const currentOpacity = this.opacity + Math.sin(this.pulsePhase) * 0.1
        ctx.strokeStyle = `${this.color.replace(')', `, ${currentOpacity})`)}`
        ctx.lineWidth = 2
        ctx.beginPath()
        
        if (this.type === 'triangle') {
          for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 / 3) * i - Math.PI / 2
            const x = Math.cos(angle) * this.size
            const y = Math.sin(angle) * this.size
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
        } else if (this.type === 'square') {
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size)
        } else if (this.type === 'pentagon') {
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 / 5) * i - Math.PI / 2
            const x = Math.cos(angle) * this.size
            const y = Math.sin(angle) * this.size
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
        } else if (this.type === 'circle') {
          ctx.arc(0, 0, this.size, 0, Math.PI * 2)
        }
        
        ctx.stroke()
        ctx.restore()
      }
    }

    if (variant === 'particles') {
      particles = Array.from({ length: 50 }, () => new Particle())
    } else if (variant === 'waves') {
      waves = Array.from({ length: 3 }, (_, i) => new Wave(i))
    } else if (variant === 'grid') {
      for (let i = 0; i <= 15; i++) {
        gridLines.push(new GridLine(true, i))
        gridLines.push(new GridLine(false, i))
      }
    } else if (variant === 'matrix') {
      matrixColumns = Array.from({ length: 25 }, () => new MatrixColumn())
    } else if (variant === 'aurora') {
      auroraLayers = Array.from({ length: 3 }, (_, i) => new AuroraLayer(i))
    } else if (variant === 'constellation') {
      stars = Array.from({ length: 150 }, () => new Star())
    } else if (variant === 'hexagon') {
      hexagons = Array.from({ length: 15 }, () => new Hexagon())
    } else if (variant === 'spirals') {
      spirals = Array.from({ length: 4 }, () => new Spiral())
    } else if (variant === 'binary-rain') {
      binaryDrops = Array.from({ length: 30 }, () => new BinaryDrop())
    } else if (variant === 'geometric') {
      geometricShapes = Array.from({ length: 20 }, () => new GeometricShape())
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
              ctx.strokeStyle = `rgba(100, 150, 255, ${0.08 * (1 - distance / 100)})`
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
        const time = Date.now() * 0.0001
        const gradient = ctx.createRadialGradient(
          canvas.width / 2 + Math.sin(time) * 100,
          canvas.height / 2 + Math.cos(time) * 100,
          0,
          canvas.width / 2,
          canvas.height / 2,
          Math.max(canvas.width, canvas.height) * 0.6
        )
        gradient.addColorStop(0, 'rgba(120, 80, 200, 0.08)')
        gradient.addColorStop(0.3, 'rgba(80, 120, 255, 0.05)')
        gradient.addColorStop(0.6, 'rgba(100, 100, 200, 0.03)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        for (let i = 0; i < 80; i++) {
          const x = (Math.sin(time * 0.3 + i * 0.5) * canvas.width * 0.3) + canvas.width / 2
          const y = (Math.cos(time * 0.2 + i * 0.3) * canvas.height * 0.3) + canvas.height / 2
          const size = Math.random() * 1.5 + 0.5
          const opacity = (Math.sin(time * 2 + i) * 0.15) + 0.25
          
          ctx.fillStyle = `rgba(220, 230, 255, ${opacity})`
          ctx.shadowBlur = 4
          ctx.shadowColor = `rgba(220, 230, 255, ${opacity * 0.5})`
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      } else if (variant === 'matrix') {
        matrixColumns.forEach(col => {
          col.update()
          col.draw()
        })
      } else if (variant === 'aurora') {
        auroraLayers.forEach(layer => {
          layer.update()
          layer.draw()
        })
      } else if (variant === 'constellation') {
        stars.forEach(star => {
          star.update()
          star.draw()
        })

        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x
            const dy = stars[i].y - stars[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 150) {
              ctx.strokeStyle = `rgba(220, 230, 255, ${0.05 * (1 - distance / 150)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(stars[i].x, stars[i].y)
              ctx.lineTo(stars[j].x, stars[j].y)
              ctx.stroke()
            }
          }
        }
      } else if (variant === 'hexagon') {
        hexagons.forEach(hex => {
          hex.update()
          hex.draw()
        })
      } else if (variant === 'spirals') {
        spirals.forEach(spiral => {
          spiral.update()
          spiral.draw()
        })
      } else if (variant === 'binary-rain') {
        binaryDrops.forEach(drop => {
          drop.update()
          drop.draw()
        })
      } else if (variant === 'geometric') {
        geometricShapes.forEach(shape => {
          shape.update()
          shape.draw()
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

  const getThemeColors = () => {
    const natureThemes = ['waves', 'aurora', 'spirals']
    const techThemes = ['grid', 'matrix', 'binary-rain', 'hexagon', 'geometric']
    const spaceThemes = ['constellation', 'nebula', 'particles']

    if (natureThemes.includes(variant)) {
      return {
        color1: 'bg-emerald-500/20',
        color2: 'bg-teal-500/20',
        color3: 'bg-cyan-400/15'
      }
    } else if (spaceThemes.includes(variant)) {
      return {
        color1: 'bg-purple-500/20',
        color2: 'bg-indigo-500/20',
        color3: 'bg-blue-400/15'
      }
    } else if (techThemes.includes(variant)) {
      return {
        color1: 'bg-primary/20',
        color2: 'bg-accent/20',
        color3: 'bg-cyan/15'
      }
    }
    
    return {
      color1: 'bg-primary/20',
      color2: 'bg-accent/20',
      color3: 'bg-cyan/15'
    }
  }

  const colors = getThemeColors()

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
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${colors.color1} rounded-full blur-3xl opacity-30`} />
        <div 
          className={`absolute bottom-1/4 right-1/4 w-96 h-96 ${colors.color2} rounded-full blur-3xl opacity-25`}
        />
        <div 
          className={`absolute top-1/2 right-1/3 w-80 h-80 ${colors.color3} rounded-full blur-3xl opacity-20`}
        />
      </motion.div>
    </>
  )
}
