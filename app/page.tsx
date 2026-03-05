"use client"

import { useState, useEffect } from "react"
import { Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PreviewModal } from "@/components/preview-modal"
import { Header } from "@/components/header"
import { FuncionariosCard } from "@/components/funcionarios-card"
import { JustificativasCard } from "@/components/justificativas-card"
import { ObservacoesCard } from "@/components/observacoes-card"
import { Footer } from "@/components/footer"
import { gerarPDF } from "@/lib/generate-pdf"
import type { JustificativaItem } from "@/lib/types"
import type { Funcionario } from "@/lib/types"

const criarItemVazio = (): JustificativaItem => ({
  id: Date.now().toString(),
  tipo: "",
  data: "",
})

export default function JustificaWeb() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [justificativas, setJustificativas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<string[]>([])
  const [justificativasItems, setJustificativasItems] = useState<JustificativaItem[]>([criarItemVazio()])
  const [observacoes, setObservacoes] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/public/funcionarios")
        .then(async (r) => {
          if (!r.ok) throw new Error(`Funcionários: ${r.status}`)
          const text = await r.text()
          if (!text.trim()) return []
          return JSON.parse(text) as Funcionario[]
        }),
      fetch("/api/public/justificativas")
        .then(async (r) => {
          if (!r.ok) throw new Error(`Justificativas: ${r.status}`)
          const text = await r.text()
          if (!text.trim()) return []
          return JSON.parse(text) as string[]
        }),
    ])
      .then(([funcs, justs]) => {
        setFuncionarios(Array.isArray(funcs) ? funcs : [])
        setJustificativas(Array.isArray(justs) ? justs : [])
      })
      .catch((err) => {
        console.error(err)
        setFuncionarios([])
        setJustificativas([])
      })
      .finally(() => setLoading(false))
  }, [])

  const handleFuncionarioChange = (funcionarioId: string, checked: boolean) => {
    setFuncionariosSelecionados((prev) =>
      checked ? [...prev, funcionarioId] : prev.filter((id) => id !== funcionarioId)
    )
  }

  const handleSelecionarTodos = () => {
    setFuncionariosSelecionados(
      funcionariosSelecionados.length === funcionarios.length ? [] : funcionarios.map((f) => f.id)
    )
  }

  const handleAdicionarJustificativa = () => {
    setJustificativasItems((prev) => [...prev, criarItemVazio()])
  }

  const handleRemoverJustificativa = (id: string) => {
    if (justificativasItems.length > 1) {
      setJustificativasItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleJustificativaChange = (id: string, field: "tipo" | "data", value: string) => {
    setJustificativasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const justificativasValidas = justificativasItems.filter((item) => item.tipo && item.data)
  const isFormValid = funcionariosSelecionados.length > 0 && justificativasValidas.length > 0

  const handleGerarPDF = async () => {
    try {
      await gerarPDF(funcionarios, funcionariosSelecionados, justificativasValidas, observacoes)
      alert("PDF gerado e baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    }
  }

  const handleConfirmarGeracao = () => {
    setShowPreview(false)
    handleGerarPDF()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-3 sm:px-4"
      suppressHydrationWarning
    >
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        <Header />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <FuncionariosCard
            funcionarios={funcionarios}
            selecionados={funcionariosSelecionados}
            onToggle={handleFuncionarioChange}
            onSelecionarTodos={handleSelecionarTodos}
          />
          <JustificativasCard
            items={justificativasItems}
            justificativas={justificativas}
            onAdicionar={handleAdicionarJustificativa}
            onRemover={handleRemoverJustificativa}
            onChange={handleJustificativaChange}
          />
        </div>

        <ObservacoesCard value={observacoes} onChange={setObservacoes} />

        <Separator className="my-8" />

        <div className="text-center">
          <Button
            onClick={() => setShowPreview(true)}
            disabled={!isFormValid}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 sm:px-8 py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            Gerar PDF
          </Button>
          {!isFormValid && (
            <p className="text-sm text-gray-500 mt-3">
              Preencha os funcionários e pelo menos uma justificativa completa
            </p>
          )}
        </div>

        <Footer />
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmarGeracao}
        funcionarios={funcionarios}
        funcionariosSelecionados={funcionariosSelecionados}
        justificativasItems={justificativasValidas}
        observacoes={observacoes}
      />
    </div>
  )
}
