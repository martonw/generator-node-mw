var path = require('path');
var util = require('util');

<% if (config) { %>
var config = require('config');
<% } %>
var bunyan = require('bunyan');
const fs = require('fs-extra');
const glob = require('glob');
const _ = require('lodash');

var consoleLogLevel = (process.env.NODE_ENV === "production")?'fatal':'debug';

if (!config) {

  var config = {
    logging: {
      dir: '.',
      level: 'info',
      rotate_count: 3
    }
  }
}

var logFilesDir = config.logging.dir;

var logStreams = {
  "console": {
    level: consoleLogLevel,
    stream: process.stdout
  },
  "main-detailed": { // main log file, almost everything goes here
    level: config.logging.level,
    path: path.join(logFilesDir, "main.log")
  }
};

function getLogStreamForChannel(channels) {
  var res = [];
  channels.forEach(function (channel) {
    if(!logStreams[channel])throw new Error('Log stream channel '+ channel +' does not exists');
    res.push(logStreams[channel]);
  });
  return res;
}

function getLogStreamsForLogger(loggerName) {
  switch (loggerName) {
    // case "fetcher":
    //   return getLogStreamForChannel(["console", "fetcher"]);
    //   break;
    default:
      return getLogStreamForChannel(["console", "main-detailed"]);
  }
}

// This is here to support logrotate
process.on('SIGUSR2', function () {
  loggersRef.forEach(function (logger) {
    logger.reopenFileStreams();
  });
});

var loggersRef = [];

function rotateLogs(filter) {

  var ls = logStreams;
  if (filter) {
    ls = _.pick(logStreams, filter);
  }
  _.values(ls).map(ls => ls.path).filter(p => !!p).forEach(path => rotateFile(path, 20));

  loggersRef.forEach(function (logger) {
    logger.reopenFileStreams();
  });
}

// rotates a file
function rotateFile(baseDir, filename, countToKeep) {

  var basePath;
  if (!countToKeep) {
    countToKeep = filename;
    basePath = baseDir;
  } else {
    basePath = path.join(baseDir, filename);
  }

  var files = glob.sync(basePath + '.+([0-9])');
  var filesSorted = files.reduce((acc, it) => {
    var pattern = it.match(/\.([0-9]+)$/);
    var suffix = pattern[1];
    acc[suffix] = it;
    return acc;
  }, []);
  if (filesSorted.length == countToKeep) {
    fs.removeSync(filesSorted.pop());
  }
  _.forEachRight(filesSorted, (file, i) => {
    if (file) {
      fs.moveSync(file, basePath + '.' + (i+1));
    }
  });
  if(fs.pathExistsSync(basePath)) {
    fs.moveSync(basePath, basePath + '.0');
  }

}

module.exports = {
  getLogger: function (name) {
    if (!name) {
      name = "default";
    }

    var logger = bunyan.createLogger({
      name: name,
      streams: getLogStreamsForLogger(name),
      serializers: {
        err: bunyan.stdSerializers.err,
        req: bunyan.stdSerializers.req
      }
    });
    loggersRef.push(logger);
    return logger;
  },
  rotateLogs: rotateLogs
};
