"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Inbox, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react"
import Link from "next/link"

export default function DeskPage() {
  // Mock data for the desk dashboard
  const stats = {
    inbound: 12,
    todayTasks: 8,
    weeklyGoals: 75,
    activeClients: 3
  }

  const recentActivity = [
    { type: "inbound", title: "New research request", time: "2 min ago", status: "new" },
    { type: "task", title: "Complete Q3 analysis", time: "1 hour ago", status: "in_progress" },
    { type: "meeting", title: "Client sync call", time: "3 hours ago", status: "completed" },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Desk</h1>
          <p className="text-muted-foreground">Your command center for daily operations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inbound Items</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inbound}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/desk/inbound" className="text-blue-600 hover:underline">
                View all →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTasks}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/desk/calendar" className="text-blue-600 hover:underline">
                View calendar →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyGoals}%</div>
            <Progress value={stats.weeklyGoals} className="h-1 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              <Link href="/desk/time-tracker" className="text-blue-600 hover:underline">
                Track time →
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <p className="text-xs text-muted-foreground">
              <Link href="/vault/clients" className="text-blue-600 hover:underline">
                Manage clients →
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/desk/inbound">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Inbound
              </CardTitle>
              <CardDescription>
                Process incoming requests and tasks
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/desk/calendar">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar
              </CardTitle>
              <CardDescription>
                Schedule and track appointments
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/desk/time-tracker">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Tracker
              </CardTitle>
              <CardDescription>
                Monitor habits and productivity
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  item.status === 'new' ? 'bg-blue-500' :
                  item.status === 'in_progress' ? 'bg-amber-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <Badge variant={
                  item.status === 'new' ? 'default' :
                  item.status === 'in_progress' ? 'secondary' :
                  'outline'
                }>
                  {item.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}