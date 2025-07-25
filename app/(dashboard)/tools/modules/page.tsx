"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Package, 
  Search, 
  Plus,
  Download,
  Settings,
  Star,
  Clock,
  Users
} from "lucide-react"

export default function ToolsModulesPage() {
  // Mock modules data
  const modules = [
    {
      id: 1,
      name: "Executive Summary",
      description: "Comprehensive executive summary template with key insights and recommendations",
      category: "Templates",
      version: "2.1.0",
      downloads: 1247,
      rating: 4.8,
      author: "Research Team",
      lastUpdated: "2 weeks ago",
      status: "active",
      tags: ["summary", "executive", "template"]
    },
    {
      id: 2,
      name: "Market Analysis Framework",
      description: "Structured approach to market research and competitive analysis",
      category: "Frameworks",
      version: "1.5.2",
      downloads: 892,
      rating: 4.6,
      author: "Strategy Team",
      lastUpdated: "1 month ago",
      status: "active",
      tags: ["market", "analysis", "framework"]
    },
    {
      id: 3,
      name: "Interview Guide Generator",
      description: "AI-powered tool to generate structured interview guides based on research objectives",
      category: "Generators",
      version: "3.0.1",
      downloads: 2156,
      rating: 4.9,
      author: "AI Team",
      lastUpdated: "3 days ago",
      status: "featured",
      tags: ["interview", "ai", "generator"]
    },
    {
      id: 4,
      name: "Data Visualization Toolkit",
      description: "Collection of chart templates and visualization components for reports",
      category: "Tools",
      version: "1.8.5",
      downloads: 734,
      rating: 4.4,
      author: "Design Team",
      lastUpdated: "1 week ago",
      status: "active",
      tags: ["visualization", "charts", "toolkit"]
    }
  ]

  const categories = ["All", "Templates", "Frameworks", "Generators", "Tools"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'featured': return 'default'
      case 'active': return 'secondary'
      case 'deprecated': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Modules
          </h1>
          <p className="text-muted-foreground">Templates, frameworks, and tools for research projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Module
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search modules..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {modules.reduce((sum, m) => sum + m.downloads, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(modules.reduce((sum, m) => sum + m.rating, 0) / modules.length).toFixed(1)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {module.name}
                    {module.status === 'featured' && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </div>
                <Badge variant={getStatusColor(module.status)}>
                  {module.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="outline">{module.category}</Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Version</span>
                  <span className="font-mono">{module.version}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {module.downloads.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {module.rating}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {module.author}
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  {module.lastUpdated}
                </div>

                <div className="flex flex-wrap gap-1">
                  {module.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Use Module
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}