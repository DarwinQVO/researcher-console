"use client"

import { Module } from '@/models/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight
} from 'lucide-react'

interface ModulesGalleryProps {
  modules: Module[]
  onModuleClick: (module: Module) => void
  onModuleToggle: (moduleId: string) => void
}

export function ModulesGallery({ modules, onModuleClick, onModuleToggle }: ModulesGalleryProps) {
  const getStatusIcon = (status: Module['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getVariantColor = (variant: string) => {
    const colors = {
      biographical: 'bg-blue-500/10 text-blue-700',
      achievements: 'bg-green-500/10 text-green-700',
      philosophy: 'bg-purple-500/10 text-purple-700',
      standard: 'bg-gray-500/10 text-gray-700',
      expanded: 'bg-orange-500/10 text-orange-700',
      minimal: 'bg-cyan-500/10 text-cyan-700'
    }
    return colors[variant as keyof typeof colors] || colors.standard
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Document Modules</h2>
        <p className="text-muted-foreground">
          Manage and organize your research modules. Click to view details or edit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card 
            key={module.id}
            className="hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onModuleClick(module)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(module.status)}
                  <CardTitle className="text-lg">{module.name}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onModuleToggle(module.id)
                  }}
                >
                  {module.isEnabled ? 
                    <ToggleRight className="h-4 w-4 text-primary" /> : 
                    <ToggleLeft className="h-4 w-4" />
                  }
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className={cn("text-xs", getVariantColor(module.variant))}>
                  {module.variant}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Order: {module.order}
                </Badge>
              </div>
              
              {module.content && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {module.content}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    onModuleClick(module)
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {modules.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No modules yet</h3>
            <p className="text-muted-foreground">
              Create your first module to start organizing your research.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ')
}