"use client"

import { useState } from 'react'
import { X, FileText, Grid, Code, Eye, Image, Book } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type TabType = 'editor' | 'module' | 'source' | 'modules-gallery' | 'sources-gallery'

export interface WorkingTab {
  id: string
  title: string
  type: TabType
  icon: React.ReactNode
  data?: any
  isClosable: boolean
}

interface WorkingStudioTabsProps {
  tabs: WorkingTab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onTabClose: (tabId: string) => void
  onTabAdd?: (tab: WorkingTab) => void
  children: (activeTab: WorkingTab) => React.ReactNode
}

export function WorkingStudioTabs({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onTabAdd,
  children
}: WorkingStudioTabsProps) {
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0]

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      <div className="border-b bg-muted/30 overflow-x-auto">
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "group flex items-center gap-2 px-3 py-2 border-r cursor-pointer transition-colors relative",
                activeTabId === tab.id 
                  ? "bg-background border-b-2 border-b-primary" 
                  : "hover:bg-muted/50"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="text-muted-foreground">{tab.icon}</span>
              <span className="text-sm font-medium">{tab.title}</span>
              
              {tab.isClosable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose(tab.id)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab && children(activeTab)}
      </div>
    </div>
  )
}

// Helper to create tab objects
export function createTab(
  type: TabType,
  title: string,
  data?: any,
  isClosable = true
): WorkingTab {
  const icons = {
    editor: <FileText className="h-4 w-4" />,
    module: <Code className="h-4 w-4" />,
    source: <Book className="h-4 w-4" />,
    'modules-gallery': <Grid className="h-4 w-4" />,
    'sources-gallery': <Image className="h-4 w-4" />
  }

  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    type,
    icon: icons[type],
    data,
    isClosable
  }
}