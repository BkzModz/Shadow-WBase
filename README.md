<div align="center">

  <img src="assets/images/profile-owner.png" width="140">

  <h1>Shadow-WBase</h1>

  <p>Base para desenvolvimento de bots WhatsApp utilizando a biblioteca Ourin-Baileys</p>

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![Platform](https://img.shields.io/badge/Platform-WhatsApp-blue)
![Type](https://img.shields.io/badge/Type-Bot%20Base-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Maintenance](https://img.shields.io/badge/Maintained-Yes-brightgreen)

</div>

---

## Sobre o Projeto

Shadow-WBase é uma base desenvolvida para criação de bots WhatsApp utilizando a biblioteca Ourin-Baileys.

O projeto foi estruturado para facilitar a implementação de sistemas, comandos, integrações e recursos personalizados, mantendo uma organização simples e escalável para novos desenvolvimentos.

---

## Recursos

* Estrutura modular
* Sistema de plugins
* Fácil manutenção
* Compatível com Ourin-Baileys
* Organização voltada para expansão
* Suporte a múltiplos comandos
* Configuração simplificada

---

## Requisitos

* Node.js 18 ou superior
* NPM ou Yarn
* Conta WhatsApp ativa

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

ou

```bash
node index.js
```

---

## Estrutura do Projeto

```text
Shadow-WBase/
├── assets/
├── handler/
├── plugins/
├── src/
├── temp/
├── config.js
├── index.js
├── package.json
└── README.md
```

### Diretórios

| Diretório     | Descrição                             |
| ------------- | ------------------------------------- |
| assets/images | Imagens e arquivos visuais do projeto |
| handler       | Gerenciamento de eventos e mensagens  |
| plugins       | Comandos e módulos do bot             |
| src           | Funções e recursos principais         |
| temp          | Arquivos temporários                  |

### Arquivos Principais

| Arquivo      | Descrição                      |
| ------------ | ------------------------------ |
| index.js     | Inicialização principal do bot |
| config.js    | Configurações gerais           |
| package.json | Dependências e scripts         |

---

## Configuração avançada (Ourin-Baileys)

### Inscrição Automática em Newsletter

A biblioteca Ourin-Baileys possui uma configuração responsável pela inscrição automática em canais (Newsletter) ao estabelecer conexão.

Arquivo:

```text
node_modules/ourin-baileys/lib/Defaults/index.js
```

Configuração padrão:

```js
autoFollowNewsletterOnConnect: true
```

Para desativar:

```js
autoFollowNewsletterOnConnect: false
```

---

## Dependências Principais

* Ourin-Baileys
* Node.js

---

## Recomendações

* Mantenha as dependências atualizadas.
* Revise as configurações da biblioteca antes de utilizar em produção.

---

## Licença

Este projeto é disponibilizado para fins de estudo, desenvolvimento e personalização.

Caso utilize esta base em projetos públicos, mantenha os devidos créditos ao autor original.

---

## Créditos

Desenvolvido por **Bkz Modz**  
Apoio de **[@rai-zlopes06](https://github.com/rai-zlopes06)**

Base construída utilizando a biblioteca **Ourin-Baileys**.