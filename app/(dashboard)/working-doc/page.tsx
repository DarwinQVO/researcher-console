"use client"

import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RichTextEditor } from '@/components/RichTextEditor'
import { QualityChecker } from '@/components/QualityChecker'
import { AiAssistant } from '@/components/AiAssistant'
import { SaveStatusIndicator } from '@/components/SaveStatusIndicator'
import { ErrorBoundary } from '@/components/ErrorBoundary'
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

export default function WorkingDocPage() {
  const params = useParams()
  const requestId = params.id as string
  
  // Get data from enterprise demo
  const { requests, workingDocs, modules: allModules, sources: allSources } = useEnterpriseDemoData()
  const { isDemoMode } = useEnterpriseDemoStore()
  
  const request = getEnterpriseRequestById(requestId, requests)
  const workingDoc = getEnterpriseWorkingDocByRequestId(requestId, workingDocs)
  const docModules = workingDoc ? getEnterpriseModulesByDocId(workingDoc.id, allModules) : []
  const docSources = workingDoc ? getEnterpriseSourcesByDocId(workingDoc.id, allSources) : []

  // State
  const [activeTab, setActiveTab] = useState<TabType>('editor')
  const [content, setContent] = useState(workingDoc?.briefMD || '')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [progress, setProgress] = useState(75)
  const [wordCount, setWordCount] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [approvedModules, setApprovedModules] = useState<string[]>([])
  const [approvedChannels, setApprovedChannels] = useState<string[]>([])

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
    setProgress(prev => Math.min(prev + 3, 100))
    
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
    setProgress(prev => Math.min(prev + 2, 100))
  }, [success])

  // Export handler
  const handleExport = useCallback(async () => {
    success({
      title: "Export started",
      description: "Your document is being prepared for export",
      category: 'system'
    })
  }, [success])

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
                    {docModules.find(m => m.status === 'active')?.name || 'Select a module'}
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
            workingDocId={workingDoc?.id}
            content={content}
            onResolveFlag={handleResolveFlag}
          />
        )
      
      case 'ai-assistant':
        return (
          <AiAssistant
            currentModule={docModules.find(m => m.status === 'active')}
            sources={docSources}
            content={content}
            onApplySuggestion={handleApplySuggestion}
          />
        )
      
      default:
        return <div>Tab not found</div>
    }
  }

  // Loading state for demo mode
  if (!request && isDemoMode) {
    return (
      <div className="h-screen flex flex-col bg-background">
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
            <p className="text-muted-foreground">Preparing workspace...</p>
          </div>
        </main>
      </div>
    )
  }

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
              <h1 className="text-lg font-semibold">{request?.guest || 'Working Document'}</h1>
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

        {/* Progress Bar */}
        <div className="border-b px-4 py-2 bg-muted/20">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Document Progress</span>
            <span className="font-medium">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

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

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <ErrorBoundary>
            {renderTabContent()}
          </ErrorBoundary>
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