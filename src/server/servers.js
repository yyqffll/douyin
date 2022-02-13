const express = require('express')
const bodyParser = require('body-parser')
const usersApi = require('../mongodb/Schema/usersApi')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', bodyParser.json({ limit: '10mb' }), usersApi)

app.listen(port, () => {
  console.log('server is ready on port 3000')
})
