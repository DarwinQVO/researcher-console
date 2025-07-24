"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoStore } from '@/lib/demo/demoState'

export function SimpleDemoNavigator() {
  const router = useRouter()
  const { isDemoMode, currentStep, steps, nextStep, completeStep } = useDemoStore()

  useEffect(() => {
    if (!isDemoMode) return

    const currentStepData = steps[currentStep]
    if (!currentStepData || currentStepData.completed) return

    // Auto-execute steps with navigation
    const timer = setTimeout(() => {
      console.log(`[Demo] Step ${currentStep + 1}/${steps.length}: ${currentStepData.action}`)
      console.log(`[Demo] Current pathname:`, window.location.pathname)
      
      // Helper function to navigate with retry
      const navigateWithRetry = (path: string, retries = 3) => {
        console.log(`[Demo] Attempting navigation to ${path} (${retries} retries left)`)
        
        try {
          router.push(path)
          
          // Check if navigation worked after a delay
          setTimeout(() => {
            if (window.location.pathname !== path && retries > 0) {
              console.log(`[Demo] Navigation failed, retrying...`)
              navigateWithRetry(path, retries - 1)
            } else {
              console.log(`[Demo] Navigation to ${path} successful`)
            }
          }, 500)
        } catch (error) {
          console.error(`[Demo] Navigation error:`, error)
          if (retries > 0) {
            setTimeout(() => navigateWithRetry(path, retries - 1), 1000)
          }
        }
      }
      
      // Execute the step action
      switch (currentStepData.action) {
        case 'navigate_to_requests':
          navigateWithRetry('/requests')
          break
          
        case 'create_request':
          // Stay on requests page, just complete step
          console.log('[Demo] Creating request (no navigation needed)')
          break
          
        case 'update_request_status':
          // Stay on requests page, just complete step
          console.log('[Demo] Updating request status (no navigation needed)')
          break
          
        case 'navigate_to_working_studio':
          navigateWithRetry('/working-studio/req-demo-1')
          break
          
        case 'create_working_doc':
          // We're already in working studio, just complete step
          break
          
        case 'add_modules':
          // Stay in working studio
          break
          
        case 'highlight_sources_hub':
          // Stay in working studio, just highlight
          break
          
        case 'add_sources':
          // Stay in working studio
          break
          
        case 'navigate_to_sources':
          navigateWithRetry('/sources')
          break
          
        case 'navigate_back_to_studio':
          navigateWithRetry('/working-studio/req-demo-1')
          break
          
        case 'demo_ai_assist':
          // Stay in working studio
          break
          
        case 'populate_content':
          // Stay in working studio
          break
          
        case 'run_quality_check':
          // Stay in working studio
          break
          
        case 'export_document':
          // Stay in working studio
          break
          
        case 'navigate_to_subjects':
          navigateWithRetry('/subjects')
          break
          
        case 'demo_complete':
          // Could navigate back to home or stay
          break
          
        default:
          console.log(`No navigation needed for: ${currentStepData.action}`)
          break
      }

      // Mark step as completed
      completeStep(currentStepData.id)
      console.log(`[Demo] Step ${currentStep + 1} completed: ${currentStepData.id}`)
      
      // Auto-advance to next step
      setTimeout(() => {
        console.log(`[Demo] Advancing to next step. Current: ${currentStep}, Total: ${steps.length}`)
        console.log(`[Demo] Current pathname after step:`, window.location.pathname)
        if (currentStep < steps.length - 1) {
          nextStep()
        }
      }, 2000)
    }, 3000) // 3 seconds to read the step

    return () => clearTimeout(timer)
  }, [isDemoMode, currentStep, steps, router, nextStep, completeStep])

  return null
}