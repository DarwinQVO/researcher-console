"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SubjectCard } from "./SubjectCard"
import { useSafeNavigation } from "@/hooks/useSafeNavigation"

interface KanbanColumnProps {
  title: string
  cards: Array<{
    id: string
    name: string
    avatar: string
    stamped_niches: string[]
    status: string
    last_updated: string
    podcast?: string
    dueDate?: Date
  }>
}

export function KanbanColumn({ title, cards }: KanbanColumnProps) {
  const { navigate } = useSafeNavigation()

  return (
    <Card className="flex-1 min-w-[320px]">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {cards.map((card) => (
          <SubjectCard 
            key={card.id} 
            {...card} 
            onClick={() => navigate(`/working-studio/${card.id}`, 'KanbanColumn')}
          />
        ))}
      </CardContent>
    </Card>
  )
}
