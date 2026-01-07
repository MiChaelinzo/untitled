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
- Functionality: Circles appear randomly across the play area with shrinking timers and visual intensity
- Purpose: Creates the core challenge and visual excitement of the game
- Trigger: Game round starts or previous target is hit
- Progression: Target spawns with glow effect → Timer counts down → Target shrinks and fades → Hit registers points or miss penalizes → Next target spawns
- Success criteria: Targets feel responsive, fair, and visually satisfying when hit

**Progressive Difficulty Rounds**
- Functionality: Three rounds of increasing challenge (Round 1: 10 targets/3s each, Round 2: 15 targets/2s each, Round 3: 20 targets/1.5s each)
- Purpose: Builds tension and separates casual players from pro-level reflexes
- Trigger: Previous round completes successfully
- Progression: Round intro animation → Target sequence → Round complete celebration → Next round or final score
- Success criteria: Difficulty curve feels challenging but achievable, with clear progression

**Player Registration & Leaderboard**
- Functionality: Optional name/email entry to claim leaderboard position and receive score notification
- Purpose: Captures leads for Cloud9 while giving players bragging rights
- Trigger: After completing a game with a competitive score
- Progression: Score reveal → Leaderboard position shown → Registration prompt → Name/email entry → Confirmation with position → Social share option
- Success criteria: Registration feels rewarding not mandatory, leaderboard updates in real-time

**Score Calculation System**
- Functionality: Points awarded based on reaction speed (faster = more points), with combo multipliers for consecutive hits and immersive sound effects for feedback
- Purpose: Rewards precision and speed, creating competitive depth while providing satisfying audio feedback
- Trigger: Every target hit or miss during gameplay
- Progression: Target hit → Calculate reaction time → Apply combo multiplier → Play hit sound + combo sound → Add to running score → Display with satisfying animation
- Success criteria: Scoring feels fair and transparent, with clear visual and audio feedback on performance

**Sound Effects System**
- Functionality: Web Audio API-powered sound effects with three distinct themes (Sci-Fi, Retro Arcade, Minimal) for hits (pitch increases with combo), misses (descending tone), combo milestones (ascending arpeggio), round starts (fanfare), and game over (descending sequence)
- Purpose: Enhances immersion and provides instant audio feedback that reinforces player actions, with customizable themes to match player preferences
- Trigger: Game events (target hit, miss, round transition, game completion)
- Progression: Action occurs → Sound synthesized in real-time with selected theme → Audio plays with appropriate volume and pitch
- Success criteria: Sounds feel responsive and satisfying without being overwhelming, with persistent user preferences for theme selection and enabling/disabling

## Edge Case Handling

- **Accidental taps**: Outside-target clicks don't penalize but don't grant points either, preventing frustration
- **Network issues**: Scores save locally first, sync to leaderboard when connection restored
- **Duplicate names**: Append timestamp suffix to leaderboard entries with identical names
- **Mid-game exit**: Auto-save progress and offer resume on return
- **Leaderboard spam**: Rate limit submissions to 1 per minute per device
- **Mobile responsiveness**: Touch targets automatically scale to minimum 44px regardless of screen size
- **Audio context limitations**: Web Audio API auto-initializes on user interaction (browser requirement), sound preference and theme selection persist between sessions via KV storage

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
