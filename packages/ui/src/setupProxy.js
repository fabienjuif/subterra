const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (app) => {
  app.use(
    '/beta',
    createProxyMiddleware({
      target: 'https://jw9fgoihic.execute-api.eu-west-3.amazonaws.com',
      changeOrigin: true,
    }),
  )
}
