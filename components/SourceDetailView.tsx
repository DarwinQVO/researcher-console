"use client"

import { Source } from '@/models/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { 
  Book, 
  Video, 
  FileText, 
  Database,
  ExternalLink,
  Copy,
  Calendar,
  User,
  Globe,
  Edit,
  Save,
  X,
  Link,
  Tag
} from 'lucide-react'
import { useState } from 'react'
import { useEnhancedToast } from '@/lib/notifications/useEnhancedToast'

interface SourceDetailViewProps {
  source: Source
  onUpdate?: (updates: Partial<Source>) => void
  onDelete?: () => void
  onInsertCitation?: () => void
}

export function SourceDetailView({ 
  source, 
  onUpdate, 
  onDelete,
  onInsertCitation 
}: SourceDetailViewProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(source.notes || '')
  const { success } = useEnhancedToast()

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="h-6 w-6" />
      case 'video':
        return <Video className="h-6 w-6" />
      case 'article':
        return <FileText className="h-6 w-6" />
      case 'I':
        return <User className="h-6 w-6" />
      case 'V':
        return <Video className="h-6 w-6" />
      case 'T':
        return <FileText className="h-6 w-6" />
      case 'SD':
        return <Database className="h-6 w-6" />
      default:
        return <Globe className="h-6 w-6" />
    }
  }

  const getCapturedByInfo = (capturedBy: string) => {
    const info = {
      manual: { color: 'bg-blue-500/10 text-blue-700', description: 'Manually added by researcher' },
      ai: { color: 'bg-purple-500/10 text-purple-700', description: 'AI-assisted capture' },
      extension: { color: 'bg-green-500/10 text-green-700', description: 'Captured via browser extension' }
    }
    return info[capturedBy as keyof typeof info] || info.manual
  }

  const capturedByInfo = getCapturedByInfo(source.capturedBy)

  const handleSaveNotes = () => {
    onUpdate?.({ notes })
    setIsEditingNotes(false)
    success({
      title: "Notas guardadas",
      description: "Tus notas han sido actualizadas exitosamente.",
      category: 'save',
      showToast: false // Don't show toast, only add to notification center
    })
  }

  const handleCopyCitation = () => {
    const citation = `[${source.title}](${source.url}) (${source.type})`
    navigator.clipboard.writeText(citation)
    success({
      title: "Cita copiada",
      description: "La cita ha sido copiada al portapapeles.",
      category: 'citation',
      showToast: false // Don't show toast, only add to notification center
    })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg">
              {getSourceIcon(source.type)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{source.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{source.domain}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    View source
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(source.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Open
            </Button>
            {onInsertCitation && (
              <Button
                variant="outline"
                size="sm"
                onClick={onInsertCitation}
              >
                <Copy className="h-4 w-4 mr-1" />
                Insert Citation
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCitation}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Type</span>
              </div>
              <Badge variant="outline" className="mt-1">
                {source.type}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Captured By</span>
              </div>
              <Badge className={cn("mt-1", capturedByInfo.color)}>
                {source.capturedBy}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Added</span>
              </div>
              <p className="font-semibold mt-1">
                {new Intl.DateTimeFormat('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                }).format(source.createdAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Research Notes</h2>
          {!isEditingNotes && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingNotes(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit Notes
            </Button>
          )}
        </div>
        
        {isEditingNotes ? (
          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your research notes here..."
              className="min-h-[150px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setNotes(source.notes || '')
                  setIsEditingNotes(false)
                }}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveNotes}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Notes
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              {source.notes ? (
                <p className="whitespace-pre-wrap">{source.notes}</p>
              ) : (
                <p className="text-muted-foreground italic">
                  No notes yet. Click Edit Notes to add your research insights.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Metadata Section */}
      {source.metadata && Object.keys(source.metadata).length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Metadata</h2>
            <Card>
              <CardContent className="pt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(source.metadata).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="mt-1 text-sm">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Related Clips */}
      {source.clips && source.clips.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h2 className="text-lg font-semibold mb-4">Extracted Clips ({source.clips.length})</h2>
            <div className="space-y-2">
              {source.clips.map((clip) => (
                <Card key={clip.id}>
                  <CardContent className="pt-4">
                    <p className="text-sm mb-2">{clip.text}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {clip.timestampOrPg && (
                          <Badge variant="outline">{clip.timestampOrPg}</Badge>
                        )}
                        <span>{clip.citation}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(clip.text)
                          success({
                            title: "Clip copiado",
                            description: "El texto del clip ha sido copiado al portapapeles.",
                            category: 'citation',
                            showToast: false // Don't show toast, only add to notification center
                          })
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}