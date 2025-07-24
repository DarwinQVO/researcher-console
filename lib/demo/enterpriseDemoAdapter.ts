"use client"

import { useEnterpriseDemoStore } from './enterpriseDemoState'
import { mockRequests, mockWorkingDocs, mockModules, mockSources } from '@/lib/mock/mockData'
import { Request, WorkingDoc, Module, Source } from '@/models/types'

export function useEnterpriseDemoData() {
  const demoStore = useEnterpriseDemoStore()
  
  if (!demoStore.isDemoMode) {
    return {
      requests: mockRequests,
      workingDocs: mockWorkingDocs,
      modules: mockModules,
      sources: mockSources,
      isDemoMode: false
    }
  }
  
  return {
    requests: demoStore.requests,
    workingDocs: demoStore.workingDocs,
    modules: demoStore.modules,
    sources: demoStore.sources,
    isDemoMode: true
  }
}

// Helper functions that work with data directly - don't use hooks
export function getEnterpriseRequestById(id: string, requests: Request[]): Request | undefined {
  return requests.find(r => r.id === id)
}

export function getEnterpriseWorkingDocByRequestId(requestId: string, workingDocs: WorkingDoc[]): WorkingDoc | undefined {
  return workingDocs.find(doc => doc.requestId === requestId)
}

export function getEnterpriseModulesByDocId(docId: string, modules: Module[]): Module[] {
  return modules.filter(mod => mod.workingDocId === docId)
}

export function getEnterpriseSourcesByDocId(docId: string, sources: Source[]): Source[] {
  return sources.filter(src => src.workingDocId === docId)
}