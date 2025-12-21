const express = require('express')
const path = require('path')
const { Readable } = require('stream')

const app = express()
const port = Number(process.env.PORT) || 7002
const apiUrl = process.env.API_URL || 'http://localhost:7001'
const distPath = path.resolve(__dirname, 'dist', 'mobile')

app.get('/health', (req, res) => {
  res.type('text').send('ok')
})

app.use('/api', async (req, res) => {
  const targetUrl = new URL(req.originalUrl, apiUrl)
  const headers = { ...req.headers }
  delete headers.host

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req,
      duplex: req.method === 'GET' || req.method === 'HEAD' ? undefined : 'half'
    })

    res.status(response.status)
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return
      res.setHeader(key, value)
    })

    if (response.body) {
      Readable.fromWeb(response.body).pipe(res)
      return
    }

    res.end()
  } catch (error) {
    res.status(502).json({ error: 'api_proxy_failed' })
  }
})

app.use(express.static(distPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {})
