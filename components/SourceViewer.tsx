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
  const [previewMode, setPreviewMode] = useState<'iframe' | 'proxy' | 'extract'>('iframe')
  const [extractedContent, setExtractedContent] = useState<any>(null)
  const [attemptedMethods, setAttemptedMethods] = useState<Set<string>>(new Set())

  const Icon = getSourceIcon(source.type)

  // Smart preview method selection
  const getInitialPreviewMethod = (url: string): 'iframe' | 'proxy' | 'extract' => {
    const lowerUrl = url.toLowerCase()
    
    // Video sites - always try iframe first
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || 
        lowerUrl.includes('vimeo.com') || lowerUrl.includes('dailymotion.com')) {
      return 'iframe'
    }
    
    // Social media - go straight to proxy
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('instagram.com') || 
        lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com') || 
        lowerUrl.includes('linkedin.com') || lowerUrl.includes('tiktok.com')) {
      return 'proxy'
    }
    
    // Article sites - try extract first
    if (lowerUrl.includes('medium.com') || lowerUrl.includes('substack.com') || 
        lowerUrl.includes('notion.so') || lowerUrl.includes('dev.to')) {
      return 'extract'
    }
    
    // Default: try iframe first
    return 'iframe'
  }

  // Initialize preview method
  useEffect(() => {
    const initialMethod = getInitialPreviewMethod(source.url)
    setPreviewMode(initialMethod)
    setAttemptedMethods(new Set([initialMethod]))
  }, [source.url])

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    // Auto fallback to next method
    setAttemptedMethods(prev => new Set([...prev, 'iframe']))
    
    if (!attemptedMethods.has('proxy')) {
      setPreviewMode('proxy')
      setIsLoading(true)
    } else if (!attemptedMethods.has('extract')) {
      setPreviewMode('extract')
      setIsLoading(true)
    } else {
      setIsLoading(false)
      setHasError(true)
    }
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

  // Generate proxy URL for screenshots or embedded view
  const getProxyUrl = (url: string) => {
    // For better embedding, we can use different strategies
    const encodedUrl = encodeURIComponent(url)
    
    // Special handling for specific sites
    if (url.includes('twitter.com') || url.includes('x.com')) {
      // Twitter embed
      const tweetMatch = url.match(/status\/(\d+)/)
      if (tweetMatch) {
        return `https://platform.twitter.com/embed/Tweet.html?id=${tweetMatch[1]}`
      }
    }
    
    if (url.includes('instagram.com')) {
      // Instagram embed 
      return `https://www.instagram.com/p/${url.split('/p/')[1]?.split('/')[0]}/embed`
    }
    
    // Default to screenshot service
    return `https://image.thum.io/get/width/1024/crop/768/${url}`
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

        {/* Auto-switching indicator */}
        {isLoading && attemptedMethods.size > 1 && (
          <div className="absolute top-2 right-2 z-20 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs">
            Trying {previewMode === 'proxy' ? 'screenshot' : previewMode === 'extract' ? 'content extraction' : 'direct embed'}...
          </div>
        )}

        {/* Content based on preview mode */}
        {previewMode === 'iframe' ? (
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
          // Screenshot/proxy/embed view
          <div className="h-full overflow-auto">
            {(source.url.includes('twitter.com') || source.url.includes('x.com') || 
              source.url.includes('instagram.com')) ? (
              // Try embedded view for social media
              <iframe
                src={getProxyUrl(source.url)}
                className="w-full h-full border-0"
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  // Fallback to screenshot
                  const img = document.createElement('img')
                  img.src = `https://image.thum.io/get/width/1024/crop/768/${source.url}`
                  img.onload = () => setIsLoading(false)
                  img.onerror = () => {
                    setAttemptedMethods(prev => new Set([...prev, 'proxy']))
                    if (!attemptedMethods.has('extract')) {
                      setPreviewMode('extract')
                      setIsLoading(true)
                    } else {
                      setIsLoading(false)
                      setHasError(true)
                    }
                  }
                }}
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              // Screenshot for other sites
              <div className="p-4">
                <div className="max-w-4xl mx-auto">
                  <img
                    src={getProxyUrl(source.url)}
                    alt={`Preview of ${source.title}`}
                    className="w-full border rounded-lg shadow-lg"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                      setAttemptedMethods(prev => new Set([...prev, 'proxy']))
                      if (!attemptedMethods.has('extract')) {
                        setPreviewMode('extract')
                        setIsLoading(true)
                      } else {
                        setIsLoading(false)
                        setHasError(true)
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Preview - Click "Open External" for full interactive view
                  </p>
                </div>
              </div>
            )}
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