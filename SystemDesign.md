# System Design - Ohana Clean (Shadcn & Tailwind Optimized)

Este documento descreve o **System Design (Design System)** do Ohana Clean. As melhores práticas de estruturação do **Shadcn UI** e **Tailwind CSS**. Este documento serve como blueprint arquitetural para garantir consistência visual, hierarquia de informações e integração perfeita com a biblioteca de componentes.

---

## 1. Variáveis de Tema (Shadcn UI CSS Variables)

Para garantir compatibilidade total com o Shadcn UI e facilitar a construção das telas, a paleta "Ohana Clean" foi mapeada para variáveis HSL no formato do arquivo `globals.css`. Isso permite uso imediato de componentes pré-fabricados com o nosso visual de marca.

```css
@layer base {
  :root {
    /* Cores de Fundo (Backgrounds) */
    --background: 231 100% 98%; /* #F8F9FF - Background Principal */
    --foreground: 222 47% 11%;  /* #1E293B (slate-800) - Textos Principais */

    /* Cards e Modais */
    --card: 0 0% 100%;          /* #FFFFFF */
    --card-foreground: 222 47% 11%;

    /* Popovers e Dropdowns */
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* Cores da Marca (Brand Colors) */
    /* Primary: Azul Safira (#2D4FCC) */
    --primary: 227 64% 48%;
    --primary-foreground: 0 0% 100%;
    
    /* Secondary: Roxo Profundo (#6D28D9) */
    --secondary: 264 69% 50%;
    --secondary-foreground: 0 0% 100%;

    /* Tons Neutros e Secundários (Muted) */
    /* Primary Light (#EEF1FF) */
    --muted: 229 100% 96%;
    --muted-foreground: 215 16% 47%; /* slate-500 */

    /* Acentos e Hover */
    /* Primary Hover (#F5F6FF) */
    --accent: 236 100% 98%;
    --accent-foreground: 222 47% 11%;

    /* Status e Feedback */
    --destructive: 0 84% 60%; /* Red 500 */
    --destructive-foreground: 0 0% 100%;
    --success: 160 84% 39%; /* Emerald 500 */
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%; /* Amber 500 */
    --warning-foreground: 0 0% 100%;

    /* Bordas e Inputs */
    --border: 214 32% 91%; /* slate-200 */
    --input: 214 32% 91%;
    --ring: 227 64% 48%; /* Primary ring */

    /* Raios de Borda (Border Radius) */
    --radius: 0.75rem; /* rounded-xl base */
  }

  .dark {
    /* Cores de Fundo (Backgrounds) - Navy Escuro Corporativo */
    --background: 233 67% 10%; /* #080B26 */
    --foreground: 231 100% 98%; /* #F8F9FF */

    /* Cards e Modais */
    --card: 234 62% 16%; /* #0B1037 */
    --card-foreground: 231 100% 98%;

    /* Popovers e Dropdowns */
    --popover: 234 62% 16%;
    --popover-foreground: 231 100% 98%;

    /* Cores da Marca (Brand Colors) */
    --primary: 227 64% 58%; /* Azul Safira mais claro para contraste */
    --primary-foreground: 0 0% 100%;
    
    --secondary: 264 69% 60%; /* Roxo mais claro para contraste */
    --secondary-foreground: 0 0% 100%;

    /* Tons Neutros e Secundários (Muted) */
    --muted: 226 58% 16%; /* slate-900 */
    --muted-foreground: 215 20% 65%; /* slate-400 */

    /* Acentos e Hover */
    --accent: 234 69% 30%; /* Azul mais profundo para hover */
    --accent-foreground: 231 100% 98%;

    /* Status e Feedback */
    --destructive: 0 62% 40%;
    --destructive-foreground: 0 0% 100%;
    --success: 160 84% 39%;
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;

    /* Bordas e Inputs */
    --border: 215 25% 27%; /* slate-700 */
    --input: 215 25% 27%;
    --ring: 227 64% 58%;
  }
}
```

## 2. Tipografia (Typography)

A tipografia foca em legibilidade, utilizando tracking e tamanhos variados para criar hierarquia visual. Utilizar fontes corporativas/limpas como *Inter*, *Outfit* ou *Roboto*.

- **Títulos de Modal/Página (h1/h2):** `text-2xl font-bold tracking-tight text-slate-800` (ou branco se no header do modal).
- **Subtítulos (h3/h4):** `text-sm font-semibold text-slate-800`.
- **Corpo/Texto Padrão (p):** `text-sm text-slate-600`.
- **Labels de Formulário (`<Label>`):** `text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5`.
- **Micro-labels/Overlines:** `text-[10px] font-black uppercase tracking-widest text-primary`.
- **Valores/Números (KPIs):** `font-bold font-numeric text-[#1A2060]`.

## 3. Sombras e Bordas (Glassmorphism & Depth)

A interface usa sombras suaves em tons de azul para passar a sensação de leveza corporativa ("glassmorphism" sutil) e limpeza profunda. Recomenda-se estender o `tailwind.config.ts`.

- **Sombra Padrão (Cards/Painéis):** Customizada `shadow-[0_2px_12px_rgba(45,79,204,0.06)]` (Adicionar `shadow-card` no tailwind.config).
- **Sombra Botão Primário:** `shadow-[0_4px_14px_rgba(45,79,204,0.3)]` (Hover clareia ou eleva).
- **Sombra Modais:** `shadow-[0_32px_80px_-16px_rgba(11,16,55,0.35),0_0_0_1px_rgba(11,16,55,0.08)]`.
- **Border Radius Padrões:**
  - `rounded-lg` (8px): Badges, Selects pequenos.
  - `rounded-xl` (12px): Inputs, Botões (Padrão Shadcn usando `--radius`).
  - `rounded-2xl` (16px): Cards principais e Paineis internos.
  - `rounded-[32px]`: Modais grandes/Modais de Sucesso.

## 4. Componentes UI (Integração Shadcn UI)

Ao criar componentes usando Shadcn (`npx shadcn-ui@latest add <componente>`), aplicar e estender os seguintes padrões:

### Botões (`<Button />`)
- **Default (Primary):** Fundo `bg-primary`, texto `text-primary-foreground`, `rounded-xl`, sombra azul customizada.
- **Secondary / Outline:** Borda `border-border`, texto `text-slate-600`, fundo transparente com `hover:bg-accent`.
- **Ghost (Ícones de Ação em Tabelas):** Usado para editar/deletar (`p-1.5`, `text-slate-400`). Hover altera para a respectiva cor de intenção (`hover:text-red-600 hover:bg-red-50` para apagar).

### Formulários (`<Input />`, `<Select />`)
- Substituir as strings CSS complexas pelas variantes nativas ajustadas. O input tem `bg-card border-border rounded-xl text-sm placeholder:text-muted-foreground`.
- **Foco:** Utilizar a acessibilidade do Shadcn: `focus-visible:ring-2 focus-visible:ring-ring`.
- **Feedback Visual:** O asterisco de preenchimento obrigatório deve ser colorido com `text-primary`.

### Tabelas (`<Table />`)
- **Cabeçalho (`<TableHeader>`):** Fundo padronizado `bg-[#F0F2FF]`, texto `text-[#3B4280]`, uppercase via `text-xs tracking-wider`.
- **Linhas (`<TableRow>`):** Alternância estilo zebra (`even:bg-[#FAFBFF] odd:bg-white`). Hover aciona o `bg-accent`. Bordas em `border-b border-[#EEF1FF]`.
- **Ações:** Implementar overlay absoluto em hover usando as classes utilitárias `group/row` e backdrop blur (`bg-white/95 backdrop-blur`).

### Badges e Tags (`<Badge />`)
- Estrutura base de Shadcn mantida, apenas ajustando as cores em `badge.tsx`.
- **Informativo:** `bg-[#EEF1FF] text-[#2D4FCC]`.
- **Destaque:** `bg-[#F3EEFF] text-[#6D28D9]`.
- **Padrões/Neutros:** `bg-[#F0F2FF] text-[#3B4280]`.

## 5. Modais e Modais Dinâmicos (`<Dialog />` e `<Sheet />`)

- **Dialog Overlay (`<DialogOverlay>`):** Escurecimento corporativo `bg-[#0B1037]/65` com `backdrop-blur-sm`.
- **Dialog Content:** Fundo geral `bg-background` (`#F8F9FF`) englobando o body.
- **Header:** Degradê corporativo no componente header: `bg-gradient-to-br from-[#0B1037] to-[#131952]` com texto em branco e botões de controle discretos.
- **Sessões Internas:** Formulários divididos por blocos (usar componente `<Card>`) de fundo branco `bg-card rounded-2xl p-5`, com a sombra padrão e micro-labels de seção.

## 6. Animações e Transições (tailwindcss-animate)

Com o uso do Shadcn, recebemos gratuitamente o plugin `tailwindcss-animate`. O Design System Ohana Clean foca em macro e micro-interações:
- Utilização sistemática de `transition-all duration-200` em hovers.
- Aparição de modais usando `animate-in fade-in zoom-in-95`.
- Menus e Popovers descem via `slide-in-from-top-2`.
- Modais de confirmação de status (Sucesso) contam com animações de `animate-pulse` sutil em ícones para proporcionar clareza sobre o fluxo da tarefa (Feedback do Sistema).

---

> **⚠️ Guia para a IA e Desenvolvedores:** Durante o desenvolvimento das telas, evite refazer componentes do zero. Utilize os primitivos do Shadcn UI mapeados neste documento e limite a sobreposição de classes do Tailwind àquelas descritas aqui para manter a pureza e a padronização do Sistema Ohana Clean.
