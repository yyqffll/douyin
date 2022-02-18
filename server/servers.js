const express = require('express')
const bodyParser = require('body-parser')
const userApi = require('../mongodb/Schema/users/userApi')
const imgApi = require('../mongodb/Schema/imgs/imgApi')
const playApi = require('../mongodb/Schema/plays/playApi')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/api', userApi)
app.use('/api', bodyParser.json({ limit: '10mb' }), imgApi)
app.use('/api', bodyParser.json({ limit: '50mb' }), playApi)

app.listen(port, () => {
  console.log('server is ready on port 3000')
})
