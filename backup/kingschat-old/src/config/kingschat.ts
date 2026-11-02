import { getEnv } from 'utils/general';

export const kingschatLoginOptions = {
  clientId: getEnv('KINGSCHAT_CLIENT_ID'),
  scopes: ['profile'],
};

export const kingschatRefreshConfig = {
  clientId: getEnv('KINGSCHAT_CHAT_CLIENT_ID'),
  refreshToken: getEnv('RORBIBLE_KINGSCHAT_REFRESH_TOKEN'),
};
