# Planning Guide

## Enhanced Edition - Major Update

**What's New in This Release:**
This enhanced edition introduces four major client-requested features that significantly improve user engagement and the competitive experience:

1. **Replay System**: Complete game recording and playback with performance analysis tools
2. **Community Feed**: Real-time social activity stream showing achievements across the player base  
3. **CSS Grid API Integration**: Professional grid-based layouts throughout the application for better responsiveness
4. **Enhanced Data Visualization**: Reaction time heatmaps, accuracy trends, and performance analytics

These features address key user requests for:
- Learning and improvement tools (replays for self-analysis)
- Social engagement and FOMO (community feed with reactions)
- Professional UI/UX (grid-based responsive layouts)
- Deeper insights (performance analytics and trends)

C9 Reflex Arena is an electrifying reaction-time challenge game designed for Cloud9 event booths where fans compete to prove they have pro-player reflexes by tapping glowing targets as fast as possible in increasingly difficult rounds. The game features comprehensive multiplayer capabilities, dynamic visual customization, and a robust social system that creates a competitive community experience.

**Experience Qualities**: 
1. **Adrenaline-pumping** - Fast-paced gameplay with immediate feedback creates an intense, exciting experience that mirrors the pressure of competitive esports moments
2. **Competitive** - Persistent leaderboards and score tracking fuel friendly rivalry between booth visitors, encouraging repeat plays and social sharing
3. **Accessible** - Intuitive tap-to-play mechanics require zero learning curve, welcoming casual fans while still rewarding skilled players with high scores

**Complexity Level**: Complex Application (advanced functionality with multiple views)
The game features extensive multiplayer systems (1v1 tournaments, team competitions), social features (friends, challenges, matchmaking), dynamic backgrounds, persistent progression, customization options, and AI-powered adaptive difficulty - all built around competitive reflex gameplay.

## Essential Features

**Grid-Based Responsive Layout System** (NEW):
- Functionality: CSS Grid-powered layout system that automatically adapts to different screen sizes with sophisticated grid templates for dashboards, leaderboards, tournaments, and game arenas. Implements named grid areas, auto-fit columns, and responsive breakpoint adjustments for optimal space utilization.
- Purpose: Provides professional, magazine-quality layouts that scale beautifully across devices, improves information density without clutter, enables complex multi-panel interfaces, and creates visual hierarchy through intentional grid placement
- Trigger: Applied automatically across all major UI sections (menu tabs, game arena, tournament brackets, analytics dashboard)
- Progression: Component renders → Grid container established → Child elements placed in named areas → Responsive queries adjust grid template → Layout reflows smoothly → Consistent spacing maintained
- Success criteria: All layouts use Grid API where appropriate, responsive breakpoints work seamlessly, no layout shifts or jumps, information hierarchy clear, mobile layouts stack intelligently

**Replay System & Match History** (NEW):
- Functionality: Complete game replay system that records all target spawns, hit timings, miss events, combo chains, and scores. Players can review any past game with visual playback showing targets appearing and hits registering in real-time. Includes detailed performance analysis with reaction time distribution heatmaps (fast/medium/slow categories), event logs with timestamps, and comprehensive game statistics.
- Purpose: Enables players to learn from mistakes, identify improvement opportunities, analyze performance patterns over time, and creates shareable content for competitive analysis. Supports self-improvement and skill development through detailed post-game review.
- Trigger: Games automatically recorded (non-practice mode), accessed via "Replays" tab in main menu with search, filter, and sort capabilities
- Progression: Game plays → All events timestamped and recorded → Replay saved to KV storage → Browse replay library with grid layout → Select replay → Full-screen playback view with controls (play/pause, speed adjustment 0.5x-2x, timeline scrubbing) → View performance summary and analysis → Delete unwanted replays
- Success criteria: Replays accurately recreate gameplay with <100KB storage per game, playback controls responsive with smooth animations, analysis tools provide actionable insights (reaction time heatmaps show fast/medium/slow distribution), replay library searchable and filterable by player/difficulty, grid layout adapts beautifully to screen size

**Community Social Feed** (NEW):
- Functionality: Real-time activity feed displaying recent player achievements, high scores, challenge completions, perfect games, combo records, and streak milestones across the entire player base. Features grid-based card layout with user avatars, timestamps, activity descriptions, and interactive emoji reactions (fire, trophy, lightning, star). Includes filtering by activity type (scores, achievements, perfect games) and view modes (Recent/Trending). Activities automatically generate from gameplay with natural language descriptions.
- Purpose: Creates sense of active community and drives competition through visibility of others' accomplishments, provides inspiration and goals through trending achievements, encourages social connections via reactions and profile views, and increases engagement through FOMO and competitive spirit
- Trigger: "Community" tab in main menu, feed auto-populates from all player activities with most recent first
- Progression: Player completes action → Activity automatically created and logged → Feed updates with new entry → Other players see activity in grid layout → React with emojis (fire/trophy/lightning/star) → Emoji counts update in real-time → Filter by activity types or switch to Trending view → Trending algorithm surfaces most-reacted activities from last 24 hours
- Success criteria: Feed displays activities in responsive grid layout (auto-fill minmax for fluid columns), updates smoothly without performance impact, emoji reactions work reliably with visual feedback, activities feel relevant and interesting with natural language descriptions, filtering and sorting work instantly, empty states provide helpful guidance, grid layout stacks beautifully on mobile

**Power-Ups System** (NEW):
- Functionality: Collectible power-ups that spawn during gameplay providing temporary advantages: Slow Motion (halves game speed for 3s), Magnet (auto-attracts clicks to targets within 50px radius for 5s), Shield (protects from next miss), Double Points (2x score for 10s), and Time Freeze (pauses target timers for 2s). Power-ups appear as glowing icons between regular targets with distinct colors and animations.
- Purpose: Adds strategic depth to reflexes-only gameplay, creates exciting comeback moments, rewards spatial awareness, provides content variety, and introduces risk-reward decisions
- Trigger: Power-ups spawn randomly every 8-12 targets during gameplay, enabled/disabled in settings
- Progression: Power-up spawns with particle effect → Player clicks to collect → Activation animation plays → Effect applied for duration → Visual indicator shows remaining time → Effect expires with feedback → Stats track power-up usage
- Success criteria: Power-ups feel fair and balanced, spawn rate appropriate, visual effects clear but not distracting, collection satisfying, strategic value evident, can be disabled for purist gameplay

**Authentication & User Profiles**
- Functionality: Optional login system with GitHub authentication or custom account creation, guest play available, persistent user profiles with avatars and statistics
- Purpose: Enable social features, friend systems, and cross-session progression while maintaining accessibility for casual players
- Trigger: App launch shows login screen with GitHub sign-in, account creation, or skip to guest mode
- Progression: Login screen → Authentication → Profile creation/loading → Main menu with personalized data → Friends and challenges available
- Success criteria: Seamless GitHub integration, guest mode fully functional, profiles persist across sessions, avatars display correctly

**Dynamic Background System** (ENHANCED)
- Functionality: Eleven animated background variants organized into three themed collections - Nature (Ocean Waves, Aurora Borealis, Nautilus Spirals), Tech (Cyber Grid, Matrix Code, Binary Rain, Hex Network, Geometric Shapes), and Space (Star Constellation, Cosmic Nebula, Stellar Particles). Each theme features coordinated ambient gradient colors that complement the canvas animations for a cohesive visual experience.
- Purpose: Creates immersive atmosphere and visual variety, allows players to easily discover backgrounds that match their preferred aesthetic through curated collections, enhances the cyberpunk/esports aesthetic while offering natural and cosmic alternatives
- Trigger: Selected in Customize tab through themed tabs (Nature/Tech/Space), persists across all app screens and game modes
- Progression: Customize tab → Select theme category tab → View collection description → Choose background from curated set → Preview effect with theme-matched gradients → Selection saved → Background animates across all views
- Success criteria: Smooth 60fps animations, no performance impact on gameplay, transitions seamless, all variants visually distinct and polished, theme groupings intuitive, ambient gradients complement animations

**Mouse Trail Effects** (NEW)
- Functionality: Four trail variants (Glow particles, Dots, Sparkles, Line path) that follow cursor movement with customizable enable/disable and color options
- Purpose: Enhances visual feedback, improves cursor tracking during fast gameplay, adds personality and customization
- Trigger: Enabled/styled in Customize tab, active across menu and gameplay
- Progression: Customize tab → Toggle trail → Select variant → Trail follows mouse immediately → Settings persist
- Success criteria: Trails smooth and responsive, no lag or stutter, easy to disable, variants feel distinct, minimal performance overhead

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

**Theme-Based Achievement Rewards System** (NEW):
- Functionality: Comprehensive progression system with 42 unlockable cosmetic rewards across 7 categories: Visual Themes (5), Backgrounds (11), Sound Themes (3), Target Skins (6), Mouse Trails (4), Profile Badges (5), and Titles (8). Rewards unlock through gameplay achievements, level progression, score milestones, combo streaks, and challenge completions. Each reward has rarity classification (Common/Rare/Epic/Legendary/Mythic) with corresponding visual effects and unlock difficulty. Centralized "Rewards Vault" for browsing, tracking progress, and equipping unlocks.
- Purpose: Creates long-term progression incentives beyond single-session gameplay, rewards skill mastery with meaningful cosmetic customization, encourages diverse playstyles through varied unlock requirements, provides collection-driven goals that increase replay value, enhances player identity through customization choices
- Trigger: Rewards unlock automatically after meeting requirements (post-game, level-up, achievement), accessed via "Rewards" tab in main menu
- Progression: Complete requirement (level up/achievement/challenge) → Unlock notification appears with rarity celebration → Item added to collection → Browse Rewards Vault organized by category tabs → View locked items with progress bars showing requirements → Equip unlocked rewards → Customizations applied across all game modes → Share unlocks socially
- Success criteria: All 42 rewards feel meaningful and visually distinct, unlock requirements span beginner to master skill levels, Rewards Vault is intuitive to navigate with clear progress tracking, unlock notifications feel celebratory with rarity-appropriate effects, equipped items persist across sessions, progression curve encourages continued play from Level 1 to 25+

**Reward Categories and Examples**:
- **Visual Themes**: Complete color palette changes (Cyberpunk/Neon City/Matrix/Sunset/Ice) unlocked via level progression and achievements
- **Backgrounds**: 11 animated backgrounds in Nature/Tech/Space collections, ranging from Common (Particles) to Mythic (Geometric Shapes)
- **Sound Themes**: Audio feedback styles (Sci-Fi/Retro/Minimal) unlocked through gameplay milestones
- **Target Skins**: Visual target variations with unique particles, unlocked via combos and score achievements
- **Mouse Trails**: Cursor effect styles (Dots/Glow/Sparkle/Line) for enhanced visual feedback
- **Profile Badges**: Prestige indicators (Founder/Speedster/Perfectionist/Insane Master) showing accomplishment level
- **Titles**: Displayable player ranks (Rookie→Pro→Elite→Legend→Mythic) plus specialty titles (Combo King/Sharpshooter)

**Rewards Vault Features**:
- Seven category tabs with unlock counters (e.g., "3/5 Visual Themes Unlocked")
- Progress bars and requirement details for locked items
- Rarity-based visual presentation with glowing effects and color coding
- One-click equip functionality for unlocked items
- "Check for Unlocks" button to scan for newly available rewards
- Current equipment clearly highlighted with ring indicators
- Multi-requirement tracking for legendary/mythic items

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

**Team-Based Tournament System** (NEW):
- Functionality: Comprehensive 2v2 and 3v3 team tournament system with AI-powered team balancing, bracket generation, and match prediction. Players are grouped into teams based on skill profiles, with automatic captain assignment and synergy calculations. Teams compete in single-elimination brackets with combined scores determining winners. AI analyzes team compositions, predicts match outcomes with probability calculations, and identifies key competitive factors.
- Purpose: Adds multiplayer team dimension to individual competition, enables social cooperative gameplay at events, creates deeper strategic engagement through team dynamics, and provides esports-style tournament experience fitting Cloud9's brand. Team format drives longer booth engagement and encourages groups of friends to play together.
- Trigger: "Teams" tab in main menu, team size selection (2v2 or 3v3)
- Progression: Teams tab → Select 2v2 or 3v3 format → AI Matchmaking panel → Select 4-9 players → AI analyzes and creates balanced teams → Review team compositions, synergy scores, and balance metrics → Preview potential matchups with predictions → Start tournament → Play team matches with combined scoring → Bracket advances automatically → Championship celebration for winning team
- Success criteria: Teams feel balanced with <300 average skill variance between teams, balance scores consistently above 80%, team synergy scores accurately reflect skill distribution, match predictions provide engaging competitive context, bracket advancement works reliably, team celebrations highlight all team members

**Team Tournament Features**:
- **2v2 Format**: Two-player teams for fast-paced duo competition, minimum 4 players (2 teams), ideal for tight booth spaces
- **3v3 Format**: Three-player teams for strategic trio gameplay, minimum 6 players (2 teams), better for larger event activations
- **AI Team Balancing**: GPT-4o-mini analyzes player skills and creates balanced teams considering skill ratings, play styles, consistency scores, and strategic synergy potential
- **Captain System**: Highest-skilled player auto-assigned as team captain with special crown badge and leadership representation
- **Team Colors**: Unique color coding (8 vibrant colors) for easy visual identification throughout brackets
- **Synergy Calculation**: Mathematical synergy score (0-100%) based on skill variance within team, higher = more balanced
- **Combined Team Scoring**: Individual player scores aggregate to team total, all team members contribute equally
- **Team Match Predictions**: AI predicts win probabilities, competitiveness scores, and identifies 3 key factors determining match outcomes
- **Bracket Visualization**: Clean tournament bracket display with team rosters, current scores, match status, and winner badges
- **Team Statistics**: Win/loss records, average skill, match history tracked per team
- **Winner Celebration**: Special championship screen highlighting winning team with all player names, avatars, and team colors
- **Balance Metrics**: Real-time balance score (0-100%) showing tournament fairness with AI reasoning and confidence levels
- **Match Preview**: Click team matchups to see detailed predictions, key factors, and AI analysis before matches start
- **Flexible Tournament Size**: Support for 2-8 teams in single-elimination brackets, scales from quick 2-team finals to full 8-team tournaments

**Performance Analytics & Advanced Features** (NEW):
- Functionality: Comprehensive analytics dashboard combining global statistics, daily streak system, performance tracking, quick actions menu, and custom difficulty builder. Features include community-wide statistics tracking, streak rewards system with time-limited bonuses, detailed performance trends analysis, one-click access to frequent actions, and complete custom difficulty creation with visual builder interface.
- Purpose: Provides deep insights into player performance over time, encourages daily engagement through streak rewards, reduces friction with quick action shortcuts, enables personalized challenge creation for varied gameplay experiences, and displays community-wide achievements to drive competition and engagement
- Trigger: New "Analytics" tab in main menu, accessible alongside existing tabs
- Progression: Select Analytics tab → View global community stats with 8 key metrics → Check daily streak status and available rewards → Review recent game performance with trend analysis → Access quick actions for instant gameplay → Create custom difficulties with preset templates or full customization
- Success criteria: All components load instantly, global stats accurately aggregate across all players, streak tracking persists daily and awards unlock reliably, performance trends show meaningful data with >10 game history, quick actions reduce clicks to play by 50%, custom difficulties support full parameter control and validate correctly

**Global Statistics Dashboard**:
- **Community Metrics**: Total games played, targets hit, all-time high score, best combo, fastest reaction time, average accuracy, perfect rounds, most popular difficulty
- **Real-time Updates**: Statistics update after every non-practice game completion
- **Visual Presentation**: 8-card grid layout with color-coded icons and animated stat reveals
- **Last Updated Timestamp**: Shows freshness of community data

**Daily Streak System**:
- **Streak Tracking**: Current streak, longest streak ever, total play days counted automatically
- **5 Milestone Rewards**: Day 3 (500 XP), Day 5 (title), Day 7 (badge), Day 14 (skin), Day 30 (theme)
- **Progress Visualization**: Next milestone progress bar with days remaining
- **One-Click Reward Claiming**: Available rewards shown prominently with claim buttons
- **Streak History**: Visual timeline showing all milestone checkpoints and completion status
- **Auto-Detection**: System automatically updates streak on first play each day
- **Grace Period**: Missing one day breaks streak but preserves longest streak record

**Performance Analytics**:
- **Trend Analysis**: Score, accuracy, and reaction time trends with % change indicators
- **Recent Games Tab**: Last 10 games with detailed performance breakdown per session
- **Best Performances Tab**: Top 10 high scores with medals for top 3 positions
- **Comparative Metrics**: Shows improvement/decline trends over rolling windows
- **Session Details**: Date, difficulty, score, accuracy, average reaction time, combo, practice mode indicator

**Quick Actions Menu**:
- **5 One-Click Actions**: Quick Play (medium), Practice Mode, Last Played difficulty, Daily Challenge, Tournament
- **Smart Ordering**: Recently used actions appear first for faster access
- **Visual Indicators**: Recent actions show pulse animation
- **Action Tracking**: System remembers last 5 used actions
- **Instant Navigation**: Buttons either start game immediately or navigate to relevant tab

**Custom Difficulty Builder**:
- **Full Parameter Control**: 3 rounds × (duration, size, target count) + score multiplier + spawn delay
- **Interactive Sliders**: Real-time visual feedback on all adjustments with value display
- **4 Preset Templates**: Sniper Mode (tiny/slow), Blitz (large/fast), Zen Mode (relaxed), Chaos (random)
- **Validation System**: Real-time error checking prevents invalid configurations
- **Custom Difficulty Cards**: Shows created difficulties with stats, high scores, play counts
- **One-Click Play**: Launch custom difficulty directly from card
- **Delete Management**: Remove unwanted custom difficulties with confirmation
- **Persistent Storage**: All custom difficulties saved via KV and survive sessions

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
- **Team tournament minimum players**: 2v2 requires 4+ players, 3v3 requires 6+ players, clear error messages if insufficient
- **Team balancing failure**: Falls back to sequential team creation (alternating best players) if AI unavailable
- **Team size mismatch**: Cannot mix 2v2 and 3v3 teams in same tournament, enforced at creation
- **Uneven player distribution**: Extra players (not divisible by team size) are excluded with notification, suggests adding/removing players
- **Team captain determination**: Always highest skill rating, ties broken by consistency score then recent performance
- **Team color assignment**: 8 unique colors cycle through teams, visually distinct for bracket clarity
- **Incomplete team matches**: Match requires both team scores to complete, partial scores show "in-progress" status
- **Team match scoring**: All team members' individual scores must be recorded for accurate aggregation
- **Bracket advancement**: Only advances when all current round matches completed, prevents race conditions
- **Team synergy edge cases**: Single-skill teams show 100% synergy, widely varied skills show lower synergy
- **Match prediction timeouts**: If AI prediction takes >5s, shows fallback generic analysis
- **Team tournament state**: All tournament data persists via useState, resets only when explicitly creating new tournament
- **Mid-tournament exit**: Progress saved in component state but lost on page refresh (acceptable for event booth usage)
- **Winner celebration**: Shows on tournament completion only when winnerId exists and all matches done
- **Theme reward unlocks**: Automatically checked post-game, queued notifications prevent UI spam, unlock state persists via KV storage
- **Rarity visual effects**: Each tier has distinct glow colors and animations, higher rarities feature more dramatic unlock celebrations
- **Reward equip conflicts**: Only one item per category can be equipped at a time, equipping new item automatically unequips previous
- **Progress bar calculations**: Real-time progress tracking shows exact requirements (e.g., "Level 8/10", "15,000/25,000 points")
- **Multi-requirement unlocks**: Legendary/mythic items requiring multiple conditions check all requirements simultaneously, partial progress shown
- **Vault category persistence**: Last viewed tab persists between sessions for quick return to favorite category
- **Unlock notification queue**: Multiple simultaneous unlocks display sequentially with 5-second intervals, preventing overlap
- **Default starter items**: All players begin with Common tier basics (Cyberpunk theme, Particles background, Sci-Fi sounds, etc.) for immediate customization
- **Locked item preview**: Hovering locked items shows requirements and current progress without needing to open details
- **Theme application**: Visual theme changes take effect immediately across all UI elements, no page refresh required
- **Achievement-based unlocks**: Items requiring specific achievements check unlock status on achievements tab interaction
- **Level-based gating**: Higher level requirements create aspirational long-term goals, no exploits to skip progression
- **Collection statistics**: Accurate count of unlocked vs total items per category, updates in real-time
- **Duplicate unlock prevention**: System checks existing unlocks before triggering notifications, prevents re-unlock bugs
- **Equipped item indicators**: Currently active cosmetics clearly marked in vault and persist across game sessions
- **Global stats race conditions**: Stats update atomically per game, preventing data loss from concurrent sessions
- **Streak timezone handling**: Streak resets based on local midnight, consistent across time zones
- **Streak reward double-claiming**: System checks claimed status before awarding, prevents duplicate rewards
- **Performance analytics empty state**: Shows helpful message when <2 games played, prompts user to start playing
- **Trend calculation minimum**: Requires 2+ games for trends, shows neutral state otherwise
- **Quick actions without history**: All actions available even on first use, ordering defaults to logical priority
- **Recent action tracking overflow**: List caps at 5 most recent, oldest automatically removed
- **Custom difficulty validation**: Prevents save if any parameter out of bounds, shows specific error messages
- **Custom difficulty name conflicts**: Allows duplicate names with unique IDs, sorted by creation time
- **Custom difficulty limits**: No hard limit on created difficulties, performance tested up to 50+
- **Slider interaction**: Real-time value updates, no lag or jump on rapid adjustments
- **Preset loading**: Overwrites current form, warns if unsaved changes exist
- **Analytics tab initial load**: Shows empty states gracefully, loads fastest available data first
- **Session history storage**: Game sessions capped at 100 most recent to prevent storage bloat
- **Global stats initialization**: Starts at zero for new installations, updates incrementally per game

## Design Direction

The design should evoke a premium futuristic HUD interface with stunning neon glow effects - think high-end sci-fi visualization with circular glowing targets, intense bloom lighting, geometric HUD frames, and floating UI panels. Every element should feel like it's projected from advanced holographic technology with vibrant cyan outer rings and hot pink/magenta energy cores. The aesthetic should be polished, theatrical, and mesmerizing with particle trails and atmospheric lighting that creates depth and dimension.

## Color Selection

A rich deep space palette with electric neon accents creating dramatic bloom and glow effects.

- **Primary Color**: Neon Cyan Glow (oklch(0.78 0.20 200)) - Brilliant cyan for outer target rings, highlights, and primary UI borders creating that signature holographic look
- **Secondary Colors**: 
  - Deep Space Indigo (oklch(0.18 0.08 260)) - Rich dark background with subtle blue undertones for depth
  - Electric Magenta (oklch(0.72 0.28 340)) - Hot pink/magenta for target centers, energy cores, and critical alerts with intense bloom
- **Accent Color**: Bright White Core (oklch(0.98 0.02 200)) - Pure bright centers with slight cyan tint for maximum bloom and intensity
- **Foreground/Background Pairings**: 
  - Deep Space Indigo (oklch(0.18 0.08 260)): White text (oklch(0.98 0 0)) - Ratio 12.8:1 ✓
  - Neon Cyan (oklch(0.78 0.20 200)): Deep Space (oklch(0.18 0.08 260)) - Ratio 9.2:1 ✓
  - Electric Magenta (oklch(0.72 0.28 340)): White text (oklch(0.98 0 0)) - Ratio 6.5:1 ✓
  - HUD Frame Gray (oklch(0.45 0.02 260)): Deep Space (oklch(0.18 0.08 260)) - Ratio 4.2:1 ✓

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

**Grid API Implementation**:
- **CSS Grid for Responsive Layouts**: All major components now use CSS Grid API for sophisticated, responsive layouts that adapt beautifully across device sizes
- **Named Grid Areas**: Dashboard components use semantic grid areas (header/sidebar/main/footer) for clear layout structure
- **Auto-fit Columns**: Leaderboards, replay libraries, and community feeds use `repeat(auto-fill, minmax())` for fluid responsive grids
- **Grid Template Columns/Rows**: Tournament brackets, analytics dashboards, and performance metrics use explicit grid templates for precise control
- **Responsive Grid Breakpoints**: Mobile layouts automatically stack grid columns vertically using media query classes
- **Grid Gap Spacing**: Consistent spacing maintained through grid-gap properties rather than margin/padding on children

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
