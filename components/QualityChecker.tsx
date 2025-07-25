"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
  RefreshCw,
  Target,
  FileText,
  Clock,
  TrendingUp,
  Eye,
  Brain
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface QualityIssue {
  id: string
  type: 'error' | 'warning' | 'info' | 'suggestion'
  title: string
  description: string
  location?: string
  severity: 'high' | 'medium' | 'low'
  resolved: boolean
  suggestions?: string[]
}

interface QualityCheckerProps {
  workingDocId?: string
  content?: string
  onResolveFlag?: (flagId: string) => void
  className?: string
}

export function QualityChecker({ 
  workingDocId, 
  content = '', 
  onResolveFlag,
  className 
}: QualityCheckerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [issues, setIssues] = useState<QualityIssue[]>([])
  const [overallScore, setOverallScore] = useState(85)
  const [lastCheck, setLastCheck] = useState<Date>(new Date())

  // Mock quality issues
  const mockIssues: QualityIssue[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Missing source citation',
      description: 'Consider adding a citation for the claim about market growth in paragraph 3.',
      location: 'Paragraph 3, Line 1',
      severity: 'medium',
      resolved: false,
      suggestions: [
        'Add a reliable source from your sources panel',
        'Verify the accuracy of the statistical claim'
      ]
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Writing clarity',
      description: 'This sentence could be simplified for better readability.',
      location: 'Introduction, Line 2',
      severity: 'low',
      resolved: false,
      suggestions: [
        'Break down complex sentences',
        'Use active voice where possible'
      ]
    },
    {
      id: '3',
      type: 'error',
      title: 'Factual inconsistency',
      description: 'The dates mentioned appear to conflict with earlier information.',
      location: 'Timeline section',
      severity: 'high',
      resolved: false,
      suggestions: [
        'Cross-reference with source materials',
        'Verify chronological accuracy'
      ]
    },
    {
      id: '4',
      type: 'info',
      title: 'Good structure',
      description: 'Your document follows a logical flow and structure.',
      location: 'Overall',
      severity: 'low',
      resolved: true
    }
  ]

  useEffect(() => {
    setIssues(mockIssues)
  }, [])

  const runQualityCheck = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIssues(mockIssues)
    setOverallScore(Math.floor(Math.random() * 20) + 75) // 75-95
    setLastCheck(new Date())
    setIsAnalyzing(false)
  }

  const handleResolveIssue = (issueId: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === issueId ? { ...issue, resolved: true } : issue
    ))
    onResolveFlag?.(issueId)
  }

  const getIssueIcon = (type: QualityIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'suggestion':
        return <Brain className="h-4 w-4 text-blue-500" />
      case 'info':
        return <Info className="h-4 w-4 text-green-500" />
    }
  }

  const getIssueColor = (type: QualityIssue['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'suggestion':
        return 'border-blue-200 bg-blue-50'
      case 'info':
        return 'border-green-200 bg-green-50'
    }
  }

  const getSeverityColor = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
    }
  }

  const unresolvedIssues = issues.filter(issue => !issue.resolved)
  const resolvedIssues = issues.filter(issue => issue.resolved)

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            Quality Checker
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={runQualityCheck}
            disabled={isAnalyzing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isAnalyzing && "animate-spin")} />
            {isAnalyzing ? 'Analyzing...' : 'Check'}
          </Button>
        </div>

        {/* Overall Score */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Overall Quality Score
              <span className="text-2xl font-bold text-green-600">{overallScore}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallScore} className="mb-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last check: {lastCheck.toLocaleTimeString()}</span>
              <span>{unresolvedIssues.length} issues remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <div className="p-4 border-b bg-muted/20">
          <div className="flex items-center gap-2 text-sm">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Analyzing document quality...</span>
          </div>
          <Progress value={65} className="mt-2" />
        </div>
      )}

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4">
        {unresolvedIssues.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Issues ({unresolvedIssues.length})
            </h3>
            <div className="space-y-3">
              {unresolvedIssues.map((issue) => (
                <Card key={issue.id} className={cn("", getIssueColor(issue.type))}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        {getIssueIcon(issue.type)}
                        <div>
                          <CardTitle className="text-sm">{issue.title}</CardTitle>
                          <CardDescription className="text-xs">
                            {issue.location}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                        {issue.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {issue.description}
                    </p>
                    
                    {issue.suggestions && (
                      <div className="mb-3">
                        <p className="text-xs font-medium mb-1">Suggestions:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {issue.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleResolveIssue(issue.id)}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Resolve
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {resolvedIssues.length > 0 && (
          <div>
            <h3 className="font-medium text-sm mb-3 flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Resolved ({resolvedIssues.length})
            </h3>
            <div className="space-y-2">
              {resolvedIssues.map((issue) => (
                <Card key={issue.id} className="border-green-200 bg-green-50/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{issue.title}</span>
                      <Badge variant="outline" className="text-xs">
                        Resolved
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {issues.length === 0 && !isAnalyzing && (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No quality check performed yet</p>
            <Button size="sm" className="mt-2" onClick={runQualityCheck}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Quality Check
            </Button>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t bg-muted/10">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-red-600">
              {issues.filter(i => i.type === 'error' && !i.resolved).length}
            </div>
            <div className="text-xs text-muted-foreground">Errors</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {issues.filter(i => i.type === 'warning' && !i.resolved).length}
            </div>
            <div className="text-xs text-muted-foreground">Warnings</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {resolvedIssues.length}
            </div>
            <div className="text-xs text-muted-foreground">Fixed</div>
          </div>
        </div>
      </div>
    </div>
  )
}