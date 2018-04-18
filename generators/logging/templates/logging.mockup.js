var path = require('path');
var util = require('util');

var config = require('config');
var bunyan = require('bunyan');

var problems = 0;

module.exports = {
  getLogger: function (name) {

    return {
      error: () => { problems++; },
      warn: () => { problems++; },
      info: () => {},
      debug: () => {},
      trace: () => {},
    }
  },

  resetProblemCounter: function () {
    problems = 0;
  },

  getProblemCounter: function () {
    return problems;
  }
};
