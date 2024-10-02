'use client'

import { useState } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/admin/Sidebar'
import { Navbar } from '@/components/admin/Header'
import { ThemeProvider } from '@/components/admin/theme-provider'

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Navbar onMenuClick={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </ThemeProvider>
    </SessionProvider>
  )
}
