# Planning Guide

C9 Reflex Arena is an electrifying reaction-time challenge game designed for Cloud9 event booths where fans compete to prove they have pro-player reflexes by tapping glowing targets as fast as possible in increasingly difficult rounds.

**Experience Qualities**: 
1. **Adrenaline-pumping** - Fast-paced gameplay with immediate feedback creates an intense, exciting experience that mirrors the pressure of competitive esports moments
2. **Competitive** - Persistent leaderboards and score tracking fuel friendly rivalry between booth visitors, encouraging repeat plays and social sharing
3. **Accessible** - Intuitive tap-to-play mechanics require zero learning curve, welcoming casual fans while still rewarding skilled players with high scores

**Complexity Level**: Light Application (multiple features with basic state)
The game features multiple rounds with increasing difficulty, score tracking, leaderboards, and player registration - all centered around a single core mechanic that's easy to understand but challenging to master.

## Essential Features

**Quick Play Mode**
- Functionality: Instant gameplay without registration - tap glowing targets before they disappear
- Purpose: Remove friction for booth visitors who want immediate action
- Trigger: "Quick Play" button on home screen
- Progression: Welcome screen → Target practice → Score reveal → Leaderboard position → Play again or register
- Success criteria: Players can complete a full game session in under 60 seconds

**Target Spawning System**
- Functionality: Circles appear randomly across the play area with shrinking timers and visual intensity, with customizable target skins (Classic Circle, Bullseye, Crosshair, Hexagon, Rising Star, Pulse Wave) unlocked through gameplay achievements. Each skin features unique visual design and animated particle effects on hit.
- Purpose: Creates the core challenge and visual excitement of the game while rewarding player progression with cosmetic customization
- Trigger: Game round starts or previous target is hit
- Progression: Target spawns with glow effect → Timer counts down → Target shrinks and fades → Hit registers points with skin-specific particle explosion → Next target spawns
- Success criteria: Targets feel responsive, fair, and visually satisfying when hit with distinct particle effects for each skin type

**Progressive Difficulty Rounds**
- Functionality: Four difficulty levels (Easy, Medium, Hard, Insane) with three rounds each, varying target count, duration, target size, and score multipliers
- Purpose: Accommodates players of all skill levels and provides progression paths from casual to pro-level gameplay
- Trigger: Difficulty selection on menu screen before starting game
- Progression: Menu difficulty selector → Round intro animation → Target sequence → Round complete celebration → Next round or final score
- Success criteria: Each difficulty level feels distinct and appropriately challenging, with clear progression within rounds

**Difficulty System**:
- **Easy**: Generous timing (4s/3s/2.5s), larger targets (100px/90px/80px), 1x score multiplier - ideal for casual players and first-time players
- **Medium**: Balanced challenge (3s/2s/1.5s), standard targets (80px/75px/70px), 1.5x score multiplier - the default experience for most players
- **Hard**: Fast reflexes required (2s/1.5s/1s), smaller targets (70px/60px/55px), 2x score multiplier, more targets per round
- **Insane**: Pro-level reflexes (1.5s/1s/0.8s), smallest targets (60px/50px/45px), 3x score multiplier, maximum target counts - for competitive players seeking the ultimate challenge

**AI Adaptive Difficulty** (NEW):
- Functionality: Machine learning-powered system that analyzes player performance in real-time and dynamically adjusts game difficulty to maintain optimal challenge
- Purpose: Keeps players in their "flow state" by preventing frustration from being too hard or boredom from being too easy, maximizing engagement and replay value
- Trigger: Optional checkbox on difficulty selection screen before starting game
- Progression: Base difficulty selected → Game starts → AI tracks reaction times, accuracy, hit/miss streaks → Every 15 seconds with 5+ targets, AI analyzes performance → Adjusts target duration, size, and spawn timing → Visual indicator shows adjustment direction → Player stays optimally challenged
- Success criteria: Players report better engagement, longer play sessions, and feel the game adapts to their skill level naturally

**AI Analysis Metrics**:
- **Reaction Time Tracking**: Records time between target spawn and hit for every successful click
- **Accuracy Rate**: Calculates hits vs total targets to measure consistency
- **Streak Analysis**: Monitors consecutive hits (suggests too easy at 8+) and misses (suggests too hard at 3+)
- **Consistency Score**: Measures standard deviation in reaction times to detect if player is maintaining steady performance
- **Performance Thresholds**: 
  - Too Easy: 85%+ accuracy, <800ms average reaction time, 8+ hit streak
  - Too Hard: <60% accuracy, >2500ms average reaction time, 3+ miss streak
  - Optimal: 75% target accuracy, ~1500ms target reaction time

**AI Adjustment Behavior**:
- **Making Harder**: Decreases target duration by 15%, reduces target size by 15%, shortens spawn delays - triggered by exceptional performance
- **Making Easier**: Increases target duration by 15%, enlarges target size by 15%, extends spawn delays - triggered by struggling performance
- **Visual Feedback**: Toast notification with direction indicator (📈 harder, 📉 easier), persistent "AI Adaptive" badge with trend icon during gameplay
- **Confidence Scoring**: AI reports 0-1 confidence score on adjustments, only applies changes above confidence threshold
- **Adjustment Limits**: Respects minimum/maximum bounds (800-5000ms duration, 40-120px size, 200-1200ms spawn delay) to prevent extreme difficulty swings
- **LLM Integration**: Uses GPT-4o-mini in JSON mode to analyze metrics and recommend specific parameter changes with reasoning

**Player Registration & Leaderboard**
- Functionality: Optional name/email entry to claim leaderboard position with difficulty tracking and receive score notification
- Purpose: Captures leads for Cloud9 while giving players bragging rights, with separate recognition for different difficulty levels
- Trigger: After completing a game with a competitive score
- Progression: Score reveal → Leaderboard position shown → Registration prompt → Name/email entry → Confirmation with position and difficulty badge → Social share option
- Success criteria: Registration feels rewarding not mandatory, leaderboard updates in real-time with clear difficulty indicators

**Statistics Tracking System**
- Functionality: Comprehensive player statistics including total games played, targets hit/missed, highest score, max combo, perfect rounds, insane mode completions, and total play time
- Purpose: Provides players with long-term progression tracking and personal performance insights that encourage repeat plays
- Trigger: Automatically tracked across all games and displayed in dedicated Stats tab
- Progression: Game completes → Stats updated in KV storage → Visible in menu Stats tab → Players can track improvement over time
- Success criteria: All stats accurately tracked and persisted, clear visual presentation of achievements

**Achievement System**
- Functionality: 8 unlockable achievements (First Blood, Sharpshooter, Combo Master, Perfectionist, Score Hunter, Insane Champion, Dedication, Marathon) with real-time unlock notifications
- Purpose: Gamification that rewards milestones and encourages different play styles and goals beyond high scores
- Trigger: Achievement requirements met during or after gameplay
- Progression: Requirement met → Toast notification appears → Achievement unlocked and saved → Visible in Achievements tab with progress indicators
- Success criteria: Achievements feel rewarding and achievable, clear feedback when unlocked, persistent across sessions

**Daily & Weekly Challenges System**
- Functionality: Rotating time-limited challenges across 4 difficulty tiers (Bronze, Silver, Gold, Platinum) with specific objectives (score targets, combo achievements, perfect rounds, difficulty clears). Players earn XP, time-limited badges (7-14 day expiry), and exclusive titles upon completion. Includes level progression system (XP-based) and challenge progress tracking that updates after each game.
- Purpose: Drives daily engagement and return visits by providing fresh objectives beyond high scores, creating urgency through time limits and rewarding consistent play with visible progression and exclusive rewards
- Trigger: Challenges auto-generate at daily (midnight) and weekly (Monday) resets, accessible via dedicated Challenges tab in menu
- Progression: Game completes → Challenge progress calculated → UI updates with progress → Challenge completes → Notification appears → Player claims reward in Challenges tab → XP added → Level increases → Badges/titles unlocked → Equipped in profile
- Success criteria: Challenges feel achievable but challenging, rewards feel valuable and exclusive, time limits create urgency without frustration, progress tracking is clear and accurate

**Practice Mode**
- Functionality: Non-competitive gameplay mode that doesn't affect leaderboard or most statistics, allowing players to warm up or learn mechanics
- Purpose: Reduces pressure for new players and provides a space for skill development without performance anxiety
- Trigger: "Practice" button on main menu alongside "Start Game"
- Progression: Practice selected → Visual indicator shows practice mode → Game plays identically → Score displayed but not saved to leaderboard
- Success criteria: Clear distinction from ranked play, no negative impact on player stats

**Social Sharing Features**
- Functionality: Integrated Twitter/X sharing with one-click capability for earned badges, completed challenges, unlocked achievements, and high scores. Each share includes pre-formatted text with appropriate emojis, hashtags, and deep links. Copy-to-clipboard fallback for sharing to any platform. Share button components intelligently generate context-aware messages.
- Purpose: Organic marketing through player social networks, increases booth visibility at events, creates FOMO for badges and challenges, drives viral engagement through competitive achievements
- Trigger: Share buttons on game over screen (high scores), achievement unlock toasts (immediate sharing), completed challenges (Challenges tab), earned badges (Badges collection), and unlocked achievements (Achievements grid)
- Progression: Achievement/badge/challenge earned → Share button appears → Click share → Dropdown menu with Twitter/X and Copy options → Twitter opens in popup with pre-filled content OR text copied to clipboard → Success toast confirms action
- Success criteria: Sharing is frictionless with intelligent auto-generated text, includes relevant hashtags (#Cloud9, #ReflexArena, difficulty/badge-specific tags), creates compelling social proof, and maintains Cloud9 branding

**Friend System & Direct Challenges**
- Functionality: Complete friend management system including player search, friend requests (send/accept/decline), friends list management, and direct 1v1 challenges. Players can search for other users by username, send friend requests, and challenge friends to compete on specific difficulties. Challenges include 24-hour expiration, score tracking for both players, automatic winner determination, and detailed match history with win/loss/draw records.
- Purpose: Drives player retention through social competition, creates personal rivalries that encourage return visits, enables skill-matched competition beyond global leaderboards, and adds multiplayer dimension to single-player reflex testing
- Trigger: Friends tab in main menu, player search bar, challenge button on friend profiles, incoming challenge notifications
- Progression: Player searches username → Sends friend request → Friend accepts → Challenge button available → Sender selects difficulty → Friend receives notification → Friend accepts challenge → Both play same difficulty → Scores compared → Winner determined → Results shown in history tab → Win/loss stats updated
- Success criteria: Friend requests deliver reliably, challenges don't expire prematurely, scores accurately tracked for both players, winner determination is clear and fair, challenge history persists across sessions, notifications alert players to pending challenges

**Score Calculation System**
- Functionality: Points awarded based on reaction speed (faster = more points), with combo multipliers for consecutive hits, difficulty multipliers (1x Easy, 1.5x Medium, 2x Hard, 3x Insane), and immersive sound effects for feedback
- Purpose: Rewards precision, speed, and challenge selection while providing satisfying audio feedback that scales with difficulty
- Trigger: Every target hit or miss during gameplay
- Progression: Target hit → Calculate reaction time → Apply combo multiplier → Apply difficulty multiplier → Play hit sound + combo sound → Add to running score → Display with satisfying animation
- Success criteria: Scoring feels fair and transparent with difficulty appropriately reflected in final scores, clear visual and audio feedback on performance

**Sound Effects System**
- Functionality: Web Audio API-powered sound effects with three distinct themes (Sci-Fi, Retro Arcade, Minimal) for hits (pitch increases with combo), misses (descending tone), combo milestones (ascending arpeggio), round starts (fanfare), and game over (descending sequence)
- Purpose: Enhances immersion and provides instant audio feedback that reinforces player actions, with customizable themes to match player preferences
- Trigger: Game events (target hit, miss, round transition, game completion)
- Progression: Action occurs → Sound synthesized in real-time with selected theme → Audio plays with appropriate volume and pitch
- Success criteria: Sounds feel responsive and satisfying without being overwhelming, with persistent user preferences for theme selection and enabling/disabling

**Target Skin System**
- Functionality: Six unlockable target skins (Classic Circle, Bullseye, Crosshair, Hexagon, Rising Star, Pulse Wave) with unique visual designs and animated particle effects. Each skin features distinct shapes, animations, and particle explosion patterns when hit. Skins unlock based on achievements: hitting target counts, achieving combos, reaching score milestones, and completing difficulty challenges.
- Purpose: Provides cosmetic customization that rewards player progression and skill milestones, adds visual variety to gameplay, enhances hit satisfaction with unique particle effects
- Trigger: Skins unlock automatically when requirements met, selectable in Customization tab, active skin persists across sessions
- Progression: Achievement requirement met → Skin unlocks → Available in Target Skins selector → Player selects preferred skin → Active in all future games → Unique particle effects trigger on each hit
- Success criteria: Each skin feels visually distinct with characteristic particle patterns (circular bursts, star explosions, hexagonal shards, crosshair lines, etc.), unlock requirements feel achievable and rewarding, skin selection persists across sessions, particle effects enhance hit satisfaction without obscuring gameplay

**AI-Powered Tournament Matchmaking** (NEW):
- Functionality: Intelligent matchmaking system powered by GPT-4o-mini that analyzes player skill profiles (skill rating, consistency, play style, reaction time) to create balanced tournament groups and predict match outcomes. System calculates comprehensive skill metrics from player statistics, determines play styles (aggressive/consistent/adaptive), and uses AI to optimize player pairings for fair competition. Includes detailed match predictions with win probabilities and competitive analysis.
- Purpose: Ensures tournaments are competitive and engaging by matching players of similar skill levels, reducing frustration from skill mismatches, and creating exciting competitive brackets. Increases replay value through intelligent pairing and provides insights into player strengths and matchup dynamics.
- Trigger: "AI Matchmaking" button on Tournament tab main screen
- Progression: Tournament tab → AI Matchmaking button → Player selection screen with skill profiles → Select 2-16 players → Click Analyze → AI processes skill data → Matchmaking results displayed with fairness score → View group details and match predictions → Start AI-matched tournament → Players compete in skill-balanced brackets
- Success criteria: Matchmaking algorithm creates balanced groups with <500 skill rating variance, fairness scores consistently above 70%, match predictions feel accurate based on observed outcomes, AI reasoning is transparent and understandable, system gracefully falls back to rule-based matching if AI unavailable

**AI Matchmaking Features**:
- **Skill Rating Calculation**: Comprehensive scoring system based on accuracy, average score, perfect rounds, combo achievements, and difficulty completions - produces ratings from 100-5000
- **Consistency Analysis**: Measures performance variance across recent games using coefficient of variation to identify reliable vs volatile players
- **Play Style Detection**: Categorizes players as "aggressive" (high combos, many targets), "consistent" (high accuracy, low variance), or "adaptive" (balanced approach)
- **AI Group Formation**: Uses LLM to analyze player profiles and create 2-4 player groups optimized for skill similarity, play style diversity, and difficulty alignment
- **Match Outcome Prediction**: AI generates win probability calculations and exciting match analysis highlighting key factors and player strengths
- **Fairness Scoring**: 0-1 score indicating tournament balance quality with detailed reasoning explaining matchmaking decisions
- **Tournament Seeding**: Automatic seeding based on multi-factor ranking (skill rating → consistency → recent performance)
- **Visual Skill Tiers**: Color-coded tier badges (Beginner/Intermediate/Advanced/Pro) for quick player assessment
- **Interactive Group Preview**: Click groups to see detailed match predictions before tournament starts
- **Confidence Metrics**: AI reports confidence scores on matchmaking decisions for transparency

## Edge Case Handling

- **Accidental taps**: Outside-target clicks don't penalize but don't grant points either, preventing frustration
- **Network issues**: Scores save locally first via KV storage, no network required for full functionality
- **Duplicate names**: Append timestamp suffix to leaderboard entries with identical names
- **Mid-game exit**: ESC key brings up quit confirmation, progress saved if player quits early
- **Leaderboard spam**: Rate limit submissions to 1 per minute per device (client-side)
- **Mobile responsiveness**: Touch targets automatically scale to minimum 44px regardless of screen size, enhanced touch feedback
- **Audio context limitations**: Web Audio API auto-initializes on user interaction (browser requirement), sound preference and theme selection persist between sessions via KV storage
- **Difficulty persistence**: Selected difficulty persists between sessions for consistent player experience
- **Mixed difficulty leaderboard**: All difficulty levels share one leaderboard with difficulty badges for context and fairness
- **Practice mode scores**: Clearly marked, don't affect leaderboard to prevent sandbagging
- **Achievement unlocks**: Queued and displayed one at a time to avoid overwhelming UI
- **Target skin unlocks**: Automatically unlock when requirements met, with toast notifications similar to achievements
- **Particle effect performance**: Limited particle count per explosion (12-24 particles) with efficient animation cleanup to maintain 60fps
- **Skin-specific particle timing**: Particle animations complete within 600-700ms to avoid cluttering screen between targets
- **Challenge refresh timing**: Challenges auto-refresh at predetermined times (daily: midnight, weekly: Monday), with client-side checks on app load
- **Expired badges**: Time-limited badges automatically removed from player inventory after expiry, with clear expiration countdown displayed
- **Challenge progress in practice mode**: Practice mode games don't count toward challenge progress to prevent farming
- **Multiple challenge completion**: Single game can complete multiple challenges simultaneously, all rewards claimable independently
- **XP and level calculations**: Level progression uses quadratic formula for balanced scaling, level-up feedback provided via toast notifications
- **Title equipping**: Players can unlock multiple titles but only equip one at a time, selection persists across sessions
- **Challenge reward claiming**: Rewards must be manually claimed in Challenges tab, preventing accidental XP/badge acquisition, share button appears after claiming
- **Keyboard shortcuts**: Space for quick restart on game over, ESC for quit confirmation during gameplay
- **Stats persistence**: All player statistics stored in KV and survive page refreshes, device changes
- **Social sharing window blocking**: If popup blockers prevent Twitter window, gracefully fallback to copy-to-clipboard with instructional toast
- **Share text personalization**: Share messages include player name when available, fallback to "I" for anonymous shares
- **Badge expiration and sharing**: Expired badges are removed from inventory but historical shares remain valid, creating scarcity-driven urgency
- **Friend system offline mode**: All friend data stored locally via KV storage, no server required for full functionality
- **Challenge expiration**: Challenges automatically expire after 24 hours, removed from active list but preserved in history
- **Duplicate challenge prevention**: Cannot send multiple active challenges to same friend, must wait for completion or expiration
- **Challenge score validation**: Both players must complete challenge on same difficulty, scores verified against difficulty multipliers
- **Friend search mock data**: Demo implementation uses mock player profiles for search functionality, easily extensible to real backend
- **Win/loss statistics**: Tracks total wins, losses, and current win streak for competitive leaderboard integration
- **Challenge notification badges**: Visual indicators on Friends tab show pending friend requests and incoming challenges
- **AI matchmaking player pool**: Demo implementation uses mix of current player stats and mock player profiles, easily extensible to real multiplayer backend
- **AI matchmaking failure**: System falls back to rule-based skill sorting if LLM API unavailable, ensuring tournaments can always be created
- **Insufficient players for matchmaking**: Requires minimum 2 players, displays clear error message if fewer selected
- **Player selection limits**: Maximum 16 players enforced with toast notification when limit reached
- **Skill profile generation**: Uses actual player stats when available, generates realistic mock data for demo players
- **Match prediction display**: Only shows predictions for groups with 2+ players, handles solo player groups gracefully
- **Tournament difficulty selection**: AI recommends difficulty based on average group skill, can be overridden by player
- **Fairness score interpretation**: Scores >0.7 considered balanced (success toast), <0.7 triggers info toast about imbalance

## Design Direction

The design should feel like stepping into a cyberpunk training facility meets esports arena - electric, high-energy, and unmistakably Cloud9. Think neon lights cutting through darkness, aggressive geometric shapes, glitch effects on transitions, and the kind of UI that makes you feel like a competitor the moment you tap in. Every interaction should pulse with intensity.

## Color Selection

A dark, high-contrast cyberpunk palette with electrifying accents that pop against near-black backgrounds.

- **Primary Color**: Cloud9 Electric Blue (oklch(0.65 0.24 240)) - The signature C9 brand color representing trust, precision, and competitive excellence
- **Secondary Colors**: 
  - Deep Space Navy (oklch(0.15 0.02 240)) - Main background creating dramatic contrast
  - Neon Cyan (oklch(0.75 0.18 195)) - Active states and highlights
- **Accent Color**: Plasma Pink (oklch(0.70 0.25 350)) - CTAs, hit effects, and combo multipliers demanding immediate attention
- **Foreground/Background Pairings**: 
  - Deep Space Navy (oklch(0.15 0.02 240)): White text (oklch(0.98 0 0)) - Ratio 14.2:1 ✓
  - Electric Blue (oklch(0.65 0.24 240)): White text (oklch(0.98 0 0)) - Ratio 5.8:1 ✓
  - Plasma Pink (oklch(0.70 0.25 350)): White text (oklch(0.98 0 0)) - Ratio 6.1:1 ✓
  - Neon Cyan (oklch(0.75 0.18 195)): Deep Navy (oklch(0.15 0.02 240)) - Ratio 8.5:1 ✓

## Font Selection

Typography should scream competitive gaming - bold, geometric, technical, and unmistakably modern.

- **Primary**: Orbitron (Google Fonts) - A futuristic geometric sans-serif that embodies the technical precision of esports
- **Secondary**: Rajdhani (Google Fonts) - A sharp, condensed typeface for UI elements and rapid information display

- **Typographic Hierarchy**:
  - H1 (Game Title): Orbitron Bold/48px/tight letter-spacing (2px)
  - H2 (Round Announcements): Orbitron SemiBold/36px/normal
  - H3 (Scores): Orbitron Medium/28px/wide letter-spacing (3px)
  - Body (Instructions): Rajdhani Medium/18px/normal line-height (1.5)
  - UI Labels: Rajdhani Bold/14px/uppercase/wide tracking
  - Leaderboard Entries: Rajdhani SemiBold/16px/tabular numbers

## Animations

Animations should create moments of explosive feedback and cyberpunk flair without slowing down the fast-paced gameplay.

**Gameplay Animations**:
- Target spawn: Scale from 0 with electric glow pulse (200ms cubic-bezier)
- Target hit: Explosive particle burst radiating outward with screen shake and satisfying audio pop
- Miss penalty: Red flash with subtle recoil animation and low descending tone
- Combo multiplier: Numbers scale up with electric arc effects and ascending note sequence

**UI Animations**:
- Button hover: Lift with neon underglow intensifying
- Screen transitions: Glitch wipe effect with RGB split and musical transition
- Score counting: Rapid numeric increment with electric crackle sound
- Leaderboard updates: Slide in from right with highlight pulse

**Audio Design**:
- Three distinct sound themes available via dropdown selector:
  - **Sci-Fi** (default): Synthesized high-frequency sine waves with noise bursts and filtered modulations - futuristic and spacey
  - **Retro Arcade**: Classic square and triangle wave chiptune sounds - nostalgic 8-bit gaming aesthetic
  - **Minimal**: Pure sine wave tones - clean and subtle for focus-oriented players
- Hit sounds: Pitch increases with combo level across all themes
- Miss sounds: Descending tones with theme-appropriate wave shapes
- Combo sounds: Theme-specific celebratory sequences
- Round start: Ascending fanfares with theme variation
- Game over: Descending sequences with theme-appropriate synthesis
- Sound preference and theme selection persist between sessions

Balance: Explosive moments on hits/scores create dopamine spikes with both visual and audio feedback, while UI animations are swift and purposeful to maintain pace.

## Component Selection

- **Components**:
  - **Button** (shadcn): Primary actions with custom glow effects via Tailwind shadow utilities
  - **Card** (shadcn): Score displays, leaderboard entries with dark backdrop-blur glass morphism
  - **Input** (shadcn): Registration form with neon focus states
  - **Progress** (shadcn): Round timers with custom gradient fills
  - **Dialog** (shadcn): Round transitions and final score reveals with dramatic animations
  - **Badge** (shadcn): Combo multipliers and achievement callouts
  - **Separator** (shadcn): Visual breaks in leaderboards and menus

- **Customizations**:
  - Custom target component: Circular div with animated SVG ring timer and radial gradient glow
  - Particle system: Canvas-based explosion effects on successful hits
  - Glitch text component: CSS-based RGB split effect for dramatic moments
  - Pulse rings: Expanding circles on target spawn using framer-motion

- **States**:
  - Buttons: Default (neon outline), Hover (filled glow), Active (pressed scale), Disabled (dimmed 50% opacity)
  - Targets: Spawning (scale in), Active (pulsing glow), Hit (explode), Miss (fade red)
  - Inputs: Default (subtle border), Focus (electric blue ring glow), Error (plasma pink border), Success (cyan border)

- **Icon Selection**:
  - Target/Crosshair: Game core mechanic indicator
  - Lightning Bolt: Speed bonuses and combo multipliers
  - Trophy: Leaderboard and achievements
  - Play/Pause: Game controls
  - User: Player registration
  - ArrowRight: CTAs and progression
  - Crown: Top leaderboard positions
  - SpeakerHigh/SpeakerSlash: Audio control toggle
  - Waveform: Sound theme selector indicator
  - ShareFat: Social sharing actions
  - XLogo (Twitter/X): Platform-specific sharing
  - Copy/Check: Copy-to-clipboard feedback states

- **Spacing**:
  - Section gaps: 8-12 (32-48px)
  - Card padding: 6-8 (24-32px)
  - Button padding: 4 horizontal, 3 vertical
  - Target spacing: Minimum 16 (64px) between simultaneous targets
  - Consistent 4px base unit throughout

- **Mobile**:
  - Game canvas fills viewport minus 80px header/footer safe zones
  - Targets scale from 80px desktop to 60px mobile minimum
  - Leaderboard switches from 3-column grid to single column stack
  - Registration form moves from horizontal to vertical layout
  - Font sizes reduce by 20% on mobile (H1: 48px → 38px, Body: 18px → 14px)
