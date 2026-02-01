import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Play, MagnifyingGlass, SortAscending, Trophy, Lightning, Target, Trash } from '@phosphor-icons/react'
import { GameReplay, formatReplayDuration, calculateReplaySize } from '@/lib/replay-system'
import { DIFFICULTY_CONFIG } from '@/lib/game-types'
import { ReplayViewer } from './ReplayViewer'
import { useKV } from '@github/spark/hooks'

interface ReplaysLibraryProps {
  currentUserId: string
}

export function ReplaysLibrary({ currentUserId }: ReplaysLibraryProps) {
  const [replays, setReplays] = useKV<GameReplay[]>('game-replays', [])
  const [selectedReplay, setSelectedReplay] = useState<GameReplay | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'accuracy'>('date')

  const filteredReplays = (replays || [])
    .filter(replay => 
      replay.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      replay.difficulty.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.finalScore - a.finalScore
        case 'accuracy':
          return b.accuracy - a.accuracy
        case 'date':
        default:
          return b.timestamp - a.timestamp
      }
    })

  const handleDelete = (replayId: string) => {
    setReplays(current => (current || []).filter(r => r.id !== replayId))
  }

  const totalSize = (replays || []).reduce((sum, replay) => sum + calculateReplaySize(replay), 0)

  if (selectedReplay) {
    return (
      <ReplayViewer
        replay={selectedReplay}
        onClose={() => setSelectedReplay(null)}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '1rem',
        alignItems: 'center'
      }} className="max-md:grid-cols-1">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search replays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const sorts: Array<'date' | 'score' | 'accuracy'> = ['date', 'score', 'accuracy']
            const currentIndex = sorts.indexOf(sortBy)
            setSortBy(sorts[(currentIndex + 1) % sorts.length])
          }}
        >
          <SortAscending className="w-4 h-4 mr-2" />
          {sortBy === 'date' && 'Date'}
          {sortBy === 'score' && 'Score'}
          {sortBy === 'accuracy' && 'Accuracy'}
        </Button>

        <div className="text-sm text-muted-foreground">
          {filteredReplays.length} replays • {(totalSize / 1024).toFixed(1)}KB
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem'
      }} className="max-md:grid-cols-1">
        {filteredReplays.map((replay, idx) => (
          <motion.div
            key={replay.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 hover:border-primary/50 transition-all group">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0.5rem',
                marginBottom: '0.75rem'
              }}>
                <div>
                  <h3 className="font-semibold">{replay.username}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(replay.timestamp).toLocaleDateString()} • {formatReplayDuration(replay.duration)}
                  </p>
                </div>
                <Badge variant="outline">
                  {DIFFICULTY_CONFIG[replay.difficulty].name}
                </Badge>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                background: 'hsl(var(--muted))'
              }}>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="w-3 h-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Score</span>
                  </div>
                  <div className="text-lg font-bold">{replay.finalScore.toLocaleString()}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-3 h-3 text-accent" />
                    <span className="text-xs text-muted-foreground">Accuracy</span>
                  </div>
                  <div className="text-lg font-bold">{replay.accuracy.toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Lightning className="w-3 h-3 text-cyan" />
                    <span className="text-xs text-muted-foreground">Combo</span>
                  </div>
                  <div className="text-lg font-bold">{replay.maxCombo}x</div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '0.5rem'
              }}>
                <Button
                  size="sm"
                  onClick={() => setSelectedReplay(replay)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch Replay
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(replay.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{replay.metadata.targetsHit} hits • {replay.metadata.targetsMissed} misses</span>
                <span>{replay.averageReactionTime.toFixed(0)}ms avg</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredReplays.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold mb-2">No replays found</p>
            <p className="text-sm">
              {searchQuery 
                ? 'Try a different search term'
                : 'Play some games to start recording replays!'}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
