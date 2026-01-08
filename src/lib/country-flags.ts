export interface Country {
  code: string
  name: string
  flag: string
  region: string
}

export const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'North America' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'North America' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'North America' },
  
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'South America' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'South America' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'South America' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'South America' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'South America' },
  
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'Europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'Europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'Europe' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'Europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'Europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'Europe' },
  
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia' },
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'Asia' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Asia' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Asia' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Asia' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Asia' },
  
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania' },
  
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'Africa' },
]

const countryMap = new Map(COUNTRIES.map(c => [c.code, c]))
const countryNameMap = new Map(COUNTRIES.map(c => [c.name.toLowerCase(), c]))

export function getCountryByCode(code: string): Country | undefined {
  return countryMap.get(code.toUpperCase())
}

export function getCountryByName(name: string): Country | undefined {
  return countryNameMap.get(name.toLowerCase())
}

export function getCountriesByRegion(region: string): Country[] {
  return COUNTRIES.filter(c => c.region === region)
}

export function getCountryFlag(countryCode?: string): string {
  if (!countryCode) return '🌍'
  const country = getCountryByCode(countryCode)
  return country?.flag || '🌍'
}

export function getRegionForCountry(countryCode?: string): string {
  if (!countryCode) return 'Unknown'
  const country = getCountryByCode(countryCode)
  return country?.region || 'Unknown'
}

export function detectUserCountry(): string | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneToCountry: Record<string, string> = {
      'America/New_York': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'America/Los_Angeles': 'US',
      'America/Phoenix': 'US',
      'America/Toronto': 'CA',
      'America/Vancouver': 'CA',
      'America/Mexico_City': 'MX',
      'America/Sao_Paulo': 'BR',
      'America/Buenos_Aires': 'AR',
      'America/Santiago': 'CL',
      'America/Bogota': 'CO',
      'America/Lima': 'PE',
      'Europe/London': 'GB',
      'Europe/Berlin': 'DE',
      'Europe/Paris': 'FR',
      'Europe/Madrid': 'ES',
      'Europe/Rome': 'IT',
      'Europe/Amsterdam': 'NL',
      'Europe/Stockholm': 'SE',
      'Europe/Oslo': 'NO',
      'Europe/Copenhagen': 'DK',
      'Europe/Helsinki': 'FI',
      'Europe/Warsaw': 'PL',
      'Europe/Moscow': 'RU',
      'Europe/Kiev': 'UA',
      'Europe/Lisbon': 'PT',
      'Europe/Athens': 'GR',
      'Europe/Prague': 'CZ',
      'Europe/Vienna': 'AT',
      'Europe/Zurich': 'CH',
      'Europe/Brussels': 'BE',
      'Europe/Dublin': 'IE',
      'Asia/Shanghai': 'CN',
      'Asia/Tokyo': 'JP',
      'Asia/Seoul': 'KR',
      'Asia/Kolkata': 'IN',
      'Asia/Singapore': 'SG',
      'Asia/Bangkok': 'TH',
      'Asia/Ho_Chi_Minh': 'VN',
      'Asia/Manila': 'PH',
      'Asia/Kuala_Lumpur': 'MY',
      'Asia/Jakarta': 'ID',
      'Asia/Karachi': 'PK',
      'Asia/Dhaka': 'BD',
      'Asia/Istanbul': 'TR',
      'Asia/Jerusalem': 'IL',
      'Asia/Dubai': 'AE',
      'Asia/Riyadh': 'SA',
      'Australia/Sydney': 'AU',
      'Australia/Melbourne': 'AU',
      'Pacific/Auckland': 'NZ',
      'Africa/Johannesburg': 'ZA',
      'Africa/Cairo': 'EG',
      'Africa/Lagos': 'NG',
      'Africa/Nairobi': 'KE',
      'Africa/Casablanca': 'MA',
      'Africa/Accra': 'GH',
    }
    
    return timezoneToCountry[timezone] || null
  } catch {
    return null
  }
}

export function getAllRegions(): string[] {
  return Array.from(new Set(COUNTRIES.map(c => c.region)))
}
