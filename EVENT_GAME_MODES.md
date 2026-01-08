# Event-Specific Game Modes Feature

## Overview
Event-specific game modes add unique gameplay mechanics tied to seasonal events, offering players fresh experiences with each celebration. Each mode features custom mechanics, visual effects, and scoring systems that align with the event's theme.

## Feature Summary
- **10 Unique Game Modes**: Each seasonal event has at least one custom game mode with distinctive mechanics
- **Custom Mechanics System**: Modular mechanics including spawn patterns, target behaviors, scoring variations, time manipulation, multi-target systems, and power-ups
- **Visual Effects**: Event-themed particles, backgrounds, target styles, trails, and screen effects
- **Progressive Unlocks**: Some modes require event progress to unlock
- **Score Modifiers**: Bonus multipliers ranging from 1.3x to 2.5x based on mode difficulty

## Event Game Modes

### 1. Winter Frostbite Rush ❄️
**Event**: Winter Wonderland
**Score Modifier**: 1.5x

**Mechanics**:
- **Freeze & Shatter**: Targets slow down over time and award 2x bonus points when frozen
- **Snowstorm Pattern**: Targets spawn in clusters of 3 within 150px radius
- **Ice Blast Power-Up**: Freezes all on-screen targets for 3 seconds (15% spawn chance)

**Visual Effects**: Snow particles, ice crystal targets, frost trails

### 2. Lunar Fireworks Frenzy 🎆
**Event**: Lunar New Year
**Score Modifier**: 1.8x

**Mechanics**:
- **Chain Reaction**: Hit targets explode in 100px radius, destroying nearby targets with 1.5x bonus
- **Lucky Numbers**: Scores ending in 8, 88, or 888 earn 2x bonus points
- **Festival Burst Pattern**: Targets spawn in circular patterns of 8 targets

**Visual Effects**: Fireworks particles, lantern-styled targets, golden glow screen effect

### 3. Valentines Heartshot Harmony 💕
**Event**: Valentine's Day
**Score Modifier**: 1.4x

**Mechanics**:
- **Heart Pairs**: Targets spawn in connected pairs, hitting both within 1 second awards 3x bonus
- **Magnetic Hearts**: Paired hearts orbit each other at 80px radius
- **Love Streak**: Consecutive pair hits increase multiplier by 0.5x (max 5x)

**Visual Effects**: Heart particles, heart-shaped targets, romantic trails

### 4. Halloween Phantom Hunt 👻
**Event**: Halloween Spooktacular
**Score Modifier**: 1.66x

**Mechanics**:
- **Phase Shift**: Targets fade in/out every 1.5s, only hittable when visible (800ms window)
- **Spectral Swarm**: Targets spawn in spiral patterns with ghost trails
- **Spirit Vision Power-Up**: Makes all targets fully visible for 5 seconds (10% spawn chance)

**Visual Effects**: Flame particles, ghostly transparent targets, dark vignette

### 5. Cyber Speed Run ⚡
**Event**: Cyber Week Blitz
**Score Modifier**: 2.0x

**Mechanics**:
- **Speed Bonus**: Faster reaction times award up to 3x bonus (2 points per millisecond under 500ms)
- **Velocity Streak**: Consecutive fast hits (<300ms) increase multiplier by 0.3x (max 10 streak)
- **Neon Rush**: Targets move 1.5x faster but award more points

**Visual Effects**: Intense sparkles, neon glow targets, lightning trails, speed lines

### 6. Ocean Wave 🌊
**Event**: Ocean Odyssey
**Score Modifier**: 1.5x

**Mechanics**:
- **Tidal Wave Pattern**: Targets spawn in flowing wave patterns with amplitude 100px
- **Current Flow**: Targets drift horizontally with ocean current
- **Wave Riding**: Hitting targets in wave sequence awards 2x bonus (1.5s window)

**Visual Effects**: Sparkles, bubble-styled targets, water ripple background

### 7. Cosmic Zero Gravity 🌌
**Event**: Cosmic Voyage
**Score Modifier**: 1.9x

**Mechanics**:
- **Orbital Drift**: Targets float with momentum in zero-G (95% friction)
- **Impact Push**: Hitting targets pushes nearby targets away (120px radius, 2.0 force)
- **Stellar Formation**: Targets spawn in constellation patterns (Orion, Cassiopeia, Ursa)

**Visual Effects**: Star particles, celestial targets, nebula background, stardust trails

### 8. Arcade Retro Blast 👾
**Event**: Arcade Legends
**Score Modifier**: 2.5x

**Mechanics**:
- **Invader Formation**: Targets spawn in 4x6 grid moving in space invader patterns
- **Brick Break**: Hitting targets causes adjacent targets to cascade down (1.5x bonus, 200ms delay)
- **Power Pellet**: Temporary invincibility and 2x score for 8 seconds (12% spawn chance)

**Visual Effects**: Pixel art targets, sparkles, CRT scanlines screen effect

### 9. Neon Pulse 🎆
**Event**: Neon Nights
**Score Modifier**: 1.75x

**Mechanics**:
- **Pulse Beat**: Targets pulse every 800ms, hitting on beat (150ms window) awards 2.5x bonus
- **Circuit Board Pattern**: Targets spawn along glowing circuit paths with connection bonuses
- **Sync Multiplier**: Consecutive on-beat hits increase multiplier by 0.5x (max 4x)

**Visual Effects**: Intense sparkles, neon pulse targets, grid background, chromatic aberration

### 10. Spring Butterfly Chase 🦋
**Event**: Spring Bloom Festival
**Score Modifier**: 1.3x

**Mechanics**:
- **Flutter Motion**: Targets move in erratic butterfly patterns, changing direction every 500ms
- **Gentle Touch**: Quick, gentle clicks (<100ms duration) earn 1.8x bonus
- **Garden Bloom**: Targets emerge from 8 flower positions with bloom animations

**Visual Effects**: Leaf particles, butterfly-wing targets, petal trails

## Technical Implementation

### Core Files
- **`/src/lib/event-game-modes.ts`**: Event game mode definitions, mechanics system, unlock logic
- **`/src/components/EventGameModeSelector.tsx`**: UI for browsing and selecting event game modes
- **`/src/components/SeasonalEventsPanel.tsx`**: Updated to include game mode button for active events

### Data Structures

```typescript
interface EventGameMode {
  id: EventGameModeId
  name: string
  description: string
  icon: string
  eventId: string
  mechanics: GameMechanic[]
  visualEffects: VisualEffect[]
  scoreModifier: number
  unlockRequirement?: {
    eventChallengesCompleted?: number
    eventScore?: number
  }
}

interface GameMechanic {
  type: 'spawn-pattern' | 'target-behavior' | 'scoring' | 'time-manipulation' | 'multi-target' | 'shield' | 'power-up'
  name: string
  description: string
  config: any
}

interface VisualEffect {
  type: 'particle' | 'background' | 'target-style' | 'trail' | 'screen-effect'
  effect: string
  intensity: number
  color?: string
}
```

### Key Functions
- `getEventGameMode(eventId)`: Retrieves all game modes for a specific event
- `getGameModeById(id)`: Gets a specific game mode by ID
- `isGameModeUnlocked(mode, challenges, score)`: Checks if requirements are met
- `applyEventMechanics(mode, gameState, action)`: Applies mechanics to game state
- `getEventModeDescription(mode)`: Generates formatted description
- `getMechanicIcon(type)`: Returns icon for mechanic type

## User Experience

### Discovery
1. Player visits Events tab and selects an active event
2. If event has game modes, "Event Game Modes" button appears
3. Button features game controller icon and is prominently placed

### Selection
1. Click button to open EventGameModeSelector modal
2. Browse available modes in grid layout
3. Each mode card shows:
   - Icon and name
   - Description
   - Score bonus percentage
   - Number of mechanics
   - Lock status with requirements

### Details View
1. Click mode card to view full details
2. See all unique mechanics with icons and descriptions
3. View visual effects list
4. "Play This Mode" button launches game with event mechanics applied

### Gameplay Integration
- Event game mode ID passed to game start: `event-{eventId}-{modeId}`
- Mechanics modify target spawn, behavior, and scoring
- Visual effects applied during gameplay
- Score multiplier displayed in HUD
- Completion counts toward event challenges

## Progression & Unlocks

### Unlock Conditions (Future Enhancement)
Some game modes can require:
- Completing specific number of event challenges
- Earning minimum event score
- Reaching certain event milestone

Currently all modes are unlocked by default to showcase the feature.

### Rewards Integration
Playing event game modes:
- Contributes to event score
- Counts toward event challenges
- Awards event-specific rewards
- Tracks in player event progress

## Future Enhancements

### Planned Features
1. **Mechanic Implementation**: Actually apply mechanics to GameArena component
2. **Visual Effect System**: Render event-specific particles and effects
3. **Leaderboards**: Separate leaderboards per event game mode
4. **Achievements**: Mode-specific achievements and milestones
5. **Replays**: Save and share event game mode gameplay
6. **Modifiers**: Let players stack multiple mechanics
7. **Community Modes**: User-created game modes voted on by community

### Balance Improvements
- Fine-tune score multipliers based on player data
- Adjust mechanic values for optimal difficulty
- Add more variety to spawn patterns
- Create unique boss targets for special modes

## Design Rationale

### Why Event-Specific Game Modes?
1. **Engagement**: Fresh gameplay keeps events exciting
2. **Variety**: Breaks monotony of standard gameplay
3. **Theme Integration**: Mechanics reinforce event themes
4. **Replayability**: Players return to try different modes
5. **Skill Expression**: Different modes reward different playstyles

### Mechanic Types Explained
- **Spawn Pattern**: How/where targets appear
- **Target Behavior**: How targets move and interact
- **Scoring**: Point calculation modifications
- **Time Manipulation**: Speed and timing changes
- **Multi-Target**: Multiple target interactions
- **Power-Up**: Temporary abilities and bonuses

### Visual Design Philosophy
Each mode's visual effects should:
- Clearly communicate the event theme
- Not obscure gameplay elements
- Enhance rather than distract
- Scale well across devices
- Maintain 60fps performance

## Testing Checklist

- [x] Event game modes defined for all major seasonal events
- [x] EventGameModeSelector component displays modes correctly
- [x] Mode cards show accurate information and icons
- [x] Details view shows all mechanics and effects
- [x] Lock/unlock system displays correct requirements
- [x] Integration with SeasonalEventsPanel working
- [ ] Game modes actually modify gameplay (future work)
- [ ] Visual effects render in GameArena (future work)
- [ ] Score multipliers apply correctly (future work)
- [ ] Event progress tracks mode completion (future work)

## Performance Considerations

- Mode data loaded lazily when Events tab opened
- Modal animation optimized with AnimatePresence
- Grid layout responsive for mobile devices
- No impact on game performance until mode selected
- Visual effects configurable for low-end devices

## Accessibility

- Clear visual hierarchy in mode selection
- Lock status communicated with both icon and text
- Color-blind friendly status indicators
- Keyboard navigation supported in modal
- Screen reader friendly descriptions

## Success Metrics

**User Engagement**:
- % of event participants trying special game modes
- Average modes played per event
- Return rate for mode-specific gameplay

**Gameplay**:
- Average scores in each mode vs standard gameplay
- Mode difficulty balance (completion rates)
- Most/least popular modes

**Technical**:
- Modal load time <100ms
- Selection interaction <50ms response
- Zero frame drops during mode selection
- 99.9% error-free mode launches
