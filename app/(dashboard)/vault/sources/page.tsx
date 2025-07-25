"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function VaultSourcesPage() {
  const router = useRouter()
  
  // Redirect to existing sources route
  useEffect(() => {
    router.push("/sources")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to Sources...</p>
      </div>
    </div>
  )
}