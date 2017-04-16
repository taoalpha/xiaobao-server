const _ = require("lodash");

// Get a particular comment
exports.update = function(name, data) {
  const userC = this.db.collection('user');
  return userC.update({name}, { $addToSet: { remembered: {$each: data.remembered || []} } });
};


exports.get = function(name) {
  return userC.findOne({name});
};