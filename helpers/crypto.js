'use strict';

const crypto = require('crypto');
const constants = require('../config/constants');

/**
 * @param {string} redirectUrl //url to generate hash url
 * @param {string} hashKey // privateKey of supplier or Operator
 */
const makePlainText = (redirectUrl, hashKey) => {
  return `${redirectUrl}${hashKey}`;
};

/**
 * Encrypt the string provided
 * @param plainText {string} string to be encrypted
 * @param encryptionType {string} algorithm to be used for encryption
 * @return: {string} encrypted value of the parameter passed into it
 */
const generateHash = (
  plainText,
  encryptionType = constants.ENCRYPTION_TYPE
) => {
  return crypto
    .createHash(encryptionType)
    .update(plainText)
    .digest('hex');
};

/**
 * @param {number} size
 * @param {string} bytes // string of random bytes
 */
const getRandomByte = size => {
  return crypto.randomBytes(size).toString('hex');
};

module.exports = {
  getRandomByte,
  makePlainText,
  generateHash
};
