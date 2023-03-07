const Jwt = require('jsonwebtoken');
const response = require('../config/response')
const privateKey = process.env.JWT_PRIVATE_KEY;
const userModel = require("../models/users");
const Response = require('../config/response');

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
        if( !userData || req.user.deviceId !== userData.deviceId ) {
            res.send(Response.error_msg.INVALID_TOKEN);
        }
        req.user.syncContacts = userData.syncContacts;
        req.user.userName = userData.userName;
        req.user.userContacts = userData.userContacts;
        next();
      }
    } catch (error) {
        res.send(Response.error_msg.INVALID_TOKEN);
    }
};

const getTokenFromHeaders = headers => {
    if (headers && headers.authorization) {
        return headers.authorization;
    } else {
        res.send(Response.error_msg.INVALID_TOKEN);
    }
  };

module.exports = {
    validateUser: validateUser,
}