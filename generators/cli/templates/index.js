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
  <% if (adapter) { %>
  .option('-a, --adapter <adaptername>', 'run a specific adapter')
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

<% if (adapter) { %>
if (program.adapter) {

  var Adapter;
  try {
    Adapter = require('./lib/adapters/' + program.adapter + '/adapter');
  } catch (e) {
    logger.fatal({err: e, adapter: program.adapter}, 'Adapter does not exists');
    process.exit(-2);
  }

  var options = _.cloneDeep(config.adapters[program.adapter] || {});
  options['data_dir'] = config['data_dir'];
  options.logger = logging.getLogger('adapter');
  // options.service = config.service;

  var adapter = new Adapter(options);
  adapter.defaultAdapterAction(function (err) {

    if (err) {
      logger.fatal({err: err, adapter: program.adapter}, 'Adapter run failed, exiting');
      process.exit(-3);
    }

    logger.info({adapter: program.adapter}, 'Adapter execution was successful. Exiting.');
    process.exit(0);
  });

}
<% } %>
