import { useState } from 'react'
import { useUserList, useCreateUser, useUpdateUserRole, useDeleteUser } from '@/hooks/useUserManagement'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageLoading } from '@/components/shared/Loading'
import { ErrorState } from '@/components/shared/ErrorState'
import { EmptyState } from '@/components/shared/EmptyState'
import { PlusCircle, Shield, Trash2, User as UserIcon } from 'lucide-react'
import { toast } from 'sonner'

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'it_staff', label: 'IT Staff' },
  { value: 'head_it', label: 'Head IT' },
]

const roleLabel: Record<string, string> = {
  user: 'User',
  it_staff: 'IT Staff',
  head_it: 'Head IT',
}

export default function UserManagement() {
  const { data: users, isLoading, error, refetch } = useUserList()
  const { mutateAsync: createUser, isPending: creating } = useCreateUser()
  const { mutateAsync: updateRole } = useUpdateUserRole()
  const { mutateAsync: deleteUser } = useDeleteUser()
  const { user: currentUser } = useAuth()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [roleLoading, setRoleLoading] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  function resetForm() {
    setForm({ name: '', email: '', password: '', role: 'user' })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    try {
      await createUser(form)
      toast.success('User berhasil dibuat')
      setOpen(false)
      resetForm()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat user')
    }
  }

  async function handleRoleChange(userId: number, role: string) {
    setRoleLoading(userId)
    try {
      await updateRole({ id: userId, role })
      toast.success('Role berhasil diubah')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah role')
    } finally {
      setRoleLoading(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteUser(deleteTarget.id)
      toast.success('User berhasil dihapus')
      setDeleteTarget(null)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menghapus user')
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (isLoading) return <PageLoading />
  if (error) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelola User</h1>
          <p className="text-sm text-muted-foreground">
            Atur user dan role untuk IT Staff / Head IT
          </p>
        </div>
        <Button onClick={() => { resetForm(); setOpen(true) }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Tambah User Baru</DialogTitle>
                <DialogDescription>Buat akun untuk user baru</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Nama</Label>
                  <Input
                    id="new-name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-email">Email</Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-role">Role</Label>
                  <Select
                    value={form.role}
                    onValueChange={(v) => setForm((p) => ({ ...p, role: v || 'user' }))}
                  >
                    <SelectTrigger>
                      <SelectValue>{roleOptions.find((o) => o.value === form.role)?.label}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          {!users?.length ? (
            <EmptyState title="Tidak ada user" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-xs font-medium">
                        {u.role === 'head_it' || u.role === 'it_staff' ? (
                          <Shield className="h-3 w-3" />
                        ) : (
                          <UserIcon className="h-3 w-3" />
                        )}
                        {roleLabel[u.role]}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== currentUser?.id && (
                          <>
                            <Select
                              value={u.role}
                              onValueChange={(v) => { if (v) handleRoleChange(u.id, v as string) }}
                              disabled={roleLoading === u.id}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue>{roleLabel[u.role]}</SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {roleOptions.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>
                                    {o.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget({ id: u.id, name: u.name })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus User</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteTarget?.name}</strong>?<br />
              Semua tiket dan komentar milik user ini akan ikut terhapus.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
              {deleteLoading ? 'Menghapus...' : 'Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
