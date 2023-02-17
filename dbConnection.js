'use strict';
const env = process.env;
const constants = require("./config/constants.js");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* eslint-disable-next-line */
let connectionInstance;
//if already we have a connection, don't connect to database again
if (connectionInstance) {
  module.exports.connectionInstance = connectionInstance;
  module.exports.Schema = Schema;
}

const connectionString = `mongodb://${env.MONGO_HOST}/judgement`;
console.log('connectionString', connectionString);
let options = {};
if (env != 'staging' && env != 'test') {
  options = {
    autoReconnect: true,
    poolSize: 50,
    socketTimeoutMS: 300000,
    keepAlive: 600000,
    connectTimeoutMS: 300000,
    useNewUrlParser: true
  };
}
connectionInstance = mongoose.createConnection(connectionString, options);

//error connecting to db
connectionInstance.on('error', function (err) {
  if (err) {
    throw err;
  }
});
//db connected
connectionInstance.once('open', function () {
  /* eslint-disable-next-line */
  console.info('MongoDb connected successfully', connectionString);
});

//export the db connection
module.exports.connectDB = connectionInstance;
module.exports.Schema = Schema;
const logDebug = constants.MONGO_LOG_VERBOSE || false;
mongoose.set('debug', logDebug);
