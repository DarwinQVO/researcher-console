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
  Wand2
} from 'lucide-react'
import { Source, Module, WorkingDoc, SourceType } from '@/models/types'
import Link from 'next/link'
import { useToast } from '@/lib/use-toast'
import { LoadingState } from '@/components/LoadingStates'
import { Progress } from '@/components/ui/progress'
import { CollaborationCursors, CollaborationIndicator } from '@/components/CollaborationCursors'
import { KeyboardShortcuts, useKeyboardShortcuts } from '@/components/KeyboardShortcuts'
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
  const [activeModule, setActiveModule] = useState<Module | undefined>(
    docModules.find(m => m.status === 'active')
  )
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [progress, setProgress] = useState(75) // Overall completion
  const [isAiProcessing, setIsAiProcessing] = useState(false)
  const [aiProgress, setAiProgress] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const { toast } = useToast()
  const { isShortcutsOpen, openShortcuts, closeShortcuts } = useKeyboardShortcuts()

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
    
    // Only show toast occasionally to avoid spam
    if (Math.random() < 0.3) {
      toast({
        title: "Auto-saved",
        description: `${wordCount} words saved`,
        variant: "success"
      })
    }
  }, [toast, isOnline, wordCount])

  const handleModuleToggle = useCallback(async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, isEnabled: !module.isEnabled }
        : module
    ))

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    toast({
      title: module?.isEnabled ? "Module disabled" : "Module enabled",
      description: `${module?.name} has been ${module?.isEnabled ? 'disabled' : 'enabled'}`,
      variant: "success"
    })

    // Update progress
    if (!module?.isEnabled) {
      setProgress(prev => Math.min(prev + 5, 100))
    }
  }, [modules, toast])

  const handleInsertCitation = useCallback(async (source: Source) => {
    const citation = `[${source.title}](${source.url}) (${source.type})`
    // In real implementation, this would insert at cursor position
    setContent(prev => prev + '\n\n' + citation)
    
    // Simulate insertion feedback
    toast({
      title: "Citation inserted",
      description: `Added citation from ${source.domain}`,
      variant: "success"
    })

    // Trigger auto-save after insertion
    setTimeout(() => simulateAutoSave(), 1000)
  }, [toast, simulateAutoSave])

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
      
      toast({
        title: "AI suggestion applied",
        description: "Content has been intelligently integrated",
        variant: "success"
      })
    }, 500)

    // Update progress and trigger save
    setProgress(prev => Math.min(prev + 3, 100))
    setTimeout(() => simulateAutoSave(), 1500)
  }, [toast, simulateAutoSave])

  const handleResolveFlag = useCallback(async (flagId: string) => {
    toast({
      title: "Issue resolved",
      description: "Quality check issue has been marked as resolved",
      variant: "success"
    })
    
    setProgress(prev => Math.min(prev + 2, 100))
  }, [toast])

  const handleExport = useCallback(async (options: any) => {
    toast({
      title: "Export started",
      description: `Generating ${options.format} document...`,
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
      
      toast({
        title: "Exporting...",
        description: `${stage.name} (${Math.round(((i + 1) / stages.length) * 100)}%)`,
        variant: "default"
      })
      
      await new Promise(resolve => setTimeout(resolve, stage.duration))
    }
    
    // Simulate file generation
    toast({
      title: "Export complete!",
      description: `Your ${options.format} is ready for download`,
      variant: "success"
    })
    
    // Simulate download
    if (typeof window !== 'undefined') {
      const link = document.createElement('a')
      link.href = '#'
      link.download = `interview-prep.${options.format === 'pdf' ? 'pdf' : 'docx'}`
      link.click()
    }
  }, [toast])

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
        toast({
          title: "Connection lost",
          description: "Attempting to reconnect...",
          variant: "destructive"
        })
        
        // Reconnect after 2-5 seconds
        setTimeout(() => {
          setIsOnline(true)
          toast({
            title: "Reconnected",
            description: "Your work is being synced",
            variant: "success"
          })
        }, 2000 + Math.random() * 3000)
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [toast])

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
        setIsExportModalOpen(true)
        return
      }
      
      // Command/Ctrl + K for AI assist
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsAiDrawerOpen(true)
        return
      }
      
      // Command/Ctrl + Q for QC
      if ((event.metaKey || event.ctrlKey) && event.key === 'q') {
        event.preventDefault()
        setIsQcOverlayOpen(true)
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
  }, [simulateAutoSave, openShortcuts])

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
            <h1 className="text-lg font-semibold">{request?.guest || 'Loading...'} - Interview Prep</h1>
            <p className="text-sm text-muted-foreground">Working Document</p>
          </div>
          <Badge variant="secondary">{request?.tier || 'standard'} Tier</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mr-4">
            {isSaving ? (
              <>
                <LoadingState type="save" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>Last saved {lastSaved.toLocaleTimeString()}</span>
                <span className="text-xs">• {wordCount} words</span>
              </>
            )}
            <CollaborationIndicator activeUsers={Math.floor(Math.random() * 3) + 1} />
          </div>
          
          <Button variant="ghost" size="sm" onClick={simulateAutoSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsQcOverlayOpen(true)}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Quality Check
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b px-4 py-2 bg-muted/20">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-muted-foreground">Document Progress</span>
          <span className="font-medium">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* AI Processing Overlay */}
      {isAiProcessing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
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
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Document Modules
            </h3>
            
            <div className="space-y-2">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    activeModule?.id === module.id ? 'bg-background border-primary' : 'hover:bg-background/50'
                  }`}
                  onClick={() => setActiveModule(module)}
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
              <main className="h-full flex flex-col relative">
                {/* Editor Toolbar */}
                <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/10">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Working on:</span>
                    <Badge variant="outline">{activeModule?.name || 'Select a module'}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAiDrawerOpen(true)}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      <Brain className="h-4 w-4 mr-1" />
                      AI Assist
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  <ErrorBoundary>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                    />
                  </ErrorBoundary>
                </div>
              </main>
            </Panel>

            {/* Vertical Resize Handle */}
            <PanelResizeHandle className="h-1 bg-border hover:bg-primary/20 transition-colors cursor-row-resize active:bg-primary/40" />

            {/* Bottom Panel - Preview/Notes */}
            <Panel defaultSize={30} minSize={20} maxSize={50}>
              <div className="h-full border-t bg-muted/10 p-4 overflow-y-auto">
                <h4 className="font-medium mb-3 text-sm text-muted-foreground">Quick Notes & Preview</h4>
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Word count: {wordCount} | Progress: {Math.round(progress)}%
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
              className="h-full"
            />
          </ErrorBoundary>
        </Panel>
      </PanelGroup>

      {/* Floating Action Button for AI */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-40"
      >
        <Wand2 className="h-6 w-6" />
      </button>

      {/* AI Assist Drawer */}
      <AiAssistDrawer
        isOpen={isAiDrawerOpen}
        onToggle={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
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
        documentTitle={`${request?.guest || 'Document'} - Interview Prep`}
        onExport={handleExport}
      />

      {/* Collaboration Cursors */}
      <CollaborationCursors isEnabled={isOnline} />
      
        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcuts isOpen={isShortcutsOpen} onClose={closeShortcuts} />
      </div>
    </ErrorBoundary>
  )
}