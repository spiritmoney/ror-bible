const TOKEN_URL = 'https://connect.kingsch.at/developer/api/oauth2/token';
const PROFILE_URL = 'https://connect.kingsch.at/developer/api/user/profile';

const buildTokenRequestBody = ({ clientId, code }) => ({
  grant_type: 'code',
  client_id: clientId,
  code,
});

const buildProfileHeaders = ({ accessToken, apiKey }) => ({
  Authorization: `Bearer ${accessToken}`,
  'api-key': apiKey,
});

export { buildTokenRequestBody, buildProfileHeaders };

export default {
  async fetch(request, env) {
    const allowedOrigins = [
      'https://www.rorbible.plus',
      'https://rorbible.plus',
      'https://rhapsodybible.web.app',
      'http://localhost:5173',
    ];

    const origin = request.headers.get('Origin') || '';
    const corsOrigin = allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0];

    const cors = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, api-key, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/exchange') {
      return new Response('Use /api/exchange', {
        status: 404,
        headers: cors,
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: cors,
      });
    }

    try {
      const { code } = await request.json();
      if (!code) {
        return new Response(JSON.stringify({ error: 'Missing code' }), {
          status: 400,
          headers: cors,
        });
      }

      const tokenRes = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          buildTokenRequestBody({
            clientId: env.KINGSCHAT_CLIENT_ID,
            code,
          })
        ),
      });

      if (!tokenRes.ok) {
        const details = await tokenRes.text();
        return new Response(
          JSON.stringify({ error: 'Token exchange failed', details }),
          { status: 400, headers: cors }
        );
      }

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      const profileRes = await fetch(PROFILE_URL, {
        headers: buildProfileHeaders({
          accessToken,
          apiKey: env.KINGSCHAT_API_KEY,
        }),
      });

      if (!profileRes.ok) {
        const details = await profileRes.text();
        return new Response(
          JSON.stringify({ error: 'Profile fetch failed', details }),
          { status: 400, headers: cors }
        );
      }

      const profileData = await profileRes.json();
      const profile = profileData.profile || profileData;
      const tokens = {
        accessToken,
        refreshToken: tokenData.refresh_token ?? null,
        expiresInMillis: tokenData.expires_in_millis ?? null,
      };

      return new Response(
        JSON.stringify({
          tokens,
          profile,
          accessToken,
          refreshToken: tokens.refreshToken,
          expiresInMillis: tokens.expiresInMillis,
        }),
        { headers: { ...cors, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
        { status: 500, headers: cors }
      );
    }
  },
};