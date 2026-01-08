# Global Leaderboard & Community Statistics

## Overview

The Global Leaderboard system provides comprehensive community-wide statistics tracking and competitive features for C9 Reflex Arena. Players can view global rankings, regional statistics, trending players, and real-time community metrics.

## Features

### 1. Global Leaderboard
- **Worldwide Rankings**: View top players from around the world
- **Rank Display**: Special badges for top 3 positions (Crown, Medal, Star)
- **Player Profiles**: Shows username, avatar, region, title, and badges
- **Performance Metrics**: Score, accuracy percentage, and highest combo
- **Real-time Updates**: Automatically tracks all completed games

### 2. Advanced Filtering
- **Time Range Filter**: Today, This Week, This Month, All Time
- **Difficulty Filter**: Filter by Easy, Medium, Hard, or Insane
- **Region Filter**: View rankings by geographic region
- **Minimum Games**: Filter players by activity level
- **Personal Rank Display**: See your current global rank

### 3. Regional Leaderboards
- **6 Geographic Regions**: North America, South America, Europe, Asia, Africa, Oceania
- **Regional Stats**: Player count, average score, top score, top player
- **Regional Rankings**: See who dominates each region
- **Games Played**: Track activity by region

### 4. Trending Players
- **Rising Stars**: Players with the biggest recent improvements
- **Score Improvement**: Track percentage increase over previous games
- **Activity Metrics**: Games played today and current streak
- **Trend Indicators**: Visual indicators for rising or falling performance

### 5. Community Statistics
- **Total Players**: Overall player count with weekly trend
- **Total Games Played**: Community-wide game count
- **Top Score**: Highest score achieved globally
- **Average Accuracy**: Community-wide accuracy percentage
- **Most Active Region**: Geographic region with most activity
- **Most Popular Difficulty**: Preferred difficulty level
- **Activity Trends**: Week-over-week comparison for players, games, and scores

### 6. Real-Time Metrics
- **Today's Activity**: Games played in the last 24 hours
- **Weekly Activity**: Games played in the last 7 days
- **Monthly Activity**: Games played in the last 30 days
- **Trend Analysis**: Automatic calculation of growth trends

## Data Structure

### GlobalLeaderboardEntry
```typescript
{
  id: string              // Unique entry ID
  userId: string          // Player user ID
  username: string        // Player username
  avatarUrl?: string      // Player avatar image
  score: number           // Game score
  difficulty: Difficulty  // Game difficulty level
  targetsHit: number      // Targets successfully hit
  targetsMissed: number   // Targets missed
  accuracy: number        // Calculated accuracy percentage
  highestCombo: number    // Highest combo achieved
  timestamp: number       // Entry timestamp
  rank?: number           // Global rank position
  country?: string        // Player country
  region?: string         // Player geographic region
  badges?: string[]       // Unlocked badges
  title?: string          // Equipped title
}
```

### CommunityStats
```typescript
{
  totalPlayers: number          // Total unique players
  totalGamesPlayed: number      // Total games played
  totalTargetsHit: number       // Total targets hit globally
  averageAccuracy: number       // Average accuracy percentage
  topScore: number              // Highest score achieved
  mostActiveRegion: string      // Most active geographic region
  mostPopularDifficulty: Difficulty // Most played difficulty
  totalPlayTime: number         // Total playtime in milliseconds
  todayGames: number            // Games played today
  weekGames: number             // Games played this week
  monthGames: number            // Games played this month
  recentTrends: {
    gamesPlayedTrend: number    // Trend percentage
    averageScoreTrend: number   // Trend percentage
    activePlayersTrend: number  // Trend percentage
  }
}
```

## User Interface

### Leaderboard Tab
- **Global Leaderboard Button**: Prominent button to open full global leaderboard
- **Local Leaderboard**: Device-specific leaderboard below global button
- **Quick Stats**: Player count and games played summary

### Global Leaderboard Modal
- **4 Tabs**: Global, Regional, Trending, Stats
- **Filter Bar**: Time range, difficulty, and region filters
- **Rank Badge**: Shows your current global rank
- **Export Button**: Download leaderboard data as CSV

### Community Stats Widget
- **Real-time Metrics**: Displays in Stats tab
- **4 Main Metrics**: Players, Top Score, Accuracy, Popular Mode
- **Activity Breakdown**: Today, This Week, This Month
- **Trend Indicators**: Visual up/down arrows with percentages

## Functions

### Core Functions

#### `addGlobalLeaderboardEntry(leaderboard, entry)`
Adds a new entry to the global leaderboard and calculates accuracy automatically.

#### `filterLeaderboard(leaderboard, filter)`
Filters and ranks leaderboard based on time range, difficulty, and region.

#### `calculateCommunityStats(leaderboard)`
Calculates comprehensive community statistics from all leaderboard entries.

#### `getRegionalStats(leaderboard)`
Returns statistics grouped by geographic region.

#### `getTrendingPlayers(leaderboard, limit)`
Identifies players with the highest score improvements.

#### `getPlayerRankInfo(leaderboard, userId, filter)`
Returns detailed ranking information for a specific player.

#### `exportLeaderboardData(leaderboard, filter)`
Exports leaderboard data to CSV format.

## Usage Example

```typescript
// Add entry after game completion
setGlobalLeaderboard(current => {
  const newEntry = addGlobalLeaderboardEntry(current || [], {
    userId: player.id,
    username: player.username,
    avatarUrl: player.avatarUrl,
    score: 15000,
    difficulty: 'hard',
    targetsHit: 45,
    targetsMissed: 5,
    highestCombo: 12,
    timestamp: Date.now(),
    region: 'North America',
    badges: ['sharpshooter', 'combo-master'],
    title: 'Elite Marksman'
  })
  return newEntry
})
```

## Data Persistence

All global leaderboard data is stored in the Spark KV store:
- **Key**: `global-leaderboard`
- **Type**: `GlobalLeaderboardEntry[]`
- **Automatic**: Entries added after each non-practice game

## Performance Considerations

- **Efficient Filtering**: Uses Map data structures for fast lookups
- **Sorted Rankings**: Maintains sorted order for quick rank calculations
- **Best Scores Only**: Displays only the best score per player per filter
- **Lazy Loading**: Only calculates statistics when needed
- **Memoization**: Uses React useMemo for expensive calculations

## Future Enhancements

1. **Country Flags**: Display country flags next to player names
2. **Live Updates**: Real-time leaderboard updates across devices
3. **Seasonal Resets**: Periodic leaderboard resets for fresh competition
4. **Milestone Tracking**: Track when players reach leaderboard milestones
5. **Challenge System**: Challenge players directly from leaderboard
6. **Historical Data**: View leaderboard history over time
7. **Advanced Analytics**: Detailed statistical breakdowns
8. **Social Features**: Share rankings on social media

## Accessibility

- Keyboard navigation support for leaderboard entries
- Screen reader friendly labels and descriptions
- High contrast rank indicators
- Clear visual hierarchy
- Responsive design for mobile and desktop

## Security & Privacy

- User IDs are anonymized
- No personally identifiable information displayed
- Optional region sharing
- Data stored locally on device
- Export requires explicit user action
