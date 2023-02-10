const Jwt = require('jsonwebtoken');
// const moment = require('moment');
const env = require('../config/env')();
const response = require('../config/response')
const privateKey = require('../config/constants').key.privateKey;
const userModel = require("../models/users");

/**
 * Validate user token fetched from headers
 * if not valid token then send http 401 status
 * @param payload {Object}
 */
const validateUser = async (req, res, next) => {
    try {
      const token = getTokenFromHeaders(req.headers);
      const decoded = Jwt.verify(token, privateKey);
      req.user = decoded;
      if (req.user && req.user.id) {
        let userData = await userModel.findOne({ _id: req.user.id });
        if( !userData ) {
            const err = response.error_msg.invalidToken;
            res.status(err.statusCode).send(err.message);
        }
        req.user.profilePic = userData.profilePic;
        req.user.name = userData.name;
        next();
      }
    } catch (error) {
        const err = response.error_msg.invalidToken;
        res.status(err.statusCode).send(err.message);
    }
};

/**
 * Validate guest user token fetched from headers
 * if not valid token then send http 401 status
 * @param payload {Object}
 */
const validateGuestUser = (req, res, next) => {
    try {
      const token = getTokenFromHeaders(req.headers);
      const decoded = Jwt.verify(token, privateKey);
      req.user = decoded;
      next();
    } catch (error) {
        const err = response.error_msg.invalidToken;
        res.status(err.statusCode).send(err.message);
    }
};

const getTokenFromHeaders = headers => {
    if (headers && headers.authorization) {
        return headers.authorization;
    } else {
        const err = response.error_msg.invalidToken;
        res.status(err.statusCode).send(err.message);
    }
  };

module.exports = {
    validateUser: validateUser,
    validateGuestUser: validateGuestUser
}