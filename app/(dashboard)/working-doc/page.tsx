"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  PenTool,
  Plus,
  Search,
  Calendar,
  Clock,
  FileText,
  User,
  Filter,
  MoreVertical
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEnterpriseDemoData } from '@/lib/demo/enterpriseDemoAdapter'

export default function WorkingDocListPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const { workingDocs, requests } = useEnterpriseDemoData()

  // Filter working docs based on search
  const filteredDocs = workingDocs.filter(doc => {
    const request = requests.find(r => r.id === doc.requestId)
    return (
      doc.briefMD.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request?.podcast.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleCreateNew = () => {
    // Create new working doc with a generated ID
    const newId = `doc-${Date.now()}`
    router.push(`/working-doc/${newId}/edit`)
  }

  const handleOpenDoc = (docId: string) => {
    router.push(`/working-doc/${docId}/edit`)
  }

  const getRequestInfo = (requestId: string) => {
    return requests.find(r => r.id === requestId)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PenTool className="h-8 w-8" />
            Working Documents
          </h1>
          <p className="text-muted-foreground">Create or continue working on research documents</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Document
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workingDocs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {workingDocs.filter(d => {
                const req = getRequestInfo(d.requestId)
                return req?.status === 'in_progress'
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {workingDocs.filter(d => {
                const req = getRequestInfo(d.requestId)
                return req?.status === 'delivered'
              }).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {workingDocs.filter(d => {
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return new Date(d.updatedAt) > weekAgo
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocs.map((doc) => {
          const request = getRequestInfo(doc.requestId)
          const moduleCount = doc.modules?.length || 0
          const sourceCount = doc.sources?.length || 0
          
          return (
            <Card 
              key={doc.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleOpenDoc(doc.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {request?.guest || 'Untitled Document'}
                    </CardTitle>
                    <CardDescription>
                      {request?.podcast || 'No podcast assigned'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        handleOpenDoc(doc.id)
                      }}>
                        <PenTool className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <FileText className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Brief Preview */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {doc.briefMD || 'No content yet...'}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {moduleCount} modules
                    </div>
                    <div className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      {sourceCount} sources
                    </div>
                  </div>

                  {/* Status and Date */}
                  <div className="flex items-center justify-between">
                    <Badge variant={
                      request?.status === 'delivered' ? 'default' :
                      request?.status === 'in_progress' ? 'secondary' :
                      'outline'
                    }>
                      {request?.status || 'draft'}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredDocs.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No working documents yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Create your first working document to start organizing your research
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}