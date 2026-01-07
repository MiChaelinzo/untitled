# AI-Powered Tournament Matchmaking

## Overview

C9 Reflex Arena now features an intelligent matchmaking system powered by GPT-4o-mini that analyzes player skill profiles to create balanced tournament brackets. The system evaluates multiple performance metrics to ensure fair, competitive matches that maximize player engagement.

## Key Features

### Skill Rating System

Players receive a comprehensive skill rating (100-5000) calculated from:
- **Accuracy**: Hit/miss ratio across all games
- **Average Score**: Normalized performance across difficulties
- **Combo Mastery**: Highest combo achieved
- **Perfect Rounds**: Percentage of games with zero misses
- **Difficulty Completion**: Bonus for completing higher difficulties

### Player Profiling

Each player has a detailed skill profile including:

1. **Skill Rating**: Overall ability score
2. **Consistency Score**: Variance in recent performance (0-1)
3. **Average Reaction Time**: Speed of target hits
4. **Preferred Difficulty**: Calculated from performance history
5. **Play Style**: Categorized as:
   - **Aggressive**: High combos, many targets per game
   - **Consistent**: High accuracy, low variance
   - **Adaptive**: Balanced approach
6. **Recent Performance**: Last 10 game scores
7. **Volatility**: Performance stability metric

### AI Matchmaking Algorithm

The system uses GPT-4o-mini to:
- Analyze player skill profiles
- Create balanced groups of 2-4 players
- Consider skill similarity (within 500 rating points ideal)
- Mix play styles for interesting dynamics
- Align difficulty preferences
- Generate fairness scores and reasoning

### Match Prediction System

For each matchup, the AI provides:
- Win probability for each player (based on skill differential)
- Competitiveness score (0-1, higher = closer match)
- Detailed analysis highlighting key factors
- Play style matchup insights

### Visual Skill Tiers

Players are categorized into visible tiers:
- **Beginner**: <1500 rating (gray)
- **Intermediate**: 1500-2499 rating (cyan)
- **Advanced**: 2500-3499 rating (blue)
- **Pro**: 3500+ rating (pink accent)

## User Experience Flow

### 1. Accessing Matchmaking
- Navigate to Tournament tab
- Click "AI Matchmaking" button (sparkle icon)
- View available players with skill profiles

### 2. Player Selection
- Browse player list showing:
  - Username and avatar
  - Skill tier badge
  - Skill rating number
  - Play style
  - Consistency bar
- Click players to select (up to 16)
- Selected players highlight with primary color

### 3. Analysis
- Click "Analyze" button with 2+ players selected
- AI processes skill data (loading state shown)
- Results appear with fairness score
- Groups displayed with recommended difficulty

### 4. Group Details
- Click any group to view match prediction
- See win probabilities for each player
- Read AI-generated competitive analysis
- View competitiveness score

### 5. Tournament Start
- Click "Start Tournament" to begin
- AI-matched players compete in brackets
- Difficulty automatically set to group recommendation

## Technical Implementation

### Skill Calculation

```typescript
skillRating = 
  (accuracy * 2000) +
  (avgScore * 0.01) +
  (highestCombo * 10) +
  (perfectRatio * 500) +
  (insaneRatio * 1000)
```

### Consistency Calculation

```typescript
consistency = 1 - (standardDeviation / mean)
// Clamped to 0-1 range
```

### Play Style Detection

- **Consistent**: consistency > 0.8 AND perfectRatio > 0.3
- **Aggressive**: highestCombo > 15 AND avgTargets > 20
- **Adaptive**: All other patterns

### Win Probability

```typescript
baseProb = 0.5 + (player1Rating - player2Rating) / (avgRating * 4)
consistencyFactor = (player1Consistency - player2Consistency) * 0.1
finalProb = baseProb + consistencyFactor
// Clamped to 0.1-0.9 range
```

### Competitiveness Score

```typescript
competitiveness = max(0, 1 - (skillDifference / 1000))
```

## AI Prompt Engineering

### Matchmaking Prompt

The system sends player data to GPT-4o-mini in JSON mode with instructions to:
- Group players by similar skill (±500 points)
- Mix play styles for variety
- Align difficulty preferences
- Calculate fairness score
- Provide reasoning

### Prediction Prompt

For match predictions, the AI receives:
- Both player profiles
- Calculated win probabilities
- Instructions to generate exciting 2-3 sentence analysis

## Fallback Strategy

If AI is unavailable:
- System uses rule-based skill sorting
- Pairs adjacent players by rating
- Calculates basic competitiveness scores
- Returns 0.7 fairness score
- Provides generic reasoning

## Benefits for Cloud9 Event Booth

1. **Reduced Skill Mismatch**: Players face appropriately skilled opponents
2. **Increased Engagement**: Competitive matches keep players interested
3. **Spectator Appeal**: Predicted outcomes add excitement
4. **Data Insights**: Skill profiles show player development
5. **Fair Competition**: Transparent fairness scoring builds trust
6. **Scalable**: Works with 2-16 players
7. **Intelligent**: AI reasoning explains matchmaking decisions

## Future Enhancements

- **ELO Rating System**: Track rating changes after matches
- **Historical Data**: Use past tournament results to improve predictions
- **Custom Constraints**: Let organizers specify matching rules
- **Team Matchmaking**: Extend to 2v2 or team tournaments
- **Live Backend**: Connect to real player database
- **Machine Learning**: Train models on actual match outcomes
- **Handicap System**: Automatic balancing for skill mismatches
- **Tournament Analytics**: Post-event analysis of fairness accuracy

## Technical Requirements

- **Spark SDK**: Uses `window.spark.llm()` API
- **LLM Model**: GPT-4o-mini in JSON mode for matchmaking
- **Storage**: KV storage for player stats
- **React**: Framer Motion for animations
- **UI**: shadcn/ui components (Card, Button, Badge, Avatar, Progress)
- **Icons**: Phosphor Icons for visual elements

## Performance Considerations

- AI calls are async with loading states
- Fallback ensures functionality without AI
- Player selection limited to 16 for performance
- Match predictions cached per group view
- Skill calculations use memoization

## Conclusion

AI-powered matchmaking transforms C9 Reflex Arena tournaments from random brackets into intelligently balanced competitions. By analyzing player skill comprehensively and using AI to optimize groupings, the system ensures fair, exciting matches that enhance the event booth experience and keep players engaged.
