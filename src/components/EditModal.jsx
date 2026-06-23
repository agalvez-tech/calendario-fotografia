import { useState, useEffect } from 'react'

const SERVICIOS = [
  'Fotografía',
  'Vídeo',
  'Fotografía + Vídeo',
  'Fotografía aérea',
  'Tour virtual',
  'Planos',
]

const AGENTES = [
  'Almudena Gálvez',
  'Mireia Sáez',
  'Inma',
  'Alicia Barberá',
  'Carles Navarro',
  'Jose González',
  'Yvonne Vidal',
  'Mariano Del Prado',
  'Nuria Nuñez',
  'Fran',
  'Clara',
  'Claudia',
  'Eva',
  'Natalia',
  'María José',
  'Lorena',
  'Alejandro',
  'Otro',
]

export default function EditModal({ type, data, onSaveCita, onDeleteCita, onSavePendiente, onDeletePendiente, onClose }) {
  const isEdit = !!data.id
  const isCita = type === 'cita'

  const [form, setForm] = useState({
    fecha: '',
    hora: '',
    referencia: '',
    vivienda: '',
    servicio: 'Fotografía',
    agente: '',
    notas: '',
    // pendiente-only
    motivo: '',
    fechaPendiente: new Date().toISOString().split('T')[0],
    ...data
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (isCita && !form.fecha) return alert('La fecha es obligatoria')
    if (!form.referencia && !form.vivienda) return alert('Indica la referencia o dirección')
    setSaving(true)
    try {
      if (isCita) await onSaveCita(form)
      else await onSavePendiente(form)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setSaving(true)
    try {
      if (isCita) await onDeleteCita(data.id)
      else await onDeletePendiente(data.id)
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: '#2A2A2A', border: '1px solid var(--card-border)',
    borderRadius: 8, color: 'var(--text)', fontSize: 13, fontWeight: 500
  }
  const labelStyle = {
    display: 'block', fontSize: 11, fontWeight: 700,
    color: 'var(--text-muted)', letterSpacing: 0.5,
    textTransform: 'uppercase', marginBottom: 6
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0'
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--dark)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px 16px 0 0',
        width: '100%', maxWidth: 520,
        maxHeight: '92vh',
        overflow: 'auto',
        padding: '0 0 32px'
      }}>
        {/* Handle */}
        <div style={{ padding: '14px 0 8px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, background: 'var(--card-border)', borderRadius: 2 }} />
        </div>

        {/* Title */}
        <div style={{
          padding: '4px 20px 16px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>
              {isCita
                ? (isEdit ? 'Editar cita' : 'Nueva cita')
                : (isEdit ? 'Editar pendiente' : 'Nuevo pendiente')}
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {isCita ? 'Sesión fotográfica' : 'Propiedad pendiente de fotografía'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 4
          }}>×</button>
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {isCita ? (
            <CitaForm form={form} set={set} inputStyle={inputStyle} labelStyle={labelStyle} />
          ) : (
            <PendienteForm form={form} set={set} inputStyle={inputStyle} labelStyle={labelStyle} />
          )}

          {/* Actions */}
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: 'var(--orange)', color: '#fff',
                border: 'none', borderRadius: 10, padding: '13px',
                fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1
              }}
            >
              {saving ? 'Guardando...' : (isEdit ? '✓ Guardar cambios' : '+ Crear')}
            </button>

            {isEdit && (
              <button
                onClick={handleDelete}
                disabled={saving}
                style={{
                  background: confirmDelete ? 'var(--red)' : 'transparent',
                  color: confirmDelete ? '#fff' : 'var(--red)',
                  border: `1px solid var(--red)`,
                  borderRadius: 10, padding: '11px',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer'
                }}
              >
                {confirmDelete ? '⚠️ Confirmar eliminación' : '🗑 Eliminar'}
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'none', color: 'var(--text-muted)',
                border: 'none', padding: '8px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CitaForm({ form, set, inputStyle, labelStyle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Fecha *</label>
          <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Hora</label>
          <input type="time" value={form.hora} onChange={e => set('hora', e.target.value)} style={inputStyle} />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Referencia</label>
        <input placeholder="RK-XXXX" value={form.referencia} onChange={e => set('referencia', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Dirección / Vivienda</label>
        <input placeholder="Calle, número, localidad" value={form.vivienda} onChange={e => set('vivienda', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Servicio</label>
        <select value={form.servicio} onChange={e => set('servicio', e.target.value)} style={inputStyle}>
          {SERVICIOS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Agente captador</label>
        <select value={form.agente} onChange={e => set('agente', e.target.value)} style={inputStyle}>
          <option value="">— Seleccionar —</option>
          {AGENTES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Notas internas</label>
        <textarea
          rows={3} placeholder="Llaves, acceso, observaciones..."
          value={form.notas} onChange={e => set('notas', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
    </div>
  )
}

function PendienteForm({ form, set, inputStyle, labelStyle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={labelStyle}>Referencia</label>
        <input placeholder="RK-XXXX" value={form.referencia} onChange={e => set('referencia', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Dirección / Vivienda</label>
        <input placeholder="Calle, número, localidad" value={form.vivienda} onChange={e => set('vivienda', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Agente captador</label>
        <select value={form.agente} onChange={e => set('agente', e.target.value)} style={inputStyle}>
          <option value="">— Seleccionar —</option>
          {AGENTES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Fecha desde</label>
        <input type="date" value={form.fechaPendiente} onChange={e => set('fechaPendiente', e.target.value)} style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Motivo *</label>
        <textarea
          rows={3}
          placeholder="Ej: Propietario sin disponibilidad, pendiente de reforma, esperando autorización..."
          value={form.motivo} onChange={e => set('motivo', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
      <div>
        <label style={labelStyle}>Notas adicionales</label>
        <textarea
          rows={2}
          placeholder="Observaciones internas..."
          value={form.notas} onChange={e => set('notas', e.target.value)}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
    </div>
  )
}
