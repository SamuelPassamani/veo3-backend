// src/endpoints/video.ts

import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import {
	GenerateVideo,
	CheckStatus,
	GenerateVideoResponse,
	CheckStatusResponse,
	ErrorResponse,
} from '../types'; // Importa de ../types.ts

// Cria um roteador específico para as rotas de vídeo
export const videoRoutes = OpenAPIRouter({
	base: '/api/video', // Define a base para todas as rotas neste arquivo
});

// Função auxiliar para obter um token de acesso do Google
async function getGoogleAuth(env: any) {
	const auth = new GoogleAuth({
		credentials: JSON.parse(env.GOOGLE_CREDENTIALS),
		scopes: 'https://www.googleapis.com/auth/cloud-platform',
	});
	const client = await auth.getClient();
	const accessToken = (await client.getAccessToken()).token;
	const projectId = await auth.getProjectId();
	return { accessToken, projectId };
}

// --- ROTA PARA INICIAR A GERAÇÃO DE VÍDEO ---
// A URL final será /api/video/generate
videoRoutes.post('/generate', GenerateVideo, async (request, env) => {
	const promptPayload = request.content;

	const { accessToken, projectId } = await getGoogleAuth(env);

	const apiUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/veo-3.0-generate-001:generateVideo`;

	const gcpResponse = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(promptPayload),
	});

	if (!gcpResponse.ok) {
		const errorBody = await gcpResponse.text();
		console.error('Google API Error:', errorBody);
		return new Response(JSON.stringify({ error: `Google API Error: ${gcpResponse.status}` }), { status: 500 });
	}

	const operation = await gcpResponse.json();
	return new GenerateVideoResponse(operation);
});

// --- ROTA PARA VERIFICAR O STATUS DA GERAÇÃO ---
// A URL final será /api/video/status/some-operation-name
videoRoutes.get('/status/:operationName+', CheckStatus, async (request, env) => {
	const { operationName } = request.params;

	if (!operationName) {
		return new ErrorResponse('operationName parameter is required.', 400);
	}

	const { accessToken } = await getGoogleAuth(env);
	const statusUrl = `https://us-central1-aiplatform.googleapis.com/v1/${operationName}`;

	const statusResponse = await fetch(statusUrl, {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		},
	});

	if (!statusResponse.ok) {
		const errorBody = await statusResponse.text();
		console.error('Google API Status Check Error:', errorBody);
		return new ErrorResponse(`Google API Status Check Error: ${statusResponse.status}`, 500);
	}

	const statusData = await statusResponse.json();
	return new CheckStatusResponse(statusData);
});