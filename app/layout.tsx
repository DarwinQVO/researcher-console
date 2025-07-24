import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { EnterpriseNavigator, FloatingDemoButton } from "@/components/EnterpriseDemo"
import { ErrorLoggerSetup } from "@/components/ErrorLoggerSetup"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Researcher Console",
  description: "Interview Prep Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorLoggerSetup />
        {children}
        <Toaster />
        <EnterpriseNavigator />
        <FloatingDemoButton />
      </body>
    </html>
  )
}