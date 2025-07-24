"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  Globe,
  FileText,
  Video,
  Mic,
  Database,
  ArrowLeft
} from 'lucide-react'
import { Source, SourceType } from '@/models/types'

interface SourceViewerProps {
  source: Source
  onBack: () => void
  onInsertCitation?: (source: Source) => void
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

export function SourceViewer({ source, onBack, onInsertCitation }: SourceViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [canEmbed, setCanEmbed] = useState(true)

  const Icon = getSourceIcon(source.type)

  // Check if URL can be embedded (basic heuristic)
  useEffect(() => {
    const checkEmbeddability = () => {
      const url = source.url.toLowerCase()
      
      // Some sites that typically block embedding
      const blockedDomains = [
        'facebook.com',
        'instagram.com',
        'twitter.com',
        'x.com',
        'linkedin.com'
      ]
      
      const isBlocked = blockedDomains.some(domain => url.includes(domain))
      setCanEmbed(!isBlocked)
    }

    checkEmbeddability()
  }, [source.url])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
    setCanEmbed(false)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    setHasError(false)
    // Force iframe reload by changing key
    const iframe = document.querySelector('iframe')
    if (iframe) {
      iframe.src = iframe.src
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="w-8 h-8 p-0 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </Badge>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">{source.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{source.domain}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onInsertCitation && (
            <Button
              variant="default" 
              size="sm"
              onClick={() => onInsertCitation(source)}
            >
              Insert Citation
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(source.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open External
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Source Info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
          <span>{sourceTypeLabels[source.type]}</span>
          <span>•</span>
          <span>{source.createdAt.toLocaleDateString()}</span>
          {!canEmbed && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                Embedding restricted
              </span>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative">
        {!canEmbed || hasError ? (
          // Fallback when embedding is not possible
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Content Preview Not Available</h4>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              {hasError 
                ? "This website doesn't allow embedding. Click 'Open External' to view in a new tab."
                : "This source cannot be embedded due to security restrictions."
              }
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => window.open(source.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
            </div>
            
            {/* Show source details as fallback */}
            <div className="mt-8 w-full max-w-md">
              <div className="border rounded-lg p-4 bg-muted/10">
                <h5 className="font-medium mb-2">Source Details</h5>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">URL:</span>
                    <div className="break-all text-blue-600">
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {source.url}
                      </a>
                    </div>
                  </div>
                  {source.notes && (
                    <div>
                      <span className="font-medium">Notes:</span>
                      <p className="text-muted-foreground">{source.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Embedded iframe
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Loading content...</p>
                </div>
              </div>
            )}
            
            <iframe
              src={source.url}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </>
        )}
      </div>
    </div>
  )
}