"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Search, 
  Plus,
  ExternalLink,
  Tag,
  TrendingUp,
  Users,
  BookOpen,
  Star
} from "lucide-react"

export default function ToolsDomainsPage() {
  // Mock domains data - industries/niches we research
  const domains = [
    {
      id: 1,
      niche: "Artificial Intelligence & Machine Learning",
      description: "AI/ML technologies, applications, and market trends",
      tags: ["AI", "ML", "automation", "neural networks"],
      canonicalSources: [
        "arxiv.org",
        "towards-data-science.medium.com", 
        "openai.com/research",
        "deepmind.com"
      ],
      projectCount: 24,
      expertiseLevel: "high",
      lastResearched: "2 days ago",
      growthTrend: 15.2
    },
    {
      id: 2,
      niche: "Fintech & Digital Banking",
      description: "Financial technology innovations and digital transformation",
      tags: ["fintech", "banking", "payments", "blockchain"],
      canonicalSources: [
        "techcrunch.com/category/fintech",
        "american-banker.com",
        "paymentsdive.com",
        "coindesk.com"
      ],
      projectCount: 18,
      expertiseLevel: "high",
      lastResearched: "1 week ago",
      growthTrend: 8.7
    },
    {
      id: 3,
      niche: "Sustainable Energy & CleanTech",
      description: "Renewable energy, sustainability, and green technology",
      tags: ["renewable", "solar", "wind", "sustainability"],
      canonicalSources: [
        "greentechmedia.com",
        "renewableenergyworld.com",
        "cleantechnica.com",
        "energy.gov"
      ],
      projectCount: 12,
      expertiseLevel: "medium",
      lastResearched: "3 weeks ago",
      growthTrend: 22.1
    },
    {
      id: 4,
      niche: "Healthcare Technology",
      description: "Digital health, medical devices, and healthcare innovation",
      tags: ["healthtech", "medical", "telemedicine", "digital health"],
      canonicalSources: [
        "healthcaredive.com",
        "mobihealthnews.com",
        "himss.org",
        "nih.gov"
      ],
      projectCount: 16,
      expertiseLevel: "medium",
      lastResearched: "1 month ago",
      growthTrend: 12.5
    },
    {
      id: 5,
      niche: "E-commerce & Retail Tech",
      description: "Online retail, marketplace dynamics, and consumer behavior",
      tags: ["ecommerce", "retail", "marketplace", "consumer"],
      canonicalSources: [
        "retaildive.com",
        "emarketer.com",
        "shopify.com/blog",
        "digitalcommerce360.com"
      ],
      projectCount: 21,
      expertiseLevel: "high",
      lastResearched: "5 days ago",
      growthTrend: 6.3
    }
  ]

  const getExpertiseColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendColor = (trend: number) => {
    if (trend > 15) return 'text-green-600'
    if (trend > 5) return 'text-blue-600'
    return 'text-gray-600'
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Domains
          </h1>
          <p className="text-muted-foreground">Research niches, industries, and expertise areas</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search domains..." className="pl-10" />
        </div>
        <Button variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          Sort by Growth
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{domains.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.reduce((sum, d) => sum + d.projectCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Expertise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {domains.filter(d => d.expertiseLevel === 'high').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(domains.reduce((sum, d) => sum + d.growthTrend, 0) / domains.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{domain.niche}</CardTitle>
                    <Badge className={getExpertiseColor(domain.expertiseLevel)}>
                      {domain.expertiseLevel} expertise
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {domain.description}
                  </CardDescription>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {domain.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className={`font-medium ${getTrendColor(domain.growthTrend)}`}>
                      +{domain.growthTrend}%
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">growth</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {domain.projectCount} projects
                  </span>
                  <span className="text-muted-foreground">
                    Last researched: {domain.lastResearched}
                  </span>
                </div>

                {/* Canonical Sources */}
                <div>
                  <div className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Canonical Sources
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    {domain.canonicalSources.map((source, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        <a 
                          href={`https://${source}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {source}
                        </a>
                        <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm">
                    View Projects
                  </Button>
                  <Button size="sm" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Find Experts
                  </Button>
                  <Button size="sm" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Market Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {domains.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No domains defined yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start by adding your first research domain to organize your expertise areas.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}