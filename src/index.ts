// src/index.ts

import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { videoRoutes } from './endpoints/video';

// Cria a instância principal do roteador
export const router = OpenAPIRouter();

// Registra todas as rotas definidas no arquivo de vídeo sob o prefixo /api/video
router.all('/api/video/*', videoRoutes.handle);

// Rota para lidar com solicitações não encontradas (404)
router.all('*', () => new Response('Not Found.', { status: 404 }));

// O export default é o ponto de entrada do nosso Worker.
// Ele simplesmente passa a requisição para o nosso roteador principal.
export default {
	fetch: router.handle,
};