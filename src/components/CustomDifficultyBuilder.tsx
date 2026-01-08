import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Wrench, Plus, Trash, Play } from '@phosphor-icons/react'
import { 
  CustomDifficulty, 
  createCustomDifficulty, 
  validateCustomDifficulty,
  PRESET_CUSTOM_DIFFICULTIES 
} from '@/lib/custom-difficulty'
import { toast } from 'sonner'

interface CustomDifficultyBuilderProps {
  customDifficulties: CustomDifficulty[]
  onCreateDifficulty: (difficulty: CustomDifficulty) => void
  onDeleteDifficulty: (id: string) => void
  onPlayDifficulty: (difficulty: CustomDifficulty) => void
}

export function CustomDifficultyBuilder({
  customDifficulties,
  onCreateDifficulty,
  onDeleteDifficulty,
  onPlayDifficulty
}: CustomDifficultyBuilderProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [targetDuration, setTargetDuration] = useState<[number, number, number]>([2000, 1500, 1000])
  const [targetSize, setTargetSize] = useState<[number, number, number]>([80, 70, 60])
  const [targetsPerRound, setTargetsPerRound] = useState<[number, number, number]>([15, 20, 25])
  const [scoreMultiplier, setScoreMultiplier] = useState(2.0)
  const [spawnDelay, setSpawnDelay] = useState(500)

  const handleCreate = () => {
    const difficulty = createCustomDifficulty(name, description, {
      targetDuration,
      targetSize,
      targetsPerRound,
      scoreMultiplier,
      spawnDelay
    })

    const validation = validateCustomDifficulty(difficulty)
    if (!validation.valid) {
      validation.errors.forEach(error => toast.error(error))
      return
    }

    onCreateDifficulty(difficulty)
    toast.success(`Created: ${name}`)
    setOpen(false)
    resetForm()
  }

  const loadPreset = (preset: Partial<CustomDifficulty>) => {
    setName(preset.name || '')
    setDescription(preset.description || '')
    setTargetDuration(preset.targetDuration || [2000, 1500, 1000])
    setTargetSize(preset.targetSize || [80, 70, 60])
    setTargetsPerRound(preset.targetsPerRound || [15, 20, 25])
    setScoreMultiplier(preset.scoreMultiplier || 2.0)
    setSpawnDelay(preset.spawnDelay || 500)
  }

  const resetForm = () => {
    setName('')
    setDescription('')
    setTargetDuration([2000, 1500, 1000])
    setTargetSize([80, 70, 60])
    setTargetsPerRound([15, 20, 25])
    setScoreMultiplier(2.0)
    setSpawnDelay(500)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="text-primary" size={28} weight="fill" />
          <div>
            <h3 className="text-xl font-bold text-foreground">Custom Difficulties</h3>
            <p className="text-sm text-muted-foreground">Create your own challenge</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={20} weight="bold" />
              Create New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Build Custom Difficulty</DialogTitle>
              <DialogDescription>
                Fine-tune every parameter to create your perfect challenge
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Difficulty Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Ultra Challenge"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., For the fastest reflexes only"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Round 1 Duration</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetDuration[0]]}
                      onValueChange={([v]) => setTargetDuration([v, targetDuration[1], targetDuration[2]])}
                      min={500}
                      max={10000}
                      step={100}
                    />
                    <span className="text-sm w-16 text-right">{targetDuration[0]}ms</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 2 Duration</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetDuration[1]]}
                      onValueChange={([v]) => setTargetDuration([targetDuration[0], v, targetDuration[2]])}
                      min={500}
                      max={10000}
                      step={100}
                    />
                    <span className="text-sm w-16 text-right">{targetDuration[1]}ms</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 3 Duration</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetDuration[2]]}
                      onValueChange={([v]) => setTargetDuration([targetDuration[0], targetDuration[1], v])}
                      min={500}
                      max={10000}
                      step={100}
                    />
                    <span className="text-sm w-16 text-right">{targetDuration[2]}ms</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Round 1 Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetSize[0]]}
                      onValueChange={([v]) => setTargetSize([v, targetSize[1], targetSize[2]])}
                      min={30}
                      max={150}
                      step={5}
                    />
                    <span className="text-sm w-16 text-right">{targetSize[0]}px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 2 Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetSize[1]]}
                      onValueChange={([v]) => setTargetSize([targetSize[0], v, targetSize[2]])}
                      min={30}
                      max={150}
                      step={5}
                    />
                    <span className="text-sm w-16 text-right">{targetSize[1]}px</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 3 Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetSize[2]]}
                      onValueChange={([v]) => setTargetSize([targetSize[0], targetSize[1], v])}
                      min={30}
                      max={150}
                      step={5}
                    />
                    <span className="text-sm w-16 text-right">{targetSize[2]}px</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Round 1 Targets</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetsPerRound[0]]}
                      onValueChange={([v]) => setTargetsPerRound([v, targetsPerRound[1], targetsPerRound[2]])}
                      min={5}
                      max={50}
                      step={1}
                    />
                    <span className="text-sm w-12 text-right">{targetsPerRound[0]}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 2 Targets</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetsPerRound[1]]}
                      onValueChange={([v]) => setTargetsPerRound([targetsPerRound[0], v, targetsPerRound[2]])}
                      min={5}
                      max={50}
                      step={1}
                    />
                    <span className="text-sm w-12 text-right">{targetsPerRound[1]}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Round 3 Targets</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[targetsPerRound[2]]}
                      onValueChange={([v]) => setTargetsPerRound([targetsPerRound[0], targetsPerRound[1], v])}
                      min={5}
                      max={50}
                      step={1}
                    />
                    <span className="text-sm w-12 text-right">{targetsPerRound[2]}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="space-y-2">
                  <Label>Score Multiplier</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[scoreMultiplier]}
                      onValueChange={([v]) => setScoreMultiplier(v)}
                      min={0.5}
                      max={5}
                      step={0.1}
                    />
                    <span className="text-sm w-12 text-right">{scoreMultiplier.toFixed(1)}x</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Spawn Delay</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[spawnDelay]}
                      onValueChange={([v]) => setSpawnDelay(v)}
                      min={100}
                      max={3000}
                      step={50}
                    />
                    <span className="text-sm w-16 text-right">{spawnDelay}ms</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Load Preset</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_CUSTOM_DIFFICULTIES.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                      className="justify-start"
                    >
                      <div className="text-left">
                        <div className="font-semibold text-sm">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={!name}>
                Create Difficulty
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {customDifficulties.map((difficulty) => (
          <Card key={difficulty.id} className="p-4 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-bold text-lg text-foreground">{difficulty.name}</h4>
                <p className="text-sm text-muted-foreground">{difficulty.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onDeleteDifficulty(difficulty.id)
                  toast.success('Difficulty deleted')
                }}
              >
                <Trash size={18} className="text-destructive" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs mb-3">
              <div className="p-2 rounded bg-secondary/30">
                <div className="text-muted-foreground">Round 1</div>
                <div className="font-semibold">{difficulty.targetDuration[0]}ms</div>
                <div className="text-muted-foreground">{difficulty.targetSize[0]}px</div>
              </div>
              <div className="p-2 rounded bg-secondary/30">
                <div className="text-muted-foreground">Round 2</div>
                <div className="font-semibold">{difficulty.targetDuration[1]}ms</div>
                <div className="text-muted-foreground">{difficulty.targetSize[1]}px</div>
              </div>
              <div className="p-2 rounded bg-secondary/30">
                <div className="text-muted-foreground">Round 3</div>
                <div className="font-semibold">{difficulty.targetDuration[2]}ms</div>
                <div className="text-muted-foreground">{difficulty.targetSize[2]}px</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Multiplier: </span>
                <span className="font-bold text-accent">{difficulty.scoreMultiplier}x</span>
              </div>
              <Button
                size="sm"
                onClick={() => onPlayDifficulty(difficulty)}
                className="gap-2"
              >
                <Play size={16} weight="fill" />
                Play
              </Button>
            </div>

            {difficulty.highScore > 0 && (
              <div className="mt-3 pt-3 border-t border-border/50 text-xs text-center">
                <span className="text-muted-foreground">Best: </span>
                <span className="font-bold text-primary">{difficulty.highScore.toLocaleString()}</span>
                <span className="text-muted-foreground ml-3">Played: </span>
                <span className="font-bold">{difficulty.timesPlayed}x</span>
              </div>
            )}
          </Card>
        ))}

        {customDifficulties.length === 0 && (
          <Card className="col-span-2 p-8 bg-secondary/20 border-dashed">
            <div className="text-center text-muted-foreground">
              <Wrench size={48} className="mx-auto mb-3 opacity-50" />
              <p>No custom difficulties yet.</p>
              <p className="text-sm">Create your first custom challenge above!</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
