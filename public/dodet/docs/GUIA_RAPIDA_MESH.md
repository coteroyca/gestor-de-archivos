# GUÍA RÁPIDA - ARQUITECTURA MESH DODET v3
## Para implementadores y stakeholders

---

## ⚡ TL;DR (2 minutos)

**¿Qué es MESH?**  
5 archivos JSON que codifican toda la lógica de gestión operacional de tiendas minoristas.

**¿Cuáles son?**
| # | MESH | Qué Contiene | Registros |
|---|------|-------------|-----------|
| 1 | TIENDAS | 24 tiendas + sus métricas | 24 |
| 2 | TIPOLOGIAS | 4 cuadrantes estratégicos | 4 |
| 3 | ESCENARIOS | 7 intervenciones posibles | 7 |
| 4 | RECOMENDACIONES | 24 acciones priorizadas | 24 |
| 5 | KPI | 17 indicadores de medición | 17+ |

**¿Cómo funciona?**
```
TIENDAS (datos) 
  ↓
TIPOLOGIAS (clasificación)
  ↓ 
ESCENARIOS (intervención)
  ↓
RECOMENDACIONES (acciones)
  ↓
KPI (medición → validación)
```

**¿Qué ganas?**
- ✅ Modificar datos sin tocar código
- ✅ Agregar tiendas en minutos
- ✅ Escalar a 100+ tiendas sin cambios
- ✅ APIs listas para integración
- ✅ Self-documenting (metadatos incluidos)

---

## 📦 Los 5 MESH - Especificación Técnica

### MESH_01: TIENDAS
**Archivo:** `MESH_01_TIENDAS.json` (~45 KB)

**Contiene:** Base de datos de tiendas y sus métricas operacionales

**Estructura mínima:**
```json
{
  "metadata": { "mesh_id": "MESH_01", "total_stores": 24 },
  "tiendas": [
    {
      "id": "T001",
      "nombre": "Plaza Centro",
      "lat": 10.4806, "lng": -66.9036,
      "salud": 92,
      "resiliencia": 88,
      "potencial": 95,
      "margen_bruto": 32.5,
      "ticket_promedio": 145.80,
      "rotacion_inventario": 18,
      "ocupacion_personal": 92,
      "satisfaccion_cliente": 94
    }
  ]
}
```

**Clave:** `tipoCalculado` se genera en tiempo real usando MESH_02

**Usar cuándo:**
- ¿Cuántas tiendas JOYA tenemos?
- ¿Cuál es el margen promedio?
- ¿Dónde está Tienda X?

---

### MESH_02: TIPOLOGIAS
**Archivo:** `MESH_02_TIPOLOGIAS.json` (~12 KB)

**Contiene:** Las 4 tipologías estratégicas + reglas de clasificación

**Las 4 Tipologías:**
```
JOYA (↗)       = Alto rendimiento, máximo potencial → EXPANDIR
APUESTA (→)    = Potencial de mejora → MEJORAR
BUNKER (←)     = En defensa, estabilizar → DEFENDER
LASTRE (↙)     = En crisis, decisión inmediata → DECIDIR
```

**Reglas de Clasificación (aplicadas en orden):**
1. Si `salud < 40` → LASTRE (sin excepciones)
2. Si `salud ≥ 80 AND margen ≥ 30` → JOYA
3. Si `60 ≤ salud < 80` → APUESTA
4. Si `40 ≤ salud < 60` → BUNKER

**Estructura:**
```json
{
  "tipologias": {
    "JOYA": {
      "nombre": "JOYA",
      "icono": "💎",
      "color": "#00C853",
      "criterios": { "salud_min": 80, "margen_bruto_min": 30 },
      "estrategia": "POTENCIAR: Invertir en expansión...",
      "acciones_prioritarias": [ "Expansion", "Fidelizacion", ... ]
    }
  },
  "reglas_clasificacion": { ... }
}
```

**Usar cuándo:**
- ¿Por qué esta tienda es JOYA?
- ¿Qué hacemos con BUNKER?
- ¿Criterios de clasificación?

---

### MESH_03: ESCENARIOS
**Archivo:** `MESH_03_ESCENARIOS.json` (~28 KB)

**Contiene:** 7 escenarios de intervención + impacto proyectado

**Los 7 Escenarios:**

| Escenario | Target | Inversión | ROI | Meses |
|-----------|--------|-----------|-----|-------|
| Base | Ninguno | $0 | N/A | 0 |
| Apuesta Optimiza | APUESTA | $45K | 3.2x | 8 |
| Joya Expansion | JOYA | $180K | 2.1x | 12 |
| Bunker Defensa | BUNKER | $25K | 1.8x | 6 |
| Lastre Decision | LASTRE | $15K | Ahorro | 12 |
| Bunker Transform | BUNKER | $95K | 2.5x | 18 |
| Network Optimiz | RED | $360K | 3.8x | 18 |

**Estructura:**
```json
{
  "escenarios": [
    {
      "id": "SCENARIO_APUESTA_OPTIMIZA",
      "nombre": "Apuesta: Optimización Operacional",
      "tipo": "optimizacion",
      "target": ["APUESTA"],
      "modificadores": {
        "salud_delta": 12,
        "margen_bruto_delta": 2.5,
        "ticket_promedio_delta": 15
      },
      "duracion_meses": 8,
      "inversion_usd": 45000,
      "roi_esperado": 3.2,
      "acciones_clave": [ ... ]
    }
  ]
}
```

**Usar cuándo:**
- ¿Cuánto costará mejorar Plaza Centro?
- ¿Qué ROI esperamos?
- ¿Cuánto tiempo toma?

---

### MESH_04: RECOMENDACIONES
**Archivo:** `MESH_04_RECOMENDACIONES.json` (~32 KB)

**Contiene:** 24 acciones concretas, priorizadas, presupuestadas

**Estructura por tipología:**
```json
{
  "JOYA": {
    "descripcion_estrategia": "POTENCIAR: Expandir...",
    "acciones": [
      {
        "accion_id": "JOYA_REC_001",
        "accion_nombre": "Expansión de surtido premium",
        "prioridad": 1,
        "descripcion": "Agregar líneas premium...",
        "objetivo_kpi": "Ticket Promedio",
        "meta_numerica": "+25%",
        "duracion_semanas": 4,
        "presupuesto_usd": 8500,
        "responsable_rol": "Gerente Categoría Premium",
        "roi_proyectado": 4.2,
        "metricas_seguimiento": [ ... ]
      }
    ]
  },
  "APUESTA": { ... },
  "BUNKER": { ... },
  "LASTRE": { ... }
}
```

**Velocidad de acción:**
- **RÁPIDO** (2-4 sem): Quick wins, impacto inmediato
- **MEDIO** (5-12 sem): Intervenciones estructurales  
- **LARGO** (13+ sem): Transformaciones profundas

**Usar cuándo:**
- ¿Qué hacer con Tienda X?
- ¿Cuánto presupuestar?
- ¿A quién asignar?
- ¿Qué KPI seguir?

---

### MESH_05: KPI
**Archivo:** `MESH_05_KPI.json` (~24 KB)

**Contiene:** 17 KPIs + fórmulas + benchmarks

**3 Pilares:**

```
SALUD (Rendimiento, 40%)
├─ Margen Bruto (25%)           Fórmula: (Ventas - Costo) / Ventas
├─ Rotación Inventario (20%)    Fórmula: 365 / (Inv Prom / COGS)
├─ Ticket Promedio (15%)        Fórmula: Ventas / Transacciones
├─ Cumplimiento Horarios (10%)  Fórmula: Apertura puntual %
├─ Stock-outs (10%)             Fórmula: 1 - Items disponibles %
└─ Devoluciones (10%)           Fórmula: Unidades devueltas %

RESILIENCIA (Adaptabilidad, 30%)
├─ Ocupación Personal (20%)     Fórmula: Horas disponibles / programadas
├─ Satisfacción NPS (25%)       Fórmula: % Promotores - % Detractores
├─ Retención Personal (20%)     Fórmula: 1 - Rotación personal %
├─ Productividad FTE (20%)      Fórmula: Ventas/mes / # FTE
└─ Cumplimiento Presupuesto (15%) Fórmula: Ventas reales / Presupuestadas

POTENCIAL (Crecimiento, 30%)
├─ Crecimiento YoY (25%)        Fórmula: (Ventas N - N-1) / N-1
├─ Penetración Nuevas Zonas (15%) Fórmula: Ventas zonas nuevas / Total
├─ Frecuencia de Compra (20%)   Fórmula: Transacciones / Clientes únicos
├─ Capacidad de Línea (20%)     Fórmula: Espacio rentable / Total
└─ Share vs Competencia (20%)   Fórmula: Ventas cat tienda / cat mercado
```

**Estructura:**
```json
{
  "indicadores_salud": {
    "peso_total": 100,
    "salud": [
      {
        "kpi_id": "SALUD_001",
        "kpi_nombre": "Margen Bruto",
        "metrica_base": "(Ventas - Costo) / Ventas",
        "frecuencia": "Diaria",
        "peso": 25,
        "benchmark": {
          "excelente": { "min": 31, "max": 100 },
          "bueno": { "min": 28, "max": 30.9 },
          "aceptable": { "min": 24, "max": 27.9 },
          "pobre": { "min": 0, "max": 23.9 }
        }
      }
    ]
  }
}
```

**KPIs Críticos (Monitoreo Diario):**
- Ventas Diarias: JOYA >$4.5K | APUESTA $3.2-4.2K | BUNKER $2.2-3.1K | LASTRE <$2.2K
- Margen Diario: JOYA >31% | APUESTA 28-30% | BUNKER 23-27% | LASTRE <23%
- Ticket Promedio: JOYA >$135 | APUESTA $115-130 | BUNKER $85-110 | LASTRE <$85

**Usar cuándo:**
- ¿Qué medir en tienda?
- ¿Cómo se calcula?
- ¿Qué es "bueno"?
- ¿Con qué frecuencia?

---

## 🔄 FLUJO DE USO

### Escenario: Nueva decisión sobre Tienda X

```
PASO 1: CONSULTAR MESH_01
  └─ ¿Cuál es el estado actual de Tienda X?
  └─ Salud: 72, Margen: 28%, Ticket: $120

PASO 2: CONSULTAR MESH_02
  └─ ¿En qué cuadrante está?
  └─ Reglas: 60 ≤ 72 < 80 → APUESTA
  └─ Estrategia: MEJORAR

PASO 3: CONSULTAR MESH_03
  └─ ¿Qué intervenciones aplican?
  └─ SCENARIO_APUESTA_OPTIMIZA: $45K, 8 meses, ROI 3.2x

PASO 4: CONSULTAR MESH_04
  └─ ¿Qué hacer específicamente?
  └─ 5 acciones: Auditoría (P1), Planograma (P1), Incentivos (P1), ...

PASO 5: CONSULTAR MESH_05
  └─ ¿Qué métricas seguir?
  └─ Margen (Diario), Ticket (Diario), Rotación (Mensual), NPS (Mensual)

PASO 6: DECISIÓN
  └─ Implementar SCENARIO_APUESTA_OPTIMIZA
  └─ Presupuestar $45K
  └─ Asignar responsables
  └─ Hacer seguimiento semanal vs MESH_05

PASO 7: REVISIÓN (Mes 3)
  └─ Comparar vs baseline
  └─ ¿Vamos al 33% del progreso esperado?
  └─ ¿Ajustar plan?
```

---

## 🛠️ INTEGRACIÓN TÉCNICA

### Carga de datos en tu aplicación

```javascript
// Cargar todos los MESH
async function loadMESH() {
  const tiendas = await fetch('MESH_01_TIENDAS.json').then(r => r.json());
  const tipologias = await fetch('MESH_02_TIPOLOGIAS.json').then(r => r.json());
  const escenarios = await fetch('MESH_03_ESCENARIOS.json').then(r => r.json());
  const recomendaciones = await fetch('MESH_04_RECOMENDACIONES.json').then(r => r.json());
  const kpi = await fetch('MESH_05_KPI.json').then(r => r.json());
  
  return { tiendas, tipologias, escenarios, recomendaciones, kpi };
}

// Clasificar tienda
function clasificarTienda(tienda, tipologias_config) {
  if (tienda.salud < 40) return 'LASTRE';
  if (tienda.salud >= 80 && tienda.margen_bruto >= 30) return 'JOYA';
  if (tienda.salud >= 60 && tienda.salud < 80) return 'APUESTA';
  return 'BUNKER';
}

// Obtener recomendaciones
function getRecomendaciones(tipologia, recomendaciones_data) {
  return recomendaciones_data.recomendaciones[tipologia].acciones;
}

// Calcular KPI (ejemplo)
function calcularMargenBruto(ventas, costos) {
  return (ventas - costos) / ventas * 100;
}
```

### Validar integridad de MESH

```javascript
function validarMESH(mesh_data) {
  const checks = [
    mesh_data.metadata?.mesh_id,
    mesh_data.metadata?.version,
    Array.isArray(mesh_data.tiendas || mesh_data.tipologias || mesh_data.escenarios)
  ];
  
  return checks.every(c => !!c);
}
```

---

## 📊 COMPARACIÓN CON ALTERNATIVAS

### MESH vs Hardcoded Data vs Base de Datos

| Criterio | MESH JSON | Hardcoded | DB SQL |
|----------|-----------|----------|--------|
| **Setup** | 5 minutos | Horas | Días |
| **Escalabilidad** | Infinita | Limitada | Alta |
| **No-code** | ✅ SÍ | ❌ NO | ❌ NO |
| **Control de cambios** | ✅ Git | ❌ Código | ✅ SQL migrations |
| **APIs listas** | ✅ SÍ | ❌ NO | ❌ Requiere backend |
| **Offline** | ✅ SÍ | ✅ SÍ | ❌ NO |
| **Documentación** | ✅ Self-doc | ❌ NO | ✅ Schema |
| **Prototipado** | ✅ Rápido | ✅ Rápido | ❌ Lento |

---

## 🚀 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Descargar los 5 archivos MESH
- [ ] Validar JSON sintaxis (JSONLint)
- [ ] Verificar metadata en cada MESH
- [ ] Cargar en tu aplicación (fetch o require)
- [ ] Implementar clasificación MESH_01 + MESH_02
- [ ] Renderizar MESH_02 cuadrantes
- [ ] Renderizar MESH_04 recomendaciones
- [ ] Mostrar MESH_05 KPIs de seguimiento
- [ ] Prueba end-to-end
- [ ] Documentar cambios locales

---

## ❓ FAQ

**P: ¿Puedo agregar más tiendas?**  
R: SÍ, agrega líneas a MESH_01. No requiere cambios de código.

**P: ¿Puedo modificar las tipologías?**  
R: SÍ, edita MESH_02. Los cambios aplican automáticamente.

**P: ¿Puedo agregar nuevas acciones?**  
R: SÍ, agrega objetos a MESH_04 bajo la tipología correspondiente.

**P: ¿Puedo integrar con mi POS?**  
R: SÍ, reemplaza valores de MESH_01 con datos de tu POS (ETL).

**P: ¿Qué herramientas necesito?**  
R: Solo un navegador + editor de texto. No requiere servidor.

**P: ¿Puedo versionarlo?**  
R: SÍ, Git funciona perfectamente con JSON.

---

## 📞 SOPORTE

- **Validar JSON:** https://jsonlint.com
- **Documentación completa:** `REPORTE_ARQUITECTURA_MESH.md`
- **Especificación HTML:** `DODET_v3_JSON_DRIVEN.html`

---

**Versión:** 3.0 | Fecha: 2026-01-15 | Licencia: Open Source
