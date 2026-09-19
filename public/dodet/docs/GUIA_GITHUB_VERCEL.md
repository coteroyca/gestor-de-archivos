# GUÍA PASO A PASO: GitHub + Vercel

## 🚀 Instalación y Deployment

### PASO 1: Crear Repositorio en GitHub

1. **Crea un nuevo repositorio**
   - Ve a https://github.com/new
   - Nombre: `dodet-mesh` (o tu nombre preferido)
   - Descripción: "DODET Constructor de Escenarios - Arquitectura MESH"
   - Selecciona: `Public` (para que Vercel lo pueda acceder)
   - ✅ Crear repositorio (sin README, sin .gitignore)

2. **Copia la URL de tu repo**
   ```
   https://github.com/TU_USUARIO/dodet-mesh.git
   ```

### PASO 2: Subir Archivos a GitHub (Local)

```bash
# 1. Crear carpeta local
mkdir dodet-mesh
cd dodet-mesh

# 2. Inicializar Git
git init
git branch -M main

# 3. Agregar repositorio remoto
git remote add origin https://github.com/TU_USUARIO/dodet-mesh.git

# 4. Copiar todos los archivos generados aquí
# (Los 5 MESH JSON + HTML + docs + config files)
# cp /mnt/user-data/outputs/* .

# 5. Agregar todos los archivos a Git
git add .

# 6. Hacer commit
git commit -m "initial: DODET v3 MESH architecture"

# 7. Subir a GitHub
git push -u origin main
```

**Resultado esperado:**
```
✓ Files pushed to GitHub
✓ Repo ahora visible en https://github.com/TU_USUARIO/dodet-mesh
```

### PASO 3: Conectar Vercel a GitHub

1. **Ve a Vercel**
   - https://vercel.com/login
   - Inicia sesión (o crea cuenta si no tienes)

2. **Importar proyecto desde GitHub**
   - Botón: "New Project"
   - Selecciona: "Import Git Repository"
   - Conecta tu cuenta GitHub
   - Busca: `dodet-mesh`
   - Haz clic: "Import"

3. **Configurar Proyecto**
   - **Project Name:** `dodet-mesh`
   - **Framework Preset:** "Other" (no es Next.js)
   - **Root Directory:** `./` (raíz del proyecto)
   - **Build Command:** `npm run validate` (o dejar vacío)
   - **Output Directory:** `./` (raíz)

4. **Agregar Variables de Entorno (opcional)**
   - Puedes dejar en blanco por ahora

5. **Deploy**
   - Haz clic: "Deploy"
   - ⏳ Espera 1-2 minutos
   - ✅ Listo!

**Tu app estará en vivo en:**
```
https://dodet-mesh.vercel.app
```

### PASO 4: Verificar que Funciona

1. **Abre tu aplicación**
   ```
   https://dodet-mesh.vercel.app/DODET_v3_JSON_DRIVEN.html
   ```

2. **Verifica que carga**
   - ¿Ves la topbar "DODET Constructor de Escenarios"?
   - ¿Ves el sidebar con vistas?
   - ¿Ves el content area?

3. **Prueba las vistas**
   - Haz clic en "Resumen" → Debe mostrar cuadrantes
   - Haz clic en "Cuadrantes" → Debe mostrar tiendas
   - Haz clic en "Recomendaciones" → Debe mostrar acciones

**Si todo funciona → ¡Deployment exitoso! 🎉**

---

## 📝 Flujo de Trabajo Diario

### Agregar/Modificar Tiendas

```bash
# 1. En tu editor favorito, edita MESH_01_TIENDAS.json
# Agrega una nueva tienda:
{
  "id": "T025",
  "nombre": "Nueva Tienda",
  "lat": 10.5,
  "lng": -66.9,
  "salud": 75,
  "resiliencia": 70,
  "potencial": 72,
  "margen_bruto": 28.5,
  "ticket_promedio": 120,
  "rotacion_inventario": 22,
  "ocupacion_personal": 75,
  "satisfaccion_cliente": 80
}

# 2. Valida los cambios (opcional)
node scripts/validate-mesh.js

# 3. Commitealo
git add MESH_01_TIENDAS.json
git commit -m "chore: agregar Nueva Tienda"

# 4. Sube a GitHub
git push origin main

# 5. Vercel se actualiza automáticamente
# → En 1-2 minutos tu app estará con los cambios
```

### Crear Rama para Cambios Grandes

```bash
# Crear rama para nuevos escenarios
git checkout -b feature/escenarios-q1-2026

# ... edita MESH_03_ESCENARIOS.json

# Valida
node scripts/validate-mesh.js

# Commitea
git add MESH_03_ESCENARIOS.json
git commit -m "feat: agregar escenarios Q1 2026"

# Sube rama
git push origin feature/escenarios-q1-2026

# Ve a GitHub y abre Pull Request
# Vercel creará automáticamente una preview URL
# → Prueba los cambios en https://dodet-mesh-[branch].vercel.app

# Una vez validado en preview, mergea en main
git checkout main
git pull origin main
git merge feature/escenarios-q1-2026
git push origin main

# ✨ Cambios en producción
```

---

## 🔍 Monitoreo y Debugging

### Ver Logs de Deployment en Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona proyecto `dodet-mesh`
3. Sección "Deployments"
4. Haz clic en el deployment más reciente
5. Ver "Build Logs"

### Errores Comunes

**Error: "Cannot find JSON file"**
```
Causa: Rutas incorrectas en HTML
Solución: Verifica que DODET_v3_JSON_DRIVEN.html use:
  fetch('./MESH_01_TIENDAS.json')  ← Rutas relativas
  NO: fetch('/MESH_01_TIENDAS.json')  ← Rutas absolutas
```

**Error: "Invalid JSON"**
```
Causa: Sintaxis JSON incorrecta
Solución: 
  1. Abre el JSON en https://jsonlint.com
  2. Arregla los errores
  3. Commitea y pushea
```

**Error: "Tienda no se ve en mapa"**
```
Causa: Coordenadas geográficas fuera de rango
Solución: Verifica:
  - latitud entre -90 y 90
  - longitud entre -180 y 180
  - Formato decimal (ej: 10.4806, NO 10.4806N)
```

### Verificar Integridad Localmente

```bash
# Antes de hacer push, valida
node scripts/validate-mesh.js

# Debe mostrar: ✅ TODAS LAS VALIDACIONES PASARON
# Si no, arregla los errores antes de hacer push
```

---

## 🌐 URLs Importantes

| Recurso | URL |
|---------|-----|
| **App Principal** | `https://tu-dominio.vercel.app/DODET_v3_JSON_DRIVEN.html` |
| **Repo GitHub** | `https://github.com/TU_USUARIO/dodet-mesh` |
| **Dashboard Vercel** | `https://vercel.com/dashboard/projects/dodet-mesh` |
| **Datos JSON API** | `https://tu-dominio.vercel.app/MESH_01_TIENDAS.json` |
| **Documentación** | `https://tu-dominio.vercel.app/REPORTE_ARQUITECTURA_MESH.md` |

---

## 🔐 Dominio Personalizado (Opcional)

Si quieres usar `https://dodet.tuidominio.com`:

1. Ve a Vercel → Proyecto → Settings → Domains
2. Agrega tu dominio
3. Vercel te dará instrucciones de DNS
4. Configura los registros en tu proveedor de dominio
5. Espera propagación DNS (1-24 horas)

---

## 📊 Colaboración en Equipo

### Agregar colaboradores

1. En GitHub → Settings → Collaborators
2. Invita usuarios por email o username
3. Ellos pueden hacer push a la rama `main`

### Flujo de Pull Request (Recomendado)

```
1. Colaborador crea rama: git checkout -b feature/X
2. Hace cambios y push: git push origin feature/X
3. Abre Pull Request en GitHub
4. Vercel crea preview URL automáticamente
5. Equipo revisa cambios en preview
6. Si OK, mergea a main
7. Vercel deploya a producción automáticamente
```

---

## ⚙️ Automatización con GitHub Actions (Avanzado)

Ya incluye un workflow que:
- ✅ Valida JSON en cada push
- ✅ Verifica integridad MESH
- ✅ Previene pushes con errores
- ✅ Genera reportes

Se ejecuta automáticamente. No necesitas hacer nada.

---

## 📱 Acceso Móvil

Tu app es responsive. Funciona en:
- ✅ Desktop
- ✅ Tablets
- ✅ Móviles

URL móvil: `https://tu-dominio.vercel.app` (mismo)

---

## 🚀 Optimizaciones Útiles

### 1. Agregar favicon

```html
<!-- En DODET_v3_JSON_DRIVEN.html, en <head> -->
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75' fill='%23008744'>D</text></svg>">
```

### 2. SEO Básico

```html
<!-- Agrega a <head> -->
<meta name="description" content="Constructor de escenarios operacionales para redes minoristas">
<meta name="keywords" content="retail, estrategia, operaciones, tiendas">
<meta name="author" content="Tu Nombre">
```

### 3. Analytics (Google Analytics)

```html
<!-- Agregar antes de </body> en HTML -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 📞 Soporte

- **Documentación:** [`GUIA_RAPIDA_MESH.md`](GUIA_RAPIDA_MESH.md)
- **GitHub Issues:** Reporta problemas en tu repo
- **Vercel Docs:** https://vercel.com/docs
- **Validar JSON:** https://jsonlint.com

---

## ✅ Checklist de Lanzamiento

- [ ] Repositorio creado en GitHub
- [ ] Todos los 9 archivos subidos
- [ ] Proyecto importado en Vercel
- [ ] App funciona en producción
- [ ] Vistas cargan correctamente
- [ ] JSON se carga desde las rutas correctas
- [ ] Dominios configurados (opcional)
- [ ] Colaboradores invitados (opcional)
- [ ] README actualizado con tu info
- [ ] Primer commit exitoso

---

**¡Listo! Tu DODET está en vivo 🚀**

Próximos pasos:
1. Personaliza con tus tiendas
2. Agrega tus escenarios
3. Comparte el link con tu equipo
4. Empieza a tomar decisiones basadas en datos

---

**Versión:** 3.0 | **Fecha:** 2026-01-15
