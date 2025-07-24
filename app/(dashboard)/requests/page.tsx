"use client"

import { KanbanColumn } from "@/components/KanbanColumn"
import { useEnterpriseDemoData } from "@/lib/demo/enterpriseDemoAdapter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { DemoInvitation } from "@/components/EnterpriseDemo"

export default function RequestsPage() {
  const { requests, isDemoMode } = useEnterpriseDemoData()
  
  const columns = {
    open: requests.filter(r => r.status === 'open'),
    in_progress: requests.filter(r => r.status === 'in_progress'),
    qc: requests.filter(r => r.status === 'qc'),
    delivered: requests.filter(r => r.status === 'delivered'),
  }

  const requestCards = requests.map(req => ({
    id: req.id,
    name: req.guest,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.guest)}&background=random`,
    stamped_niches: [req.tier],
    status: req.status,
    last_updated: req.updatedAt.toISOString(),
    podcast: req.podcast,
    dueDate: req.dueDate
  }))

  const columnData = {
    open: requestCards.filter(r => r.status === 'open'),
    in_progress: requestCards.filter(r => r.status === 'in_progress'),
    qc: requestCards.filter(r => r.status === 'qc'),
    delivered: requestCards.filter(r => r.status === 'delivered'),
  }

  return (
    <div className="p-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests Board</h1>
          <p className="text-muted-foreground">
            Manage interview prep requests from Trello
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Trello
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6" id="kanban-board">
        <KanbanColumn title="Open" cards={columnData.open} />
        <KanbanColumn title="In Progress" cards={columnData.in_progress} />
        <KanbanColumn title="Quality Check" cards={columnData.qc} />
        <KanbanColumn title="Delivered" cards={columnData.delivered} />
      </div>
      
      {/* Empty State for Demo */}
      {requests.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay solicitudes</h3>
          <p className="text-muted-foreground mb-4">
            {isDemoMode 
              ? "El sistema está vacío. El demo te guiará para crear la primera solicitud."
              : "Comienza creando tu primera solicitud de investigación."
            }
          </p>
        </div>
      )}
      
      {!isDemoMode && requests.length === 0 && <DemoInvitation />}
    </div>
  )
}
