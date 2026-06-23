import { useState } from 'react'
import CitaCard from './CitaCard.jsx'

const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const DAY_NAMES_FULL = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function getMondayOf(date) {
  const d = new Date(date)
  const day = d.getDay() // 0=Sun
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0,0,0,0)
  return d
}

function dateStr(d) {
  return d.toISOString().split('T')[0]
}

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function formatWeekLabel(monday) {
  const sunday = addDays(monday, 6)
  const m1 = MONTH_NAMES[monday.getMonth()]
  const m2 = MONTH_NAMES[sunday.getMonth()]
  if (m1 === m2) {
    return `${monday.getDate()} – ${sunday.getDate()} ${m1} ${monday.getFullYear()}`
  }
  return `${monday.getDate()} ${m1} – ${sunday.getDate()} ${m2} ${sunday.getFullYear()}`
}

export default function AgendaView({ citas, isEditor, onNew, onEdit }) {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()))

  const today = todayStr()
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const weekLabel = formatWeekLabel(weekStart)

  const prevWeek = () => setWeekStart(d => addDays(d, -7))
  const nextWeek = () => setWeekStart(d => addDays(d, 7))
  const goToday = () => setWeekStart(getMondayOf(new Date()))

  // Group citas by date
  const byDate = {}
  citas.forEach(c => {
    if (!byDate[c.fecha]) byDate[c.fecha] = []
    byDate[c.fecha].push(c)
  })
  Object.keys(byDate).forEach(d => {
    byDate[d].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''))
  })

  const weekCitas = weekDays.reduce((acc, d) => acc + (byDate[dateStr(d)] || []).length, 0)

  const isCurrentWeek = dateStr(getMondayOf(new Date())) === dateStr(weekStart)

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Agenda</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
            {weekCitas} sesión{weekCitas !== 1 ? 'es' : ''} esta semana
          </p>
        </div>
        {isEditor && (
          <button onClick={onNew} style={{
            background:'var(--orange)', color:'#fff', border:'none',
            borderRadius:8, padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer'
          }}>+ Nueva cita</button>
        )}
      </div>

      {/* Week navigation */}
      <div style={{
        background:'var(--card)', border:'1px solid var(--card-border)',
        borderRadius:12, padding:'12px 16px', marginBottom:20,
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:12
      }}>
        <button onClick={prevWeek} style={{
          background:'none', border:'1px solid var(--card-border)',
          borderRadius:8, color:'var(--text)', padding:'7px 14px',
          fontSize:16, cursor:'pointer', fontWeight:600
        }}>‹</button>

        <div style={{ textAlign:'center' }}>
          <div style={{ fontWeight:700, fontSize:15, color:'var(--text)' }}>{weekLabel}</div>
          {!isCurrentWeek && (
            <button onClick={goToday} style={{
              background:'none', border:'none', color:'var(--orange)',
              fontSize:11, fontWeight:700, cursor:'pointer', marginTop:2
            }}>← Volver a esta semana</button>
          )}
        </div>

        <button onClick={nextWeek} style={{
          background:'none', border:'1px solid var(--card-border)',
          borderRadius:8, color:'var(--text)', padding:'7px 14px',
          fontSize:16, cursor:'pointer', fontWeight:600
        }}>›</button>
      </div>

      {/* Week grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 10
      }}>
        {weekDays.map((day, i) => {
          const ds = dateStr(day)
          const dayCitas = byDate[ds] || []
          const isToday = ds === today
          const isPast = ds < today
          const isWeekend = i >= 5

          return (
            <div key={ds} style={{
              background: isToday ? 'rgba(207,115,27,0.06)' : 'var(--card)',
              border: `1px solid ${isToday ? 'rgba(207,115,27,0.4)' : 'var(--card-border)'}`,
              borderRadius: 10,
              minHeight: 120,
              opacity: isPast && !isToday ? 0.7 : 1,
              display: 'flex', flexDirection: 'column'
            }}>
              {/* Day header */}
              <div style={{
                padding: '8px 10px 6px',
                borderBottom: `1px solid ${isToday ? 'rgba(207,115,27,0.2)' : 'var(--card-border)'}`,
                display: 'flex', alignItems: 'baseline', gap: 5
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                  color: isToday ? 'var(--orange)' : isWeekend ? 'var(--text-muted)' : 'var(--text-dim)',
                  textTransform: 'uppercase'
                }}>{DAY_NAMES[i]}</span>
                <span style={{
                  fontSize: 18, fontWeight: 800,
                  color: isToday ? 'var(--orange)' : 'var(--text)',
                  lineHeight: 1
                }}>{day.getDate()}</span>
                {dayCitas.length > 0 && (
                  <span style={{
                    marginLeft:'auto', background:'var(--orange)',
                    color:'#fff', borderRadius:10, padding:'1px 6px',
                    fontSize:10, fontWeight:700
                  }}>{dayCitas.length}</span>
                )}
              </div>

              {/* Citas */}
              <div style={{ padding: '8px', display:'flex', flexDirection:'column', gap:6, flex:1 }}>
                {dayCitas.length === 0 ? (
                  <div style={{
                    flex:1, display:'flex', alignItems:'center', justifyContent:'center',
                    color:'var(--card-border)', fontSize:18
                  }}>—</div>
                ) : (
                  dayCitas.map(cita => (
                    <MiniCitaCard
                      key={cita.id}
                      cita={cita}
                      isEditor={isEditor}
                      onEdit={() => onEdit(cita)}
                    />
                  ))
                )}
                {isEditor && (
                  <button
                    onClick={() => {
                      const fechaDefault = ds
                      onNew({ fecha: fechaDefault })
                    }}
                    style={{
                      background:'none', border:'1px dashed var(--card-border)',
                      borderRadius:6, color:'var(--text-muted)', fontSize:11,
                      padding:'4px', cursor:'pointer', marginTop:'auto',
                      fontWeight:600
                    }}
                  >+ añadir</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Week summary */}
      {weekCitas > 0 && (
        <WeekSummary citas={weekDays.flatMap(d => byDate[dateStr(d)] || [])} />
      )}
    </div>
  )
}

const SERVICIO_COLORS = {
  'HS': '#9B59B6',
  'RS': '#E74C3C',
  'FOTOGRAFÍA': '#3498DB',
}

function MiniCitaCard({ cita, isEditor, onEdit }) {
  const color = SERVICIO_COLORS[cita.servicio] || 'var(--orange)'
  return (
    <div
      onClick={isEditor ? onEdit : undefined}
      style={{
        background: `${color}15`,
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 6,
        padding: '5px 7px',
        cursor: isEditor ? 'pointer' : 'default',
        transition: 'opacity 0.1s'
      }}
      onMouseEnter={e => isEditor && (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
    >
      {cita.hora && (
        <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom:1 }}>{cita.hora}</div>
      )}
      <div style={{ fontSize: 11, fontWeight: 700, color:'var(--text)', lineHeight:1.2 }}>
        {cita.referencia || '—'}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700,
        color, marginTop: 2
      }}>{cita.servicio}</div>
      {cita.agente && (
        <div style={{ fontSize: 10, color:'var(--text-muted)', marginTop:1 }}>
          {cita.agente.split(' ')[0]}
        </div>
      )}
    </div>
  )
}

function WeekSummary({ citas }) {
  const byService = {}
  citas.forEach(c => {
    byService[c.servicio] = (byService[c.servicio] || 0) + 1
  })
  return (
    <div style={{
      marginTop: 16, background:'var(--card)', border:'1px solid var(--card-border)',
      borderRadius:10, padding:'12px 16px',
      display:'flex', gap:20, alignItems:'center', flexWrap:'wrap'
    }}>
      <span style={{ fontSize:11, color:'var(--text-muted)', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>
        Resumen semana
      </span>
      {Object.entries(byService).map(([srv, count]) => (
        <div key={srv} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{
            width:8, height:8, borderRadius:'50%',
            background: SERVICIO_COLORS[srv] || 'var(--orange)'
          }}/>
          <span style={{ fontSize:12, fontWeight:700, color:'var(--text)' }}>{count}</span>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>{srv}</span>
        </div>
      ))}
      <div style={{ marginLeft:'auto', fontSize:12, fontWeight:700, color:'var(--text)' }}>
        {citas.length} total
      </div>
    </div>
  )
}
