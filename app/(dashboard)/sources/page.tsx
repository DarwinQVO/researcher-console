"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEnterpriseDemoData } from "@/lib/demo/enterpriseDemoAdapter"
import { Search, Plus, ExternalLink, Book, Video, Globe, FileText } from "lucide-react"
import Link from "next/link"
import { memo, useState, useMemo } from "react"
import { DemoInvitation } from "@/components/EnterpriseDemo"

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'book':
      return <Book className="h-4 w-4" />
    case 'video':
      return <Video className="h-4 w-4" />
    case 'documentary':
      return <Video className="h-4 w-4" />
    case 'website':
      return <Globe className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

const SourceCardComponent = ({ source }: { source: any }) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          <CardTitle className="text-base line-clamp-2">{source.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            {getSourceIcon(source.type)}
            <span>{source.domain}</span>
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="capitalize">
          {source.type}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {source.capturedBy}
        </Badge>
      </div>
      
      {source.notes && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {source.notes}
        </p>
      )}
      
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-muted-foreground">
          {source.createdAt.toLocaleDateString()}
        </span>
        <Link href={source.url} target="_blank">
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
)

const SourceCard = memo(SourceCardComponent)

export default function SourcesPage() {
  const { sources, isDemoMode } = useEnterpriseDemoData()
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredSources = useMemo(() => {
    return sources.filter(source => {
      const matchesSearch = source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           source.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (source.notes && source.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesType = typeFilter === "all" || source.type === typeFilter
      
      return matchesSearch && matchesType
    })
  }, [searchQuery, typeFilter])

  const stats = useMemo(() => {
    const total = sources.length
    const types = Array.from(new Set(sources.map(s => s.type))).length
    
    return { total, types }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sources</h1>
          <p className="text-muted-foreground">
            Manage and track your research sources
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.types}</div>
            <p className="text-xs text-muted-foreground">Source Types</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredSources.length}</div>
            <p className="text-xs text-muted-foreground">Filtered Results</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="search"
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="book">Books</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="website">Websites</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSources.map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
      </div>

      {filteredSources.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {sources.length === 0 ? 'No hay fuentes' : 'No se encontraron fuentes'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {sources.length === 0 
                  ? (isDemoMode 
                      ? "Las fuentes aparecerán automáticamente durante el demo."
                      : "Comienza agregando tu primera fuente de investigación."
                    )
                  : "Intenta ajustar los términos de búsqueda o filtros."
                }
              </p>
              {sources.length === 0 && !isDemoMode && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera fuente
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!isDemoMode && sources.length === 0 && <DemoInvitation />}
    </div>
  )
}