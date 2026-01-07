type SoundType = 'hit' | 'miss' | 'combo' | 'roundStart' | 'gameOver'
export type SoundTheme = 'sci-fi' | 'retro' | 'minimal'

class SoundSystem {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private enabled: boolean = true
  private theme: SoundTheme = 'sci-fi'

  constructor() {
    this.initialize()
  }

  private initialize() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.value = 0.3
    } catch (error) {
      console.warn('Web Audio API not supported', error)
    }
  }

  private ensureContext() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  setTheme(theme: SoundTheme) {
    this.theme = theme
  }

  getTheme(): SoundTheme {
    return this.theme
  }

  play(type: SoundType, comboLevel: number = 0) {
    if (!this.enabled || !this.audioContext || !this.masterGain) return

    this.ensureContext()

    switch (this.theme) {
      case 'sci-fi':
        this.playSciFiSound(type, comboLevel)
        break
      case 'retro':
        this.playRetroSound(type, comboLevel)
        break
      case 'minimal':
        this.playMinimalSound(type, comboLevel)
        break
    }
  }

  private playSciFiSound(type: SoundType, comboLevel: number) {
    switch (type) {
      case 'hit':
        this.playSciFiHit(comboLevel)
        break
      case 'miss':
        this.playSciFiMiss()
        break
      case 'combo':
        this.playSciFiCombo(comboLevel)
        break
      case 'roundStart':
        this.playSciFiRoundStart()
        break
      case 'gameOver':
        this.playSciFiGameOver()
        break
    }
  }

  private playRetroSound(type: SoundType, comboLevel: number) {
    switch (type) {
      case 'hit':
        this.playRetroHit(comboLevel)
        break
      case 'miss':
        this.playRetroMiss()
        break
      case 'combo':
        this.playRetroCombo(comboLevel)
        break
      case 'roundStart':
        this.playRetroRoundStart()
        break
      case 'gameOver':
        this.playRetroGameOver()
        break
    }
  }

  private playMinimalSound(type: SoundType, comboLevel: number) {
    switch (type) {
      case 'hit':
        this.playMinimalHit(comboLevel)
        break
      case 'miss':
        this.playMinimalMiss()
        break
      case 'combo':
        this.playMinimalCombo(comboLevel)
        break
      case 'roundStart':
        this.playMinimalRoundStart()
        break
      case 'gameOver':
        this.playMinimalGameOver()
        break
    }
  }

  private playSciFiHit(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    oscillator.type = 'sine'
    const baseFreq = 800 + (comboLevel * 50)
    oscillator.frequency.setValueAtTime(baseFreq, now)
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.05)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, now)
    filter.Q.setValueAtTime(5, now)

    gainNode.gain.setValueAtTime(0.4, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.15)

    const noiseBuffer = this.createNoiseBuffer(0.02)
    const noiseSource = this.audioContext.createBufferSource()
    const noiseGain = this.audioContext.createGain()
    const noiseFilter = this.audioContext.createBiquadFilter()

    noiseSource.buffer = noiseBuffer
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.setValueAtTime(3000, now)
    
    noiseGain.gain.setValueAtTime(0.2, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.02)

    noiseSource.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(this.masterGain)

    noiseSource.start(now)
    noiseSource.stop(now + 0.02)
  }

  private playSciFiMiss() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    const filter = this.audioContext.createBiquadFilter()

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(200, now)
    oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.3)

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, now)
    filter.Q.setValueAtTime(2, now)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    oscillator.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  private playSciFiCombo(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const notes = [523.25, 659.25, 783.99, 1046.50]
    const noteIndex = Math.min(comboLevel % 4, notes.length - 1)
    const baseFreq = notes[noteIndex]

    for (let i = 0; i < 3; i++) {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const startTime = now + (i * 0.05)

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(baseFreq * (i + 1), startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15 / (i + 1), startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.1)
    }
  }

  private playSciFiRoundStart() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const frequencies = [440, 554.37, 659.25]

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const startTime = now + (index * 0.15)

      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  }

  private playSciFiGameOver() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const frequencies = [659.25, 587.33, 523.25, 440]

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const filter = this.audioContext!.createBiquadFilter()
      const startTime = now + (index * 0.2)

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(2000, startTime)
      filter.frequency.exponentialRampToValueAtTime(500, startTime + 0.4)

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.25, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.4)
    })
  }

  private playRetroHit(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'square'
    const baseFreq = 1200 + (comboLevel * 100)
    oscillator.frequency.setValueAtTime(baseFreq, now)
    oscillator.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.08)

    gainNode.gain.setValueAtTime(0.5, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.08)
  }

  private playRetroMiss() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(150, now)
    oscillator.frequency.linearRampToValueAtTime(80, now + 0.2)

    gainNode.gain.setValueAtTime(0.4, now)
    gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.2)
  }

  private playRetroCombo(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const frequencies = [262, 330, 392, 523]
    
    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const startTime = now + (i * 0.04)

      oscillator.type = 'square'
      oscillator.frequency.setValueAtTime(freq + (comboLevel * 20), startTime)

      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.1)
    })
  }

  private playRetroRoundStart() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const melody = [392, 523, 659]

    melody.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const startTime = now + (index * 0.12)

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0.35, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.2)
    })
  }

  private playRetroGameOver() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const melody = [523, 494, 440, 392, 349]

    melody.forEach((freq, index) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      const startTime = now + (index * 0.15)

      oscillator.type = 'triangle'
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)

      oscillator.connect(gainNode)
      gainNode.connect(this.masterGain!)

      oscillator.start(startTime)
      oscillator.stop(startTime + 0.25)
    })
  }

  private playMinimalHit(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(600 + (comboLevel * 30), now)

    gainNode.gain.setValueAtTime(0.25, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.08)
  }

  private playMinimalMiss() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(180, now)

    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.12)
  }

  private playMinimalCombo(comboLevel: number) {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    const freq = 800 + (comboLevel * 40)
    oscillator.frequency.setValueAtTime(freq, now)
    oscillator.frequency.exponentialRampToValueAtTime(freq * 1.2, now + 0.06)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.1)
  }

  private playMinimalRoundStart() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, now)

    gainNode.gain.setValueAtTime(0.25, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.15)
  }

  private playMinimalGameOver() {
    if (!this.audioContext || !this.masterGain) return

    const now = this.audioContext.currentTime
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(440, now)
    oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.3)

    gainNode.gain.setValueAtTime(0.2, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3)

    oscillator.connect(gainNode)
    gainNode.connect(this.masterGain)

    oscillator.start(now)
    oscillator.stop(now + 0.3)
  }

  private createNoiseBuffer(duration: number): AudioBuffer {
    const sampleRate = this.audioContext!.sampleRate
    const bufferSize = sampleRate * duration
    const buffer = this.audioContext!.createBuffer(1, bufferSize, sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    return buffer
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }
}

export const soundSystem = new SoundSystem()
