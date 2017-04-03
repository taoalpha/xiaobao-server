const books = require("../books"),
      _ = require("lodash");

// Get a particular comment
exports.get = function(word, cb) {
  const wordC = this.db.collection('word');
  const volumeC = this.db.collection('volume');

  wordC.findOne({word}).then(doc => {
    if (!doc) throw new Error("Not Found");
    doc.sentences = [];
    let promises = doc.examples.map(vid => {
      return volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}}).then(vol => {
        if (vol.sentences[doc.word]) doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
        return doc;
      });
    });
    return Promise.all(promises);
  })
  .then(docs => {
    let doc = docs[0];
    delete doc.examples;
    return doc;
  })
  .then(doc => {
    cb(null, doc)
  })
  .catch(e => {
    cb(e)
  });
};


exports.getBatch = function(options, cb) {
  options = options || {};
  options.batch = +options.batch > 0 ? +options.batch : 50;  // batch should be a valid number and fall back to 50
  books("gre", (err, words) => {
    words = _.sampleSize(words, options.batch);
    cb(err, words);
  });
};