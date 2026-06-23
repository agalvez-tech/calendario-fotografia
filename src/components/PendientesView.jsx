export default function PendientesView({ pendientes, isEditor, onNew, onEdit }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Propiedades pendientes</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {pendientes.length > 0 ? `${pendientes.length} propiedad${pendientes.length !== 1 ? 'es' : ''} pendiente${pendientes.length !== 1 ? 's' : ''}` : 'Sin pendientes'}
          </p>
        </div>
        {isEditor && (
          <button
            onClick={onNew}
            style={{
              background: 'var(--yellow)',
              color: 'var(--black)',
              border: 'none', borderRadius: 8,
              padding: '10px 18px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            + Añadir pendiente
          </button>
        )}
      </div>

      {pendientes.length === 0 ? (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--card-border)',
          borderRadius: 12, padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>Sin propiedades pendientes</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>Todo al día por el momento</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {pendientes.map(p => (
            <PendienteCard key={p.id} pendiente={p} isEditor={isEditor} onEdit={() => onEdit(p)} />
          ))}
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function PendienteCard({ pendiente: p, isEditor, onEdit }) {
  return (
    <div
      onClick={isEditor ? onEdit : undefined}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--card-border)',
        borderLeft: '3px solid var(--yellow)',
        borderRadius: 10, padding: '16px',
        cursor: isEditor ? 'pointer' : 'default',
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative'
      }}
      onMouseEnter={e => {
        if (isEditor) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {isEditor && (
        <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
          EDITAR ✏️
        </div>
      )}

      {/* Ref + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)',
          borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700,
          color: 'var(--text)', letterSpacing: 0.5, fontFamily: 'monospace'
        }}>{p.referencia || '—'}</span>
        <span style={{
          background: 'rgba(243,156,18,0.15)', border: '1px solid rgba(243,156,18,0.3)',
          borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700, color: 'var(--yellow)'
        }}>⏳ PENDIENTE</span>
      </div>

      {p.vivienda && (
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          📍 {p.vivienda}
        </div>
      )}
      {p.agente && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          👤 {p.agente}
        </div>
      )}
      {p.fechaPendiente && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
          📅 Desde {formatDate(p.fechaPendiente)}
        </div>
      )}

      {p.motivo && (
        <div style={{
          padding: '8px 10px',
          background: 'rgba(243,156,18,0.08)',
          borderRadius: 6, fontSize: 12,
          color: 'var(--text-dim)',
          borderLeft: '2px solid rgba(243,156,18,0.4)'
        }}>
          <span style={{ fontWeight: 700, color: 'var(--yellow)', marginRight: 4 }}>Motivo:</span>
          {p.motivo}
        </div>
      )}

      {p.notas && (
        <div style={{
          marginTop: 8, padding: '6px 10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 6, fontSize: 11,
          color: 'var(--text-muted)', fontStyle: 'italic'
        }}>{p.notas}</div>
      )}
    </div>
  )
}
