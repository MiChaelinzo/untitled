import { Card } from '@/components/ui/card'
import { PlayerStats } from '@/lib/achievements'
import { Target, Lightning, Trophy, Clock, Crosshair, Fire } from '@phosphor-icons/react'
import { formatScore } from '@/lib/game-utils'

interface StatsPanelProps {
  stats: PlayerStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  const accuracy = stats.totalTargetsHit + stats.totalTargetsMissed > 0
    ? Math.round((stats.totalTargetsHit / (stats.totalTargetsHit + stats.totalTargetsMissed)) * 100)
    : 0

  const avgPlayTime = stats.totalGamesPlayed > 0
    ? Math.round(stats.totalPlayTime / stats.totalGamesPlayed / 1000)
    : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Trophy size={24} weight="fill" className="text-accent mx-auto" />
        <div className="text-2xl font-bold text-cyan">{formatScore(stats.highestScore)}</div>
        <div className="text-xs text-muted-foreground">Best Score</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Lightning size={24} weight="fill" className="text-primary mx-auto" />
        <div className="text-2xl font-bold text-primary">{stats.highestCombo}x</div>
        <div className="text-xs text-muted-foreground">Max Combo</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Crosshair size={24} weight="fill" className="text-cyan mx-auto" />
        <div className="text-2xl font-bold text-foreground">{accuracy}%</div>
        <div className="text-xs text-muted-foreground">Accuracy</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Target size={24} weight="fill" className="text-foreground mx-auto" />
        <div className="text-2xl font-bold text-foreground">{stats.totalTargetsHit}</div>
        <div className="text-xs text-muted-foreground">Targets Hit</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Fire size={24} weight="fill" className="text-accent mx-auto" />
        <div className="text-2xl font-bold text-accent">{stats.insaneModeCompleted}</div>
        <div className="text-xs text-muted-foreground">Insane Wins</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Trophy size={24} className="text-muted-foreground mx-auto" />
        <div className="text-2xl font-bold text-foreground">{stats.totalGamesPlayed}</div>
        <div className="text-xs text-muted-foreground">Games Played</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Clock size={24} className="text-muted-foreground mx-auto" />
        <div className="text-2xl font-bold text-foreground">{avgPlayTime}s</div>
        <div className="text-xs text-muted-foreground">Avg Game Time</div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur text-center space-y-2">
        <Lightning size={24} className="text-muted-foreground mx-auto" />
        <div className="text-2xl font-bold text-foreground">{stats.perfectRounds}</div>
        <div className="text-xs text-muted-foreground">Perfect Rounds</div>
      </Card>
    </div>
  )
}
