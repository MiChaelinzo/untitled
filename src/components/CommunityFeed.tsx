import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Fire, Trophy, Lightning, Star, TrendUp, Clock } from '@phosphor-icons/react'
import { 
  CommunityActivity, 
  getActivityMessage, 
  addReaction, 
  getTrendingActivities, 
  filterActivitiesByType,
  getRecentActivities,
  formatActivityTime,
  ActivityType
} from '@/lib/community-feed'
import { useKV } from '@github/spark/hooks'

interface CommunityFeedProps {
  currentUserId: string
}

export function CommunityFeed({ currentUserId }: CommunityFeedProps) {
  const [activities, setActivities] = useKV<CommunityActivity[]>('community-activities', [])
  const [filter, setFilter] = useState<'all' | 'trending'>('all')
  const [typeFilter, setTypeFilter] = useState<ActivityType[]>([])
  
  const displayedActivities = filter === 'trending' 
    ? getTrendingActivities(activities || [])
    : getRecentActivities(filterActivitiesByType(activities || [], typeFilter))

  const handleReaction = (activityId: string, emoji: keyof CommunityActivity['reactions']) => {
    setActivities(current => 
      (current || []).map(activity => 
        activity.id === activityId 
          ? addReaction(activity, emoji, currentUserId)
          : activity
      )
    )
  }

  const toggleTypeFilter = (type: ActivityType) => {
    setTypeFilter(current => 
      current.includes(type)
        ? current.filter(t => t !== type)
        : [...current, type]
    )
  }

  return (
    <div className="space-y-4">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <h2 className="text-2xl font-bold">Community Feed</h2>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <Button
            size="sm"
            variant={typeFilter.includes('high_score') ? 'default' : 'outline'}
            onClick={() => toggleTypeFilter('high_score')}
          >
            <Trophy className="w-4 h-4 mr-1" />
            Scores
          </Button>
          <Button
            size="sm"
            variant={typeFilter.includes('achievement') ? 'default' : 'outline'}
            onClick={() => toggleTypeFilter('achievement')}
          >
            <Star className="w-4 h-4 mr-1" />
            Achievements
          </Button>
          <Button
            size="sm"
            variant={typeFilter.includes('perfect_game') ? 'default' : 'outline'}
            onClick={() => toggleTypeFilter('perfect_game')}
          >
            <Lightning className="w-4 h-4 mr-1" />
            Perfect Games
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'trending')}>
          <TabsList>
            <TabsTrigger value="all">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '1rem',
        maxHeight: '600px',
        overflowY: 'auto'
      }} className="max-md:grid-cols-1">
        {displayedActivities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-4 hover:border-primary/50 transition-colors">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '0.75rem',
                marginBottom: '0.75rem'
              }}>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    {activity.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{activity.username}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatActivityTime(activity.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getActivityMessage(activity)}
                  </p>
                </div>
              </div>

              {activity.data.difficulty && (
                <Badge variant="secondary" className="mb-3">
                  {activity.data.difficulty}
                </Badge>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                borderTop: '1px solid',
                borderColor: 'hsl(var(--border))',
                paddingTop: '0.75rem'
              }}>
                <Button
                  size="sm"
                  variant={activity.reactedBy.fire?.includes(currentUserId) ? 'default' : 'ghost'}
                  onClick={() => handleReaction(activity.id, 'fire')}
                  className="text-xs"
                >
                  <Fire className={`w-4 h-4 mr-1 ${activity.reactedBy.fire?.includes(currentUserId) ? 'text-orange-400' : ''}`} />
                  {activity.reactions.fire}
                </Button>
                <Button
                  size="sm"
                  variant={activity.reactedBy.trophy?.includes(currentUserId) ? 'default' : 'ghost'}
                  onClick={() => handleReaction(activity.id, 'trophy')}
                  className="text-xs"
                >
                  <Trophy className={`w-4 h-4 mr-1 ${activity.reactedBy.trophy?.includes(currentUserId) ? 'text-yellow-400' : ''}`} />
                  {activity.reactions.trophy}
                </Button>
                <Button
                  size="sm"
                  variant={activity.reactedBy.lightning?.includes(currentUserId) ? 'default' : 'ghost'}
                  onClick={() => handleReaction(activity.id, 'lightning')}
                  className="text-xs"
                >
                  <Lightning className={`w-4 h-4 mr-1 ${activity.reactedBy.lightning?.includes(currentUserId) ? 'text-blue-400' : ''}`} />
                  {activity.reactions.lightning}
                </Button>
                <Button
                  size="sm"
                  variant={activity.reactedBy.star?.includes(currentUserId) ? 'default' : 'ghost'}
                  onClick={() => handleReaction(activity.id, 'star')}
                  className="text-xs"
                >
                  <Star className={`w-4 h-4 mr-1 ${activity.reactedBy.star?.includes(currentUserId) ? 'text-purple-400' : ''}`} />
                  {activity.reactions.star}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {displayedActivities.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-muted-foreground">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-semibold mb-2">No activities yet</p>
            <p className="text-sm">Be the first to achieve something amazing!</p>
          </div>
        </Card>
      )}
    </div>
  )
}
