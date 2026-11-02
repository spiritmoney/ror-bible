const { createProxyMiddleware } = require('http-proxy-middleware');

// IMPORTANT (http-proxy-middleware v3 breaking changes):
// 1. `createProxyMiddleware(options)` takes a SINGLE options object only.
//    Calling it as `createProxyMiddleware(path, options)` throws
//    `Error: [HPM] Missing "target" option` synchronously, because the first
//    argument is treated as the whole options object. That throw happens
//    inside webpack-dev-server's onBeforeSetupMiddleware hook, which silently
//    aborts the rest of the dev-server startup (the compiler still reports
//    "Compiled successfully!" because that message comes from a separate
//    webpack hook) — the net effect is the dev server never calls
//    `.listen()`, so the port never actually binds and the browser gets
//    ERR_CONNECTION_REFUSED even though the terminal looks successful.
// 2. Mounting via `app.use('/path', createProxyMiddleware({...}))` also
//    causes Express to strip the `/path` prefix from req.url BEFORE the
//    middleware sees it, so the upstream request would hit `/` instead of
//    the intended route.
// The correct v3 pattern is to mount the middleware at the app root and let
// it do its own path matching via the `pathFilter` option, which preserves
// the full original request path when forwarding.
module.exports = function (app) {
  app.use(
    createProxyMiddleware({
      pathFilter: '/espees',
      target: 'http://localhost:3000',
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware({
      pathFilter: '/proxy',
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    })
  );
};
