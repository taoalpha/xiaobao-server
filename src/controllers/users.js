const express = require('express'),
      router = express.Router()
      User = require('../models/user');

// Define routes handling profile requests

router.patch('/:username', function(req, res) {
  User.update.call({db: req.db}, req.body)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(e => res.send(e));
})

module.exports = router