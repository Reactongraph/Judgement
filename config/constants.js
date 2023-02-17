const path = require('path');

const globalConstants = {
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_LOG_VERBOSE: Object.prototype.hasOwnProperty.call(process.env, 'MONGO_LOG_VERBOSE')
  ? JSON.parse(process.env.MONGO_LOG_VERBOSE)
  : false,
  ENCRYPTION_TYPE: 'sha1',
};

module.exports = globalConstants;