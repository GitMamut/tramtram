const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const config = require('./config');

const log = require('simple-node-logger').createSimpleLogger({
  logFilePath: 'server.log', timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
});

exports.req = function (req){
  log.info(req.url + ": " + (req.header('x-forwarded-for') || req.connection.remoteAddress));
  log.info(req.body)
  log.info(req.query)
  log.info(req.headers)
}

exports.info = function(obj){
  log.info(obj);
}

exports.error = function(obj){
  log.error(obj);
}

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

exports.morgan = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  , { stream: accessLogStream });

exports.startup = function () {
  log.info("Starting app v. 0.0.1");
  log.info('NODE_ENV: ' + process.env.NODE_ENV);
  log.info('PORT: ' + config.PORT);
  log.info('PREFIX: ' + config.PREFIX);
}