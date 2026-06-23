import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      let citas = await kv.get('foto:citas');
      let pendientes = await kv.get('foto:pendientes');
      const initialized = await kv.get('foto:initialized');

      // First run: seed with Excel data
      if (!initialized) {
        const { SEED_CITAS, SEED_PENDIENTES } = await import('../src/seedData.js');
        citas = SEED_CITAS;
        pendientes = SEED_PENDIENTES;
        await kv.set('foto:citas', citas);
        await kv.set('foto:pendientes', pendientes);
        await kv.set('foto:initialized', true);
      }

      return res.status(200).json({ citas: citas || [], pendientes: pendientes || [] });
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
        await kv.set('foto:citas', citas.filter(c => c.id !== data.id));
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
        return res.status(200).json({ success: true });
      }
      if (type === 'delete_pendiente') {
        const pendientes = await kv.get('foto:pendientes') || [];
        await kv.set('foto:pendientes', pendientes.filter(p => p.id !== data.id));
        return res.status(200).json({ success: true });
      }
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
