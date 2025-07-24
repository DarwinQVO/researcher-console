"use client"

import { useDemoStore } from './demoState'
import { mockRequests, mockWorkingDocs, mockModules, mockSources, mockQCFlags, mockAISuggestions } from '@/lib/mock/mockData'
import { Request, WorkingDoc, Module, Source, QCFlag } from '@/models/types'

// Hook to get demo-aware data
export function useDemoData() {
  const demoStore = useDemoStore()
  
  // If not in demo mode, return original mock data
  if (!demoStore.isDemoMode) {
    return {
      requests: mockRequests,
      workingDocs: mockWorkingDocs,
      modules: mockModules,
      sources: mockSources,
      qcFlags: mockQCFlags,
      aiSuggestions: mockAISuggestions,
      isDemoMode: false
    }
  }
  
  // In demo mode, return demo state data
  return {
    requests: demoStore.requests,
    workingDocs: demoStore.workingDocs,
    modules: demoStore.modules,
    sources: demoStore.sources,
    qcFlags: demoStore.qcFlags,
    aiSuggestions: mockAISuggestions, // Keep AI suggestions static for demo
    isDemoMode: true
  }
}

// Demo-aware data fetching functions
export function getRequestById(id: string): Request | undefined {
  const { requests } = useDemoData()
  return requests.find(r => r.id === id)
}

export function getWorkingDocByRequestId(requestId: string): WorkingDoc | undefined {
  const { workingDocs } = useDemoData()
  return workingDocs.find(doc => doc.requestId === requestId)
}

export function getModulesByDocId(docId: string): Module[] {
  const { modules } = useDemoData()
  return modules.filter(m => m.workingDocId === docId)
}

export function getSourcesByDocId(docId: string): Source[] {
  const { sources } = useDemoData()
  return sources.filter(s => s.workingDocId === docId)
}

export function getQCFlagsByDocId(docId: string): QCFlag[] {
  const { qcFlags } = useDemoData()
  return qcFlags.filter(f => f.workingDocId === docId)
}

// Demo state helpers
export function useDemoHelpers() {
  const demoStore = useDemoStore()
  
  const simulateDataCreation = async (type: 'request' | 'source' | 'module', data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    demoStore.addDemoData(type, data)
    
    return data
  }
  
  const simulateStatusUpdate = async (requestId: string, newStatus: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const updatedRequest = demoStore.requests.find(r => r.id === requestId)
    if (updatedRequest) {
      updatedRequest.status = newStatus as any
      updatedRequest.updatedAt = new Date()
    }
    
    return updatedRequest
  }
  
  return {
    simulateDataCreation,
    simulateStatusUpdate,
    isDemoMode: demoStore.isDemoMode,
    currentStep: demoStore.currentStep,
    addDemoData: demoStore.addDemoData
  }
}