import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Trophy, Lightning, Crown, Medal, Users, Timer } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

export interface LiveEventEntry {
  id: string
  playerName: string
  score: number
  timestamp: number
  difficulty: string
  rank: number
}

export interface LiveEventConfig {
  id: string
  name: string
  description: string
  startTime: number
  endTime: number
  isActive: boolean
}

interface LiveEventLeaderboardProps {
  onStartEvent: (eventId: string) => void
}

export function LiveEventLeaderboard({ onStartEvent }: LiveEventLeaderboardProps) {
  const [liveEntries, setLiveEntries] = useKV<LiveEventEntry[]>('live-event-entries', [])
  const [currentEvent, setCurrentEvent] = useKV<LiveEventConfig | null>('current-live-event', null)
  const [eventName, setEventName] = useState('')
  const [eventDuration, setEventDuration] = useState('60')
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    if (!currentEvent) return

    const interval = setInterval(() => {
      const remaining = Math.max(0, currentEvent.endTime - Date.now())
      setTimeRemaining(remaining)

      if (remaining === 0 && currentEvent.isActive) {
        setCurrentEvent(current => current ? { ...current, isActive: false } : null)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [currentEvent, setCurrentEvent])

  const handleStartNewEvent = () => {
    if (!eventName.trim()) return

    const now = Date.now()
    const durationMs = parseInt(eventDuration) * 60 * 1000

    const newEvent: LiveEventConfig = {
      id: `event-${now}`,
      name: eventName.trim(),
      description: `Live competition at ${new Date().toLocaleDateString()}`,
      startTime: now,
      endTime: now + durationMs,
      isActive: true
    }

    setCurrentEvent(newEvent)
    setLiveEntries([])
    setEventName('')
    onStartEvent(newEvent.id)
  }

  const handleEndEvent = () => {
    if (!currentEvent) return
    setCurrentEvent({ ...currentEvent, isActive: false })
  }

  const handleClearEvent = () => {
    setCurrentEvent(null)
    setLiveEntries([])
  }

  const topEntries = (liveEntries || [])
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary glow-text">Live Event</h2>
        <p className="text-muted-foreground">
          Create real-time competitions for booth events and watch the leaderboard update live
        </p>
      </div>

      {!currentEvent && (
        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Trophy size={24} weight="duotone" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Start New Live Event</h3>
                <p className="text-sm text-muted-foreground">
                  Create a timed competition for event attendees
                </p>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    placeholder="e.g., Cloud9 Booth Challenge"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="180"
                    value={eventDuration}
                    onChange={(e) => setEventDuration(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleStartNewEvent}
                  disabled={!eventName.trim()}
                  size="lg"
                  className="w-full"
                >
                  <Lightning size={20} weight="fill" className="mr-2" />
                  Start Live Event
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {currentEvent && (
        <div className="space-y-4">
          <Card className={`p-6 ${currentEvent.isActive ? 'border-accent glow-box' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${currentEvent.isActive ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                  <Trophy size={24} weight="duotone" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentEvent.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
                </div>
              </div>
              {currentEvent.isActive && (
                <Badge className="text-lg px-4 py-2 bg-accent text-accent-foreground animate-pulse">
                  <Timer size={20} weight="fill" className="mr-2" />
                  LIVE
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {topEntries.length}
                </div>
                <div className="text-xs text-muted-foreground">Participants</div>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {currentEvent.isActive ? formatTime(timeRemaining) : 'Ended'}
                </div>
                <div className="text-xs text-muted-foreground">Time Remaining</div>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-lg">
                <div className="text-2xl font-bold text-cyan">
                  {topEntries[0]?.score.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground">Top Score</div>
              </div>
            </div>

            <div className="flex gap-2">
              {currentEvent.isActive && (
                <Button onClick={handleEndEvent} variant="outline" className="flex-1">
                  End Event
                </Button>
              )}
              <Button onClick={handleClearEvent} variant="destructive" className="flex-1">
                Clear Event
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Medal size={24} weight="duotone" className="text-accent" />
                Live Leaderboard
              </h3>
              <Badge variant="secondary">
                <Users size={14} className="mr-1" />
                {topEntries.length} Players
              </Badge>
            </div>

            <Separator className="mb-4" />

            {topEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy size={48} weight="duotone" className="mx-auto mb-4 opacity-50" />
                <p>No entries yet. Start playing to see the leaderboard!</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {topEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <LiveEntryCard entry={entry} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Card>
        </div>
      )}

      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Lightning size={24} weight="duotone" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Live Event Features</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Real-time leaderboard updates as players complete games</li>
              <li>• Timed competitions perfect for booth activations</li>
              <li>• Top 10 rankings with automatic sorting</li>
              <li>• Event history and statistics tracking</li>
              <li>• Participant count and time remaining display</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}

interface LiveEntryCardProps {
  entry: LiveEventEntry
}

function LiveEntryCard({ entry }: LiveEntryCardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={24} weight="fill" className="text-amber-500" />
      case 2:
        return <Medal size={24} weight="fill" className="text-slate-400" />
      case 3:
        return <Medal size={24} weight="fill" className="text-amber-700" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Card className={`p-4 ${entry.rank <= 3 ? 'border-accent/50' : 'border-border'}`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12">
          {getRankIcon(entry.rank)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold text-lg truncate">{entry.playerName}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {entry.difficulty.toUpperCase()}
            </Badge>
            <span>•</span>
            <span>{getTimeSince(entry.timestamp)}</span>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-2xl font-bold ${entry.rank === 1 ? 'text-accent glow-text' : 'text-primary'}`}>
            {entry.score.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">points</div>
        </div>
      </div>
    </Card>
  )
}

export function addLiveEventEntry(
  currentEntries: LiveEventEntry[],
  playerName: string,
  score: number,
  difficulty: string
): LiveEventEntry[] {
  const newEntry: LiveEventEntry = {
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    playerName,
    score,
    timestamp: Date.now(),
    difficulty,
    rank: 0
  }

  return [...currentEntries, newEntry]
}
