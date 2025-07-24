"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Toast } from "./toast"
import { useToast } from "@/lib/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            onClose={() => toast.dismiss?.()}
          >
            <div className="grid gap-1">
              {toast.title && (
                <div className="text-sm font-semibold">{toast.title}</div>
              )}
              {toast.description && (
                <div className="text-sm opacity-90">{toast.description}</div>
              )}
            </div>
            {toast.action}
          </Toast>
        ))}
      </AnimatePresence>
    </div>
  )
}