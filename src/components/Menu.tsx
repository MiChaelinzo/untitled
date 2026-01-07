import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Play, Trophy, Lightning, SpeakerHigh, SpeakerSlash, Waveform, Fire } from '@phosphor-icons/react'
import { LeaderboardEntry, Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'
import { soundSystem, SoundTheme } from '@/lib/sound-system'
import { useKV } from '@github/spark/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MenuProps {
  onStartGame: (difficulty: Difficulty) => void
  leaderboard: LeaderboardEntry[]
}

export function Menu({ onStartGame, leaderboard }: MenuProps) {
  const [soundEnabled, setSoundEnabled] = useKV<boolean>('sound-enabled', true)
  const [soundTheme, setSoundTheme] = useKV<SoundTheme>('sound-theme', 'sci-fi')
  const [selectedDifficulty, setSelectedDifficulty] = useKV<Difficulty>('selected-difficulty', 'medium')

  const toggleSound = () => {
    setSoundEnabled(current => {
      const newValue = !current
      soundSystem.setEnabled(newValue)
      if (newValue) {
        soundSystem.play('hit', 0)
      }
      return newValue
    })
  }

  const handleThemeChange = (theme: SoundTheme) => {
    setSoundTheme(theme)
    soundSystem.setTheme(theme)
    if (soundEnabled) {
      soundSystem.play('hit', 0)
    }
  }

  const difficultyConfig = DIFFICULTY_CONFIG[selectedDifficulty || 'medium']

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <Select value={soundTheme} onValueChange={handleThemeChange}>
          <SelectTrigger className="w-40 bg-card/50 backdrop-blur border-primary/50">
            <Waveform size={20} className="mr-2 text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
            <SelectItem value="retro">Retro Arcade</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSound}
          className="bg-card/50 backdrop-blur border-primary/50 hover:bg-card/70"
        >
          {soundEnabled ? (
            <SpeakerHigh size={24} className="text-primary" />
          ) : (
            <SpeakerSlash size={24} className="text-muted-foreground" />
          )}
        </Button>
      </div>

      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <h1 className="text-6xl md:text-7xl font-black text-primary glow-text tracking-tight">
              C9 REFLEX
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-cyan glow-text tracking-tight">
              ARENA
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Test your pro-level reflexes. Hit glowing targets as fast as possible across 3 intense rounds.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-center">
              <h3 className="text-lg font-bold text-foreground mb-2 flex items-center justify-center gap-2">
                <Fire weight="fill" className="text-accent" size={20} />
                Select Difficulty
              </h3>
            </div>
            <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}>
              <SelectTrigger className="bg-card/50 backdrop-blur border-primary/50 text-lg font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">
                  <div className="flex flex-col items-start">
                    <span className="font-bold">Easy</span>
                    <span className="text-xs text-muted-foreground">Generous timing and larger targets</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex flex-col items-start">
                    <span className="font-bold">Medium</span>
                    <span className="text-xs text-muted-foreground">Balanced challenge for most players</span>
                  </div>
                </SelectItem>
                <SelectItem value="hard">
                  <div className="flex flex-col items-start">
                    <span className="font-bold">Hard</span>
                    <span className="text-xs text-muted-foreground">Fast reflexes required</span>
                  </div>
                </SelectItem>
                <SelectItem value="insane">
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-accent">Insane</span>
                    <span className="text-xs text-muted-foreground">Pro-level reflexes only</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <div className="text-center text-sm text-muted-foreground">
              Score multiplier: <span className="text-accent font-bold">{difficultyConfig.scoreMultiplier}x</span>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => onStartGame(selectedDifficulty || 'medium')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-2xl px-12 py-8 glow-box group"
            >
              <Play weight="fill" className="mr-3 group-hover:scale-110 transition-transform" size={32} />
              Start Game
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-accent mx-auto" />
            <div className="font-bold text-foreground">Round 1: {difficultyConfig.rounds[1].name}</div>
            <div className="text-sm text-muted-foreground">
              {difficultyConfig.rounds[1].targets} targets • {(difficultyConfig.rounds[1].duration / 1000).toFixed(1)}s each
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-primary mx-auto" />
            <div className="font-bold text-foreground">Round 2: {difficultyConfig.rounds[2].name}</div>
            <div className="text-sm text-muted-foreground">
              {difficultyConfig.rounds[2].targets} targets • {(difficultyConfig.rounds[2].duration / 1000).toFixed(1)}s each
            </div>
          </Card>
          <Card className="p-6 bg-card/50 backdrop-blur text-center space-y-2">
            <Lightning weight="fill" size={32} className="text-cyan mx-auto" />
            <div className="font-bold text-foreground">Round 3: {difficultyConfig.rounds[3].name}</div>
            <div className="text-sm text-muted-foreground">
              {difficultyConfig.rounds[3].targets} targets • {(difficultyConfig.rounds[3].duration / 1000).toFixed(1)}s each
            </div>
          </Card>
        </motion.div>

        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy weight="fill" size={24} className="text-accent" />
              <h3 className="text-2xl font-bold text-foreground">Top Players</h3>
            </div>
            <div className="grid gap-2 max-w-2xl mx-auto max-h-64 overflow-y-auto">
              {leaderboard.slice(0, 5).map((entry, index) => (
                <Card
                  key={index}
                  className="p-4 bg-card/30 backdrop-blur flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{entry.name}</span>
                      <span className="text-xs text-muted-foreground uppercase">{DIFFICULTY_CONFIG[entry.difficulty].name}</span>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-cyan">
                    {formatScore(entry.score)}
                  </span>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-muted-foreground"
        >
          <p>Powered by Cloud9 × JetBrains</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
