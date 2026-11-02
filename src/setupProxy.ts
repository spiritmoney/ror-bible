// import { createProxyMiddleware } from 'http-proxy-middleware';
// import { Application } from 'express';

// module.exports = function(app: Application) {
//   app.use(
//     '/api',
//     createProxyMiddleware({
//       target: 'https://api.rorbible.plus',
//       changeOrigin: true,
//       pathRewrite: {
//         '^/api': '', // Remove /api prefix when forwarding request
//       },
//     })
//   );
// };

export {};
