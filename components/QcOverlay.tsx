"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  AlertCircle, 
  AlertTriangle, 
  Info,
  CheckCircle2,
  X,
  FileWarning,
  Link,
  Type,
  Hash
} from 'lucide-react'
import { QCFlag } from '@/models/types'
import { getQCFlagsByDocId } from '@/lib/mock/mockData'

interface QcOverlayProps {
  isOpen: boolean
  onClose: () => void
  workingDocId: string
  onResolveFlag: (flagId: string) => void
}

const flagIcons = {
  style: Type,
  citation: Link,
  content: FileWarning,
  format: Hash
}

const severityConfig = {
  error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' }
}

export function QcOverlay({ isOpen, onClose, workingDocId, onResolveFlag }: QcOverlayProps) {
  const flags = getQCFlagsByDocId(workingDocId)
  const [resolvedFlags, setResolvedFlags] = useState<Set<string>>(new Set())
  
  const handleResolve = (flagId: string) => {
    setResolvedFlags(prev => new Set(prev).add(flagId))
    onResolveFlag(flagId)
  }

  const activeFlags = flags.filter(f => !f.resolved && !resolvedFlags.has(f.id))
  const errorCount = activeFlags.filter(f => f.severity === 'error').length
  const warningCount = activeFlags.filter(f => f.severity === 'warning').length

  const checklist = [
    { id: 'sources', label: 'All facts have sources', checked: activeFlags.filter(f => f.type === 'citation').length === 0 },
    { id: 'style', label: 'Style guide compliance', checked: activeFlags.filter(f => f.type === 'style').length === 0 },
    { id: 'format', label: 'Formatting standards met', checked: activeFlags.filter(f => f.type === 'format').length === 0 },
    { id: 'content', label: 'Content quality verified', checked: activeFlags.filter(f => f.type === 'content').length === 0 },
    { id: 'links', label: 'No broken links', checked: true },
    { id: 'modules', label: 'Required modules complete', checked: true }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[480px] bg-background shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quality Control</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="font-medium">{errorCount} Errors</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">{warningCount} Warnings</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Checklist */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">QC Checklist</h3>
                <div className="space-y-3">
                  {checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <Checkbox 
                        checked={item.checked} 
                        disabled 
                      />
                      <span className={`text-sm ${item.checked ? 'text-muted-foreground line-through' : ''}`}>
                        {item.label}
                      </span>
                      {item.checked && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Flags */}
              <div>
                <h3 className="font-semibold mb-4">Issues Found</h3>
                <div className="space-y-3">
                  {activeFlags.length === 0 ? (
                    <Card className="p-6 text-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        All quality checks passed!
                      </p>
                    </Card>
                  ) : (
                    activeFlags.map(flag => {
                      const TypeIcon = flagIcons[flag.type]
                      const config = severityConfig[flag.severity]
                      const SeverityIcon = config.icon
                      
                      return (
                        <Card key={flag.id} className={`p-4 ${config.bg}`}>
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 ${config.color}`}>
                              <SeverityIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  <TypeIcon className="h-3 w-3 mr-1" />
                                  {flag.type}
                                </Badge>
                                {flag.location?.moduleId && (
                                  <span className="text-xs text-muted-foreground">
                                    Module: {flag.location.moduleId}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm">{flag.message}</p>
                              {flag.location?.line && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Line {flag.location.line}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResolve(flag.id)}
                            >
                              Resolve
                            </Button>
                          </div>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Close
                </Button>
                <Button 
                  className="flex-1" 
                  disabled={errorCount > 0}
                >
                  Approve Document
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}