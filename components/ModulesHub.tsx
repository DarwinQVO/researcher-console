"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Package, 
  Search, 
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  Grid
} from 'lucide-react'
import { Module } from '@/models/types'
import { cn } from '@/lib/utils'

interface ModulesHubProps {
  className?: string
  modules?: Module[]
  onModuleClick?: (module: Module) => void
  onModuleToggle?: (moduleId: string) => void
  onOpenGallery?: () => void
}

export function ModulesHub({ 
  className,
  modules = [],
  onModuleClick,
  onModuleToggle,
  onOpenGallery
}: ModulesHubProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeModule, setActiveModule] = useState<Module | null>(null)

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleModuleClick = (module: Module) => {
    setActiveModule(module)
    onModuleClick?.(module)
  }

  return (
    <div className={cn("flex flex-col bg-muted/30", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Modules
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenGallery}
            className="text-xs"
          >
            <Grid className="h-3 w-3 mr-1" />
            Gallery
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-colors",
                activeModule?.id === module.id 
                  ? "bg-background border-primary" 
                  : "hover:bg-background/50"
              )}
              onClick={() => handleModuleClick(module)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status)}
                  <span className="font-medium text-sm">{module.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    onModuleToggle?.(module.id)
                  }}
                >
                  {module.isEnabled ? 
                    <ToggleRight className="h-4 w-4 text-primary" /> : 
                    <ToggleLeft className="h-4 w-4" />
                  }
                </Button>
              </div>
              
              {module.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {module.description.slice(0, 80)}...
                </p>
              )}
              
              <Badge variant="outline" className="text-xs">
                {module.variant || module.category}
              </Badge>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No modules found</p>
            <Button size="sm" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}