"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Keyboard } from 'lucide-react'

interface ShortcutProps {
  keys: string[]
  description: string
}

function Shortcut({ keys, description }: ShortcutProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <div key={index} className="flex items-center gap-1">
            <Badge variant="outline" className="font-mono text-xs px-2 py-1">
              {key}
            </Badge>
            {index < keys.length - 1 && <span className="text-muted-foreground">+</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { keys: ['⌘', 'S'], description: 'Save document' },
    { keys: ['⌘', 'E'], description: 'Export document' },
    { keys: ['⌘', 'K'], description: 'Open AI Assistant' },
    { keys: ['⌘', 'Q'], description: 'Open Quality Check' },
    { keys: ['⌘', '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close current modal/panel' }
  ]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border rounded-lg shadow-lg p-6 w-full max-w-md z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {shortcuts.map((shortcut, index) => (
                <Shortcut 
                  key={index}
                  keys={shortcut.keys}
                  description={shortcut.description}
                />
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                Press <Badge variant="outline" className="font-mono text-xs">Esc</Badge> to close
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Hook for triggering shortcuts help
export function useKeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Command/Ctrl + / for help
      if ((event.metaKey || event.ctrlKey) && event.key === '/') {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isShortcutsOpen: isOpen,
    openShortcuts: () => setIsOpen(true),
    closeShortcuts: () => setIsOpen(false)
  }
}