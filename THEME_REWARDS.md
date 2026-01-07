# Theme-Based Achievement Rewards System

## Overview

The C9 Reflex Arena now features a comprehensive theme-based reward system that unlocks cosmetic customizations through gameplay achievements, challenges, and progression. Players can earn and equip visual themes, backgrounds, sound themes, target skins, mouse trails, profile badges, and titles.

## Reward Categories

### 1. Visual Themes (5 themes)
Complete theme packages that change the entire color palette of the game:
- **Cyberpunk** (Common) - Classic Cloud9 electric blue aesthetic - Unlocked at Level 1
- **Neon City** (Rare) - Tokyo nights with purple and gold - Unlocked at Level 5
- **Matrix** (Rare) - Green code rain aesthetic - Unlock achievement: Combo Master
- **Sunset Blaze** (Epic) - Warm orange and red tones - Score 75,000 points
- **Arctic Ice** (Legendary) - Cool blues and frost white - Complete Perfectionist achievement + Level 10

### 2. Backgrounds (11 backgrounds)
Dynamic animated backgrounds organized by theme collections:

**Tech Collection:**
- **Cyber Grid** (Common) - Play 5 games
- **Matrix Code** (Rare) - Achieve 15x combo
- **Binary Rain** (Legendary) - Beat Hard difficulty
- **Hex Network** (Epic) - Earn 1000 XP
- **Geometric Shapes** (Mythic) - Beat Insane + Level 15

**Space Collection:**
- **Stellar Particles** (Common) - Unlocked at Level 1
- **Cosmic Nebula** (Rare) - Reach Level 3
- **Star Constellation** (Epic) - Score 50,000 points

**Nature Collection:**
- **Ocean Waves** (Rare) - Unlock Sharpshooter achievement
- **Aurora Borealis** (Epic) - Complete 3 perfect rounds
- **Nautilus Spirals** (Legendary) - Level 8 + Perfectionist achievement

### 3. Sound Themes (3 themes)
Different audio feedback styles:
- **Sci-Fi** (Common) - Futuristic laser sounds - Unlocked at Level 1
- **Retro Arcade** (Rare) - Classic 8-bit gaming sounds - Play 10 games
- **Minimal** (Rare) - Clean, subtle audio feedback - Unlock Dedication achievement

### 4. Target Skins (6 skins)
Custom target shapes with unique particle effects:
- **Default** (Common) - Classic circular target - Unlocked at Level 1
- **Neon Ring** (Rare) - Glowing neon outline - Achieve 10x combo
- **Hexagon** (Rare) - Six-sided geometric shape - Score 25,000 points
- **Star** (Epic) - Five-pointed star shape - Unlock Score Hunter achievement
- **Diamond** (Epic) - Brilliant diamond shape - Complete 5 perfect rounds
- **Skull** (Legendary) - Dangerous skull icon - Unlock Insane Champion achievement

### 5. Mouse Trails (4 trails)
Visual effects that follow the cursor:
- **Dot Trail** (Common) - Simple dot particles - Unlocked at Level 1
- **Glow Trail** (Rare) - Glowing light trail effect - Reach Level 3
- **Sparkle Trail** (Epic) - Sparkling particle effects - Achieve 20x combo
- **Line Trail** (Rare) - Smooth line following cursor - Score 30,000 points

### 6. Profile Badges (5 badges)
Prestige indicators displayed on player profiles:
- **Founder** (Legendary) - Early player badge - Unlocked at Level 1
- **Speedster** (Epic) - Master of quick reflexes - Achieve 25x combo
- **Elite Sharpshooter** (Epic) - Unmatched accuracy - Unlock Sharpshooter achievement
- **Perfectionist** (Legendary) - Never misses a shot - Complete 10 perfect rounds
- **Insane Master** (Mythic) - Conquered ultimate challenge - Insane Champion + Level 20

### 7. Titles (8 titles)
Displayable titles that show player progression:
- **Rookie** (Common) - Just getting started - Level 1
- **Pro** (Rare) - Skilled player - Level 5
- **Elite** (Epic) - Among the best - Level 10
- **Legend** (Legendary) - Legendary status achieved - Level 15
- **Mythic** (Mythic) - Beyond legendary - Level 25 + Score 100,000
- **Combo King** (Epic) - Master of combos - Achieve 30x combo
- **Sharpshooter** (Epic) - Perfect accuracy - Complete 15 perfect rounds

## Rarity System

Rewards are categorized by rarity, which determines their visual presentation and unlock difficulty:

- **Common** (Green) - Basic rewards, easy to unlock
- **Rare** (Blue) - Moderate challenge required
- **Epic** (Purple) - Significant achievement needed
- **Legendary** (Gold) - Extremely difficult to unlock
- **Mythic** (Pink/Red) - Ultimate mastery required

## Unlock Requirements

Rewards can be unlocked through various means:

### Level-Based
Progress through the XP system by completing challenges and playing games. Higher levels unlock more prestigious rewards.

### Achievement-Based
Complete specific in-game achievements like:
- First Blood
- Sharpshooter (100 targets hit)
- Combo Master (10x combo)
- Perfectionist (perfect round)
- Score Hunter (50,000+ points)
- Insane Champion (beat insane difficulty)

### Performance-Based
Demonstrate skill through:
- High scores
- Perfect rounds
- Combo streaks
- Difficulty completions
- Total games played

### Multi-Requirement
Some legendary and mythic items require multiple conditions:
- Arctic Ice: Perfectionist achievement AND Level 10
- Geometric Shapes: Beat Insane difficulty AND Level 15
- Insane Master Badge: Insane Champion achievement AND Level 20
- Mythic Title: Level 25 AND Score 100,000 points

## Rewards Vault

The Rewards Vault is the central hub for managing unlockables:

### Features:
1. **Categorized Tabs** - Browse by reward type (Themes, Backgrounds, Sounds, etc.)
2. **Progress Tracking** - See how close you are to unlocking each item
3. **Visual Previews** - Each reward shows its icon and rarity glow
4. **Quick Equip** - Instantly equip unlocked rewards
5. **Collection Statistics** - Track your progress (e.g., "3/5 Visual Themes Unlocked")
6. **One-Click Check** - "Check for Unlocks" button scans for newly available rewards

### Using the Vault:
1. Navigate to the "Rewards" tab in the main menu
2. Browse different categories using the top tabs
3. Locked items show progress bars and requirements
4. Click "Equip" on unlocked items to use them
5. Currently equipped items are highlighted with a ring

## Unlock Notifications

When you unlock a new reward:
1. A dramatic notification appears at the top of the screen
2. Shows the rarity, icon, name, and description
3. Plays a celebratory sound effect
4. Glows with the item's rarity color
5. Automatically dismisses after 5 seconds
6. Multiple unlocks queue up and display sequentially

## Integration with Challenges

Many rewards tie into the daily/weekly challenge system:
- Completing challenges earns XP that leads to level-based unlocks
- Challenge badges can unlock additional rewards
- Challenge titles are prestigious unlockables
- The progression creates a cohesive reward loop

## Technical Implementation

### Data Persistence
All unlocks are stored in the browser's persistent KV storage:
- `player-unlocks` - Tracks which items are unlocked and equipped
- Survives page refreshes and sessions
- Syncs across game phases

### Unlock Checking
The system checks for new unlocks:
- After every game completion
- When viewing the Rewards Vault
- After leveling up or completing challenges
- Automatically updates the player's unlock collection

### Rarity Visual Effects
Each rarity has unique presentation:
- Custom glow colors
- Animated shadows
- Pulsing effects for higher rarities
- Distinctive border colors in the vault

## Player Progression Path

**Beginner (Level 1-5):**
- Start with basic commons (Cyberpunk, Default skin, Sci-Fi sounds)
- Unlock first rare items through easy challenges
- Earn Rookie → Pro title progression

**Intermediate (Level 6-10):**
- Access rare backgrounds and themes
- Unlock epic mouse trails and target skins
- Earn Elite title and badges

**Advanced (Level 11-20):**
- Chase legendary backgrounds and themes
- Pursue perfect round and combo achievements
- Unlock Legend title and prestige badges

**Master (Level 21+):**
- Aim for mythic-tier rewards
- Complete insane difficulty challenges
- Achieve Mythic title and ultimate customization

## Best Practices

1. **Play Regularly** - Daily and weekly challenges provide consistent XP
2. **Master Combos** - Many rewards require combo achievements
3. **Try Different Difficulties** - Harder modes unlock exclusive rewards
4. **Complete Perfect Rounds** - Several prestigious items require perfect rounds
5. **Check Vault Often** - Don't miss newly unlocked items
6. **Equip What You Love** - Show off your favorite earned cosmetics

## Future Expansion

The reward system is designed for easy expansion with:
- Seasonal/event-exclusive items
- Cloud9 team-themed rewards
- Limited-time challenge rewards
- Community-designed unlockables
- Tournament victory rewards
- Social sharing achievements

---

**Total Unlockables:** 42 items across 7 categories
**Total Rarity Distribution:**
- Common: 6
- Rare: 13
- Epic: 13
- Legendary: 7
- Mythic: 3
