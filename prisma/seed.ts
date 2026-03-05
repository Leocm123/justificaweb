import { config } from "dotenv"
// Carrega .env.local primeiro (usado após vercel env pull) e depois .env
config({ path: ".env.local" })
config()
import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const funcionariosData = [
  { slug: "aline", nome: "Aline Morais" },
  { slug: "claudia", nome: "Claudia de Freitas Barbosa" },
  { slug: "dayana", nome: "Dayana Aparecida dos Santos Camargo" },
  { slug: "dyoni", nome: "Dyoni Galani" },
  { slug: "fernando", nome: "Fernando Faquinetti Amorim" },
  { slug: "greicieli", nome: "Greicieli Nascimento dos Santos" },
  { slug: "iara", nome: "Iara Gonçalves Pereira" },
  { slug: "janaina", nome: "Janaina Prieto de Assis" },
  { slug: "jean", nome: "Jean Sales Prado" },
  { slug: "joao", nome: "João Trindade de Oliveira" },
  { slug: "juliana", nome: "Juliana Gazola Fernandes" },
  { slug: "julio", nome: "Julio Edson Fronza" },
  { slug: "leila", nome: "Leila Cassia de Sousa Lemos" },
  { slug: "leonardo", nome: "Leonardo Camilotti Moreno" },
  { slug: "luiz", nome: "Luiz Bernardo da Silva" },
  { slug: "matheus", nome: "Matheus de Oliveira Santos" },
  { slug: "natalia", nome: "Natalia Diniz de Lima Scarabelli" },
]

const justificativasData = [
  "TRABALHO EM HORÁRIO DIRETO DEVIDO LOCALIDADE DISTANTE SEM TRANSPORTE",
  "TRABALHO EM HORÁRIO DIRETO PARA RECUPERAR IMÓVEIS DURANTE O PERÍODO DO ALMOÇO",
  "TRABALHO EM HORÁRIO DIRETO DEVIDO A VISITA DOMICILIAR EM ÁREA RURAL DISTANTE",
  "TRABALHO EM HORÁRIO DIRETO DEVIDO AO MUTIRÃO DE LIMPEZA",
  "NÃO HOUVE REGISTRO DE BIOMETRIA",
  "ESQUECEU DE REGISTRAR BIOMETRIA",
  "FOLGA PERÍODO INTEGRAL",
  "FOLGA MEIO PERÍODO",
  "TRABALHO EM HORÁRIO DIRETO - RECOLHIMENTO DE ARMADILHAS OVITRAMPAS",
  "TRABALHO EM HORÁRIO DIRETO - DELIMITAÇÃO DE FOCO NOS QUARTEIRÕES POSITIVOS (DF)",
  "TRABALHO EM HORÁRIO DIRETO - PONTO ESTRATÉGICO (PE)",
  "TRABALHO EM HORÁRIO DIRETO - LEVANTAMENTO DE ÍNDICE (LIRAA)",
]

async function main() {
  const countFuncionarios = await prisma.funcionario.count()
  const countJustificativas = await prisma.justificativa.count()
  const countAdmin = await prisma.admin.count()

  if (countFuncionarios === 0) {
    for (let i = 0; i < funcionariosData.length; i++) {
      await prisma.funcionario.create({
        data: { ...funcionariosData[i], ordem: i },
      })
    }
    console.log(`✓ ${funcionariosData.length} funcionários criados`)
  } else {
    console.log("Funcionários já existem, pulando...")
  }

  if (countJustificativas === 0) {
    for (let i = 0; i < justificativasData.length; i++) {
      await prisma.justificativa.create({
        data: { texto: justificativasData[i], ordem: i },
      })
    }
    console.log(`✓ ${justificativasData.length} justificativas criadas`)
  } else {
    console.log("Justificativas já existem, pulando...")
  }

  if (countAdmin === 0) {
    const email = process.env.ADMIN_EMAIL ?? "admin@justificaweb.local"
    const password = process.env.ADMIN_PASSWORD ?? "admin123"
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.admin.create({
      data: { email, password: hashedPassword },
    })
    console.log(`✓ Admin criado: ${email}`)
  } else {
    console.log("Admin já existe, pulando...")
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
