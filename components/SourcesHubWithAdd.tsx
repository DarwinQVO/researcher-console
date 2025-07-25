"use client"

import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  CornerDownLeft,
  ExternalLink,
  Filter,
  Copy,
  ChevronDown,
  FileText,
  Video,
  Mic,
  Database,
  Image,
  ArrowLeft,
  Calendar,
  User,
  Plus,
  Search,
  Globe,
  Link as LinkIcon,
  Upload
} from 'lucide-react'
import { Source, SourceType } from '@/models/types'
import { cn } from '@/lib/utils'

interface SourcesHubWithAddProps {
  sources: Source[]
  onInsertCitation: (source: Source) => void
  onSourceClick?: (source: Source) => void
  onOpenGallery?: () => void
  onOpenViewer?: (source: Source) => void
  onAddSource?: (sourceData: any) => void
  className?: string
}

const getSourceIcon = (type: SourceType) => {
  switch (type) {
    case 'I': return Mic
    case 'V': return Video
    case 'T': return FileText
    case 'SD': return Database
    default: return FileText
  }
}

const getSourceTypeColor = (type: SourceType) => {
  switch (type) {
    case 'I': return 'bg-green-100 text-green-800 border-green-200'
    case 'V': return 'bg-purple-100 text-purple-800 border-purple-200'
    case 'T': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'SD': return 'bg-orange-100 text-orange-800 border-orange-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Popular source suggestions
const sourceSuggestions = [
  {
    title: "TechCrunch - Latest Tech News",
    url: "https://techcrunch.com",
    domain: "techcrunch.com",
    type: "T" as SourceType,
    description: "Leading technology news and analysis"
  },
  {
    title: "Harvard Business Review",
    url: "https://hbr.org", 
    domain: "hbr.org",
    type: "T" as SourceType,
    description: "Business strategy and management insights"
  },
  {
    title: "MIT Technology Review",
    url: "https://technologyreview.com",
    domain: "technologyreview.com", 
    type: "T" as SourceType,
    description: "Deep technology analysis and trends"
  }
]

export function SourcesHubWithAdd({ 
  sources, 
  onInsertCitation, 
  onSourceClick,
  onOpenGallery,
  onOpenViewer,
  onAddSource,
  className 
}: SourcesHubWithAddProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | SourceType>('all')
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [webSearchQuery, setWebSearchQuery] = useState('')
  const [webSearchResults, setWebSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Manual add form
  const [manualForm, setManualForm] = useState({
    title: '',
    url: '', 
    type: 'T' as SourceType,
    notes: ''
  })

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.domain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || source.type === filterType
    return matchesSearch && matchesType
  })

  const handleWebSearch = async () => {
    if (!webSearchQuery.trim()) return
    
    setIsSearching(true)
    
    // Simulate web search
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockResults = [
      {
        title: `${webSearchQuery} - Research Article`,
        url: `https://example.com/research/${webSearchQuery.replace(/\s+/g, '-')}`,
        domain: "example.com",
        snippet: `Latest research and insights about ${webSearchQuery}...`,
        type: "T" as SourceType
      },
      {
        title: `${webSearchQuery} Interview - Tech Leader`,
        url: `https://podcast.com/interviews/${webSearchQuery.replace(/\s+/g, '-')}`,
        domain: "podcast.com", 
        snippet: `In-depth interview discussing ${webSearchQuery}...`,
        type: "I" as SourceType
      },
      {
        title: `${webSearchQuery} Documentary`,
        url: `https://video.com/docs/${webSearchQuery.replace(/\s+/g, '-')}`,
        domain: "video.com",
        snippet: `Comprehensive documentary about ${webSearchQuery}...`,
        type: "V" as SourceType
      }
    ]
    
    setWebSearchResults(mockResults)
    setIsSearching(false)
  }

  const handleAddFromSearch = (result: any) => {
    const sourceData = {
      title: result.title,
      url: result.url,
      domain: result.domain,
      type: result.type,
      notes: result.snippet
    }
    
    onAddSource?.(sourceData)
    setIsAddDialogOpen(false)
    setWebSearchQuery('')
    setWebSearchResults([])
  }

  const handleAddManual = () => {
    if (!manualForm.title || !manualForm.url) return
    
    try {
      const domain = new URL(manualForm.url).hostname
      const sourceData = {
        ...manualForm,
        domain
      }
      
      onAddSource?.(sourceData)
      
      // Reset form
      setManualForm({
        title: '',
        url: '',
        type: 'T',
        notes: ''
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Invalid URL:', error)
    }
  }

  const handleAddSuggestion = (suggestion: any) => {
    onAddSource?.(suggestion)
    setIsAddDialogOpen(false)
  }

  return (
    <div className={cn("flex flex-col bg-muted/30", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Sources ({sources.length})
          </h2>
          <div className="flex gap-1">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Sources</DialogTitle>
                  <DialogDescription>
                    Search the web, add manually, or choose from suggestions
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="search" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="search">Web Search</TabsTrigger>
                    <TabsTrigger value="manual">Manual Add</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="search" className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search the web for sources..."
                        value={webSearchQuery}
                        onChange={(e) => setWebSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleWebSearch}
                        disabled={isSearching || !webSearchQuery.trim()}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {isSearching ? 'Searching...' : 'Search'}
                      </Button>
                    </div>
                    
                    {webSearchResults.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Search Results</h4>
                        {webSearchResults.map((result, index) => (
                          <Card key={index} className="hover:shadow-sm">
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-sm">{result.title}</CardTitle>
                                  <CardDescription className="text-xs">
                                    {result.domain} • {result.snippet}
                                  </CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={cn("text-xs", getSourceTypeColor(result.type))}
                                  >
                                    {result.type}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddFromSearch(result)}
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4">
                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Title *</label>
                        <Input
                          placeholder="Source title..."
                          value={manualForm.title}
                          onChange={(e) => setManualForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">URL *</label>
                        <Input
                          placeholder="https://..."
                          value={manualForm.url}
                          onChange={(e) => setManualForm(prev => ({ ...prev, url: e.target.value }))}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Type</label>
                        <Select 
                          value={manualForm.type} 
                          onValueChange={(value: SourceType) => setManualForm(prev => ({ ...prev, type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="T">Text/Article</SelectItem>
                            <SelectItem value="V">Video</SelectItem>
                            <SelectItem value="I">Interview/Audio</SelectItem>
                            <SelectItem value="SD">Structured Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Notes</label>
                        <Textarea
                          placeholder="Additional notes about this source..."
                          value={manualForm.notes}
                          onChange={(e) => setManualForm(prev => ({ ...prev, notes: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleAddManual}
                        disabled={!manualForm.title || !manualForm.url}
                        className="w-full"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Add Source
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="suggestions" className="space-y-4">
                    <h4 className="font-medium text-sm">Popular Sources</h4>
                    <div className="grid gap-3">
                      {sourceSuggestions.map((suggestion, index) => (
                        <Card key={index} className="hover:shadow-sm">
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                                <CardDescription className="text-xs">
                                  {suggestion.domain} • {suggestion.description}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={cn("text-xs", getSourceTypeColor(suggestion.type))}
                                >
                                  {suggestion.type}
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => handleAddSuggestion(suggestion)}
                                >
                                  Add
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenGallery}
              className="text-xs"
            >
              <FileText className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="T">Text</SelectItem>
                <SelectItem value="V">Video</SelectItem>
                <SelectItem value="I">Interview</SelectItem>
                <SelectItem value="SD">Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto p-4">
        {viewMode === 'compact' ? (
          <div className="space-y-2">
            {filteredSources.map((source) => {
              const IconComponent = getSourceIcon(source.type)
              return (
                <div
                  key={source.id}
                  className="group p-3 rounded-lg border hover:bg-background/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-1.5 rounded border",
                      getSourceTypeColor(source.type)
                    )}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm truncate pr-2">
                          {source.title}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {source.domain}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onInsertCitation(source)}
                          className="text-xs h-6"
                        >
                          <CornerDownLeft className="h-3 w-3 mr-1" />
                          Cite
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSourceClick?.(source)}
                          className="text-xs h-6"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => {
                const IconComponent = getSourceIcon(source.type)
                return (
                  <TableRow key={source.id}>
                    <TableCell>
                      <div className={cn(
                        "p-1 rounded border w-fit",
                        getSourceTypeColor(source.type)
                      )}>
                        <IconComponent className="h-3 w-3" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {source.title}
                    </TableCell>
                    <TableCell>{source.domain}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onInsertCitation(source)}
                        >
                          <CornerDownLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSourceClick?.(source)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}

        {filteredSources.length === 0 && (
          <div className="text-center py-8">
            <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No sources yet</p>
            <Button 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Source
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}