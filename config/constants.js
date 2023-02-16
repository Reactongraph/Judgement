const path = require('path');

const globalConstants = {
  LOCALURL: 'http://localhost:3000',
  LOCALASSERTURL: 'http://localhost:3000/public/',
  DEVURL: 'https://ec2-44-201-37-190.compute-1.amazonaws.com:3000',
  DEVASSERTURL: 'https://ec2-44-201-37-190.compute-1.amazonaws.com:3000/public/',
  PRODURL: '',
  PRODASSERTURL: '',
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_LOG_VERBOSE: Object.prototype.hasOwnProperty.call(process.env, 'MONGO_LOG_VERBOSE')
  ? JSON.parse(process.env.MONGO_LOG_VERBOSE)
  : false,
  key: {
    privateKey: 'c3f42e68-b461-4bc1-ae2c-da9f27ee3a19',
    tokenExpiry: 1 * 30 * 1000 * 60 * 24 //1 hour
  },
  ENCRYPTION_TYPE: 'sha1',
  FROM_MAIL: {
    LOCALHOST: "",
    PROD: "",
    DEV: ""
  },
  MAIL_SERVICE: {
    LOCALHOST: 'Gmail',
    PROD: 'Gmail',
    DEV: 'Gmail'
  },
  SMTP_CRED: {
    LOCALHOST: {
      email: '',
      password: ''
    },
    PROD: {
      email: '',
      password: ''
    },
    DEV: {
      email: '',
      password: ''
    }
  },

  FCM: {
    SERVERKEY: '',
  },
  TWILIO: {
    ACCOUNT_SID: 'AC07131dae3c7baee544006b1cb04bb92f',
    AUTH_TOKEN: '6ef4aa33c69f25f93fce29b7ee86310d',
    PHONE_NUMBER: '+16267413294'
  },
  s3Details: {
    LOCALHOST: {
      bucket: 'thisrthat',
      secretAccessKey: 'GZGDa4X6hjyS5M66qBfxdfMiGAI50kYN9y1N7eXZ',
      accessKeyId: 'AKIAX2QASKRDPBLUU4UN',
      awsRegion: 'us-east-1',
      s3folders: {
        s3Url: '/',
        users: 'users',
      }
    },
    PROD: {
      bucket: 'thisrthat',
      secretAccessKey: 'GZGDa4X6hjyS5M66qBfxdfMiGAI50kYN9y1N7eXZ',
      accessKeyId: 'AKIAX2QASKRDPBLUU4UN',
      awsRegion: 'us-east-1',
      s3folders: {
        s3Url: '/',
        users: 'users',
      }
    },
    DEV: {
      bucket: 'thisrthat',
      secretAccessKey: 'GZGDa4X6hjyS5M66qBfxdfMiGAI50kYN9y1N7eXZ',
      accessKeyId: 'AKIAX2QASKRDPBLUU4UN',
      awsRegion: 'us-east-1',
      s3folders: {
        s3Url: '/',
        users: 'users',
      }
    }
  },
  SETTING_URL: {
    privacy: '',
    terms: ''
  },
};

module.exports = globalConstants;