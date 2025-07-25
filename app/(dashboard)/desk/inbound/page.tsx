"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Inbox, 
  Search, 
  Filter, 
  Plus,
  ExternalLink,
  Clock,
  User,
  Tag
} from "lucide-react"

export default function InboundPage() {
  // Mock inbound items
  const inboundItems = [
    {
      id: 1,
      title: "New research request: Tech industry analysis",
      description: "Client needs comprehensive analysis of emerging tech trends",
      type: "request",
      priority: "high",
      source: "Email",
      assignee: "Unassigned",
      createdAt: "2 hours ago",
      tags: ["research", "tech", "urgent"]
    },
    {
      id: 2,
      title: "Interview scheduling: CEO of StartupX",
      description: "Need to coordinate interview for upcoming report",
      type: "task",
      priority: "medium",
      source: "Calendar",
      assignee: "Sarah Chen",
      createdAt: "4 hours ago",
      tags: ["interview", "scheduling"]
    },
    {
      id: 3,
      title: "Source verification needed",
      description: "Verify authenticity of documents from recent client submission",
      type: "verification",
      priority: "low",
      source: "Upload",
      assignee: "Mike Johnson",
      createdAt: "1 day ago",
      tags: ["verification", "documents"]
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Inbox className="h-8 w-8" />
            Inbound
          </h1>
          <p className="text-muted-foreground">Process and organize incoming requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inbound items..." className="pl-10" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inboundItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inboundItems.filter(item => item.priority === 'high').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {inboundItems.filter(item => item.assignee === 'Unassigned').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inboundItems.filter(item => item.createdAt.includes('hours')).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inbound Items List */}
      <div className="space-y-4">
        {inboundItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {item.title}
                    <Badge variant={getPriorityColor(item.priority)}>
                      {item.priority}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {item.assignee}
                  </span>
                  <span>from {item.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="h-2 w-2 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm">Process</Button>
                <Button size="sm" variant="outline">Assign</Button>
                <Button size="sm" variant="outline">Archive</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}