import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, BarChart3 } from "lucide-react"

const mockSubjectMeta = {
  name: "Steve Jobs",
  bio: "Co-founder of Apple Inc., visionary entrepreneur who revolutionized personal computing, music distribution, mobile phones, and tablet computing. Known for his perfectionism and innovative design philosophy.",
  stamped_niches: ["Tech", "Creator", "Public Company"],
  stats: {
    quotes: 142,
    timeline_events: 87,
    qa_pairs: 34,
    representations: 12
  },
  status: "in_progress"
}

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Overview</h1>
          <p className="text-muted-foreground mt-2">
            Quick summary and key information about {mockSubjectMeta.name}
          </p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Details
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
            <CardDescription>Key life events and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed mb-4">{mockSubjectMeta.bio}</p>
            <div className="flex gap-1 flex-wrap">
              {mockSubjectMeta.stamped_niches.map((niche) => (
                <Badge key={niche} variant="secondary">
                  {niche}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Research Progress
            </CardTitle>
            <CardDescription>Current status of interview prep</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Data Collection</span>
                <span className="text-sm text-muted-foreground">85%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Content Curation</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }} />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quality Review</span>
                <span className="text-sm text-muted-foreground">40%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
            <CardDescription>Research materials collected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{mockSubjectMeta.stats.quotes}</div>
                <div className="text-sm text-muted-foreground">Quotes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockSubjectMeta.stats.timeline_events}</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockSubjectMeta.stats.qa_pairs}</div>
                <div className="text-sm text-muted-foreground">Q&As</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{mockSubjectMeta.stats.representations}</div>
                <div className="text-sm text-muted-foreground">Media</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Timeline updated</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span>New quotes added</span>
                <span className="text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex justify-between">
                <span>Q&A section reviewed</span>
                <span className="text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}