<div align="center">

  <img src="assets/images/profile-owner.png" width="140">

  <h1>Shadow-WBase</h1>

  <p>Base para desenvolvimento de bots WhatsApp utilizando a biblioteca @rexxhayanasi/elaina-baileys</p>

  ![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)
  ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
  ![Status](https://img.shields.io/badge/Status-Active-success)
  ![Version](https://img.shields.io/badge/Version-1.5.5-blue)
  ![Platform](https://img.shields.io/badge/Platform-WhatsApp-blue)
  ![Type](https://img.shields.io/badge/Type-Bot%20Base-purple)
  ![License](https://img.shields.io/badge/License-MIT-yellow)
  ![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen)

</div>

---

## Sobre o Projeto

Shadow-WBase é uma base desenvolvida para criação de bots WhatsApp utilizando a biblioteca **@rexxhayanasi/elaina-baileys**.

O projeto foi estruturado para facilitar a implementação de sistemas, comandos, integrações e recursos personalizados, mantendo uma organização modular, simples e escalável para novos desenvolvimentos.

---

## Recursos

- Estrutura modular e organizada.
- Sistema de plugins.
- Gerenciamento de comandos.
- Separação de plugins por categorias.
- Middlewares para processamento de mensagens.
- Gerenciamento de conexão.
- Fácil manutenção e expansão.
- Compatível com @rexxhayanasi/elaina-baileys.
- Funções auxiliares para manipulação de mensagens.
- Serviço de download do YouTube.
- Configuração simplificada.

---

## Requisitos

- Node.js 20 ou superior.
- NPM.
- Conta WhatsApp ativa.
- Conexão com a internet.

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/BkzModz/shadow-wbase.git
```

Acesse a pasta do projeto:

```bash
cd Shadow-WBase
```

Instale as dependências:

```bash
npm install
```

---

## Inicialização

Inicie o bot utilizando:

```bash
npm start
```

Ou diretamente pelo Node.js:

```bash
node index.js
```

---

## Estrutura do Projeto

```text
Shadow-WBase/
├── assets/
│   └── images/
│       ├── menu.jpg
│       ├── profile-bot.png
│       ├── profile-default.jpg
│       └── profile-owner.png
│
├── handler/
│   ├── createContext.js
│   ├── createMsg.js
│   ├── handlerMessage.js
│   └── resolvePlugin.js
│
├── plugins/
│   ├── owner/
│   │   └── msg.js
│   ├── private/
│   │   └── clear.js
│   ├── public/
│   │   ├── menu.js
│   │   └── play.js
│   └── utilities/
│       ├── mek.js
│       └── ping.js
│
├── src/
│   ├── bot/
│   │   ├── connection.js
│   │   ├── createMsgHandler.js
│   │   ├── createSocket.js
│   │   ├── pluginLoader.js
│   │   ├── pluginManager.js
│   │   └── startBot.js
│   │
│   ├── middlewares/
│   │   ├── checkCooldown.js
│   │   ├── getGroup.js
│   │   ├── getJids.js
│   │   └── parseText.js
│   │
│   ├── services/
│   │   └── youtubeDownloader.js
│   │
│   └── utils/
│       ├── authStore.js
│       ├── decryptEditMessage.js
│       ├── findSuggestions.js
│       ├── getQuotedMessage.js
│       ├── logger.js
│       ├── media-type.js
│       ├── media-utils.js
│       ├── message-utils.js
│       └── resolveMessage.js
│
├── .npmrc
├── config.js
├── index.js
└── package.json
```

---

## Diretórios

| Diretório         | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| assets/images     | Imagens e arquivos visuais do projeto          |
| handler           | Gerenciamento de contexto, mensagens e plugins |
| plugins           | Comandos e módulos separados por categorias    |
| plugins/owner     | Comandos exclusivos do proprietário            |
| plugins/private   | Comandos para utilização privada               |
| plugins/public    | Comandos disponíveis publicamente              |
| plugins/utilities | Comandos utilitários                           |
| src/bot           | Inicialização, conexão e gerenciamento do bot  |
| src/middlewares   | Middlewares para processamento de mensagens    |
| src/services      | Serviços e integrações externas                |
| src/utils         | Funções auxiliares e utilitários internos      |

---

## Arquivos Principais

| Arquivo      | Descrição                         |
| ------------ | --------------------------------- |
| index.js     | Ponto de entrada principal do bot |
| config.js    | Configurações gerais do projeto   |
| package.json | Dependências e scripts do projeto |
| .npmrc       | Configurações do gerenciador NPM  |

---

## Sistema de Plugins

O Shadow-WBase possui um sistema modular de plugins, permitindo adicionar, remover e organizar comandos de maneira independente.

Os plugins são separados em categorias:

- **Owner:** comandos exclusivos para o proprietário.
- **Private:** comandos destinados à utilização privada.
- **Public:** comandos disponíveis para uso geral.
- **Utilities:** ferramentas e funcionalidades auxiliares.

Essa organização facilita a manutenção e permite expandir o bot sem comprometer a estrutura principal.

---

## Biblioteca Principal

O projeto utiliza:

**[@rexxhayanasi/elaina-baileys](https://www.npmjs.com/package/@rexxhayanasi/elaina-baileys)**

A biblioteca é responsável pela comunicação e integração com o WhatsApp, permitindo o gerenciamento de conexões, eventos e mensagens.

Para consultar atualizações, métodos e funcionalidades, acesse a documentação e as informações disponibilizadas pelo pacote.

---

## Recomendações

- Utilize uma versão compatível do Node.js.
- Mantenha as dependências atualizadas.
- Evite modificar arquivos internos das bibliotecas instaladas.
- Organize novos comandos dentro da categoria apropriada.
- Faça backups dos arquivos de autenticação.
- Revise as configurações antes de utilizar o bot em produção.

---

## Licença

Este projeto é disponibilizado para fins de estudo, desenvolvimento e personalização.

Caso utilize esta base em projetos públicos, mantenha os devidos créditos ao autor original.

---

## Créditos

Desenvolvido por **Bkz Modz**.

Apoio de **[@rai-zlopes06](https://github.com/rai-zlopes06)**.

Base construída utilizando a biblioteca **[@rexxhayanasi/elaina-baileys](https://www.npmjs.com/package/@rexxhayanasi/elaina-baileys)**.

---

<div align="center">

  **Shadow-WBase v1.5.5**

  Desenvolvido por Bkz Modz.

</div>