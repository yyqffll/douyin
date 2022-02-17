const express = require('express')
const bodyParser = require('body-parser')
const userApi = require('../mongodb/Schema/users/userApi')
const playApi = require('../mongodb/Schema/plays/playApi')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', bodyParser.json({ limit: '10mb' }), userApi)
app.use('/api', bodyParser.json({ limit: '10mb' }), playApi)

app.listen(port, () => {
  console.log('server is ready on port 3000')
})
