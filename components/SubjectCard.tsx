"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { memo } from "react"

// Simple date formatting function to replace date-fns
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hours ago`
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} days ago`
}

interface SubjectCardProps {
  id: string
  name: string
  avatar: string
  stamped_niches: string[]
  status: string
  last_updated: string
  onClick?: () => void
  podcast?: string
  dueDate?: Date
}

const SubjectCardComponent = ({
  id,
  name,
  avatar,
  stamped_niches,
  status,
  last_updated,
  onClick,
  podcast,
  dueDate
}: SubjectCardProps) => {
  const formatDueDate = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`
    if (diffInDays === 0) return 'Due today'
    if (diffInDays === 1) return 'Due tomorrow'
    return `Due in ${diffInDays} days`
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {podcast && <span>{podcast} • </span>}
              Updated {formatTimeAgo(last_updated)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1 mb-2">
          {stamped_niches.map((niche) => (
            <Badge key={niche} variant="secondary" className="text-xs">
              {niche}
            </Badge>
          ))}
        </div>
        {dueDate && (
          <p className={`text-xs font-medium ${
            new Date(dueDate) < new Date() ? 'text-red-500' : 'text-muted-foreground'
          }`}>
            {formatDueDate(dueDate)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Memoize the component
export const SubjectCard = memo(SubjectCardComponent)
