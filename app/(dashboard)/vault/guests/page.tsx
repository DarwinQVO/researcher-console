"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function VaultGuestsPage() {
  // For now, redirect to the old subjects route to maintain compatibility
  // In production, this would be the new Guests database interface
  useEffect(() => {
    redirect("/subjects")
  }, [])

  return null
}