# RK Fotografía — App de agenda de sesiones

## Estructura

```
rk-fotografia/
├── api/
│   └── data.js          # Vercel Serverless API + KV storage
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── components/
│       ├── Header.jsx
│       ├── AgendaView.jsx
│       ├── CitaCard.jsx
│       ├── SearchView.jsx
│       ├── PendientesView.jsx
│       ├── EditModal.jsx
│       ├── PinModal.jsx
│       └── Toast.jsx
├── public/
│   └── manifest.json
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

## Despliegue en Vercel

1. Subir repo a GitHub bajo `agalvez-tech`
2. Importar en Vercel → New Project
3. **Añadir Vercel KV:**
   - Vercel Dashboard → Storage → Create Database → KV
   - Conectar al proyecto
   - Variables de entorno se añaden automáticamente (`KV_REST_API_URL`, `KV_REST_API_TOKEN`)
4. Deploy

## PIN de edición
El PIN está definido en `src/App.jsx` como constante `PIN = '1902'`
Para cambiarlo: editar esa línea y redeploy.

## Servicios fotográficos disponibles
- Fotografía
- Vídeo
- Fotografía + Vídeo
- Fotografía aérea
- Tour virtual
- Planos

## Para añadir/quitar agentes
Editar el array `AGENTES` en `src/components/EditModal.jsx`
