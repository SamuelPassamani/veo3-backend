import { SignJWT, importPKCS8 } from 'jose';

export interface ServiceAccount {
  client_email: string;
  private_key: string;
  scope: string;
}

export async function gerarJWTGoogle(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: sa.client_email,
    scope: sa.scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const alg = 'RS256';
  const privateKey = await importPKCS8(sa.private_key, alg);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg, typ: 'JWT' })
    .sign(privateKey);
}

export async function obterAccessToken(jwt: string) {
  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt,
  });

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!resp.ok) throw new Error('Erro ao obter access_token');
  return await resp.json();
}
