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
}

interface DemoState {
  // Demo control
  isDemoMode: boolean
  currentStep: number
  totalSteps: number
  isGuidedTour: boolean
  
  // Data state (starts empty)
  requests: Request[]
  workingDocs: WorkingDoc[]
  modules: Module[]
  sources: Source[]
  qcFlags: QCFlag[]
  
  // Demo steps
  steps: DemoStep[]
  
  // Actions
  startDemo: () => void
  nextStep: () => void
  prevStep: () => void
  completeStep: (stepId: string) => void
  resetDemo: () => void
  exitDemo: () => void
  addDemoData: (type: string, data: any) => void
  setGuidedTour: (enabled: boolean) => void
}

const initialSteps: DemoStep[] = [
  {
    id: 'welcome',
    title: 'Bienvenido al Sistema de Investigación',
    description: 'Te guiaremos paso a paso para mostrar todas las funcionalidades del sistema. Comenzaremos en la página de solicitudes.',
    action: 'navigate_to_requests',
    completed: false
  },
  {
    id: 'create-request',
    title: 'Crear Primera Solicitud',
    description: 'Vamos a crear una solicitud de investigación para Steve Jobs en el sistema Kanban.',
    action: 'create_request',
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
    title: 'Mover a En Progreso',
    description: 'Ahora moveremos la solicitud a "En Progreso" para comenzar a trabajar en ella.',
    action: 'update_request_status',
    targetElement: '#kanban-board',
    data: { status: 'in_progress' },
    completed: false
  },
  {
    id: 'navigate-to-studio',
    title: 'Ir al Working Studio',
    description: 'Ahora navegaremos al Working Studio donde se hace la investigación. Se creará automáticamente un documento de trabajo.',
    action: 'navigate_to_working_studio',
    completed: false
  },
  {
    id: 'create-working-doc',
    title: 'Documento de Trabajo Creado',
    description: 'Se ha creado automáticamente un documento de trabajo para Steve Jobs donde haremos toda la investigación.',
    action: 'create_working_doc',
    targetElement: '#rich-editor',
    data: {
      id: 'doc-demo-1',
      requestId: 'req-demo-1',
      title: 'Steve Jobs - Interview Prep',
      briefMD: '# Steve Jobs Interview Prep\n\n*Este documento se irá llenando con información relevante...*',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    completed: false
  },
  {
    id: 'add-modules',
    title: 'Agregar Módulos de Investigación',
    description: 'Agregamos módulos que estructuran la investigación: biografía temprana, logros de Apple, y filosofía de diseño.',
    action: 'add_modules',
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
    title: 'Ver Sección de Fuentes',
    description: 'Ahora veamos la sección de fuentes donde se agregan automáticamente biografías, entrevistas y documentales.',
    action: 'highlight_sources_hub',
    targetElement: '#sources-hub',
    completed: false  
  },
  {
    id: 'add-sources',
    title: 'Agregar Fuentes de Investigación',
    description: 'Se agregan automáticamente fuentes relevantes: biografía de Isaacson, discurso de Stanford, y artículos sobre diseño.',
    action: 'add_sources',
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
        notes: 'Biografía autorizada con acceso completo a Jobs y su círculo íntimo.',
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
        notes: 'Famoso discurso "Stay Hungry, Stay Foolish"',
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
        notes: 'Análisis profundo de su enfoque minimalista.',
        createdAt: new Date()
      }
    ],
    completed: false
  },
  {
    id: 'navigate-to-sources',
    title: 'Ver Página de Fuentes',
    description: 'Navegaremos a la página de fuentes para ver todas las fuentes agregadas organizadas por tipo.',
    action: 'navigate_to_sources',
    completed: false
  },
  {
    id: 'back-to-studio',
    title: 'Volver al Working Studio',
    description: 'Regresamos al Working Studio para continuar trabajando con el documento.',
    action: 'navigate_back_to_studio',
    completed: false
  },
  {
    id: 'use-ai-assist',
    title: 'Usar Asistente AI',
    description: 'Abriremos el panel de AI para generar preguntas inteligentes y extraer información relevante.',
    action: 'demo_ai_assist',
    targetElement: '#ai-drawer',
    completed: false
  },
  {
    id: 'add-content',
    title: 'Agregar Contenido',
    description: 'El documento se llena automáticamente con información relevante extraída de las fuentes.',
    action: 'populate_content',
    targetElement: '#rich-editor',
    data: {
      content: `# Steve Jobs Interview Prep

## Biografía Temprana
- Nacido el 24 de febrero de 1955 en San Francisco
- Adoptado por Paul y Clara Jobs
- Abandonó Reed College pero siguió asistiendo a clases que le interesaban

## Apple & Innovación
- Co-fundó Apple en 1976 con Steve Wozniak
- Revolucionó múltiples industrias: computadoras, música, teléfonos
- Filosofía: "La simplicidad es la máxima sofisticación"

## Filosofía de Diseño
> "El diseño no es solo cómo se ve o cómo se siente. El diseño es cómo funciona."

- Obsesión por los detalles
- Enfoque en la experiencia del usuario
- Integración perfecta entre hardware y software`
    },
    completed: false
  },
  {
    id: 'quality-check',
    title: 'Control de Calidad',
    description: 'Revisamos el documento para asegurar la calidad antes de entregar.',
    action: 'run_quality_check',
    targetElement: '#qc-overlay',
    completed: false
  },
  {
    id: 'export-document',
    title: 'Exportar Documento',
    description: 'Finalmente exportamos el documento en el formato requerido.',
    action: 'export_document',
    targetElement: '#export-modal',
    completed: false
  },
  {
    id: 'show-subjects',
    title: 'Ver Lista de Sujetos',
    description: 'Veamos la página de sujetos donde aparece Steve Jobs como sujeto de investigación completado.',
    action: 'navigate_to_subjects',
    completed: false
  },
  {
    id: 'complete',
    title: '¡Proceso Completado!',
    description: 'Has recorrido todo el sistema: solicitudes, working studio, fuentes y sujetos. ¡Puedes reiniciar o explorar libremente!',
    action: 'demo_complete',
    completed: false
  }
]

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      // Initial state (empty)
      isDemoMode: false,
      currentStep: 0,
      totalSteps: initialSteps.length,
      isGuidedTour: true,
      
      requests: [],
      workingDocs: [],
      modules: [],
      sources: [],
      qcFlags: [],
      
      steps: initialSteps,
      
      // Actions
      startDemo: () => {
        set({
          isDemoMode: true,
          currentStep: 0,
          isGuidedTour: true,
          // Reset all data to empty
          requests: [],
          workingDocs: [],
          modules: [],
          sources: [],
          qcFlags: [],
          // Reset steps
          steps: initialSteps.map(step => ({ ...step, completed: false }))
        })
      },
      
      nextStep: () => {
        const { currentStep, totalSteps } = get()
        if (currentStep < totalSteps - 1) {
          set({ currentStep: currentStep + 1 })
        }
      },
      
      prevStep: () => {
        const { currentStep } = get()
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 })
        }
      },
      
      completeStep: (stepId: string) => {
        set(state => ({
          steps: state.steps.map(step =>
            step.id === stepId ? { ...step, completed: true } : step
          )
        }))
      },
      
      resetDemo: () => {
        set({
          isDemoMode: false,
          currentStep: 0,
          isGuidedTour: true,
          requests: [],
          workingDocs: [],
          modules: [],
          sources: [],
          qcFlags: [],
          steps: initialSteps.map(step => ({ ...step, completed: false }))
        })
      },
      
      exitDemo: () => {
        set({ isDemoMode: false, isGuidedTour: false })
      },
      
      addDemoData: (type: string, data: any) => {
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
            default:
              return state
          }
        })
      },
      
      setGuidedTour: (enabled: boolean) => {
        set({ isGuidedTour: enabled })
      }
    }),
    {
      name: 'demo-storage',
      partialize: (state) => ({
        isDemoMode: state.isDemoMode,
        currentStep: state.currentStep,
        isGuidedTour: state.isGuidedTour
      })
    }
  )
)