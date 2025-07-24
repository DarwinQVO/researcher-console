"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus, MessageCircle } from "lucide-react"
import { useState } from "react"

const mockQAData = [
  {
    id: "1",
    question: "What was Steve Jobs' management philosophy?",
    answer: "Jobs believed in extreme attention to detail and perfectionism. He was known for his hands-on approach and demanding the best from his teams. He famously said, 'It's better to be a pirate than to join the navy.'",
    tags: ["Leadership", "Management", "Philosophy"]
  },
  {
    id: "2", 
    question: "How did Jobs' early life influence his career?",
    answer: "Being adopted and growing up in Silicon Valley during the tech boom shaped his innovative mindset and drive for perfection. His adoptive father Paul Jobs, a mechanic, taught him the importance of craftsmanship and attention to detail.",
    tags: ["Personal", "Early Life", "Influences"]
  },
  {
    id: "3",
    question: "What was the significance of the iPhone launch?",
    answer: "The iPhone revolutionized the mobile industry by combining a phone, iPod, and internet communicator into one device. Jobs called it 'three revolutionary products in one' during the 2007 keynote.",
    tags: ["Innovation", "iPhone", "Technology"]
  },
  {
    id: "4",
    question: "How did Jobs approach product design?",
    answer: "Jobs believed in simplicity and user experience above all. He famously said 'Design is not just what it looks like and feels like. Design is how it works.' This philosophy drove Apple's minimalist approach.",
    tags: ["Design", "Product", "Philosophy"]
  }
]

export default function QAPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Q&A</h1>
          <p className="text-muted-foreground mt-2">
            Common questions and researched answers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Q&A
        </Button>
      </div>

      <div className="space-y-4">
        {mockQAData.map((qa) => (
          <Card key={qa.id} className="overflow-hidden">
            <CardHeader>
              <button 
                onClick={() => toggleItem(qa.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex flex-col items-start">
                  <h3 className="font-medium">{qa.question}</h3>
                  <div className="flex gap-1 mt-2">
                    {qa.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${
                    openItems.includes(qa.id) ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </CardHeader>
            {openItems.includes(qa.id) && (
              <CardContent>
                <p className="text-sm leading-relaxed">{qa.answer}</p>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Copy</Button>
                  <Button variant="ghost" size="sm">Archive</Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}