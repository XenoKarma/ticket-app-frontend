import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTicket, useUpdateStatus, useAssignTicket, useDeleteTicket } from '@/hooks/useTickets'
import { useComments, useCreateComment } from '@/hooks/useComments'
import { useItStaff } from '@/hooks/useUsers'
import { useAuth } from '@/contexts/AuthContext'
import { isItStaff, isHeadIt } from '@/lib/auth'
import { StatusBadge } from '@/components/tickets/StatusBadge'
import { PriorityBadge } from '@/components/tickets/PriorityBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PageLoading } from '@/components/shared/Loading'
import { ErrorState } from '@/components/shared/ErrorState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Send, Trash2, Download, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { STATUS_LABELS } from '@/lib/constants'

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const ticketId = Number(id)
  const { data: ticket, isLoading, error, refetch } = useTicket(ticketId)
  const { data: comments, refetch: refetchComments } = useComments(ticketId)
  const { data: itStaff } = useItStaff()
  const { mutateAsync: updateStatus } = useUpdateStatus(ticketId)
  const { mutateAsync: assignTicket } = useAssignTicket(ticketId)
  const { mutateAsync: deleteTicket } = useDeleteTicket()
  const { mutateAsync: addComment, isPending: commentPending } = useCreateComment(ticketId)
  const [commentBody, setCommentBody] = useState('')
  const [assignValue, setAssignValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (ticket?.assignee) {
      setAssignValue(String(ticket.assignee.id))
    }
  }, [ticket?.assignee?.id])

  if (isLoading) return <PageLoading />
  if (error) return <ErrorState onRetry={refetch} />

  const isOwner = ticket?.user?.id === user?.id
  const isIT = isItStaff(user)

  async function handleStatusChange(status: string) {
    await updateStatus(status)
    toast.success('Status berhasil diupdate')
  }

  async function handleAssign(assignedTo: string) {
    await assignTicket(Number(assignedTo))
    toast.success('Tiket berhasil diassign')
  }

  async function handleDelete() {
    setDeleteLoading(true)
    try {
      await deleteTicket(ticketId)
      setDeleteDialogOpen(false)
      toast.success('Tiket berhasil dihapus')
      navigate('/tickets')
    } catch (err: any) {
      setDeleteDialogOpen(false)
      setDeleteLoading(false)
      toast.error(err.response?.data?.message || 'Gagal menghapus tiket.')
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!commentBody.trim()) return
    await addComment({ body: commentBody })
    setCommentBody('')
    refetchComments()
    toast.success('Komentar berhasil ditambahkan')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tickets')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{ticket?.title}</h1>
          <p className="text-sm text-muted-foreground">
            #{ticket?.id} &middot; {ticket?.category?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket?.priority || ''} />
          <StatusBadge status={ticket?.status || ''} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deskripsi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm">{ticket?.description}</p>
            </CardContent>
          </Card>

          {ticket?.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Lampiran ({ticket.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ticket.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={`http://localhost:8000/storage/${att.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 truncate">{att.original_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(att.size / 1024).toFixed(1)} KB
                      </span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Komentar ({comments?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments?.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada komentar.</p>
              ) : (
                comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 rounded-lg bg-muted/50 px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.user?.name}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                          {comment.user?.role === 'it_staff' || comment.user?.role === 'head_it'
                            ? 'IT Staff'
                            : 'User'}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(comment.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{comment.body}</p>
                    </div>
                  </div>
                ))
              )}

              <form onSubmit={handleComment} className="flex gap-2 pt-2">
                <Textarea
                  placeholder="Tulis komentar..."
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  className="flex-1 min-h-[40px]"
                  rows={2}
                />
                <Button type="submit" size="icon" disabled={commentPending || !commentBody.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Pelapor</p>
                <p className="font-medium">{ticket?.user?.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{ticket?.user?.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p className="font-medium">
                  {ticket?.assignee ? ticket.assignee.name : (
                    <span className="text-muted-foreground">Belum diassign</span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Dibuat</p>
                <p className="font-medium">
                  {ticket?.created_at && new Date(ticket.created_at).toLocaleString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>

          {isIT && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tindakan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Update Status</label>
                  <Select
                    value={ticket?.status || 'open'}
                    onValueChange={(v) => { if (v) handleStatusChange(v as string) }}
                  >
                    <SelectTrigger>
                      <SelectValue>{STATUS_LABELS[ticket?.status || 'open']}</SelectValue>
                    </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Assign ke</label>
                  <Select
                    value={assignValue}
                    onValueChange={(v) => { if (v) { setAssignValue(v); handleAssign(v as string) } }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih IT Staff...">
                        {assignValue && (itStaff?.find((u) => String(u.id) === assignValue)?.name || 'Saya sendiri')}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {itStaff?.map((staff) => (
                        <SelectItem key={staff.id} value={String(staff.id)}>
                          {staff.name} ({staff.role === 'head_it' ? 'Head IT' : 'IT Staff'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(isOwner || isHeadIt(user)) && (
                  <>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Tiket
                    </Button>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Hapus Tiket</DialogTitle>
                          <DialogDescription>
                            Apakah Anda yakin ingin menghapus tiket <strong>"{ticket?.title}"</strong>? Tindakan ini tidak dapat dibatalkan.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                            {deleteLoading ? 'Menghapus...' : 'Hapus'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
