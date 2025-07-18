"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, FileText, Users, ClipboardList, MessageSquare, Download, Plus, Trash2, Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import jsPDF from "jspdf"
import { PreviewModal } from "@/components/preview-modal"
import { useTheme } from "next-themes"

const funcionarios = [
  { id: "aline", nome: "Aline Morais" },
  { id: "claudia", nome: "Claudia de Freitas Barbosa" },
  { id: "dayana", nome: "Dayana Aparecida dos Santos Camargo" },
  { id: "dyoni", nome: "Dyoni Galani" },
  { id: "fernando", nome: "Fernando Faquinetti Amorim" },
  { id: "greicieli", nome: "Greicieli Nascimento dos Santos" },
  { id: "iara", nome: "Iara Gonçalves Pereira" },
  { id: "janaina", nome: "Janaina Prieto de Assis" },
  { id: "jean", nome: "Jean Sales Prado" },
  { id: "joao", nome: "João Trindade de Oliveira" },
  { id: "juliana", nome: "Juliana Gazola Fernandes" },
  { id: "julio", nome: "Julio Edson Fronza" },
  { id: "leila", nome: "Leila Cassia de Sousa Lemos" },
  { id: "leonardo", nome: "Leonardo Camilotti Moreno" },
  { id: "luiz", nome: "Luiz Bernardo da Silva" },
  { id: "matheus", nome: "Matheus de Oliveira Santos" },
  { id: "natalia", nome: "Natalia Diniz de Lima Scarabelli" },
]

const justificativas = [
  "TRABALHO EM HORÁRIO DIRETO DEVIDO LOCALIDADE DISTANTE SEM TRANSPORTE",
  "TRABALHO EM HORÁRIO DIRETO PARA RECUPERAR IMÓVEIS DURANTE O PERÍODO DO ALMOÇO",
  "TRABALHO EM HORÁRIO DIRETO DEVIDO A VISITA DOMICILIAR EM ÁREA RURAL DISTANTE",
  "NÃO HOUVE REGISTRO DE BIOMETRIA",
  "ESQUECEU DE REGISTRAR BIOMETRIA",
  "FOLGA PERÍODO INTEGRAL",
  "FOLGA MEIO PERÍODO",
  "TRABALHO EM HORÁRIO DIRETO - RECOLHIMENTO DE ARMADILHAS OVITRAMPAS",
  "TRABALHO EM HORÁRIO DIRETO - DELIMITAÇÃO DE FOCO NOS QUARTEIRÕES POSITIVOS (DF)",
  "TRABALHO EM HORÁRIO DIRETO - PONTO ESTRATÉGICO (PE)",
  "TRABALHO EM HORÁRIO DIRETO - LEVANTAMENTO DE ÍNDICE (LIRAA)",
]

interface JustificativaItem {
  id: string
  tipo: string
  data: string
}

export default function JustificaWeb() {
  const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<string[]>([])
  const [justificativasItems, setJustificativasItems] = useState<JustificativaItem[]>([{ id: "1", tipo: "", data: "" }])
  const [observacoes, setObservacoes] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFuncionarioChange = (funcionarioId: string, checked: boolean) => {
    if (checked) {
      setFuncionariosSelecionados([...funcionariosSelecionados, funcionarioId])
    } else {
      setFuncionariosSelecionados(funcionariosSelecionados.filter((id) => id !== funcionarioId))
    }
  }

  const handleSelecionarTodos = () => {
    if (funcionariosSelecionados.length === funcionarios.length) {
      setFuncionariosSelecionados([])
    } else {
      setFuncionariosSelecionados(funcionarios.map((f) => f.id))
    }
  }

  const handleAdicionarJustificativa = () => {
    const novaJustificativa: JustificativaItem = {
      id: Date.now().toString(),
      tipo: "",
      data: "",
    }
    setJustificativasItems([...justificativasItems, novaJustificativa])
  }

  const handleRemoverJustificativa = (id: string) => {
    if (justificativasItems.length > 1) {
      setJustificativasItems(justificativasItems.filter((item) => item.id !== id))
    }
  }

  const handleJustificativaChange = (id: string, field: "tipo" | "data", value: string) => {
    setJustificativasItems(justificativasItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const todosSelecionados = funcionariosSelecionados.length === funcionarios.length

  const handleGerarPDF = async () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const lineHeight = 6
      let yPosition = 20

      const loadImageFromURL = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = reject
          img.src = url
        })
      }

      try {
        console.log("Carregando imagens...")
        const brasaoImg = await loadImageFromURL(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3eZmDxiptsuE17CBJdVFP1NhFXbUuV.png",
        )
        const cabecalhoImg = await loadImageFromURL(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oz6F6GzwTxlKmwhGoCJzWzmpyfBrC3.png",
        )

        console.log("Imagens carregadas com sucesso")

        const brasaoWidth = 25
        const brasaoHeight = 30
        doc.addImage(brasaoImg, "PNG", margin, yPosition, brasaoWidth, brasaoHeight)

        const cabecalhoWidth = 120
        const cabecalhoHeight = 30
        const cabecalhoX = pageWidth - margin - cabecalhoWidth
        doc.addImage(cabecalhoImg, "PNG", cabecalhoX, yPosition, cabecalhoWidth, cabecalhoHeight)

        yPosition += 40
      } catch (imageError) {
        console.error("Erro ao carregar imagens:", imageError)
        yPosition += 10
      }

      // Título principal
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("JUSTIFICATIVAS DE AUSÊNCIA DE REGISTRO DE PONTO", pageWidth / 2, yPosition, { align: "center" })

      yPosition += 8
      doc.setFontSize(12)
      doc.text("VIGILÂNCIA AMBIENTAL – COMBATE AS ENDEMIAS", pageWidth / 2, yPosition, { align: "center" })

      // Seção NOMES
      yPosition += 15
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("NOMES:", margin, yPosition)

      yPosition += 8
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      const funcionariosSelecionadosNomes = funcionarios
        .filter((f) => funcionariosSelecionados.includes(f.id))
        .map((f) => f.nome.toUpperCase())

      funcionariosSelecionadosNomes.forEach((nome) => {
        doc.text(nome, margin, yPosition)
        yPosition += lineHeight
      })

      yPosition += 10

      // Texto explicativo
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("Assinalar o campo que não houve registro de ponto e preencher o horário cumprido.", margin, yPosition)

      yPosition += 10

      // Checkboxes para horários - versão funcional
      doc.setFontSize(10)

      // Primeira linha de checkboxes
      // Entrada da manhã
      doc.text("( ) entrada da manhã  07h:30min.", margin, yPosition + 3)

      // Saída da manhã
      const middleX = pageWidth / 2 + 10
      doc.text("( ) saída da manhã  11h:30min.", middleX, yPosition + 3)

      yPosition += 12

      // Segunda linha de checkboxes
      // Entrada da tarde
      doc.text("( ) entrada da tarde  13h:00min.", margin, yPosition + 3)

      // Saída da tarde
      doc.text("( ) saída da tarde 17h:00min.", middleX, yPosition + 3)

      // Seção DATA/MOTIVO - Múltiplas justificativas
      yPosition += 20
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("DATA/MOTIVO:", margin, yPosition)

      yPosition += 10
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")

      // Processar cada justificativa
      const justificativasValidas = justificativasItems.filter((item) => item.tipo && item.data)

      justificativasValidas.forEach((item, index) => {
        // Corrigir problema de fuso horário - criar data no fuso horário local
        const [year, month, day] = item.data.split('-').map(Number)
        const dataLocal = new Date(year, month - 1, day) // month - 1 porque Date usa 0-indexed months
        const dataFormatada = dataLocal.toLocaleDateString("pt-BR")
        const dataMotivo = `${dataFormatada} – ${item.tipo.toUpperCase()}`

        const dataLines = doc.splitTextToSize(dataMotivo, pageWidth - 2 * margin)
        dataLines.forEach((line: string) => {
          doc.text(line, margin, yPosition)
          yPosition += lineHeight + 1
        })

        // Adicionar espaço entre justificativas (exceto na última)
        if (index < justificativasValidas.length - 1) {
          yPosition += 3
        }
      })

      // Observações adicionais (se houver)
      if (observacoes.trim()) {
        yPosition += 8
        const observacoesLines = doc.splitTextToSize(observacoes.toUpperCase(), pageWidth - 2 * margin)
        observacoesLines.forEach((line: string) => {
          doc.text(line, margin, yPosition)
          yPosition += lineHeight + 1
        })
      }

      // Gerar nome do arquivo com base na primeira data
      const primeiraData =
        justificativasValidas.length > 0
          ? (() => {
              const [year, month, day] = justificativasValidas[0].data.split('-').map(Number)
              const dataLocal = new Date(year, month - 1, day)
              return dataLocal.toLocaleDateString("pt-BR").replace(/\//g, "-")
            })()
          : new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")

      const nomeArquivo = `justificativa_ponto_${primeiraData}.pdf`

      doc.save(nomeArquivo)
      alert("PDF gerado e baixado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Erro ao gerar PDF. Tente novamente.")
    }
  }

  const isFormValid = funcionariosSelecionados.length > 0 && justificativasItems.some((item) => item.tipo && item.data)

  const handleAbrirPrevia = () => {
    setShowPreview(true)
  }

  const handleConfirmarGeracao = () => {
    setShowPreview(false)
    handleGerarPDF()
  }

  return (
    <>
      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4"
        suppressHydrationWarning
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8">
            {/* Botão Dark Mode - Posicionado no topo direito */}
            <div className="flex justify-end mb-4">
              {mounted ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="bg-white/80 dark:bg-gray-700/80 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                  suppressHydrationWarning
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              ) : (
                <div className="w-8 h-8" />
              )}
            </div>

            {/* Título e Descrição - Centralizados */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">JustificaWeb</h1>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Gerador de Justificativas</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Automatize a criação de justificativas funcionais com praticidade e padronização
              </p>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Seleção de Funcionários */}
            <Card
              className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              suppressHydrationWarning
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Funcionários</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelecionarTodos}
                    className="text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                  >
                    {todosSelecionados ? "Desselecionar Todos" : "Selecionar Todos"}
                  </Button>
                </div>
                <CardDescription>Selecione um ou mais funcionários para a justificativa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {funcionarios.map((funcionario) => (
                  <div
                    key={funcionario.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Checkbox
                      id={funcionario.id}
                      checked={funcionariosSelecionados.includes(funcionario.id)}
                      onCheckedChange={(checked) => handleFuncionarioChange(funcionario.id, checked as boolean)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={funcionario.id} className="text-sm font-medium cursor-pointer flex-1">
                      {funcionario.nome}
                    </Label>
                  </div>
                ))}
                {funcionariosSelecionados.length > 0 && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      {funcionariosSelecionados.length} funcionário(s) selecionado(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detalhes das Justificativas */}
            <Card
              className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              suppressHydrationWarning
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-lg">Justificativas</CardTitle>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAdicionarJustificativa}
                    className="text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
                <CardDescription>Configure as justificativas a serem geradas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin">
                {justificativasItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-700/50 dark:border-gray-600 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Justificativa {index + 1}
                      </Label>
                      {justificativasItems.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoverJustificativa(item.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Tipo de Justificativa */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600 dark:text-gray-300">Tipo de Justificativa *</Label>
                      <Select
                        value={item.tipo}
                        onValueChange={(value) => handleJustificativaChange(item.id, "tipo", value)}
                      >
                        <SelectTrigger className="w-full text-left">
                          <SelectValue placeholder="Selecione uma justificativa" className="truncate" />
                        </SelectTrigger>
                        <SelectContent 
                          className="max-w-[calc(100vw-2rem)] sm:max-w-none min-w-[280px]"
                          position="popper"
                          side="bottom"
                          align="start"
                          sideOffset={4}
                        >
                          {justificativas.map((justificativa, idx) => (
                            <SelectItem key={idx} value={justificativa} className="whitespace-normal break-words">
                              {justificativa}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Data */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600 dark:text-gray-300">Data *</Label>
                      <div className="relative">
                        <Input
                          type="date"
                          value={item.data}
                          onChange={(e) => handleJustificativaChange(item.id, "data", e.target.value)}
                          className="w-full pl-10"
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          <Card className="mt-6 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Observações Adicionais
              </CardTitle>
              <CardDescription>Adicione informações complementares se necessário (opcional)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Digite aqui observações adicionais, detalhes específicos ou informações complementares..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Botão Gerar PDF */}
          <div className="text-center">
            <Button
              onClick={handleAbrirPrevia}
              disabled={!isFormValid}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="mr-2 h-5 w-5" />
              Gerar PDF
            </Button>

            {!isFormValid && (
              <p className="text-sm text-gray-500 mt-3">
                Preencha os funcionários e pelo menos uma justificativa completa
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>© 2025 JustificaWeb - Automatização de Justificativas Funcionais</p>
            <p className="mt-2 text-xs">
              Desenvolvido por{" "}
              <a href="https://www.linkedin.com/in/leonardo-camilotti-moreno-a59064276/" target="_blank" className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Leonardo Camilotti Moreno
              </a>
            </p>
          </div>
        </div>
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmarGeracao}
          funcionarios={funcionarios}
          funcionariosSelecionados={funcionariosSelecionados}
          justificativasItems={justificativasItems.filter((item) => item.tipo && item.data)}
          observacoes={observacoes}
        />
      </div>
    </>
  )
}