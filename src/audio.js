// Efeitos sonoros via Web Audio API — sem assets externos. FR-013.
let _ctx = null
let _muted = false

function ac() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)() } catch { return null }
  }
  if (_ctx.state === 'suspended') _ctx.resume()
  return _ctx
}

export function isMuted() { return _muted }
export function toggleMute() { _muted = !_muted }

// Peteleco: estalo de ruído breve com envelope
export function playFlick() {
  if (_muted) return
  const c = ac(); if (!c) return
  try {
    const len = Math.ceil(c.sampleRate * 0.07)
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * ((1 - i / len) ** 2)
    const src = c.createBufferSource()
    const g = c.createGain()
    src.buffer = buf
    g.gain.setValueAtTime(0.28, c.currentTime)
    src.connect(g); g.connect(c.destination)
    src.start()
  } catch {}
}

// Gol: sequência de 4 tons ascendentes (dó-mi-sol-dó)
export function playGoal() {
  if (_muted) return
  const c = ac(); if (!c) return
  try {
    ;[523, 659, 784, 1047].forEach((f, i) => {
      const osc = c.createOscillator()
      const g = c.createGain()
      const t = c.currentTime + i * 0.12
      osc.type = 'sine'
      osc.frequency.setValueAtTime(f, t)
      g.gain.setValueAtTime(0.22, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
      osc.connect(g); g.connect(c.destination)
      osc.start(t); osc.stop(t + 0.22)
    })
  } catch {}
}

// Apito final: dois bipes curtos de árbitro
export function playWhistle() {
  if (_muted) return
  const c = ac(); if (!c) return
  try {
    ;[0, 0.28].forEach((delay, i) => {
      const osc = c.createOscillator()
      const g = c.createGain()
      const t = c.currentTime + delay
      osc.type = 'sine'
      osc.frequency.setValueAtTime(i === 0 ? 1320 : 1760, t)
      g.gain.setValueAtTime(0.18, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2)
      osc.connect(g); g.connect(c.destination)
      osc.start(t); osc.stop(t + 0.2)
    })
  } catch {}
}
