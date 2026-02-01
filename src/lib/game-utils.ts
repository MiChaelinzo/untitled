import { Target } from './game-types'

export function generateRandomTarget(
  containerWidth: number,
  containerHeight: number,
  duration: number,
  targetSize: number = 80
): Target {
  const padding = targetSize / 2 + 20
  
  const x = padding + Math.random() * (containerWidth - 2 * padding)
  const y = padding + Math.random() * (containerHeight - 2 * padding)

  return {
    id: `target-${Date.now()}-${Math.random()}`,
    x,
    y,
    spawnTime: Date.now(),
    duration
  }
}

export function calculateScore(reactionTime: number, duration: number, difficultyMultiplier: number = 1): number {
  const ratio = reactionTime / duration
  const baseScore = Math.max(100, Math.floor(1000 * (1 - ratio)))
  return Math.floor(baseScore * difficultyMultiplier)
}

export function formatTime(ms: number): string {
  return (ms / 1000).toFixed(2) + 's'
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}
