import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  UserPlus, 
  MagnifyingGlass, 
  Sword, 
  Trophy, 
  X, 
  Check, 
  Clock,
  Lightning,
  Target,
  Fire,
  Crown,
  User
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { 
  Friend, 
  FriendRequest, 
  Challenge as ChallengeType,
  PlayerProfile,
  ChallengeNotification,
  generateChallengeId,
  generateFriendRequestId,
  getChallengeTimeRemaining,
  isChallengeExpired,
  calculateWinRate
} from '@/lib/friends-system'
import { Difficulty, DIFFICULTY_CONFIG } from '@/lib/game-types'
import { formatScore } from '@/lib/game-utils'

interface FriendsPanelProps {
  currentUserId: string
  currentUsername: string
  currentAvatarUrl?: string
  onStartChallenge: (challengeId: string, difficulty: Difficulty) => void
}

export function FriendsPanel({ 
  currentUserId, 
  currentUsername,
  currentAvatarUrl,
  onStartChallenge 
}: FriendsPanelProps) {
  const [friends, setFriends] = useKV<Friend[]>('friends', [])
  const [friendRequests, setFriendRequests] = useKV<FriendRequest[]>('friend-requests', [])
  const [sentRequests, setSentRequests] = useKV<FriendRequest[]>('sent-requests', [])
  const [challenges, setChallenges] = useKV<ChallengeType[]>('challenges', [])
  const [notifications, setNotifications] = useKV<ChallengeNotification[]>('challenge-notifications', [])
  const [playerProfile, setPlayerProfile] = useKV<PlayerProfile>('player-profile', {
    userId: currentUserId,
    username: currentUsername,
    avatarUrl: currentAvatarUrl,
    level: 1,
    totalWins: 0,
    totalLosses: 0,
    winStreak: 0,
    bestScore: 0,
    isOnline: true,
    lastSeen: Date.now()
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [mockSearchResults, setMockSearchResults] = useState<PlayerProfile[]>([])
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium')

  useEffect(() => {
    setPlayerProfile(current => {
      const defaultProfile: PlayerProfile = {
        userId: currentUserId,
        username: currentUsername,
        avatarUrl: currentAvatarUrl,
        level: 1,
        totalWins: 0,
        totalLosses: 0,
        winStreak: 0,
        bestScore: 0,
        isOnline: true,
        lastSeen: Date.now()
      }
      
      return {
        ...(current || defaultProfile),
        userId: currentUserId,
        username: currentUsername,
        avatarUrl: currentAvatarUrl,
        isOnline: true,
        lastSeen: Date.now()
      }
    })
  }, [currentUserId, currentUsername, currentAvatarUrl, setPlayerProfile])

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const mockProfiles: PlayerProfile[] = [
        {
          userId: 'user_cloud9_fan',
          username: 'Cloud9Fan123',
          level: 15,
          totalWins: 42,
          totalLosses: 18,
          winStreak: 3,
          bestScore: 85000,
          isOnline: true,
          lastSeen: Date.now()
        },
        {
          userId: 'user_reflex_master',
          username: 'ReflexMaster',
          level: 28,
          totalWins: 156,
          totalLosses: 44,
          winStreak: 12,
          bestScore: 142000,
          isOnline: false,
          lastSeen: Date.now() - 3600000
        },
        {
          userId: 'user_target_hunter',
          username: 'TargetHunter',
          level: 22,
          totalWins: 89,
          totalLosses: 67,
          winStreak: 0,
          bestScore: 98500,
          isOnline: true,
          lastSeen: Date.now()
        }
      ].filter(p => 
        p.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !friends?.some(f => f.id === p.userId) &&
        p.userId !== currentUserId
      )
      
      setMockSearchResults(mockProfiles)
    } else {
      setMockSearchResults([])
    }
  }, [searchQuery, friends, currentUserId])

  const handleSendFriendRequest = (targetUser: PlayerProfile) => {
    const existingRequest = sentRequests?.find(r => r.toUserId === targetUser.userId)
    if (existingRequest) {
      toast.error('Friend request already sent')
      return
    }

    const request: FriendRequest = {
      id: generateFriendRequestId(),
      fromUserId: currentUserId,
      fromUsername: currentUsername,
      fromAvatarUrl: currentAvatarUrl,
      toUserId: targetUser.userId,
      toUsername: targetUser.username,
      sentAt: Date.now(),
      status: 'pending'
    }

    setSentRequests(current => [...(current || []), request])
    toast.success(`Friend request sent to ${targetUser.username}`)
    setSearchQuery('')
  }

  const handleAcceptFriendRequest = (request: FriendRequest) => {
    const newFriend: Friend = {
      id: request.fromUserId,
      username: request.fromUsername,
      avatarUrl: request.fromAvatarUrl,
      addedAt: Date.now()
    }

    setFriends(current => [...(current || []), newFriend])
    setFriendRequests(current => current?.filter(r => r.id !== request.id) || [])
    
    toast.success(`You are now friends with ${request.fromUsername}`)
  }

  const handleDeclineFriendRequest = (requestId: string) => {
    setFriendRequests(current => current?.filter(r => r.id !== requestId) || [])
    toast.info('Friend request declined')
  }

  const handleRemoveFriend = (friendId: string) => {
    const friend = friends?.find(f => f.id === friendId)
    setFriends(current => current?.filter(f => f.id !== friendId) || [])
    toast.success(`Removed ${friend?.username} from friends`)
  }

  const handleSendChallenge = () => {
    if (!selectedFriend) return

    const challenge: ChallengeType = {
      id: generateChallengeId(),
      fromUserId: currentUserId,
      fromUsername: currentUsername,
      toUserId: selectedFriend.id,
      toUsername: selectedFriend.username,
      difficulty: selectedDifficulty,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000),
      status: 'pending'
    }

    setChallenges(current => [...(current || []), challenge])
    setChallengeDialogOpen(false)
    setSelectedFriend(null)
    toast.success(`Challenge sent to ${selectedFriend.username}!`)
  }

  const handleAcceptChallenge = (challengeId: string) => {
    const challenge = challenges?.find(c => c.id === challengeId)
    if (!challenge) return

    setChallenges(current => 
      current?.map(c => 
        c.id === challengeId ? { ...c, status: 'accepted' as const } : c
      ) || []
    )
    
    toast.success(`Challenge accepted! Starting game...`, {
      description: `Playing on ${DIFFICULTY_CONFIG[challenge.difficulty].name} difficulty`
    })
    
    setTimeout(() => {
      onStartChallenge(challengeId, challenge.difficulty)
    }, 500)
  }

  const handleDeclineChallenge = (challengeId: string) => {
    setChallenges(current => 
      current?.map(c => 
        c.id === challengeId ? { ...c, status: 'declined' as const } : c
      ) || []
    )
    toast.info('Challenge declined')
  }

  const pendingRequests = friendRequests?.filter(r => r.status === 'pending') || []
  const activeChallenges = challenges?.filter(c => 
    !isChallengeExpired(c) && (c.status === 'pending' || c.status === 'accepted')
  ) || []
  const completedChallenges = challenges?.filter(c => c.status === 'completed') || []
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-primary glow-text">Friends & Challenges</h2>
          <p className="text-muted-foreground mt-1">Challenge friends to prove your reflexes</p>
        </div>
        {(pendingRequests.length > 0 || activeChallenges.length > 0) && (
          <Badge variant="destructive" className="px-3 py-1">
            {pendingRequests.length + activeChallenges.length} pending
          </Badge>
        )}
      </div>

      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur">
          <TabsTrigger value="friends" className="flex items-center gap-2">
            <User size={16} weight="fill" />
            Friends
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Sword size={16} weight="fill" />
            Challenges
            {activeChallenges.length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 text-xs">
                {activeChallenges.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Trophy size={16} weight="fill" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4 mt-6">
          <Card className="p-4 bg-card/50 backdrop-blur border-primary/30">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MagnifyingGlass 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                  size={20} 
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search players to add..."
                  className="pl-10 bg-background/50 border-primary/30"
                />
              </div>
            </div>

            {mockSearchResults.length > 0 && (
              <ScrollArea className="h-48 mt-4">
                <div className="space-y-2">
                  {mockSearchResults.map(profile => (
                    <motion.div
                      key={profile.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{profile.username}</span>
                            {profile.isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Level {profile.level} • {calculateWinRate(profile.totalWins, profile.totalLosses)}% Win Rate
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSendFriendRequest(profile)}
                        className="border-primary/50 hover:bg-primary/10"
                      >
                        <UserPlus size={16} className="mr-1" />
                        Add
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>

          {pendingRequests.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Friend Requests
              </h3>
              {pendingRequests.map(request => (
                <Card key={request.id} className="p-4 bg-card/50 backdrop-blur border-accent/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <User size={24} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">{request.fromUsername}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent {new Date(request.sentAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcceptFriendRequest(request)}
                        className="border-green-500/50 hover:bg-green-500/10 text-green-500"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineFriendRequest(request.id)}
                        className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your Friends ({friends?.length || 0})
            </h3>
            
            {(!friends || friends.length === 0) ? (
              <Card className="p-8 text-center bg-card/30 backdrop-blur border-primary/20">
                <User size={48} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No friends yet. Search for players to add!</p>
              </Card>
            ) : (
              <div className="grid gap-3">
                {friends.map(friend => (
                  <Card key={friend.id} className="p-4 bg-card/50 backdrop-blur border-primary/30 hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <User size={24} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{friend.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(friend.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={challengeDialogOpen && selectedFriend?.id === friend.id} onOpenChange={(open) => {
                          setChallengeDialogOpen(open)
                          if (!open) setSelectedFriend(null)
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedFriend(friend)}
                              className="border-accent/50 hover:bg-accent/10 text-accent"
                            >
                              <Sword size={16} className="mr-1" />
                              Challenge
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card/95 backdrop-blur border-primary/30">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold text-primary">
                                Challenge {friend.username}
                              </DialogTitle>
                              <DialogDescription>
                                Select difficulty and send your challenge
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <label className="text-sm font-semibold mb-2 block">Difficulty</label>
                                <Select value={selectedDifficulty} onValueChange={(v) => setSelectedDifficulty(v as Difficulty)}>
                                  <SelectTrigger className="bg-background/50 border-primary/30">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy (1x)</SelectItem>
                                    <SelectItem value="medium">Medium (1.5x)</SelectItem>
                                    <SelectItem value="hard">Hard (2x)</SelectItem>
                                    <SelectItem value="insane">Insane (3x)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground">
                                  Your friend will have 24 hours to accept and complete the challenge.
                                  Highest score wins!
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setChallengeDialogOpen(false)
                                  setSelectedFriend(null)
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleSendChallenge}
                                className="bg-accent hover:bg-accent/90"
                              >
                                <Sword size={16} className="mr-2" />
                                Send Challenge
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFriend(friend.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-6">
          {activeChallenges.filter(c => c.toUserId === currentUserId && c.status === 'pending').length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider flex items-center gap-2">
                <Fire size={16} weight="fill" />
                Incoming Challenges
              </h3>
              {activeChallenges
                .filter(c => c.toUserId === currentUserId && c.status === 'pending')
                .map(challenge => (
                  <Card key={challenge.id} className="p-4 bg-gradient-to-r from-accent/20 to-transparent backdrop-blur border-accent/50">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Sword size={24} className="text-accent" />
                          <div>
                            <p className="font-bold text-lg">
                              {challenge.fromUsername} challenges you!
                            </p>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Target size={14} />
                                {DIFFICULTY_CONFIG[challenge.difficulty].name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {getChallengeTimeRemaining(challenge)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAcceptChallenge(challenge.id)}
                          className="border-green-500/50 hover:bg-green-500/10 text-green-500"
                        >
                          <Lightning size={16} className="mr-1" weight="fill" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeclineChallenge(challenge.id)}
                          className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}

          {activeChallenges.filter(c => c.fromUserId === currentUserId).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wider">
                Sent Challenges
              </h3>
              {activeChallenges
                .filter(c => c.fromUserId === currentUserId)
                .map(challenge => (
                  <Card key={challenge.id} className="p-4 bg-card/50 backdrop-blur border-primary/30">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-semibold">
                          Challenge to {challenge.toUsername}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Target size={14} />
                            {DIFFICULTY_CONFIG[challenge.difficulty].name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {getChallengeTimeRemaining(challenge)}
                          </span>
                          <Badge variant={challenge.status === 'accepted' ? 'default' : 'secondary'}>
                            {challenge.status}
                          </Badge>
                        </div>
                      </div>
                      {challenge.status === 'accepted' && !challenge.fromScore && (
                        <Button
                          size="sm"
                          onClick={() => {
                            onStartChallenge(challenge.id, challenge.difficulty)
                            toast.info('Starting challenge match...')
                          }}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Lightning size={16} className="mr-1" weight="fill" />
                          Play Now
                        </Button>
                      )}
                      {challenge.fromScore && !challenge.toScore && (
                        <Badge variant="outline" className="text-xs">
                          ⏳ Waiting for opponent
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}

          {activeChallenges.length === 0 && (
            <Card className="p-8 text-center bg-card/30 backdrop-blur border-primary/20">
              <Sword size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No active challenges. Challenge a friend to get started!</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-6">
          {completedChallenges.length > 0 ? (
            <div className="space-y-3">
              {completedChallenges.map(challenge => {
                const isWinner = challenge.winner === currentUserId
                const isDraw = challenge.winner === 'tie'
                
                return (
                  <Card 
                    key={challenge.id} 
                    className={`p-4 backdrop-blur ${
                      isWinner 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : isDraw 
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-destructive/10 border-destructive/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {isWinner ? (
                            <Crown size={20} className="text-yellow-500" weight="fill" />
                          ) : isDraw ? (
                            <Trophy size={20} className="text-yellow-500" />
                          ) : (
                            <X size={20} className="text-destructive" />
                          )}
                          <p className="font-bold">
                            {isWinner ? 'Victory' : isDraw ? 'Draw' : 'Defeat'} vs {
                              challenge.fromUserId === currentUserId 
                                ? challenge.toUsername 
                                : challenge.fromUsername
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {DIFFICULTY_CONFIG[challenge.difficulty].name}
                          </span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className={isWinner ? 'text-green-500' : 'text-foreground'}>
                            Your Score: {formatScore(challenge.fromUserId === currentUserId ? challenge.fromScore! : challenge.toScore!)}
                          </span>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-muted-foreground">
                            Their Score: {formatScore(challenge.fromUserId === currentUserId ? challenge.toScore! : challenge.fromScore!)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-8 text-center bg-card/30 backdrop-blur border-primary/20">
              <Trophy size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No completed challenges yet</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
