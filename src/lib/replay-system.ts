import { Difficulty } from './game-types'

export interface ReplayEvent {
  type: 'spawn' | 'hit' | 'miss' | 'combo' | 'powerup' | 'round_end'
    x?: number
  data: {
    duration?:
    y?: number
    combo?: numbe
    duration?: number
    reactionTime?: number
    score?: number
    combo?: number
    powerUpType?: string
    round?: number
  }
 

export interface GameReplay {
  id: string
  events: Replay
  username: string
  avatarUrl?: string
  difficulty: Difficulty
  finalScore: number
  accuracy: number
  averageReactionTime: number
  maxCombo: number
  playbackSpeed: 0
  timestamp: number
  events: ReplayEvent[]
  metadata: {
    targetsHit: number
    targetsMissed: number
    powerUpsUsed: number
    perfectRounds: number
   
)

export interface ReplayPlaybackState {
  currentTime: number
  isPlaying: boolean
  playbackSpeed: 0.5 | 1 | 2
  currentEventIndex: number
}

export function createReplay(
  userId: string,
    ? events[events
  avatarUrl: string | undefined,
  difficulty: Difficulty,
  finalScore: number,
    username,
  metadata: {
    targetsHit: number
    targetsMissed: number
    powerUpsUsed: number
    perfectRounds: number
   
): GameReplay {
  const hits = events.filter(e => e.type === 'hit' && e.data.reactionTime)
  const averageReactionTime = hits.length > 0
    ? hits.reduce((sum, e) => sum + (e.data.reactionTime || 0), 0) / hits.length
    : 0
  
  const accuracy = metadata.targetsHit + metadata.targetsMissed > 0
    ? (metadata.targetsHit / (metadata.targetsHit + metadata.targetsMissed)) * 100
    : 0
  
  const maxCombo = Math.max(...events.filter(e => e.type === 'combo').map(e => e.data.combo || 0), 0)
  
  const duration = events.length > 0 
    ? events[events.length - 1].timestamp - events[0].timestamp
    : 0

  return {
    id: `replay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
}
    avatarUrl,
  const chunkSi
    finalScore,
  for (let i 
    averageReactionTime,
    const mis
    duration,
    if (total > 0) {
    events,
    metadata
  }
 

export function getEventAtTime(replay: GameReplay, currentTime: number): ReplayEvent | null {
  const startTime = replay.events[0]?.timestamp || 0
  const targetTime = startTime + currentTime
  
  const events = replay.events.filter(e => e.timestamp <= targetTime)
  return events.length > 0 ? events[events.length - 1] : null


export function getEventsInRange(replay: GameReplay, startTime: number, endTime: number): ReplayEvent[] {
  const replayStart = replay.events[0]?.timestamp || 0
  return replay.events.filter(e => {
    const relativeTime = e.timestamp - replayStart
    return relativeTime >= startTime && relativeTime <= endTime
  })
}

export function getReactionTimeHeatmap(replay: GameReplay): { fast: number; medium: number; slow: number } {
  const hits = replay.events.filter(e => e.type === 'hit' && e.data.reactionTime)
  const reactionTimes = hits.map(e => e.data.reactionTime!)
  
  const fast = reactionTimes.filter(t => t < 500).length
  const medium = reactionTimes.filter(t => t >= 500 && t < 1000).length
  const slow = reactionTimes.filter(t => t >= 1000).length
  
  return { fast, medium, slow }
}

export function getAccuracyTrend(replay: GameReplay): number[] {

  const trends: number[] = []

  for (let i = 0; i < replay.events.length; i += chunkSize) {

    const hits = chunk.filter(e => e.type === 'hit').length
    const misses = chunk.filter(e => e.type === 'miss').length
    const total = hits + misses
    
    if (total > 0) {

    }

  
  return trends
}

export function formatReplayDuration(ms: number): string {

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60


    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`

  return `${seconds}s`


export function calculateReplaySize(replay: GameReplay): number {
  return new Blob([JSON.stringify(replay)]).size



  const compressedEvents = replay.events.map(event => ({
    ...event,
    data: Object.fromEntries(
      Object.entries(event.data).filter(([_, value]) => value !== undefined)
    )

  

    ...replay,
    events: compressedEvents
  }

