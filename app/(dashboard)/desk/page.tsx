"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Inbox, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  ExternalLink,
  User,
  Tag,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Play,
  Pause,
  Square,
  Target,
  BarChart3,
  Eye,
  Heart
} from "lucide-react"
import { useState } from "react"

export default function DeskPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTask, setCurrentTask] = useState("Research Analysis")
  const [elapsedTime, setElapsedTime] = useState("02:34:12")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mock data for the unified desk dashboard
  const stats = {
    inbound: 12,
    todayTasks: 8,
    weeklyGoals: 75,
    activeClients: 3,
    totalTime: "6h 45m",
    focusTime: "4h 22m",
    productivity: 85
  }

  // Inbound items
  const inboundItems = [
    {
      id: 1,
      title: "New research request: Tech industry analysis",
      priority: "high",
      source: "Email",
      assignee: "Unassigned",
      createdAt: "2 hours ago",
      tags: ["research", "tech", "urgent"]
    },
    {
      id: 2,
      title: "Interview scheduling: CEO of StartupX",
      priority: "medium",
      source: "Calendar",
      assignee: "Sarah Chen",
      createdAt: "4 hours ago",
      tags: ["interview", "scheduling"]
    },
    {
      id: 3,
      title: "Source verification needed",
      priority: "low",
      source: "Upload",
      assignee: "Mike Johnson",
      createdAt: "1 day ago",
      tags: ["verification", "documents"]
    }
  ]

  // Today's events
  const todayEvents = [
    {
      id: 1,
      title: "Client Meeting - TechCorp",
      time: "09:00 AM",
      duration: "1 hour",
      location: "Zoom",
      attendees: 3,
      type: "meeting"
    },
    {
      id: 2,
      title: "Research Interview",
      time: "02:00 PM",
      duration: "45 min",
      location: "Office",
      attendees: 2,
      type: "interview"
    },
    {
      id: 3,
      title: "Report Review",
      time: "04:30 PM",
      duration: "30 min",
      location: "Internal",
      attendees: 1,
      type: "review"
    }
  ]

  // Habits tracking
  const habits = [
    {
      name: "Deep Work",
      target: 4,
      completed: 3.5,
      unit: "hours",
      streak: 12
    },
    {
      name: "Reading",
      target: 1,
      completed: 0.75,
      unit: "hours",
      streak: 8
    },
    {
      name: "Exercise",
      target: 30,
      completed: 30,
      unit: "minutes",
      streak: 5
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'interview': return 'bg-green-100 text-green-800 border-green-200'
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Desk</h1>
          <p className="text-muted-foreground">Your unified command center for daily operations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inbound}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.todayTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.focusTime}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.weeklyGoals}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.productivity}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeClients}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Inbound & Time Tracker */}
        <div className="lg:col-span-4 space-y-6">
          {/* Current Timer */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                    {currentTask}
                  </CardTitle>
                  <CardDescription>
                    {isTracking ? 'Currently tracking' : 'Paused'}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-mono font-bold">{elapsedTime}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsTracking(!isTracking)}
                  variant={isTracking ? "secondary" : "default"}
                  size="sm"
                >
                  {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isTracking ? 'Pause' : 'Start'}
                </Button>
                <Button variant="outline" size="sm">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inbound Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Inbox className="h-5 w-5" />
                  Inbound Queue
                </CardTitle>
                <Badge variant="outline">{inboundItems.length} items</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {inboundItems.slice(0, 3).map((item) => (
                <div key={item.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                    <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.createdAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.assignee}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline">Process</Button>
                  </div>
                </div>
              ))}
              {inboundItems.length > 3 && (
                <Button variant="ghost" className="w-full">
                  View all {inboundItems.length} items
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Daily Habits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits.map((habit, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{habit.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {habit.completed}/{habit.target} {habit.unit}
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      <TrendingUp className="h-3 w-3" />
                      {habit.streak}
                    </Badge>
                  </div>
                  <Progress value={(habit.completed / habit.target) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Calendar & Schedule */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Today's Schedule
                </CardTitle>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventColor(event.type)}`}
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm mt-2 space-y-1">
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
              </div>
            </CardContent>
          </Card>

          {/* Mini Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
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
      </div>
    </div>
  )
}