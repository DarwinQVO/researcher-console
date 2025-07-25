"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
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
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Code,
  Download,
  Link
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

type PreviewMode = 'iframe' | 'proxy' | 'extract' | 'screenshot' | 'direct' | 'embed' | 'popup'
type ViewSize = 'small' | 'medium' | 'large' | 'full'

export function SourceViewer({ source, onBack, onInsertCitation }: SourceViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('iframe')
  const [extractedContent, setExtractedContent] = useState<any>(null)
  const [attemptedMethods, setAttemptedMethods] = useState<Set<string>>(new Set())
  const [viewSize, setViewSize] = useState<ViewSize>('medium')
  const [zoom, setZoom] = useState(100)
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const Icon = getSourceIcon(source.type)

  // Enhanced preview method selection with more options
  const getInitialPreviewMethod = (url: string): PreviewMode => {
    const lowerUrl = url.toLowerCase()
    
    // Video sites - try embed first, fallback to iframe
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return 'embed' // YouTube embed API
    }
    if (lowerUrl.includes('vimeo.com') || lowerUrl.includes('dailymotion.com')) {
      return 'iframe'
    }
    
    // Social media - try multiple approaches
    if (lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) {
      return 'embed' // Twitter embed
    }
    if (lowerUrl.includes('facebook.com') || lowerUrl.includes('instagram.com') || 
        lowerUrl.includes('linkedin.com') || lowerUrl.includes('tiktok.com')) {
      return 'screenshot' // Screenshot for social media
    }
    
    // Document/PDF sites
    if (lowerUrl.includes('.pdf') || lowerUrl.includes('docs.google.com') || 
        lowerUrl.includes('dropbox.com') || lowerUrl.includes('onedrive.com')) {
      return 'direct' // Direct embed
    }
    
    // Article sites - try extract first
    if (lowerUrl.includes('medium.com') || lowerUrl.includes('substack.com') || 
        lowerUrl.includes('notion.so') || lowerUrl.includes('dev.to') ||
        lowerUrl.includes('github.com') || lowerUrl.includes('stackoverflow.com')) {
      return 'extract'
    }
    
    // Default: try iframe first
    return 'iframe'
  }

  // Get available methods for current URL
  const getAvailableMethods = (url: string): PreviewMode[] => {
    const base: PreviewMode[] = ['iframe', 'proxy', 'extract', 'screenshot', 'direct']
    
    // Add embed if it's a supported service
    if (url.includes('youtube.com') || url.includes('twitter.com') || 
        url.includes('codepen.io') || url.includes('figma.com')) {
      base.unshift('embed')
    }
    
    return base
  }

  // Initialize preview method
  useEffect(() => {
    const initialMethod = getInitialPreviewMethod(source.url)
    setPreviewMode(initialMethod)
    setAttemptedMethods(new Set([initialMethod]))
  }, [source.url])

  // Size and layout handlers
  const getSizeStyles = () => {
    const baseStyles = `transition-all duration-300 border rounded-lg`
    
    switch (viewSize) {
      case 'small':
        return `${baseStyles} h-64 w-full`
      case 'medium':
        return `${baseStyles} h-96 w-full`
      case 'large':
        return `${baseStyles} h-[32rem] w-full`
      case 'full':
        return `${baseStyles} h-[calc(100vh-200px)] w-full`
      default:
        return `${baseStyles} h-96 w-full`
    }
  }

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return '375px'
      case 'tablet':
        return '768px'
      case 'desktop':
        return '100%'
      default:
        return '100%'
    }
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    // Auto fallback to next method
    setAttemptedMethods(prev => {
      const newSet = new Set(prev)
      newSet.add(previewMode)
      return newSet
    })
    
    // Try next available method
    const availableMethods = getAvailableMethods(source.url)
    const nextMethod = availableMethods.find(method => !attemptedMethods.has(method))
    
    if (nextMethod) {
      setPreviewMode(nextMethod)
      setIsLoading(true)
      setHasError(false)
    } else {
      setIsLoading(false)
      setHasError(true)
    }
  }

  // URL transformation helpers
  const getEmbedUrl = (url: string, mode: PreviewMode): string => {
    switch (mode) {
      case 'embed':
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          const videoId = url.includes('youtu.be') ? 
            url.split('youtu.be/')[1]?.split('?')[0] :
            url.split('v=')[1]?.split('&')[0]
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`
        }
        if (url.includes('twitter.com') || url.includes('x.com')) {
          return `https://platform.twitter.com/embed/index.html?url=${encodeURIComponent(url)}`
        }
        return url
        
      case 'proxy':
        return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&embed=screenshot.url`
        
      case 'screenshot':
        return `https://api.screenshot.io/v1/screenshot?url=${encodeURIComponent(url)}&viewport_width=1200&viewport_height=800&format=png`
        
      case 'direct':
        if (url.includes('.pdf')) {
          return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        }
        return url
        
      default:
        return url
    }
  }
    
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

        {/* Controls */}
        <div className="space-y-3">
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
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Preview Controls */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Preview Method */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Method:</label>
              <Select value={previewMode} onValueChange={(value: PreviewMode) => setPreviewMode(value)}>
                <SelectTrigger className="w-32 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableMethods(source.url).map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Control */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Size:</label>
              <Select value={viewSize} onValueChange={(value: ViewSize) => setViewSize(value)}>
                <SelectTrigger className="w-24 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device Mode */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Device:</label>
              <div className="flex border rounded">
                <Button
                  variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('mobile')}
                  className="h-8 px-2"
                >
                  <Smartphone className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('tablet')}
                  className="h-8 px-2"
                >
                  <Tablet className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceMode('desktop')}
                  className="h-8 px-2"
                >
                  <Monitor className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Zoom Control */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Zoom:</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(25, zoom - 25))}
                className="h-8 w-8 p-0"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs w-12 text-center">{zoom}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(200, zoom + 25))}
                className="h-8 w-8 p-0"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div 
          className="mx-auto"
          style={{ 
            width: getDeviceWidth(),
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <div className={getSizeStyles()}>
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading {previewMode} preview...</p>
                </div>
              </div>
            )}

            {hasError && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
                  <div>
                    <h3 className="font-medium">Preview not available</h3>
                    <p className="text-sm text-muted-foreground">
                      Tried: {Array.from(attemptedMethods).join(', ')}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleRefresh}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(source.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!isLoading && !hasError && (
              <>
                {previewMode === 'iframe' && (
                  <iframe
                    src={source.url}
                    className="w-full h-full"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  />
                )}

                {previewMode === 'embed' && (
                  <iframe
                    src={getEmbedUrl(source.url, 'embed')}
                    className="w-full h-full"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                )}

                {previewMode === 'direct' && (
                  <iframe
                    src={getEmbedUrl(source.url, 'direct')}
                    className="w-full h-full"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}

                {previewMode === 'proxy' && (
                  <iframe
                    src={getEmbedUrl(source.url, 'proxy')}
                    className="w-full h-full"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-scripts allow-same-origin"
                  />
                )}

                {previewMode === 'screenshot' && (
                  <img
                    src={getEmbedUrl(source.url, 'screenshot')}
                    alt={source.title}
                    className="w-full h-full object-contain"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                  />
                )}

                {previewMode === 'extract' && extractedContent && (
                  <div className="p-4 prose prose-sm max-w-none">
                    <h2 className="text-lg font-semibold mb-4">{extractedContent.title}</h2>
                    <div className="space-y-4">
                      {extractedContent.paragraphs?.map((paragraph: string, index: number) => (
                        <p key={index} className="text-sm leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {previewMode === 'popup' && (
                  <div className="p-4 text-center">
                    <Button
                      size="lg"
                      onClick={() => window.open(source.url, '_blank', 'width=1200,height=800')}
                      className="mb-4"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in Popup Window
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      This source opens in a separate popup window for better viewing.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}