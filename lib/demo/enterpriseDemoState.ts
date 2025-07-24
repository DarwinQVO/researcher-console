"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Request, WorkingDoc, Module, Source, QCFlag } from '@/models/types'

export interface DemoStep {
  id: string
  title: string
  description: string
  action: string
  targetElement?: string
  data?: any
  completed: boolean
  requiresNavigation: boolean
  expectedPath?: string
  timeout?: number
}

interface DemoState {
  // Demo control
  isDemoMode: boolean
  currentStep: number
  totalSteps: number
  isGuidedTour: boolean
  isNavigating: boolean
  isPaused: boolean
  error: string | null
  
  // Data state (starts empty)
  requests: Request[]
  workingDocs: WorkingDoc[]
  modules: Module[]
  sources: Source[]
  qcFlags: QCFlag[]
  
  // Demo steps
  steps: DemoStep[]
  
  // Navigation tracking
  navigationHistory: string[]
  currentPath: string
  
  // Actions
  startDemo: () => void
  nextStep: () => void
  prevStep: () => void
  completeStep: (stepId: string) => void
  resetDemo: () => void
  exitDemo: () => void
  pauseDemo: () => void
  resumeDemo: () => void
  addDemoData: (type: string, data: any) => void
  setGuidedTour: (enabled: boolean) => void
  setError: (error: string | null) => void
  setNavigating: (navigating: boolean) => void
  updateCurrentPath: (path: string) => void
}

const enterpriseSteps: DemoStep[] = [
  {
    id: 'welcome',
    title: '🎯 Bienvenido al Sistema Enterprise',
    description: 'Iniciamos el recorrido completo por el sistema de investigación. Primero navegaremos al tablero de solicitudes donde todo comienza.',
    action: 'navigate_to_requests',
    requiresNavigation: true,
    expectedPath: '/requests',
    timeout: 5000,
    completed: false
  },
  {
    id: 'create-request',
    title: '📋 Crear Primera Solicitud',
    description: 'Creamos automáticamente una solicitud de investigación para Steve Jobs. Esta solicitud aparecerá en la columna "Open" del tablero Kanban.',
    action: 'create_request',
    requiresNavigation: false,
    targetElement: '#kanban-board',
    data: {
      id: 'req-demo-1',
      trelloCardId: 'demo-001',
      guest: 'Steve Jobs',
      podcast: 'Tech Visionaries',
      tier: 'premium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    completed: false
  },
  {
    id: 'move-to-progress',
    title: '⚡ Cambiar Estado a En Progreso',
    description: 'La solicitud se mueve automáticamente de "Open" a "En Progreso" para comenzar el trabajo de investigación.',
    action: 'update_request_status',
    requiresNavigation: false,
    targetElement: '#kanban-board',
    data: { status: 'in_progress' },
    completed: false
  },
  {
    id: 'navigate-to-studio',
    title: '🏗️ Acceder al Working Studio',
    description: 'Navegamos al Working Studio, el corazón del sistema donde se realiza toda la investigación y escritura colaborativa.',
    action: 'navigate_to_working_studio',
    requiresNavigation: true,
    expectedPath: '/working-studio/req-demo-1',
    timeout: 5000,
    completed: false
  },
  {
    id: 'create-working-doc',
    title: '📄 Documento de Trabajo Creado',
    description: 'Se crea automáticamente un documento de trabajo estructurado para Steve Jobs con plantilla predefinida y metadatos.',
    action: 'create_working_doc',
    requiresNavigation: false,
    targetElement: '#rich-editor',
    data: {
      id: 'doc-demo-1',
      requestId: 'req-demo-1',
      title: 'Steve Jobs - Interview Prep',
      briefMD: '# Steve Jobs Interview Prep\n\n*Este documento se irá poblando automáticamente con información relevante...*\n\n## Estructura del Documento\n- Biografía temprana\n- Logros en Apple\n- Filosofía de diseño\n- Preguntas sugeridas',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    completed: false
  },
  {
    id: 'add-modules',
    title: '🧩 Agregar Módulos de Investigación',
    description: 'Se agregan automáticamente 3 módulos estructurados: Biografía Temprana, Apple & Innovación, y Filosofía de Diseño.',
    action: 'add_modules',
    requiresNavigation: false,
    targetElement: '#modules-sidebar',
    data: [
      {
        id: 'mod-demo-1',
        workingDocId: 'doc-demo-1',
        name: 'Biografía Temprana',
        variant: 'biographical',
        status: 'active',
        isEnabled: true,
        order: 1,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mod-demo-2',
        workingDocId: 'doc-demo-1',
        name: 'Apple & Innovación',
        variant: 'achievements',
        status: 'pending',
        isEnabled: true,
        order: 2,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'mod-demo-3',
        workingDocId: 'doc-demo-1',
        name: 'Filosofía de Diseño',
        variant: 'philosophy',
        status: 'pending',
        isEnabled: true,
        order: 3,
        content: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    completed: false
  },
  {
    id: 'show-sources-section',
    title: '📚 Explorar Hub de Fuentes',
    description: 'Observamos el hub de fuentes integrado en el Working Studio donde se gestionan todas las referencias de investigación.',
    action: 'highlight_sources_hub',
    requiresNavigation: false,
    targetElement: '#sources-hub',
    completed: false  
  },
  {
    id: 'add-sources',
    title: '🔍 Agregar Fuentes Premium',
    description: 'Se agregan automáticamente fuentes curadas: biografía de Isaacson, discurso de Stanford, y análisis de diseño.',
    action: 'add_sources',
    requiresNavigation: false,
    targetElement: '#sources-hub',
    data: [
      {
        id: 'src-demo-1',
        workingDocId: 'doc-demo-1',
        type: 'book',
        title: 'Steve Jobs Biography by Walter Isaacson',
        url: 'https://example.com/jobs-biography',
        domain: 'example.com',
        capturedBy: 'manual',
        notes: 'Biografía autorizada con acceso completo a Jobs y su círculo íntimo. Fuente primaria esencial.',
        createdAt: new Date()
      },
      {
        id: 'src-demo-2',
        workingDocId: 'doc-demo-1',
        type: 'video',
        title: 'Stanford Commencement Speech 2005',
        url: 'https://youtube.com/watch?v=UF8uR6Z6KLc',
        domain: 'youtube.com',
        capturedBy: 'manual',
        notes: 'Famoso discurso "Stay Hungry, Stay Foolish" - filosofía personal de Jobs',
        createdAt: new Date()
      },
      {
        id: 'src-demo-3',
        workingDocId: 'doc-demo-1',
        type: 'article',
        title: 'The Design Philosophy of Steve Jobs',
        url: 'https://example.com/design-philosophy',
        domain: 'example.com',
        capturedBy: 'ai',
        notes: 'Análisis profundo de su enfoque minimalista y obsesión por los detalles.',
        createdAt: new Date()
      }
    ],
    completed: false
  },
  {
    id: 'navigate-to-sources',
    title: '📖 Ver Biblioteca de Fuentes',
    description: 'Visitamos la página dedicada de fuentes para explorar toda la biblioteca organizada por tipo y relevancia.',
    action: 'navigate_to_sources',
    requiresNavigation: true,
    expectedPath: '/sources',
    timeout: 5000,
    completed: false
  },
  {
    id: 'back-to-studio',
    title: '↩️ Retornar al Working Studio',
    description: 'Regresamos al Working Studio para continuar con la investigación y utilizar las fuentes agregadas.',
    action: 'navigate_back_to_studio',
    requiresNavigation: true,
    expectedPath: '/working-studio/req-demo-1',
    timeout: 5000,
    completed: false
  },
  {
    id: 'use-ai-assist',
    title: '🤖 Activar Asistente AI',
    description: 'Activamos el asistente AI integrado que genera preguntas inteligentes y sugerencias basadas en las fuentes.',
    action: 'demo_ai_assist',
    requiresNavigation: false,
    targetElement: '#ai-drawer',
    completed: false
  },
  {
    id: 'add-content',
    title: '✍️ Poblar Contenido Automáticamente',
    description: 'El documento se llena automáticamente con contenido estructurado extraído inteligentemente de las fuentes.',
    action: 'populate_content',
    requiresNavigation: false,
    targetElement: '#rich-editor',
    data: {
      content: `# Steve Jobs Interview Prep

## 👤 Biografía Temprana
- **Nacimiento**: 24 de febrero de 1955 en San Francisco, California
- **Adopción**: Paul y Clara Jobs lo adoptaron cuando era bebé
- **Educación**: Abandonó Reed College pero siguió asistiendo a clases que le interesaban
- **Formación**: Viajó a India en busca de iluminación espiritual

## 🍎 Apple & Innovación
- **Co-fundación**: Estableció Apple en 1976 con Steve Wozniak en el garaje familiar
- **Revoluciones**: Transformó múltiples industrias - computadoras personales, música digital (iPod), smartphones (iPhone)
- **Filosofía empresarial**: "La simplicidad es la máxima sofisticación"
- **Retorno triunfal**: Regresó a Apple en 1997 y la convirtió en la empresa más valiosa del mundo

## 🎨 Filosofía de Diseño
> *"El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona."*

### Principios Fundamentales:
- **Obsesión por los detalles**: Cada elemento debe ser perfecto, incluso los invisibles
- **Enfoque en el usuario**: La tecnología debe ser intuitiva y accesible
- **Integración perfecta**: Hardware y software trabajando como uno solo
- **Menos es más**: Eliminar lo innecesario para enfocarse en lo esencial

## 🎯 Preguntas Sugeridas para la Entrevista
1. ¿Cómo influyó su experiencia de adopción en su búsqueda de perfección?
2. ¿Qué aprendió durante su tiempo en India que aplicó posteriormente en Apple?
3. ¿Cuál fue el momento más difícil durante su ausencia de Apple?
4. ¿Cómo equilibraba la innovación con las demandas comerciales?
5. ¿Qué consejo daría a los emprendedores jóvenes de hoy?`
    },
    completed: false
  },
  {
    id: 'quality-check',
    title: '✅ Control de Calidad Enterprise',
    description: 'Ejecutamos el sistema de QC integrado que revisa gramática, factibilidad, coherencia y citations.',
    action: 'run_quality_check',
    requiresNavigation: false,
    targetElement: '#qc-overlay',
    completed: false
  },
  {
    id: 'export-document',
    title: '📤 Exportar Documento Final',
    description: 'Generamos el documento final en múltiples formatos (PDF, DOCX, Markdown) con marca de agua profesional.',
    action: 'export_document',
    requiresNavigation: false,
    targetElement: '#export-modal',
    completed: false
  },
  {
    id: 'show-subjects',
    title: '👥 Ver Base de Datos de Sujetos',
    description: 'Visitamos la página de sujetos donde Steve Jobs ahora aparece como sujeto de investigación completado.',
    action: 'navigate_to_subjects',
    requiresNavigation: true,
    expectedPath: '/subjects',
    timeout: 5000,
    completed: false
  },
  {
    id: 'complete',
    title: '🎉 Demo Enterprise Completado',
    description: '¡Excelente! Has recorrido todo el flujo del sistema enterprise: desde solicitudes hasta entrega final. El sistema está listo para uso profesional.',
    action: 'demo_complete',
    requiresNavigation: false,
    completed: false
  }
]

export const useEnterpriseDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      // Initial state (empty)
      isDemoMode: false,
      currentStep: 0,
      totalSteps: enterpriseSteps.length,
      isGuidedTour: true,
      isNavigating: false,
      isPaused: false,
      error: null,
      
      requests: [],
      workingDocs: [],
      modules: [],
      sources: [],
      qcFlags: [],
      
      steps: enterpriseSteps,
      navigationHistory: [],
      currentPath: '/',
      
      // Actions
      startDemo: () => {
        console.log('[Enterprise Demo] Starting demo...')
        set({
          isDemoMode: true,
          currentStep: 0,
          isGuidedTour: true,
          isNavigating: false,
          isPaused: false,
          error: null,
          // Reset all data to empty
          requests: [],
          workingDocs: [],
          modules: [],
          sources: [],
          qcFlags: [],
          navigationHistory: [],
          // Reset steps
          steps: enterpriseSteps.map(step => ({ ...step, completed: false }))
        })
      },
      
      nextStep: () => {
        const { currentStep, totalSteps } = get()
        if (currentStep < totalSteps - 1) {
          console.log(`[Enterprise Demo] Advancing to step ${currentStep + 2}`)
          set({ currentStep: currentStep + 1, error: null })
        }
      },
      
      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          console.log(`[Enterprise Demo] Going back to step ${currentStep}`)
          set({ currentStep: currentStep - 1, error: null })
        }
      },
      
      completeStep: (stepId: string) => {
        console.log(`[Enterprise Demo] Completing step: ${stepId}`)
        set(state => ({
          steps: state.steps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        }))
      },
      
      resetDemo: () => {
        console.log('[Enterprise Demo] Resetting demo...')
        set({
          isDemoMode: false,
          currentStep: 0,
          isGuidedTour: true,
          isNavigating: false,
          isPaused: false,
          error: null,
          requests: [],
          workingDocs: [],
          modules: [],
          sources: [],
          qcFlags: [],
          navigationHistory: [],
          currentPath: '/',
          steps: enterpriseSteps.map(step => ({ ...step, completed: false }))
        })
      },
      
      exitDemo: () => {
        console.log('[Enterprise Demo] Exiting demo...')
        set({ 
          isDemoMode: false, 
          isGuidedTour: false,
          isNavigating: false,
          isPaused: false,
          error: null
        })
      },

      pauseDemo: () => {
        console.log('[Enterprise Demo] Pausing demo...')
        set({ isPaused: true })
      },

      resumeDemo: () => {
        console.log('[Enterprise Demo] Resuming demo...')
        set({ isPaused: false })
      },
      
      addDemoData: (type: string, data: any) => {
        console.log(`[Enterprise Demo] Adding demo data: ${type}`, data)
        set(state => {
          switch (type) {
            case 'request':
              return { requests: [...state.requests, data] }
            case 'working_doc':
              return { workingDocs: [...state.workingDocs, data] }
            case 'modules':
              return { modules: [...state.modules, ...(Array.isArray(data) ? data : [data])] }
            case 'sources':
              return { sources: [...state.sources, ...(Array.isArray(data) ? data : [data])] }
            case 'qc_flag':
              return { qcFlags: [...state.qcFlags, data] }
            case 'update_request_status':
              return { 
                requests: state.requests.map(req => 
                  req.id === 'req-demo-1' 
                    ? { ...req, status: data.status, updatedAt: new Date() }
                    : req
                )
              }
            default:
              return state
          }
        })
      },
      
      setGuidedTour: (enabled: boolean) => {
        set({ isGuidedTour: enabled })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setNavigating: (navigating: boolean) => {
        set({ isNavigating: navigating })
      },

      updateCurrentPath: (path: string) => {
        set(state => ({
          currentPath: path,
          navigationHistory: [...state.navigationHistory, path]
        }))
      }
    }),
    {
      name: 'enterprise-demo-storage',
      partialize: (state) => ({
        isDemoMode: state.isDemoMode,
        currentStep: state.currentStep,
        isGuidedTour: state.isGuidedTour,
        isPaused: state.isPaused
      })
    }
  )
)