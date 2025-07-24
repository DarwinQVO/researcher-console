"use client"

import { Header } from "@/components/Header"
import { Sidebar } from "@/components/Sidebar"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext"

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()
  
  return (
    <div className="flex h-screen overflow-hidden layout-stable zoom-stable">
      <div className={`hidden md:flex sidebar-transition ${isCollapsed ? 'w-0' : ''}`}>
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      </div>

      <div className="flex flex-1 flex-col min-w-0 responsive-container">
            <ErrorBoundary>
              <Header />
            </ErrorBoundary>
            <main className="flex-1 overflow-y-auto bg-gray-50/50 zoom-stable">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </div>
        </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </ErrorBoundary>
  )
}