"use client"

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useEnterpriseDemoStore } from '@/lib/demo/enterpriseDemoState'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  X, 
  CheckCircle2,
  Circle,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
  Pause
} from 'lucide-react'

interface EnterpriseNavigatorProps {
  className?: string
}

export function EnterpriseNavigator({ className = '' }: EnterpriseNavigatorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { 
    isDemoMode, 
    currentStep, 
    steps, 
    nextStep, 
    prevStep, 
    completeStep, 
    resetDemo, 
    exitDemo,
    addDemoData 
  } = useEnterpriseDemoStore()

  const [isNavigating, setIsNavigating] = useState(false)
  const [navigationQueue, setNavigationQueue] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Enhanced navigation with proper error handling and state management
  const navigateToPath = async (path: string): Promise<boolean> => {
    console.log(`[Enterprise Demo] Starting navigation to: ${path}`)
    setIsNavigating(true)
    setError(null)

    try {
      // Add to navigation queue for tracking
      setNavigationQueue(prev => [...prev, path])
      
      // Perform navigation
      router.push(path)
      
      // Wait for navigation to complete and verify
      return new Promise((resolve) => {
        const checkNavigation = () => {
          setTimeout(() => {
            const currentPath = window.location.pathname
            console.log(`[Enterprise Demo] Navigation check - Current: ${currentPath}, Target: ${path}`)
            
            // More flexible path matching for dynamic routes
            const pathMatches = currentPath === path || 
                               (path.includes('/working-studio/') && currentPath.includes('/working-studio/'))
            
            // Special handling for working-studio - check if page is actually loaded
            if (path.includes('/working-studio/') && currentPath.includes('/working-studio/')) {
              // Give extra time for working-studio page to load
              setTimeout(() => {
                const pageContent = document.querySelector('main') || document.querySelector('[role="main"]') || document.body
                const hasContent = pageContent && pageContent.textContent && pageContent.textContent.length > 100
                
                console.log(`[Enterprise Demo] Working studio page content check: ${hasContent}`)
                
                if (hasContent) {
                  console.log(`[Enterprise Demo] Working studio loaded successfully`)
                  setIsNavigating(false)
                  setNavigationQueue(prev => prev.filter(p => p !== path))
                  resolve(true)
                } else if (retryCountRef.current < maxRetries) {
                  retryCountRef.current++
                  console.log(`[Enterprise Demo] Working studio not fully loaded, retry ${retryCountRef.current}/${maxRetries}`)
                  router.push(path)
                  checkNavigation()
                } else {
                  console.error(`[Enterprise Demo] Working studio failed to load after ${maxRetries} retries`)
                  setError(`Failed to load working studio`)
                  setIsNavigating(false)
                  resolve(false)
                }
              }, 500)
            } else if (pathMatches) {
              console.log(`[Enterprise Demo] Navigation successful to ${path}`)
              setIsNavigating(false)
              setNavigationQueue(prev => prev.filter(p => p !== path))
              resolve(true)
            } else if (retryCountRef.current < maxRetries) {
              retryCountRef.current++
              console.log(`[Enterprise Demo] Navigation retry ${retryCountRef.current}/${maxRetries}`)
              router.push(path)
              checkNavigation()
            } else {
              console.error(`[Enterprise Demo] Navigation failed after ${maxRetries} retries`)
              setError(`Failed to navigate to ${path}`)
              setIsNavigating(false)
              resolve(false)
            }
          }, 1500)
        }
        checkNavigation()
      })
    } catch (error) {
      console.error('[Enterprise Demo] Navigation error:', error)
      setError(`Navigation error: ${error}`)
      setIsNavigating(false)
      return false
    }
  }

  // Execute demo step with proper sequencing
  const executeStep = async (stepData: typeof currentStepData) => {
    if (!stepData || stepData.completed) return

    console.log(`[Enterprise Demo] Executing step: ${stepData.title}`)
    setError(null)
    retryCountRef.current = 0

    // Add demo data first if needed (synchronously)
    if (stepData.data && (stepData.action.includes('create') || stepData.action.includes('add') || stepData.action.includes('update'))) {
      console.log(`[Enterprise Demo] Adding demo data for: ${stepData.action}`)
      switch (stepData.action) {
        case 'create_request':
          addDemoData('request', stepData.data)
          break
        case 'create_working_doc':
          addDemoData('working_doc', stepData.data)
          break
        case 'add_modules':
          addDemoData('modules', stepData.data)
          break
        case 'add_sources':
          addDemoData('sources', stepData.data)
          break
        case 'update_request_status':
          addDemoData('update_request_status', stepData.data)
          break
      }
      // Small delay to ensure data is committed
      await new Promise(resolve => setTimeout(resolve, 300))
    }

    // Handle navigation actions
    let navigationSuccess = true
    switch (stepData.action) {
      case 'navigate_to_requests':
        navigationSuccess = await navigateToPath('/requests')
        break
      case 'navigate_to_working_studio':
        navigationSuccess = await navigateToPath('/working-studio/req-demo-1')
        
        // Fallback: if navigation claims to fail but we're actually on the right page
        if (!navigationSuccess && window.location.pathname.includes('/working-studio/')) {
          console.log(`[Enterprise Demo] Navigation fallback: we're on working studio, considering it successful`)
          navigationSuccess = true
        }
        break
      case 'navigate_to_sources':
        navigationSuccess = await navigateToPath('/sources')
        break
      case 'navigate_back_to_studio':
        navigationSuccess = await navigateToPath('/working-studio/req-demo-1')
        
        // Fallback: if navigation claims to fail but we're actually on the right page
        if (!navigationSuccess && window.location.pathname.includes('/working-studio/')) {
          console.log(`[Enterprise Demo] Navigation fallback: we're back on working studio, considering it successful`)
          navigationSuccess = true
        }
        break
      case 'navigate_to_subjects':
        navigationSuccess = await navigateToPath('/subjects')
        break
      
      // Non-navigation steps - handle each specifically
      case 'highlight_sources_hub':
        console.log(`[Enterprise Demo] Highlighting sources hub`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`[Enterprise Demo] Sources hub highlighted successfully`)
        break
      
      case 'demo_ai_assist':
        console.log(`[Enterprise Demo] Demonstrating AI assist`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`[Enterprise Demo] AI assist demonstrated successfully`)
        break
      
      case 'populate_content':
        console.log(`[Enterprise Demo] Populating content`)
        await new Promise(resolve => setTimeout(resolve, 1500))
        console.log(`[Enterprise Demo] Content populated successfully`)
        break
      
      case 'run_quality_check':
        console.log(`[Enterprise Demo] Running quality check`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`[Enterprise Demo] Quality check completed successfully`)
        break
      
      case 'export_document':
        console.log(`[Enterprise Demo] Exporting document`)
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log(`[Enterprise Demo] Document exported successfully`)
        break
      
      case 'demo_complete':
        console.log(`[Enterprise Demo] Demo completion step`)
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log(`[Enterprise Demo] Demo completed successfully`)
        break
      
      default:
        // Any other non-navigation steps
        console.log(`[Enterprise Demo] Generic non-navigation step: ${stepData.action}`)
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          console.log(`[Enterprise Demo] Non-navigation step executed successfully: ${stepData.action}`)
        } catch (error) {
          console.error(`[Enterprise Demo] Error in non-navigation step: ${stepData.action}`, error)
          navigationSuccess = false
        }
        break
    }

    console.log(`[Enterprise Demo] Navigation success: ${navigationSuccess}`)

    if (navigationSuccess) {
      // Mark step as completed
      completeStep(stepData.id)
      console.log(`[Enterprise Demo] Step completed: ${stepData.title}`)
      
      // Auto-advance to next step after delay
      const currentStepAtExecution = currentStep
      setTimeout(() => {
        console.log(`[Enterprise Demo] Auto-advancing: isPaused=${isPaused}, currentStepAtExecution=${currentStepAtExecution}, totalSteps=${steps.length}`)
        if (!isPaused && currentStepAtExecution < steps.length - 1) {
          console.log(`[Enterprise Demo] Calling nextStep() from step ${currentStepAtExecution}`)
          nextStep()
        } else {
          console.log(`[Enterprise Demo] Not advancing: demo finished or paused`)
        }
      }, 2500)
    } else {
      console.error(`[Enterprise Demo] Step failed: ${stepData.title}`)
      setError(`Failed to complete step: ${stepData.title}`)
    }
  }

  // Main demo execution effect
  useEffect(() => {
    console.log(`[Enterprise Demo] useEffect triggered - isDemoMode: ${isDemoMode}, currentStep: ${currentStep}, completed: ${currentStepData?.completed}, isPaused: ${isPaused}`)
    
    if (!isDemoMode) {
      console.log(`[Enterprise Demo] Demo mode is off, skipping execution`)
      return
    }
    
    if (!currentStepData) {
      console.log(`[Enterprise Demo] No current step data, skipping execution`)
      return
    }
    
    if (currentStepData.completed) {
      console.log(`[Enterprise Demo] Current step already completed: ${currentStepData.title}`)
      return
    }
    
    if (isPaused) {
      console.log(`[Enterprise Demo] Demo is paused, skipping execution`)
      return
    }

    console.log(`[Enterprise Demo] Starting step execution: ${currentStepData.title}`)

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Start step execution after reading time
    timerRef.current = setTimeout(() => {
      console.log(`[Enterprise Demo] Executing step after timeout: ${currentStepData.title}`)
      executeStep(currentStepData)
    }, 3000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isDemoMode, currentStep, currentStepData, isPaused])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  if (!isDemoMode) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed top-4 right-4 z-[100] ${className}`}
      >
        <Card className="w-96 shadow-2xl border-2 border-primary/30 bg-background/95 backdrop-blur-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Play className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Enterprise Demo</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Paso {currentStep + 1} de {steps.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPaused(!isPaused)}
                  className="h-8 w-8"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={exitDemo}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentStepData && (
              <motion.div
                key={currentStepData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {currentStepData.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : isNavigating ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Circle className="h-5 w-5 text-primary" />
                      </motion.div>
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{currentStepData.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>
                
                {/* Status indicators */}
                <div className="flex items-center gap-2">
                  {isNavigating && (
                    <Badge variant="secondary" className="text-xs">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      Navegando...
                    </Badge>
                  )}
                  {isPaused && (
                    <Badge variant="outline" className="text-xs">
                      <Pause className="h-3 w-3 mr-1" />
                      Pausado
                    </Badge>
                  )}
                  {error && (
                    <Badge variant="destructive" className="text-xs">
                      Error
                    </Badge>
                  )}
                </div>

                {/* Error display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            )}
            
            {/* Controls */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0 || isNavigating}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1 || isNavigating}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
                
                {/* Debug force next button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    console.log('[Debug] Force advancing step')
                    completeStep(currentStepData?.id || '')
                    setTimeout(() => nextStep(), 100)
                  }}
                  className="text-xs opacity-50 hover:opacity-100 h-8 w-8 p-0"
                  title="Force advance step (debug)"
                >
                  ⚡
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDemo}
                className="text-xs"
                disabled={isNavigating}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reiniciar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

// Demo start button component (inline version for hero)
export function EnterpriseDemoButton() {
  const { startDemo } = useEnterpriseDemoStore()
  
  return (
    <Button
      onClick={startDemo}
      size="lg"
      className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-white border-0"
    >
      <Play className="h-5 w-5 mr-2" />
      Demo Enterprise
    </Button>
  )
}

// Floating demo button component
export function FloatingDemoButton() {
  const { startDemo, isDemoMode } = useEnterpriseDemoStore()
  
  // Hide floating button when demo is active
  if (isDemoMode) return null
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <Button
        onClick={startDemo}
        size="lg"
        className="shadow-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-white border-0"
      >
        <Play className="h-5 w-5 mr-2" />
        Demo Enterprise
      </Button>
    </motion.div>
  )
}

// Empty state demo invitation
export function DemoInvitation() {
  const { startDemo } = useEnterpriseDemoStore()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Card className="w-80 shadow-xl border-2 border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Demo Interactivo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿Quieres ver cómo funciona todo el sistema paso a paso? 
            Te guiaremos desde cero mostrando cada funcionalidad.
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              <span>Sistema guiado</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-500" />
              <span>Datos reales</span>
            </div>
          </div>
          
          <Button onClick={startDemo} className="w-full" size="lg">
            <Play className="h-4 w-4 mr-2" />
            Iniciar Demo Enterprise
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}