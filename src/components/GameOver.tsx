import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { formatScore } from '@/lib/game-utils'
import { Trophy, Crown, Medal, ShareNetwork, XLogo, FacebookLogo, LinkedinLogo } from '@phosphor-icons/react'
import { LeaderboardEntry, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { soundSystem } from '@/lib/sound-system'
import { toast } from 'sonner'

interface GameOverProps {
  score: number
  round: number
  targetsHit: number
  targetsMissed: number
  leaderboard: LeaderboardEntry[]
  onPlayAgain: () => void
  onSubmitScore: (name: string, email: string) => void
  isPractice?: boolean
}

export function GameOver({
  score,
  round,
  targetsHit,
  targetsMissed,
  leaderboard,
  onPlayAgain,
  onSubmitScore,
  isPractice = false
}: GameOverProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmitScore(name, email)
      setSubmitted(true)
    }
  }

  const handleShare = (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const text = `I just scored ${formatScore(score)} points in C9 Reflex Arena! 🎯 Think you can beat my score?`
    const url = window.location.href
    
    let shareUrl = ''
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
    toast.success('Share window opened!')
  }

  const handleCopyScore = () => {
    const text = `I scored ${formatScore(score)} points in C9 Reflex Arena! 🎯`
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Score copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy score')
    })
  }

  const accuracy = targetsHit + targetsMissed > 0
    ? Math.round((targetsHit / (targetsHit + targetsMissed)) * 100)
    : 0

  const position = leaderboard.findIndex(entry => entry.score < score) + 1
  const isTopScore = position > 0 && position <= 10

  useEffect(() => {
    soundSystem.play('gameOver')
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        onPlayAgain()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [onPlayAgain])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm z-20 overflow-y-auto p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="w-full max-w-2xl space-y-6"
      >
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Trophy size={64} weight="fill" className="text-accent mx-auto" />
          </motion.div>
          
          <h2 className="text-5xl font-bold text-primary glow-text">
            {isPractice ? 'Practice Complete!' : 'Game Complete!'}
          </h2>
          
          <div className="text-6xl font-bold text-cyan glow-text">
            {formatScore(score)}
          </div>

          {isPractice && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="bg-accent/10 border border-accent/50 rounded-lg px-6 py-3 inline-block"
            >
              <p className="text-accent font-bold">
                Practice scores don't count toward leaderboard
              </p>
            </motion.div>
          )}

          {!isPractice && isTopScore && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="bg-accent/20 border-2 border-accent rounded-lg px-6 py-3 inline-block"
            >
              <p className="text-accent font-bold text-lg">
                🎉 Top {position} Score! You're on the leaderboard!
              </p>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center bg-card/50 backdrop-blur">
            <div className="text-2xl font-bold text-primary">{accuracy}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </Card>
          <Card className="p-4 text-center bg-card/50 backdrop-blur">
            <div className="text-2xl font-bold text-cyan">{targetsHit}</div>
            <div className="text-sm text-muted-foreground">Hits</div>
          </Card>
          <Card className="p-4 text-center bg-card/50 backdrop-blur">
            <div className="text-2xl font-bold text-foreground">{round}</div>
            <div className="text-sm text-muted-foreground">Rounds</div>
          </Card>
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2"
          >
            <XLogo size={16} />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2"
          >
            <FacebookLogo size={16} />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2"
          >
            <LinkedinLogo size={16} />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyScore}
            className="flex items-center gap-2"
          >
            <ShareNetwork size={16} />
            Copy
          </Button>
        </div>

        {!submitted && !isPractice ? (
          <Card className="p-6 bg-card/50 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Save Your Score
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter your details to claim your leaderboard spot
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="player-name">Name *</Label>
                <Input
                  id="player-name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player-email">Email (optional)</Label>
                <Input
                  id="player-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 font-bold"
                  disabled={!name.trim()}
                >
                  Save Score
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPlayAgain}
                  className="flex-1"
                >
                  Skip
                </Button>
              </div>
            </form>
          </Card>
        ) : isPractice ? (
          <Card className="p-6 bg-card/50 backdrop-blur text-center">
            <p className="text-muted-foreground">
              Complete a ranked game to save your score!
            </p>
          </Card>
        ) : (
          <Card className="p-6 bg-accent/10 border-accent text-center">
            <Trophy size={32} className="text-accent mx-auto mb-2" />
            <p className="text-accent font-bold">Score saved successfully!</p>
          </Card>
        )}

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-foreground">
            Top Players
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {leaderboard.slice(0, 10).map((entry, index) => (
              <Card
                key={index}
                className={`p-4 flex items-center justify-between ${
                  entry.score === score && entry.name === name
                    ? 'bg-accent/20 border-accent'
                    : 'bg-card/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {index === 0 && <Crown size={24} weight="fill" className="text-accent" />}
                    {index === 1 && <Medal size={24} weight="fill" className="text-cyan" />}
                    {index === 2 && <Medal size={24} weight="fill" className="text-muted-foreground" />}
                    {index > 2 && <span className="text-muted-foreground font-bold">{index + 1}</span>}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.rounds} rounds • {entry.difficulty && DIFFICULTY_CONFIG[entry.difficulty] 
                        ? DIFFICULTY_CONFIG[entry.difficulty].name 
                        : 'Medium'}
                    </div>
                  </div>
                </div>
                <div className="text-xl font-bold text-primary">
                  {formatScore(entry.score)}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button
          onClick={onPlayAgain}
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 font-bold text-lg py-6"
        >
          Play Again
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded text-foreground font-mono">Space</kbd> for quick restart
        </p>
      </motion.div>
    </motion.div>
  )
}
