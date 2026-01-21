import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrendUp, TrendDown, Target, Lightning, Trophy, Clock } from '@phosphor-icons/react'
import { GameSession } from '@/lib/global-stats'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts'

interface AdvancedAnalyticsProps {
  gameSessions: GameSession[]
  totalGamesPlayed: number
  totalTargetsHit: number
  totalTargetsMissed: number
  highestScore: number
  highestCombo: number
}

export function AdvancedAnalytics({
  gameSessions,
  totalGamesPlayed,
  totalTargetsHit,
  totalTargetsMissed,
  highestScore,
  highestCombo
}: AdvancedAnalyticsProps) {
  const recentSessions = gameSessions.slice(-20)

  const scoreData = recentSessions.map((session, index) => ({
    game: index + 1,
    score: session.score,
    combo: session.highestCombo
  }))

  const accuracyData = recentSessions.map((session, index) => {
    const total = session.targetsHit + session.targetsMissed
    const accuracy = total > 0 ? (session.targetsHit / total) * 100 : 0
    return {
      game: index + 1,
      accuracy: Math.round(accuracy)
    }
  })

  const difficultyData = [
    { name: 'Easy', count: gameSessions.filter(s => s.difficulty === 'easy').length },
    { name: 'Medium', count: gameSessions.filter(s => s.difficulty === 'medium').length },
    { name: 'Hard', count: gameSessions.filter(s => s.difficulty === 'hard').length },
    { name: 'Insane', count: gameSessions.filter(s => s.difficulty === 'insane').length }
  ].filter(d => d.count > 0)

  const averageScore = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length)
    : 0

  const averageAccuracy = totalGamesPlayed > 0
    ? Math.round((totalTargetsHit / (totalTargetsHit + totalTargetsMissed)) * 100)
    : 0

  const recentAvgScore = recentSessions.length >= 5
    ? Math.round(recentSessions.slice(-5).reduce((sum, s) => sum + s.score, 0) / 5)
    : averageScore

  const previousAvgScore = recentSessions.length >= 10
    ? Math.round(recentSessions.slice(-10, -5).reduce((sum, s) => sum + s.score, 0) / 5)
    : averageScore

  const scoreTrend = previousAvgScore > 0
    ? ((recentAvgScore - previousAvgScore) / previousAvgScore) * 100
    : 0

  const COLORS = ['oklch(0.65 0.24 240)', 'oklch(0.75 0.18 195)', 'oklch(0.70 0.25 350)', 'oklch(0.55 0.25 15)']

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary glow-text">Advanced Analytics</h2>
        <p className="text-muted-foreground">
          Deep dive into your performance metrics and improvement trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy size={24} weight="duotone" />}
          label="Avg Score"
          value={averageScore.toLocaleString()}
          trend={scoreTrend}
          color="text-primary"
        />
        <StatCard
          icon={<Target size={24} weight="duotone" />}
          label="Accuracy"
          value={`${averageAccuracy}%`}
          color="text-cyan"
        />
        <StatCard
          icon={<Lightning size={24} weight="duotone" />}
          label="Best Combo"
          value={highestCombo}
          color="text-accent"
        />
        <StatCard
          icon={<Clock size={24} weight="duotone" />}
          label="Total Games"
          value={totalGamesPlayed}
          color="text-foreground"
        />
      </div>

      <Tabs defaultValue="score" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="score">Score Trends</TabsTrigger>
          <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
          <TabsTrigger value="difficulty">Difficulty Mix</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="score">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Score & Combo Progression</h3>
            <Separator className="mb-4" />
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.08 240)" />
                  <XAxis dataKey="game" stroke="oklch(0.65 0.08 240)" />
                  <YAxis stroke="oklch(0.65 0.08 240)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.03 240)',
                      border: '1px solid oklch(0.30 0.08 240)',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="oklch(0.65 0.24 240)" strokeWidth={2} name="Score" />
                  <Line type="monotone" dataKey="combo" stroke="oklch(0.70 0.25 350)" strokeWidth={2} name="Combo" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Play more games to see your trends
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="accuracy">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Accuracy Over Time</h3>
            <Separator className="mb-4" />
            {accuracyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.30 0.08 240)" />
                  <XAxis dataKey="game" stroke="oklch(0.65 0.08 240)" />
                  <YAxis stroke="oklch(0.65 0.08 240)" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.18 0.03 240)',
                      border: '1px solid oklch(0.30 0.08 240)',
                      borderRadius: '0.5rem'
                    }}
                    formatter={(value: any) => `${value}%`}
                  />
                  <Line type="monotone" dataKey="accuracy" stroke="oklch(0.75 0.18 195)" strokeWidth={2} name="Accuracy %" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Play more games to see your accuracy trends
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="difficulty">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Games by Difficulty</h3>
            <Separator className="mb-4" />
            {difficultyData.length > 0 ? (
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="oklch(0.65 0.24 240)"
                      dataKey="count"
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.18 0.03 240)',
                        border: '1px solid oklch(0.30 0.08 240)',
                        borderRadius: '0.5rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No difficulty data available
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Performance Insights</h3>
            <Separator className="mb-4" />
            <div className="space-y-4">
              <InsightCard
                title="Recent Performance"
                description={
                  scoreTrend > 5
                    ? `Your scores have improved by ${Math.round(scoreTrend)}% in your last 5 games! Keep it up!`
                    : scoreTrend < -5
                    ? `Your scores have dropped by ${Math.abs(Math.round(scoreTrend))}%. Try practicing on easier difficulties.`
                    : 'Your performance is steady. Challenge yourself with harder difficulties!'
                }
                trend={scoreTrend > 0 ? 'up' : scoreTrend < 0 ? 'down' : 'neutral'}
              />
              <InsightCard
                title="Accuracy Rating"
                description={
                  averageAccuracy >= 90
                    ? 'Excellent accuracy! You have pro-level precision.'
                    : averageAccuracy >= 75
                    ? 'Good accuracy! You\'re hitting most targets consistently.'
                    : averageAccuracy >= 60
                    ? 'Decent accuracy. Focus on timing to improve your hit rate.'
                    : 'Try slowing down and focusing on accuracy over speed.'
                }
                trend={averageAccuracy >= 75 ? 'up' : 'neutral'}
              />
              <InsightCard
                title="Recommended Next Step"
                description={
                  highestCombo >= 20
                    ? 'You\'ve mastered combos! Try the insane difficulty for the ultimate challenge.'
                    : highestCombo >= 10
                    ? 'Great combo skills! Push for a 20+ combo streak to unlock special rewards.'
                    : 'Focus on building combo streaks by hitting targets quickly and accurately.'
                }
                trend="neutral"
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: number
  color: string
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-2">
        <div className={`p-2 rounded-lg bg-primary/10 ${color}`}>
          {icon}
        </div>
        {trend !== undefined && trend !== 0 && (
          <Badge variant={trend > 0 ? 'default' : 'destructive'} className="text-xs">
            {trend > 0 ? <TrendUp size={12} className="mr-1" /> : <TrendDown size={12} className="mr-1" />}
            {Math.abs(Math.round(trend))}%
          </Badge>
        )}
      </div>
      <div className={`text-3xl font-bold mb-1 ${color}`}>
        {value}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </Card>
  )
}

interface InsightCardProps {
  title: string
  description: string
  trend: 'up' | 'down' | 'neutral'
}

function InsightCard({ title, description, trend }: InsightCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendUp size={20} className="text-accent" weight="bold" />
      case 'down':
        return <TrendDown size={20} className="text-destructive" weight="bold" />
      default:
        return <Target size={20} className="text-primary" weight="duotone" />
    }
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
      <div className="mt-1">
        {getTrendIcon()}
      </div>
      <div className="flex-1">
        <h4 className="font-bold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
