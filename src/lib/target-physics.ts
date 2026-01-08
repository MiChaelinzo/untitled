import { EventTarget } from './event-game-modes'

export interface Vector2D {
  x: number
  y: number
}

export interface PhysicsTarget extends EventTarget {
  velocity: Vector2D
  acceleration: Vector2D
  mass: number
  friction: number
  lastUpdateTime: number
}

export interface PhysicsConfig {
  gravity: number
  friction: number
  bounceDamping: number
  minSpeed: number
  maxSpeed: number
}

export const OCEAN_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 0,
  friction: 0.98,
  bounceDamping: 0.8,
  minSpeed: 0.1,
  maxSpeed: 2.5
}

export const COSMIC_PHYSICS_CONFIG: PhysicsConfig = {
  gravity: 0,
  friction: 0.99,
  bounceDamping: 0.95,
  minSpeed: 0.05,
  maxSpeed: 1.8
}

export function createPhysicsTarget(
  baseTarget: EventTarget,
  config: PhysicsConfig,
  type: 'ocean' | 'cosmic'
): PhysicsTarget {
  let velocity: Vector2D
  
  if (type === 'ocean') {
    velocity = {
      x: (Math.random() - 0.5) * 1.5,
      y: Math.sin(Date.now() / 1000 + Math.random() * Math.PI * 2) * 0.8
    }
  } else {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 0.8 + 0.3
    velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    }
  }

  return {
    ...baseTarget,
    velocity,
    acceleration: { x: 0, y: 0 },
    mass: 1,
    friction: config.friction,
    lastUpdateTime: Date.now()
  }
}

export function updatePhysicsTarget(
  target: PhysicsTarget,
  config: PhysicsConfig,
  bounds: { width: number; height: number },
  deltaTime: number,
  type: 'ocean' | 'cosmic'
): PhysicsTarget {
  const dt = deltaTime / 16.67

  let { x, y } = target
  let { velocity, acceleration } = target

  if (type === 'ocean') {
    const time = Date.now() / 1000
    const waveOffset = Math.sin(time * 2 + x / 100) * 0.3
    acceleration.y += waveOffset
    
    const currentFlow = Math.sin(time * 0.5) * 0.5
    velocity.x += currentFlow * 0.02
    
    const buoyancy = Math.sin(time * 3 + target.id.charCodeAt(0)) * 0.1
    velocity.y += buoyancy * 0.05
  } else if (type === 'cosmic') {
    const centerX = bounds.width / 2
    const centerY = bounds.height / 2
    
    const dx = x - centerX
    const dy = y - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 50) {
      const orbitalForce = 0.0002
      acceleration.x -= (dx / distance) * orbitalForce
      acceleration.y -= (dy / distance) * orbitalForce
    }
  }

  velocity.x += acceleration.x * dt
  velocity.y += acceleration.y * dt

  velocity.x *= config.friction
  velocity.y *= config.friction

  const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2)
  if (speed > config.maxSpeed) {
    velocity.x = (velocity.x / speed) * config.maxSpeed
    velocity.y = (velocity.y / speed) * config.maxSpeed
  } else if (speed < config.minSpeed && speed > 0.001) {
    velocity.x = (velocity.x / speed) * config.minSpeed
    velocity.y = (velocity.y / speed) * config.minSpeed
  }

  x += velocity.x * dt
  y += velocity.y * dt

  const targetRadius = 40
  
  if (x - targetRadius < 0) {
    x = targetRadius
    velocity.x = Math.abs(velocity.x) * config.bounceDamping
  } else if (x + targetRadius > bounds.width) {
    x = bounds.width - targetRadius
    velocity.x = -Math.abs(velocity.x) * config.bounceDamping
  }

  if (y - targetRadius < 0) {
    y = targetRadius
    velocity.y = Math.abs(velocity.y) * config.bounceDamping
  } else if (y + targetRadius > bounds.height) {
    y = bounds.height - targetRadius
    velocity.y = -Math.abs(velocity.y) * config.bounceDamping
  }

  acceleration.x *= 0.95
  acceleration.y *= 0.95

  return {
    ...target,
    x,
    y,
    velocity,
    acceleration,
    lastUpdateTime: Date.now()
  }
}

export function applyImpulse(
  target: PhysicsTarget,
  impulse: Vector2D,
  origin: Vector2D
): PhysicsTarget {
  const dx = target.x - origin.x
  const dy = target.y - origin.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance < 150) {
    const force = 1 - (distance / 150)
    const angle = Math.atan2(dy, dx)
    
    return {
      ...target,
      velocity: {
        x: target.velocity.x + Math.cos(angle) * impulse.x * force,
        y: target.velocity.y + Math.sin(angle) * impulse.y * force
      }
    }
  }

  return target
}

export function applyWavePattern(
  targets: PhysicsTarget[],
  time: number,
  waveConfig: { amplitude: number; frequency: number; speed: number }
): PhysicsTarget[] {
  return targets.map((target, index) => {
    const phase = index * 0.5
    const waveY = Math.sin(time * waveConfig.speed + phase) * waveConfig.amplitude
    
    return {
      ...target,
      acceleration: {
        ...target.acceleration,
        y: target.acceleration.y + waveY * 0.001
      }
    }
  })
}

export function applyOrbitalMotion(
  targets: PhysicsTarget[],
  centerPoint: Vector2D,
  orbitalSpeed: number
): PhysicsTarget[] {
  return targets.map(target => {
    const dx = target.x - centerPoint.x
    const dy = target.y - centerPoint.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance > 10) {
      const angle = Math.atan2(dy, dx)
      const perpAngle = angle + Math.PI / 2
      
      const tangentialForce = orbitalSpeed / distance
      
      return {
        ...target,
        acceleration: {
          x: target.acceleration.x + Math.cos(perpAngle) * tangentialForce,
          y: target.acceleration.y + Math.sin(perpAngle) * tangentialForce
        }
      }
    }
    
    return target
  })
}
