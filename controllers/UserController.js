const Jwt = require("jsonwebtoken");
const env = require("../config/env")();
const crypto = require('../helpers/crypto');

const commonController = require("../helpers/common");
const Constants = require("../config/constants");
const userModel = require("../models/users");
const Response = require('../config/response');
const messages = require('../config/messages');
const TWILIO = require('../helpers/twilio');

const register = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      userName: Joi.string().required().min(6).max(30),
      phone: Joi.string().required().min(10).max(10),
      password: Joi.string().required().min(6).max(30),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    let userData = await userModel.findOne({ userName: payload.userName });
    if (userData) {
      throw Response.error_msg.ALREADY_EXIST;
    }
    payload.password = crypto.generateHash(payload.password);
    const user = await userModel.create(payload);
    let tokenData = {
      id: user._id,
      userName: payload.userName,
    };
    let token = await Jwt.sign(tokenData, Constants.key.privateKey);
    return {
      accessToken: token,
      id: user._id,
      phone: user.phone,
      userName: user.userName,
      syncContacts: user.syncContacts,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const login = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    const user = await userModel.findOne({ userName: payload.userName });
    const generateHash = await crypto.generateHash(payload.password, Constants.ENCRYPTION_TYPE);
    if (!user || (user.password !== generateHash)) {
      throw Response.error_msg.INVALID_CREDENTIALS;
    }
    let tokenData = {
      id: user._id,
      userName: payload.userName,
    };
    let token = await Jwt.sign(tokenData, Constants.key.privateKey);
    return {
      accessToken: token,
      id: user._id,
      phone: user.phone,
      userName: user.userName,
      syncContacts: user.syncContacts,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const updateUser = async (payloadData, userData, fileData) => {
  try {
    const schema = Joi.object().keys({
      phone: Joi.string().optional().max(10),
      userContacts: Joi.array().items(Joi.string()),
      syncContacts: Joi.boolean().optional(),
      isRandomize: Joi.boolean().optional(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    if (fileData && fileData.profilePic) {
      const uploadedImage = await uploadImage(fileData.profilePic);
      payload.profilePic = uploadedImage.key;
    }
    let setData = { ...payload };
    const selectparams = { new: true };
    let user = await userModel.findOneAndUpdate(
      { _id: userData.id},
      setData,
      selectparams
    );
    if (!user) {
      throw Response.error_msg.notFound;
    }
    return {
      id: userData.id,
      phone: user.phone,
      userName: user.userName,
      syncContacts: user.syncContacts,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getUserDetails = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      throw Response.error_msg.notFound;
    }
    return {
      id: user._id,
      phone: user.phone,
      userName: user.userName,
      syncContacts: user.syncContacts
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const forgotPassword = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    
    const user = await userModel.findOne({ phone: payload.phone });
    if (!user) {
      throw Response.error_msg.notFound;
    }
    const otp = await commonController.generateRandomString(4, 'numeric');
    await userModel.findOneAndUpdate(
      { phone: payload.phone},
      { forgotPasswordOtp: otp},
      { new: true }
    );

    //send OTP via TWILIO
    const message = `${messages.success.FORGOT_PASSWORD_OTP}${otp}`;
    TWILIO.sendOtp(message, `+91${payload.phone}`);
    
    return ;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const verifyPasswordOtp = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
      otp: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    
    const user = await userModel.findOne({ phone: payload.phone});
    if (!user) {
      throw Response.error_msg.notFound;
    }
    if( user.forgotPasswordOtp && parseInt(user.forgotPasswordOtp) === parseInt(payload.otp)) {
      await userModel.findOneAndUpdate(
        { phone: payload.phone},
        { forgotPasswordOtp: null},
        { new: true }
      );
      return;
    }
    throw Response.error_msg.INVALID_OTP;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const changePassword = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      phone: Joi.string().required().min(10).max(10),
      newPassword: Joi.string().required().min(6).max(30),
      confirmPassword: Joi.string().required().min(6).max(10),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    
    const user = await userModel.findOne({ phone: payload.phone});
    if (!user) {
      throw Response.error_msg.notFound;
    }
    if( payload.newPassword === payload.confirmPassword) {
      const newPassword = crypto.generateHash(payload.newPassword);
      await userModel.findOneAndUpdate(
        { phone: payload.phone},
        { password: newPassword},
        { new: true }
      );
      return;
    }
    throw Response.error_msg.PASSWORD_MATCH_ERR;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  register: register,
  login: login,
  updateUser: updateUser,
  getUserDetails: getUserDetails,
  forgotPassword: forgotPassword,
  verifyPasswordOtp: verifyPasswordOtp,
  changePassword: changePassword
};
