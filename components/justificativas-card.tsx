"use client"

import { ClipboardList, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import type { JustificativaItem } from "@/lib/types"

interface JustificativasCardProps {
  items: JustificativaItem[]
  justificativas: string[]
  onAdicionar: () => void
  onRemover: (id: string) => void
  onChange: (id: string, field: "tipo" | "data", value: string) => void
}

export function JustificativasCard({
  items,
  justificativas,
  onAdicionar,
  onRemover,
  onChange,
}: JustificativasCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-6" suppressHydrationWarning>
      <CardHeader className="pb-4 p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Justificativas</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdicionar}
            className="w-full sm:w-auto text-xs bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
          >
            <Plus className="h-3 w-3 mr-1" />
            Adicionar
          </Button>
        </div>
        <CardDescription>Configure as justificativas a serem geradas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-64 sm:max-h-80 overflow-y-auto pr-2 scrollbar-thin p-0 pt-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="p-3 sm:p-4 border rounded-lg bg-gray-50/50 dark:bg-gray-700/50 dark:border-gray-600 space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Justificativa {index + 1}
              </Label>
              {items.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemover(item.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-600 dark:text-gray-300">Tipo de Justificativa *</Label>
              <Select value={item.tipo} onValueChange={(value) => onChange(item.id, "tipo", value)}>
                <SelectTrigger className="w-full text-left">
                  <SelectValue placeholder="Selecione uma justificativa" className="truncate" />
                </SelectTrigger>
                <SelectContent
                  className="max-w-[calc(100vw-2rem)] sm:max-w-none min-w-[200px]"
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

            <div className="space-y-2">
              <Label className="text-xs text-gray-600 dark:text-gray-300">Data *</Label>
              <div className="relative">
                <Input
                  type="date"
                  value={item.data}
                  onChange={(e) => onChange(item.id, "data", e.target.value)}
                  className="w-full pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
