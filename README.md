# JustificaWeb 📄

Uma aplicação web intuitiva para geração automática de justificativas funcionais, voltada a equipes operacionais e administrativas.

🔗 **Acesse online**: [https://justificaweb.vercel.app](https://justificaweb.vercel.app)

> 🧠 Desenvolvido com auxílio da [V0 AI](https://v0.dev) da Vercel, para prototipação rápida de interfaces modernas utilizando shadcn/ui e Tailwind CSS.

## 🚀 Funcionalidades

- ✅ **Seleção múltipla de funcionários** - Escolha vários funcionários de uma vez
- ✅ **Justificativas pré-definidas** - Lista completa de motivos padronizados
- ✅ **Múltiplas justificativas** - Adicione várias justificativas em um único documento
- ✅ **Geração de PDF** - Documentos profissionais com formatação oficial
- ✅ **Preview antes de gerar** - Revise os dados antes da criação
- ✅ **Dark Mode** - Interface adaptável para melhor experiência
- ✅ **Design responsivo** - Funciona perfeitamente em desktop e mobile

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes de interface
- **jsPDF** - Geração de documentos em PDF
- **next-themes** - Alternância de temas (claro/escuro)
- **Lucide React** - Ícones

## 💡 Como usar

1. **Selecione os funcionários** que precisam de justificativa
2. **Escolha o tipo de justificativa** na lista pré-definida
3. **Defina a data** da ocorrência
4. **Adicione observações** se necessário (opcional)
5. **Visualize a prévia** dos dados
6. **Gere o PDF** formatado e padronizado

## 💻 Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação e execução local

#### Clone o repositório

```bash
git clone https://github.com/Leocm123/justificaweb.git
```

#### Entre na pasta

```bash
cd justificaweb
```

#### Instale as dependências

```bash
npm install
```

#### Execute o projeto

```bash
npm run dev
```

### Build para produção

```shellscript
npm run build
```

```shellscript
npm start
```

## 🌐 Deploy

O projeto está configurado para deploy automático na Vercel:

- Deploy automático via push na branch ´main´
- Preview automático para outras branches
- HTTPS e domínio personalizado inclusos


## 📋 Estrutura do projeto

```plaintext
justificaweb/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── theme-provider.tsx # Provider do tema
│   └── preview-modal.tsx  # Modal de preview
├── public/               # Arquivos estáticos
│   └── images/          # Imagens oficiais
└── lib/                 # Utilitários
    └── utils.ts         # Funções auxiliares
```

## 🎨 Características do PDF gerado

- **Cabeçalho oficial** com brasão e logo da prefeitura
- **Formatação padronizada** conforme modelo oficial
- **Checkboxes** para marcação de horários
- **Seção de nomes** dos funcionários selecionados
- **Data e motivo** detalhados para cada justificativa
- **Observações adicionais** quando necessário


## 📄 Licença

Este projeto foi desenvolvido para uso interno da Prefeitura Municipal de Nova Esperança - PR.

## 👨‍💻 Desenvolvedor

Leonardo C. Moreno
Desenvolvido com auxílio da V0 AI, com o objetivo de automatizar e padronizar o processo de justificativas funcionais.

---

© 2025 JustificaWeb - Automatização de Justificativas Funcionais
