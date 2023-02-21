const mongoose = require('mongoose');
const fs = require("fs");
const _ = require('underscore');
const env = process.env;
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  accessKeyId: env.ACCESS_KEY_ID,
  secretAccessKey: env.SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

const commonController = require("../helpers/common");
const questionModel = require("../models/questions");
const userModel = require("../models/users");
const Response = require('../config/response');
const TWILIO = require('../helpers/twilio');
const messages = require('../config/messages');

const createQuestion = async (payloadData, userData, fileData) => {
  try {
    const schema = Joi.object().keys({
      text: Joi.string().required().max(150),
      answers: Joi.array().items(Joi.string()),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    
    payload.userId = userData.id;
    const user = await userModel.findOne({ _id: userData.id });

    //check user contacts
    if (user && user.userContacts && user.userContacts.length) {

      if (fileData &&  fileData.media) {
        uploadMedia(fileData.media)
        payload.media= fileData.media.originalFilename;
      }

      // logic to create answers
      let newAnsArr = [];
      for( const [index, ans] of payload.answers.entries()) {
        const answersMedia = fileData && fileData.answersMedia ? fileData.answersMedia : [];
        if (answersMedia[index] && answersMedia[index].type != null) {
          newAnsArr.push({text : payload.answers[index], media: answersMedia[index].originalFilename});
          uploadMedia(answersMedia[index]);
        }else{
          newAnsArr.push({text: payload.answers[index], media: null})
        }
      }
      payload.answers = newAnsArr;
      // create question
      const question = await questionModel.create(payload);

      // get user contacts and send message
      getUserContacts(user, question);

      return question;
    }
    return Response.error_msg.NO_CONTACTS_FOUND;

  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getQuestionDetails = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    const question = await questionModel.findOne({ _id: payload.id });
    if (!question) {
      throw Response.error_msg.notFound;
    }
    return question;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getList = async (payloadData, userData) => {
    try {
      const schema = Joi.object().keys({
        limit: Joi.number().required(),
        skip: Joi.number().required(),
      });
      let payload = await commonController.verifyJoiSchema(payloadData, schema);
      const questions = await questionModel.find({userId : mongoose.Types.ObjectId(userData.id)}, {"_id": 1, "text": 1}, parseInt(payload.limit), { 'createdAt': -1 }, parseInt(payload.skip));
      return questions;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

// media upload function
async function uploadMedia(media) {
    const mediaPath = media.path;
    const blob = fs.createReadStream(mediaPath);
    const uploadFile = await s3
      .upload({
        Bucket: `${env.BUCKET}`,
        Key: media.originalFilename,
        Body: blob,
        ACL: "public-read",
      })
      .promise();
    return uploadFile;
  }

// use contacts send message logic
function getUserContacts(data, question) {  
  let userContacts = data.userContacts;
  if (data.isRandomize) {
    userContacts = _.shuffle(userContacts);
    userContacts.length = 10;
  }
  const message = `${messages.TWILIO.QUESTION_HEADING}${question.text}`;
  // TWILIO.sendMessage(message, `+919041823411`);
  for (const contact of userContacts) {
    TWILIO.sendMessage(message, `${contact}`);
  }
}

module.exports = {
  createQuestion: createQuestion,
  getQuestionDetails: getQuestionDetails,
  getList: getList,
};
