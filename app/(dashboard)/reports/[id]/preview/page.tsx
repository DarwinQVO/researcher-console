"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Lazy load the heavy editor component
const RichTextEditor = dynamic(
  () => import("@/components/RichTextEditor").then(mod => ({ default: mod.RichTextEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-2xl bg-background">
        <div className="border-b p-3">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading editor...</span>
          </div>
        </div>
      </div>
    ),
  }
)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Settings,
  Split,
  Maximize,
  Eye
} from "lucide-react"
import { subjectMeta, quotes, timelineEvents, qaData, representations } from "@/lib/mock/steveJobs"

// Generar contenido del reporte basado en los datos
const generateReportContent = () => {
  return `
    <h1>Interview Prep Report: ${subjectMeta.name}</h1>
    
    <h2>Overview</h2>
    <p><strong>Subject:</strong> ${subjectMeta.name}</p>
    <p><strong>Bio:</strong> ${subjectMeta.bio}</p>
    <p><strong>Niches:</strong> ${subjectMeta.stamped_niches.join(', ')}</p>
    
    <h2>Timeline Highlights</h2>
    <ul>
      ${timelineEvents.slice(0, 5).map(event => 
        `<li><strong>${event.date}:</strong> ${event.title} - ${event.description}</li>`
      ).join('')}
    </ul>
    
    <h2>Key Quotes</h2>
    ${quotes.slice(0, 3).map(quote => 
      `<blockquote>
        <p>"${quote.text}"</p>
        <cite>- ${quote.source} (${quote.date})</cite>
      </blockquote>`
    ).join('')}
    
    <h2>Essential Questions & Answers</h2>
    ${qaData.map(qa => 
      `<h3>${qa.question}</h3>
       <p>${qa.answer}</p>`
    ).join('')}
    
    <h2>Core Representations</h2>
    ${representations.map(rep => 
      `<h3>${rep.title}</h3>
       <p>${rep.description}</p>
       <ul>
         ${rep.key_points.map(point => `<li>${point}</li>`).join('')}
       </ul>`
    ).join('')}
    
    <h2>Interview Recommendations</h2>
    <p>Based on the research, here are key areas to focus on during the interview:</p>
    <ul>
      <li>Early career decisions and entrepreneurial journey</li>
      <li>Design philosophy and user experience focus</li>
      <li>Leadership style and team management</li>
      <li>Innovation approach and product development</li>
      <li>Legacy and impact on the tech industry</li>
    </ul>
    
    <h2>Potential Follow-up Questions</h2>
    <ol>
      <li>How did your early experiences shape your approach to product design?</li>
      <li>What role did failure play in your innovation process?</li>
      <li>How did you balance perfectionism with practical business needs?</li>
      <li>What advice would you give to aspiring entrepreneurs today?</li>
    </ol>
  `
}

export default function ReportPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState("")
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setContent(generateReportContent())
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading report...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen flex flex-col"
    >
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <div>
                <h1 className="font-semibold">Steve Jobs - Interview Prep</h1>
                <p className="text-sm text-muted-foreground">Report Preview & Editor</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              2024-01-22
            </Badge>
            <Badge variant="outline">
              <User className="h-3 w-3 mr-1" />
              Research Team
            </Badge>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="px-4 pb-4">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
            <TabsList>
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Mode
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="split" className="flex items-center gap-2">
                <Split className="h-4 w-4" />
                Split View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-hidden">
        {viewMode === "edit" && (
          <RichTextEditor
            content={content}
            onChange={setContent}
          />
        )}

        {viewMode === "preview" && (
          <Card className="h-full">
            <CardContent className="p-8 overflow-y-auto h-full">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-2 gap-6 h-full">
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-4">Editor</h3>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>
            <div className="h-full">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <Card className="h-full">
                <CardContent className="p-6 overflow-y-auto h-full">
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}