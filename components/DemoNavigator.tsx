"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDemoStore } from '@/lib/demo/demoState'

export function DemoNavigator() {
  const router = useRouter()
  const { isDemoMode, currentStep, steps, addDemoData, completeStep } = useDemoStore()

  useEffect(() => {
    if (!isDemoMode) return

    const currentStepData = steps[currentStep]
    if (!currentStepData || currentStepData.completed) return

    const executeStepAction = async () => {
      // Small delay to let user see the step description
      await new Promise(resolve => setTimeout(resolve, 2000))

      switch (currentStepData.action) {
        case 'navigate_to_requests':
          router.push('/requests')
          break

        case 'create_request':
          addDemoData('request', currentStepData.data)
          break

        case 'update_request_status':
          // Update the request status
          setTimeout(() => {
            const store = useDemoStore.getState()
            const requests = [...store.requests]
            const requestIndex = requests.findIndex(r => r.id === 'req-demo-1')
            if (requestIndex >= 0) {
              requests[requestIndex] = {
                ...requests[requestIndex],
                status: 'in_progress',
                updatedAt: new Date()
              }
              store.requests = requests
            }
          }, 500)
          break

        case 'navigate_to_working_studio':
          router.push('/working-studio/req-demo-1')
          break

        case 'create_working_doc':
          addDemoData('working_doc', currentStepData.data)
          break

        case 'add_modules':
          addDemoData('modules', currentStepData.data)
          break

        case 'highlight_sources_hub':
          // Just highlight, no data change
          break

        case 'add_sources':
          addDemoData('sources', currentStepData.data)
          break

        case 'navigate_to_sources':
          router.push('/sources')
          break

        case 'navigate_back_to_studio':
          router.push('/working-studio/req-demo-1')
          break

        case 'demo_ai_assist':
          // This would trigger AI drawer opening
          break

        case 'populate_content':
          // Update the working doc content
          setTimeout(() => {
            const docStore = useDemoStore.getState()
            const workingDocs = [...docStore.workingDocs]
            const docIndex = workingDocs.findIndex(d => d.id === 'doc-demo-1')
            if (docIndex >= 0 && currentStepData.data) {
              workingDocs[docIndex] = {
                ...workingDocs[docIndex],
                briefMD: currentStepData.data.content,
                updatedAt: new Date()
              }
              // This approach has limitations, let's just add new data instead
            }
          }, 500)
          break

        case 'run_quality_check':
          // This would trigger QC overlay
          break

        case 'export_document':
          // This would trigger export modal
          break

        case 'navigate_to_subjects':
          router.push('/subjects')
          break

        case 'demo_complete':
          // Mark final status as delivered
          setTimeout(() => {
            const finalStore = useDemoStore.getState()
            const requests = [...finalStore.requests]
            const requestIndex = requests.findIndex(r => r.id === 'req-demo-1')
            if (requestIndex >= 0) {
              requests[requestIndex] = {
                ...requests[requestIndex],
                status: 'delivered',
                updatedAt: new Date()
              }
            }
          }, 500)
          break

        default:
          break
      }

      // Mark step as completed
      completeStep(currentStepData.id)
      
      // Auto-advance to next step after a delay
      setTimeout(() => {
        const { nextStep, currentStep: newCurrentStep, totalSteps } = useDemoStore.getState()
        if (newCurrentStep < totalSteps - 1) {
          nextStep()
        }
      }, 1500)
    }

    executeStepAction()
  }, [isDemoMode, currentStep, steps, router, addDemoData, completeStep])

  return null // This component only handles navigation logic
}