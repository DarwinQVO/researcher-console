"use client"

import { useEnterpriseDemoData } from "@/lib/demo/enterpriseDemoAdapter"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DemoInvitation } from "@/components/EnterpriseDemo"

// Simple date formatting function
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

export default function SubjectsPage() {
  const { requests, isDemoMode } = useEnterpriseDemoData()
  const router = useRouter()

  return (
    <div className="p-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Subjects</h1>
          <p className="text-muted-foreground">
            List view of all research subjects
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Subject
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card className="rounded-2xl p-12">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No hay sujetos de investigación</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {isDemoMode 
                ? "Los sujetos aparecerán automáticamente durante el demo cuando se creen solicitudes."
                : "Los sujetos aparecen automáticamente cuando se crean solicitudes de investigación."
              }
            </p>
            {!isDemoMode && (
              <Button onClick={() => router.push('/requests')}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Solicitud
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <Card className="rounded-2xl p-6">
          <div className="space-y-4">
            {requests.map((subject) => (
            <div 
              key={subject.id}
              className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl cursor-pointer transition-colors"
              onClick={() => router.push(`/working-studio/${subject.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(subject.guest)}&background=random`} 
                    alt={subject.guest} 
                  />
                  <AvatarFallback>
                    {subject.guest.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{subject.guest}</h3>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {subject.tier}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {subject.podcast}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline">
                  {subject.status.replace('_', ' ')}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  Updated {formatTimeAgo(subject.updatedAt.toISOString())}
                </p>
              </div>
            </div>
          ))}
          </div>
        </Card>
      )}
      
      {!isDemoMode && requests.length === 0 && <DemoInvitation />}
    </div>
  )
}