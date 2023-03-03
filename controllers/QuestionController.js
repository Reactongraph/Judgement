const mongoose = require('mongoose');
const moment = require('moment');
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
const answerModel = require("../models/answers");
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

      // save link expired date
      payload.linkExpiredDate = moment().add(
        24,
        "hours"
      );

      // create question
      const question = await questionModel.create(payload);

      // logic to create answers
      for( const [index, ans] of payload.answers.entries()) {
        const answersMedia = fileData && fileData.answersMedia ? fileData.answersMedia : [];
        if (answersMedia[index] && answersMedia[index].type != null) {
          await answerModel.create({text : payload.answers[index], media: answersMedia[index].originalFilename, questionId: question._id});
          uploadMedia(answersMedia[index]);
        }else{
          await answerModel.create({text: payload.answers[index], media: null, questionId: question._id});
        }
      }
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
    const conditions = [
      {$match: 
        {_id: mongoose.Types.ObjectId(payload.id)},
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "answers",
        },
      },
      {$project: {"text":1, "media":1, "userId":1, "isMajority": 1,"answers._id": 1,"userVoteCount":1, "answers.text":1, "answers.media":1, "answers.count":1} },
    ];
    const question = await questionModel.aggregate(conditions);
    if (!question) {
      throw Response.error_msg.notFound;
    }
    // add answer percentage
    if (question && question.length) {
      let result = question[0];
      for (let item of result.answers) {
        if (result.userVoteCount && result.userVoteCount != 0) {
          item.percentage = (item.count * 100 / result.userVoteCount).toFixed(2).toString();
        } else {
          item.percentage = "0";
        }
      }
      return result;
    }

    return {};
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

const userVoting = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      aid: Joi.string().required(),
      phid: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);

    const answerData = await answerModel.findOne({ _id: payload.aid });
    if (!answerData) {
      throw Response.error_msg.notFound;
    }

    const questionData = await questionModel.findOne({ _id: answerData.questionId });
    if (!questionData) {
      throw Response.error_msg.notFound;
    }
    if ((questionData.linkExpiredDate && questionData.linkExpiredDate < moment()) || questionData.hasOwnProperty("isMajority")) {
      throw Response.error_msg.LINK_EXPIRED;
    }
    
    if (questionData.usersAnswered && questionData.usersAnswered.length && questionData.usersAnswered.findIndex(item => item === payload.phid) > -1 ) {
      throw Response.error_msg.ALREADY_ANSWERED;
    }
    //increase anwer count
    await answerModel.findOneAndUpdate(
      { _id: payload.aid},
      { $inc: { count: 1 }},
      { new: true }
    );
    await questionModel.findOneAndUpdate(
      { _id: questionData._id},
      { $push: { "usersAnswered": payload.phid  }, $inc: { userVoteCount: 1 }  },
      { new: true }
    );
    
    return {};
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const userPreference = async (payloadData, userData) => {
  try {
    const schema = Joi.object().keys({
      questionId: Joi.string().required(),
      isMajority:  Joi.boolean().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);

    const questionData = await questionModel.findOne({ _id: payload.questionId });
    if (!questionData) {
      throw Response.error_msg.notFound;
    }

    if (userData.id != questionData.userId) {
      throw Response.error_msg.implementationError;
    }
    
    await questionModel.findOneAndUpdate(
      { _id: payload.questionId},
      {  isMajority: payload.isMajority},
      { new: true }
    );
    
    return {};
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const userResponse = async (payloadData) => {
  try {
    const schema = Joi.object().keys({
      qid: Joi.string().required(),
      phid: Joi.string().required(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    const conditions = [
      {$match: 
        {_id: mongoose.Types.ObjectId(payload.qid)},
      },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "questionId",
          as: "answers",
        },
      },
      {$project: {"text":1, "media":1, "userId":1,"usersAnswered": 1, "answers._id": 1,"userVoteCount":1, "answers.text":1, "answers.media":1, "answers.count":1} },
    ];
    const questionDetails = await questionModel.aggregate(conditions);
    if (!questionDetails) {
      throw Response.error_msg.notFound;
    }
    var questionData = questionDetails[0];
    if ((questionData.linkExpiredDate && questionData.linkExpiredDate < moment()) || questionData.hasOwnProperty("isMajority")) {
      throw Response.error_msg.LINK_EXPIRED;
    }
    if (questionData.usersAnswered && questionData.usersAnswered.length && questionData.usersAnswered.findIndex(item => item === payload.phid) > -1 ) {
      throw Response.error_msg.ALREADY_ANSWERED;
    }
    questionData.s3Url = process.env.S3URL;
    questionData.baseUrl = process.env.URL;
    return questionData;
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
function getUserContacts(data, question, answerMessage) {  
  let userContacts = data.userContacts;
  if (data.isRandomize) {
    userContacts = _.shuffle(userContacts);
    userContacts.length = 10;
  }
  
  // let contactString = encodeURIComponent("+919041823411");
  // const message = `Hey! I need your help making a quick decision. The link below will open a '${question.text}' question. Let me know what you think I should do and I'll let you know what my final decision is. \n${process.env.URL}/urls/user-response?qid=${question._id}&phid=${contactString}`;
  //   console.log('message', message)
    // TWILIO.sendMessage(message, '+919041823411');
  for (const contact of userContacts) {
    let contactString = encodeURIComponent(contact);
    const message = `Hey! I need your help making a quick decision. The link below will open a '${question.text}' question. Let me know what you think I should do and I'll let you know what my final decision is. \n${process.env.URL}/user-response?qid=${question._id}&phid=${contactString}`;
    TWILIO.sendMessage(message, `${contact}`);
  }
}

module.exports = {
  createQuestion: createQuestion,
  getQuestionDetails: getQuestionDetails,
  getList: getList,
  userVoting: userVoting,
  userPreference: userPreference,
  userResponse: userResponse
};
