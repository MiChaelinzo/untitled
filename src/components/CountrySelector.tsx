import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Flag, MapPin, Check } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { COUNTRIES, getCountryFlag, detectUserCountry } from '@/lib/country-flags'
import { toast } from 'sonner'

export function CountrySelector() {
  const [userCountryCode, setUserCountryCode] = useKV<string | null>('user-country-code', null)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAutoDetect = () => {
    const detected = detectUserCountry()
    if (detected) {
      setUserCountryCode(detected)
      const country = COUNTRIES.find(c => c.code === detected)
      toast.success(`Country set to ${country?.name} ${country?.flag}`)
    } else {
      toast.error('Could not auto-detect country')
    }
  }

  const handleManualSelect = (countryCode: string) => {
    setUserCountryCode(countryCode)
    const country = COUNTRIES.find(c => c.code === countryCode)
    toast.success(`Country set to ${country?.name} ${country?.flag}`)
  }

  const currentCountry = userCountryCode ? COUNTRIES.find(c => c.code === userCountryCode) : undefined

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-sm border-primary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" weight="bold" />
          <h3 className="font-bold text-foreground">Country</h3>
        </div>
        {currentCountry && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <span className="text-lg">{currentCountry.flag}</span>
            <Check className="w-3 h-3 text-green-500" weight="bold" />
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {currentCountry ? (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentCountry.flag}</span>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{currentCountry.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {currentCountry.region}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              No country selected
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoDetect}
            className="w-full"
          >
            <Flag className="w-4 h-4 mr-2" />
            Auto-Detect
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {isExpanded ? 'Hide' : 'Choose'}
          </Button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Select value={userCountryCode || ''} onValueChange={handleManualSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {COUNTRIES.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          Your country appears on the global leaderboard
        </p>
      </div>
    </Card>
  )
}
