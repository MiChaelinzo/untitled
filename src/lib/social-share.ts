import { Achievement } from './achievements'
import { Challenge, TimeLimitedBadge } from './challenges'

export interface ShareContent {
  text: string
  hashtags: string[]
  url?: string
}

export function generateBadgeShareText(badge: TimeLimitedBadge, playerName?: string): ShareContent {
  if (!badge || !badge.name) {
    return {
      text: 'I earned a new badge in C9 Reflex Arena!',
      hashtags: ['Cloud9', 'ReflexArena', 'Gaming'],
      url: window.location.origin
    }
  }

  const rarityEmoji = {
    common: '🥉',
    rare: '🥈',
    epic: '🥇',
    legendary: '👑'
  }

  const playerPrefix = playerName ? `${playerName} earned` : 'I earned'
  const emoji = rarityEmoji[badge.rarity] || '🏆'
  const icon = badge.icon || '🎯'
  const description = badge.description || 'Special achievement unlocked'
  
  const text = `${playerPrefix} the ${emoji} ${badge.name} badge in C9 Reflex Arena! ${icon}\n\n${description}\n\nThink you can beat this? Play now!`
  
  return {
    text,
    hashtags: ['Cloud9', 'ReflexArena', 'Gaming', badge.rarity === 'legendary' ? 'Legendary' : 'Achievement'],
    url: window.location.origin
  }
}

export function generateChallengeShareText(challenge: Challenge, playerName?: string): ShareContent {
  const difficultyEmoji = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎'
  }

  const typeLabel = challenge.type === 'daily' ? 'Daily' : 'Weekly'
  const playerPrefix = playerName ? `${playerName} completed` : 'I completed'
  
  const text = `${playerPrefix} the ${difficultyEmoji[challenge.difficulty]} ${typeLabel} Challenge in C9 Reflex Arena! ${challenge.icon}\n\n"${challenge.name}"\n${challenge.description}\n\nCan you complete it too?`
  
  return {
    text,
    hashtags: ['Cloud9', 'ReflexArena', typeLabel + 'Challenge', challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)],
    url: window.location.origin
  }
}

export function generateAchievementShareText(achievement: Achievement, playerName?: string): ShareContent {
  const playerPrefix = playerName ? `${playerName} unlocked` : 'I unlocked'
  
  const text = `${playerPrefix} the "${achievement.name}" achievement in C9 Reflex Arena! ${achievement.icon}\n\n${achievement.description}\n\nJoin the competition!`
  
  return {
    text,
    hashtags: ['Cloud9', 'ReflexArena', 'Achievement', 'Gaming'],
    url: window.location.origin
  }
}

export function generateHighScoreShareText(score: number, difficulty: string, playerName?: string): ShareContent {
  const difficultyEmoji = {
    easy: '🟢',
    medium: '🟡',
    hard: '🔴',
    insane: '💀'
  }

  const playerPrefix = playerName ? `${playerName} scored` : 'I scored'
  
  const text = `${playerPrefix} ${score.toLocaleString()} points on ${difficultyEmoji[difficulty as keyof typeof difficultyEmoji]} ${difficulty.toUpperCase()} difficulty in C9 Reflex Arena!\n\nCan you beat my score? 🎯`
  
  return {
    text,
    hashtags: ['Cloud9', 'ReflexArena', 'HighScore', difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + 'Mode'],
    url: window.location.origin
  }
}

export function shareToTwitter(content: ShareContent): void {
  const baseUrl = 'https://twitter.com/intent/tweet'
  const params = new URLSearchParams()
  
  params.append('text', content.text)
  
  if (content.hashtags.length > 0) {
    params.append('hashtags', content.hashtags.join(','))
  }
  
  if (content.url) {
    params.append('url', content.url)
  }
  
  const shareUrl = `${baseUrl}?${params.toString()}`
  
  window.open(shareUrl, '_blank', 'width=550,height=420,noopener,noreferrer')
}

export function copyShareText(content: ShareContent): string {
  const fullText = content.text + 
    (content.hashtags.length > 0 ? '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ') : '') +
    (content.url ? '\n\n' + content.url : '')
  
  return fullText
}
