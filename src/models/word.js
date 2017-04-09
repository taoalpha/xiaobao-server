const books = require("../books"),
      _ = require("lodash");

function sequencePromise(data, eachFn) {
  let result = Promise.resolve();
  data.forEach(v => {
    result = result.then(() => eachFn(v)).catch(err => console.log(err));
  });
  return result;
}

// Get a particular comment
exports.get = function(word, cb) {
  const wordC = this.db.collection('word');
  const volumeC = this.db.collection('volume');

  wordC.findOne({word}).then(doc => {
    if (!doc) throw new Error("Not Found");
    doc.sentences = [];
    return sequencePromise(doc.examples, (vid) => {
      return volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}}).then(vol => {
        if (vol.sentences[doc.word]) doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
        delete doc.examples;
        return doc;
      })
    })
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
  options.batch = +options.batch > 0 ? +options.batch : 30;  // batch should be a valid number and fall back to 50
  books("gre", (err, words) => {
    words = _.sampleSize(words, options.batch);
    const wordC = this.db.collection('word');
    const volumeC = this.db.collection('volume');

    wordC.find({word: {$in: words}}).toArray().then(docs => {
      if (docs.length === 0) throw new Error("Not Found");
      return sequencePromise(docs, (doc) => {
        doc.sentences = [];
        return sequencePromise(doc.examples, (vid) => {
          return volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}}).then(vol => {
            if (vol.sentences[doc.word]) doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
            delete doc.examples;
            return docs;
          })
        })
      })
    })
    .then(docs => {
      if (!docs || !docs.length) console.log("wrong data");
      cb(null, docs);
    })
    .catch(cb);
  });
};