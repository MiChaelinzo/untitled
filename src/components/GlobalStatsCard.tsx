import { Card } from '@/components/ui/card'
import { ChartBar, Trophy, Target, Lightning, Fire, TrendUp } from '@phosphor-icons/react'
import { GlobalStats, formatGlobalStats } from '@/lib/global-stats'
import { motion } from 'framer-motion'

interface GlobalStatsCardProps {
  stats: GlobalStats
}

export function GlobalStatsCard({ stats }: GlobalStatsCardProps) {
  const formattedStats = formatGlobalStats(stats)
  
  const statItems = [
    { label: 'Total Games', value: formattedStats['Total Games Played'], icon: ChartBar, color: 'text-cyan' },
    { label: 'Targets Hit', value: formattedStats['Targets Hit'], icon: Target, color: 'text-primary' },
    { label: 'High Score', value: formattedStats['All-Time High Score'], icon: Trophy, color: 'text-accent' },
    { label: 'Best Combo', value: formattedStats['Best Combo'], icon: Lightning, color: 'text-yellow-400' },
    { label: 'Fastest Time', value: formattedStats['Fastest Reaction'], icon: Fire, color: 'text-orange-400' },
    { label: 'Accuracy', value: formattedStats['Average Accuracy'], icon: TrendUp, color: 'text-green-400' },
    { label: 'Perfect Rounds', value: formattedStats['Perfect Rounds'], icon: Trophy, color: 'text-purple-400' },
    { label: 'Popular Mode', value: formattedStats['Most Popular Mode'], icon: Fire, color: 'text-pink-400' }
  ]

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <ChartBar className="text-primary" size={28} weight="fill" />
        <div>
          <h3 className="text-xl font-bold text-foreground">Global Statistics</h3>
          <p className="text-sm text-muted-foreground">Community-wide performance data</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col gap-2 p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/40 transition-colors"
          >
            <item.icon className={item.color} size={24} weight="duotone" />
            <div className="text-2xl font-bold text-foreground">{item.value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="text-xs text-muted-foreground text-center">
          Last updated: {new Date(stats.lastUpdated).toLocaleString()}
        </div>
      </div>
    </Card>
  )
}
