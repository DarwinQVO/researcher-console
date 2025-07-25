"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Search, 
  Plus,
  Settings,
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  Key
} from "lucide-react"

export default function ToolsChannelsPage() {
  // Mock channels data - meta information about external source platforms
  const channels = [
    {
      id: 1,
      name: "Twitter/X API",
      platform: "twitter.com",
      description: "Social media posts, trends, and user interactions",
      status: "connected",
      authType: "OAuth 2.0",
      rateLimit: "300 requests/15min",
      lastSync: "5 minutes ago",
      dataTypes: ["tweets", "profiles", "engagement"],
      cost: "Free tier",
      reliability: 98.5
    },
    {
      id: 2,
      name: "LinkedIn API",
      platform: "linkedin.com", 
      description: "Professional network data and company information",
      status: "connected",
      authType: "OAuth 2.0",
      rateLimit: "100 requests/day",
      lastSync: "2 hours ago",
      dataTypes: ["profiles", "companies", "posts"],
      cost: "$299/month",
      reliability: 99.2
    },
    {
      id: 3,
      name: "News API",
      platform: "newsapi.org",
      description: "Global news articles and headlines",
      status: "error",
      authType: "API Key",
      rateLimit: "1000 requests/day",
      lastSync: "Failed",
      dataTypes: ["articles", "headlines", "sources"],
      cost: "$49/month",
      reliability: 95.8
    },
    {
      id: 4,
      name: "YouTube Data API",
      platform: "youtube.com",
      description: "Video metadata, comments, and channel information",
      status: "disconnected",
      authType: "API Key",
      rateLimit: "10,000 units/day",
      lastSync: "Never",
      dataTypes: ["videos", "comments", "channels"],
      cost: "Free tier",
      reliability: 99.9
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default'
      case 'error': return 'destructive'
      case 'disconnected': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle2
      case 'error': return AlertCircle
      case 'disconnected': return Clock
      default: return Activity
    }
  }

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 99) return 'text-green-600'
    if (reliability >= 95) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Channels
          </h1>
          <p className="text-muted-foreground">Manage external data source platforms and APIs</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search channels..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Check All Status
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {channels.filter(c => c.status === 'connected').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {channels.filter(c => c.status === 'error').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Reliability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(channels.reduce((sum, c) => sum + c.reliability, 0) / channels.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channels List */}
      <div className="space-y-4">
        {channels.map((channel) => {
          const StatusIcon = getStatusIcon(channel.status)
          return (
            <Card key={channel.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      {channel.name}
                    </CardTitle>
                    <CardDescription>{channel.description}</CardDescription>
                    <div className="text-xs text-muted-foreground">
                      Platform: {channel.platform}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(channel.status)} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {channel.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Authentication</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Key className="h-3 w-3" />
                      {channel.authType}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Rate Limit</div>
                    <div className="text-sm text-muted-foreground">{channel.rateLimit}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Last Sync</div>
                    <div className="text-sm text-muted-foreground">{channel.lastSync}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Reliability</div>
                    <div className={`text-sm font-medium ${getReliabilityColor(channel.reliability)}`}>
                      {channel.reliability}%
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium mb-2">Data Types</div>
                  <div className="flex flex-wrap gap-1">
                    {channel.dataTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Cost: </span>
                    <span className="font-medium">{channel.cost}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    {channel.status === 'connected' ? (
                      <Button size="sm" variant="outline">
                        Test Connection
                      </Button>
                    ) : (
                      <Button size="sm">
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}