"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function VaultSourcesPage() {
  // Redirect to existing sources route
  useEffect(() => {
    redirect("/sources")
  }, [])

  return null
}