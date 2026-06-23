export default function Toast({ msg, type = 'success' }) {
  const colors = {
    success: 'var(--green)',
    error: 'var(--red)',
    info: 'var(--blue)'
  }
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: 'var(--dark)', border: `1px solid ${colors[type]}`,
      borderRadius: 10, padding: '12px 20px',
      fontSize: 13, fontWeight: 600, color: 'var(--text)',
      zIndex: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: 8,
      animation: 'slideUp 0.2s ease',
      whiteSpace: 'nowrap'
    }}>
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(10px) } to { opacity: 1; transform: translateX(-50%) translateY(0) } }`}</style>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors[type], flexShrink: 0 }} />
      {msg}
    </div>
  )
}
