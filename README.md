# 🎮 C9 Reflex Arena - Cloud9 x JetBrains Hackathon

An electrifying reaction-time challenge game designed for Cloud9 event booths where fans compete to prove they have pro-player reflexes. Built for the **Sky's the Limit - Cloud9 x JetBrains Hackathon** (Category 4: Event Game).

## 🌟 Latest Features (v2.0)

### 🎨 Dynamic Backgrounds
Choose from 5 stunning animated backgrounds:
- **Particles** - Floating particles with dynamic connection lines
- **Waves** - Flowing sine waves with gradient colors
- **Grid** - Cyberpunk-style pulsing grid lines
- **Nebula** - Radial gradient atmospheric effects
- **Matrix** - Digital rain with glowing characters

All backgrounds run at 60fps on canvas for smooth performance.

### 🖱️ Mouse Trail Effects
Enhance your cursor with 4 trail variants:
- **Glow** - Soft, blurred light trail
- **Dots** - Discrete point particles
- **Sparkle** - Rotating star shapes
- **Line** - Connected path visualization

Fully customizable via the Customize tab.

### 🔐 Authentication System
- **GitHub Login** - One-click sign in with GitHub account
- **Custom Accounts** - Create username/password accounts
- **Guest Mode** - Play without authentication
- **Persistent Profiles** - Avatars, stats, and progress saved

### 👥 Enhanced Friends System
- **Add Friends** - Search and send friend requests
- **Challenge Friends** - Direct 1v1 score challenges
- **Friend Profiles** - View stats, win rates, and activity
- **Real-time Notifications** - Get notified of challenges and results
- **🆕 AI-Powered Matchmaking** - Intelligent opponent matching based on skill level, play style, and performance history

## 🎯 Core Features

### 🎮 Gameplay Modes
- **Quick Play** - Jump straight into action
- **Practice Mode** - Hone skills without leaderboard pressure
- **AI Adaptive Difficulty** - Dynamic difficulty adjustment based on performance
- **4 Difficulty Levels** - Easy, Medium, Hard, Insane

### 🏆 Competitive Features
- **Global Leaderboards** - Filter by difficulty level
- **1v1 Tournaments** - AI-powered skill-based matchmaking
- **Team Tournaments** - 2v2 and 3v3 bracket competitions
- **Daily/Weekly Challenges** - Time-limited objectives with exclusive rewards
- **🆕 AI Opponent Finder** - GPT-4o-powered matchmaking finds perfectly balanced opponents
- **Match Predictions** - AI-generated previews and win probability analysis

### 🎨 Customization
- **Visual Themes** - Cyberpunk, Neon Nights, Synthwave, Midnight, Arctic
- **Target Skins** - 6 unlockable designs with particle effects
- **Sound Themes** - Sci-Fi, Retro Arcade, Minimal
- **Dynamic Backgrounds** - 5 animated variants
- **Mouse Trails** - 4 effect styles

### 📊 Progression System
- **8 Achievements** - Unlock badges for milestones
- **XP & Levels** - Progress through challenge completion
- **Statistics Tracking** - Comprehensive performance analytics
- **Time-Limited Badges** - Exclusive rewards for challenge streaks

## 🛠️ Technical Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4 with custom theme
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui v4
- **Icons**: Phosphor Icons
- **State**: React Hooks + Spark KV Storage
- **AI**: GPT-4o-mini for adaptive difficulty

## 🎯 Hackathon Category

**Category 4 - Event Game**: Designed to be played by fans at LCS or VCT Event Booths and Finals Activations.

### Why This Game Fits
- ⚡ **Quick Sessions** - Games complete in 30-60 seconds
- 🎪 **Booth-Friendly** - Competitive leaderboards encourage repeat plays
- 🏅 **Spectator Appeal** - Visible scores and visual feedback
- 📱 **Accessible** - Instant play, no tutorial needed
- 🎮 **Esports-Themed** - Cloud9 branding and competitive spirit

## 🚀 Getting Started

### Run Locally
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
```

### Environment
- Node.js 18+
- Modern browser with Canvas support
- GitHub account (optional, for authentication)

## 📖 How to Play

1. **Login or Skip** - Authenticate for social features or play as guest
2. **Customize** - Choose background, mouse trail, theme
3. **Select Difficulty** - Pick your challenge level
4. **Enable AI Adaptive** (Optional) - Let AI match your skill
5. **Play** - Click targets before they disappear
6. **Compete** - Challenge friends or join tournaments
7. **Progress** - Complete challenges, unlock achievements

## 🎨 Design Philosophy

### Visual Identity
- **Primary Color**: Electric Blue (oklch(0.65 0.24 240))
- **Accent Color**: Hot Pink (oklch(0.70 0.25 350))
- **Typography**: Orbitron (headings), Rajdhani (body)
- **Aesthetic**: Cyberpunk esports with neon glows

### UX Principles
- Immediate feedback on all interactions
- Smooth 60fps animations
- Clear visual hierarchy
- Accessibility-first design
- No learning curve

## 🏗️ Architecture

### Data Persistence
- **Spark KV Storage** - Player stats, settings, achievements
- **Functional Updates** - All state changes use callbacks to prevent data loss
- **Real-time Sync** - Friends and challenges update instantly

### Performance
- Canvas-based backgrounds (60fps)
- Optimized particle systems
- Debounced mouse tracking
- Lazy-loaded components

### AI Integration
- GPT-4o-mini analyzes player metrics
- JSON mode for structured responses
- Confidence scoring for adjustments
- Real-time difficulty adaptation

## 📊 Feature Matrix

| Feature | Status | Category |
|---------|--------|----------|
| Core Gameplay | ✅ Complete | Gameplay |
| 4 Difficulty Levels | ✅ Complete | Gameplay |
| AI Adaptive Difficulty | ✅ Complete | AI/ML |
| Sound System (3 themes) | ✅ Complete | Audio |
| Leaderboards | ✅ Complete | Competitive |
| Statistics Tracking | ✅ Complete | Analytics |
| 8 Achievements | ✅ Complete | Progression |
| Daily/Weekly Challenges | ✅ Complete | Engagement |
| Friends System | ✅ Complete | Social |
| 1v1 Tournaments | ✅ Complete | Multiplayer |
| Team Tournaments | ✅ Complete | Multiplayer |
| AI Matchmaking | ✅ Complete | AI/ML |
| Visual Themes (5) | ✅ Complete | Customization |
| Target Skins (6) | ✅ Complete | Customization |
| Dynamic Backgrounds (5) | ✅ Complete | Visual Effects |
| Mouse Trails (4) | ✅ Complete | Visual Effects |
| Authentication System | ✅ Complete | User Management |
| GitHub Integration | ✅ Complete | Integration |

## 🎥 Demo Video

[Link to 3-minute demo video showcasing gameplay, features, and booth integration]


## 📜 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

- **Cloud9** - For the hackathon and esports inspiration
- **JetBrains** - For development tools and support
- **GRID** - For esports data framework
- **shadcn** - For beautiful UI components

## 🔗 Links

- [Hackathon Details](https://jetbrains-cloud9-hackathon.devpost.com/)
- [[Live Demo](#)](https://untitled--MiChaelinzo.github.app) 
- [[Source Code](https://github.com/MiChaelinzo/untitled)](https://github.com/MiChaelinzo/untitled)

---

**Built with ❤️ for the Cloud9 x JetBrains Hackathon**
