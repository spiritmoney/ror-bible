# KingsChat OAuth2 callback — Cloudflare Worker

Handles the KingsChat **Redirect (GET)** callback for the ROR Bible+ SPA.

## Flow

1. SPA redirects to KingsChat:
   `https://accounts.kingschat.online/log-in?clientId=...&origin=...`
2. KingsChat redirects the browser (GET) to:
   `https://rorbible.plus/auth/callback?code=...&origin=...`
3. This Worker exchanges the code → tokens, fetches the profile, then
   302-redirects to:
   `https://rorbible.plus/auth/success#data=<url-encoded JSON { tokens, profile, origin }>`
4. The SPA reads the fragment, completes login, and navigates to `/welcome`.

## Setup

1. Add `rorbible.plus` (and `www.rorbible.plus`) as a zone in Cloudflare.
   Point DNS at Cloudflare (proxied), with the origin set to Firebase Hosting.
2. Install Wrangler and log in:
   ```bash
   npm i -g wrangler
   wrangler login
   ```
3. Set the secret API key (server-side only):
   ```bash
   cd workers/kingschat-callback
   npx wrangler secret put KINGSCHAT_API_KEY
   ```
   Paste: `fuUZz0GW84DvBkyt03QKvCCj5e9WHLhBUIjcmrhBZlI=`
4. Deploy:
   ```bash
   npx wrangler deploy
   ```

## Notes

- `KINGSCHAT_API_KEY` must never be exposed to the browser — it only lives in
  the Worker (as a secret).
- `APP_ORIGIN` defaults to the request host if not set.
- Codes delivered via Redirect mode are valid for 5 minutes; this Worker
  exchanges the code immediately.
- The redirect-back uses the URL **fragment** (`#data=...`) so the tokens are
  not sent to servers or logged in the Referer.
