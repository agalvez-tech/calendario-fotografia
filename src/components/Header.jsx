export default function Header({ activeTab, setActiveTab, isEditor, onLockClick, pendientesCount }) {
  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: '📅' },
    { id: 'buscar', label: 'Buscar', icon: '🔍' },
    { id: 'pendientes', label: 'Pendientes', icon: '⏳', badge: pendientesCount },
  ]

  return (
    <header style={{
      background: '#1A1A2E',
      borderBottom: '3px solid var(--orange)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            background: 'var(--orange)', color: '#fff',
            fontWeight: 800, fontSize: 14,
            padding: '5px 10px', borderRadius: 6, letterSpacing: 0.5
          }}>RK</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#FFFFFF' }}>Fotografía</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Agenda de sesiones</div>
          </div>
        </div>

        <button onClick={onLockClick} style={{
          background: isEditor ? 'rgba(207,115,27,0.25)' : 'rgba(255,255,255,0.08)',
          border: `1px solid ${isEditor ? 'var(--orange)' : 'rgba(255,255,255,0.2)'}`,
          color: isEditor ? 'var(--orange)' : 'rgba(255,255,255,0.7)',
          borderRadius: 8, padding: '7px 14px',
          fontSize: 12, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'all 0.2s'
        }}>
          {isEditor ? '🔓' : '🔒'}
          {isEditor ? 'Edición activa' : 'Modo lectura'}
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'none', border: 'none',
            borderBottom: `2px solid ${activeTab === tab.id ? 'var(--orange)' : 'transparent'}`,
            color: activeTab === tab.id ? 'var(--orange)' : 'rgba(255,255,255,0.5)',
            padding: '10px 16px 8px',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', transition: 'all 0.15s'
          }}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.badge > 0 && (
              <span style={{
                background: 'var(--orange)', color: '#fff',
                borderRadius: 10, padding: '1px 6px',
                fontSize: 10, fontWeight: 700
              }}>{tab.badge}</span>
            )}
          </button>
        ))}
      </div>
    </header>
  )
}
