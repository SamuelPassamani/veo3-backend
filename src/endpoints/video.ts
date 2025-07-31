// src/endpoints/video.ts

import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { gerarJWTGoogle, obterAccessToken } from '../../google-auth';
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
  // ATENÇÃO: A chave privada está hardcoded ou vinda de env, conforme sua escolha
  const serviceAccount = {
    client_email: 'veo-3-video-mkr@gen-lang-client-0780586577.iam.gserviceaccount.com',
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzNvxXid+Tb3Rk\n8L1515dKSK8KC4Av5IewMaYzYEIpwyqDKTy5mXD1SVa0klFFLBS+hfbs7CV8Kdr/\nMDe2qTljBwhO9GEHsOwpwaOtv4SyVZkg1ydAguLAch+VOfRYjlNFKdbX+up0LTB3\nA9LScg5qlJm5/h7XEU1I/eaGjrVOeKXFByFKF1CX5C8vCyvpDpDyRUPNjGyfqB8O\nbRrkX5nIOxR9lhItro80IigHQK0AnJAWym0jbguKfu8jkcPksUamUvGcPQlK1hIT\nTq8/+1lUdtPFLS93Hj+DeRcqu43YGgQk5n1Qn+uJ0X8jm9GMeo9+lGnco2tKKrzz\n6ZVblE3pAgMBAAECggEABbwdi2ro4c3AEpeA5gcSmyNun9UqDHOf2Ju2HvsWaEIL\nuGJs7t7XS69wRrCkniCLfLn1DV7UfOp/9143zNtnGov35Zg8tKN3jdyERtk+lKWt\nk+yen8SwdIpnsqhF8UGDWPlo8RoL6kd56g0QGtY12jjtdGi1MZpRoqN7/tP5Pvdg\nAe3AHHFtc4uobjFCtKzNzGIZkYvrwzf8I2hgJX/uX/dZWKbgGHh5bsdFuiODCW0v\nM25fN7yvHFNTTIv8kfbKHqd2h8dlnJOaPincpLDdwGJjQsw4YR3azMlq7Cyy9TvL\nooEogE3+g7o4m0o3ZH4IRj7mkEVdL0UK80y8D8ZQqQKBgQDaWaeLl4E66GBQ4FJz\nUKIC6QLPvtJPatLKrPiBBP7iS9eZib51SfMjzyEsxnaCemrqZZl8lyNZfcuuczOE\n/nI2wm2XJGP3M2b2FCK02klnx/XNDRFezp6HGT3WGhvgYwxarz6IrB8rIFXa4JBx\n33jPu4eMOuYg2NiCzuVgXARHXQKBgQDSHdPpfrjtls2Ut8ebCsgW/uAxfc++Yc5Z\nMfgAkYyOE4DsAlIzj/viTM8di4xl24OKUGwAylCnocE8G0lWUooAo27h/yu5nWEN\nf8JZv1VmzoGZOHeMiwLK3vGpUkMNJcdtUvkR8ZxXTbQo45ZeRFIzcyefS10gNe1P\nUpECvsdz/QKBgESIg1gDE6LDsQdxgS+EjXVQYXuHL0eSBdtrcww73yx0FZWxcEAs\nF86TgpwlJqlJdyle/k/muEesfjOhIPiLTJn3aKJZ366FSbnPFB2jrgqO7o2PnnYd\ncBCDUa9TvpAtRoFoI76OF7JXkdsDRRMYyziYabEQA48nwL095yzZdNZZAoGALahf\noRBxXOd1Gsjore8k1aJi0z5Ugzk7nrQ2AOGf2kuwqxhCBoRWJrGsG+5z/ro5ljet\nkGpmJlcG52nCgOiEpmjdMmzBcp8ZNNa7Q8dI5oMfNE1J5Rdb7vuNJc8DVPsNn9r0\n1opa/7mZ2XzC8w8DkbyHMp0sylANljwJ2L/eFX0CgYBXxyXXVrjiyTdEME3+jr0y\na1fLPqeltXkFaxcg49R7Y6/rxh/vlWJg9E3PqPLlmF0jCEKD4uX8V+G2vpSxQ6Xd\nYtg2nh8GOS4qx2OHEYQA3GU4D8pMYE20Kkzsx9AIskjy+uJyWn7dptv18zb30tX/\nX8r/FaoGCQc/w4NsiAaCtA==\n-----END PRIVATE KEY-----\n`,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  };
  const jwt = await gerarJWTGoogle(serviceAccount);
  const tokenData = await obterAccessToken(jwt) as { access_token: string };
  if (!tokenData || typeof tokenData.access_token !== 'string') {
	throw new Error('Failed to obtain access_token from Google authentication.');
  }
  const accessToken = tokenData.access_token;
  const projectId = 'gen-lang-client-0780586577';
  return { accessToken, projectId };
}

function withCORS(response: Response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
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
		return new Response(JSON.stringify({ error: `Google API Error: ${gcpResponse.status}` }), {
			status: 500,
			headers: { 'Access-Control-Allow-Origin': '*' }
		});
	}

	const operation = await gcpResponse.json();
	return withCORS(new Response(JSON.stringify(new GenerateVideoResponse(operation)), {
		headers: { 'Access-Control-Allow-Origin': '*' }
	}));
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
		return new Response(JSON.stringify({ error: `Google API Status Check Error: ${statusResponse.status}` }), {
			status: 500,
			headers: { 'Access-Control-Allow-Origin': '*' }
		});
	}

	const statusData = await statusResponse.json();
	return withCORS(new Response(JSON.stringify(new CheckStatusResponse(statusData)), {
		headers: { 'Access-Control-Allow-Origin': '*' }
	}));
});

// Handler para OPTIONS (pré-flight)
videoRoutes.options('/*', () =>
  withCORS(new Response(null, { status: 204 }))
);