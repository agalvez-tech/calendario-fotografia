const SERVICIOS_COLORS = {
  'Fotografía': '#3498DB',
  'Vídeo': '#9B59B6',
  'Fotografía + Vídeo': '#E67E22',
  'Fotografía aérea': '#1ABC9C',
  'Tour virtual': '#E74C3C',
  'Planos': '#F39C12',
}

export default function CitaCard({ cita, isPast, isEditor, onEdit }) {
  const color = SERVICIOS_COLORS[cita.servicio] || 'var(--orange)'

  return (
    <div
      onClick={isEditor ? onEdit : undefined}
      style={{
        background: 'var(--card)',
        border: `1px solid var(--card-border)`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: '14px 16px',
        cursor: isEditor ? 'pointer' : 'default',
        opacity: isPast ? 0.65 : 1,
        transition: 'transform 0.15s, box-shadow 0.15s',
        position: 'relative',
        overflow: 'hidden'
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
        <div style={{
          position: 'absolute', top: 10, right: 12,
          fontSize: 10, color: 'var(--text-muted)', fontWeight: 600
        }}>EDITAR ✏️</div>
      )}

      {/* Hora */}
      {cita.hora && (
        <div style={{
          fontSize: 18, fontWeight: 800, color: 'var(--text)',
          marginBottom: 6, fontVariantNumeric: 'tabular-nums'
        }}>{cita.hora}</div>
      )}

      {/* Referencia */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4
      }}>
        <span style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--card-border)',
          borderRadius: 4, padding: '1px 6px', fontSize: 11, fontWeight: 700,
          color: 'var(--text)', letterSpacing: 0.5, fontFamily: 'monospace'
        }}>{cita.referencia || '—'}</span>
        {cita.servicio && (
          <span style={{
            background: `${color}20`, border: `1px solid ${color}40`,
            borderRadius: 4, padding: '1px 7px', fontSize: 10, fontWeight: 700,
            color: color
          }}>{cita.servicio}</span>
        )}
      </div>

      {/* Vivienda */}
      {cita.vivienda && (
        <div style={{
          fontSize: 13, fontWeight: 600, color: 'var(--text)',
          marginBottom: 4, marginTop: 6
        }}>📍 {cita.vivienda}</div>
      )}

      {/* Agente */}
      {cita.agente && (
        <div style={{
          fontSize: 12, color: 'var(--text-muted)', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4
        }}>
          <span>👤</span>
          <span>{cita.agente}</span>
        </div>
      )}

      {/* Notas */}
      {cita.notas && (
        <div style={{
          marginTop: 8, padding: '6px 10px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 6, fontSize: 11,
          color: 'var(--text-muted)', fontStyle: 'italic'
        }}>{cita.notas}</div>
      )}
    </div>
  )
}
