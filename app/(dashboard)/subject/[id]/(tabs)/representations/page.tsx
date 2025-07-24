import { RepresentationCard } from "@/components/RepresentationCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const mockRepresentations = [
  {
    id: "1",
    title: "Design Philosophy",
    description: "Jobs' approach to product design emphasizing simplicity and user experience",
    category: "Concept",
    key_points: ["Less is more", "Form follows function", "User-centric design", "Attention to detail"]
  },
  {
    id: "2",
    title: "Think Different Campaign",
    description: "Apple's iconic marketing campaign that redefined the brand's identity",
    category: "Marketing",
    key_points: ["Celebrated misfits and rebels", "Repositioned Apple as creative", "Emotional brand connection", "Premium positioning"]
  },
  {
    id: "3",
    title: "Walled Garden Ecosystem",
    description: "Apple's closed ecosystem approach to hardware and software integration",
    category: "Strategy",
    key_points: ["Seamless integration", "Quality control", "Premium experience", "Customer lock-in"]
  },
  {
    id: "4",
    title: "Keynote Presentations",
    description: "Jobs' legendary product launch presentations and storytelling techniques",
    category: "Communication",
    key_points: ["One more thing...", "Product storytelling", "Dramatic reveals", "Simple, clear messaging"]
  }
]

export default function RepresentationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Representations</h1>
          <p className="text-muted-foreground mt-2">
            Key concepts and frameworks associated with the subject
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Representation
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockRepresentations.map((rep) => (
          <RepresentationCard key={rep.id} representation={rep} />
        ))}
      </div>
    </div>
  )
}