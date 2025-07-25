"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  Play,
  Pause,
  Square,
  Plus,
  Target,
  TrendingUp,
  Calendar,
  BarChart3
} from "lucide-react"
import { useState } from "react"

export default function TimeTrackerPage() {
  const [isTracking, setIsTracking] = useState(false)
  const [currentTask, setCurrentTask] = useState("Research Analysis")
  const [elapsedTime, setElapsedTime] = useState("02:34:12")

  // Mock time tracking data
  const todayStats = {
    totalTime: "6h 45m",
    focusTime: "4h 22m",
    breakTime: "1h 15m",
    productivity: 85
  }

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

  const timeEntries = [
    {
      task: "Research Analysis",
      duration: "2h 34m",
      category: "Research",
      completed: false
    },
    {
      task: "Client Meeting Prep",
      duration: "45m",
      category: "Meeting",
      completed: true
    },
    {
      task: "Report Writing",
      duration: "1h 26m",
      category: "Writing",
      completed: true
    }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Time Tracker
          </h1>
          <p className="text-muted-foreground">Monitor productivity and build healthy habits</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

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
              <div className="text-3xl font-mono font-bold">{elapsedTime}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsTracking(!isTracking)}
              variant={isTracking ? "secondary" : "default"}
            >
              {isTracking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isTracking ? 'Pause' : 'Start'}
            </Button>
            <Button variant="outline">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            <Button variant="ghost">Change Task</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Stats */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Today's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{todayStats.totalTime}</div>
                  <div className="text-sm text-muted-foreground">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{todayStats.focusTime}</div>
                  <div className="text-sm text-muted-foreground">Focus Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{todayStats.breakTime}</div>
                  <div className="text-sm text-muted-foreground">Breaks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{todayStats.productivity}%</div>
                  <div className="text-sm text-muted-foreground">Productivity</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={todayStats.productivity} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Time Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>Activities tracked today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timeEntries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${entry.completed ? 'bg-green-500' : 'bg-blue-500'}`} />
                      <div>
                        <div className="font-medium">{entry.task}</div>
                        <div className="text-sm text-muted-foreground">{entry.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium">{entry.duration}</div>
                      <Badge variant={entry.completed ? "default" : "secondary"}>
                        {entry.completed ? "Done" : "Active"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Habits Tracker */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Daily Habits
              </CardTitle>
              <CardDescription>Track your daily goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {habits.map((habit, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {habit.completed}/{habit.target} {habit.unit}
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {habit.streak}
                    </Badge>
                  </div>
                  <Progress value={(habit.completed / habit.target) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                View Weekly Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics Dashboard
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="h-4 w-4 mr-2" />
                Set New Goals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}