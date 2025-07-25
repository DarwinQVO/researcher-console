"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Terminal, 
  Search, 
  Plus,
  Copy,
  Heart,
  Eye,
  Tag,
  Clock,
  User,
  Star
} from "lucide-react"

export default function ToolsPromptsPage() {
  // Mock prompts data
  const prompts = [
    {
      id: 1,
      title: "Research Question Generator",
      description: "Generate comprehensive research questions based on topic and industry",
      category: "Research",
      prompt: "Generate 10 comprehensive research questions about [TOPIC] in the [INDUSTRY] industry, focusing on current trends, challenges, and opportunities.",
      author: "Research Team",
      usage: 247,
      likes: 89,
      tags: ["research", "questions", "analysis"],
      lastUpdated: "1 week ago",
      featured: true
    },
    {
      id: 2,
      title: "Interview Summary",
      description: "Summarize interview transcripts with key insights and quotes",
      category: "Interviews",
      prompt: "Analyze this interview transcript and provide: 1) Key insights summary, 2) Most important quotes, 3) Action items, 4) Follow-up questions to ask",
      author: "Interview Team",
      usage: 156,
      likes: 45,
      tags: ["interview", "summary", "insights"],
      lastUpdated: "3 days ago",
      featured: false
    },
    {
      id: 3,
      title: "Competitive Analysis Framework",
      description: "Structure competitive analysis research with consistent methodology",
      category: "Analysis",
      prompt: "Create a competitive analysis for [COMPANY] comparing them to [COMPETITORS]. Include: strengths, weaknesses, market position, pricing, and strategic recommendations.",
      author: "Strategy Team",
      usage: 89,
      likes: 34,
      tags: ["competitive", "analysis", "strategy"],
      lastUpdated: "5 days ago",
      featured: false
    },
    {
      id: 4,
      title: "Source Credibility Check",
      description: "Evaluate the credibility and reliability of information sources",
      category: "Verification",
      prompt: "Evaluate the credibility of this source: [SOURCE]. Consider: author expertise, publication date, citations, potential bias, and overall reliability. Provide a credibility score and reasoning.",
      author: "Quality Team",
      usage: 178,
      likes: 67,
      tags: ["verification", "credibility", "quality"],
      lastUpdated: "2 weeks ago",
      featured: true
    }
  ]

  const categories = ["All", "Research", "Interviews", "Analysis", "Verification", "Writing"]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="h-8 w-8" />
            Prompts Library
          </h1>
          <p className="text-muted-foreground">Search, capture, and summary recipes for AI workflows</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Prompt
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search prompts..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prompts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {prompts.filter(p => p.featured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {prompts.reduce((sum, p) => sum + p.usage, 0)}
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

      {/* Prompts List */}
      <div className="space-y-4">
        {prompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="flex items-center gap-2">
                      {prompt.title}
                      {prompt.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </CardTitle>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                  <CardDescription>{prompt.description}</CardDescription>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-2 w-2 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Prompt Preview */}
                <div className="bg-muted p-3 rounded-lg">
                  <div className="text-sm font-mono text-muted-foreground">
                    {prompt.prompt.length > 150 
                      ? `${prompt.prompt.substring(0, 150)}...` 
                      : prompt.prompt
                    }
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {prompt.usage} uses
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {prompt.likes} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {prompt.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {prompt.lastUpdated}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm">
                    Use Prompt
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4 mr-2" />
                    Like
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {prompts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No prompts yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Start building your AI prompt library to streamline your research workflows.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Prompt
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}