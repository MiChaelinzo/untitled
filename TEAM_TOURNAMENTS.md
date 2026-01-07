# Team-Based Tournament System

## Overview

The C9 Reflex Arena now features comprehensive team-based tournament support with AI-powered matchmaking for 2v2 and 3v3 formats. This system creates balanced teams, generates competitive brackets, and provides intelligent match predictions.

## Features

### 🎯 Team Formats

- **2v2 (Duo Teams)**: Two-player teams competing in fast-paced elimination brackets
- **3v3 (Trio Teams)**: Three-player teams for larger, more strategic competitions

### 🤖 AI-Powered Team Balancing

The system uses GPT-4o-mini to analyze player profiles and create balanced teams based on:
- Skill ratings
- Play styles (aggressive, consistent, adaptive)
- Consistency scores
- Recent performance trends
- Strategic synergy

### 🏆 Tournament Features

#### Team Creation
- Automatic captain assignment (highest-skilled player)
- Color-coded team identification
- Team synergy calculations
- Average skill rating tracking
- Win/loss records

#### Match System
- Single-elimination brackets
- Support for 2-8 teams
- Multiple difficulty levels
- Real-time score tracking
- Automatic bracket advancement

#### AI Match Analysis
- Win probability predictions
- Competitiveness scoring
- Key factor identification
- Strategic insights

## Implementation Details

### Core Components

#### 1. Team Tournament System (`team-tournament-system.ts`)
```typescript
// Create balanced teams from players
const result = await balanceTeams(players, '2v2')

// Create tournament
const tournament = createTeamTournament(
  'Championship',
  '2v2',
  'hard',
  result.teams
)

// Update match results
const updated = updateTeamMatchScore(
  tournament,
  matchId,
  teamId,
  score
)

// Advance tournament
const advanced = advanceTeamTournament(tournament)
```

#### 2. Team Matchmaking Panel
- Player pool visualization
- Team size selection
- AI balancing controls
- Match preview with predictions
- Balance score display

#### 3. Team Tournament Panel
- Live bracket display
- Team roster management
- Match scheduling
- Real-time updates
- Winner celebrations

### Data Structures

#### Team
```typescript
interface Team {
  id: string
  name: string
  color: string
  players: TeamPlayer[]
  averageSkill: number
  captain: TeamPlayer
  wins: number
  losses: number
}
```

#### Team Match
```typescript
interface TeamMatch {
  id: string
  roundNumber: number
  matchNumber: number
  team1: Team
  team2: Team
  team1Score?: number
  team2Score?: number
  winnerTeamId?: string
  status: TeamMatchStatus
  difficulty: Difficulty
}
```

#### Team Tournament
```typescript
interface TeamTournament {
  id: string
  name: string
  teamSize: TeamSize
  difficulty: Difficulty
  teams: Team[]
  matches: TeamMatch[]
  rounds: number
  currentRound: number
  status: TeamTournamentStatus
  winnerTeamId?: string
}
```

## AI Matchmaking Algorithm

### Player Analysis
1. **Skill Rating Calculation**: Based on accuracy, scores, combos, and game modes completed
2. **Consistency Scoring**: Variance analysis of recent performances
3. **Play Style Detection**: 
   - Aggressive: High combo focus, many targets hit
   - Consistent: High accuracy, low variance
   - Adaptive: Balanced approach

### Team Balancing Strategy
The AI considers:
- Similar average skill levels between teams (within 300-500 points)
- Complementary play styles within teams
- Balanced distribution of consistency scores
- Strategic synergy potential

### Match Prediction
Predictions account for:
- Skill differential between teams
- Team composition quality
- Individual player consistency
- Historical performance patterns

## Usage Guide

### Creating a Team Tournament

1. **Navigate to Teams Tab**
   - Click the "Teams" tab in the main menu
   - Choose between 2v2 or 3v3 format

2. **AI Matchmaking**
   - Select team size (2v2 or 3v3)
   - Choose tournament difficulty
   - Click "Create Balanced Teams"
   - AI analyzes players and creates balanced teams

3. **Review Teams**
   - View team compositions
   - Check balance scores
   - Preview potential matchups
   - See AI predictions

4. **Start Tournament**
   - Confirm team assignments
   - Tournament bracket is generated
   - Matches are scheduled

5. **Play Matches**
   - Your next match is highlighted
   - Click "Start Match" to play
   - Team scores are combined
   - Automatic bracket advancement

### Team Features

#### Team Synergy
- Calculated from skill variance within team
- Higher synergy = more balanced team
- Displayed as percentage (0-100%)

#### Captain Role
- Highest-skilled player automatically assigned
- Special badge/crown indicator
- Team leadership representation

#### Team Colors
- Unique color per team
- Visual identification in brackets
- Consistent throughout tournament

## Balance & Fairness

### Balance Score
- 0-100% metric of tournament fairness
- Based on team skill distribution
- AI confidence indicator
- Factors:
  - Skill variance between teams
  - Play style distribution
  - Consistency balance

### Competitive Matches
- Competitiveness score (0-100%)
- Higher = more evenly matched
- AI provides match insights
- Key factors highlighted

## Technical Integration

### Component Structure
```
TeamTournamentPanel
├── TeamMatchmakingPanel
│   ├── Team balancing UI
│   ├── Match preview
│   └── AI analysis display
└── Tournament bracket UI
    ├── Team displays
    ├── Match cards
    └── Winner celebration
```

### State Management
- Tournament state via React useState
- Player data via useKV persistence
- Real-time updates on match completion
- Automatic bracket progression

### AI Integration
- GPT-4o-mini for team balancing
- Structured JSON responses
- Fallback to rule-based matching
- Match outcome predictions

## Future Enhancements

### Potential Features
- [ ] 4v4 and 5v5 team formats
- [ ] Round-robin tournament format
- [ ] Team statistics tracking
- [ ] Team rankings and leaderboards
- [ ] Custom team names and logos
- [ ] Team chat/communication
- [ ] Coach/spectator mode
- [ ] Tournament replay system
- [ ] Team achievements and badges
- [ ] Inter-tournament team persistence

### Optimization Opportunities
- Caching AI predictions
- Pre-calculated team combinations
- Historical matchup data
- ELO-style team ratings
- Machine learning model training

## Best Practices

### For Balanced Tournaments
1. Ensure minimum player count (4 for 2v2, 6 for 3v3)
2. Mix skill levels in player pool
3. Use AI matchmaking for fairness
4. Review balance scores before starting
5. Choose appropriate difficulty level

### For Competitive Matches
1. Preview matchups before starting
2. Consider AI predictions
3. Note key factors
4. Adjust difficulty based on team skills
5. Monitor team synergy scores

## Performance Considerations

- AI calls are async with loading states
- Fallback algorithms for offline scenarios
- Efficient bracket calculations
- Optimized re-renders
- Memoized team computations

## Troubleshooting

### Common Issues

**Teams seem unbalanced?**
- Rerun AI balancing
- Check balance score
- Verify player skill ratings
- Consider manual adjustments

**AI matchmaking slow?**
- Network latency expected
- Fallback algorithm activates on timeout
- Loading states indicate progress

**Tournament not advancing?**
- Ensure all matches completed
- Check for incomplete scores
- Verify match status

## API Reference

### Key Functions

```typescript
// Create teams from players
balanceTeams(players: PlayerSkillProfile[], teamSize: TeamSize): Promise<TeamMatchmakingResult>

// Create tournament
createTeamTournament(name: string, teamSize: TeamSize, difficulty: Difficulty, teams: Team[]): TeamTournament

// Update match score
updateTeamMatchScore(tournament: TeamTournament, matchId: string, teamId: string, teamScore: number): TeamTournament

// Advance bracket
advanceTeamTournament(tournament: TeamTournament): TeamTournament

// Get team's next match
getTeamNextMatch(tournament: TeamTournament, teamId: string): TeamMatch | null

// Predict match outcome
predictTeamMatchOutcome(team1: Team, team2: Team): Promise<MatchPrediction>

// Calculate team synergy
calculateTeamSynergy(team: Team): number
```

## Conclusion

The team-based tournament system provides a comprehensive, AI-powered competitive experience for C9 Reflex Arena. With intelligent matchmaking, balanced team creation, and engaging tournament brackets, players can enjoy fair, competitive team-based gameplay.
