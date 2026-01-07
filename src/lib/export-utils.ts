import { LeaderboardEntry } from '@/lib/game-types'

export function exportLeaderboardToCSV(leaderboard: LeaderboardEntry[]): void {
  const headers = ['Rank', 'Name', 'Score', 'Rounds', 'Difficulty', 'Timestamp']
  
  const rows = leaderboard.map((entry, index) => [
    (index + 1).toString(),
    entry.name,
    entry.score.toString(),
    entry.rounds.toString(),
    entry.difficulty,
    new Date(entry.timestamp).toLocaleString()
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `c9-reflex-arena-leaderboard-${Date.now()}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportLeaderboardToJSON(leaderboard: LeaderboardEntry[]): void {
  const jsonContent = JSON.stringify(leaderboard, null, 2)
  
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `c9-reflex-arena-leaderboard-${Date.now()}.json`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
