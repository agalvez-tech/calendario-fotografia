import { useState } from 'react'
import CitaCard from './CitaCard.jsx'

function getLocalDateStr(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return d.toISOString().split('T')[0]
}

function formatDateLabel(dateStr) {
  const [y, m, d] = dateStr.split('-')
  const date = new Date(+y, +m - 1, +d)
  const today = getLocalDateStr(0)
  const tomorrow = getLocalDateStr(1)
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
  const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const dayName = dayNames[date.getDay()]
  const label = `${dayName}, ${+d} ${monthNames[+m - 1]}`
  if (dateStr === today) return `HOY · ${label}`
  if (dateStr === tomorrow) return `MAÑANA · ${label}`
  return label
}

function isFuture(dateStr) {
  return dateStr >= getLocalDateStr(0)
}

export default function AgendaView({ citas, isEditor, onNew, onEdit }) {
  const [showPast, setShowPast] = useState(false)

  // Group by date, sorted
  const grouped = {}
  citas.forEach(c => {
    if (!grouped[c.fecha]) grouped[c.fecha] = []
    grouped[c.fecha].push(c)
  })
  // Sort citas within each day by hora
  Object.keys(grouped).forEach(d => {
    grouped[d].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
  })

  const allDates = Object.keys(grouped).sort()
  const today = getLocalDateStr(0)
  const futureDates = allDates.filter(d => d >= today)
  const pastDates = allDates.filter(d => d < today).reverse()

  const todayCitas = grouped[today] || []
  const hasToday = !!grouped[today]

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>Agenda de sesiones</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            {todayCitas.length > 0 ? `${todayCitas.length} sesión${todayCitas.length > 1 ? 'es' : ''} hoy` : 'Sin sesiones hoy'}
          </p>
        </div>
        {isEditor && (
          <button
            onClick={onNew}
            style={{
              background: 'var(--orange)',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 6,
              cursor: 'pointer'
            }}
          >
            + Nueva cita
          </button>
        )}
      </div>

      {/* Future + today */}
      {futureDates.length === 0 && (
        <div style={{
          background: 'var(--card)', border: '1px solid var(--card-border)',
          borderRadius: 12, padding: '40px 24px', textAlign: 'center',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <div style={{ fontWeight: 600 }}>No hay sesiones programadas</div>
          {isEditor && <div style={{ fontSize: 12, marginTop: 6 }}>Usa el botón "Nueva cita" para añadir una sesión</div>}
        </div>
      )}

      {futureDates.map(date => (
        <DaySection
          key={date}
          date={date}
          label={formatDateLabel(date)}
          citas={grouped[date]}
          isToday={date === today}
          isEditor={isEditor}
          onEdit={onEdit}
        />
      ))}

      {/* Past sessions toggle */}
      {pastDates.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <button
            onClick={() => setShowPast(p => !p)}
            style={{
              background: 'none',
              border: '1px solid var(--card-border)',
              borderRadius: 8,
              color: 'var(--text-muted)',
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {showPast ? '▲ Ocultar sesiones pasadas' : `▼ Ver sesiones pasadas (${pastDates.reduce((a, d) => a + grouped[d].length, 0)})`}
          </button>

          {showPast && pastDates.map(date => (
            <DaySection
              key={date}
              date={date}
              label={formatDateLabel(date)}
              citas={grouped[date]}
              isToday={false}
              isPast={true}
              isEditor={isEditor}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function DaySection({ date, label, citas, isToday, isPast, isEditor, onEdit }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: isToday ? 'var(--orange)' : isPast ? 'var(--text-muted)' : 'var(--text-dim)',
          letterSpacing: 1,
          textTransform: 'uppercase'
        }}>{label}</div>
        <div style={{
          flex: 1, height: 1,
          background: isToday ? 'rgba(207,115,27,0.3)' : 'var(--card-border)'
        }} />
        <div style={{
          fontSize: 11, color: 'var(--text-muted)', fontWeight: 600
        }}>{citas.length} sesión{citas.length !== 1 ? 'es' : ''}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
        {citas.map(cita => (
          <CitaCard
            key={cita.id}
            cita={cita}
            isPast={isPast}
            isEditor={isEditor}
            onEdit={() => onEdit(cita)}
          />
        ))}
      </div>
    </div>
  )
}
