import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, HandPointing, SpeakerHigh, Palette } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'

interface AccessibilitySettingsProps {
  onSettingsChange?: () => void
}

export function AccessibilitySettings({ onSettingsChange }: AccessibilitySettingsProps) {
  const [reducedMotion, setReducedMotion] = useKV<boolean>('accessibility-reduced-motion', false)
  const [highContrast, setHighContrast] = useKV<boolean>('accessibility-high-contrast', false)
  const [colorBlindMode, setColorBlindMode] = useKV<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('accessibility-colorblind-mode', 'none')
  const [largeTargets, setLargeTargets] = useKV<boolean>('accessibility-large-targets', false)
  const [soundAlerts, setSoundAlerts] = useKV<boolean>('accessibility-sound-alerts', true)
  const [focusIndicators, setFocusIndicators] = useKV<boolean>('accessibility-focus-indicators', true)

  const handleChange = (callback: (value: any) => void) => (value: any) => {
    callback(value)
    if (onSettingsChange) {
      setTimeout(onSettingsChange, 100)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary glow-text">Accessibility</h2>
        <p className="text-muted-foreground">
          Customize the game experience to match your needs and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Eye size={24} weight="duotone" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Visual Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust visual elements for better visibility and comfort
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Increases contrast between elements for better visibility
                    </p>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast || false}
                    onCheckedChange={handleChange(setHighContrast)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="colorblind-mode">Color Blind Mode</Label>
                  <Select
                    value={colorBlindMode || 'none'}
                    onValueChange={handleChange(setColorBlindMode)}
                  >
                    <SelectTrigger id="colorblind-mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None (Standard Colors)</SelectItem>
                      <SelectItem value="protanopia">Protanopia (Red-Blind)</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia (Green-Blind)</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia (Blue-Blind)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Adjusts colors to be more distinguishable for different types of color blindness
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="focus-indicators">Enhanced Focus Indicators</Label>
                    <p className="text-xs text-muted-foreground">
                      Shows clear visual indicators for keyboard focus
                    </p>
                  </div>
                  <Switch
                    id="focus-indicators"
                    checked={focusIndicators !== false}
                    onCheckedChange={handleChange(setFocusIndicators)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-cyan/10 text-cyan">
              <HandPointing size={24} weight="duotone" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Motor Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Adjust gameplay elements for better interaction
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reduced-motion">Reduce Motion</Label>
                    <p className="text-xs text-muted-foreground">
                      Minimizes animations and particle effects
                    </p>
                  </div>
                  <Switch
                    id="reduced-motion"
                    checked={reducedMotion || false}
                    onCheckedChange={handleChange(setReducedMotion)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="large-targets">Larger Target Size</Label>
                    <p className="text-xs text-muted-foreground">
                      Increases target size by 25% for easier clicking
                    </p>
                  </div>
                  <Switch
                    id="large-targets"
                    checked={largeTargets || false}
                    onCheckedChange={handleChange(setLargeTargets)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-accent/10 text-accent">
              <SpeakerHigh size={24} weight="duotone" />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-1">Audio Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure audio feedback and alerts
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-alerts">Audio Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Enables distinct sounds for important game events
                    </p>
                  </div>
                  <Switch
                    id="sound-alerts"
                    checked={soundAlerts !== false}
                    onCheckedChange={handleChange(setSoundAlerts)}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-muted/50">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Palette size={24} weight="duotone" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">Accessibility Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All interactive elements are keyboard accessible</li>
                <li>• Screen reader support for important game states</li>
                <li>• Adjustable difficulty levels for all skill ranges</li>
                <li>• Practice mode available without score pressure</li>
                <li>• Clear visual and audio feedback for all actions</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function useAccessibilitySettings() {
  const [reducedMotion] = useKV<boolean>('accessibility-reduced-motion', false)
  const [highContrast] = useKV<boolean>('accessibility-high-contrast', false)
  const [colorBlindMode] = useKV<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('accessibility-colorblind-mode', 'none')
  const [largeTargets] = useKV<boolean>('accessibility-large-targets', false)
  const [soundAlerts] = useKV<boolean>('accessibility-sound-alerts', true)
  const [focusIndicators] = useKV<boolean>('accessibility-focus-indicators', true)

  return {
    reducedMotion: reducedMotion ?? false,
    highContrast: highContrast ?? false,
    colorBlindMode: colorBlindMode ?? 'none',
    largeTargets: largeTargets ?? false,
    soundAlerts: soundAlerts ?? true,
    focusIndicators: focusIndicators ?? true
  }
}

export function getColorBlindColors(mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') {
  switch (mode) {
    case 'protanopia':
      return {
        primary: 'oklch(0.65 0.20 240)',
        accent: 'oklch(0.70 0.25 60)',
        cyan: 'oklch(0.75 0.18 240)'
      }
    case 'deuteranopia':
      return {
        primary: 'oklch(0.65 0.20 240)',
        accent: 'oklch(0.70 0.25 40)',
        cyan: 'oklch(0.75 0.18 240)'
      }
    case 'tritanopia':
      return {
        primary: 'oklch(0.65 0.24 350)',
        accent: 'oklch(0.70 0.25 30)',
        cyan: 'oklch(0.75 0.18 350)'
      }
    default:
      return {
        primary: 'oklch(0.65 0.24 240)',
        accent: 'oklch(0.70 0.25 350)',
        cyan: 'oklch(0.75 0.18 195)'
      }
  }
}
