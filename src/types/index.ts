export interface User {
  id: number
  name: string
  email: string
  role: 'user' | 'it_staff' | 'head_it'
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

export interface TicketAttachment {
  id: number
  file_path: string
  original_name: string
  mime_type: string
  size: number
}

export interface Comment {
  id: number
  ticket_id: number
  user: User
  body: string
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: number
  user: User
  category: Category
  assignee: User | null
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'rejected' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  attachments: TicketAttachment[]
  comments: Comment[]
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number
    last_page: number
    links: { url: string | null; label: string; active: boolean }[]
    path: string
    per_page: number
    to: number
    total: number
  }
}

export interface DashboardData {
  total_tickets: number
  total_tickets_change: string
  active_tickets: number
  active_tickets_change: string
  completed_tickets: number
  completed_tickets_change: string
  status_counts: Record<Ticket['status'], number>
  priority_counts: Record<Ticket['priority'], number>
  recent_tickets: Ticket[]
  assigned_to_me: number | null
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface CreateTicketInput {
  category_id: number
  title: string
  description: string
  priority: Ticket['priority']
  attachments?: File[]
}

export interface CreateCommentInput {
  body: string
}
