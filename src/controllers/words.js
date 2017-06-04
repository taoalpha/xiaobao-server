const express = require('express'),
      router = express.Router(),
      Word = require('../models/word');

// root entry -> retrieve more than one word
router.get('/', function(req, res) {
  Word.getBatch.call({db: req.db}, req.query)
    .then(words => {
      res.json(words);
    })
    .catch(e => {
      res.send(e);
    });
})

router.get('/:word', function(req, res) {
  Word.get.call({db: req.db}, req.params.word)
    .then(doc => {
      res.json(doc);
    })
    .catch(e => res.send(e));
})

module.exports = router