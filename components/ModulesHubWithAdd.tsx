"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Search, 
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
  Grid,
  Sparkles
} from 'lucide-react'
import { Module } from '@/models/types'
import { cn } from '@/lib/utils'

interface ModulesHubWithAddProps {
  className?: string
  modules?: Module[]
  onModuleClick?: (module: Module) => void
  onModuleToggle?: (moduleId: string) => void
  onOpenGallery?: () => void
  onAddModule?: (moduleData: any) => void
}

// Available module templates
const moduleTemplates = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    description: 'Comprehensive overview with key insights and recommendations',
    category: 'Templates',
    variant: 'standard'
  },
  {
    id: 'interview-prep',
    name: 'Interview Preparation',
    description: 'Research questions and background information',
    category: 'Templates', 
    variant: 'expanded'
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Market research and competitive landscape',
    category: 'Analysis',
    variant: 'standard'
  },
  {
    id: 'timeline',
    name: 'Timeline & Milestones',
    description: 'Chronological overview of key events',
    category: 'Structure',
    variant: 'minimal'
  },
  {
    id: 'key-quotes',
    name: 'Key Quotes Collection',
    description: 'Important statements and insights',
    category: 'Content',
    variant: 'standard'
  },
  {
    id: 'fact-check',
    name: 'Fact Verification',
    description: 'Claims verification and source validation',
    category: 'Quality',
    variant: 'expanded'
  }
]

export function ModulesHubWithAdd({ 
  className,
  modules = [],
  onModuleClick,
  onModuleToggle,
  onOpenGallery,
  onAddModule
}: ModulesHubWithAddProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customName, setCustomName] = useState('')

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTemplates = moduleTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleAddModule = () => {
    if (!selectedTemplate) return

    const template = moduleTemplates.find(t => t.id === selectedTemplate)
    if (!template) return

    const moduleData = {
      name: customName || template.name,
      variant: template.variant,
      category: template.category,
      description: template.description
    }

    onAddModule?.(moduleData)
    
    // Reset form
    setSelectedTemplate('')
    setCustomName('')
    setIsAddDialogOpen(false)
  }

  return (
    <div className={cn("flex flex-col bg-muted/30", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Package className="h-5 w-5" />
            Modules ({modules.length})
          </h2>
          <div className="flex gap-1">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Module</DialogTitle>
                  <DialogDescription>
                    Choose a module template to add to your working document
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search module templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Custom Name */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Custom Name (optional)
                    </label>
                    <Input
                      placeholder="Override template name..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                  </div>

                  {/* Template Selection */}
                  <div className="grid gap-3 max-h-96 overflow-y-auto">
                    {filteredTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/50",
                          selectedTemplate === template.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {template.description}
                              </CardDescription>
                            </div>
                            <div className="flex gap-1">
                              <Badge variant="outline" className="text-xs">
                                {template.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {template.variant}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddModule}
                      disabled={!selectedTemplate}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenGallery}
              className="text-xs"
            >
              <Grid className="h-3 w-3" />
            </Button>
          </div>
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
              
              <Badge variant="outline" className="text-xs">
                {module.variant}
              </Badge>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No modules yet</p>
            <Button 
              size="sm" 
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Module
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}