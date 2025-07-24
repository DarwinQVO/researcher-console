"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { memo } from "react"

interface RepresentationCardProps {
  representation: {
    id: string
    title: string
    description: string
    category: string
    key_points: string[]
  }
}

const RepresentationCardComponent = ({ representation }: RepresentationCardProps) => {
  return (
    <Card className="h-full hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-out">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{representation.title}</CardTitle>
          <Badge variant="secondary">{representation.category}</Badge>
        </div>
        <CardDescription>{representation.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {representation.key_points.map((point, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Memoize the component
export const RepresentationCard = memo(RepresentationCardComponent)