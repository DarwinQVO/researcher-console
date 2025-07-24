"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface CollaboratorCursor {
  id: string
  name: string
  avatar?: string
  color: string
  x: number
  y: number
  lastSeen: Date
}

interface CollaborationCursorsProps {
  isEnabled?: boolean
}

const MOCK_COLLABORATORS = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: undefined,
    color: 'bg-blue-500',
    x: 0,
    y: 0,
    lastSeen: new Date()
  },
  {
    id: '2', 
    name: 'Mike Rodriguez',
    avatar: undefined,
    color: 'bg-green-500',
    x: 0,
    y: 0,
    lastSeen: new Date()
  }
]

export function CollaborationCursors({ isEnabled = true }: CollaborationCursorsProps) {
  const [cursors, setCursors] = useState<CollaboratorCursor[]>([])
  const [showCursors, setShowCursors] = useState(false)

  useEffect(() => {
    if (!isEnabled) return

    // Simulate collaborators joining
    const joinTimer = setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance of showing collaborators
        setShowCursors(true)
        setCursors(MOCK_COLLABORATORS)
      }
    }, 5000 + Math.random() * 10000) // 5-15 seconds after page load

    return () => clearTimeout(joinTimer)
  }, [isEnabled])

  useEffect(() => {
    if (!showCursors || cursors.length === 0) return

    // Animate cursor movements
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: Math.max(0, Math.min(window.innerWidth - 100, cursor.x + (Math.random() - 0.5) * 200)),
        y: Math.max(0, Math.min(window.innerHeight - 100, cursor.y + (Math.random() - 0.5) * 200)),
        lastSeen: new Date()
      })))
    }, 2000 + Math.random() * 3000) // Move every 2-5 seconds

    // Simulate users leaving
    const leaveTimer = setTimeout(() => {
      if (Math.random() > 0.7) {
        setCursors(prev => prev.slice(0, -1))
      }
    }, 30000 + Math.random() * 30000) // Leave after 30-60 seconds

    return () => {
      clearInterval(interval)
      clearTimeout(leaveTimer)
    }
  }, [showCursors, cursors.length])

  return (
    <AnimatePresence>
      {cursors.map((cursor) => (
        <motion.div
          key={cursor.id}
          className="fixed pointer-events-none z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: cursor.x,
            y: cursor.y
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          {/* Cursor */}
          <div className="relative">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-md"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={cursor.color.replace('bg-', '')}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            
            {/* Name label */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-2 whitespace-nowrap"
            >
              <div className={`px-2 py-1 rounded text-xs font-medium text-white shadow-lg ${cursor.color}`}>
                {cursor.name}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  )
}

export function CollaborationIndicator({ activeUsers = 0 }: { activeUsers?: number }) {
  const [users, setUsers] = useState(activeUsers)
  
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate users joining/leaving
      setUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1
        return Math.max(0, Math.min(5, prev + change))
      })
    }, 15000 + Math.random() * 15000)

    return () => clearInterval(interval)
  }, [])

  if (users === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-1"
    >
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(users, 3) }).map((_, i) => (
          <Avatar key={i} className="w-6 h-6 border-2 border-background">
            <AvatarFallback className={`text-xs ${
              ['bg-blue-500', 'bg-green-500', 'bg-purple-500'][i]
            } text-white`}>
              {['SC', 'MR', 'JD'][i]}
            </AvatarFallback>
          </Avatar>
        ))}
        {users > 3 && (
          <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <span className="text-xs font-medium">+{users - 3}</span>
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground ml-1">
        {users === 1 ? '1 person' : `${users} people`} editing
      </span>
    </motion.div>
  )
}