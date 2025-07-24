"use client"

import { Source } from '@/models/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Book, 
  Video, 
  FileText, 
  Database,
  ExternalLink,
  Copy,
  Eye,
  Calendar,
  User,
  Globe
} from 'lucide-react'

interface SourcesGalleryProps {
  sources: Source[]
  onSourceClick: (source: Source) => void
  onInsertCitation?: (source: Source) => void
}

export function SourcesGallery({ sources, onSourceClick, onInsertCitation }: SourcesGalleryProps) {
  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'article':
        return <FileText className="h-5 w-5" />
      case 'I':
        return <User className="h-5 w-5" />
      case 'V':
        return <Video className="h-5 w-5" />
      case 'T':
        return <FileText className="h-5 w-5" />
      case 'SD':
        return <Database className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  const getCapturedByColor = (capturedBy: string) => {
    switch (capturedBy) {
      case 'manual':
        return 'bg-blue-500/10 text-blue-700'
      case 'ai':
        return 'bg-purple-500/10 text-purple-700'
      case 'extension':
        return 'bg-green-500/10 text-green-700'
      default:
        return 'bg-gray-500/10 text-gray-700'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Research Sources</h2>
        <p className="text-muted-foreground">
          All your research sources in one place. Click to view details or copy citations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((source) => (
          <Card 
            key={source.id}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSourceClick(source)}
          >
            <CardHeader>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  {getSourceIcon(source.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base line-clamp-2">
                    {source.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span className="truncate">{source.domain}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {source.type}
                </Badge>
                <Badge className={cn("text-xs", getCapturedByColor(source.capturedBy))}>
                  {source.capturedBy}
                </Badge>
              </div>

              {source.notes && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {source.notes}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(source.createdAt)}</span>
                </div>
                {source.clips && source.clips.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {source.clips.length} clips
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(source.url, '_blank')
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open
                </Button>
                {onInsertCitation && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onInsertCitation(source)
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Cite
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSourceClick(source)
                  }}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sources.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sources yet</h3>
            <p className="text-muted-foreground">
              Add your first source to start building your research library.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}