"use client"

import { useState, useEffect } from 'react'
import { CheckCircle2, Wifi, WifiOff, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaveStatusIndicatorProps {
  isSaving: boolean
  lastSaved: Date
  isOnline: boolean
  wordCount: number
  className?: string
}

export function SaveStatusIndicator({
  isSaving,
  lastSaved,
  isOnline,
  wordCount,
  className
}: SaveStatusIndicatorProps) {
  const [timeAgo, setTimeAgo] = useState('')

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
      
      if (diffInSeconds < 60) {
        setTimeAgo('hace unos segundos')
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeAgo(`hace ${minutes}m`)
      } else {
        setTimeAgo(lastSaved.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }))
      }
    }

    updateTimeAgo()
    const interval = setInterval(updateTimeAgo, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [lastSaved])

  const getStatusIcon = () => {
    if (isSaving) {
      return <Clock className="h-3 w-3 animate-pulse text-blue-500" />
    }
    if (!isOnline) {
      return <WifiOff className="h-3 w-3 text-red-500" />
    }
    return <CheckCircle2 className="h-3 w-3 text-green-500" />
  }

  const getStatusText = () => {
    if (isSaving) return 'Guardando...'
    if (!isOnline) return 'Sin conexión'
    return `Guardado ${timeAgo}`
  }

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50",
      className
    )}>
      {getStatusIcon()}
      <span className="text-xs">
        {getStatusText()}
      </span>
      {isOnline && !isSaving && (
        <>
          <span className="text-muted-foreground/50">•</span>
          <span className="text-xs">
            {wordCount} palabras
          </span>
        </>
      )}
      {isOnline && (
        <Wifi className="h-3 w-3 text-green-500 ml-1" />
      )}
    </div>
  )
}