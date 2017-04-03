const express = require('express'),
      router = express.Router(),
      Word = require('../models/word')

// root entry -> retrieve more than one word
router.get('/', function(req, res) {
  Word.getBatch.call({db: req.db}, req.query, function (err, words) {
    if (err) {
      res.status(400).json({status: "Oops", message: err + ""});
      return;
    }
    res.json(words);
  })
})

router.get('/:word', function(req, res) {
  Word.get.call({db: req.db}, req.params.word, function (err, doc) {
    if (err) {
      res.status(400).json({status: "Oops", message: err + ""});
      return;
    }
    res.json(doc);
  })
})

module.exports = router