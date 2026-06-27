import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { isItStaff, isHeadIt } from '@/lib/auth'
import { Toaster } from 'sonner'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import TicketList from '@/pages/tickets/TicketList'
import UserTickets from '@/pages/user/UserTickets'
import UserDashboard from '@/pages/user/UserDashboard'
import TicketCreate from '@/pages/tickets/TicketCreate'
import TicketDetail from '@/pages/tickets/TicketDetail'
import TicketManage from '@/pages/tickets/TicketManage'
import Profile from '@/pages/Profile'
import UserManagement from '@/pages/admin/UserManagement'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
})

function DashboardRoute() {
  const { user } = useAuth()
  return isItStaff(user) ? <Dashboard /> : <UserDashboard />
}

function TicketsRoute() {
  const { user } = useAuth()
  return isItStaff(user) ? <TicketList /> : <UserTickets />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!isHeadIt(user)) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardRoute />} />
              <Route path="/tickets" element={<TicketsRoute />} />
              <Route path="/tickets/create" element={<TicketCreate />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/manage" element={<TicketManage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
