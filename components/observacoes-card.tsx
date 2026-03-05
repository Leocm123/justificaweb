"use client"

import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface ObservacoesCardProps {
  value: string
  onChange: (value: string) => void
}

export function ObservacoesCard({ value, onChange }: ObservacoesCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 sm:py-6">
      <CardHeader className="pb-4 p-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Observações Adicionais
        </CardTitle>
        <CardDescription>Adicione informações complementares se necessário (opcional)</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <Textarea
          placeholder="Digite aqui observações adicionais, detalhes específicos ou informações complementares..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[80px] sm:min-h-[100px] resize-none w-full"
        />
      </CardContent>
    </Card>
  )
}
