// src/index.ts

import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { videoRoutes } from './endpoints/video';
import { gerarJWTGoogle, obterAccessToken } from '../google-auth';

// Cria a instância principal do roteador
export const router = OpenAPIRouter();

// Registra todas as rotas definidas no arquivo de vídeo sob o prefixo /api/video
router.all('/api/video/*', videoRoutes.handle);

// Rota para lidar com solicitações não encontradas (404)
router.all('*', () => new Response('Not Found.', { status: 404 }));

// Exemplo: rota para obter access_token Google
router.get('/api/google-token', async () => {
  // Dados do service account (ideal: use Secret para private_key)
  const serviceAccount = {
    client_email: 'veo-3-video-mkr@gen-lang-client-0780586577.iam.gserviceaccount.com',
    private_key: `-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCzNvxXid+Tb3Rk\n8L1515dKSK8KC4Av5IewMaYzYEIpwyqDKTy5mXD1SVa0klFFLBS+hfbs7CV8Kdr/\nMDe2qTljBwhO9GEHsOwpwaOtv4SyVZkg1ydAguLAch+VOfRYjlNFKdbX+up0LTB3\nA9LScg5qlJm5/h7XEU1I/eaGjrVOeKXFByFKF1CX5C8vCyvpDpDyRUPNjGyfqB8O\nbRrkX5nIOxR9lhItro80IigHQK0AnJAWym0jbguKfu8jkcPksUamUvGcPQlK1hIT\nTq8/+1lUdtPFLS93Hj+DeRcqu43YGgQk5n1Qn+uJ0X8jm9GMeo9+lGnco2tKKrzz\n6ZVblE3pAgMBAAECggEABbwdi2ro4c3AEpeA5gcSmyNun9UqDHOf2Ju2HvsWaEIL\nuGJs7t7XS69wRrCkniCLfLn1DV7UfOp/9143zNtnGov35Zg8tKN3jdyERtk+lKWt\nk+yen8SwdIpnsqhF8UGDWPlo8RoL6kd56g0QGtY12jjtdGi1MZpRoqN7/tP5Pvdg\nAe3AHHFtc4uobjFCtKzNzGIZkYvrwzf8I2hgJX/uX/dZWKbgGHh5bsdFuiODCW0v\nM25fN7yvHFNTTIv8kfbKHqd2h8dlnJOaPincpLDdwGJjQsw4YR3azMlq7Cyy9TvL\nooEogE3+g7o4m0o3ZH4IRj7mkEVdL0UK80y8D8ZQqQKBgQDaWaeLl4E66GBQ4FJz\nUKIC6QLPvtJPatLKrPiBBP7iS9eZib51SfMjzyEsxnaCemrqZZl8lyNZfcuuczOE\n/nI2wm2XJGP3M2b2FCK02klnx/XNDRFezp6HGT3WGhvgYwxarz6IrB8rIFXa4JBx\n33jPu4eMOuYg2NiCzuVgXARHXQKBgQDSHdPpfrjtls2Ut8ebCsgW/uAxfc++Yc5Z\nMfgAkYyOE4DsAlIzj/viTM8di4xl24OKUGwAylCnocE8G0lWUooAo27h/yu5nWEN\nf8JZv1VmzoGZOHeMiwLK3vGpUkMNJcdtUvkR8ZxXTbQo45ZeRFIzcyefS10gNe1P\nUpECvsdz/QKBgESIg1gDE6LDsQdxgS+EjXVQYXuHL0eSBdtrcww73yx0FZWxcEAs\nF86TgpwlJqlJdyle/k/muEesfjOhIPiLTJn3aKJZ366FSbnPFB2jrgqO7o2PnnYd\ncBCDUa9TvpAtRoFoI76OF7JXkdsDRRMYyziYabEQA48nwL095yzZdNZZAoGALahf\noRBxXOd1Gsjore8k1aJi0z5Ugzk7nrQ2AOGf2kuwqxhCBoRWJrGsG+5z/ro5ljet\nkGpmJlcG52nCgOiEpmjdMmzBcp8ZNNa7Q8dI5oMfNE1J5Rdb7vuNJc8DVPsNn9r0\n1opa/7mZ2XzC8w8DkbyHMp0sylANljwJ2L/eFX0CgYBXxyXXVrjiyTdEME3+jr0y\na1fLPqeltXkFaxcg49R7Y6/rxh/vlWJg9E3PqPLlmF0jCEKD4uX8V+G2vpSxQ6Xd\nYtg2nh8GOS4qx2OHEYQA3GU4D8pMYE20Kkzsx9AIskjy+uJyWn7dptv18zb30tX/\nX8r/FaoGCQc/w4NsiAaCtA==\n-----END PRIVATE KEY-----\n`,
    scope: 'https://www.googleapis.com/auth/cloud-platform',
  };
  try {
    const jwt = await gerarJWTGoogle(serviceAccount);
    const tokenData = await obterAccessToken(jwt);
    return new Response(JSON.stringify(tokenData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response('Erro: ' + (err as Error).message, { status: 500 });
  }
});

// O export default é o ponto de entrada do nosso Worker.
// Ele simplesmente passa a requisição para o nosso roteador principal.
export default {
	fetch: router.handle,
};