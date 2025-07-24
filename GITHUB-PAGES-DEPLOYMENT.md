# 🚀 DESPLIEGUE EN GITHUB PAGES

## ⚠️ IMPORTANTE: LIMITACIONES

GitHub Pages solo sirve **sitios estáticos**, pero este demo usa Next.js con:
- **Client Components** (13 componentes "use client")
- **Dynamic Routes** (`[id]` parameters)
- **Local State** (Zustand con persistencia)
- **API Routes** (no funcionarán en GitHub Pages)

## ✅ LO QUE SÍ FUNCIONARÁ

1. **Demo Enterprise Mode** ✅
   - Navegación entre páginas
   - Estado local con Zustand
   - Animaciones y transiciones
   - UI interactiva

2. **Componentes Estáticos** ✅
   - Layout y diseño
   - Paneles redimensionables
   - Editor WYSIWYG
   - Tabs y navegación

3. **Mock Data** ✅
   - Datos de demostración predefinidos
   - Sin conexión a base de datos

## ❌ LO QUE NO FUNCIONARÁ

1. **Rutas API** ❌
   - No hay servidor backend
   - No hay endpoints API

2. **Generación Dinámica** ❌
   - Las rutas `[id]` necesitan ser pre-generadas

3. **Autenticación Real** ❌
   - Solo modo demo

## 📦 PASOS PARA DESPLEGAR

### **1. Preparar el Repositorio**

```bash
# Clonar o crear repositorio
git clone https://github.com/tu-usuario/researcher-console.git
cd researcher-console

# Instalar dependencias
pnpm install
```

### **2. Configurar para GitHub Pages**

Los archivos ya están preparados:
- ✅ `next.config.github.js` - Configuración estática
- ✅ `.github/workflows/deploy.yml` - GitHub Actions
- ✅ Scripts en `package.json`

### **3. Ajustar el Nombre del Repositorio**

Edita `next.config.github.js`:
```javascript
const repoName = 'researcher-console' // Cambia por tu nombre de repo
```

### **4. Generar Build Estático**

```bash
# Build local para prueba
npm run build:github

# Verificar la carpeta 'out'
ls -la out/
```

### **5. Configurar GitHub Pages**

1. Ve a **Settings** → **Pages** en tu repositorio
2. Source: **GitHub Actions**
3. Branch: **main** (o tu branch principal)

### **6. Push y Deploy**

```bash
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

GitHub Actions se ejecutará automáticamente y desplegará.

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error: Dynamic Routes**

Si ves errores sobre rutas dinámicas, necesitas generar paths estáticos:

```javascript
// En pages con [id], agregar:
export async function generateStaticParams() {
  return [
    { id: 'req-1' },
    { id: 'req-demo-1' },
    // Agregar todos los IDs necesarios
  ]
}
```

### **Error: Image Optimization**

Las imágenes deben ser estáticas:
```javascript
// next.config.github.js ya incluye:
images: {
  unoptimized: true,
}
```

### **Error: API Routes**

Reemplazar llamadas API con datos mock:
```javascript
// En lugar de fetch('/api/data')
const data = mockData
```

## 🌐 URL FINAL

Tu demo estará disponible en:
```
https://[tu-usuario].github.io/[repo-name]/
```

Ejemplo:
```
https://miusuario.github.io/researcher-console/
```

## 📱 DEMO FUNCIONANDO

El demo enterprise funcionará completamente:
- ✅ 16 pasos automáticos
- ✅ Navegación entre páginas
- ✅ Paneles redimensionables
- ✅ Editor WYSIWYG
- ✅ Animaciones y transiciones

## 🎯 ALTERNATIVAS RECOMENDADAS

Si necesitas funcionalidad completa, considera:

1. **Vercel** (gratis para proyectos personales)
   ```bash
   npx vercel
   ```

2. **Netlify** (gratis con límites generosos)
   ```bash
   npm run build
   # Drag & drop carpeta .next a Netlify
   ```

3. **Railway/Render** (para APIs dinámicas)
   - Soporte completo de Next.js
   - Base de datos incluida

## 💡 TIPS PARA GITHUB PAGES

1. **Usar Hash Router** para mejor compatibilidad
2. **Pre-renderizar todas las rutas** posibles
3. **Optimizar bundles** para carga rápida
4. **Cache agresivo** con service workers

---

## 🚀 COMANDO RÁPIDO

```bash
# Desplegar a GitHub Pages
npm run deploy:github
git add out/
git commit -m "Deploy to GitHub Pages"
git push
```

**¡Tu demo estará listo en ~5 minutos!** 🎉