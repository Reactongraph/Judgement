const Jwt = require('jsonwebtoken');
const response = require('../config/response')
const privateKey = process.env.JWT_PRIVATE_KEY;
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
        req.user.syncContacts = userData.syncContacts;
        req.user.userName = userData.userName;
        req.user.userContacts = userData.userContacts;
        next();
      }
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
}