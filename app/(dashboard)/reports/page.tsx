"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { FileText, Download, Eye, Calendar, User } from "lucide-react"

const mockReports = [
  {
    id: "report-1",
    title: "Steve Jobs - Interview Prep Complete",
    subject: "Steve Jobs",
    status: "completed",
    createdAt: "2024-01-20",
    lastModified: "2024-01-22",
    sections: ["Timeline", "Quotes", "Q&A", "Representations"],
    progress: 100
  },
  {
    id: "report-2", 
    title: "Elon Musk - Research in Progress",
    subject: "Elon Musk",
    status: "in_progress",
    createdAt: "2024-01-19",
    lastModified: "2024-01-23",
    sections: ["Timeline", "Quotes"],
    progress: 45
  },
  {
    id: "report-3",
    title: "Oprah Winfrey - Under Review",
    subject: "Oprah Winfrey", 
    status: "review",
    createdAt: "2024-01-18",
    lastModified: "2024-01-21",
    sections: ["Timeline", "Quotes", "Q&A"],
    progress: 75
  }
]

export default function ReportsPage() {
  const router = useRouter()
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'default'
      case 'in_progress': return 'secondary'
      case 'review': return 'outline'
      default: return 'outline'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Generated interview prep documents and deliverables
        </p>
      </div>

      <div className="grid gap-6">
        {mockReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      {report.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Subject: {report.subject}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusColor(report.status)}>
                    {report.status.replace('_', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{report.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${report.progress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Sections */}
                  <div>
                    <p className="text-sm font-medium mb-2">Sections Included:</p>
                    <div className="flex flex-wrap gap-1">
                      {report.sections.map((section) => (
                        <Badge key={section} variant="outline" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Created: {report.createdAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Modified: {report.lastModified}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => router.push(`/reports/${report.id}/preview`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    {report.status === 'completed' && (
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Doc
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State for New Users */}
      {mockReports.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete research on subjects to generate interview prep reports
            </p>
            <Button>Create First Report</Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  )
}