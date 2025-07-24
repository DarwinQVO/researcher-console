# 🚂 DESPLIEGUE EN RAILWAY

## ✅ VENTAJAS DE RAILWAY

- **Deploy en 3 minutos** - Sin configuración compleja
- **$5 USD gratis al mes** - Suficiente para demos
- **Soporte completo Next.js** - SSR, API routes, todo funciona
- **Base de datos incluida** - PostgreSQL con 1 click
- **SSL automático** - HTTPS gratis
- **GitHub integration** - Deploy automático con cada push

## 📦 ARCHIVOS YA CONFIGURADOS

✅ `railway.json` - Configuración de Railway
✅ `nixpacks.toml` - Build optimizado con pnpm
✅ `.env.example` - Variables de entorno
✅ `package.json` - Scripts actualizados

## 🚀 PASOS DE DEPLOYMENT

### **1. Crear cuenta en Railway**

1. Ve a [railway.app](https://railway.app/)
2. Sign up con GitHub (recomendado)
3. Verifica tu email

### **2. Instalar Railway CLI (Opcional)**

```bash
# macOS
brew install railway

# o usar npm
npm install -g @railway/cli
```

### **3. Deploy desde GitHub (RECOMENDADO)**

1. **Push tu código a GitHub**:
```bash
git add .
git commit -m "Add Railway configuration"
git push origin main
```

2. **En Railway Dashboard**:
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Authorize Railway para GitHub
   - Select tu repositorio `researcher-console`
   - Railway detectará Next.js automáticamente

### **4. Deploy desde CLI (Alternativa)**

```bash
# Login
railway login

# Inicializar proyecto
railway init

# Deploy
railway up

# Obtener URL
railway open
```

### **5. Variables de Entorno**

En Railway Dashboard → Settings → Variables:

```env
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=true
```

### **6. (Opcional) Agregar PostgreSQL**

1. En tu proyecto Railway
2. Click **"+ New"** → **"Database"** → **"PostgreSQL"**
3. Railway agregará `DATABASE_URL` automáticamente

## 🔧 CONFIGURACIÓN AVANZADA

### **Custom Domain**

1. Settings → Networking → Custom Domain
2. Agrega tu dominio: `demo.tudominio.com`
3. Configura DNS:
   ```
   CNAME demo.tudominio.com → tuapp.up.railway.app
   ```

### **Environment Variables**

```bash
# Desde CLI
railway variables set NODE_ENV=production
railway variables set NEXT_PUBLIC_APP_URL=https://tuapp.railway.app

# Ver todas las variables
railway variables
```

### **Logs en Tiempo Real**

```bash
# Ver logs
railway logs

# Seguir logs
railway logs -f
```

## 📊 MONITOREO

Railway Dashboard muestra:
- **Métricas en tiempo real** - CPU, RAM, Network
- **Logs** - Todos los console.log
- **Deployments** - Historial completo
- **Costs** - Uso del plan gratuito

## 🚨 TROUBLESHOOTING

### **Error: Build failed**

Verifica en logs:
```bash
railway logs --build
```

Causas comunes:
- Falta `pnpm-lock.yaml` → Correr `pnpm install` local
- TypeScript errors → `pnpm build` local primero

### **Error: App crashes**

Verifica:
1. Variables de entorno configuradas
2. Puerto correcto: `PORT` o 3000
3. Logs: `railway logs -f`

### **Error: Slow cold starts**

Solución:
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  // Reduce bundle size
}
```

## 💰 COSTOS

### **Plan Gratuito**
- ✅ $5 USD de créditos/mes
- ✅ 500 GB de bandwidth
- ✅ ~500 horas de ejecución
- ✅ SSL incluido

### **Estimación para Demo**
- Demo básico: ~$2-3/mes
- Con PostgreSQL: ~$3-4/mes
- **Sobra crédito del plan gratuito**

## 🎯 COMANDOS RÁPIDOS

```bash
# Deploy inicial
railway login
railway link [project-id]
railway up

# Ver estado
railway status
railway open

# Ver logs
railway logs -f

# Redeploy
railway up

# Variables
railway variables
railway variables set KEY=value
```

## 🔗 URLs FINALES

Tu app estará en:
```
https://[proyecto]-[random].up.railway.app
```

Ejemplo:
```
https://researcher-console-production.up.railway.app
```

Con dominio custom:
```
https://demo.tudominio.com
```

## ✅ CHECKLIST FINAL

- [ ] Código en GitHub
- [ ] Cuenta en Railway
- [ ] Proyecto creado
- [ ] Variables configuradas
- [ ] Deploy exitoso
- [ ] URL funcionando
- [ ] Demo Enterprise activo

---

## 🚀 DEPLOY EN 1 COMANDO

Si ya tienes Railway CLI:
```bash
railway login && railway init && railway up
```

**¡Tu demo estará listo en 3 minutos!** 🎉

## 📞 SOPORTE

- [Railway Docs](https://docs.railway.app/)
- [Discord de Railway](https://discord.gg/railway)
- [Status Page](https://status.railway.app/)

---

**Railway es la opción más simple y poderosa para tu demo.** 
**Todo funcionará exactamente como en desarrollo.** 🚂