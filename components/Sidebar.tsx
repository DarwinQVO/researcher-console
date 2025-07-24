"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Users, 
  FileText,
  BookOpen,
  Settings,
  Edit3
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

  return (
    <div className="flex h-full w-64 flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-semibold">RC</span>
      </div>
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
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
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
