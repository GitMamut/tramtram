
const express = require('express');
const bodyParser = require('body-parser');

const log = require('./log.js');

exports.configure = function () {
  server = express();
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(log.morgan);
  return server;
};

exports.start = function (server, port) {
  server.listen(port, () => {
    console.log("server started on port " + port);
  });
};
