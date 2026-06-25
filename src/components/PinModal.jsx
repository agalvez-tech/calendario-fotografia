import { useState, useRef, useEffect } from 'react'

export default function PinModal({ pin, onSuccess, onClose }) {
  const [digits, setDigits] = useState(['', '', '', ''])
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)
  const refs = [useRef(), useRef(), useRef(), useRef()]

  useEffect(() => { refs[0].current?.focus() }, [])

  const handleDigit = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError(false)
    if (val && i < 3) refs[i + 1].current?.focus()
    if (next.every(d => d !== '') && i === 3) {
      const entered = next.join('')
      if (entered === pin) {
        onSuccess()
      } else {
        setShake(true)
        setError(true)
        setTimeout(() => {
          setShake(false)
          setDigits(['', '', '', ''])
          refs[0].current?.focus()
        }, 600)
      }
    }
  }

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs[i - 1].current?.focus()
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(26,26,46,0.65)',
        zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#FFFFFF', border: '1px solid var(--card-border)',
        borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 300,
        textAlign: 'center',
        animation: shake ? 'shake 0.4s' : 'none'
      }}>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0) }
            20% { transform: translateX(-8px) }
            40% { transform: translateX(8px) }
            60% { transform: translateX(-6px) }
            80% { transform: translateX(6px) }
          }
        `}</style>

        <div style={{ fontSize: 32, marginBottom: 12 }}>🔐</div>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>Modo edición</h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24 }}>
          Introduce el PIN para activar la edición
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={refs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleDigit(i, e.target.value)}
              onKeyDown={e => handleKey(i, e)}
              style={{
                width: 48, height: 54,
                textAlign: 'center', fontSize: 20, fontWeight: 700,
                background: d ? 'rgba(207,115,27,0.08)' : '#F8F9FB',
                border: `2px solid ${error ? 'var(--red)' : d ? 'var(--orange)' : 'var(--card-border)'}`,
                borderRadius: 10, color: 'var(--text)',
                transition: 'all 0.15s'
              }}
            />
          ))}
        </div>

        {error && (
          <p style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginBottom: 12 }}>
            PIN incorrecto
          </p>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 13, cursor: 'pointer', marginTop: 8
          }}
        >Cancelar</button>
      </div>
    </div>
  )
}
