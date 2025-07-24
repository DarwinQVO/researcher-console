"use client"

import { useDemoStore } from './demoState'

export function useDemoActions() {
  const store = useDemoStore()
  
  const updateRequestStatus = (requestId: string, newStatus: string) => {
    const requests = [...store.requests]
    const requestIndex = requests.findIndex(r => r.id === requestId)
    if (requestIndex >= 0) {
      requests[requestIndex] = {
        ...requests[requestIndex],
        status: newStatus as any,
        updatedAt: new Date()
      }
      // Force update by setting the array
      store.requests.splice(0, store.requests.length, ...requests)
    }
  }

  const updateWorkingDocContent = (docId: string, content: string) => {
    const workingDocs = [...store.workingDocs]
    const docIndex = workingDocs.findIndex(d => d.id === docId)
    if (docIndex >= 0) {
      workingDocs[docIndex] = {
        ...workingDocs[docIndex],
        briefMD: content,
        updatedAt: new Date()
      }
      // Force update
      store.workingDocs.splice(0, store.workingDocs.length, ...workingDocs)
    }
  }

  return {
    updateRequestStatus,
    updateWorkingDocContent,
    ...store
  }
}