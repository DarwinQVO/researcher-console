"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Users, 
  Search, 
  Plus,
  ExternalLink,
  Building,
  Mail,
  Phone,
  Calendar,
  FileText
} from "lucide-react"

export default function VaultClientsPage() {
  // Mock clients data
  const clients = [
    {
      id: 1,
      name: "TechCorp Industries",
      contact: "Sarah Johnson",
      email: "sarah@techcorp.com",
      phone: "+1 (555) 123-4567",
      industry: "Technology",
      status: "active",
      projectsCount: 8,
      lastActivity: "2 days ago",
      tier: "premium"
    },
    {
      id: 2,
      name: "Global Analytics",
      contact: "Mike Chen",
      email: "mike@globalanalytics.com",
      phone: "+1 (555) 987-6543",
      industry: "Finance",
      status: "active",
      projectsCount: 12,
      lastActivity: "1 week ago",
      tier: "standard"
    },
    {
      id: 3,
      name: "StartupX",
      contact: "Emma Davis",
      email: "emma@startupx.io",
      phone: "+1 (555) 456-7890",
      industry: "SaaS",
      status: "inactive",
      projectsCount: 3,
      lastActivity: "1 month ago", 
      tier: "basic"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      default: return 'outline'
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'standard': return 'bg-blue-100 text-blue-800'
      case 'basic': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Clients
          </h1>
          <p className="text-muted-foreground">Manage your client relationships and projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search clients..." className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Card className="px-4 py-2">
            <div className="text-2xl font-bold text-green-600">
              {clients.filter(c => c.status === 'active').length}
            </div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
          <Card className="px-4 py-2">
            <div className="text-2xl font-bold text-blue-600">
              {clients.reduce((sum, c) => sum + c.projectsCount, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Projects</div>
          </Card>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {client.name}
                  </CardTitle>
                  <CardDescription>{client.contact}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Badge variant={getStatusColor(client.status)}>
                    {client.status}
                  </Badge>
                  <Badge className={getTierColor(client.tier)}>
                    {client.tier}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {client.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {client.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3" />
                    {client.industry}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {client.projectsCount} projects
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {client.lastActivity}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Projects
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {clients.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start by adding your first client to track projects and relationships.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}