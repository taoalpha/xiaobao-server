const express = require('express'),
      router = express.Router()

router.use('/words', require('./words'))

router.get('/', function(req, res) {
  res.render('index')
})

module.exports = router