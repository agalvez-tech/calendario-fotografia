import { useState } from 'react'
import CitaCard from './CitaCard.jsx'

export default function SearchView({ citas, pendientes, isEditor, onEditCita, onEditPendiente }) {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const matchedCitas = q.length < 2 ? [] : citas.filter(c =>
    (c.referencia || '').toLowerCase().includes(q) ||
    (c.vivienda || '').toLowerCase().includes(q) ||
    (c.agente || '').toLowerCase().includes(q)
  )
  const matchedPendientes = q.length < 2 ? [] : pendientes.filter(p =>
    (p.referencia || '').toLowerCase().includes(q) ||
    (p.vivienda || '').toLowerCase().includes(q) ||
    (p.agente || '').toLowerCase().includes(q)
  )

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Buscador</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Busca por referencia, dirección o agente</p>
      </div>

      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: 16, pointerEvents: 'none'
        }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Referencia, dirección, agente..."
          autoFocus
          style={{
            width: '100%', padding: '12px 16px 12px 42px',
            background: 'var(--card)', border: '1px solid var(--card-border)',
            borderRadius: 10, color: 'var(--text)', fontSize: 15, fontWeight: 500
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: 18, cursor: 'pointer', padding: 4
            }}
          >×</button>
        )}
      </div>

      {q.length < 2 && (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          <div style={{ fontWeight: 600 }}>Escribe al menos 2 caracteres para buscar</div>
        </div>
      )}

      {q.length >= 2 && matchedCitas.length === 0 && matchedPendientes.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 0',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>😕</div>
          <div style={{ fontWeight: 600 }}>Sin resultados para "{query}"</div>
        </div>
      )}

      {matchedCitas.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--orange)',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12
          }}>Citas ({matchedCitas.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {matchedCitas.map(c => (
              <CitaCard key={c.id} cita={c} isEditor={isEditor} onEdit={() => onEditCita(c)} />
            ))}
          </div>
        </section>
      )}

      {matchedPendientes.length > 0 && (
        <section>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'var(--yellow)',
            letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12
          }}>Pendientes ({matchedPendientes.length})</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {matchedPendientes.map(p => (
              <PendienteCard key={p.id} pendiente={p} isEditor={isEditor} onEdit={() => onEditPendiente(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function PendienteCard({ pendiente: p, isEditor, onEdit }) {
  return (
    <div
      onClick={isEditor ? onEdit : undefined}
      style={{
        background: 'var(--card)', border: '1px solid var(--card-border)',
        borderLeft: '3px solid var(--yellow)', borderRadius: 10, padding: '14px 16px',
        cursor: isEditor ? 'pointer' : 'default'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)',
          borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700,
          fontFamily: 'monospace'
        }}>{p.referencia || '—'}</span>
        <span style={{
          background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.3)',
          borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700,
          color: 'var(--yellow)'
        }}>PENDIENTE</span>
      </div>
      {p.vivienda && <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📍 {p.vivienda}</div>}
      {p.agente && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>👤 {p.agente}</div>}
      {p.motivo && (
        <div style={{
          marginTop: 8, padding: '6px 10px',
          background: 'rgba(243,156,18,0.08)', borderRadius: 6,
          fontSize: 11, color: 'var(--text-dim)'
        }}>⚠️ {p.motivo}</div>
      )}
    </div>
  )
}
