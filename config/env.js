const constants = require("../config/constants.js");

module.exports = () => {

  switch (process.env.NODE_ENV) {

    case 'staging':
      return {
        PORT: 3001,
        SITEURL: constants.DEVURL,
        MONGO_HOST: process.env.MONGO_HOST || `localhost:${constants.MONGO_PORT}`,
        MONGO_PORT: process.env.MONGO_PORT || constants.MONGO_PORT,
        FROM_MAIL: constants.FROM_MAIL.DEV,
        SMTP_CRED: constants.SMTP_CRED.DEV,
        MAIL_SERVICE: constants.MAIL_SERVICE.DEV,
        EXPIRY: constants.key.tokenExpiry,
        S3DETAILS: constants.s3Details.DEV,
        FCM_SERVER_KEY: constants.FCM.SERVERKEY,
      };

    case 'production':
      return {
        PORT: 3000,
        SITEURL: constants.PRODURL,
        MONGO_HOST: process.env.MONGO_HOST || `localhost:${constants.MONGO_PORT}`,
        MONGO_PORT: process.env.MONGO_PORT || coconstants.MONGO_PORT,
        FROM_MAIL: constants.FROM_MAIL.PROD,
        SMTP_CRED: constants.SMTP_CRED.PROD,
        MAIL_SERVICE: constants.MAIL_SERVICE.PROD,
        EXPIRY: constants.key.tokenExpiry,
        S3DETAILS: constants.s3Details.PROD,
        FCM_SERVER_KEY: constants.FCM.SERVERKEY,
      };

    case 'local':
      return {
        PORT: 3000,
        SITEURL: constants.LOCALURL,
        MONGO_HOST: process.env.MONGO_HOST || `localhost:${constants.MONGO_PORT}`,
        MONGO_PORT: process.env.MONGO_PORT || constants.MONGO_PORT,
        FROM_MAIL: constants.FROM_MAIL.LOCALHOST,
        SMTP_CRED: constants.SMTP_CRED.LOCALHOST,
        MAIL_SERVICE: constants.MAIL_SERVICE.LOCALHOST,
        EXPIRY: constants.key.tokenExpiry,
        S3DETAILS: constants.s3Details.LOCALHOST,
        FCM_SERVER_KEY: constants.FCM.SERVERKEY,
      };

    default:
      return {
        PORT: 3000,
        SITEURL: constants.LOCALURL,
        MONGO_PORT: process.env.MONGO_PORT || constants.MONGO_PORT,
        MONGO_HOST: process.env.MONGO_HOST || `localhost:${constants.MONGO_PORT}`,
        FROM_MAIL: constants.FROM_MAIL.LOCALHOST,
        SMTP_CRED: constants.SMTP_CRED.LOCALHOST,
        MAIL_SERVICE: constants.MAIL_SERVICE.LOCALHOST,
        EXPIRY: constants.key.tokenExpiry,
        S3DETAILS: constants.s3Details.LOCALHOST,
        FCM_SERVER_KEY: constants.FCM.SERVERKEY,
      };
  }
};
