"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  FileText, 
  Download, 
  Share2, 
  Copy,
  CheckCircle2,
  Loader2,
  FileIcon,
  Link
} from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  documentTitle: string
  onExport: (options: ExportOptions) => void
}

interface ExportOptions {
  format: 'google-docs' | 'markdown' | 'pdf'
  includeComments: boolean
  includeSourcesHub: boolean
  customStyling?: Record<string, any>
}

export function ExportModal({ isOpen, onClose, documentTitle, onExport }: ExportModalProps) {
  const [format, setFormat] = useState<ExportOptions['format']>('google-docs')
  const [includeComments, setIncludeComments] = useState(false)
  const [includeSourcesHub, setIncludeSourcesHub] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [shareLink, setShareLink] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const options: ExportOptions = {
      format,
      includeComments,
      includeSourcesHub
    }
    
    onExport(options)
    
    // Simulate getting share link
    setShareLink(`https://docs.google.com/document/d/mock-${Date.now()}/edit`)
    setIsExporting(false)
    setExportComplete(true)
  }

  const formatInfo = {
    'google-docs': {
      icon: FileText,
      name: 'Google Docs',
      description: 'Export directly to Google Docs with formatting preserved',
      features: ['Real-time collaboration', 'Version history', 'Comments & suggestions']
    },
    'markdown': {
      icon: FileIcon,
      name: 'Markdown',
      description: 'Plain text format with markdown syntax',
      features: ['Universal compatibility', 'Version control friendly', 'Easy to edit']
    },
    'pdf': {
      icon: FileText,
      name: 'PDF',
      description: 'Professional document format for sharing',
      features: ['Print-ready', 'Consistent formatting', 'Read-only']
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export Document</DialogTitle>
          <DialogDescription>
            Export "{documentTitle}" to your preferred format
          </DialogDescription>
        </DialogHeader>

        {!exportComplete ? (
          <>
            <Tabs value={format} onValueChange={(v) => setFormat(v as ExportOptions['format'])}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="google-docs">Google Docs</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
              </TabsList>

              {Object.entries(formatInfo).map(([key, info]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <info.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">{info.name}</h4>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {info.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="space-y-4 py-4">
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Export Options</h4>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="comments" 
                    checked={includeComments}
                    onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                  />
                  <Label 
                    htmlFor="comments" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Include editor comments and notes
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sources" 
                    checked={includeSourcesHub}
                    onCheckedChange={(checked) => setIncludeSourcesHub(checked as boolean)}
                  />
                  <Label 
                    htmlFor="sources" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Append sources list at the end
                  </Label>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Export Complete!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your document has been exported successfully
            </p>
            
            {format === 'google-docs' && (
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    <span className="text-sm font-mono truncate max-w-[350px]">
                      {shareLink}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {format === 'google-docs' ? (
                <Button onClick={() => window.open(shareLink, '_blank')}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Open in Google Docs
                </Button>
              ) : (
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
              )}
            </div>
          </div>
        )}

        {!exportComplete && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}