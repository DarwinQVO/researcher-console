"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar as CalendarIcon, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users
} from "lucide-react"
import { useState } from "react"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Mock calendar events
  const events = [
    {
      id: 1,
      title: "Client Meeting - TechCorp",
      time: "09:00 AM",
      duration: "1 hour",
      type: "meeting",
      location: "Zoom",
      attendees: 3
    },
    {
      id: 2,
      title: "Research Interview",
      time: "02:00 PM",
      duration: "45 min",
      type: "interview",
      location: "Office",
      attendees: 2
    },
    {
      id: 3,
      title: "Report Review",
      time: "04:30 PM",
      duration: "30 min",
      type: "review",
      location: "Internal",
      attendees: 1
    }
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'interview': return 'bg-green-100 text-green-800 border-green-200'
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-8 w-8" />
            Calendar
          </h1>
          <p className="text-muted-foreground">Schedule and manage your appointments</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar Navigation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{formatDate(currentDate)}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simple calendar grid - in production would use a proper calendar component */}
              <div className="grid grid-cols-7 gap-4 text-center">
                <div className="font-medium text-muted-foreground">Sun</div>
                <div className="font-medium text-muted-foreground">Mon</div>
                <div className="font-medium text-muted-foreground">Tue</div>
                <div className="font-medium text-muted-foreground">Wed</div>
                <div className="font-medium text-muted-foreground">Thu</div>
                <div className="font-medium text-muted-foreground">Fri</div>
                <div className="font-medium text-muted-foreground">Sat</div>
                
                {/* Calendar days - simplified for demo */}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 6 // Start from previous month
                  const isToday = day === new Date().getDate()
                  const hasEvents = day === new Date().getDate()
                  
                  return (
                    <div
                      key={i}
                      className={`
                        p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors
                        ${isToday ? 'bg-primary text-primary-foreground' : ''}
                        ${hasEvents && !isToday ? 'bg-blue-50 border border-blue-200' : ''}
                      `}
                    >
                      {day > 0 && day <= 31 ? day : ''}
                      {hasEvents && (
                        <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-1" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {events.length} events scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border ${getEventColor(event.type)}`}
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm mt-1 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time} ({event.duration})
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.attendees} attendee{event.attendees !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                    <Button size="sm" variant="ghost">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No events scheduled for today
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Meetings</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Interviews</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Reviews</span>
                  <Badge variant="secondary">5</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}