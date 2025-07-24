"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function TestNavPage() {
  const router = useRouter()

  const testNavigation = async () => {
    console.log('Testing navigation to /requests')
    console.log('Current pathname:', window.location.pathname)
    
    try {
      await router.push('/requests')
      console.log('Navigation completed successfully')
      
      setTimeout(() => {
        console.log('Current pathname after navigation:', window.location.pathname)
      }, 1000)
    } catch (error) {
      console.error('Navigation failed:', error)
    }
  }

  const testWorkingStudio = async () => {
    console.log('Testing navigation to /working-studio/req-demo-1')
    console.log('Current pathname:', window.location.pathname)
    
    try {
      await router.push('/working-studio/req-demo-1')
      console.log('Navigation completed successfully')
      
      setTimeout(() => {
        console.log('Current pathname after navigation:', window.location.pathname)
      }, 1000)
    } catch (error) {
      console.error('Navigation failed:', error)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Navigation Test Page</h1>
      <div className="space-y-4">
        <Button onClick={testNavigation}>
          Test Navigate to /requests
        </Button>
        <Button onClick={testWorkingStudio}>
          Test Navigate to /working-studio/req-demo-1
        </Button>
        <p className="text-sm text-muted-foreground">
          Check browser console for navigation logs
        </p>
      </div>
    </div>
  )
}