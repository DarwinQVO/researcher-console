"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  title: string
  description?: string
  variant: 'default' | 'destructive' | 'success'
  timestamp: Date
  isRead: boolean
  category?: 'system' | 'export' | 'ai' | 'save' | 'citation' | 'connection'
  actionText?: string
  actionCallback?: () => void
}

interface NotificationState {
  notifications: Notification[]
  isNotificationCenterOpen: boolean
  unreadCount: number
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  toggleNotificationCenter: () => void
  closeNotificationCenter: () => void
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      isNotificationCenterOpen: false,
      unreadCount: 0,

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          isRead: false,
        }

        set((state) => {
          const updatedNotifications = [newNotification, ...state.notifications].slice(0, 50) // Keep only last 50
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length
          
          return {
            notifications: updatedNotifications,
            unreadCount
          }
        })
      },

      markAsRead: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          )
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length
          
          return {
            notifications: updatedNotifications,
            unreadCount
          }
        })
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        }))
      },

      removeNotification: (id) => {
        set((state) => {
          const updatedNotifications = state.notifications.filter(n => n.id !== id)
          const unreadCount = updatedNotifications.filter(n => !n.isRead).length
          
          return {
            notifications: updatedNotifications,
            unreadCount
          }
        })
      },

      clearAllNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },

      toggleNotificationCenter: () => {
        set((state) => ({ isNotificationCenterOpen: !state.isNotificationCenterOpen }))
      },

      closeNotificationCenter: () => {
        set({ isNotificationCenterOpen: false })
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
)