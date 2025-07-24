"use client"

import { mockClips } from "@/lib/mock/mockData"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Plus, Filter } from "lucide-react"

interface Clip {
  id: string
  text: string
  source: string
  citation: string
  moduleId: string
}

export default function QuotesPage() {
  const [selectedQuote, setSelectedQuote] = useState<typeof mockClips[0] | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Quote Library</h1>
          <p className="text-muted-foreground mt-2">
            Curated collection of notable quotes
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Quote
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search quotes..."
            className="w-full pl-8 pr-4 py-2 border rounded-xl bg-background"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {mockClips.map((quote) => (
          <Card
            key={quote.id}
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedQuote(quote)}
          >
            <blockquote className="text-lg italic mb-4">
              "{quote.text}"
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {quote.citation}
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  Module: {quote.moduleId}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quote Detail Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quote Details</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-4">
              <blockquote className="text-xl italic border-l-4 border-primary pl-4">
                "{selectedQuote.text}"
              </blockquote>
              <div className="space-y-2">
                <p><strong>Citation:</strong> {selectedQuote.citation}</p>
                <p><strong>Module:</strong> {selectedQuote.moduleId}</p>
                {selectedQuote.timestampOrPg && (
                  <p><strong>Reference:</strong> {selectedQuote.timestampOrPg}</p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <Button>Edit Quote</Button>
                <Button variant="outline">Copy Citation</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}