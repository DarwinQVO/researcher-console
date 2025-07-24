"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { NotificationCenter } from "@/components/NotificationCenter"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-xl font-semibold">Researcher Console</h1>
          
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <NotificationCenter />
          </div>
        </div>
      </div>
    </header>
  )
}
