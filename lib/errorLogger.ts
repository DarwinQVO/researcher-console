interface ErrorLog {
  timestamp: string
  error: string
  stack?: string
  component?: string
  userAgent?: string
  url?: string
  userId?: string
}

class ErrorLogger {
  private logs: ErrorLog[] = []
  private maxLogs = 100

  logError(error: Error | string, component?: string, context?: Record<string, any>) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      component,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...context
    }

    this.logs.unshift(errorLog)
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${component || 'Unknown Component'}`)
      console.error('Error:', error)
      if (context) {
        console.log('Context:', context)
      }
      console.groupEnd()
    }

    // In production, you might want to send to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    }
  }

  getRecentLogs(limit = 10): ErrorLog[] {
    return this.logs.slice(0, limit)
  }

  clearLogs() {
    this.logs = []
  }

  // Global error handlers
  setupGlobalHandlers() {
    if (typeof window === 'undefined') return

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        'UnhandledPromiseRejection'
      )
    })

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError(
        event.error || new Error(event.message),
        'GlobalErrorHandler',
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      )
    })
  }
}

export const errorLogger = new ErrorLogger()

// Hook for React components
export function useErrorLogger() {
  return {
    logError: errorLogger.logError.bind(errorLogger),
    getRecentLogs: errorLogger.getRecentLogs.bind(errorLogger)
  }
}

// Safe wrapper for potentially failing operations
export function safeExecute<T>(
  operation: () => T,
  fallback: T,
  component?: string
): T {
  try {
    return operation()
  } catch (error) {
    errorLogger.logError(error as Error, component)
    return fallback
  }
}

// Safe async wrapper
export async function safeExecuteAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  component?: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    errorLogger.logError(error as Error, component)
    return fallback
  }
}