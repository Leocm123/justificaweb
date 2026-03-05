"use client"

import { useState, useEffect, useCallback } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Users,
  ClipboardList,
  Plus,
  Trash2,
  Pencil,
  LogOut,
  Home,
  Loader2,
  GripVertical,
} from "lucide-react"

interface Funcionario {
  id: string
  nome: string
}

interface Justificativa {
  id: string
  texto: string
}

function SortableFuncionarioItem({
  f,
  editFunc,
  setEditFunc,
  handleUpdateFuncionario,
  handleDeleteFuncionario,
  saving,
}: {
  f: Funcionario
  editFunc: Funcionario | null
  setEditFunc: (f: Funcionario | null) => void
  handleUpdateFuncionario: (e: React.FormEvent) => void
  handleDeleteFuncionario: (id: string) => void
  saving: string | null
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: f.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800 gap-2 ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      {editFunc?.id === f.id ? (
        <form onSubmit={handleUpdateFuncionario} className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
          <Input
            value={editFunc.nome}
            onChange={(e) => setEditFunc((p) => p && { ...p, nome: e.target.value })}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm" disabled={!!saving}>
            {saving === `func-${f.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ok"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditFunc(null)}>
            Cancelar
          </Button>
        </form>
      ) : (
        <>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Arrastar para reordenar"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-sm truncate min-w-0 flex-1">{f.nome}</span>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditFunc(f)}
              disabled={!!saving}
              className="h-8"
            >
              <Pencil className="h-3 w-3 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteFuncionario(f.id)}
              disabled={!!saving}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 h-8"
            >
              {saving === `func-del-${f.id}` ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remover
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function SortableJustificativaItem({
  j,
  editJust,
  setEditJust,
  handleUpdateJustificativa,
  handleDeleteJustificativa,
  saving,
}: {
  j: Justificativa
  editJust: Justificativa | null
  setEditJust: (j: Justificativa | null) => void
  handleUpdateJustificativa: (e: React.FormEvent) => void
  handleDeleteJustificativa: (id: string) => void
  saving: string | null
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: j.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800 ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      {editJust?.id === j.id ? (
        <form onSubmit={handleUpdateJustificativa} className="flex-1 flex flex-col sm:flex-row gap-2 min-w-0">
          <Input
            value={editJust.texto}
            onChange={(e) => setEditJust((p) => p && { ...p, texto: e.target.value })}
            className="flex-1"
            autoFocus
          />
          <Button type="submit" size="sm" disabled={!!saving}>
            {saving === `just-${j.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ok"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setEditJust(null)}>
            Cancelar
          </Button>
        </form>
      ) : (
        <>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none p-1 -ml-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 shrink-0"
            aria-label="Arrastar para reordenar"
          >
            <GripVertical className="h-4 w-4 text-gray-500" />
          </div>
          <span className="text-xs sm:text-sm flex-1 truncate min-w-0">{j.texto}</span>
          <div className="flex gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditJust(j)}
              disabled={!!saving}
              className="h-8"
            >
              <Pencil className="h-3 w-3 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteJustificativa(j.id)}
              disabled={!!saving}
              className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 h-8"
            >
              {saving === `just-del-${j.id}` ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-3 w-3 mr-1" />
                  Remover
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [justificativas, setJustificativas] = useState<Justificativa[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const [editFunc, setEditFunc] = useState<Funcionario | null>(null)
  const [newFunc, setNewFunc] = useState({ slug: "", nome: "" })
  const [editJust, setEditJust] = useState<Justificativa | null>(null)
  const [newJust, setNewJust] = useState("")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const fetchData = useCallback(async (retryCount = 0) => {
    const maxRetries = 2
    try {
      const [funcRes, justRes] = await Promise.all([
        fetch("/api/funcionarios", { credentials: "include" }),
        fetch("/api/justificativas", { credentials: "include" }),
      ])

      if (funcRes.status === 401 || justRes.status === 401) {
        if (retryCount < maxRetries) {
          await new Promise((r) => setTimeout(r, 300))
          return fetchData(retryCount + 1)
        }
        window.location.href = "/admin/login"
        return
      }

      if (funcRes.ok) setFuncionarios(await funcRes.json())
      if (justRes.ok) setJustificativas(await justRes.json())
    } catch (e) {
      console.error(e)
      if (retryCount < maxRetries) {
        await new Promise((r) => setTimeout(r, 300))
        return fetchData(retryCount + 1)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleReorderFuncionarios = async (newOrder: Funcionario[]) => {
    setFuncionarios(newOrder)
    try {
      const res = await fetch("/api/funcionarios/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newOrder.map((f) => f.id) }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        const msg = [err.error, err.details].filter(Boolean).join(" — ") || "Erro ao reordenar funcionários"
        alert(msg)
        fetchData()
      }
    } catch {
      alert("Erro ao reordenar funcionários")
      fetchData()
    }
  }

  const handleReorderJustificativas = async (newOrder: Justificativa[]) => {
    setJustificativas(newOrder)
    try {
      const res = await fetch("/api/justificativas/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: newOrder.map((j) => j.id) }),
      })
      if (!res.ok) {
        fetchData()
      }
    } catch {
      fetchData()
    }
  }

  const handleDragEndFunc = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = funcionarios.findIndex((f) => f.id === active.id)
      const newIndex = funcionarios.findIndex((f) => f.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(funcionarios, oldIndex, newIndex)
        handleReorderFuncionarios(newOrder)
      }
    }
  }

  const handleDragEndJust = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = justificativas.findIndex((j) => j.id === active.id)
      const newIndex = justificativas.findIndex((j) => j.id === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(justificativas, oldIndex, newIndex)
        handleReorderJustificativas(newOrder)
      }
    }
  }

  const handleCreateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFunc.nome.trim()) return
    setSaving("func")
    try {
      const res = await fetch("/api/funcionarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: newFunc.slug || newFunc.nome.toLowerCase().replace(/\s+/g, "-"),
          nome: newFunc.nome.trim(),
        }),
      })
      if (res.ok) {
        setNewFunc({ slug: "", nome: "" })
        fetchData()
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || "Erro ao criar")
      }
    } finally {
      setSaving(null)
    }
  }

  const handleUpdateFuncionario = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFunc) return
    setSaving(`func-${editFunc.id}`)
    try {
      const res = await fetch(`/api/funcionarios/${editFunc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editFunc.nome.trim() }),
      })
      if (res.ok) {
        setEditFunc(null)
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || "Erro ao atualizar")
      }
    } finally {
      setSaving(null)
    }
  }

  const handleDeleteFuncionario = async (id: string) => {
    if (!confirm("Remover este funcionário?")) return
    setSaving(`func-del-${id}`)
    try {
      const res = await fetch(`/api/funcionarios/${id}`, { method: "DELETE" })
      if (res.ok) fetchData()
      else alert("Erro ao remover")
    } finally {
      setSaving(null)
    }
  }

  const handleCreateJustificativa = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newJust.trim()) return
    setSaving("just")
    try {
      const res = await fetch("/api/justificativas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: newJust.trim() }),
      })
      if (res.ok) {
        setNewJust("")
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || "Erro ao criar")
      }
    } finally {
      setSaving(null)
    }
  }

  const handleUpdateJustificativa = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editJust) return
    setSaving(`just-${editJust.id}`)
    try {
      const res = await fetch(`/api/justificativas/${editJust.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: editJust.texto.trim() }),
      })
      if (res.ok) {
        setEditJust(null)
        fetchData()
      } else {
        const err = await res.json()
        alert(err.error || "Erro ao atualizar")
      }
    } finally {
      setSaving(null)
    }
  }

  const handleDeleteJustificativa = async (id: string) => {
    if (!confirm("Remover esta justificativa?")) return
    setSaving(`just-del-${id}`)
    try {
      const res = await fetch(`/api/justificativas/${id}`, { method: "DELETE" })
      if (res.ok) fetchData()
      else alert("Erro ao remover")
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 lg:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]">
                <Home className="h-4 w-4 mr-2 shrink-0" />
                Site
              </Button>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">Painel Admin</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full sm:w-auto min-h-[44px]"
          >
            <LogOut className="h-4 w-4 mr-2 shrink-0" />
            Sair
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-5 w-5 shrink-0" />
                Funcionários
              </CardTitle>
              <CardDescription>Arraste para reordenar. Gerencie a lista de funcionários.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <form onSubmit={handleCreateFuncionario} className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Nome completo"
                  value={newFunc.nome}
                  onChange={(e) => setNewFunc((p) => ({ ...p, nome: e.target.value }))}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!!saving}>
                  {saving === "func" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </form>
              <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndFunc}
                >
                  <SortableContext
                    items={funcionarios.map((f) => f.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {funcionarios.map((f) => (
                      <SortableFuncionarioItem
                        key={f.id}
                        f={f}
                        editFunc={editFunc}
                        setEditFunc={setEditFunc}
                        handleUpdateFuncionario={handleUpdateFuncionario}
                        handleDeleteFuncionario={handleDeleteFuncionario}
                        saving={saving}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ClipboardList className="h-5 w-5 shrink-0" />
                Justificativas
              </CardTitle>
              <CardDescription>Arraste para reordenar. Gerencie os tipos de justificativa.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <form onSubmit={handleCreateJustificativa} className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Nova justificativa"
                  value={newJust}
                  onChange={(e) => setNewJust(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={!!saving}>
                  {saving === "just" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
              </form>
              <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEndJust}
                >
                  <SortableContext
                    items={justificativas.map((j) => j.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {justificativas.map((j) => (
                      <SortableJustificativaItem
                        key={j.id}
                        j={j}
                        editJust={editJust}
                        setEditJust={setEditJust}
                        handleUpdateJustificativa={handleUpdateJustificativa}
                        handleDeleteJustificativa={handleDeleteJustificativa}
                        saving={saving}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
