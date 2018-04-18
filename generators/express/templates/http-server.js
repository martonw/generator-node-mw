const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const logging = require('./logging');
const apiRouter = require('./service/router');
const serverAuth = require('./service/auth');

class HttpServer {

  constructor(options) {
    this.options = options;
    this.logger = options.logger || logging.getLogger('http-server');
  }

  run() {

    const _this = this;
    const logger = this.logger;

    const app = express();
    app.use(bodyParser.json());

    // Logging
    app.use(function (req, res, next) {
      logger.debug({url: req.path, method: req.method}, 'HTTP server request received');
      next();
    });

    // Setup CORS
    if (_this.options.access_control_allow_origin) {

      app.use(function(req, res, next) {

        res.header('Access-Control-Allow-Origin', _this.options.access_control_allow_origin);

        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {

          res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
          res.header('Access-Control-Max-Age', '86400');
          res.send(200);
        }
        else {
        //move on
          next();
        }
      });

    }

    // Authentication
    app.use(function (req, res, next) {
      // logger.debug({url: req.path, method: req.method}, 'HTTP server request received');
      serverAuth.authenticateRequest(req, function (err, authData) {

        if (err) {
          logger.warn({req: req, err: err}, 'Request authentication failed');
          res.status(403).json({
            status: 'error',
            message: 'Request authentication failed'
          });
          return;
        }

        req.authData = authData;
        next();
      })

    });

    const outterRouter = express.Router();
    app.use(this.options.url_prefix, outterRouter);

    // Think about refacting this..
    outterRouter.use('/api/v1', apiRouter);

    const httpPort = this.options.httpPort;
    app.listen(httpPort, () => {

      logger.info({httpPort: httpPort}, 'Reporting server started');
    });
  }
}

module.exports = HttpServer;
