import { TimelineItem } from "@/components/TimelineItem"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

// Mock timeline events from mock data structure
const timelineEvents = [
  {
    id: "1",
    date: "1955-02-24",
    title: "Born in San Francisco",
    description: "Steven Paul Jobs was born to Joanne Carole Schieble and Abdulfattah 'John' Jandali, later adopted by Paul and Clara Jobs.",
    type: "personal"
  },
  {
    id: "2", 
    date: "1976-04-01",
    title: "Founded Apple Computer",
    description: "Co-founded Apple Computer Company with Steve Wozniak and Ronald Wayne in the Jobs family garage.",
    type: "career"
  },
  {
    id: "3",
    date: "1984-01-24", 
    title: "Launched Macintosh",
    description: "Introduced the first Macintosh computer with the famous '1984' Super Bowl commercial.",
    type: "product"
  },
  {
    id: "4",
    date: "2007-01-09",
    title: "Unveiled the iPhone", 
    description: "Revolutionized the mobile phone industry with the introduction of the iPhone.",
    type: "product"
  }
]

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Chronological events and milestones
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
