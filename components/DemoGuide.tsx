"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useDemoStore } from '@/lib/demo/demoState'
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
  Zap
} from 'lucide-react'

interface DemoGuideProps {
  className?: string
}

export function DemoGuide({ className = '' }: DemoGuideProps) {
  const {
    isDemoMode,
    isGuidedTour,
    currentStep,
    totalSteps,
    steps,
    startDemo,
    nextStep,
    prevStep,
    resetDemo,
    exitDemo,
    completeStep,
    addDemoData
  } = useDemoStore()

  const [isAnimating, setIsAnimating] = useState(false)
  const currentStepData = steps[currentStep] || null
  const progress = ((currentStep + 1) / totalSteps) * 100

  // Handle data creation for current step
  useEffect(() => {
    if (!isDemoMode) return
    
    const stepData = steps[currentStep]
    if (!stepData || stepData.completed) return
    
    // Add demo data when step requires it
    const timer = setTimeout(() => {
      if (stepData.data && (stepData.action.includes('create') || stepData.action.includes('add'))) {
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
        }
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [currentStep, isDemoMode, steps, addDemoData])

  // Track animation state based on step completion
  useEffect(() => {
    if (!isDemoMode) return
    
    const stepData = steps[currentStep]
    if (!stepData) return

    if (!stepData.completed) {
      setIsAnimating(true)
      // Stop animating when step completes
      const checkCompletion = setInterval(() => {
        const updatedStep = steps[currentStep]
        if (updatedStep && updatedStep.completed) {
          setIsAnimating(false)
          clearInterval(checkCompletion)
        }
      }, 100)

      return () => clearInterval(checkCompletion)
    }
  }, [currentStep, isDemoMode, steps])

  if (!isDemoMode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
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
              Iniciar Demo
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed top-4 right-4 z-50 ${className}`}
      >
        <Card className="w-96 shadow-xl border-2 border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Play className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Demo Activo</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Paso {currentStep + 1} de {totalSteps}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={exitDemo}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-4">
            {currentStepData && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {currentStepData.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : isAnimating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Circle className="h-5 w-5 text-primary" />
                    </motion.div>
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <h3 className="font-semibold text-sm">{currentStepData.title}</h3>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
                
                {currentStepData.targetElement && (
                  <Badge variant="outline" className="text-xs">
                    Enfoque: {currentStepData.targetElement.replace('#', '')}
                  </Badge>
                )}
              </div>
            )}
            
            {isAnimating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 p-2 bg-primary/5 rounded-md"
              >
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
                <span className="text-xs text-primary font-medium">
                  Ejecutando paso...
                </span>
              </motion.div>
            )}
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  disabled={currentStep === totalSteps - 1}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetDemo}
                className="text-xs"
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

export function DemoStartButton() {
  const { startDemo } = useDemoStore()
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Button
        onClick={startDemo}
        size="lg"
        className="shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
      >
        <Play className="h-5 w-5 mr-2" />
        Ver Demo Completo
      </Button>
    </motion.div>
  )
}