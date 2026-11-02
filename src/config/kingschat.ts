import { getEnv } from 'utils/general';

// KingsChat OAuth2 configuration (latest redirect + code-exchange flow).
// Values are injected at build time via .env / build.sh (REACT_APP_*).
export const kingschatLoginConfig = {
  clientId: getEnv('KINGSCHAT_CLIENT_ID'),
  // Step 4: initiate login.
  loginUrl: getEnv(
    'KINGSCHAT_LOGIN_URL',
    'https://accounts.kingschat.online/log-in'
  ),
  // Step 5: registered redirect URL where KingsChat posts the code.
  redirectUrl: getEnv(
    'KINGSCHAT_REDIRECT_URL',
    'https://rhapsodybible.web.app/auth/callback'
  ),
  // Cloudflare Worker endpoint where the code is exchanged server-side.
  workerExchangeUrl: getEnv(
    'KINGSCHAT_WORKER_EXCHANGE_URL',
    'https://rorbible-kingschat-auth.loveworldexpo-kclogin.workers.dev/api/exchange'
  ),
  // Step 6 & 8: token endpoint (exchange + refresh).
  tokenUrl: getEnv(
    'KINGSCHAT_TOKEN_URL',
    'https://connect.kingsch.at/developer/api/oauth2/token'
  ),
  // Step 2: authenticated user's profile. This must be fetched from the server
  // side so the API key stays off the browser.
  profileUrl: getEnv(
    'KINGSCHAT_PROFILE_URL',
    'https://connect.kingsch.at/developer/api/user/profile'
  ),
};
