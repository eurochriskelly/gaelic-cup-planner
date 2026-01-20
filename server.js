const express = require('express')
const path = require('path')
const http = require('http')
const https = require('https')

const app = express()
const port = Number(process.env.PORT) || 4002
const apiUrl = process.env.API_URL || 'http://localhost:4001'
const distPath = path.resolve(__dirname, 'dist', 'mobile')

// fixed headers (e.g. Host) for routing through kamal-proxy
// e.g. curl -H 'Host: tst-api.lan' http://kamal-proxy/health
console.log(`v3: Running server. API on ${apiUrl}`)

app.get('/health', (req, res) => {
  console.log(process.env)
  res.type('text').send('ok')
})

app.use('/api', (req, res) => {
  const targetUrl = new URL(req.originalUrl, apiUrl)

  const headers = { ...req.headers }
  delete headers.host
  headers.host = process.env.API_HOST   // critical line

  console.log('proxy →', targetUrl.toString(), 'host=', headers.host)

  const requestFn = targetUrl.protocol === 'https:' ? https.request : http.request

  const proxyReq = requestFn(targetUrl, {
    method: req.method,
    headers
  }, (proxyRes) => {
    res.status(proxyRes.statusCode)
    Object.keys(proxyRes.headers).forEach((key) => {
      if (key === 'transfer-encoding') return
      res.setHeader(key, proxyRes.headers[key])
    })
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    console.error(err)
    if (!res.headersSent) {
      res.status(502).json({ error: 'api_proxy_failed' })
    }
  })

  if (req.method === 'GET' || req.method === 'HEAD') {
    proxyReq.end()
  } else {
    req.pipe(proxyReq)
  }
})

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next()
  return express.static(distPath)(req, res, next)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {})
