// Create new comment in your database and return its id

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
}

// Get all comments
exports.all = function(cb) {
  cb(null, [])
}

// Get all comments by a particular user
exports.allByUser = function(user, cb) {
  cb(null, [])
}