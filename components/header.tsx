"use client"

import { useState, useEffect } from "react"
import { FileText, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="mb-6 sm:mb-8">
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

      <div className="text-center px-2">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 dark:text-blue-400 shrink-0" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white break-words">
            JustificaWeb
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-medium">
          Gerador de Justificativas
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 px-2">
          Automatize a criação de justificativas funcionais com praticidade e padronização
        </p>
      </div>
    </div>
  )
}
