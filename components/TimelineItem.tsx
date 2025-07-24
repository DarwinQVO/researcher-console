"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { memo } from "react"

// Simple date formatting function
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

interface TimelineItemProps {
  event: {
    id: string
    date: string
    title: string
    description: string
    type: string
  }
  index: number
}

const TimelineItemComponent = ({ event, index }: TimelineItemProps) => {
  return (
    <div 
      className="relative flex items-start gap-6 animate-in slide-in-from-left-8 duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background border-4 border-background shadow-sm z-10">
        <Calendar className="h-6 w-6 text-primary" />
      </div>
      
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{event.title}</h3>
            <Badge variant="secondary">{event.type}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(event.date)}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}

// Memoize the component
export const TimelineItem = memo(TimelineItemComponent)
