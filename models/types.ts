// Data models for AI-powered Interview-Prep System (v3)

export type RequestStatus = 'open' | 'in_progress' | 'qc' | 'delivered'
export type ModuleStatus = 'pending' | 'active' | 'completed'
export type SourceType = 'I' | 'V' | 'T' | 'SD' // Interview, Video, Text, Structured Data
export type ModuleVariant = 'standard' | 'expanded' | 'minimal'
export type Tier = 'standard' | 'premium' | 'express'

// Core Entities
export interface Request {
  id: string
  trelloCardId: string
  guest: string
  podcast: string
  tier: Tier
  dueDate: Date
  status: RequestStatus
  createdAt: Date
  updatedAt: Date
}

export interface WorkingDoc {
  id: string
  requestId: string
  briefMD: string
  notes: string
  createdAt: Date
  updatedAt: Date
  request?: Request
  modules?: Module[]
  sources?: Source[]
}

export interface Module {
  id: string
  workingDocId: string
  name: string
  variant: ModuleVariant
  status: ModuleStatus
  isEnabled: boolean
  order: number
  content?: string
  createdAt: Date
  updatedAt: Date
  clips?: Clip[]
}

export interface Source {
  id: string
  workingDocId: string
  type: SourceType
  title: string
  url: string
  domain: string
  capturedBy: 'manual' | 'ai' | 'extension'
  notes?: string
  metadata?: Record<string, any>
  createdAt: Date
  clips?: Clip[]
}

export interface Clip {
  id: string
  moduleId: string
  sourceId: string
  text: string
  timestampOrPg?: string
  citation: string
  createdAt: Date
  module?: Module
  source?: Source
}

// UI State Types
export interface SourcesHubState {
  sources: Source[]
  selectedSourceId?: string
  filters: {
    type?: SourceType
    module?: string
    domain?: string
  }
  sortBy: 'createdAt' | 'title' | 'type'
  sortOrder: 'asc' | 'desc'
}

export interface AIAssistState {
  activeTab: 'queries' | 'extract' | 'rewrite'
  selectedModule?: string
  suggestions: string[]
  isLoading: boolean
}

export interface QCFlag {
  id: string
  workingDocId: string
  type: 'style' | 'citation' | 'content' | 'format'
  severity: 'error' | 'warning' | 'info'
  message: string
  location?: {
    moduleId?: string
    line?: number
    character?: number
  }
  resolved: boolean
}

// Module Catalog Types
export interface ModuleCatalogItem {
  id: string
  name: string
  description: string
  requiredFor: Tier[]
  defaultVariant: ModuleVariant
  template: string
  aiPrompt?: string
}

// Export Types
export interface ExportOptions {
  format: 'google-docs' | 'markdown' | 'pdf'
  includeComments: boolean
  includeSourcesHub: boolean
  customStyling?: Record<string, any>
}

// Style Rules
export interface StyleRule {
  id: string
  name: string
  description: string
  regex?: string
  validator: (text: string) => boolean
  fixer?: (text: string) => string
}

// Citation Format
export interface CitationFormat {
  type: SourceType
  template: string // e.g., "[{title}]({url}) ({type})"
  shorthandRules: Record<string, string>
}