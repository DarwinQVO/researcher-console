"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDemoStore } from '@/lib/demo/demoState'

interface DemoHighlightProps {
  targetId: string
  step: number
  className?: string
}

export function DemoHighlight({ targetId, step, className = '' }: DemoHighlightProps) {
  const { isDemoMode, currentStep } = useDemoStore()
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isDemoMode || currentStep !== step) {
      setIsVisible(false)
      return
    }

    const element = document.getElementById(targetId.replace('#', ''))
    if (element) {
      setTargetElement(element)
      setIsVisible(true)
      
      // Smooth scroll to element
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'center'
      })
    }
  }, [isDemoMode, currentStep, step, targetId])

  if (!isVisible || !targetElement) return null

  const rect = targetElement.getBoundingClientRect()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Spotlight hole */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute bg-transparent border-4 border-primary rounded-lg shadow-2xl"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: `
              0 0 0 4px rgba(var(--primary), 0.3),
              0 0 0 9999px rgba(0, 0, 0, 0.4)
            `
          }}
        >
          {/* Pulsing animation */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 border-2 border-primary rounded-lg"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function DemoPointer({ targetId, step }: { targetId: string, step: number }) {
  const { isDemoMode, currentStep } = useDemoStore()
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!isDemoMode || currentStep !== step) return

    const element = document.getElementById(targetId.replace('#', ''))
    if (element) {
      setTargetElement(element)
    }
  }, [isDemoMode, currentStep, step, targetId])

  if (!isDemoMode || currentStep !== step || !targetElement) return null

  const rect = targetElement.getBoundingClientRect()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: rect.right + 10,
        top: rect.top + rect.height / 2 - 12
      }}
    >
      <motion.div
        animate={{
          x: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex items-center text-primary"
      >
        <div className="text-2xl">👉</div>
      </motion.div>
    </motion.div>
  )
}