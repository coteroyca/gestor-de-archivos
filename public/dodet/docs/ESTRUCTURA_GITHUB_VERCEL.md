# Estructura de Carpetas para GitHub + Vercel

## Estructura Recomendada

```
dodet-mesh/
├── README.md                          # Descripción del proyecto (GitHub)
├── .gitignore                         # Archivos a ignorar
├── vercel.json                        # Configuración Vercel (opcional)
├── package.json                       # Metadata del proyecto
├── public/                            # Archivos estáticos
│   ├── index.html                     # Página de inicio (opcional)
│   ├── DODET_v3_JSON_DRIVEN.html      # ← APLICACIÓN PRINCIPAL
│   └── data/                          # ← CARPETA DE DATOS
│       ├── MESH_01_TIENDAS.json
│       ├── MESH_02_TIPOLOGIAS.json
│       ├── MESH_03_ESCENARIOS.json
│       ├── MESH_04_RECOMENDACIONES.json
│       └── MESH_05_KPI.json
├── docs/                              # Documentación
│   ├── REPORTE_ARQUITECTURA_MESH.md
│   ├── GUIA_RAPIDA_MESH.md
│   └── INDICE_ARCHIVOS_GENERADOS.md
└── scripts/                           # Scripts útiles (opcional)
    ├── validate-mesh.js               # Validar integridad MESH
    └── generate-sitemap.js            # Generar sitemap
```

## Alternativa Simplificada (Recomendada para inicio)

```
dodet-mesh/
├── README.md
├── .gitignore
├── vercel.json
├── DODET_v3_JSON_DRIVEN.html          # ← HTML en raíz
├── MESH_01_TIENDAS.json               # ← JSON en raíz
├── MESH_02_TIPOLOGIAS.json
├── MESH_03_ESCENARIOS.json
├── MESH_04_RECOMENDACIONES.json
├── MESH_05_KPI.json
├── REPORTE_ARQUITECTURA_MESH.md       # ← Docs en raíz
├── GUIA_RAPIDA_MESH.md
└── INDICE_ARCHIVOS_GENERADOS.md
```

## Ajuste necesario en HTML

Si usas estructura con `public/data/`, cambia las rutas en DODET_v3_JSON_DRIVEN.html:

### Opción 1: Rutas Relativas (Recomendado)
```javascript
// En DODET_v3_JSON_DRIVEN.html, línea ~320
const [tiendas_data, ...] = await Promise.all([
  fetch('./data/MESH_01_TIENDAS.json').then(r => r.json()),
  // O si JSON está en raíz:
  fetch('./MESH_01_TIENDAS.json').then(r => r.json()),
]);
```

### Opción 2: URLs Absolutas (Para Vercel)
```javascript
const [tiendas_data, ...] = await Promise.all([
  fetch('https://tu-domain.vercel.app/data/MESH_01_TIENDAS.json').then(r => r.json()),
]);
```

**Recomendación:** Usa rutas relativas (Opción 1) = Funciona en desarrollo local y producción.

---

## Actualizar HTML para rutas JSON correctas

Copia este código y reemplaza en `DODET_v3_JSON_DRIVEN.html` alrededor de la línea 320:

```javascript
async function loadAllData() {
  try {
    console.log('Iniciando carga de datos...');
    
    // OPCIÓN A: JSON en carpeta "data/" (estructura con public/)
    const jsonPath = './data/';
    
    // OPCIÓN B: JSON en raíz (estructura simplificada)
    // const jsonPath = './';
    
    const [tiendas_data, tipologias_data, escenarios_data, 
           recomendaciones_data, kpi_data_raw] = await Promise.all([
      fetch(jsonPath + 'MESH_01_TIENDAS.json').then(r => {
        if (!r.ok) throw new Error(`Error cargando MESH_01: ${r.status}`);
        return r.json();
      }),
      fetch(jsonPath + 'MESH_02_TIPOLOGIAS.json').then(r => {
        if (!r.ok) throw new Error(`Error cargando MESH_02: ${r.status}`);
        return r.json();
      }),
      fetch(jsonPath + 'MESH_03_ESCENARIOS.json').then(r => {
        if (!r.ok) throw new Error(`Error cargando MESH_03: ${r.status}`);
        return r.json();
      }),
      fetch(jsonPath + 'MESH_04_RECOMENDACIONES.json').then(r => {
        if (!r.ok) throw new Error(`Error cargando MESH_04: ${r.status}`);
        return r.json();
      }),
      fetch(jsonPath + 'MESH_05_KPI.json').then(r => {
        if (!r.ok) throw new Error(`Error cargando MESH_05: ${r.status}`);
        return r.json();
      })
    ]);

    // Procesar datos (resto del código igual)
    tiendas = tiendas_data.tiendas || [];
    tipologias = tiendas_data.tipologias || {};
    escenarios = escenarios_data.escenarios || [];
    recomendaciones = recomendaciones_data.recomendaciones || {};
    kpi_data = kpi_data_raw || {};

    console.log(`✓ Cargadas ${tiendas.length} tiendas`);
    console.log(`✓ Cargadas ${Object.keys(tipologias).length} tipologías`);

    clasificarTiendas();
    switchView('resumen');
  } catch (error) {
    console.error('Error cargando datos:', error);
    document.getElementById('mainContent').innerHTML = 
      `<div class="error"><i class="fas fa-exclamation-circle"></i> Error: ${error.message}</div>`;
  }
}
```
