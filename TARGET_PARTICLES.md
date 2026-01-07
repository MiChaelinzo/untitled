# Target Skin Particle Effects System

## Overview
The C9 Reflex Arena now features six unique target skins, each with distinctive animated particle effects that trigger when targets are hit. This system enhances visual feedback and rewards player progression through unlockable cosmetic customization.

## Target Skins

### 1. Classic Circle (Default)
- **Unlock**: Available from start
- **Visual**: Traditional circular target with pulsing glow
- **Particles**: 12 circular particles in Cloud9 blue, cyan, and pink radiating outward
- **Effect**: Standard burst pattern with moderate speed

### 2. Bullseye 🎯
- **Unlock**: Hit 50 targets
- **Visual**: Concentric rings like an archery target
- **Particles**: 16 circular particles in red, pink, and yellow tones
- **Effect**: Faster, more intense burst mimicking arrow impact

### 3. Crosshair ✛
- **Unlock**: Achieve 5x combo
- **Visual**: FPS-style rotating crosshair with center dot
- **Particles**: 8 linear particles forming crosshair pattern in pink and cyan
- **Effect**: Directional lines extending horizontally and vertically, creates precision feel

### 4. Hexagon ⬡
- **Unlock**: Score 25,000 points
- **Visual**: Futuristic hexagon that rotates through 120° increments
- **Particles**: 18 hexagonal-shaped particles in cyan gradient tones with rotating outer hexagon
- **Effect**: Geometric shard explosion with spinning animation

### 5. Rising Star ⭐
- **Unlock**: Complete Insane mode
- **Visual**: Glowing star with dual-layer rotation
- **Particles**: 20 star-shaped particles in gold/yellow gradient with expanding ring waves
- **Effect**: Most spectacular - combines particle burst with expanding shockwave rings

### 6. Pulse Wave 〰️
- **Unlock**: Hit 200 targets
- **Visual**: Three layered concentric circles pulsing at different rates
- **Particles**: 24 particles with dual expanding ring waves
- **Effect**: Highest particle count, creates ripple/wave effect

## Particle System Architecture

### Technical Components

**TargetParticles Component** (`src/components/TargetParticles.tsx`)
- Main particle rendering component
- Accepts skin type, position (x, y), and completion callback
- Generates particles based on skin-specific configuration
- Handles animation lifecycle and cleanup

**Particle Configuration**
```typescript
interface ParticleConfig {
  count: number          // Number of particles (8-24)
  colors: string[]       // Array of oklch colors
  shape: 'circle' | 'square' | 'triangle' | 'star' | 'hexagon' | 'line'
  speed: number          // Animation speed multiplier (0.9-1.5)
  spread: number         // Distance particles travel (80-140px)
}
```

**Particle Shape System**
- `ParticleShape` component renders different geometric shapes
- Each shape includes glow effects (box-shadow) for visual impact
- Shapes: circle, square, triangle, star (using ★ emoji), hexagon (clip-path), line

### Animation System

**Framer Motion Integration**
- Uses `motion.div` for GPU-accelerated animations
- Particles animate: position (x, y), opacity (1 → 0), scale (1 → 0.3), rotation (0 → 360°)
- Duration: 600ms (configurable per skin speed multiplier)
- Easing: `easeOut` for natural deceleration
- Staggered delays (0-100ms) create cascading effect

**Special Effects**
- **Pulse & Star skins**: Additional expanding ring waves for impact
- **Hexagon skin**: Rotating background hexagon fades out
- **Crosshair skin**: Horizontal and vertical line extensions

**Performance Optimizations**
- Particles limited to 8-24 per explosion
- Animation duration kept under 700ms
- Completion callback triggers cleanup after last particle
- Pointer-events disabled on particle container

## Integration Points

### Target Component (`src/components/Target.tsx`)
- Accepts `skin` prop to render skin-specific visuals
- Implements `renderSkin()` function with switch statement for 6 skins
- Each skin has unique animations and visual structure
- Maintains consistent hitbox regardless of visual appearance

### GameArena Component (`src/components/GameArena.tsx`)
- Loads active skin from KV storage: `useKV<TargetSkin>('target-skin', 'default')`
- Passes skin to Target component
- Spawns TargetParticles on hit with active skin type
- Manages particle effect lifecycle through effects array

### Menu & Customization
- TargetSkinSelector shows all 6 skins with unlock status
- Displays unlock requirements for locked skins
- Selected skin persists via KV storage
- Visual preview shows skin icon and description

## Player Experience Flow

1. **Start**: Player begins with Classic Circle skin
2. **Progress**: As player achieves milestones, skins unlock with toast notifications
3. **Customize**: Player visits Customization tab to view/select unlocked skins
4. **Play**: Selected skin appears in all gameplay with unique particle effects
5. **Satisfaction**: Each hit produces distinctive particle explosion matching skin theme

## Unlock Progression

| Skin | Requirement | Estimated Time to Unlock |
|------|-------------|-------------------------|
| Classic Circle | Default | Immediate |
| Bullseye | 50 targets | 2-3 games |
| Crosshair | 5x combo | 1-2 games |
| Hexagon | 25,000 points | 3-5 games |
| Rising Star | Complete Insane | 5-10 games |
| Pulse Wave | 200 targets | 10-15 games |

## Visual Design Philosophy

**Color Coordination**
- Each skin uses colors from the C9 Reflex Arena palette
- Particle colors match or complement target urgency states
- High contrast ensures visibility against dark background

**Shape Language**
- Classic/Bullseye: Traditional, accessible shapes
- Crosshair/Hexagon: Geometric, technical aesthetic
- Star/Pulse: Flashy, reward-tier visuals

**Animation Principles**
- All effects follow ease-out timing for natural deceleration
- Particle spread creates satisfying explosion feel
- Rotation adds dynamism and energy
- Opacity fade prevents abrupt disappearance

## Future Enhancement Opportunities

1. **Seasonal Skins**: Holiday or event-specific target appearances
2. **Rarity Tiers**: Common, Rare, Epic, Legendary with increasing particle counts
3. **Sound Integration**: Skin-specific hit sounds to match visual themes
4. **Custom Colors**: Let players customize particle colors within skins
5. **Trail Effects**: Particle trails that follow mouse cursor
6. **Hit Combos**: Escalating particle effects for higher combo counts
7. **Team Skins**: Cloud9 team-specific skins (League, Valorant, etc.)

## Technical Notes

**Dependencies**
- Framer Motion: Animation library
- React: Component framework
- TypeScript: Type safety for skin configurations

**Browser Compatibility**
- Modern browsers with CSS clip-path support
- GPU acceleration recommended for smooth 60fps particles
- Graceful degradation if animations lag (reduce particle count)

**Accessibility**
- Particle effects are purely cosmetic
- Gameplay mechanics unchanged across all skins
- Can be disabled in settings if motion sensitivity is concern (future enhancement)

## Code References

- `src/components/TargetParticles.tsx` - Particle rendering system
- `src/components/Target.tsx` - Target skin visuals
- `src/components/GameArena.tsx` - Integration and lifecycle
- `src/lib/target-skins.ts` - Skin definitions and unlock logic
- `src/components/TargetSkinSelector.tsx` - UI for skin selection
