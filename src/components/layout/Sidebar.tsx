import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { isItStaff, isHeadIt } from '@/lib/auth'
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tiket Saya', icon: Ticket },
  { to: '/tickets/create', label: 'Buat Tiket', icon: PlusCircle },
]

const itLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Semua Tiket', icon: Ticket },
  { to: '/manage', label: 'Kelola Tiket', icon: Settings },
]

const headItLinks = [
  ...itLinks,
  { to: '/admin/users', label: 'Kelola User', icon: Users },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth()
  const baseLinks = isItStaff(user) ? itLinks : userLinks
  const links = isHeadIt(user) ? headItLinks : baseLinks

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight text-sidebar-primary">TickTrack</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn('ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', collapsed && 'mx-auto')}
          onClick={onToggle}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent',
              )
            }
          >
            <link.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 border-l-2 border-transparent',
            )
          }
        >
          <User className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Profile</span>}
        </NavLink>
      </div>
    </aside>
  )
}
