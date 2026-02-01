import { Difficulty } from './game-types'

export type ActivityType = 
  | 'high_score'
  | 'achievement'
  | 'challenge_complete'
  | 'tournament_win'
  | 'unlock'
  | 'streak_milestone'
  | 'perfect_game'
  | 'combo_record'

export interface CommunityActivity {
  id: string
  userId: string
  username: string
  avatarUrl?: string
  type: ActivityType
  timestamp: number
  data: {
    score?: number
    achievementName?: string
    challengeName?: string
    unlockName?: string
    difficulty?: Difficulty
    combo?: number
    streak?: number
    tournamentName?: string
  }
  reactions: {
    fire: number
    trophy: number
    lightning: number
    star: number
  }
  reactedBy: {
    [emoji: string]: string[]
  }
}

export function createActivity(
  userId: string,
  username: string,
  avatarUrl: string | undefined,
  type: ActivityType,
  data: CommunityActivity['data']
): CommunityActivity {
  return {
    id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    avatarUrl,
    type,
    timestamp: Date.now(),
    data,
    reactions: {
      fire: 0,
      trophy: 0,
      lightning: 0,
      star: 0
    },
    reactedBy: {}
  }
}

export function getActivityMessage(activity: CommunityActivity): string {
  const { type, data } = activity
  
  switch (type) {
    case 'high_score':
      return `scored ${data.score?.toLocaleString()} points on ${data.difficulty} difficulty! 🎯`
    case 'achievement':
      return `unlocked the "${data.achievementName}" achievement! 🏆`
    case 'challenge_complete':
      return `completed "${data.challengeName}" challenge! ⚡`
    case 'tournament_win':
      return `won the ${data.tournamentName} tournament! 👑`
    case 'unlock':
      return `unlocked ${data.unlockName}! ✨`
    case 'streak_milestone':
      return `reached a ${data.streak}-day streak! 🔥`
    case 'perfect_game':
      return `achieved a perfect game on ${data.difficulty} difficulty! 💯`
    case 'combo_record':
      return `hit a ${data.combo}x combo! ⚡`
    default:
      return 'completed an activity!'
  }
}

export function getActivityIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    high_score: 'Trophy',
    achievement: 'Medal',
    challenge_complete: 'Lightning',
    tournament_win: 'Crown',
    unlock: 'Sparkle',
    streak_milestone: 'Fire',
    perfect_game: 'Star',
    combo_record: 'Lightning'
  }
  return icons[type]
}

export function addReaction(
  activity: CommunityActivity,
  emoji: keyof CommunityActivity['reactions'],
  userId: string
): CommunityActivity {
  const hasReacted = activity.reactedBy[emoji]?.includes(userId)
  
  if (hasReacted) {
    return {
      ...activity,
      reactions: {
        ...activity.reactions,
        [emoji]: Math.max(0, activity.reactions[emoji] - 1)
      },
      reactedBy: {
        ...activity.reactedBy,
        [emoji]: activity.reactedBy[emoji].filter(id => id !== userId)
      }
    }
  } else {
    return {
      ...activity,
      reactions: {
        ...activity.reactions,
        [emoji]: activity.reactions[emoji] + 1
      },
      reactedBy: {
        ...activity.reactedBy,
        [emoji]: [...(activity.reactedBy[emoji] || []), userId]
      }
    }
  }
}

export function getTrendingActivities(activities: CommunityActivity[]): CommunityActivity[] {
  const last24Hours = Date.now() - 24 * 60 * 60 * 1000
  const recentActivities = activities.filter(a => a.timestamp > last24Hours)
  
  return recentActivities
    .sort((a, b) => {
      const aScore = Object.values(a.reactions).reduce((sum, count) => sum + count, 0)
      const bScore = Object.values(b.reactions).reduce((sum, count) => sum + count, 0)
      return bScore - aScore
    })
    .slice(0, 10)
}

export function filterActivitiesByType(
  activities: CommunityActivity[],
  types: ActivityType[]
): CommunityActivity[] {
  if (types.length === 0) return activities
  return activities.filter(a => types.includes(a.type))
}

export function getRecentActivities(
  activities: CommunityActivity[],
  limit: number = 50
): CommunityActivity[] {
  return [...activities]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
}

export function formatActivityTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function generateMockActivities(count: number = 20): CommunityActivity[] {
  const mockUsers = [
    { id: 'user1', name: 'ProGamer99', avatar: undefined },
    { id: 'user2', name: 'ReflexKing', avatar: undefined },
    { id: 'user3', name: 'SpeedDemon', avatar: undefined },
    { id: 'user4', name: 'SharpShooter', avatar: undefined },
    { id: 'user5', name: 'TargetMaster', avatar: undefined }
  ]
  
  const activities: CommunityActivity[] = []
  
  for (let i = 0; i < count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const types: ActivityType[] = ['high_score', 'achievement', 'perfect_game', 'combo_record']
    const type = types[Math.floor(Math.random() * types.length)]
    
    let data: CommunityActivity['data'] = {}
    
    switch (type) {
      case 'high_score':
        data = {
          score: Math.floor(Math.random() * 50000) + 10000,
          difficulty: ['easy', 'medium', 'hard', 'insane'][Math.floor(Math.random() * 4)] as Difficulty
        }
        break
      case 'achievement':
        data = {
          achievementName: ['First Blood', 'Sharpshooter', 'Combo Master', 'Perfectionist'][Math.floor(Math.random() * 4)]
        }
        break
      case 'perfect_game':
        data = {
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as Difficulty
        }
        break
      case 'combo_record':
        data = {
          combo: Math.floor(Math.random() * 30) + 10
        }
        break
    }
    
    const activity = createActivity(user.id, user.name, user.avatar, type, data)
    activity.timestamp = Date.now() - Math.random() * 24 * 60 * 60 * 1000
    activity.reactions.fire = Math.floor(Math.random() * 10)
    activity.reactions.trophy = Math.floor(Math.random() * 8)
    activity.reactions.lightning = Math.floor(Math.random() * 12)
    activity.reactions.star = Math.floor(Math.random() * 6)
    
    activities.push(activity)
  }
  
  return activities.sort((a, b) => b.timestamp - a.timestamp)
}
