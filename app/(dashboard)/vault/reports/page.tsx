"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function VaultReportsPage() {
  const router = useRouter()
  
  // Redirect to existing reports route
  useEffect(() => {
    router.push("/reports")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Reports...</p>
      </div>
    </div>
  )
}