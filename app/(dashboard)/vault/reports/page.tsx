"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function VaultReportsPage() {
  // Redirect to existing reports route
  useEffect(() => {
    redirect("/reports")
  }, [])

  return null
}