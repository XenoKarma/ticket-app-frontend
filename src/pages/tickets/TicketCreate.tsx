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
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tickets')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Buat Tiket Baru</h1>
          <p className="text-xs text-muted-foreground">Laporkan kendala yang Anda alami</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Form Laporan</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Kategori</Label>
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

              <div className="space-y-1">
                <Label className="text-xs">Prioritas</Label>
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
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Judul</Label>
              <Input name="title" required placeholder="Contoh: Komputer saya mati total" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Deskripsi</Label>
              <Textarea
                name="description"
                required
                placeholder="Jelaskan kendala secara detail..."
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Label
                  htmlFor="file-upload"
                  className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-dashed px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Lampirkan file (opsional, maks {MAX_FILES})
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
                <div className="flex flex-wrap gap-1">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs"
                    >
                      <span className="max-w-[160px] truncate">{file.name}</span>
                      <button type="button" className="text-muted-foreground hover:text-foreground" onClick={() => removeFile(i)}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
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
