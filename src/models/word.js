const books = require("../books"),
      _ = require("lodash");

// Get a particular comment
exports.get = async function(word) {
  const wordC = this.db.collection('word');
  const volumeC = this.db.collection('volume');

  const doc = await wordC.findOne({word});
  doc.sentences = [];
  for (let vid of doc.examples) {
    const vol = await volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}});
    if (vol.sentences[doc.word]) {
      doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
    }
  }
  delete doc.examples;
  return doc;
};

exports.getBatch = async function(options) {
  options = options || {};
  options.batch = +options.batch > 0 ? +options.batch : 10;  // batch should be a valid number and fall back to 50

  // flow is:
  //  - fetch current book and vocabulary of the user
  //  - fetch book
  //  - fetch this batch
  const userC = this.db.collection('user');
  const wordC = this.db.collection('word');
  const volumeC = this.db.collection('volume');

  const userDoc = await userC.findOne({name: "xiaobao"});
  const totalWords = await books(userDoc.book);
  const fetchWords = _.sampleSize(_.difference(totalWords, _.difference(userDoc.vocabulary, userDoc.remembered)), options.batch)

  const wordDocs = await wordC.find({word: {$in: fetchWords}}).toArray();
  for (let doc of wordDocs) {
    doc.sentences = [];
    for (let vid of doc.examples) {
      const vol = await volumeC.findOne({vid: vid + ""}, {fields: {sentences: 1, meta: 1}});
      if (vol.sentences[doc.word]) {
        doc.sentences = doc.sentences.concat(vol.sentences[doc.word].map(s => ({s: s, source: vol.meta.corpus.name})));
      }
    }
    delete doc.examples;
  }

  userC.update({name: "xiaobao"}, { $push: { vocabulary: { $each: fetchWords } } });
  return wordDocs;
};