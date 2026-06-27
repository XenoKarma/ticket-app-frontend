import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useUpdateProfile, useUpdatePassword } from '@/hooks/useProfile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mail, Shield, Calendar } from 'lucide-react'
import { toast } from 'sonner'

const roleLabel: Record<string, string> = {
  user: 'User',
  it_staff: 'IT Staff',
  head_it: 'Head IT',
}

export default function Profile() {
  const { user, getUser } = useAuth()
  const { mutateAsync: updateProfile, isPending: saving } = useUpdateProfile()
  const { mutateAsync: updatePassword, isPending: changing } = useUpdatePassword()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' })

  async function handleProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateProfile({ name, email })
      await getUser()
      toast.success('Profil berhasil diubah')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah profil')
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwForm.password !== pwForm.password_confirmation) {
      toast.error('Password tidak sama')
      return
    }
    try {
      await updatePassword(pwForm)
      setPwForm({ current_password: '', password: '', password_confirmation: '' })
      toast.success('Password berhasil diubah')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengubah password')
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi akun Anda</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Akun</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-xl font-bold text-emerald-400">
                {initials}
              </div>
              <div className="text-center">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4 shrink-0" />
                <span>{user ? roleLabel[user.role] : ''}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {user?.created_at &&
                    new Date(user.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Edit Profil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfile} className="flex flex-wrap items-end gap-3">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="name" className="text-xs">Nama</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <Button type="submit" disabled={saving} className="shrink-0">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Ubah Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePassword} className="flex flex-wrap items-end gap-3">
                <div className="min-w-[180px] flex-1 space-y-1">
                  <Label htmlFor="current_password" className="text-xs">Password Saat Ini</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={pwForm.current_password}
                    onChange={(e) => setPwForm((p) => ({ ...p, current_password: e.target.value }))}
                    required
                  />
                </div>
                <div className="min-w-[180px] flex-1 space-y-1">
                  <Label htmlFor="password" className="text-xs">Password Baru</Label>
                  <Input
                    id="password"
                    type="password"
                    value={pwForm.password}
                    onChange={(e) => setPwForm((p) => ({ ...p, password: e.target.value }))}
                    required
                    minLength={8}
                  />
                </div>
                <div className="min-w-[180px] flex-1 space-y-1">
                  <Label htmlFor="password_confirmation" className="text-xs">Konfirmasi</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={pwForm.password_confirmation}
                    onChange={(e) => setPwForm((p) => ({ ...p, password_confirmation: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={changing} className="shrink-0">
                  {changing ? 'Mengubah...' : 'Ubah'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
