const books = require("../books"),
      _ = require("lodash");

function sequencePromise(data, eachFn) {
  let result = Promise.resolve();
  data.forEach(v => {
    result = result.then(() => eachFn(v));
  });
  return result;
}

// Get a particular comment
exports.get = function(word) {
  const wordC = this.db.collection('word');
  const volumeC = this.db.collection('volume');

  return wordC.findOne({word}).then(doc => {
    if (!doc) throw new Error("Not Found");
    doc.sentences = [];
    return sequencePromise(doc.examples, (vid) => {
      return volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}}).then(vol => {
        if (vol.sentences[doc.word]) doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
        delete doc.examples;
        return doc;
      })
    });
  });
};


exports.getBatch = function(options) {
  options = options || {};
  options.batch = +options.batch > 0 ? +options.batch : 10;  // batch should be a valid number and fall back to 50
  return books("gre").then(words => {
    const userC = this.db.collection('user');
    const wordC = this.db.collection('word');
    const volumeC = this.db.collection('volume');
    let curBatch = [];

    // TODO: Need to be improved...
    return userC.findOne({name: "xiaobao"}).then(userDoc => {
      // get words for this batch
      curBatch = _.sampleSize(_.difference(words, userDoc.vocabulary, useDoc.remembered), options.batch);
      return curBatch;
    }).then(words => {
      return wordC.find({word: {$in: words}}).toArray().then(docs => {
        if (docs.length === 0) throw new Error("Not Found");
        return sequencePromise(docs, (doc) => {
          doc.sentences = [];
          return sequencePromise(doc.examples, (vid) => {
            return volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}}).then(vol => {
              if (vol.sentences[doc.word]) doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
              delete doc.examples;
              return docs;
            });
          });
        });
      });
    }).then(docs => {
      userC.update({name: "xiaobao"}, { $push: { vocabulary: { $each: curBatch } } });
      return docs;
    })
    .catch(console.log)
  })
};