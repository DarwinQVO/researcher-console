"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Puzzle, 
  Search, 
  Plus,
  ExternalLink,
  Download,
  Settings,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  Users
} from "lucide-react"

export default function ToolsExtensionsPage() {
  // Mock extensions data - plugins and integrations
  const extensions = [
    {
      id: 1,
      name: "Quotify",
      description: "Extract and organize quotes from web pages, YouTube videos, and documents",
      status: "active",
      version: "2.1.4",
      author: "Research Team",
      category: "Content Extraction",
      downloads: 1542,
      rating: 4.8,
      lastUpdated: "1 week ago",
      link: "https://github.com/research/quotify",
      tutorial: "/tutorials/quotify-setup",
      features: ["Web scraping", "YouTube transcripts", "PDF extraction", "Auto-tagging"],
      permissions: ["Browse history", "Active tab", "Storage"]
    },
    {
      id: 2,
      name: "Source Tracker",
      description: "Automatically track and categorize research sources across multiple platforms",
      status: "active",
      version: "1.3.2",
      author: "Data Team",
      category: "Source Management",
      downloads: 892,
      rating: 4.6,
      lastUpdated: "3 days ago",
      link: "https://github.com/research/source-tracker",
      tutorial: "/tutorials/source-tracker",
      features: ["Auto-categorization", "Duplicate detection", "Batch import", "API sync"],
      permissions: ["All URLs", "Storage", "Background"]
    },
    {
      id: 3,
      name: "Interview Assistant",
      description: "AI-powered interview preparation and real-time question suggestions",
      status: "beta",
      version: "0.9.1",
      author: "AI Team",
      category: "Interview Tools",
      downloads: 234,
      rating: 4.2,
      lastUpdated: "2 days ago",
      link: "https://github.com/research/interview-ai",
      tutorial: "/tutorials/interview-assistant",
      features: ["Question generation", "Real-time notes", "Topic tracking", "Follow-up suggestions"],
      permissions: ["Microphone", "Storage", "AI services"]
    },
    {
      id: 4,
      name: "Citation Generator",
      description: "Generate properly formatted citations in multiple academic styles",
      status: "inactive",
      version: "1.5.0",
      author: "Academic Team",
      category: "Citation Tools",
      downloads: 1156,
      rating: 4.4,
      lastUpdated: "2 months ago",
      link: "https://github.com/research/citations",
      tutorial: "/tutorials/citations",
      features: ["APA format", "MLA format", "Chicago style", "Custom formats"],
      permissions: ["Active tab", "Storage"]
    },
    {
      id: 5,
      name: "Data Visualizer",
      description: "Transform research data into interactive charts and visualizations",
      status: "development",
      version: "0.5.0",
      author: "Viz Team",
      category: "Visualization",
      downloads: 0,
      rating: 0,
      lastUpdated: "1 day ago",
      link: "https://github.com/research/data-viz",
      tutorial: "/tutorials/data-viz",
      features: ["Interactive charts", "Export options", "Custom themes", "Real-time updates"],
      permissions: ["Storage", "File system", "Data access"]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'beta': return 'secondary' 
      case 'development': return 'outline'
      case 'inactive': return 'destructive'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle2
      case 'beta': return AlertCircle
      case 'development': return Clock
      case 'inactive': return Pause
      default: return Clock
    }
  }

  const categories = ["All", "Content Extraction", "Source Management", "Interview Tools", "Citation Tools", "Visualization"]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Puzzle className="h-8 w-8" />
            Extensions
          </h1>
          <p className="text-muted-foreground">Plugins and integrations to enhance your research workflow</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Install Extension
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search extensions..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Extensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{extensions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {extensions.filter(e => e.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {extensions.reduce((sum, e) => sum + e.downloads, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {extensions.filter(e => e.rating > 0).length > 0 
                ? (extensions.filter(e => e.rating > 0).reduce((sum, e) => sum + e.rating, 0) / extensions.filter(e => e.rating > 0).length).toFixed(1)
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Extensions Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {extensions.map((extension) => {
          const StatusIcon = getStatusIcon(extension.status)
          return (
            <Card key={extension.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Puzzle className="h-5 w-5" />
                      {extension.name}
                    </CardTitle>
                    <CardDescription>{extension.description}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(extension.status)} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {extension.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Extension Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Version</span>
                    <span className="font-mono">{extension.version}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{extension.category}</Badge>
                  </div>

                  {extension.rating > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {extension.downloads.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {extension.rating}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {extension.author}
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    {extension.lastUpdated}
                  </div>

                  {/* Features */}
                  <div>
                    <div className="text-sm font-medium mb-2">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {extension.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {extension.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{extension.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <div className="text-sm font-medium mb-2">Permissions</div>
                    <div className="text-xs text-muted-foreground">
                      {extension.permissions.join(", ")}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    {extension.status === 'active' ? (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    ) : extension.status === 'development' ? (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        <Clock className="h-4 w-4 mr-2" />
                        In Development
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Install
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {extensions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Puzzle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No extensions installed</h3>
            <p className="text-muted-foreground text-center mb-6">
              Browse and install extensions to enhance your research capabilities.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Browse Extension Store
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}