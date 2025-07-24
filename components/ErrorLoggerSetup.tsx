"use client"

import { useEffect } from 'react'
import { errorLogger } from '@/lib/errorLogger'

export function ErrorLoggerSetup() {
  useEffect(() => {
    // Setup global error handlers
    errorLogger.setupGlobalHandlers()
    
    // Log initialization
    errorLogger.logError('ErrorLogger initialized', 'ErrorLoggerSetup')
  }, [])

  return null // This component doesn't render anything
}