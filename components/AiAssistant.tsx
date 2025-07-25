"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { 
  Brain,
  Send,
  Sparkles,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Lightbulb,
  FileText,
  Search,
  Wand2,
  Clock,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Module, Source } from '@/models/types'

interface AiSuggestion {
  id: string
  type: 'content' | 'structure' | 'research' | 'citation'
  title: string
  content: string
  confidence: number
  category: string
  timestamp: Date
  applied?: boolean
}

interface AiAssistantProps {
  currentModule?: Module
  sources?: Source[]
  content?: string
  onApplySuggestion?: (suggestion: string) => void
  className?: string
}

export function AiAssistant({ 
  currentModule, 
  sources = [], 
  content = '',
  onApplySuggestion,
  className 
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([])
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'insights'>('suggestions')
  const [chatHistory, setChatHistory] = useState<Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>>([])

  // Mock AI suggestions
  const mockSuggestions: AiSuggestion[] = [
    {
      id: '1',
      type: 'content',
      title: 'Executive Summary Enhancement',
      content: 'Based on your research, consider adding a brief section about market trends to strengthen the executive summary. This would provide better context for stakeholders.',
      confidence: 92,
      category: 'Structure',
      timestamp: new Date(Date.now() - 300000), // 5 min ago
    },
    {
      id: '2',
      type: 'citation',
      title: 'Source Integration',
      content: 'The TechCrunch article from your sources would be perfect to support your claims about startup funding trends. Consider citing it in paragraph 3.',
      confidence: 87,
      category: 'Research',
      timestamp: new Date(Date.now() - 600000), // 10 min ago
    },
    {
      id: '3',
      type: 'research',
      title: 'Additional Research Angle',
      content: 'Have you considered exploring the competitive landscape? Your current modules suggest this could add valuable depth to your analysis.',
      confidence: 78,
      category: 'Content',
      timestamp: new Date(Date.now() - 900000), // 15 min ago
    }
  ]

  useEffect(() => {
    setSuggestions(mockSuggestions)
  }, [])

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return

    setIsProcessing(true)
    
    // Add user message to chat
    const userMessage = {
      role: 'user' as const,
      content: prompt,
      timestamp: new Date()
    }
    setChatHistory(prev => [...prev, userMessage])

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI response
    const aiResponse = {
      role: 'assistant' as const,
      content: `I understand you're looking for help with "${prompt}". Based on your current content and modules, here are some suggestions...`,
      timestamp: new Date()
    }
    setChatHistory(prev => [...prev, aiResponse])

    setPrompt('')
    setIsProcessing(false)
  }

  const handleApplySuggestion = (suggestion: AiSuggestion) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id ? { ...s, applied: true } : s
    ))
    onApplySuggestion?.(suggestion.content)
  }

  const generateSuggestions = async () => {
    setIsProcessing(true)
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const newSuggestion: AiSuggestion = {
      id: Date.now().toString(),
      type: 'content',
      title: 'AI Generated Insight',
      content: 'Based on your current progress, consider expanding on the methodology section to provide more clarity for readers.',
      confidence: 85,
      category: 'Enhancement',
      timestamp: new Date()
    }

    setSuggestions(prev => [newSuggestion, ...prev])
    setIsProcessing(false)
  }

  const getSuggestionIcon = (type: AiSuggestion['type']) => {
    switch (type) {
      case 'content':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'structure':
        return <Wand2 className="h-4 w-4 text-purple-500" />
      case 'research':
        return <Search className="h-4 w-4 text-green-500" />
      case 'citation':
        return <MessageSquare className="h-4 w-4 text-orange-500" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 75) return 'text-blue-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Assistant
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={generateSuggestions}
            disabled={isProcessing}
          >
            <Sparkles className={cn("h-4 w-4 mr-2", isProcessing && "animate-spin")} />
            Generate
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          {(['suggestions', 'chat', 'insights'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'suggestions' && <Lightbulb className="h-3 w-3 mr-1" />}
              {tab === 'chat' && <MessageSquare className="h-3 w-3 mr-1" />}
              {tab === 'insights' && <TrendingUp className="h-3 w-3 mr-1" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'suggestions' && (
          <div className="p-4">
            {/* Processing Indicator */}
            {isProcessing && (
              <Card className="mb-4 border-blue-200 bg-blue-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm">AI is analyzing your content...</span>
                  </div>
                  <Progress value={65} className="mt-2" />
                </CardContent>
              </Card>
            )}

            {/* Suggestions */}
            <div className="space-y-3">
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className={cn(
                  "hover:shadow-md transition-shadow",
                  suggestion.applied && "border-green-200 bg-green-50"
                )}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getSuggestionIcon(suggestion.type)}
                        <div>
                          <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                          <CardDescription className="text-xs flex items-center gap-2">
                            <span>{suggestion.category}</span>
                            <span>•</span>
                            <span className={getConfidenceColor(suggestion.confidence)}>
                              {suggestion.confidence}% confidence
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        {suggestion.applied && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Applied
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {!suggestion.applied && (
                          <Button
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion)}
                          >
                            <Wand2 className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.timestamp.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {suggestions.length === 0 && !isProcessing && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No AI suggestions yet</p>
                <p className="text-xs text-muted-foreground mb-4">
                  AI will analyze your content and provide intelligent suggestions
                </p>
                <Button size="sm" onClick={generateSuggestions}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Suggestions
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 text-sm",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {chatHistory.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Start a conversation with AI</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ask questions about your content or request help
                  </p>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask AI for help..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendPrompt()}
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendPrompt}
                  disabled={isProcessing || !prompt.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="p-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Content Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Word Count</div>
                      <div className="text-muted-foreground">{content.split(' ').length} words</div>
                    </div>
                    <div>
                      <div className="font-medium">Reading Time</div>
                      <div className="text-muted-foreground">~{Math.ceil(content.split(' ').length / 200)} min</div>
                    </div>
                    <div>
                      <div className="font-medium">Sources Used</div>
                      <div className="text-muted-foreground">{sources.length} sources</div>
                    </div>
                    <div>
                      <div className="font-medium">Modules Active</div>
                      <div className="text-muted-foreground">{currentModule ? 1 : 0} modules</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Document structure is well organized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span>Consider adding more citations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-purple-500" />
                      <span>Content depth is appropriate</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}