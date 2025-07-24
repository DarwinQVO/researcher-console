"use client"

import { useToast as useOriginalToast } from '@/lib/use-toast'
import { useNotificationStore } from './notificationStore'
import { useCallback } from 'react'

export interface EnhancedToastProps {
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  category?: 'system' | 'export' | 'ai' | 'save' | 'citation' | 'connection'
  actionText?: string
  actionCallback?: () => void
  // Control options
  persistToCenter?: boolean // Whether to add to notification center (default: true)
  showToast?: boolean // Whether to show ephemeral toast (default: true)
  duration?: number // Custom duration for toast
}

export function useEnhancedToast() {
  const { toast: originalToast } = useOriginalToast()
  const { addNotification } = useNotificationStore()

  const toast = useCallback((props: EnhancedToastProps) => {
    const {
      title,
      description,
      variant = 'default',
      category = 'system',
      actionText,
      actionCallback,
      persistToCenter = true,
      showToast = true,
      duration
    } = props

    // Show ephemeral toast if requested
    if (showToast) {
      originalToast({
        title,
        description,
        variant,
        duration
      })
    }

    // Add to notification center if requested
    if (persistToCenter) {
      addNotification({
        title,
        description,
        variant,
        category,
        actionText,
        actionCallback
      })
    }
  }, [originalToast, addNotification])

  // Convenience methods for common use cases
  const success = useCallback((props: Omit<EnhancedToastProps, 'variant'>) => {
    toast({ ...props, variant: 'success' })
  }, [toast])

  const error = useCallback((props: Omit<EnhancedToastProps, 'variant'>) => {
    toast({ ...props, variant: 'destructive' })
  }, [toast])

  const info = useCallback((props: Omit<EnhancedToastProps, 'variant'>) => {
    toast({ ...props, variant: 'default' })
  }, [toast])

  // Special methods for common categories
  const saveNotification = useCallback((props: Omit<EnhancedToastProps, 'category' | 'variant'>) => {
    toast({ ...props, category: 'save', variant: 'success' })
  }, [toast])

  const exportNotification = useCallback((props: Omit<EnhancedToastProps, 'category'>) => {
    toast({ ...props, category: 'export' })
  }, [toast])

  const aiNotification = useCallback((props: Omit<EnhancedToastProps, 'category'>) => {
    toast({ ...props, category: 'ai' })
  }, [toast])

  const citationNotification = useCallback((props: Omit<EnhancedToastProps, 'category'>) => {
    toast({ ...props, category: 'citation' })
  }, [toast])

  const connectionNotification = useCallback((props: Omit<EnhancedToastProps, 'category'>) => {
    toast({ ...props, category: 'connection' })
  }, [toast])

  return {
    toast,
    success,
    error,
    info,
    saveNotification,
    exportNotification,
    aiNotification,
    citationNotification,
    connectionNotification
  }
}

// Legacy compatibility - this can be used as a drop-in replacement
export function useToast() {
  const { toast: enhancedToast } = useEnhancedToast()
  const { toast: originalToast, dismiss } = useOriginalToast()

  const toast = useCallback((props: Parameters<typeof originalToast>[0] & { 
    persistToCenter?: boolean,
    category?: EnhancedToastProps['category']
  }) => {
    const { persistToCenter = true, category = 'system', ...originalProps } = props
    
    // Show original toast
    originalToast(originalProps)
    
    // Add to notification center if requested
    if (persistToCenter) {
      enhancedToast({
        title: originalProps.title || 'Notification',
        description: originalProps.description,
        variant: originalProps.variant || 'default',
        category,
        showToast: false // Don't show toast again since we already showed it
      })
    }
  }, [originalToast, enhancedToast])

  return { toast, dismiss }
}