import { motion } from 'framer-motion'
import { ActivePowerUp, POWER_UP_CONFIG } from '@/lib/power-ups'
import { Card } from '@/components/ui/card'

interface ActivePowerUpsDisplayProps {
  activePowerUps: ActivePowerUp[]
}

export function ActivePowerUpsDisplay({ activePowerUps }: ActivePowerUpsDisplayProps) {
  if (activePowerUps.length === 0) {
    return null
  }
  
  return (
    <div className="flex gap-2">
      {activePowerUps.map((powerUp, index) => {
        const config = POWER_UP_CONFIG[powerUp.type]
        const elapsed = Date.now() - powerUp.startTime
        const remaining = Math.max(0, powerUp.duration - elapsed)
        const progress = remaining / powerUp.duration
        
        return (
          <motion.div
            key={`${powerUp.type}-${powerUp.startTime}`}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="relative overflow-hidden px-3 py-2 flex items-center gap-2 min-w-[120px]"
              style={{
                backgroundColor: config.color,
                borderColor: 'rgba(255, 255, 255, 0.3)'
              }}
            >
              <div
                className="absolute inset-0 bg-black/30"
                style={{
                  width: `${(1 - progress) * 100}%`,
                  transition: 'width 0.1s linear'
                }}
              />
              
              <div className="relative z-10 flex items-center gap-2">
                <span className="text-2xl">{config.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-none">
                    {config.name}
                  </span>
                  <span className="text-xs text-white/80 leading-none mt-0.5">
                    {(remaining / 1000).toFixed(1)}s
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
