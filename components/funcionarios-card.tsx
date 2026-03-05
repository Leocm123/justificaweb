"use client"

import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Funcionario } from "@/lib/types"

interface FuncionariosCardProps {
  funcionarios: Funcionario[]
  selecionados: string[]
  onToggle: (id: string, checked: boolean) => void
  onSelecionarTodos: () => void
}

export function FuncionariosCard({
  funcionarios,
  selecionados,
  onToggle,
  onSelecionarTodos,
}: FuncionariosCardProps) {
  const todosSelecionados = selecionados.length === funcionarios.length

  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-6" suppressHydrationWarning>
      <CardHeader className="pb-4 p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 shrink-0" />
            <CardTitle className="text-base sm:text-lg">Funcionários</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelecionarTodos}
            className="w-full sm:w-auto text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
          >
            {todosSelecionados ? "Desselecionar Todos" : "Selecionar Todos"}
          </Button>
        </div>
        <CardDescription>Selecione um ou mais funcionários para a justificativa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto pr-2 scrollbar-thin p-0 pt-4">
        {funcionarios.map((funcionario) => (
          <div
            key={funcionario.id}
            className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors min-h-[44px]"
          >
            <Checkbox
              id={funcionario.id}
              checked={selecionados.includes(funcionario.id)}
              onCheckedChange={(checked) => onToggle(funcionario.id, checked as boolean)}
              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
            />
            <Label htmlFor={funcionario.id} className="text-sm font-medium cursor-pointer flex-1 min-w-0 break-words">
              {funcionario.nome}
            </Label>
          </div>
        ))}
        {selecionados.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {selecionados.length} funcionário(s) selecionado(s)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
