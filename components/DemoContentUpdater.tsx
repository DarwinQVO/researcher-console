"use client"

import { useEffect } from 'react'
import { useEnterpriseDemoStore } from '@/lib/demo/enterpriseDemoState'

interface DemoContentUpdaterProps {
  onContentUpdate?: (content: string) => void
  onModuleUpdate?: (modules: any[]) => void
}

export function DemoContentUpdater({ onContentUpdate, onModuleUpdate }: DemoContentUpdaterProps) {
  const { isDemoMode, currentStep, steps } = useEnterpriseDemoStore()

  useEffect(() => {
    if (!isDemoMode) return

    const currentStepData = steps[currentStep]
    if (!currentStepData || !currentStepData.completed) return

    // Handle content updates based on step
    if (currentStepData.action === 'populate_content' && currentStepData.data?.content && onContentUpdate) {
      setTimeout(() => {
        onContentUpdate(currentStepData.data.content)
      }, 1500)
    }

    // Handle module updates
    if (currentStepData.action === 'add_modules' && currentStepData.data && onModuleUpdate) {
      setTimeout(() => {
        onModuleUpdate(currentStepData.data)
      }, 1000)
    }
  }, [isDemoMode, currentStep, steps, onContentUpdate, onModuleUpdate])

  return null
}