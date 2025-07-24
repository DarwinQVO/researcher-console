import { 
  Request, 
  WorkingDoc, 
  Module, 
  Source, 
  Clip, 
  QCFlag,
  ModuleCatalogItem,
  RequestStatus,
  SourceType 
} from '@/models/types'

// Mock Requests
export const mockRequests: Request[] = [
  {
    id: 'req-1',
    trelloCardId: 'trello-123',
    guest: 'Steve Jobs',
    podcast: 'Tech Visionaries',
    tier: 'premium',
    dueDate: new Date('2024-02-15'),
    status: 'in_progress',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'req-2',
    trelloCardId: 'trello-124',
    guest: 'Elon Musk',
    podcast: 'Innovation Leaders',
    tier: 'standard',
    dueDate: new Date('2024-02-20'),
    status: 'open',
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'req-3',
    trelloCardId: 'trello-125',
    guest: 'Satya Nadella',
    podcast: 'CEO Insights',
    tier: 'express',
    dueDate: new Date('2024-02-10'),
    status: 'qc',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-23')
  },
  {
    id: 'req-4',
    trelloCardId: 'trello-126',
    guest: 'Tim Cook',
    podcast: 'Tech Visionaries',
    tier: 'premium',
    dueDate: new Date('2024-02-08'),
    status: 'delivered',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-25')
  }
]

// Mock Working Docs
export const mockWorkingDocs: WorkingDoc[] = [
  {
    id: 'doc-1',
    requestId: 'req-1',
    briefMD: `# Steve Jobs Interview Prep

## Overview
Preparing comprehensive interview materials for Steve Jobs, focusing on his innovation philosophy, leadership style, and impact on technology.

## Key Themes
- Innovation and Design
- Leadership Philosophy  
- Personal Journey
- Industry Impact`,
    notes: 'Focus on the intersection of technology and liberal arts. Emphasize design thinking.',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-23')
  }
]

// Mock Modules
export const mockModules: Module[] = [
  {
    id: 'mod-1',
    workingDocId: 'doc-1',
    name: 'Early Life',
    variant: 'standard',
    status: 'completed',
    isEnabled: true,
    order: 1,
    content: `## Early Life

Steven Paul Jobs was born on February 24, 1955, in San Francisco to Joanne Carole Schieble and Abdulfattah "John" Jandali. He was adopted by Paul and Clara Jobs.

**Key Influences:**
- Adoptive father Paul Jobs, a mechanic who taught him craftsmanship
- Growing up in Silicon Valley during the tech boom
- Dropping out of Reed College but auditing classes like calligraphy`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'mod-2',
    workingDocId: 'doc-1',
    name: 'Timeline',
    variant: 'expanded',
    status: 'active',
    isEnabled: true,
    order: 2,
    content: `## Timeline

**1955-02-24**: Born in San Francisco
**1976-04-01**: Co-founded Apple with Steve Wozniak
**1984-01-24**: Launched the Macintosh
**1985-09-17**: Left Apple after boardroom battle
**1986-02-03**: Founded NeXT Computer
**1986**: Purchased Pixar from George Lucas
**1997**: Returned to Apple as CEO
**2001-10-23**: Launched the iPod
**2007-01-09**: Unveiled the iPhone
**2010-04-03**: Introduced the iPad
**2011-10-05**: Passed away at age 56`,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22')
  },
  {
    id: 'mod-3',
    workingDocId: 'doc-1',
    name: 'Key Quotes',
    variant: 'standard',
    status: 'pending',
    isEnabled: true,
    order: 3,
    content: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'mod-4',
    workingDocId: 'doc-1',
    name: 'Leadership Style',
    variant: 'standard',
    status: 'pending',
    isEnabled: false,
    order: 4,
    content: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'mod-5',
    workingDocId: 'doc-1',
    name: 'Innovation Philosophy',
    variant: 'expanded',
    status: 'pending',
    isEnabled: true,
    order: 5,
    content: '',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
]

// Mock Sources
export const mockSources: Source[] = [
  {
    id: 'src-1',
    workingDocId: 'doc-1',
    type: 'T',
    title: 'Steve Jobs by Walter Isaacson',
    url: 'https://books.google.com/books/about/Steve_Jobs.html',
    domain: 'books.google.com',
    capturedBy: 'manual',
    notes: 'Official biography with extensive interviews',
    metadata: { pages: 656, year: 2011 },
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'src-2',
    workingDocId: 'doc-1',
    type: 'V',
    title: 'Stanford Commencement Speech 2005',
    url: 'https://www.youtube.com/watch?v=UF8uR6Z6KLc',
    domain: 'youtube.com',
    capturedBy: 'ai',
    notes: 'Famous "Stay Hungry, Stay Foolish" speech',
    metadata: { duration: '15:04', views: 42000000 },
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'src-3',
    workingDocId: 'doc-1',
    type: 'I',
    title: 'All Things D Interview 2010',
    url: 'https://www.wsj.com/video/steve-jobs-at-d8/123',
    domain: 'wsj.com',
    capturedBy: 'manual',
    notes: 'Wide-ranging interview with Walt Mossberg',
    metadata: { duration: '91:00' },
    createdAt: new Date('2024-01-21')
  },
  {
    id: 'src-4',
    workingDocId: 'doc-1',
    type: 'SD',
    title: 'Apple Inc. Annual Reports 1997-2011',
    url: 'https://investor.apple.com/financials',
    domain: 'investor.apple.com',
    capturedBy: 'ai',
    notes: 'Financial data during Jobs CEO tenure',
    metadata: { reports: 15 },
    createdAt: new Date('2024-01-21')
  },
  {
    id: 'src-5',
    workingDocId: 'doc-1',
    type: 'T',
    title: 'The Innovation Secrets of Steve Jobs',
    url: 'https://www.amazon.com/Innovation-Secrets-Steve-Jobs/dp/123',
    domain: 'amazon.com',
    capturedBy: 'manual',
    notes: 'Analysis of Jobs innovation methodology',
    createdAt: new Date('2024-01-22')
  }
]

// Mock Clips
export const mockClips: Clip[] = [
  {
    id: 'clip-1',
    moduleId: 'mod-1',
    sourceId: 'src-1',
    text: 'Jobs was adopted at birth by Paul and Clara Jobs. His biological mother insisted his adoptive parents be college graduates.',
    timestampOrPg: 'p. 4-5',
    citation: '[Steve Jobs Biography](https://books.google.com/books/about/Steve_Jobs.html) (T)',
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'clip-2',
    moduleId: 'mod-2',
    sourceId: 'src-2',
    text: "You can't connect the dots looking forward; you can only connect them looking backward.",
    timestampOrPg: '5:32',
    citation: '[Stanford Speech 2005](https://www.youtube.com/watch?v=UF8uR6Z6KLc) (V)',
    createdAt: new Date('2024-01-21')
  }
]

// Mock QC Flags
export const mockQCFlags: QCFlag[] = [
  {
    id: 'qc-1',
    workingDocId: 'doc-1',
    type: 'citation',
    severity: 'warning',
    message: 'Missing source type indicator',
    location: {
      moduleId: 'mod-2',
      line: 15
    },
    resolved: false
  },
  {
    id: 'qc-2',
    workingDocId: 'doc-1',
    type: 'style',
    severity: 'error',
    message: 'Use "Jan" instead of "January"',
    location: {
      moduleId: 'mod-2',
      line: 8
    },
    resolved: false
  }
]

// Mock Module Catalog
export const mockModuleCatalog: ModuleCatalogItem[] = [
  {
    id: 'cat-1',
    name: 'Early Life',
    description: 'Childhood, family background, formative experiences',
    requiredFor: ['express', 'standard', 'premium'],
    defaultVariant: 'standard',
    template: '## Early Life\n\n[Childhood and family]\n\n[Education]\n\n[Early influences]',
    aiPrompt: 'Extract information about childhood, family, education, and early influences'
  },
  {
    id: 'cat-2',
    name: 'Timeline',
    description: 'Chronological list of significant events',
    requiredFor: ['express', 'standard', 'premium'],
    defaultVariant: 'expanded',
    template: '## Timeline\n\n**YYYY-MM-DD**: Event description',
    aiPrompt: 'Create a comprehensive timeline of major life events and achievements'
  },
  {
    id: 'cat-3',
    name: 'Key Quotes',
    description: 'Most impactful and representative quotes',
    requiredFor: ['express', 'standard', 'premium'],
    defaultVariant: 'standard',
    template: '## Key Quotes\n\n> "Quote text"\n> — Context',
    aiPrompt: 'Identify memorable quotes that capture their philosophy'
  }
]

// Mock AI Suggestions
export const mockAISuggestions = {
  queries: [
    "What drove Steve Jobs' obsession with simplicity and design?",
    "How did his adoption influence his perfectionism and need for control?",
    "What was the real story behind his departure from Apple in 1985?",
    "How did Pixar change his approach to leadership?",
    "What lessons did he learn from his biggest failures?"
  ],
  extractions: [
    {
      text: "Design is not just what it looks like and feels like. Design is how it works.",
      source: "BusinessWeek Interview 2003",
      relevance: "Design Philosophy"
    },
    {
      text: "I think the things you most regret in life are things you didn't do. What you really regret was never asking that girl to dance.",
      source: "Jobs Biography p. 123",
      relevance: "Personal Philosophy"
    }
  ],
  rewrites: {
    'leadership': "Jobs exhibited a paradoxical leadership style that combined inspiring vision with demanding perfectionism. He pushed teams beyond their perceived limits while maintaining an unwavering focus on user experience.",
    'innovation': "His innovation philosophy centered on the intersection of technology and liberal arts, believing that truly revolutionary products emerge when technical excellence meets humanistic understanding."
  }
}

// Helper functions
export function getRequestById(id: string): Request | undefined {
  return mockRequests.find(r => r.id === id)
}

export function getWorkingDocByRequestId(requestId: string): WorkingDoc | undefined {
  return mockWorkingDocs.find(d => d.requestId === requestId)
}

export function getModulesByDocId(docId: string): Module[] {
  return mockModules.filter(m => m.workingDocId === docId)
}

export function getSourcesByDocId(docId: string): Source[] {
  return mockSources.filter(s => s.workingDocId === docId)
}

export function getClipsByModuleId(moduleId: string): Clip[] {
  return mockClips.filter(c => c.moduleId === moduleId)
}

export function getQCFlagsByDocId(docId: string): QCFlag[] {
  return mockQCFlags.filter(f => f.workingDocId === docId)
}