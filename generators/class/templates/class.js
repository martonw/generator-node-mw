// const util = require('util');
const path = require('path');

const _ = require('lodash');
// const fs = require('fs-extra');
// const moment = require('moment-timezone');
// const async = require('async');

const logging = require(path.join(process.cwd(), './lib/logging'));

module.exports = class <%= className %> {

  constructor(options) {

    this.options = options;
    this.logger = options.logger || logging.getLogger('<%= className %>');
  }

  _method1() {

    const _this = this;
    const logger = this.logger;


  }


}
