"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Sparkles, 
  Search, 
  FileText, 
  RefreshCw,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2,
  Wand2
} from 'lucide-react'
import { Module, Source } from '@/models/types'
import { mockAISuggestions } from '@/lib/mock/mockData'

interface AiAssistDrawerProps {
  isOpen: boolean
  onToggle: () => void
  currentModule?: Module
  sources: Source[]
  onApplySuggestion: (suggestion: string) => void
}

export function AiAssistDrawer({
  isOpen,
  onToggle,
  currentModule,
  sources,
  onApplySuggestion
}: AiAssistDrawerProps) {
  const [activeTab, setActiveTab] = useState<'queries' | 'extract' | 'rewrite'>('queries')
  const [isLoading, setIsLoading] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  // Use mock data
  const mockQuerySuggestions = mockAISuggestions.queries

  const mockExtractions = mockAISuggestions.extractions.map(ext => ({
    source: ext.source,
    text: ext.text,
    relevance: ext.relevance
  }))

  const handleExtract = async () => {
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleRewrite = async () => {
    setIsLoading(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <>
      {/* Toggle Button */}
      <motion.div
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Button
          onClick={onToggle}
          variant="default"
          size="lg"
          className="rounded-full shadow-lg flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          AI Assist
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </motion.div>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-xl z-50 h-[400px]"
          >
            <div className="container mx-auto p-4 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">AI Assistant</h3>
                  {currentModule && (
                    <Badge variant="secondary">
                      Module: {currentModule.name}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="queries" className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Suggest Queries
                  </TabsTrigger>
                  <TabsTrigger value="extract" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Auto-Extract
                  </TabsTrigger>
                  <TabsTrigger value="rewrite" className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Re-write → Spec
                  </TabsTrigger>
                </TabsList>

                {/* Query Suggestions */}
                <TabsContent value="queries" className="flex-1 overflow-auto">
                  <div className="space-y-2">
                    {mockQuerySuggestions.map((query, index) => (
                      <Card
                        key={index}
                        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => onApplySuggestion(query)}
                      >
                        <div className="flex items-start justify-between">
                          <p className="text-sm flex-1">{query}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 ml-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              navigator.clipboard.writeText(query)
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Auto-Extract */}
                <TabsContent value="extract" className="flex-1">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Extract relevant content from {sources.length} sources
                      </p>
                      <Button
                        onClick={handleExtract}
                        disabled={isLoading}
                        size="sm"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Extract
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2 overflow-auto max-h-[250px]">
                      {mockExtractions.map((extraction, index) => (
                        <Card key={index} className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <Badge variant="outline" className="text-xs">
                              {extraction.source}
                            </Badge>
                            <Badge className="text-xs">
                              {extraction.relevance}
                            </Badge>
                          </div>
                          <p className="text-sm">{extraction.text}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2"
                            onClick={() => onApplySuggestion(extraction.text)}
                          >
                            Insert
                          </Button>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Re-write */}
                <TabsContent value="rewrite" className="flex-1">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Paste content to rewrite according to spec..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-[150px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCustomPrompt('')}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleRewrite}
                        disabled={!customPrompt || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Rewriting...
                          </>
                        ) : (
                          <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Rewrite
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}