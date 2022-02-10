const express = require('express')
const router = express.Router()

const User = require('./users')
router.post('/user', (req, res) => {
  User.find(req.body).then(data => {
    res.json({
      success: true,
      data
    })
  })
})

module.exports = router
