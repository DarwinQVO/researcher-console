"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/contexts/SidebarContext"
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  BookOpen,
  Settings,
  Edit3,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const navigation = [
  { name: "Requests", href: "/requests", icon: LayoutDashboard },
  { name: "Working Studio", href: "/working-studio/req-1", icon: Edit3 },
  { name: "Subjects", href: "/subjects", icon: Users },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Sources", href: "/sources", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className={cn(
      "flex h-full flex-col gap-y-5 overflow-y-auto border-r bg-background pb-4 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16 px-2" : "w-64 px-6"
    )}>
      {/* Header with toggle button */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <span className={cn(
          "text-xl font-semibold transition-opacity duration-300",
          isCollapsed ? "opacity-0 w-0" : "opacity-100"
        )}>
          RC
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 hover:bg-muted"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href) || 
              (item.name === "Working Studio" && pathname.startsWith("/working-studio"))
            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size={isCollapsed ? "icon" : "default"}
                    className={cn(
                      "w-full transition-all duration-300",
                      isCollapsed ? "justify-center px-0" : "justify-start",
                      isActive && "bg-secondary"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isCollapsed ? "mr-0" : "mr-3"
                    )} />
                    <span className={cn(
                      "transition-all duration-300",
                      isCollapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
                    )}>
                      {item.name}
                    </span>
                  </Button>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
