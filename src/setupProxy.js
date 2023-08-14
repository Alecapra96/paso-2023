const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/backend-difu',
    createProxyMiddleware({
      target: 'https://resultados.gob.ar',
      changeOrigin: true,
      pathRewrite: {
        '^/backend-difu': '/backend-difu',
      },
    })
  );
};
