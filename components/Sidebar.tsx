"use client"

import { useState } from "react"
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
  ChevronRight,
  ChevronDown,
  Calendar,
  Clock,
  Inbox,
  Package,
  Globe,
  Puzzle,
  Terminal,
  Archive,
  PenTool
} from "lucide-react"

const navigation = [
  // Desk - Single unified dashboard
  { 
    name: "Desk", 
    href: "/desk", 
    icon: LayoutDashboard
  },
  
  // Working Doc - Holy Trinity layout
  { 
    name: "Working Doc", 
    href: "/working-doc", 
    icon: PenTool
  },
  
  // Tools - Nav group
  { 
    name: "Tools", 
    isGroup: true,
    icon: Package,
    children: [
      { name: "Modules", href: "/tools/modules", icon: Package },
      { name: "Channels", href: "/tools/channels", icon: Globe },
      { name: "Domains", href: "/tools/domains", icon: Globe },
      { name: "Extensions", href: "/tools/extensions", icon: Puzzle },
      { name: "Prompts", href: "/tools/prompts", icon: Terminal },
    ]
  },
  
  // Vault - Nav group
  { 
    name: "Vault", 
    isGroup: true,
    icon: Archive,
    children: [
      { name: "Guests", href: "/vault/guests", icon: Users },
      { name: "Sources", href: "/vault/sources", icon: BookOpen },
      { name: "Clients", href: "/vault/clients", icon: Users },
      { name: "Reports", href: "/vault/reports", icon: FileText },
    ]
  },
  
  // Settings - Bottom level
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Tools', 'Vault']))

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupName)) {
        newSet.delete(groupName)
      } else {
        newSet.add(groupName)
      }
      return newSet
    })
  }

  const renderNavItem = (item: any, level = 0) => {
    const isActive = item.href && (
      pathname === item.href || 
      pathname.startsWith(item.href + '/')
    )

    // Nav group
    if (item.isGroup) {
      const isExpanded = expandedGroups.has(item.name)
      return (
        <div key={item.name} className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleGroup(item.name)}
            className={cn(
              "w-full justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:bg-transparent",
              isCollapsed && "hidden"
            )}
          >
            <span className="flex items-center gap-2">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.name}
            </span>
            <ChevronDown className={cn(
              "h-3 w-3 transition-transform",
              isExpanded ? "" : "-rotate-90"
            )} />
          </Button>
          {isExpanded && !isCollapsed && (
            <ul className="mt-1 space-y-0.5">
              {item.children?.map((child: any) => (
                <li key={child.name} className="ml-2">
                  {renderNavItem(child, level + 1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    // Regular nav item with optional children
    if (item.children) {
      const isExpanded = expandedGroups.has(item.name)
      return (
        <div key={item.name}>
          <Link href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size={isCollapsed ? "icon" : "default"}
              className={cn(
                "w-full transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "justify-start",
                isActive && "bg-secondary",
                level > 0 && "text-sm"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              {item.icon && (
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isCollapsed ? "mr-0" : "mr-3",
                  level > 0 && "h-4 w-4"
                )} />
              )}
              <span className={cn(
                "flex-1 text-left transition-all duration-300",
                isCollapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
              )}>
                {item.name}
              </span>
              {!isCollapsed && item.children && (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform ml-auto",
                    isExpanded ? "" : "-rotate-90"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleGroup(item.name)
                  }}
                />
              )}
            </Button>
          </Link>
          {isExpanded && !isCollapsed && item.children && (
            <ul className="mt-1 ml-4 space-y-0.5 border-l pl-4">
              {item.children.map((child: any) => (
                <li key={child.name}>
                  {renderNavItem(child, level + 1)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    // Simple nav item
    return (
      <Link href={item.href} key={item.name}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "w-full transition-all duration-300",
            isCollapsed ? "justify-center px-0" : "justify-start",
            isActive && "bg-secondary",
            level > 0 && "text-sm"
          )}
          title={isCollapsed ? item.name : undefined}
        >
          {item.icon && (
            <item.icon className={cn(
              "h-5 w-5 transition-all duration-300",
              isCollapsed ? "mr-0" : "mr-3",
              level > 0 && "h-4 w-4"
            )} />
          )}
          <span className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-0 opacity-0 overflow-hidden" : "opacity-100"
          )}>
            {item.name}
          </span>
        </Button>
      </Link>
    )
  }

  return (
    <>
      {/* Toggle button when sidebar is hidden */}
      {isCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="fixed left-2 top-4 z-50 h-8 w-8 hover:bg-muted bg-background border shadow-sm"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "flex h-full flex-col gap-y-5 overflow-y-auto border-r bg-background pb-4 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-0 overflow-hidden" : "w-64 px-4"
      )}>
        {/* Header with toggle button */}
        <div className="flex h-16 shrink-0 items-center justify-between px-2">
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
            {navigation.map((item) => renderNavItem(item))}
          </ul>
        </nav>
      </div>
    </>
  )
}
