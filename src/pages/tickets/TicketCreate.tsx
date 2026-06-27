import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '@/hooks/useCategories'
import { useCreateTicket } from '@/hooks/useTickets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { PRIORITY_LABELS } from '@/lib/constants'
const MAX_FILES = 5
const MAX_SIZE = 5 * 1024 * 1024

export default function TicketCreate() {
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const { mutateAsync: createTicket, isPending } = useCreateTicket()
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const [catId, setCatId] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (files.length + selected.length > MAX_FILES) {
      setError(`Maksimal ${MAX_FILES} file.`)
      return
    }
    const oversized = selected.find((f) => f.size > MAX_SIZE)
    if (oversized) {
      setError(`File ${oversized.name} terlalu besar (maks 5MB).`)
      return
    }
    setError('')
    setFiles((prev) => [...prev, ...selected])
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)

    try {
      await createTicket({
        category_id: Number(form.get('category_id')),
        title: form.get('title') as string,
        description: form.get('description') as string,
        priority: form.get('priority') as any,
        attachments: files.length > 0 ? files : undefined,
      })
      navigate('/tickets')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat tiket.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tickets')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buat Tiket Baru</h1>
          <p className="text-sm text-muted-foreground">
            Laporkan kendala yang Anda alami
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Laporan</CardTitle>
          <CardDescription>
            Isi detail kendala dengan lengkap agar mudah ditindaklanjuti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category_id">Kategori</Label>
              <Select
                name="category_id"
                value={catId}
                onValueChange={(v) => setCatId(v || '')}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori">
                    {categories?.find((c) => String(c.id) === catId)?.name}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c: any) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                name="priority"
                value={priority}
                onValueChange={(v) => setPriority(v || 'medium')}
              >
                <SelectTrigger>
                  <SelectValue>{PRIORITY_LABELS[priority]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" name="title" required placeholder="Contoh: Komputer saya mati total" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Jelaskan kendala secara detail..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Lampiran (opsional, maks {MAX_FILES} file)</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="file-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed px-4 py-6 text-sm text-muted-foreground hover:bg-muted/50 w-full justify-center"
                >
                  <Upload className="h-5 w-5" />
                  Klik untuk upload file
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              {files.length > 0 && (
                <div className="space-y-1">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                      <span className="truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(i)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Menyimpan...' : 'Kirim Tiket'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/tickets')}>
                Batal
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
