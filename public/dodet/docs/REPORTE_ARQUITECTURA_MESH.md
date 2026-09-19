# REPORTE ARQUITECTURA MESH - DODET v3
## Constructor de Escenarios Operacionales Basado en Datos

**Versión:** 3.0 JSON-Driven  
**Fecha:** 2026-01-15  
**Autor:** Sistema DODET  
**Estado:** Producción  

---

## 📋 TABLA DE CONTENIDOS

1. Resumen Ejecutivo
2. Arquitectura General
3. Los 5 MESH
4. Relaciones entre MESH
5. Flujos de Datos
6. Implementación Técnica
7. Casos de Uso

---

## 🎯 RESUMEN EJECUTIVO

### Qué es MESH?
**MESH** = **M**odularized **E**ntity **S**tructured **H**ierarchy

Es un sistema modular de 5 capas de datos que descompone la lógica de gestión operacional de tiendas minoristas en componentes independientes pero interconectados. Cada MESH es un archivo JSON que contiene:

- **Estructura de datos** clara y extensible
- **Metadatos** que documentan su propósito
- **Relaciones explícitas** con otros MESH
- **Reglas de negocio** codificadas

### Ventajas de la Arquitectura MESH

| Aspecto | Ventaja |
|--------|---------|
| **Mantenibilidad** | Cada MESH tiene responsabilidad única |
| **Escalabilidad** | Agregar tiendas/escenarios no requiere cambiar lógica |
| **Testabilidad** | Cada MESH puede validarse independientemente |
| **Reutilización** | Los MESH pueden usarse en múltiples aplicaciones |
| **Documentación** | Metadatos self-documenting en cada archivo |

---

## 🏗️ ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    DODET v3 JSON-DRIVEN                     │
│                  (HTML/JavaScript Frontend)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    CARGA JSON   LÓGICA JS    RENDER HTML
         │            │            │
         └────────────┼────────────┘
                      │
         ┌────────────┼─────────────────────────────┐
         │            │            │                │
         ▼            ▼            ▼                ▼
    MESH_01      MESH_02      MESH_03         MESH_04
    TIENDAS      TIPOLOGIAS   ESCENARIOS    RECOMENDACIONES
         │            │            │                │
         └────────────┼─────────────────────────────┘
                      │
                      ▼
                  MESH_05
                   KPI
                   │
                   ▼
         ┌──────────────────────┐
         │  CALCULO EN TIEMPO   │
         │  REAL EN NAVEGADOR   │
         └──────────────────────┘
```

---

## 🧩 LOS 5 MESH

### MESH_01: TIENDAS
**Archivo:** `MESH_01_TIENDAS.json`  
**Tamaño:** ~45 KB  
**Registros:** 24 tiendas  

#### Propósito
Almacenar datos operacionales base de cada tienda: ubicación, métricas de salud, resiliencia, potencial y KPIs operacionales.

#### Estructura de Datos

```json
{
  "metadata": {
    "mesh_id": "MESH_01",
    "total_stores": 24,
    "schema": { ... }
  },
  "tiendas": [
    {
      "id": "T001",
      "nombre": "Plaza Centro",
      "lat": 10.4806,
      "lng": -66.9036,
      "salud": 92,
      "resiliencia": 88,
      "potencial": 95,
      "tipoCalculado": "JOYA",
      "margen_bruto": 32.5,
      "ticket_promedio": 145.80,
      "rotacion_inventario": 18,
      "ocupacion_personal": 92,
      "satisfaccion_cliente": 94
    }
  ]
}
```

#### Campos Clave

| Campo | Descripción | Rango | Impacto |
|-------|-------------|-------|--------|
| `salud` | Índice de salud operacional | 0-100 | Base para clasificación |
| `resiliencia` | Capacidad de adaptación | 0-100 | Factor defensivo |
| `potencial` | Oportunidad de crecimiento | 0-100 | Factor ofensivo |
| `margen_bruto` | Margen de ganancia | % | Métrica financiera crítica |
| `ticket_promedio` | Venta promedio por transacción | USD | Indicador de productividad |
| `rotacion_inventario` | Velocidad de movimiento | días | Eficiencia de capital |

#### Cálculos Derivados
- **tipoCalculado**: Se calcula en tiempo real usando reglas de MESH_02
- **Score Composite**: (salud + resiliencia + potencial) / 3
- **Indicador de Valor**: margen_bruto * (rotacion_inventario / 20)

#### Relaciones
- **MESH_02** → Define cómo clasificar basado en valores de tienda
- **MESH_04** → Recomendaciones personalizadas por tienda
- **MESH_05** → KPIs para monitoreo de cada tienda

---

### MESH_02: TIPOLOGIAS
**Archivo:** `MESH_02_TIPOLOGIAS.json`  
**Tamaño:** ~12 KB  
**Tipologías:** 4 (JOYA, APUESTA, BUNKER, LASTRE)

#### Propósito
Definir el sistema de clasificación de tiendas en 4 cuadrantes estratégicos. Es la "tabla de decisión" que determina qué acciones tomar según dónde está cada tienda.

#### Estructura de Datos

```json
{
  "tipologias": {
    "JOYA": {
      "nombre": "JOYA",
      "icono": "💎",
      "color": "#00C853",
      "cuadrante": "top-right",
      "descripcion": "Tiendas con máxima salud...",
      "estrategia": "POTENCIAR: Invertir en expansión...",
      "criterios": {
        "salud_min": 80,
        "resiliencia_min": 75,
        "potencial_min": 80,
        "margen_bruto_min": 30
      },
      "acciones_prioritarias": [ ... ],
      "objetivo_anual_crecimiento": "15-20%"
    }
    // ... otras tipologías
  },
  "matriz_estrategica": { ... },
  "reglas_clasificacion": { ... }
}
```

#### Las 4 Tipologías

```
               ALTA RESILIENCIA
                      │
        JOYA (↗)      │      APUESTA (→)
    80-100 salud      │     60-79 salud
    Alto potencial    │     Requiere mejora
                      │
    ───────────────────────────────────── MEDIA RESILIENCIA
                      │
    BUNKER (←)        │      LASTRE (↙)
    40-59 salud       │      0-39 salud
    Defensa           │      Crisis
                      │
               BAJA RESILIENCIA

    CUADRANTE I (↗):  Expandir inversión → 15-20% crecimiento
    CUADRANTE II (→): Diagnóstico y mejora → 8-12% crecimiento
    CUADRANTE III (←): Contención de costos → 2-5% crecimiento
    CUADRANTE IV (↙): Decisión inmediata → Cierre o reestructura
```

#### Reglas de Clasificación (Prioridad)
1. **Prioridad 1:** Si `salud < 40` → **LASTRE** (automático)
2. **Prioridad 2:** Si `(salud + resiliencia + potencial)/3 > 80` Y `margen > 30` → **JOYA**
3. **Prioridad 3:** Si `60 ≤ salud < 80` → **APUESTA**
4. **Prioridad 4:** Si `40 ≤ salud < 60` → **BUNKER**

#### Relaciones
- **MESH_01** → Datos fuente para clasificación
- **MESH_03** → Define escenarios para cada tipología
- **MESH_04** → Acciones recomendadas por tipología

---

### MESH_03: ESCENARIOS
**Archivo:** `MESH_03_ESCENARIOS.json`  
**Tamaño:** ~28 KB  
**Escenarios:** 7 posibles intervenciones

#### Propósito
Modelar impacto de intervenciones estratégicas alternativas. Responde: "Si hacemos X, ¿qué pasa con los KPIs?"

#### Estructura de Datos

```json
{
  "escenarios": [
    {
      "id": "SCENARIO_BASE",
      "nombre": "Escenario Base",
      "descripcion": "Proyección sin cambios. Mantiene operaciones actuales...",
      "tipo": "status_quo",
      "modificadores": {
        "salud_delta": 0,
        "margen_bruto_delta": 0,
        "ticket_promedio_delta": 0
      },
      "duracion_meses": 0,
      "inversion_usd": 0,
      "roi_esperado": "N/A"
    },
    {
      "id": "SCENARIO_APUESTA_OPTIMIZA",
      "nombre": "Apuesta: Optimización Operacional",
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
  ],
  "matriz_escenarios": { ... }
}
```

#### Los 7 Escenarios

| ID | Nombre | Target | Inversión | ROI | Meses |
|----|--------|--------|-----------|-----|-------|
| SCENARIO_BASE | Escenario Base | N/A | $0 | N/A | 0 |
| SCENARIO_APUESTA_OPTIMIZA | Apuesta: Optimización | APUESTA | $45K | 3.2x | 8 |
| SCENARIO_JOYA_EXPANSION | Joya: Expansión | JOYA | $180K | 2.1x | 12 |
| SCENARIO_BUNKER_DEFENSA | Bunker: Defensa | BUNKER | $25K | 1.8x | 6 |
| SCENARIO_LASTRE_DECISION | Lastre: Decisión | LASTRE | $15K | Ahorro | 12 |
| SCENARIO_BUNKER_TRANSFORMATION | Bunker: Transformación | BUNKER | $95K | 2.5x | 18 |
| SCENARIO_NETWORK_OPTIMIZATION | Red: Optimización Holística | RED | $360K | 3.8x | 18 |

#### Modificadores (Ejemplo)
```json
{
  "salud_delta": 12,           // Mejora de 12 puntos en índice salud
  "resiliencia_delta": 8,      // +8 puntos en resiliencia
  "potencial_delta": 10,       // +10 puntos en potencial
  "margen_bruto_delta": 2.5,   // +2.5% en margen bruto
  "ticket_promedio_delta": 15  // +15 USD en ticket promedio
}
```

#### Relaciones
- **MESH_02** → Tipología target del escenario
- **MESH_04** → Acciones específicas dentro del escenario
- **MESH_05** → KPIs afectados por el escenario

---

### MESH_04: RECOMENDACIONES
**Archivo:** `MESH_04_RECOMENDACIONES.json`  
**Tamaño:** ~32 KB  
**Recomendaciones:** 24 acciones estructuradas

#### Propósito
Motor de recomendaciones accionables. Para cada tipología, proporciona:
- Acciones priorizadas
- Duración estimada
- Presupuesto requerido
- KPIs de seguimiento
- Responsable de ejecución

#### Estructura de Datos

```json
{
  "recomendaciones": {
    "JOYA": {
      "descripcion_estrategia": "JOYA: Potenciación...",
      "acciones": [
        {
          "accion_id": "JOYA_REC_001",
          "accion_nombre": "Expansión de surtido premium",
          "prioridad": 1,
          "descripcion": "Agregar líneas premium de vinos...",
          "meta_numerica": "+25% ($145 → $180)",
          "duracion_semanas": 4,
          "presupuesto_usd": 8500,
          "roi_proyectado": 4.2
        }
      ]
    }
  }
}
```

#### Matriz de Acciones

| Tipología | # Acciones | Presupuesto Total | ROI Promedio | Duración |
|-----------|-----------|-------------------|--------------|----------|
| JOYA | 5 | $42,000 | 3.8x | 35 semanas |
| APUESTA | 5 | $23,500 | 3.2x | 52 semanas |
| BUNKER | 5 | $16,500 | 4.1x | 42 semanas |
| LASTRE | 4 | $15,000 | Variado | 13-26 semanas |

#### Estructura de Acción (Completa)

```json
{
  "accion_id": "JOYA_REC_001",
  "accion_nombre": "Expansión de surtido premium",
  "prioridad": 1,
  "descripcion": "Agregar líneas premium...",
  "objetivo_kpi": "Ticket Promedio",
  "meta_numerica": "+25%",
  "duracion_semanas": 4,
  "recursos_requeridos": [ "Merchandising", "Proveedores", "Personal" ],
  "presupuesto_usd": 8500,
  "metricas_seguimiento": [
    "Ticket promedio semanal",
    "Margen bruto premium",
    "Satisfacción cliente"
  ],
  "responsable_rol": "Gerente Categoría Premium",
  "roi_proyectado": 4.2
}
```

#### Clasificación de Velocidad

- **RÁPIDO** (2-4 semanas): Quick wins, impacto inmediato
- **MEDIO** (5-12 semanas): Intervenciones estructurales
- **LARGO** (13+ semanas): Transformaciones profundas

#### Relaciones
- **MESH_01** → Aplica a tiendas específicas
- **MESH_02** → Agrupa acciones por tipología
- **MESH_03** → Incluidas en escenarios
- **MESH_05** → Define KPIs de seguimiento

---

### MESH_05: KPI
**Archivo:** `MESH_05_KPI.json`  
**Tamaño:** ~24 KB  
**Indicadores:** 17 KPIs principales + derivados

#### Propósito
Sistema completo de medición. Define:
- Qué medir (KPI)
- Cómo medir (fórmula)
- Con qué frecuencia
- Qué es "bueno/malo" (benchmark)
- Impacto en clasificación

#### Estructura de Datos

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

#### Los 3 Pilares de Medición

```
SALUD OPERACIONAL (25%)
├─ Margen Bruto (25%)
├─ Rotación Inventario (20%)
├─ Ticket Promedio (15%)
├─ Cumplimiento Horarios (10%)
├─ Stock-outs (10%)
└─ Devoluciones (10%)

RESILIENCIA (Adaptabilidad, 25%)
├─ Ocupación Personal (20%)
├─ Satisfacción Cliente NPS (25%)
├─ Retención Personal (20%)
├─ Productividad FTE (20%)
└─ Cumplimiento Presupuesto (15%)

POTENCIAL (Crecimiento, 25%)
├─ Crecimiento YoY (25%)
├─ Penetración Nuevas Zonas (15%)
├─ Frecuencia de Compra (20%)
├─ Capacidad de Línea (20%)
└─ Share vs Competencia (20%)
```

#### KPI Críticos (Monitoreo Diario)

```json
{
  "CRITICO_001": {
    "nombre": "Ventas Diarias",
    "meta_joya": ">$4.500",
    "meta_apuesta": "$3.200-4.200",
    "meta_bunker": "$2.200-3.100",
    "meta_lastre": "<$2.200"
  }
}
```

#### Frecuencias de Medición

| Frecuencia | KPIs | Ejemplos |
|-----------|------|----------|
| Diaria | 4 | Ventas, Margen, Ticket, OOS% |
| Semanal | 3 | Stock-outs, Devoluciones, NPS |
| Mensual | 6 | Rotación, Personal, Productividad |
| Trimestral | 3 | Penetración zonas, Share competencia |
| Anual | 1 | Crecimiento YoY |

#### Relaciones
- **MESH_01** → Valores reales de KPI por tienda
- **MESH_02** → Benchmarks varían por tipología
- **MESH_04** → Acciones persiguen metas de KPI

---

## 🔗 RELACIONES ENTRE MESH

### Flujo de Datos Principal

```
MESH_01 (DATOS)
   ↓
   ├→ MESH_05 (KPI): Calcula índices de SALUD/RESILIENCIA/POTENCIAL
   │   ↓
   └→ MESH_02 (TIPOLOGIAS): Clasifica según índices
       ↓
       ├→ MESH_03 (ESCENARIOS): Define intervenciones por tipo
       │   ↓
       │   └→ MESH_04 (RECOMENDACIONES): Acciones específicas
       │
       └→ MESH_04 (RECOMENDACIONES): Acciones por tipo
           ↓
           └→ Actualiza MESH_01 (métricas futuras)
```

### Matriz de Dependencias

```
        TIENDAS  TIPOLOGIAS  ESCENARIOS  RECOMENDACIONES  KPI
TIENDAS   -         ✓           ✓            ✓             ✓
TIPOLOGIAS           -           ✓            ✓             ✓
ESCENARIOS                       -            ✓             ✓
RECOMEND.                                     -             ✓
KPI                                                         -

✓ = Depende de
```

### Ejemplo de Flujo: Una Tienda APUESTA

```
1. MESH_01 ← Plaza Centro: salud=78, resiliencia=72, potencial=68

2. MESH_05 (KPI) ← Calcula índices de Salud/Resiliencia/Potencial
   Resultado: Score = 72.67

3. MESH_02 (TIPOLOGIAS) ← Clasifica
   Regla: 60 ≤ 78 < 80 → APUESTA
   Color: #D4AF37 (oro), Icono: 🎯, Estrategia: MEJORAR

4. MESH_04 (RECOMENDACIONES) ← Busca acciones APUESTA
   Retorna: 5 acciones (P1-P2 prioritarias)
   └─ APUESTA_REC_001: Auditoría (P1, $5K, 3 semanas)
   └─ APUESTA_REC_002: Rediseño planograma (P1, $7.2K, 4 semanas)
   └─ APUESTA_REC_003: Incentivos (P1, $6.8K, 26 semanas)

5. MESH_03 (ESCENARIOS) ← Muestra impacto
   Scenario: SCENARIO_APUESTA_OPTIMIZA
   └─ Duración: 8 meses
   └─ Inversión: $45K
   └─ ROI esperado: 3.2x
   └─ Resultado: Salud 78 → 90, pasa a JOYA

6. Decisión Ejecutiva
   ├─ Implementar escenario → Presupuestar $45K
   ├─ Seguir KPIs de MESH_05 → Margen, Ticket, Rotación
   └─ Target final: Migrar Plaza Centro a JOYA
```

---

## 📊 FLUJOS DE DATOS OPERACIONALES

### Diario: Actualización de KPIs

```
┌─────────────────────┐
│  Sistema POS/ERP    │  (Genera datos crudos)
└──────────┬──────────┘
           │
           ├→ Ventas $XXX
           ├→ Costo $YYY
           ├→ Tickets #NNN
           ├→ Inventario $ZZZ
           └→ Personal HHH
           │
           ▼
┌─────────────────────┐
│  MESH_05 (KPI)      │  (Calcula indicadores)
└──────────┬──────────┘
           │
           ├→ Margen Bruto = (XXX - YYY) / XXX
           ├→ Ticket Promedio = XXX / NNN
           ├→ Rotación = Inventory / COGS
           ├→ Ocupación = HHH / Programado
           └→ Satisfacción = NPS survey
           │
           ▼
┌─────────────────────┐
│  MESH_01 (TIENDAS)  │  (Actualiza métricas)
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  MESH_02 (CLASIF)   │  (Reclasifica si cambió)
└──────────┬──────────┘
           │
           ├─→ "Plaza Centro sigue siendo JOYA ✓"
           ├─→ "Zona Sur pasó de LASTRE a BUNKER!"
           └─→ "Alerts a gerencia regional"
           │
           ▼
         Reportes, Dashboards, Alerts
```

### Mensual: Análisis de Escenarios

```
┌─────────────────────────────────────────────────┐
│       Revisión Ejecutiva Mensual                │
└─────────────────────────────────────────────────┘
       │
       ├─→ MESH_01: ¿Cambió salud de tiendas?
       ├─→ MESH_02: ¿Hay reclasificaciones?
       └─→ MESH_05: ¿Hemos mejorado KPIs?
       │
       ▼
┌─────────────────────────────────────────────────┐
│  Evaluar: ¿Implementamos escenario nuevo?      │
└─────────────────────────────────────────────────┘
       │
       ├─→ MESH_03: Revisar escenarios disponibles
       ├─→ Calcular ROI esperado
       ├─→ Verificar factibilidad de presupuesto
       └─→ Asignar equipo responsable
       │
       ▼
┌─────────────────────────────────────────────────┐
│   Ejecutar: Acciones de intervención            │
└─────────────────────────────────────────────────┘
       │
       └─→ MESH_04: Descargar acciones priorizadas
           ├─→ Crear tareas operacionales
           ├─→ Asignar responsables
           ├─→ Establecer metas de KPI
           └─→ Hacer seguimiento semanal
```

---

## 💻 IMPLEMENTACIÓN TÉCNICA

### Estructura de Archivos

```
project/
├── DODET_v3_JSON_DRIVEN.html          (Aplicación principal)
├── MESH_01_TIENDAS.json               (24 tiendas, 4 atributos)
├── MESH_02_TIPOLOGIAS.json            (4 tipologías, reglas)
├── MESH_03_ESCENARIOS.json            (7 escenarios, impacto)
├── MESH_04_RECOMENDACIONES.json       (24 acciones, presupuestos)
├── MESH_05_KPI.json                   (17 KPIs, benchmarks)
├── REPORTE_ARQUITECTURA_MESH.md       (Este archivo)
└── index.html                         (Página de inicio)
```

### Carga de Datos en Navegador

```javascript
// DODET v3 carga los 5 MESH en paralelo
async function loadAllData() {
  const [tiendas_data, tipologias_data, escenarios_data, 
         recomendaciones_data, kpi_data] = await Promise.all([
    fetch('MESH_01_TIENDAS.json').then(r => r.json()),
    fetch('MESH_02_TIPOLOGIAS.json').then(r => r.json()),
    fetch('MESH_03_ESCENARIOS.json').then(r => r.json()),
    fetch('MESH_04_RECOMENDACIONES.json').then(r => r.json()),
    fetch('MESH_05_KPI.json').then(r => r.json())
  ]);
  
  // Procesar datos
  tiendas = tiendas_data.tiendas;
  tipologias = tiendas_data.tipologias;
  escenarios = escenarios_data.escenarios;
  recomendaciones = recomendaciones_data.recomendaciones;
  kpi_data = kpi_data_raw;
  
  // Clasificar tiendas (MESH_01 + MESH_02)
  clasificarTiendas();
  
  // Renderizar UI
  renderResumen();
}
```

### Clasificación Automática (MESH_01 + MESH_02)

```javascript
function clasificarTiendas() {
  tiendas.forEach(t => {
    // Aplicar reglas de MESH_02
    if (t.salud < 40) {
      t.tipoCalculado = 'LASTRE';  // Prioridad 1
    } else if (t.salud >= 80 && t.resiliencia >= 75 && 
               t.potencial >= 80 && t.margen_bruto >= 30) {
      t.tipoCalculado = 'JOYA';    // Prioridad 2
    } else if (t.salud >= 60 && t.salud < 80) {
      t.tipoCalculado = 'APUESTA'; // Prioridad 3
    } else {
      t.tipoCalculado = 'BUNKER';  // Prioridad 4
    }
  });
}
```

### Vistas Generadas Dinámicamente

```javascript
// MESH_01 → Datos
// MESH_02 → Clasificación
// MESH_04 → Recomendaciones
// MESH_05 → KPI display

function renderRecomendaciones() {
  // Para cada tipología en MESH_02
  Object.entries(recomendaciones).forEach(([tipo, data]) => {
    const config = tipologias[tipo];  // Color, icono
    
    // Para cada acción en MESH_04
    data.acciones.forEach(accion => {
      // Crear card con:
      // - Prioridad
      // - Descripción
      // - Duración + Presupuesto
      // - KPI objetivo
      // - ROI esperado
    });
  });
}
```

---

## 🎯 CASOS DE USO

### Caso 1: Decisión Ejecutiva - ¿Invertir en Tienda X?

**Pregunta:** "¿Debemos invertir $45K en Plaza Centro?"

**Proceso:**

1. **Verificar situación actual (MESH_01)**
   - Plaza Centro: Salud=92, Margen=32.5%, Ticket=$145.80
   - Tipología: JOYA

2. **Revisar escenarios aplicables (MESH_03)**
   - SCENARIO_JOYA_EXPANSION: +7 puntos salud, +3.5% margen
   - ROI esperado: 2.1x en 12 meses
   - Inversión: $180K (más de lo disponible)

3. **¿Hay escenario más pequeño? (MESH_03 alt)**
   - SCENARIO_APUESTA_OPTIMIZA: Diseñado para APUESTA, no JOYA
   - SCENARIO_NETWORK_OPTIMIZATION: Incluye todas las tiendas

4. **Decisión: Invertir $45K en APUESTA, no $180K en JOYA**
   - ROI 3.2x > 2.1x
   - Menor riesgo
   - Payback más rápido

**Datos usados:** MESH_01, MESH_02, MESH_03

---

### Caso 2: Plan de Acción Operacional - Mejorar Zona Sur

**Problema:** Zona Sur es LASTRE (salud=48, margen=18.5%, ticket=$68.20)

**Pregunta:** "¿Qué hacemos con Zona Sur?"

**Proceso:**

1. **Confirmar clasificación (MESH_02)**
   - Salud < 40? NO (48)
   - Pero está en rango BUNKER (40-59)
   - Potencial muy bajo (40), resiliencia baja (35)
   - → **Borderline LASTRE/BUNKER**

2. **¿Es viable mejorar? (MESH_03 + MESH_04)**
   - SCENARIO_LASTRE_DECISION: Opciones = Cierre (60%) o Reestructura (40%)
   - SCENARIO_BUNKER_TRANSFORMATION: Salud 48 → 58, pero requiere $95K
   - Evaluación: Riesgo alto, recursos escasos

3. **Recomendaciones (MESH_04)**
   - LASTRE_REC_001: Análisis viabilidad ($4K, 6 semanas)
   - LASTRE_REC_002: Plan de cierre ordenado ($12K, 26 semanas)
   - LASTRE_REC_003: Plan reestructura ($45K, 78 semanas)

4. **Decisión: 3 meses estudio + decisión binaria**
   - Si viable → Reestructurar (40% chance)
   - Si no viable → Cerrar ordenadamente (60% chance)

**Datos usados:** MESH_01, MESH_02, MESH_03, MESH_04

---

### Caso 3: Monitoreo Continuo - ¿Vamos por buen camino?

**Pregunta:** "Implementamos SCENARIO_APUESTA_OPTIMIZA hace 3 meses en 6 tiendas. ¿Progresamos?"

**Proceso:**

1. **Baseline (inicio del escenario)**
   - Plaza Mall 1: Salud 78, Margen 28.3%, Ticket $120.50
   - Tipología: APUESTA

2. **Actual (mes 3)**
   - Plaza Mall 1 hoy: Salud 82, Margen 29.5%, Ticket $128.70
   - Cambio: +4 salud, +1.2% margen, +$8.20 ticket

3. **Contra meta (MESH_03)**
   - Escenario prometía: +12 salud en 8 meses
   - Mes 3: Vamos al 33% del camino esperado (OK)
   - Meta final: Salud 78 → 90

4. **Seguimiento de KPI (MESH_05)**
   - Margen Bruto: 28.3% → 29.5% ✓ (en target)
   - Ticket Promedio: $120.50 → $128.70 ✓ (en target)
   - Rotación Inventario: Aumentó a 23 días ✓

5. **Recomendaciones de ajuste (MESH_04)**
   - APUESTA_REC_003 (Incentivos): Vemos progreso
   - APUESTA_REC_005 (Quick wins): Completados
   - Acelerar APUESTA_REC_002 (Planograma): Podría ayudar

**Decisión:** Continuar, acelerar fase 2.

**Datos usados:** MESH_01, MESH_03, MESH_04, MESH_05

---

## 📈 VENTAJAS COMPETITIVAS

### Versión Anterior vs Versión 3 MESH

```
CRITERIO                 DODET v2 (Datos Duros)    DODET v3 (JSON/MESH)
────────────────────────────────────────────────────────────────────
Agregar tienda           Editar HTML               Agregar línea JSON
Cambiar tipología        Redescribir cuadrante     Actualizar reglas JSON
Nuevo escenario          Código JavaScript nuevo   Agregar escenario JSON
Validar datos            Manual                    Automatic via schema
Integrarse otro sistema  Difícil (datos duros)     Fácil (APIs JSON)
Escalabilidad (100 tiendas) Complejo              Simple (mismo JSON)
Documentación            Separada                  Self-documenting
Mantenibilidad           Media                     Alta
Testing de reglas        Manual                    Automático (schema)
```

---

## 🚀 ROADMAP FUTURO

### Fase 2: Integración de Datos Externos
- Conectar POS/ERP en tiempo real
- Automatizar cálculo diario de MESH_01
- Alertas automáticas si tienda cambia cuadrante

### Fase 3: Machine Learning
- Predicción de cuadrante futuro usando MESH_01 histórico
- Optimización automática de escenarios (MESH_03)
- Recomendaciones personalizadas por equipo (MESH_04)

### Fase 4: Colaborativo
- Comentarios en recomendaciones (MESH_04)
- Versioning de escenarios (MESH_03)
- Auditoría de cambios (quién cambió qué, cuándo)

---

## 📞 SOPORTE TÉCNICO

### Validación de MESH
Cada archivo JSON incluye `metadata` para verificar integridad:

```json
{
  "metadata": {
    "mesh_id": "MESH_01",
    "mesh_name": "TIENDAS",
    "version": "2.0",
    "total_records": 24,
    "created": "2026-01-15T10:30:00Z",
    "updated": "2026-01-15T10:30:00Z"
  }
}
```

### Checklist de Integridad

- [ ] ¿Todos los 5 MESH están en el directorio?
- [ ] ¿JSON válido en cada archivo? (Usar JSONLint)
- [ ] ¿Metadata coincide con contenido?
- [ ] ¿Referencias cruzadas correctas?
- [ ] ¿No hay tiendas duplicadas en MESH_01?
- [ ] ¿Todas las tipologías en MESH_02 están en MESH_03?

---

## 📝 CONCLUSIÓN

La arquitectura MESH proporciona un sistema modular, escalable y mantenible para gestionar la complejidad operacional de una red minorista. Cada componente tiene responsabilidad única, documentación clara, y relaciones explícitas.

**Resultado:** Decisiones más rápidas, accionables y basadas en datos.

---

**Versión:** 3.0 | **Fecha:** 2026-01-15 | **Autor:** Sistema DODET
