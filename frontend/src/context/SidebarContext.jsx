import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SidebarContext = createContext(undefined)

export function SidebarProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Close sidebar drawer automatically when navigating to a new page
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)
  const openSidebar = () => setSidebarOpen(true)

  return (
    <SidebarContext.Provider
      value={{ sidebarOpen, toggleSidebar, closeSidebar, openSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
