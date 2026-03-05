import jsPDF from "jspdf"
import type { Funcionario } from "./types"
import type { JustificativaItem } from "./types"

const IMAGE_URLS = {
  brasao: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3eZmDxiptsuE17CBJdVFP1NhFXbUuV.png",
  cabecalho: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oz6F6GzwTxlKmwhGoCJzWzmpyfBrC3.png",
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function formatarDataBR(dataISO: string): string {
  const [year, month, day] = dataISO.split("-").map(Number)
  const dataLocal = new Date(year, month - 1, day)
  return dataLocal.toLocaleDateString("pt-BR")
}

function obterNomeArquivo(justificativasValidas: JustificativaItem[]): string {
  const primeiraData =
    justificativasValidas.length > 0
      ? formatarDataBR(justificativasValidas[0].data).replace(/\//g, "-")
      : new Date().toLocaleDateString("pt-BR").replace(/\//g, "-")
  return `justificativa_ponto_${primeiraData}.pdf`
}

export async function gerarPDF(
  funcionarios: Funcionario[],
  funcionariosSelecionados: string[],
  justificativasItems: JustificativaItem[],
  observacoes: string
): Promise<void> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  const lineHeight = 6
  let yPosition = 20

  // Carregar e adicionar imagens do cabeçalho
  try {
    const [brasaoImg, cabecalhoImg] = await Promise.all([
      loadImage(IMAGE_URLS.brasao),
      loadImage(IMAGE_URLS.cabecalho),
    ])

    doc.addImage(brasaoImg, "PNG", margin, yPosition, 25, 30)
    doc.addImage(cabecalhoImg, "PNG", pageWidth - margin - 120, yPosition, 120, 30)
    yPosition += 40
  } catch {
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
  const nomes = funcionarios
    .filter((f) => funcionariosSelecionados.includes(f.id))
    .map((f) => f.nome.toUpperCase())

  nomes.forEach((nome) => {
    doc.text(nome, margin, yPosition)
    yPosition += lineHeight
  })

  yPosition += 10
  doc.setFontSize(11)
  doc.text("Assinalar o campo que não houve registro de ponto e preencher o horário cumprido.", margin, yPosition)
  yPosition += 10

  // Checkboxes de horários
  doc.setFontSize(10)
  const middleX = pageWidth / 2 + 10
  doc.text("( ) entrada da manhã  07h:30min.", margin, yPosition + 3)
  doc.text("( ) saída da manhã  11h:30min.", middleX, yPosition + 3)
  yPosition += 12
  doc.text("( ) entrada da tarde  13h:00min.", margin, yPosition + 3)
  doc.text("( ) saída da tarde 17h:00min.", middleX, yPosition + 3)

  // Seção DATA/MOTIVO
  yPosition += 20
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("DATA/MOTIVO:", margin, yPosition)
  yPosition += 10
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")

  const justificativasValidas = justificativasItems.filter((item) => item.tipo && item.data)

  justificativasValidas.forEach((item, index) => {
    const dataFormatada = formatarDataBR(item.data)
    const dataMotivo = `${dataFormatada} – ${item.tipo.toUpperCase()}`
    const dataLines = doc.splitTextToSize(dataMotivo, pageWidth - 2 * margin)
    dataLines.forEach((line: string) => {
      doc.text(line, margin, yPosition)
      yPosition += lineHeight + 1
    })
    if (index < justificativasValidas.length - 1) yPosition += 3
  })

  // Observações
  if (observacoes.trim()) {
    yPosition += 8
    const observacoesLines = doc.splitTextToSize(observacoes.toUpperCase(), pageWidth - 2 * margin)
    observacoesLines.forEach((line: string) => {
      doc.text(line, margin, yPosition)
      yPosition += lineHeight + 1
    })
  }

  doc.save(obterNomeArquivo(justificativasValidas))
}
