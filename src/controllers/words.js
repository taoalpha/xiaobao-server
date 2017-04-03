const express = require('express'),
      router = express.Router(),
      Word = require('../models/word')

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