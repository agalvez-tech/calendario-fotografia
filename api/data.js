import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const citas = await kv.get('foto:citas') || [];
      const pendientes = await kv.get('foto:pendientes') || [];
      return res.status(200).json({ citas, pendientes });
    }

    if (req.method === 'POST') {
      const { type, data } = req.body;

      if (type === 'add_cita') {
        const citas = await kv.get('foto:citas') || [];
        const nueva = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
        citas.push(nueva);
        await kv.set('foto:citas', citas);
        return res.status(200).json({ success: true, cita: nueva });
      }

      if (type === 'update_cita') {
        const citas = await kv.get('foto:citas') || [];
        const idx = citas.findIndex(c => c.id === data.id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        citas[idx] = { ...citas[idx], ...data, updatedAt: new Date().toISOString() };
        await kv.set('foto:citas', citas);
        return res.status(200).json({ success: true, cita: citas[idx] });
      }

      if (type === 'delete_cita') {
        const citas = await kv.get('foto:citas') || [];
        const filtered = citas.filter(c => c.id !== data.id);
        await kv.set('foto:citas', filtered);
        return res.status(200).json({ success: true });
      }

      if (type === 'add_pendiente') {
        const pendientes = await kv.get('foto:pendientes') || [];
        const nuevo = { ...data, id: Date.now().toString(), createdAt: new Date().toISOString() };
        pendientes.push(nuevo);
        await kv.set('foto:pendientes', pendientes);
        return res.status(200).json({ success: true, pendiente: nuevo });
      }

      if (type === 'update_pendiente') {
        const pendientes = await kv.get('foto:pendientes') || [];
        const idx = pendientes.findIndex(p => p.id === data.id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        pendientes[idx] = { ...pendientes[idx], ...data, updatedAt: new Date().toISOString() };
        await kv.set('foto:pendientes', pendientes);
        return res.status(200).json({ success: true, pendiente: pendientes[idx] });
      }

      if (type === 'delete_pendiente') {
        const pendientes = await kv.get('foto:pendientes') || [];
        const filtered = pendientes.filter(p => p.id !== data.id);
        await kv.set('foto:pendientes', filtered);
        return res.status(200).json({ success: true });
      }

      if (type === 'resolve_pendiente') {
        const pendientes = await kv.get('foto:pendientes') || [];
        const filtered = pendientes.filter(p => p.id !== data.id);
        await kv.set('foto:pendientes', filtered);
        return res.status(200).json({ success: true });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
