"use client"

import { motion } from "framer-motion"
import { Loader2, Brain, FileText, Search, Wand2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface LoadingStateProps {
  type: 'ai' | 'save' | 'export' | 'search' | 'general'
  message?: string
  progress?: number
  subMessage?: string
}

export function LoadingState({ type, message, progress, subMessage }: LoadingStateProps) {
  const configs = {
    ai: {
      icon: Brain,
      defaultMessage: "AI is thinking...",
      color: "text-purple-500"
    },
    save: {
      icon: FileText,
      defaultMessage: "Saving changes...",
      color: "text-blue-500"
    },
    export: {
      icon: FileText,
      defaultMessage: "Generating export...",
      color: "text-green-500"
    },
    search: {
      icon: Search,
      defaultMessage: "Searching...",
      color: "text-orange-500"
    },
    general: {
      icon: Loader2,
      defaultMessage: "Processing...",
      color: "text-primary"
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <motion.div
        animate={{ rotate: type === 'general' ? 360 : 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Icon className={`h-8 w-8 ${config.color}`} />
      </motion.div>
      
      <div className="text-center space-y-2">
        <p className="text-sm font-medium">{message || config.defaultMessage}</p>
        {subMessage && (
          <p className="text-xs text-muted-foreground">{subMessage}</p>
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <Progress value={progress} className="h-2" animated />
          <p className="text-xs text-center mt-1 text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
      )}

      {/* Animated dots */}
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export function SkeletonLoader({ lines = 3, className = "" }: { lines?: number, className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{ width: `${85 + Math.random() * 15}%` }}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}