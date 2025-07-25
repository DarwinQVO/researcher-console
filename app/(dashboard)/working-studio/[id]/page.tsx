"use client"

import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { RichTextEditor } from '@/components/RichTextEditor'
import { SourcesHub } from '@/components/SourcesHub'
import { AiAssistDrawer } from '@/components/AiAssistDrawer'
import { QcOverlay } from '@/components/QcOverlay'
import { ExportModal } from '@/components/ExportModal'
import { WorkingStudioTabs, WorkingTab, TabType, createTab } from '@/components/WorkingStudioTabs'
import { ModulesGallery } from '@/components/ModulesGallery'
import { SourcesGallery } from '@/components/SourcesGallery'
import { ModuleDetailView } from '@/components/ModuleDetailView'
import { SourceDetailView } from '@/components/SourceDetailView'
import { SourceViewer } from '@/components/SourceViewer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ChevronLeft,
  Save,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  ToggleLeft,
  ToggleRight,
  Brain,
  Wand2,
  Grid,
  Image
} from 'lucide-react'
import { Source, Module, WorkingDoc, SourceType } from '@/models/types'
import Link from 'next/link'
import { useEnhancedToast } from '@/lib/notifications/useEnhancedToast'
import { LoadingState } from '@/components/LoadingStates'
// Removed collaboration features
import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { SaveStatusIndicator } from '@/components/SaveStatusIndicator'
import { 
  useEnterpriseDemoData,
  getEnterpriseRequestById, 
  getEnterpriseWorkingDocByRequestId, 
  getEnterpriseModulesByDocId, 
  getEnterpriseSourcesByDocId
} from '@/lib/demo/enterpriseDemoAdapter'
import { useEnterpriseDemoStore } from '@/lib/demo/enterpriseDemoState'
import { mockAISuggestions } from '@/lib/mock/mockData'

export default function WorkingStudioPage() {
  const params = useParams()
  const requestId = params.id as string
  
  // Get data from enterprise demo or mock
  const { requests, workingDocs, modules: allModules, sources: allSources } = useEnterpriseDemoData()
  const { isDemoMode, currentStep, steps } = useEnterpriseDemoStore()
  
  const request = getEnterpriseRequestById(requestId, requests)
  const workingDoc = getEnterpriseWorkingDocByRequestId(requestId, workingDocs)
  const docModules = workingDoc ? getEnterpriseModulesByDocId(workingDoc.id, allModules) : []
  const docSources = workingDoc ? getEnterpriseSourcesByDocId(workingDoc.id, allSources) : []

  // Handle case where request doesn't exist yet (especially in demo mode)
  if (!request && isDemoMode) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Header skeleton to make navigation detection work */}
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-muted rounded animate-pulse"></div>
            <div>
              <div className="w-32 h-4 bg-muted rounded animate-pulse mb-1"></div>
              <div className="w-24 h-3 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Preparando workspace...</p>
            <p className="text-xs text-muted-foreground mt-2">Cargando datos del demo...</p>
          </div>
        </main>
      </div>
    )
  }
  
  const [modules, setModules] = useState(docModules)
  const [content, setContent] = useState(workingDoc?.briefMD || '')
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false)
  const [isQcOverlayOpen, setIsQcOverlayOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Prevent overlay conflicts - close others when one opens
  const handleAiDrawerToggle = () => {
    setIsAiDrawerOpen(prev => {
      const newState = !prev
      if (newState) {
        setIsQcOverlayOpen(false) // Close QC when opening AI
        setIsExportModalOpen(false) // Close Export when opening AI
      }
      return newState
    })
  }

  const handleQcOverlayToggle = () => {
    setIsQcOverlayOpen(prev => {
      const newState = !prev
      if (newState) {
        setIsAiDrawerOpen(false) // Close AI when opening QC
        setIsExportModalOpen(false) // Close Export when opening QC
      }
      return newState
    })
  }

  const handleExportModalToggle = () => {
    setIsExportModalOpen(prev => {
      const newState = !prev
      if (newState) {
        setIsAiDrawerOpen(false) // Close AI when opening Export
        setIsQcOverlayOpen(false) // Close QC when opening Export
      }
      return newState
    })
  }
  const [activeModule, setActiveModule] = useState<Module | undefined>(
    docModules.find(m => m.status === 'active')
  )
  
  // Tab system state - Only 2 tabs maximum: Editor + one secondary tab
  const [tabs, setTabs] = useState<WorkingTab[]>([
    createTab('editor', 'Document Editor', { content }, false)
  ])
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [aiProgress, setAiProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const { 
    saveNotification, 
    citationNotification, 
    aiNotification, 
    exportNotification, 
    connectionNotification,
    success,
    error
  } = useEnhancedToast()
  const { isShortcutsOpen, openShortcuts, closeShortcuts } = useKeyboardShortcuts()

  // Tab management handlers
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId)
  }

  const handleTabClose = (tabId: string) => {
    if (tabs.length <= 1) return // Don't close the last tab
    const tabIndex = tabs.findIndex(tab => tab.id === tabId)
    const newTabs = tabs.filter(tab => tab.id !== tabId)
    setTabs(newTabs)
    
    // If we closed the active tab, switch to another one
    if (activeTabId === tabId) {
      const newActiveIndex = Math.max(0, tabIndex - 1)
      setActiveTabId(newTabs[newActiveIndex]?.id || newTabs[0]?.id)
    }
  }

  const openSecondaryTab = (type: TabType, title: string, data: any) => {
    // Find any existing secondary tab (everything except editor)
    const existingSecondaryTab = tabs.find(tab => tab.type !== 'editor')
    
    if (existingSecondaryTab) {
      // Replace the existing secondary tab with the new one
      const newTab = createTab(type, title, data)
      setTabs(prev => prev.map(tab => 
        tab.type !== 'editor' ? newTab : tab
      ))
      setActiveTabId(newTab.id)
    } else {
      // Add new secondary tab (only if we don't have one)
      const newTab = createTab(type, title, data)
      setTabs(prev => [...prev, newTab])
      setActiveTabId(newTab.id)
    }
  }

  const openModuleTab = (module: Module) => {
    openSecondaryTab('module', module.name, module)
  }

  const openSourceTab = (source: Source) => {
    openSecondaryTab('source', source.title, source)
  }

  const openModulesGallery = () => {
    openSecondaryTab('modules-gallery', 'Gallery Of Modules', { modules })
  }

  const openSourcesGallery = () => {
    openSecondaryTab('sources-gallery', 'Gallery Of Sources', { sources: docSources })
  }

  const openSourceViewer = (source: Source) => {
    openSecondaryTab('source-viewer', `View: ${source.title}`, source)
  }

  // Force data refresh in demo mode when component mounts
  useEffect(() => {
    if (isDemoMode && !request) {
      console.log('[Working Studio] Demo mode detected, no request data yet. This should resolve when demo creates the request.')
    }
  }, [isDemoMode, request])

  // Define callbacks first
  const simulateAutoSave = useCallback(async () => {
    if (!isOnline) return
    
    setIsSaving(true)
    
    // Simulate network delay
    const delay = Math.random() * 1000 + 800
    await new Promise(resolve => setTimeout(resolve, delay))
    
    setLastSaved(new Date())
    setIsSaving(false)
    
    // Don't show toast for auto-save - handled by discrete indicator
    // saveNotification removed to prevent spam
  }, [saveNotification, isOnline, wordCount])

  const handleModuleToggle = useCallback(async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, isEnabled: !module.isEnabled }
        : module
    ))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    success({
      title: module?.isEnabled ? "Módulo deshabilitado" : "Módulo habilitado",
      description: `${module?.name} ha sido ${module?.isEnabled ? 'deshabilitado' : 'habilitado'}`,
      category: 'system'
    })

  }, [modules, success])

  const handleInsertCitation = useCallback(async (source: Source) => {
    const citation = `[${source.title}](${source.url}) (${source.type})`
    // In real implementation, this would insert at cursor position
    setContent(prev => prev + '\n\n' + citation)
    
    // Simulate insertion feedback
    citationNotification({
      title: "Cita insertada",
      description: `Agregada cita de ${source.domain}`,
      variant: "success"
    })

    // Trigger auto-save after insertion
    setTimeout(() => simulateAutoSave(), 1000)
  }, [citationNotification, simulateAutoSave])

  const handleApplySuggestion = useCallback(async (suggestion: string) => {
    setIsAiProcessing(true)
    setAiProgress(0)
    
    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
    
    setAiProgress(100)
    
    // Insert content
    setContent(prev => prev + '\n\n' + suggestion)
    
    setTimeout(() => {
      setIsAiProcessing(false)
      setAiProgress(0)
      
      aiNotification({
        title: "Sugerencia de IA aplicada",
        description: "Contenido integrado inteligentemente",
        variant: "success"
      })
    }, 500)

    // Trigger save
    setTimeout(() => simulateAutoSave(), 1500)
  }, [aiNotification, simulateAutoSave])

  const handleResolveFlag = useCallback(async (flagId: string) => {
    success({
      title: "Problema resuelto",
      description: "El problema de control de calidad ha sido marcado como resuelto",
      category: 'system'
    })
    
  }, [success])

  const handleExport = useCallback(async (options: any) => {
    exportNotification({
      title: "Exportación iniciada",
      description: `Generando documento ${options.format}...`,
      variant: "default"
    })
    
    // Simulate progressive export with multiple stages
    const stages = [
      { name: "Analyzing content", duration: 1000 },
      { name: "Formatting document", duration: 1500 },
      { name: "Applying styles", duration: 800 },
      { name: "Generating file", duration: 1200 },
      { name: "Finalizing", duration: 500 }
    ]
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i]
      
      exportNotification({
        title: "Exportando...",
        description: `${stage.name} (${Math.round(((i + 1) / stages.length) * 100)}%)`,
        variant: "default",
        showToast: false // Don't show individual stage toasts
      })
      
      await new Promise(resolve => setTimeout(resolve, stage.duration))
    }
    
    // Simulate file generation
    exportNotification({
      title: "¡Exportación completa!",
      description: `Tu archivo ${options.format} está listo para descargar`,
      variant: "success"
    })
    
    // Simulate download
    if (typeof window !== 'undefined') {
      const link = document.createElement('a')
      link.href = '#'
      link.download = `interview-prep.${options.format === 'pdf' ? 'pdf' : 'docx'}`
      link.click()
    }
  }, [exportNotification])

  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  // Auto-save simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (content && !isSaving) {
        simulateAutoSave()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(interval)
  }, [content, isSaving, simulateAutoSave])

  // Word count tracking
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)
  }, [content])

  // Simulate network status
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly simulate network issues (5% chance)
      if (Math.random() < 0.05) {
        setIsOnline(false)
        connectionNotification({
          title: "Conexión perdida",
          description: "Intentando reconectar...",
          variant: "destructive"
        })
        
        // Reconnect after 2-5 seconds
        setTimeout(() => {
          setIsOnline(true)
          connectionNotification({
            title: "Reconectado",
            description: "Tu trabajo se está sincronizando",
            variant: "success"
          })
        }, 2000 + Math.random() * 3000)
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [connectionNotification])

  // Demo content updates
  useEffect(() => {
    if (!isDemoMode) return
    
    const currentStepData = steps[currentStep]
    if (!currentStepData || !currentStepData.completed) return
    
    // Update content when specific demo steps complete
    if (currentStepData.action === 'populate_content' && currentStepData.data?.content) {
      setTimeout(() => {
        console.log('[Working Studio] Updating content from demo')
        setContent(currentStepData.data.content)
      }, 1000)
    }
    
    // Update modules when modules are added
    if (currentStepData.action === 'add_modules' && currentStepData.data) {
      setTimeout(() => {
        console.log('[Working Studio] Updating modules from demo')
        setModules(currentStepData.data)
        
        // Set the first module as active
        const firstModule = Array.isArray(currentStepData.data) ? currentStepData.data[0] : currentStepData.data
        if (firstModule) {
          setActiveModule(firstModule)
        }
      }, 500)
    }
  }, [isDemoMode, currentStep, steps])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command/Ctrl + S for save
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        simulateAutoSave()
        return
      }
      
      // Command/Ctrl + E for export
      if ((event.metaKey || event.ctrlKey) && event.key === 'e') {
        event.preventDefault()
        handleExportModalToggle()
        return
      }
      
      // Command/Ctrl + K for AI assist
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        handleAiDrawerToggle()
        return
      }
      
      // Command/Ctrl + Q for QC
      if ((event.metaKey || event.ctrlKey) && event.key === 'q') {
        event.preventDefault()
        handleQcOverlayToggle()
        return
      }
      
      // Command/Ctrl + / for shortcuts help
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault()
        openShortcuts()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [simulateAutoSave, openShortcuts, handleAiDrawerToggle, handleQcOverlayToggle, handleExportModalToggle])

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/requests">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{request?.guest || 'Loading...'}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          
          <Button variant="ghost" size="sm" onClick={simulateAutoSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button 
            size="sm"
            onClick={handleExportModalToggle}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>


      {/* AI Processing Overlay */}
      {isAiProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-60 flex items-center justify-center">
          <div className="bg-background border rounded-lg p-6 shadow-lg max-w-sm w-full mx-4">
            <LoadingState 
              type="ai" 
              message="AI is processing your request"
              progress={aiProgress}
              subMessage="Analyzing content and generating suggestions..."
            />
          </div>
        </div>
      )}

      {/* Main Content with Resizable Panels */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar Panel */}
        <Panel defaultSize={20} minSize={15} maxSize={30}>
          <ErrorBoundary>
            <aside className="h-full border-r bg-muted/30 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Document Modules
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={openModulesGallery}
                className="text-xs flex items-center gap-1"
              >
                <Grid className="h-3 w-3" />
                Gallery Of Modules
              </Button>
            </div>
            
            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeModule?.id === module.id ? 'bg-background border-primary' : 'hover:bg-background/50'
                  }`}
                  onClick={() => {
                    setActiveModule(module)
                    openModuleTab(module)
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(module.status)}
                      <span className="font-medium text-sm">{module.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleModuleToggle(module.id)
                      }}
                    >
                      {module.isEnabled ? 
                        <ToggleRight className="h-4 w-4 text-primary" /> : 
                        <ToggleLeft className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {module.variant}
                  </Badge>
                </div>
              ))}
            </div>
            </aside>
          </ErrorBoundary>
        </Panel>
        
        {/* Resize Handle */}
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize active:bg-primary/40" />

        {/* Center Panel Group with Vertical Split */}
        <Panel defaultSize={55} minSize={40}>
          <PanelGroup direction="vertical">
            {/* Main Editor Panel */}
            <Panel defaultSize={70} minSize={50}>
              <ErrorBoundary>
                <WorkingStudioTabs
                  tabs={tabs}
                  activeTabId={activeTabId}
                  onTabChange={handleTabChange}
                  onTabClose={handleTabClose}
                  onAiAssistToggle={handleAiDrawerToggle}
                  onQualityCheckToggle={handleQcOverlayToggle}
                >
                  {(tab) => {
                    switch (tab.type) {
                      case 'editor':
                        return (
                          <div className="h-full flex flex-col">
                            <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/10">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Working on:</span>
                                <Badge variant="outline">{activeModule?.name || 'Select a module'}</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                {/* AI Assist moved to tab level */}
                              </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                              <RichTextEditor
                                content={content}
                                onChange={setContent}
                              />
                            </div>
                          </div>
                        )
                      case 'modules-gallery':
                        return (
                          <ModulesGallery
                            modules={tab.data?.modules || modules}
                            onModuleClick={openModuleTab}
                            onModuleToggle={handleModuleToggle}
                          />
                        )
                      case 'sources-gallery':
                        return (
                          <SourcesGallery
                            sources={tab.data?.sources || docSources}
                            onSourceClick={openSourceTab}
                            onInsertCitation={handleInsertCitation}
                          />
                        )
                      case 'module':
                        return (
                          <ModuleDetailView
                            module={tab.data}
                            onToggle={() => handleModuleToggle(tab.data?.id)}
                            onContentChange={(newContent) => {
                              // Update the module content
                              setModules(prev => prev.map(m => 
                                m.id === tab.data?.id ? { ...m, content: newContent } : m
                              ))
                            }}
                          />
                        )
                      case 'source':
                        return (
                          <SourceDetailView
                            source={tab.data}
                            onInsertCitation={() => handleInsertCitation(tab.data)}
                          />
                        )
                      case 'source-viewer':
                        return (
                          <SourceViewer
                            source={tab.data}
                            onBack={() => handleTabClose(tab.id)}
                            onInsertCitation={handleInsertCitation}
                          />
                        )
                      default:
                        return <div className="p-4">Tab content not implemented</div>
                    }
                  }}
                </WorkingStudioTabs>
              </ErrorBoundary>
            </Panel>

            {/* Vertical Resize Handle */}
            <PanelResizeHandle className="h-1 bg-border hover:bg-primary/20 transition-colors cursor-row-resize active:bg-primary/40" />

            {/* Bottom Panel - Preview/Notes */}
            <Panel defaultSize={30} minSize={20} maxSize={50}>
              <div className="h-full border-t bg-muted/10 p-4 overflow-y-auto">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Quick Notes & Preview</h4>
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Word count: {wordCount}
                  </div>
                  <div className="prose prose-sm max-w-none text-sm">
                    <div dangerouslySetInnerHTML={{ __html: content.slice(0, 200) + '...' }} />
                  </div>
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize active:bg-primary/40" />

        {/* Right Sidebar Panel */}
        <Panel defaultSize={25} minSize={20} maxSize={40}>
          <ErrorBoundary>
            <SourcesHub
              sources={docSources}
              onInsertCitation={handleInsertCitation}
              onSourceClick={openSourceTab}
              onOpenGallery={openSourcesGallery}
              onOpenViewer={openSourceViewer}
              className="h-full"
            />
          </ErrorBoundary>
        </Panel>
      </PanelGroup>

      {/* Floating Action Button removed - using brain icon instead */}

      {/* AI Assist Drawer */}
      <AiAssistDrawer
        isOpen={isAiDrawerOpen}
        onToggle={handleAiDrawerToggle}
        currentModule={activeModule}
        sources={docSources}
        onApplySuggestion={handleApplySuggestion}
      />

      {/* QC Overlay */}
      <QcOverlay
        isOpen={isQcOverlayOpen}
        onClose={() => setIsQcOverlayOpen(false)}
        workingDocId={workingDoc?.id || ''}
        onResolveFlag={handleResolveFlag}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={request?.guest || 'Document'}
        onExport={handleExport}
      />

      {/* Collaboration features removed */}
      
      {/* Discrete Save Status Indicator - Fixed Position */}
      <div className="fixed bottom-4 left-4 z-30">
        <SaveStatusIndicator
          isSaving={isSaving}
          lastSaved={lastSaved}
          isOnline={isOnline}
          wordCount={wordCount}
        />
      </div>
      
        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={closeShortcuts} />
      </div>
    </ErrorBoundary>
  )
}