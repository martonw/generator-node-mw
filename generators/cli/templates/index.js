const config = require('config');
const program = require('commander');
const _ = require('lodash');
// const async = require('async');
const fs = require('fs-extra');
const path = require('path');

const logging = require('./lib/logging');
<% if (express) { %>
const HttpServer = require('./lib/http-server.js');
<% } %>

const logger = logging.getLogger();

program
  .version(fs.readJsonSync('package.json').version)
  <% if (express) { %>
  .option('-s, --serve', 'Start http service')
  <% } %>
  .parse(process.argv);

// handlers
<% if (express) { %>
if (program.serve) {
  var options = _.cloneDeep(config['service']);
  var rs = new HttpServer(options);
  rs.run();
}
<% } %>
