import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    const password = form.get('password') as string
    const confirm = form.get('password_confirmation') as string

    if (password !== confirm) {
      setError('Password tidak sama.')
      return
    }

    setLoading(true)
    try {
      await register({
        name: form.get('name') as string,
        email: form.get('email') as string,
        password,
        password_confirmation: confirm,
      })
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi gagal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <Ticket className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Buat Akun</CardTitle>
          <CardDescription>Daftar untuk mulai menggunakan TickTrack</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" name="name" required placeholder="Nama lengkap" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="email@contoh.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required placeholder="Min. 8 karakter" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
              <Input id="password_confirmation" name="password_confirmation" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
