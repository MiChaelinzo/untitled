export interface ProPlayer {
  id: string
  name: string
  team: string
  game: 'League of Legends' | 'VALORANT'
  role: string
  avatarUrl: string
  ghostScore: number
  reactionTime: number
  accuracy: number
  difficulty: 'hard' | 'insane'
  bio: string
  achievements: string[]
}

export const PRO_PLAYERS: ProPlayer[] = [
  {
    id: 'blaber',
    name: 'Blaber',
    team: 'Cloud9',
    game: 'League of Legends',
    role: 'Jungler',
    avatarUrl: 'https://am-a.akamaihd.net/image?resize=80:80&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1641990466729_BlaberHeadshot.png',
    ghostScore: 8450,
    reactionTime: 185,
    accuracy: 94,
    difficulty: 'insane',
    bio: '3x LCS Champion known for aggressive jungle plays',
    achievements: ['LCS Champion', 'All-Pro Team', 'MVP Finalist']
  },
  {
    id: 'vulcan',
    name: 'Vulcan',
    team: 'Cloud9',
    game: 'League of Legends',
    role: 'Support',
    avatarUrl: 'https://am-a.akamaihd.net/image?resize=80:80&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1641990532154_VulcanHeadshot.png',
    ghostScore: 7890,
    reactionTime: 195,
    accuracy: 91,
    difficulty: 'insane',
    bio: 'Mechanical support player with exceptional vision control',
    achievements: ['LCS Champion', 'All-Pro Support', 'Worlds Qualifier']
  },
  {
    id: 'fudge',
    name: 'Fudge',
    team: 'Cloud9',
    game: 'League of Legends',
    role: 'Top Laner',
    avatarUrl: 'https://am-a.akamaihd.net/image?resize=80:80&f=http%3A%2F%2Fstatic.lolesports.com%2Fplayers%2F1641990501841_FudgeHeadshot.png',
    ghostScore: 8120,
    reactionTime: 190,
    accuracy: 92,
    difficulty: 'insane',
    bio: 'Versatile top laner with clutch teamfight mechanics',
    achievements: ['LCS Champion', 'Worlds Competitor', 'Rising Star Award']
  },
  {
    id: 'oxy',
    name: 'OXY',
    team: 'Cloud9',
    game: 'VALORANT',
    role: 'Duelist',
    avatarUrl: 'https://owcdn.net/img/63e4c6c4c3e3a.png',
    ghostScore: 9200,
    reactionTime: 165,
    accuracy: 96,
    difficulty: 'insane',
    bio: 'Rising star duelist with lightning-fast aim',
    achievements: ['VCT Americas', 'Rising Star', 'Ace Machine']
  },
  {
    id: 'vanity',
    name: 'vanity',
    team: 'Cloud9',
    game: 'VALORANT',
    role: 'IGL/Controller',
    avatarUrl: 'https://owcdn.net/img/631e7b0e3d3f3.png',
    ghostScore: 7650,
    reactionTime: 205,
    accuracy: 89,
    difficulty: 'hard',
    bio: 'Strategic IGL with consistent performances',
    achievements: ['VCT Americas', 'Master Tactician', 'Clutch King']
  },
  {
    id: 'xeppaa',
    name: 'Xeppaa',
    team: 'Cloud9',
    game: 'VALORANT',
    role: 'Initiator',
    avatarUrl: 'https://owcdn.net/img/631e7b5c0e8ad.png',
    ghostScore: 8350,
    reactionTime: 180,
    accuracy: 93,
    difficulty: 'insane',
    bio: 'Versatile initiator with exceptional game sense',
    achievements: ['VCT Americas', 'Multi-Agent Master', 'Team MVP']
  }
]

export interface ProChallengeResult {
  playerScore: number
  proScore: number
  won: boolean
  scoreDifference: number
  performanceRating: 'Exceeded' | 'Matched' | 'Close' | 'Below'
  message: string
  unlockReward?: string
}

export function calculateProChallengeResult(
  playerScore: number,
  proPlayer: ProPlayer
): ProChallengeResult {
  const scoreDifference = playerScore - proPlayer.ghostScore
  const percentageDiff = (scoreDifference / proPlayer.ghostScore) * 100
  
  let performanceRating: ProChallengeResult['performanceRating']
  let message: string
  let unlockReward: string | undefined
  
  if (percentageDiff >= 10) {
    performanceRating = 'Exceeded'
    message = `🔥 INCREDIBLE! You exceeded ${proPlayer.name}'s score by ${Math.abs(scoreDifference).toLocaleString()} points! Pro-level reflexes!`
    unlockReward = 'pro-exceeded-badge'
  } else if (percentageDiff >= 0) {
    performanceRating = 'Matched'
    message = `⚡ AMAZING! You matched ${proPlayer.name}'s performance! You've got pro-level skills!`
    unlockReward = 'pro-matched-badge'
  } else if (percentageDiff >= -15) {
    performanceRating = 'Close'
    message = `💪 SOLID! You came within ${Math.abs(scoreDifference).toLocaleString()} points of ${proPlayer.name}. Keep grinding!`
  } else {
    performanceRating = 'Below'
    message = `🎯 Good attempt! ${proPlayer.name} has years of pro experience. Practice makes perfect!`
  }
  
  return {
    playerScore,
    proScore: proPlayer.ghostScore,
    won: scoreDifference >= 0,
    scoreDifference: Math.abs(scoreDifference),
    performanceRating,
    message,
    unlockReward
  }
}

export function getProPlayerById(id: string): ProPlayer | undefined {
  return PRO_PLAYERS.find(p => p.id === id)
}

export function getProPlayersByGame(game: 'League of Legends' | 'VALORANT'): ProPlayer[] {
  return PRO_PLAYERS.filter(p => p.game === game)
}
