import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SignIn, User, At, Lock, UserPlus, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface LoginProps {
  onLogin: (user: { id: string; username: string; email?: string; avatarUrl?: string }) => void
  onSkip: () => void
}

export function Login({ onLogin, onSkip }: LoginProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [githubUser, setGithubUser] = useState<any>(null)

  useEffect(() => {
    async function loadGithubUser() {
      try {
        const user = await window.spark.user()
        if (user) {
          setGithubUser(user)
        }
      } catch (error) {
        console.error('Failed to load GitHub user:', error)
      }
    }
    loadGithubUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (mode === 'signup' && (!username || !email || !password)) {
      toast.error('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (mode === 'login' && (!username || !password)) {
      toast.error('Please enter username and password')
      setIsLoading(false)
      return
    }

    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: username || 'Player',
      email: email || undefined,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    }

    toast.success(`Welcome ${mode === 'signup' ? 'to C9 Reflex Arena' : 'back'}, ${user.username}!`)
    setIsLoading(false)
    onLogin(user)
  }

  const handleGithubLogin = () => {
    if (githubUser) {
      const user = {
        id: String(githubUser.id),
        username: githubUser.login || 'Player',
        email: githubUser.email || undefined,
        avatarUrl: githubUser.avatarUrl || undefined
      }
      toast.success(`Welcome back, ${user.username}!`)
      onLogin(user)
    } else {
      toast.error('GitHub authentication not available')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-primary glow-text mb-2">C9 REFLEX</h1>
          <h2 className="text-3xl font-black text-cyan glow-text mb-4">ARENA</h2>
          <p className="text-muted-foreground">Join the competitive community</p>
        </div>

        <Card className="p-6 bg-card/80 backdrop-blur border-primary/30">
          <div className="flex gap-2 mb-6">
            <Button
              variant={mode === 'login' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setMode('login')}
            >
              <SignIn size={20} weight="fill" className="mr-2" />
              Login
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => setMode('signup')}
            >
              <UserPlus size={20} weight="fill" className="mr-2" />
              Sign Up
            </Button>
          </div>

          {githubUser && (
            <div className="mb-6">
              <Button
                onClick={handleGithubLogin}
                variant="outline"
                className="w-full border-primary/50 hover:bg-primary/10"
              >
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={githubUser.avatarUrl} />
                  <AvatarFallback>{githubUser.login?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                Continue as {githubUser.login}
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <User size={16} />
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50"
                required
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <At size={16} />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required={mode === 'signup'}
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip and play as guest
            </Button>
          </div>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
