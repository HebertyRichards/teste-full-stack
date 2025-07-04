# Teste Full Stack - Autenticação e Gerenciador de Tarefas

![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## 🚀 Link de Produção

Acesse a aplicação em funcionamento no seguinte link:

**[https://teste-full-stack-blond.vercel.app](https://teste-full-stack-blond.vercel.app)**

## 📄 Sobre o Projeto

Este é um projeto full-stack desenvolvido para demonstrar um sistema de autenticação de usuários completo e moderno, integrado a um gerenciador de tarefas (To-Do list). A aplicação conta com um frontend interativo e responsivo e um backend robusto que gerencia toda a lógica de negócio.

O principal objetivo é apresentar a implementação de autenticação via **JWT (Access Token)** e **Refresh Token**, garantindo uma experiência de usuário segura, e um sistema de gerenciamento de tarefas (CRUD) onde cada usuário tem controle total sobre suas próprias atividades.

## ✨ Funcionalidades

-   **Autenticação de Usuário**: Sistema de login e criação de conta.
-   **Gerenciamento de Sessão com JWT**:
    -   **Access Token**: Garante o acesso do usuário às rotas protegidas por **1 hora**.
    -   **Refresh Token**: Caso o usuário marque a opção "Manter Sessão", um refresh token é gerado com validade de **30 dias**, permitindo a renovação automática do access token sem a necessidade de um novo login.
-   **Gerenciamento de Tarefas (CRUD)**:
    -   **Tarefas por Usuário**: Cada usuário tem acesso apenas às suas próprias tarefas.
    -   **Criar, Editar e Excluir**: Implementação completa das operações de CRUD para as tarefas.
    -   **Status das Tarefas**: As tarefas podem ser organizadas em três status: "A Fazer", "Em Andamento" e "Concluída".
-   **Interface Responsiva**: O layout se adapta a diferentes tamanhos de tela, de desktops a dispositivos móveis, utilizando Tailwind CSS e Shadcn/ui.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: frontend e backend.

### **Frontend**

-   **[Next.js](https://nextjs.org/)**: Framework React para renderização no lado do servidor e geração de sites estáticos.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS utility-first para estilização rápida e customizável.
-   **[Shadcn/ui](https://ui.shadcn.com/)**: Coleção de componentes de UI reutilizáveis.

### **Backend**

-   **[Node.js](https://nodejs.org/)**: Ambiente de execução JavaScript no lado do servidor.
-   **[Express](https://expressjs.com/)**: Framework para Node.js, utilizado para criar a API REST.
-   **[TypeScript](https://www.typescriptlang.org/)**: Para um desenvolvimento mais robusto e seguro no backend.
-   **[Supabase](https://supabase.io/)**: Utilizado como banco de dados PostgreSQL e para gerenciamento de usuários.

## ⚙️ Como Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento.


### **1. Clonar o Repositório**

```bash
git clone [https://github.com/HebertyRichards/teste-full-stack.git](https://github.com/HebertyRichards/teste-full-stack.git)
cd teste-full-stack
```

### **2. Configurar Variáveis de Ambiente**
Antes de instalar as dependências, é crucial configurar as variáveis de ambiente.

### **Backend**

Navegue até a pasta backend.
Crie um arquivo chamado .env na raiz da pasta backend.
Copie e cole o conteúdo abaixo no arquivo .env, preenchendo com suas próprias chaves.

```bash
# URL do seu projeto no Supabase
SUPABASE_URL=SUA_URL_DO_SUPABASE

# Chave anônima (publica) do seu projeto no Supabase
SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE

# Segredo para gerar o JWT. Pode ser qualquer string segura.
JWT_SECRET="segredo_super_secreto_para_jwt" -> pode ser de sua escolha
JWT_EXPIRATION="1h"

# Segredo para gerar o Refresh Token. Deve ser diferente do JWT_SECRET.
REFRESH_TOKEN_SECRET="outro_segredo_ainda_mais_secreto_para_refresh" -> pode ser de sua escolha
REFRESH_TOKEN_EXPIRATION="30d"
```

### **Frontend**

  Navegue até a pasta frontend.
  Crie um arquivo chamado .env.local na raiz da pasta frontend.
  Adicione a seguinte variável:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### **3. Instalar Dependências e Executar**

Abra dois terminais, um para o backend e outro para o frontend.

### **Backend**

```bash
# Navegue para a pasta do backend (se não estiver nela)
cd backend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npx ts-node src/index.ts
```

### **Frontend**
```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

