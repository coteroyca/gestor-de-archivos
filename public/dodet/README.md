# DODET · Constructor de Escenarios Operacionales v3

> Arquitectura modular JSON-MESH para gestión estratégica de redes minoristas

[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version 3.0](https://img.shields.io/badge/Version-3.0-blue?style=flat-square)](CHANGELOG.md)

---

## 🎯 ¿Qué es DODET?

**DODET** es una herramienta de análisis y decisión estratégica para redes minoristas. Clasifica tiendas en 4 cuadrantes (JOYA, APUESTA, BUNKER, LASTRE) y proporciona:

- 📊 **Clasificación automática** de tiendas
- 🎯 **Recomendaciones accionables** priorizadas
- 📈 **Escenarios de intervención** con ROI modelado
- 📍 **Visualización geográfica** de la red
- 🔍 **Sistema de KPIs** para seguimiento

### v3: Arquitectura Modular JSON-MESH

La versión 3 descompone toda la lógica en **5 archivos JSON independientes** (MESH):

| MESH | Contenido | Registros | Propósito |
|------|-----------|-----------|----------|
| **01 TIENDAS** | 24 tiendas + métricas | 24 | Base de datos operacional |
| **02 TIPOLOGIAS** | 4 cuadrantes + reglas | 4 | Sistema de clasificación |
| **03 ESCENARIOS** | 7 intervenciones + ROI | 7 | Modelado de impacto |
| **04 RECOMENDACIONES** | 24 acciones | 24 | Motor de recomendaciones |
| **05 KPI** | 17 indicadores | 17+ | Sistema de medición |

---

## 🚀 Inicio Rápido

### Opción 1: Local (5 minutos)

```bash
# 1. Clonar repo
git clone https://github.com/TU_USUARIO/dodet-mesh.git
cd dodet-mesh

# 2. Servir localmente
python -m http.server 8000
# O con Node:
npx http-server

# 3. Abrir en navegador
open http://localhost:8000/DODET_v3_JSON_DRIVEN.html
```

### Opción 2: Vercel (Automático)

1. **Conectar GitHub a Vercel**
   - Ve a https://vercel.com
   - Conecta tu cuenta GitHub
   - Selecciona este repo

2. **Configuración Automática**
   - Vercel detecta `vercel.json`
   - Deploy automático en cada push
   - URL: `https://tu-proyecto.vercel.app`

3. **Listo**
   - Tu DODET estará en vivo en segundos ✨

---

## 📋 Estructura de Carpetas

```
dodet-mesh/
├── README.md                          # Este archivo
├── LICENSE                            # MIT License
├── .gitignore                         # Archivos ignorados por Git
├── vercel.json                        # Configuración Vercel
├── package.json                       # Metadata del proyecto
├── DODET_v3_JSON_DRIVEN.html          # ← Aplicación principal
├── MESH_01_TIENDAS.json               # Tiendas y métricas
├── MESH_02_TIPOLOGIAS.json            # Sistema de clasificación
├── MESH_03_ESCENARIOS.json            # Escenarios de intervención
├── MESH_04_RECOMENDACIONES.json       # Acciones recomendadas
├── MESH_05_KPI.json                   # Sistema de KPIs
├── REPORTE_ARQUITECTURA_MESH.md       # Documentación técnica (45 KB)
├── GUIA_RAPIDA_MESH.md                # Guía práctica (12 KB)
├── INDICE_ARCHIVOS_GENERADOS.md       # Índice maestro (14 KB)
└── scripts/                           # Scripts útiles
    ├── validate-mesh.js               # Validar integridad
    └── generate-report.js             # Generar reportes
```

---

## 📖 Documentación

### Para Usuarios Rápidos ⚡
- **Archivo:** [`GUIA_RAPIDA_MESH.md`](GUIA_RAPIDA_MESH.md)
- **Tiempo:** 15 minutos
- **Contenido:** TL;DR, especificación rápida, integración básica

### Para Arquitectos 🏗️
- **Archivo:** [`REPORTE_ARQUITECTURA_MESH.md`](REPORTE_ARQUITECTURA_MESH.md)
- **Tiempo:** 90 minutos
- **Contenido:** Diseño completo, casos de uso, roadmap

### Para Navegadores 🗺️
- **Archivo:** [`INDICE_ARCHIVOS_GENERADOS.md`](INDICE_ARCHIVOS_GENERADOS.md)
- **Tiempo:** 10 minutos
- **Contenido:** Índice de todos los archivos

---

## 🎨 Las 4 Tipologías Estratégicas

```
┌──────────────────────────────────────────┐
│          MATRIZ ESTRATÉGICA               │
├──────────────────────────────────────────┤
│                                           │
│   JOYA (↗)          │      APUESTA (→)   │
│   💎 Expandir       │      🎯 Mejorar    │
│   Salud: 80-100     │      Salud: 60-79  │
│   Margen: >30%      │      Margen: 28-30 │
│                     │                    │
│  ─────────────────────────────────────  │
│                     │                    │
│   BUNKER (←)        │      LASTRE (↙)    │
│   🛡️ Defender       │      ⚓ Decidir    │
│   Salud: 40-59      │      Salud: 0-39   │
│   Margen: 23-27     │      Margen: <23   │
│                                           │
└──────────────────────────────────────────┘
```

**JOYA** (28%): 💎 Alto rendimiento  
→ Inversión en expansión y replicación  
→ ROI esperado: 2-4x

**APUESTA** (25%): 🎯 Potencial de mejora  
→ Diagnóstico y mejora operacional  
→ ROI esperado: 2-3x

**BUNKER** (23%): 🛡️ En defensa  
→ Contención de costos, estabilización  
→ ROI esperado: 1.5-2x

**LASTRE** (14%): ⚓ En crisis  
→ Decisión: Cierre o reestructuración  
→ Ahorro de pérdidas futuras

---

## 🔧 Personalización

### Agregar una Tienda

Edita `MESH_01_TIENDAS.json`:

```json
{
  "tiendas": [
    {
      "id": "T025",
      "nombre": "Mi Nueva Tienda",
      "lat": 10.4806,
      "lng": -66.9036,
      "salud": 72,
      "resiliencia": 68,
      "potencial": 70,
      "margen_bruto": 28.5,
      "ticket_promedio": 120.00,
      "rotacion_inventario": 22,
      "ocupacion_personal": 72,
      "satisfaccion_cliente": 80
    }
  ]
}
```

**Commit y push:**
```bash
git add MESH_01_TIENDAS.json
git commit -m "chore: agregar tienda Mi Nueva Tienda"
git push origin main
```

Vercel deployará automáticamente ✨

### Agregar un Escenario

Edita `MESH_03_ESCENARIOS.json`:

```json
{
  "escenarios": [
    {
      "id": "SCENARIO_CUSTOM_001",
      "nombre": "Mi Escenario Personalizado",
      "tipo": "optimizacion",
      "modificadores": {
        "salud_delta": 15,
        "margen_bruto_delta": 3.0
      },
      "duracion_meses": 9,
      "inversion_usd": 50000,
      "roi_esperado": 3.5
    }
  ]
}
```

### Cambiar Criterios de Clasificación

Edita `MESH_02_TIPOLOGIAS.json`:

```json
{
  "tipologias": {
    "JOYA": {
      "criterios": {
        "salud_min": 80,        # ← Ajusta aquí
        "margen_bruto_min": 30   # ← O aquí
      }
    }
  }
}
```

---

## 🔐 Validar Integridad de MESH

```bash
# Ejecutar validación
node scripts/validate-mesh.js

# Salida esperada:
# ✓ MESH_01_TIENDAS.json valido (24 registros)
# ✓ MESH_02_TIPOLOGIAS.json valido (4 registros)
# ✓ MESH_03_ESCENARIOS.json valido (7 registros)
# ✓ MESH_04_RECOMENDACIONES.json valido (24 registros)
# ✓ MESH_05_KPI.json valido (17 registros)
# ✓ Referencias cruzadas OK
```

---

## 📊 Estadísticas

```
DATOS (5 MESH JSON):
├─ MESH_01_TIENDAS.json ..................... 9.8 KB
├─ MESH_02_TIPOLOGIAS.json ................. 6.7 KB
├─ MESH_03_ESCENARIOS.json ................. 9.1 KB
├─ MESH_04_RECOMENDACIONES.json ........... 16.0 KB
└─ MESH_05_KPI.json ....................... 13.0 KB
   TOTAL: 54.6 KB

APLICACIÓN:
└─ DODET_v3_JSON_DRIVEN.html ............... 23 KB

DOCUMENTACIÓN:
├─ REPORTE_ARQUITECTURA_MESH.md ........... 28 KB
├─ GUIA_RAPIDA_MESH.md ..................... 12 KB
└─ INDICE_ARCHIVOS_GENERADOS.md ........... 14 KB
   TOTAL: 54 KB

TOTAL: 131.6 KB
```

---

## 🌐 Deployment en Vercel

### Configuración Automática

El archivo `vercel.json` ya está configurado:

```json
{
  "version": 2,
  "public": true,
  "buildCommand": "npm run build",
  "outputDirectory": "./"
}
```

### URLs Disponibles

```
Producción:  https://tu-proyecto.vercel.app/DODET_v3_JSON_DRIVEN.html
Preview:     https://dodet-mesh-[branch].vercel.app
API JSON:    https://tu-proyecto.vercel.app/MESH_01_TIENDAS.json
```

### GitHub Actions (Opcional)

Los workflows automáticos validan cada push:

```bash
# Se ejecuta automáticamente:
✓ Validar JSON sintaxis
✓ Validar integridad MESH
✓ Verificar referencias cruzadas
✓ Generar reportes
```

---

## 🔄 Flujo de Trabajo Recomendado

### 1. Desarrollo Local
```bash
# Clonar y crear rama
git clone https://github.com/TU_USUARIO/dodet-mesh.git
cd dodet-mesh
git checkout -b feature/agregar-tiendas

# Editar JSON
# ... cambios en MESH_01, MESH_03, etc ...

# Validar
node scripts/validate-mesh.js

# Commitear
git add .
git commit -m "feat: agregar 5 tiendas nuevas"
```

### 2. Push a GitHub
```bash
git push origin feature/agregar-tiendas
```

### 3. Review (Opcional)
- Crear Pull Request
- Revisar cambios
- Vercel genera preview URL automáticamente
- Probar en la preview
- Mergear cuando está OK

### 4. Deploy a Producción
```bash
git checkout main
git merge feature/agregar-tiendas
git push origin main
# ✨ Vercel deploya automáticamente
```

---

## 🛠️ Stack Técnico

- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **Datos:** JSON (arquitectura MESH)
- **Hosting:** Vercel (GitHub Pages alternativa)
- **Versionado:** Git
- **CI/CD:** GitHub Actions (opcional)
- **Librerías Externas:**
  - Chart.js 4.4.0 (gráficos)
  - Font Awesome 6.4.0 (iconos)
  - Google Fonts (tipografía)

**Sin dependencias backend. Todo estático.**

---

## 📝 Licencia

MIT License - Libre para uso comercial y no comercial

```
Copyright (c) 2026 DODET Mesh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

Ver [`LICENSE`](LICENSE) completo.

---

## 🤝 Contribuir

### Reportar un Bug
1. Abre un [Issue](https://github.com/TU_USUARIO/dodet-mesh/issues)
2. Describe el problema
3. Incluye pasos para reproducir

### Proponer una Mejora
1. Fork el repo
2. Crea una rama: `git checkout -b feature/mi-mejora`
3. Commitea cambios: `git commit -m "feat: ..."`
4. Push: `git push origin feature/mi-mejora`
5. Abre un Pull Request

### Agregar Tiendas o Escenarios
- Edita directamente los JSON en GitHub
- O clona, edita localmente, y haz push

---

## 📞 Soporte

- **Documentación:** [`REPORTE_ARQUITECTURA_MESH.md`](REPORTE_ARQUITECTURA_MESH.md)
- **Guía Rápida:** [`GUIA_RAPIDA_MESH.md`](GUIA_RAPIDA_MESH.md)
- **Issues:** [GitHub Issues](https://github.com/TU_USUARIO/dodet-mesh/issues)
- **Validar JSON:** https://jsonlint.com

---

## 📅 Roadmap

### v3.0 (Actual)
- ✅ Arquitectura MESH (5 JSON)
- ✅ HTML dinámico
- ✅ 5 vistas
- ✅ Clasificación automática

### v3.1 (Próxima)
- 🔄 Exportar a PDF/Excel
- 🔄 Dark mode toggle
- 🔄 Filtros avanzados
- 🔄 Gráficos animados

### v3.2 (Futuro)
- 📋 API REST
- 📋 Autenticación
- 📋 Base de datos (PostgreSQL)
- 📋 Integración POS en tiempo real

---

## 📊 Estadísticas del Repo

[![GitHub Stars](https://img.shields.io/github/stars/TU_USUARIO/dodet-mesh?style=flat-square)](https://github.com/TU_USUARIO/dodet-mesh)
[![GitHub Forks](https://img.shields.io/github/forks/TU_USUARIO/dodet-mesh?style=flat-square)](https://github.com/TU_USUARIO/dodet-mesh)
[![GitHub Issues](https://img.shields.io/github/issues/TU_USUARIO/dodet-mesh?style=flat-square)](https://github.com/TU_USUARIO/dodet-mesh/issues)

---

## 🎓 Créditos

**DODET v3 Mesh Architecture**  
Diseñado para RetailMind 360° · 2026

---

## 📞 ¿Preguntas?

- 📧 Email: contacto@example.com
- 💬 GitHub Discussions
- 🐦 Twitter: @TU_USUARIO

---

**Hecho con ❤️ para ejecutivos y operadores minoristas**

⭐ Si te resulta útil, dale una estrella ⭐
