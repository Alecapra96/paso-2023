const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware('/backend-difu', {
  target: 'https://resultados.gob.ar',
  changeOrigin: true,
  pathRewrite: {
    '^/backend-difu': '/backend-difu', // Mantener la misma ruta en el endpoint
  },
  headers: {
    'Access-Control-Allow-Origin': '*', // Cambia '*' por el dominio de tu aplicación
  },
});
