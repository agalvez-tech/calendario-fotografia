const SERVICIOS_COLORS = {
  'FOTOGRAFÍA': '#2980B9',
  'HS': '#8E44AD',
  'RS': '#C0392B',
  'Fotografía': '#2980B9',
  'Vídeo': '#8E44AD',
  'Fotografía + Vídeo': '#E67E22',
  'Fotografía aérea': '#16A085',
  'Tour virtual': '#C0392B',
  'Planos': '#D35400',
}

export default function CitaCard({ cita, isPast, isEditor, onEdit }) {
  const color = SERVICIOS_COLORS[cita.servicio] || 'var(--orange)'

  return (
    <div
      onClick={isEditor ? onEdit : undefined}
      style={{
        background: '#fff',
        border: `1px solid var(--card-border)`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: '14px 16px',
        cursor: isEditor ? 'pointer' : 'default',
        opacity: isPast ? 0.6 : 1,
        transition: 'transform 0.15s, box-shadow 0.15s',
        boxShadow: 'var(--card-shadow)'
      }}
      onMouseEnter={e => {
        if (isEditor) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'var(--card-shadow)'
      }}
    >
      {isEditor && (
        <div style={{ float: 'right', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
          EDITAR ✏️
        </div>
      )}

      {cita.hora && (
        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
          {cita.hora}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
        <span style={{
          background: '#F0F2F5', border: '1px solid var(--card-border)',
          borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 700,
          color: 'var(--text)', letterSpacing: 0.5, fontFamily: 'monospace'
        }}>{cita.referencia || '—'}</span>
        {cita.servicio && (
          <span style={{
            background: `${color}15`, border: `1px solid ${color}40`,
            borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 700,
            color: color
          }}>{cita.servicio}</span>
        )}
      </div>

      {cita.vivienda && (
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          📍 {cita.vivienda}
        </div>
      )}

      {cita.agente && (
        <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
          👤 {cita.agente}
        </div>
      )}

      {cita.notas && (
        <div style={{
          marginTop: 8, padding: '6px 10px',
          background: '#F8F9FB', borderRadius: 6,
          fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic',
          borderLeft: '2px solid var(--card-border)'
        }}>{cita.notas}</div>
      )}
    </div>
  )
}
