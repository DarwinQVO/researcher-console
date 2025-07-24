"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Database, 
  Key,
  Palette,
  Download,
  Upload
} from "lucide-react"

const settingsSections = [
  {
    title: "Profile Settings",
    description: "Manage your account and profile information",
    icon: User,
    items: [
      { label: "Display Name", value: "Research Coordinator", action: "Edit" },
      { label: "Email", value: "coordinator@research.com", action: "Change" },
      { label: "Role", value: "Senior Researcher", action: "View" }
    ]
  },
  {
    title: "Notifications",
    description: "Configure your notification preferences",
    icon: Bell,
    items: [
      { label: "Email Notifications", value: "Enabled", action: "Toggle" },
      { label: "Request Updates", value: "Immediate", action: "Configure" },
      { label: "Export Completion", value: "Enabled", action: "Toggle" }
    ]
  },
  {
    title: "Data & Integrations",
    description: "Manage data sources and external integrations",
    icon: Database,
    items: [
      { label: "Trello Integration", value: "Connected", action: "Configure" },
      { label: "Google Docs API", value: "Active", action: "Manage" },
      { label: "Data Sync Frequency", value: "Every 5 minutes", action: "Change" }
    ]
  },
  {
    title: "API & Security",
    description: "Manage API keys and security settings",
    icon: Key,
    items: [
      { label: "API Key", value: "sk-proj-***", action: "Regenerate" },
      { label: "Two-Factor Auth", value: "Disabled", action: "Enable" },
      { label: "Session Timeout", value: "2 hours", action: "Configure" }
    ]
  },
  {
    title: "Appearance",
    description: "Customize the interface appearance",
    icon: Palette,
    items: [
      { label: "Theme", value: "Light", action: "Change" },
      { label: "Sidebar Position", value: "Left", action: "Switch" },
      { label: "Density", value: "Comfortable", action: "Adjust" }
    ]
  }
]

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account, preferences, and integrations
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {settingsSections.map((section, index) => {
          const IconComponent = section.icon
          return (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between py-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          {item.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Data Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export, import, and manage your research data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Export Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download all your research data in various formats
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export JSON
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Import Data</h4>
                <p className="text-sm text-muted-foreground">
                  Import existing research data from previous projects
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import File
                </Button>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-destructive">Danger Zone</h4>
                  <p className="text-sm text-muted-foreground">
                    Irreversible actions that will affect your account
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Clear Cache
                  </Button>
                  <Button variant="destructive" size="sm">
                    Reset All Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}