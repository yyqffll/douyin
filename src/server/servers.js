const express = require('express')
const bodyParser = require('body-parser')
const usersApi = require('../mongodb/Schema/usersApi')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', usersApi)

app.listen(port, () => {
  console.log('server is ready on port 3000')
})
