import { motion } from 'framer-motion'
import { Clock, Calendar, Sparkle } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SeasonalEvent, formatTimeRemaining } from '@/lib/seasonal-events'

interface EventNotificationBannerProps {
  event: SeasonalEvent
  onViewEvent: () => void
}

export function EventNotificationBanner({ event, onViewEvent }: EventNotificationBannerProps) {
  const timeRemaining = formatTimeRemaining(event.endDate)
  const isEndingSoon = (event.endDate - Date.now()) < (24 * 60 * 60 * 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
    >
      <Card 
        className="p-4 shadow-2xl border-2"
        style={{
          background: `linear-gradient(135deg, 
            color-mix(in oklch, ${event.theme.backgroundColor} 90%, transparent),
            color-mix(in oklch, ${event.theme.primaryColor} 30%, transparent)
          )`,
          borderColor: event.theme.accentColor,
          boxShadow: `0 0 30px color-mix(in oklch, ${event.theme.primaryColor} 50%, transparent)`
        }}
      >
        <div className="flex items-center gap-4">
          <div 
            className="text-4xl p-3 rounded-xl animate-bounce"
            style={{ 
              backgroundColor: `color-mix(in oklch, ${event.theme.primaryColor} 30%, transparent)`,
              boxShadow: `0 0 20px ${event.theme.primaryColor}`
            }}
          >
            {event.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkle className="w-4 h-4 text-yellow-400" weight="fill" />
              <h3 className="font-bold text-lg">{event.name}</h3>
              {isEndingSoon && (
                <Badge variant="destructive" className="animate-pulse">
                  Ending Soon!
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{timeRemaining}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{event.challenges.length} challenges</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={onViewEvent}
            className="shrink-0"
            style={{
              backgroundColor: event.theme.primaryColor,
              borderColor: event.theme.accentColor
            }}
          >
            View Event
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
