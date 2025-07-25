"use client"

import { useState, useCallback, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RichTextEditor } from '@/components/RichTextEditor'
import { QualityChecker } from '@/components/QualityChecker'
import { AiAssistant } from '@/components/AiAssistant'
import { SaveStatusIndicator } from '@/components/SaveStatusIndicator'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ModulesHubWithAdd } from '@/components/ModulesHubWithAdd'
import { SourcesHubWithAdd } from '@/components/SourcesHubWithAdd'
import { 
  ChevronLeft,
  Save,
  Share2,
  FileText,
  Target,
  Brain,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useEnhancedToast } from '@/lib/notifications/useEnhancedToast'
import { 
  useEnterpriseDemoData,
  getEnterpriseRequestById, 
  getEnterpriseWorkingDocByRequestId, 
  getEnterpriseModulesByDocId, 
  getEnterpriseSourcesByDocId
} from '@/lib/demo/enterpriseDemoAdapter'
import { useEnterpriseDemoStore } from '@/lib/demo/enterpriseDemoState'

type TabType = 'editor' | 'quality-checker' | 'ai-assistant'

export default function WorkingDocEditPage() {
  const params = useParams()
  const router = useRouter()
  const docId = params.id as string
  
  // Get data from enterprise demo
  const { requests, workingDocs, modules: allModules, sources: allSources } = useEnterpriseDemoData()
  const { isDemoMode } = useEnterpriseDemoStore()
  
  // Find working doc by ID or create if new
  const workingDoc = workingDocs.find(d => d.id === docId)
  const request = workingDoc ? getEnterpriseRequestById(workingDoc.requestId, requests) : null
  const docModules = workingDoc ? getEnterpriseModulesByDocId(workingDoc.id, allModules) : []
  const docSources = workingDoc ? getEnterpriseSourcesByDocId(workingDoc.id, allSources) : []

  // State
  const [activeTab, setActiveTab] = useState<TabType>('editor')
  const [content, setContent] = useState(workingDoc?.briefMD || '')
  const [title, setTitle] = useState(request?.guest || 'Untitled Document')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [wordCount, setWordCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [currentModules, setCurrentModules] = useState(docModules)
  const [currentSources, setCurrentSources] = useState(docSources)

  const { success, error } = useEnhancedToast()

  // Auto-save simulation
  const simulateAutoSave = useCallback(async () => {
    if (!isOnline) return
    
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setLastSaved(new Date())
    setIsSaving(false)
  }, [isOnline])

  // Handle AI suggestion application
  const handleApplySuggestion = useCallback(async (suggestion: string) => {
    setContent(prev => prev + '\n\n' + suggestion)
    
    setTimeout(() => simulateAutoSave(), 1000)
    
    success({
      title: "AI suggestion applied",
      description: "Content has been integrated into your document",
      category: 'system'
    })
  }, [simulateAutoSave, success])

  // Handle quality issue resolution
  const handleResolveFlag = useCallback(async (flagId: string) => {
    success({
      title: "Issue resolved",
      description: "Quality issue has been marked as resolved",
      category: 'system'
    })
  }, [success])

  // Export handler
  const handleExport = useCallback(async () => {
    success({
      title: "Export started",
      description: "Your document is being prepared for export",
      category: 'system'
    })
  }, [success])

  // Add module handler
  const handleAddModule = useCallback(async (moduleData: any) => {
    const newModule = {
      id: `mod-${Date.now()}`,
      workingDocId: docId,
      name: moduleData.name,
      variant: moduleData.variant || 'standard',
      status: 'pending' as const,
      isEnabled: true,
      order: currentModules.length,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setCurrentModules(prev => [...prev, newModule])
    
    success({
      title: "Module added",
      description: `${moduleData.name} has been added to your document`,
      category: 'system'
    })

    setTimeout(() => simulateAutoSave(), 500)
  }, [currentModules.length, docId, simulateAutoSave, success])

  // Add source handler
  const handleAddSource = useCallback(async (sourceData: any) => {
    const newSource = {
      id: `src-${Date.now()}`,
      workingDocId: docId,
      type: sourceData.type || 'T',
      title: sourceData.title,
      url: sourceData.url,
      domain: sourceData.domain || new URL(sourceData.url).hostname,
      capturedBy: 'manual' as const,
      notes: sourceData.notes,
      createdAt: new Date()
    }

    setCurrentSources(prev => [...prev, newSource])
    
    success({
      title: "Source added",
      description: `${sourceData.title} has been added to your sources`,
      category: 'system'
    })

    setTimeout(() => simulateAutoSave(), 500)
  }, [docId, simulateAutoSave, success])

  // Word count tracking
  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length
    setWordCount(words)
  }, [content])

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (content && !isSaving) {
        simulateAutoSave()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [content, isSaving, simulateAutoSave])

  const tabs = [
    { 
      id: 'editor', 
      label: 'Editor', 
      icon: FileText,
      description: 'Document editing and writing'
    },
    { 
      id: 'quality-checker', 
      label: 'QualityChecker', 
      icon: Target,
      description: 'Content quality analysis'
    },
    { 
      id: 'ai-assistant', 
      label: 'AiAssistant', 
      icon: Brain,
      description: 'AI-powered writing assistance'
    }
  ] as const

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <div className="h-full flex flex-col">
            <div className="border-b px-4 py-3 bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Working on:</span>
                  <Badge variant="outline">
                    {currentModules.find(m => m.status === 'active')?.name || 'Select a module'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {wordCount} words
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
          </div>
        )
      
      case 'quality-checker':
        return (
          <QualityChecker
            workingDocId={docId}
            content={content}
            onResolveFlag={handleResolveFlag}
          />
        )
      
      case 'ai-assistant':
        return (
          <AiAssistant
            currentModule={currentModules.find(m => m.status === 'active')}
            sources={currentSources}
            content={content}
            onApplySuggestion={handleApplySuggestion}
          />
        )
      
      default:
        return <div>Tab not found</div>
    }
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/working-doc">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              <p className="text-sm text-muted-foreground">
                Last saved {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={simulateAutoSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Share2 className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary bg-muted/30"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/20"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Holy Trinity Layout with Tab Content */}
        <div className="flex-1 overflow-hidden">
          <PanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Modules with Add Functionality */}
            <Panel defaultSize={25} minSize={20} maxSize={35}>
              <ModulesHubWithAdd
                className="h-full border-r"
                modules={currentModules}
                onModuleClick={(module) => {
                  success({
                    title: "Module selected",
                    description: `${module.name} is now active`,
                    category: 'system'
                  })
                }}
                onModuleToggle={(moduleId) => {
                  setCurrentModules(prev => prev.map(m => 
                    m.id === moduleId ? { ...m, isEnabled: !m.isEnabled } : m
                  ))
                  success({
                    title: "Module toggled",
                    description: "Module status updated",
                    category: 'system'
                  })
                }}
                onAddModule={handleAddModule}
              />
            </Panel>
            
            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize" />

            {/* Center Panel - Tab Content */}
            <Panel defaultSize={50} minSize={40}>
              <ErrorBoundary>
                {renderTabContent()}
              </ErrorBoundary>
            </Panel>

            <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize" />

            {/* Right Panel - Sources with Add/Search Functionality */}
            <Panel defaultSize={25} minSize={20} maxSize={35}>
              <SourcesHubWithAdd
                className="h-full border-l"
                sources={currentSources}
                onInsertCitation={(source) => {
                  setContent(prev => prev + `\n[${source.title}](${source.url})`)
                  success({
                    title: "Citation inserted",
                    description: `Added citation from ${source.domain}`,
                    category: 'system'
                  })
                }}
                onSourceClick={(source) => {
                  console.log('Source clicked:', source)
                }}
                onAddSource={handleAddSource}
              />
            </Panel>
          </PanelGroup>
        </div>

        {/* Save Status Indicator */}
        <div className="fixed bottom-4 left-4 z-30">
          <SaveStatusIndicator
            isSaving={isSaving}
            lastSaved={lastSaved}
            isOnline={isOnline}
            wordCount={wordCount}
          />
        </div>
      </div>
    </ErrorBoundary>
  )
}