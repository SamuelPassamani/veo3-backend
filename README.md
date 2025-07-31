# Veo 3 Video Generation Backend

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare) ![Google Cloud](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)

Este é um backend seguro e escalável construído com **Cloudflare Workers**, projetado para servir como um intermediário entre um aplicativo frontend e a **API do Google Vertex AI** para a geração de vídeos com o modelo **Veo 3**.

## 🚀 Visão Geral

O objetivo principal deste projeto é fornecer uma camada de API segura que abstrai a complexidade da autenticação com o Google Cloud. Ele permite que um frontend (como nosso Web App) solicite a geração de um vídeo enviando um simples prompt JSON, sem nunca expor credenciais sensíveis.

### ✨ Funcionalidades

-   **Endpoint Seguro para Geração:** Expõe uma rota (`/api/video/generate`) que recebe um prompt JSON e inicia uma tarefa de geração de vídeo.
-   **Autenticação Segura:** Utiliza um segredo do Cloudflare Worker para armazenar e usar as credenciais da conta de serviço do Google.
-   **Gerenciamento de Tarefas Assíncronas:** Inicia a tarefa de geração na Vertex AI e fornece uma rota (`/api/video/status/:operationName`) para verificar o status do trabalho de forma assíncrona.
-   **Estrutura Escalável:** Construído com um roteador (`itty-router-openapi`) para facilitar a adição de novos endpoints no futuro.

---

## 🛠️ Tecnologias Utilizadas

-   **Backend:** Cloudflare Workers
-   **Linguagem:** TypeScript
-   **Roteamento:** Itty Router OpenAPI
-   **Autenticação:** Google Auth Library
-   **API de IA:** Google Cloud Vertex AI (Modelo Veo 3)

---

## 🏁 Como Começar

Siga os passos abaixo para configurar e implantar seu próprio backend.

### Pré-requisitos

-   Node.js e npm instalados.
-   Uma conta Cloudflare.
-   Um projeto no Google Cloud com a API Vertex AI ativada e uma chave de conta de serviço (arquivo JSON).

### Guia de Instalação

1.  **Clonar o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd veo3-backend
    ```

2.  **Instalar Dependências:**
    ```bash
    npm install
    ```

3.  **Configurar o Segredo do Google:**
    Execute o comando abaixo, substituindo pelo caminho do seu arquivo de chave JSON. Se estiver usando PowerShell, consulte o guia para o comando correto.
    ```bash
    wrangler secret put GOOGLE_CREDENTIALS < /caminho/para/sua/chave.json
    ```

4.  **Desenvolvimento Local:**
    Inicie um servidor local para testes.
    ```bash
    npm run dev
    ```

5.  **Implantação (Deploy):**
    Publique seu Worker na rede global da Cloudflare.
    ```bash
    npm run deploy
    ```

---

## 🔌 Endpoints da API

A URL base será a URL fornecida pelo seu Worker (ex: `https://veo3-backend.seu-usuario.workers.dev`).

### Iniciar Geração de Vídeo

-   **Método:** `POST`
-   **Endpoint:** `/api/video/generate`
-   **Corpo (Body):** O prompt JSON completo para a API do Veo 3.
-   **Resposta de Sucesso:** Um objeto de "operação" da API do Google, contendo o `name` da tarefa.

### Verificar Status da Geração

-   **Método:** `GET`
-   **Endpoint:** `/api/video/status/:operationName`
-   **Parâmetro de URL:** `:operationName` - O valor do campo `name` recebido da rota de geração.
-   **Resposta de Sucesso:** Um objeto de status. Se `done` for `true`, a resposta conterá a URL do vídeo gerado.
