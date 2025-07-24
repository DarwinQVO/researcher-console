"use client"

import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { errorLogger } from '@/lib/errorLogger'

export function useSafeNavigation() {
  const router = useRouter()

  const safeNavigate = useCallback((path: string, component?: string) => {
    try {
      router.push(path)
    } catch (error) {
      errorLogger.logError(
        error as Error, 
        component || 'useSafeNavigation',
        { attemptedPath: path }
      )
      
      // Fallback: try to refresh the page if navigation fails
      if (typeof window !== 'undefined') {
        try {
          window.location.href = path
        } catch (fallbackError) {
          errorLogger.logError(
            fallbackError as Error,
            'useSafeNavigation-fallback',
            { attemptedPath: path }
          )
        }
      }
    }
  }, [router])

  const safeReplace = useCallback((path: string, component?: string) => {
    try {
      router.replace(path)
    } catch (error) {
      errorLogger.logError(
        error as Error,
        component || 'useSafeNavigation-replace',
        { attemptedPath: path }
      )
    }
  }, [router])

  const safeBack = useCallback((component?: string) => {
    try {
      router.back()
    } catch (error) {
      errorLogger.logError(
        error as Error,
        component || 'useSafeNavigation-back'
      )
    }
  }, [router])

  return {
    navigate: safeNavigate,
    replace: safeReplace,
    back: safeBack
  }
}