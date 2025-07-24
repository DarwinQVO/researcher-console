"use client"

import { useParams, usePathname } from "next/navigation"
import { useSafeNavigation } from "@/hooks/useSafeNavigation"
import { subjectMeta } from "@/lib/mock/steveJobs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "quotes", label: "Quotes" },
  { id: "qa", label: "Q&A" },
  { id: "representations", label: "Representations" },
]

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const { navigate } = useSafeNavigation()
  const currentTab = pathname.split('/').pop() || 'overview'

  return (
    <div className="flex h-full">
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-80 border-r bg-background p-6"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={subjectMeta.avatar} alt={subjectMeta.name} />
              <AvatarFallback>
                {subjectMeta.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{subjectMeta.name}</h2>
              <Badge variant="secondary" className="mt-1">
                {subjectMeta.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{subjectMeta.bio}</p>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-2">Niches</h3>
              <div className="flex flex-wrap gap-1">
                {subjectMeta.stamped_niches.map((niche) => (
                  <Badge key={niche} variant="outline">
                    {niche}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <p className="text-2xl font-semibold">{subjectMeta.stats.quotes}</p>
                <p className="text-sm text-muted-foreground">Quotes</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{subjectMeta.stats.timeline_events}</p>
                <p className="text-sm text-muted-foreground">Events</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{subjectMeta.stats.qa_pairs}</p>
                <p className="text-sm text-muted-foreground">Q&As</p>
              </div>
              <div>
                <p className="text-2xl font-semibold">{subjectMeta.stats.representations}</p>
                <p className="text-sm text-muted-foreground">Reps</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-30 bg-background border-b">
          <Tabs value={currentTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none h-14 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  onClick={() => navigate(`/subject/${params.id}/${tab.id}`, 'SubjectLayout')}
                  className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <motion.div
          key={currentTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
