import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { ShareFat, XLogo, Copy, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { ShareContent, shareToTwitter, copyShareText } from '@/lib/social-share'

interface ShareButtonProps {
  content: ShareContent
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
}

export function ShareButton({ 
  content, 
  variant = 'outline', 
  size = 'default',
  className = '',
  showLabel = true 
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleTwitterShare = () => {
    shareToTwitter(content)
    toast.success('Opening Twitter...', {
      description: 'Share your achievement with the world!'
    })
  }

  const handleCopyText = async () => {
    const fullText = copyShareText(content)
    
    try {
      await navigator.clipboard.writeText(fullText)
      setCopied(true)
      toast.success('Copied to clipboard!', {
        description: 'Share text is ready to paste anywhere'
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy', {
        description: 'Please try again'
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className={`gap-2 ${className}`}
        >
          <ShareFat size={18} weight="fill" />
          {showLabel && 'Share'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 border-2 border-primary/30 bg-card/95 backdrop-blur-sm"
      >
        <DropdownMenuItem 
          onClick={handleTwitterShare}
          className="gap-3 cursor-pointer py-3"
        >
          <XLogo size={20} weight="bold" className="text-foreground" />
          <div>
            <div className="font-semibold">Share on X</div>
            <div className="text-xs text-muted-foreground">Post to Twitter/X</div>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleCopyText}
          className="gap-3 cursor-pointer py-3"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <Check size={20} weight="bold" className="text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={20} weight="bold" className="text-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <div className="font-semibold">{copied ? 'Copied!' : 'Copy Text'}</div>
            <div className="text-xs text-muted-foreground">
              {copied ? 'Ready to paste' : 'Share anywhere'}
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
