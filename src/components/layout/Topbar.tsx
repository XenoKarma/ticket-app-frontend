import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { isItStaff } from '@/lib/auth'
interface TopbarProps {
}

function getPageTitle(pathname: string, isStaff: boolean): string {
  if (pathname === '/dashboard') return 'Dashboard'
  if (pathname === '/tickets') return isStaff ? 'Semua Tiket' : 'Tiket Saya'
  if (pathname === '/tickets/create') return 'Buat Tiket'
  if (/^\/tickets\/\d+$/.test(pathname)) return 'Detail Tiket'
  if (pathname === '/manage') return 'Kelola Tiket'
  return ''
}

export function Topbar({}: TopbarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isStaff = isItStaff(user)
  const title = getPageTitle(pathname, isStaff)

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const roleLabel: Record<string, string> = {
    user: 'User',
    it_staff: 'IT Staff',
    head_it: 'Head IT',
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-primary/20 bg-background px-6">
      <div className="flex items-center gap-3">
        {title && (
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">
              {user ? roleLabel[user.role] : ''}
            </p>
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logout().then(() => navigate('/login'))}
            className="text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
