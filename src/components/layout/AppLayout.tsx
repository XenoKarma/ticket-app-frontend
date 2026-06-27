import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useAuthGuard } from '@/hooks/useAuth'
import { PageLoading } from '@/components/shared/Loading'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { isLoading } = useAuthGuard()

  if (isLoading) return <PageLoading />

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
