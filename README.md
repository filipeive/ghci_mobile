# GHCi Mobile 📱

> **Ambiente interactivo de programação Haskell baseado na Web para dispositivos móveis**

Uma Progressive Web App (PWA) que oferece um ambiente completo de desenvolvimento Haskell directamente no navegador, eliminando a necessidade de instalação local do GHC/GHCi. Desenvolvido especificamente para apoiar o ensino e aprendizagem da cadeira de Programação Funcional no ensino superior.

---

## 🎯 Motivação

Em muitas universidades africanas, especialmente em Moçambique, os estudantes de Informática enfrentam barreiras significativas para praticar programação funcional:

- **Falta de computadores pessoais** com capacidade para executar compiladores Haskell
- **Laboratórios limitados** a poucas horas por semana
- **Complexidade da instalação** do GHC em máquinas com recursos limitados
- **Dispositivo mais comum** entre estudantes: o smartphone

O **GHCi Mobile** resolve estes problemas ao disponibilizar um ambiente Haskell completo acessível via navegador móvel, sem necessidade de instalação.

---

## ✨ Funcionalidades

### Editor de Código Profissional
- **CodeMirror 5** com realce de sintaxe Haskell nativo
- **Autocompletar inteligente** com sugestões categorizadas (palavras-chave, tipos, funções da Prelude e variáveis do utilizador)
- **Números de linha** perfeitamente alinhados
- **Pesquisa integrada** (Ctrl+F ou botão de lupa)
- **Quebra automática de linha** para ecrãs pequenos (modo retrato)
- **Persistência automática** via localStorage (código nunca se perde)

### Terminal Interactivo (REPL)
- Execução de expressões Haskell em tempo real via prompt `ghci>`
- Carregamento automático de módulos (`:load`)
- Detecção inteligente da função `main`
- Feedback visual com cores (sucesso, erro, info)

### Segurança
- **Rate limiting**: 60 requisições por minuto por IP
- **Timeout**: 15 segundos por execução
- **Sandbox**: bloqueio de módulos perigosos (`System.Process`, `System.IO.Unsafe`, etc.)
- **Isolamento**: cada execução ocorre num ficheiro temporário descartável

### Progressive Web App (PWA)
- Instalável como aplicação nativa no smartphone
- Funcionalidade offline (Service Worker)
- Design responsivo optimizado para mobile e desktop

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────┐
│              Cliente (Browser)               │
│  ┌─────────────────────────────────────┐    │
│  │     CodeMirror 5 (Editor Haskell)   │    │
│  ├─────────────────────────────────────┤    │
│  │     Terminal REPL (ghci>)           │    │
│  ├─────────────────────────────────────┤    │
│  │     Service Worker (Cache PWA)      │    │
│  └──────────────┬──────────────────────┘    │
└─────────────────┼───────────────────────────┘
                  │ HTTP POST /api/run
                  ▼
┌─────────────────────────────────────────────┐
│           Servidor (Oracle Cloud)            │
│  ┌─────────────────────────────────────┐    │
│  │  Nginx (Proxy Reverso + Static)     │    │
│  ├─────────────────────────────────────┤    │
│  │  Node.js / Express (server.js)      │    │
│  │  ├── Validação de segurança         │    │
│  │  ├── Escrita de ficheiro .hs        │    │
│  │  └── Execução do GHCi (subprocess)  │    │
│  ├─────────────────────────────────────┤    │
│  │  GHC 9.x (Compilador Haskell)      │    │
│  └─────────────────────────────────────┘    │
│  Gerido por: PM2 (Process Manager)          │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologia |
|---|---|
| **Frontend** | HTML5, CSS3 (Vanilla), JavaScript ES6+ |
| **Editor** | CodeMirror 5.65.18 |
| **Ícones** | Ionicons 7.1 |
| **Fontes** | JetBrains Mono, Inter (Google Fonts) |
| **Backend** | Node.js 18+, Express.js |
| **Compilador** | GHC 9.x (Glasgow Haskell Compiler) |
| **Servidor** | Oracle Cloud (Ubuntu), Nginx, PM2 |
| **PWA** | Service Worker, Web App Manifest |

---

## 📦 Instalação e Deployment

### Pré-requisitos
- Node.js 18+
- GHC (Glasgow Haskell Compiler)
- Nginx (para produção)
- PM2 (para gestão de processos)

### Instalação Local
```bash
git clone https://github.com/filipeive/ghci_mobile.git
cd ghci_mobile
npm install
node server.js
```
O servidor inicia em `http://localhost:3000`

### Deployment em Produção
```bash
# No servidor Ubuntu
pm2 start server.js --name ghci-mobile
pm2 save
pm2 startup
```

Configuração Nginx:
```nginx
location /ghci_mobile {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    alias /var/www/html/ghci_mobile/public;
    index index.html;
    try_files $uri $uri/ =404;
}

location /api/run {
    proxy_pass http://localhost:3000/api/run;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

---

## 📁 Estrutura do Projecto

```
ghci-pwa/
├── server.js              # Backend Node.js/Express
├── package.json           # Dependências do projecto
├── public/                # Ficheiros estáticos (frontend)
│   ├── index.html         # Interface principal (HTML + CSS)
│   ├── app.js             # Lógica do editor e terminal
│   ├── sw.js              # Service Worker (PWA)
│   ├── manifest.json      # Manifesto PWA
│   └── favicon.svg        # Ícone da aplicação
├── temp/                  # Ficheiros .hs temporários (auto-limpos)
├── docs/                  # Documentação académica
│   └── artigo_cientifico.md
└── README.md              # Este ficheiro
```

---

## 👨‍🏫 Contexto Académico

Este projecto foi desenvolvido no contexto do ensino da cadeira de **Programação Funcional** no curso de Licenciatura em Informática, 1.º ano, na **Universidade Licungo**, Moçambique.

### Problema Identificado
A maioria dos estudantes não dispõe de computadores portáteis pessoais com capacidade para instalar o GHC, mas **possui smartphones** com acesso à internet. Os laboratórios da universidade são partilhados e têm disponibilidade limitada.

### Solução Proposta
Uma aplicação web progressiva que disponibiliza um ambiente de programação Haskell completo, acessível via navegador do smartphone, eliminando a barreira de instalação e permitindo que os estudantes pratiquem em qualquer lugar e a qualquer hora.

---

## 📄 Licença

Este projecto é de código aberto, desenvolvido para fins educacionais.

## 👤 Autor

**Filipe Domingos dos Santos**
Docente — Universidade Licungo, Moçambique
Curso de Licenciatura em Informática — Programação Funcional

---

> *"A tecnologia é mais poderosa quando democratiza o acesso ao conhecimento."*
