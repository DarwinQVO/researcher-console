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
  ArrowLeft,
  Loader2,
  Image as ImageIcon
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
  const [previewMode, setPreviewMode] = useState<'iframe' | 'proxy' | 'extract'>('iframe')
  const [extractedContent, setExtractedContent] = useState<any>(null)

  const Icon = getSourceIcon(source.type)

  // Determine best preview method based on URL
  useEffect(() => {
    const determinePreviewMethod = async () => {
      const url = source.url.toLowerCase()
      
      // Sites that typically block embedding but we can extract/proxy
      const socialMediaDomains = [
        'facebook.com',
        'instagram.com',
        'twitter.com',
        'x.com',
        'linkedin.com'
      ]
      
      const videoSites = [
        'youtube.com',
        'youtu.be',
        'vimeo.com'
      ]
      
      const articleSites = [
        'medium.com',
        'substack.com',
        'notion.so'
      ]
      
      if (socialMediaDomains.some(domain => url.includes(domain))) {
        setPreviewMode('proxy')
        setCanEmbed(false)
      } else if (videoSites.some(domain => url.includes(domain))) {
        // Videos can usually be embedded with special handling
        setPreviewMode('iframe')
        setCanEmbed(true)
      } else if (articleSites.some(domain => url.includes(domain))) {
        setPreviewMode('extract')
        setCanEmbed(false)
      } else {
        // Try iframe first, fallback to extract
        setPreviewMode('iframe')
        setCanEmbed(true)
      }
    }

    determinePreviewMethod()
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

  // Generate YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`
    }
    return url
  }

  // Generate proxy URL for screenshots
  const getProxyUrl = (url: string) => {
    // Using multiple fallback services
    const services = [
      // Option 1: Screenshot via API
      `https://image.thum.io/get/width/1024/crop/768/${url}`,
      // Option 2: Google PageSpeed screenshot
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=${encodeURIComponent(url)}`,
      // Option 3: Via our own API endpoint
      `/api/screenshot?url=${encodeURIComponent(url)}`
    ]
    
    // Return first option for now
    return services[0]
  }

  // Extract content using our API
  const extractContent = async () => {
    setIsLoading(true)
    try {
      // This would call your backend API to extract content
      const response = await fetch('/api/extract-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: source.url })
      })
      
      if (response.ok) {
        const data = await response.json()
        setExtractedContent(data)
        setHasError(false)
      } else {
        setHasError(true)
      }
    } catch (error) {
      console.error('Failed to extract content:', error)
      setHasError(true)
    }
    setIsLoading(false)
  }

  // Load content based on preview mode
  useEffect(() => {
    if (previewMode === 'extract' && !extractedContent) {
      extractContent()
    }
  }, [previewMode])

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
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">Loading content...</p>
            </div>
          </div>
        )}

        {/* Preview Mode Switch */}
        {(hasError || !canEmbed) && (
          <div className="absolute top-2 right-2 z-20 flex gap-2">
            <Button
              size="sm"
              variant={previewMode === 'proxy' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('proxy')}
            >
              <ImageIcon className="h-4 w-4 mr-1" />
              Screenshot
            </Button>
            <Button
              size="sm"
              variant={previewMode === 'extract' ? 'default' : 'outline'}
              onClick={() => setPreviewMode('extract')}
            >
              <FileText className="h-4 w-4 mr-1" />
              Extract
            </Button>
          </div>
        )}

        {/* Content based on preview mode */}
        {previewMode === 'iframe' && canEmbed && !hasError ? (
          // Standard iframe embedding
          <iframe
            src={source.url.includes('youtube.com') || source.url.includes('youtu.be') 
              ? getYouTubeEmbedUrl(source.url)
              : source.url}
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : previewMode === 'proxy' ? (
          // Screenshot/proxy view
          <div className="h-full overflow-auto p-4">
            <div className="max-w-4xl mx-auto">
              <img
                src={getProxyUrl(source.url)}
                alt={`Screenshot of ${source.title}`}
                className="w-full border rounded-lg shadow-lg"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false)
                  setHasError(true)
                }}
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Screenshot preview - Click "Open External" for interactive view
              </p>
            </div>
          </div>
        ) : previewMode === 'extract' ? (
          // Extracted content view
          <div className="h-full overflow-auto p-6">
            {extractedContent ? (
              <article className="max-w-3xl mx-auto prose prose-sm">
                <h1>{extractedContent.title || source.title}</h1>
                {extractedContent.author && (
                  <p className="text-muted-foreground">By {extractedContent.author}</p>
                )}
                {extractedContent.publishedDate && (
                  <p className="text-muted-foreground text-sm">
                    {new Date(extractedContent.publishedDate).toLocaleDateString()}
                  </p>
                )}
                {extractedContent.image && (
                  <img
                    src={extractedContent.image}
                    alt={extractedContent.title}
                    className="w-full rounded-lg mb-4"
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: extractedContent.content || '' }} />
              </article>
            ) : (
              // Simplified content preview
              <div className="max-w-3xl mx-auto">
                <div className="border rounded-lg p-6 bg-muted/10">
                  <h2 className="font-semibold text-lg mb-2">{source.title}</h2>
                  <p className="text-sm text-muted-foreground mb-4">{source.domain}</p>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium mb-1">URL</h3>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all"
                      >
                        {source.url}
                      </a>
                    </div>
                    {source.notes && (
                      <div>
                        <h3 className="font-medium mb-1">Notes</h3>
                        <p className="text-sm">{source.notes}</p>
                      </div>
                    )}
                    {source.metadata && Object.keys(source.metadata).length > 0 && (
                      <div>
                        <h3 className="font-medium mb-1">Metadata</h3>
                        <div className="text-sm space-y-1">
                          {Object.entries(source.metadata).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium capitalize">{key}:</span> {String(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => window.open(source.url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Original Source
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Error fallback
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h4 className="font-medium mb-2">Preview Error</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load preview. Try a different preview mode or open externally.
              </p>
              <Button
                variant="outline"
                onClick={() => window.open(source.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open External
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}