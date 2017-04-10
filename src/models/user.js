const _ = require("lodash");

function sequencePromise(data, eachFn) {
  let result = Promise.resolve();
  data.forEach(v => {
    result = result.then(() => eachFn(v));
  });
  return result;
}

// Get a particular comment
exports.update = function(name, data) {
  const userC = this.db.collection('user');
  return userC.update({name}, { $push: { remembered: {$each: data.remembered | []} } });
};


exports.get = function(name) {
  return userC.findOne({name});
};