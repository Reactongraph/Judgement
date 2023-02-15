"use strict";

const env = require("../config/env")();
const phoneNUmber = env.TWILIO_PHONE_NUMBER
const client = require("twilio")(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * Encrypt the string provided
 * @param body {string} string to send message
 * @param to {string} phone number on which message is to be sent
 * @return: {string} message sid
 */
const sendOtp = (body, to) => {
  client.messages
    .create({
      body: body,
      from: phoneNUmber,
      to: to,
    })
    .then((message) => console.log(message.sid));
};

module.exports = {
  sendOtp,
};
