"use client"

import { Module } from '@/models/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Hash,
  FileText
} from 'lucide-react'
import { RichTextEditor } from '@/components/RichTextEditor'
import { useState } from 'react'

interface ModuleDetailViewProps {
  module: Module
  onEdit?: () => void
  onDelete?: () => void
  onToggle?: () => void
  onContentChange?: (content: string) => void
}

export function ModuleDetailView({ 
  module, 
  onEdit, 
  onDelete, 
  onToggle,
  onContentChange 
}: ModuleDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(module.content || '')

  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getVariantInfo = (variant: string) => {
    const info = {
      biographical: { color: 'bg-blue-500/10 text-blue-700', description: 'Personal history and background' },
      achievements: { color: 'bg-green-500/10 text-green-700', description: 'Major accomplishments and milestones' },
      philosophy: { color: 'bg-purple-500/10 text-purple-700', description: 'Beliefs and guiding principles' },
      standard: { color: 'bg-gray-500/10 text-gray-700', description: 'Standard research module' },
      expanded: { color: 'bg-orange-500/10 text-orange-700', description: 'In-depth comprehensive coverage' },
      minimal: { color: 'bg-cyan-500/10 text-cyan-700', description: 'Concise essential information' }
    }
    return info[variant as keyof typeof info] || info.standard
  }

  const variantInfo = getVariantInfo(module.variant)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(module.status)}
            <div>
              <h1 className="text-2xl font-bold">{module.name}</h1>
              <p className="text-muted-foreground mt-1">{variantInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
              >
                {module.isEnabled ? 
                  <ToggleRight className="h-4 w-4 mr-1 text-primary" /> : 
                  <ToggleLeft className="h-4 w-4 mr-1" />
                }
                {module.isEnabled ? 'Enabled' : 'Disabled'}
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 mr-1" />
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDelete}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Variant</span>
              </div>
              <Badge className={cn("mt-1", variantInfo.color)}>
                {module.variant}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Order</span>
              </div>
              <p className="font-semibold mt-1">{module.order}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created</span>
              </div>
              <p className="font-semibold mt-1">
                {new Intl.DateTimeFormat('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }).format(module.createdAt)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated</span>
              </div>
              <p className="font-semibold mt-1">
                {new Intl.DateTimeFormat('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                }).format(module.updatedAt)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Module Content</h2>
        
        {isEditing ? (
          <div className="border rounded-lg">
            <RichTextEditor
              content={content}
              onChange={(newContent) => {
                setContent(newContent)
                onContentChange?.(newContent)
              }}
            />
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              {module.content ? (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: module.content }}
                />
              ) : (
                <p className="text-muted-foreground italic">
                  No content yet. Click Edit to add content to this module.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Related Clips */}
        {module.clips && module.clips.length > 0 && (
          <>
            <Separator className="my-6" />
            <div>
              <h2 className="text-lg font-semibold mb-4">Related Clips ({module.clips.length})</h2>
              <div className="space-y-2">
                {module.clips.map((clip) => (
                  <Card key={clip.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm">{clip.text}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Badge variant="outline">{clip.citation}</Badge>
                        {clip.timestampOrPg && (
                          <span>• {clip.timestampOrPg}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}