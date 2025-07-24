"use client"

import { useState, useCallback, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  User
} from 'lucide-react'
import { Source, SourceType } from '@/models/types'

interface SourcesHubProps {
  sources: Source[]
  onInsertCitation: (source: Source) => void
  onSourceClick?: (source: Source) => void
  onOpenGallery?: () => void
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

const sourceTypeLabels: Record<SourceType, string> = {
  'I': 'Interview',
  'V': 'Video',
  'T': 'Text',
  'SD': 'Structured Data'
}

export function SourcesHub({ sources, onInsertCitation, onSourceClick, onOpenGallery, className = '' }: SourcesHubProps) {
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<SourceType | 'all'>('all')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list')
  const [detailSource, setDetailSource] = useState<Source | null>(null)

  // Extract unique domains for filter
  const uniqueDomains = useMemo(() => {
    const domains = new Set(sources.map(s => s.domain))
    return Array.from(domains).sort()
  }, [sources])

  // Filter sources
  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = filter === '' || 
        source.title.toLowerCase().includes(filter.toLowerCase()) ||
        source.url.toLowerCase().includes(filter.toLowerCase()) ||
        source.domain.toLowerCase().includes(filter.toLowerCase())
      
      const matchesType = typeFilter === 'all' || source.type === typeFilter
      const matchesDomain = domainFilter === 'all' || source.domain === domainFilter

      return matchesSearch && matchesType && matchesDomain
    })
  }, [sources, filter, typeFilter, domainFilter])

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      if (e.key === '1' && selectedSourceId) {
        const source = sources.find(s => s.id === selectedSourceId)
        if (source) {
          navigator.clipboard.writeText(`[${source.title}](${source.url})`)
        }
      } else if (e.key === '2' && selectedSourceId) {
        const source = sources.find(s => s.id === selectedSourceId)
        if (source) {
          window.open(source.url, '_blank')
        }
      }
    }
  }, [selectedSourceId, sources])

  // Citation format helper
  const formatCitation = (source: Source) => {
    return `[${source.title}](${source.url}) (${source.type})`
  }

  const handleSourceClick = (source: Source) => {
    setSelectedSourceId(source.id)
    setDetailSource(source)
    setViewMode('detail')
    // Don't call onSourceClick to avoid opening in tab
  }

  const handleBackToList = () => {
    setViewMode('list')
    setDetailSource(null)
    setSelectedSourceId(null)
  }

  return (
    <aside className={`w-80 border-l bg-background flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          {viewMode === 'detail' ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="p-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold text-lg">Source Detail</h3>
            </div>
          ) : (
            <h3 className="font-semibold text-lg">Sources Hub</h3>
          )}
          
          {onOpenGallery && viewMode === 'list' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenGallery}
              className="text-xs flex items-center gap-1"
            >
              <Image className="h-3 w-3" />
              Gallery Of Sources
            </Button>
          )}
        </div>
        
        {/* Search & Filters - only show in list mode */}
        {viewMode === 'list' && (
          <>
            <Input
              placeholder="Filter sources..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mb-3"
            />
            
            {/* Filters */}
            <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as SourceType | 'all')}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(sourceTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    {key} - {label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {uniqueDomains.map((domain) => (
                <SelectItem key={domain} value={domain}>
                  {domain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>
          </>
        )}
      </div>

      {/* Content Area - List or Detail View */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' ? (
          // Sources Table
          <Table>
            <TableHeader className="sticky top-0 bg-background">
              <TableRow>
                <TableHead className="w-10">Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-24">Domain</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSources.map((source) => {
                const Icon = getSourceIcon(source.type)
                return (
                  <TableRow 
                    key={source.id}
                    className={`cursor-pointer hover:bg-muted/50 ${selectedSourceId === source.id ? 'bg-muted' : ''}`}
                    onClick={() => handleSourceClick(source)}
                  >
                    <TableCell>
                      <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-[200px]" title={source.title}>
                      {source.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate">
                      {source.domain}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          onInsertCitation(source)
                        }}
                        title="Insert citation (↩︎)"
                      >
                        <CornerDownLeft className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          // Source Detail View
          detailSource && (
            <div className="p-4 space-y-4">
              {/* Source Header */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="w-10 h-10 p-0 flex items-center justify-center">
                    {(() => {
                      const Icon = getSourceIcon(detailSource.type)
                      return <Icon className="w-5 h-5" />
                    })()}
                  </Badge>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight">{detailSource.title}</h3>
                    <p className="text-sm text-muted-foreground">{detailSource.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {detailSource.createdAt.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {sourceTypeLabels[detailSource.type]}
                  </span>
                </div>
              </div>

              {/* Source Content */}
              <div className="space-y-3">
                <h4 className="font-medium">URL</h4>
                <div className="text-sm leading-relaxed break-all">
                  <a 
                    href={detailSource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {detailSource.url}
                  </a>
                </div>
                
                {detailSource.notes && (
                  <>
                    <h4 className="font-medium">Notes</h4>
                    <div className="text-sm leading-relaxed">
                      {detailSource.notes}
                    </div>
                  </>
                )}
                
                {detailSource.metadata && Object.keys(detailSource.metadata).length > 0 && (
                  <>
                    <h4 className="font-medium">Metadata</h4>
                    <div className="text-sm leading-relaxed">
                      {Object.entries(detailSource.metadata).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-medium capitalize">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onInsertCitation(detailSource)}
                  className="flex-1"
                >
                  <CornerDownLeft className="h-4 w-4 mr-2" />
                  Insert Citation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(detailSource.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-muted-foreground">
        <div className="flex items-center justify-between mb-1">
          <span>{filteredSources.length} sources</span>
          <div className="flex gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-muted rounded text-[10px]">⌘1</kbd> Copy cite
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 bg-muted rounded text-[10px]">⌘2</kbd> Open
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}