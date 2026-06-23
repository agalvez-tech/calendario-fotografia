import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import AgendaView from './components/AgendaView.jsx'
import SearchView from './components/SearchView.jsx'
import PendientesView from './components/PendientesView.jsx'
import EditModal from './components/EditModal.jsx'
import PinModal from './components/PinModal.jsx'
import Toast from './components/Toast.jsx'

const PIN = '1902'
const API = '/api/data'

export default function App() {
  const [activeTab, setActiveTab] = useState('agenda')
  const [isEditor, setIsEditor] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [citas, setCitas] = useState([])
  const [pendientes, setPendientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(null) // null | { type: 'cita'|'pendiente', data: {} }
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(API)
      const d = await r.json()
      setCitas(d.citas || [])
      setPendientes(d.pendientes || [])
    } catch {
      showToast('Error cargando datos', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const callAPI = async (type, data) => {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data })
    })
    return r.json()
  }

  const handleSaveCita = async (data) => {
    try {
      if (data.id) {
        await callAPI('update_cita', data)
        showToast('Cita actualizada ✓')
      } else {
        await callAPI('add_cita', data)
        showToast('Cita añadida ✓')
      }
      await fetchData()
      setEditModal(null)
    } catch {
      showToast('Error guardando cita', 'error')
    }
  }

  const handleDeleteCita = async (id) => {
    try {
      await callAPI('delete_cita', { id })
      showToast('Cita eliminada')
      await fetchData()
      setEditModal(null)
    } catch {
      showToast('Error eliminando cita', 'error')
    }
  }

  const handleSavePendiente = async (data) => {
    try {
      if (data.id) {
        await callAPI('update_pendiente', data)
        showToast('Pendiente actualizado ✓')
      } else {
        await callAPI('add_pendiente', data)
        showToast('Pendiente añadido ✓')
      }
      await fetchData()
      setEditModal(null)
    } catch {
      showToast('Error guardando pendiente', 'error')
    }
  }

  const handleDeletePendiente = async (id) => {
    try {
      await callAPI('delete_pendiente', { id })
      showToast('Pendiente eliminado')
      await fetchData()
      setEditModal(null)
    } catch {
      showToast('Error eliminando pendiente', 'error')
    }
  }

  const handlePinSuccess = () => {
    setIsEditor(true)
    setShowPin(false)
    showToast('Modo edición activado 🔓', 'info')
  }

  const handleLock = () => {
    setIsEditor(false)
    showToast('Modo visualización activado 🔒', 'info')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isEditor={isEditor}
        onLockClick={() => isEditor ? handleLock() : setShowPin(true)}
        pendientesCount={pendientes.length}
      />

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📷</div>
            <div style={{ fontWeight: 600 }}>Cargando agenda...</div>
          </div>
        ) : (
          <>
            {activeTab === 'agenda' && (
              <AgendaView
                citas={citas}
                isEditor={isEditor}
                onNew={(prefill) => setEditModal({ type: 'cita', data: prefill || {} })}
                onEdit={(cita) => setEditModal({ type: 'cita', data: cita })}
              />
            )}
            {activeTab === 'buscar' && (
              <SearchView
                citas={citas}
                pendientes={pendientes}
                isEditor={isEditor}
                onEditCita={(cita) => setEditModal({ type: 'cita', data: cita })}
                onEditPendiente={(p) => setEditModal({ type: 'pendiente', data: p })}
              />
            )}
            {activeTab === 'pendientes' && (
              <PendientesView
                pendientes={pendientes}
                isEditor={isEditor}
                onNew={() => setEditModal({ type: 'pendiente', data: {} })}
                onEdit={(p) => setEditModal({ type: 'pendiente', data: p })}
              />
            )}
          </>
        )}
      </main>

      {showPin && (
        <PinModal
          pin={PIN}
          onSuccess={handlePinSuccess}
          onClose={() => setShowPin(false)}
        />
      )}

      {editModal && (
        <EditModal
          type={editModal.type}
          data={editModal.data}
          onSaveCita={handleSaveCita}
          onDeleteCita={handleDeleteCita}
          onSavePendiente={handleSavePendiente}
          onDeletePendiente={handleDeletePendiente}
          onClose={() => setEditModal(null)}
        />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}
