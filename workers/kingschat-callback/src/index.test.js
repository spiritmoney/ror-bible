import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTokenRequestBody, buildProfileHeaders } from './index.js';

test('uses KingsChat grant_type=code and does not send a client_secret', () => {
  const body = buildTokenRequestBody({
    clientId: 'client-123',
    code: 'auth-code-456',
  });

  assert.deepStrictEqual(body, {
    grant_type: 'code',
    client_id: 'client-123',
    code: 'auth-code-456',
  });
  assert.ok(!Object.hasOwn(body, 'client_secret'));
});

test('adds the required api-key header when fetching the user profile', () => {
  const headers = buildProfileHeaders({
    accessToken: 'abc-token',
    apiKey: 'api-key-789',
  });

  assert.deepStrictEqual(headers, {
    Authorization: 'Bearer abc-token',
    'api-key': 'api-key-789',
  });
});
