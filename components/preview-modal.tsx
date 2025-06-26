"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Calendar, Users, MessageSquare } from 'lucide-react'

interface JustificativaItem {
  id: string
  tipo: string
  data: string
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  funcionarios: Array<{ id: string; nome: string }>
  funcionariosSelecionados: string[]
  justificativasItems: JustificativaItem[]
  observacoes: string
}

export function PreviewModal({
  isOpen,
  onClose,
  onConfirm,
  funcionarios,
  funcionariosSelecionados,
  justificativasItems,
  observacoes,
}: PreviewModalProps) {
  const funcionariosSelecionadosNomes = funcionarios
    .filter((f) => funcionariosSelecionados.includes(f.id))
    .map((f) => f.nome)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 dark:text-white">
            <FileText className="h-5 w-5" />
            Prévia da Justificativa
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">Revise os dados antes de gerar o PDF</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Funcionários */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="font-medium text-sm text-gray-700 dark:text-white">
                Funcionário(s) Selecionado(s) ({funcionariosSelecionadosNomes.length})
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {funcionariosSelecionadosNomes.map((nome, index) => (
                <Badge key={index} variant="secondary" className="text-sm dark:bg-gray-600 dark:text-gray-200">
                  {nome}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Justificativas */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-blue-600" />
              <p className="font-medium text-sm text-gray-700 dark:text-white">
                Justificativas ({justificativasItems.length})
              </p>
            </div>
            <div className="space-y-4">
              {justificativasItems.map((item, index) => {
                const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR")
                return (
                  <div key={item.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      <p className="font-medium text-sm text-gray-700 dark:text-white">Justificativa {index + 1}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{dataFormatada}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.tipo}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Observações */}
          {observacoes.trim() && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <p className="font-medium text-sm text-gray-700 dark:text-white">Observações Adicionais</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm dark:text-gray-300 leading-relaxed">{observacoes}</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-blue-600 hover:bg-blue-700">
            Confirmar e Gerar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}