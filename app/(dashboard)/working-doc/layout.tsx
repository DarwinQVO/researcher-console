"use client"

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { ModulesHub } from '@/components/ModulesHub'
import { SourcesHub } from '@/components/SourcesHub'

interface HolyTrinityLayoutProps {
  children: React.ReactNode
  leftPanel?: React.ReactNode
  rightPanel?: React.ReactNode
}

export default function WorkingDocLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Holy Trinity Layout */}
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Modules */}
        <Panel defaultSize={25} minSize={20} maxSize={35}>
          <ModulesHub className="h-full border-r" />
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize" />

        {/* Center Panel - Main Content with Tabs */}
        <Panel defaultSize={50} minSize={40}>
          {children}
        </Panel>

        <PanelResizeHandle className="w-1 bg-border hover:bg-primary/20 transition-colors cursor-col-resize" />

        {/* Right Panel - Sources */}
        <Panel defaultSize={25} minSize={20} maxSize={35}>
          <SourcesHub className="h-full border-l" />
        </Panel>
      </PanelGroup>
    </div>
  )
}