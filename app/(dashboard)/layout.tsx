"use client"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex">
          <ErrorBoundary>
            <Sidebar />
          </ErrorBoundary>
        </div>

        <div className="flex flex-1 flex-col">
          <ErrorBoundary>
            <Header />
          </ErrorBoundary>
          <main className="flex-1 overflow-y-auto bg-gray-50/50">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}