# 🚀 Researcher Console

Una aplicación completa para la gestión de entrevistas y research, construida con Next.js 14, TypeScript y shadcn/ui.

## ✨ Características

- **Kanban Board** - Interfaz drag-and-drop para gestionar solicitudes de research
- **Dashboard de Sujetos** - Interfaz con pestañas para ver detalles de sujetos
- **Datos Mock** - Todos los datos son simulados usando Steve Jobs como ejemplo
- **Diseño Responsivo** - Amigable para móviles con sidebar colapsable
- **UI Inspirada en Apple** - Diseño limpio con animaciones suaves

## 🛠️ Stack Tecnológico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (Radix UI + Tailwind)
- **Framer Motion**
- **Lucide React** (iconos)
- **date-fns**

## 🚀 Instrucciones para Arrancar

### 1. Instalar dependencias
```bash
cd researcher-console
pnpm install
```

### 2. Arrancar el servidor de desarrollo
```bash
pnpm dev
```

### 3. Abrir en el navegador
```
http://localhost:3000
```

## 📱 Rutas Disponibles

- `/requests` - Vista Kanban board
- `/subjects` - Vista lista de todos los sujetos
- `/subject/steve-jobs/overview` - Vista general del sujeto
- `/subject/steve-jobs/timeline` - Eventos de timeline
- `/subject/steve-jobs/quotes` - Biblioteca de citas con búsqueda
- `/subject/steve-jobs/qa` - Acordeón de preguntas y respuestas
- `/subject/steve-jobs/representations` - Conceptos clave

## 🎨 Características de Diseño

### Apple-Inspired UI
- **Tipografía**: Inter font family
- **Bordes**: Rounded 2xl (24px)
- **Colores**: Paleta neutra y clean
- **Animaciones**: Transiciones suaves de 200ms
- **Espaciado**: Ample white space
- **Sombras**: Sutiles y elegantes

### Componentes Principales
- `SubjectCard` - Tarjetas de sujetos con hover effects
- `KanbanColumn` - Columnas del tablero Kanban
- `TimelineItem` - Items de timeline con animaciones
- `RepresentationCard` - Tarjetas de conceptos
- `Header` / `Sidebar` - Navegación principal

## 📂 Estructura del Proyecto

```
researcher-console/
├── app/
│   ├── (dashboard)/
│   │   ├── requests/page.tsx          # Kanban board
│   │   ├── subjects/page.tsx          # Lista de sujetos
│   │   └── subject/[id]/
│   │       ├── layout.tsx             # Layout con sidebar y tabs
│   │       └── (tabs)/
│   │           ├── overview/page.tsx
│   │           ├── timeline/page.tsx
│   │           ├── quotes/page.tsx
│   │           ├── qa/page.tsx
│   │           └── representations/page.tsx
│   ├── layout.tsx                     # Root layout
│   ├── page.tsx                       # Redirect a /requests
│   └── globals.css                    # Estilos globales
├── components/
│   ├── ui/                           # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── dialog.tsx
│   ├── Header.tsx                    # Header de navegación
│   ├── Sidebar.tsx                   # Sidebar de navegación
│   ├── SubjectCard.tsx               # Tarjeta de sujeto
│   ├── KanbanColumn.tsx              # Columna de Kanban
│   ├── TimelineItem.tsx              # Item de timeline
│   └── RepresentationCard.tsx        # Tarjeta de representación
├── lib/
│   ├── utils.ts                      # Utilidades (cn función)
│   └── mock/
│       └── steveJobs.ts              # Datos mock de Steve Jobs
├── package.json
├── tailwind.config.ts                # Configuración de Tailwind
├── tsconfig.json                     # Configuración de TypeScript
└── next.config.js                    # Configuración de Next.js
```

## 📋 Nota Importante

Esta es una implementación skeleton con **datos mock únicamente**. No se realizan llamadas a API backend. Toda la funcionalidad es solo UI para propósitos de demostración.

## 🔧 Scripts Disponibles

```bash
pnpm dev      # Servidor de desarrollo
pnpm build    # Build para producción
pnpm start    # Servidor de producción
pnpm lint     # Linter ESLint
```

## 🎯 Funcionalidades Implementadas

✅ **Kanban Board** - 4 columnas (Backlog, In Progress, Review, Done)  
✅ **Vista Lista** - Tabla responsive de sujetos  
✅ **Dashboard de Sujeto** - Sidebar persistente + tabs  
✅ **Timeline** - Eventos cronológicos con animaciones  
✅ **Quote Library** - Búsqueda y modal de detalles  
✅ **Q&A** - Acordeón expandible  
✅ **Representations** - Grid de conceptos clave  
✅ **Responsive Design** - Mobile-first approach  
✅ **Smooth Animations** - Framer Motion integrado  
✅ **Apple-style UI** - Diseño premium y limpio  

## 🚀 ¡Listo para usar!

El proyecto está completamente funcional y listo para desarrollo. Simplemente ejecuta `pnpm dev` y empieza a explorar la interfaz.

---

**Creado con ❤️ usando Next.js 14 + shadcn/ui**