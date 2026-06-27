import type { User } from '@/types'

export function isItStaff(user: User | null): boolean {
  if (!user) return false
  return user.role === 'it_staff' || user.role === 'head_it'
}

export function isHeadIt(user: User | null): boolean {
  if (!user) return false
  return user.role === 'head_it'
}
