const mongoose = require('mongoose');
const Jwt = require("jsonwebtoken");
const fs = require("fs");
const env = require("../config/env")();
// const AWS = require("aws-sdk");
// const s3 = new AWS.S3({
//   accessKeyId: env.S3DETAILS.secretAccessKey,
//   secretAccessKey: env.S3DETAILS.accessKeyId,
//   region: env.S3DETAILS.awsRegion,
// });

const commonController = require("../helpers/common");
const questionModel = require("../models/questions");
const Response = require('../config/response');

const createQuestion = async (payloadData, fileData) => {
  try {
    const schema = Joi.object().keys({
      text: Joi.string().required().max(100),
      answers: Joi.array().items(),
    });
    let payload = await commonController.verifyJoiSchema(payloadData, schema);
    
    if (fileData &&  fileData.images && fileData.images.length) {
        for (const media in fileData.images) {
            await uploadMedia(media)
          }
    }
    const question = await questionModel.create(payload);
    return question;
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
      const questions = await questionModel.find({userId : mongoose.Types.ObjectId(userData.id)}, {}, parseInt(payload.limit), { 'createdAt': -1 }, parseInt(payload.skip));
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
        Bucket: `${env.S3DETAILS.bucket}/${env.S3DETAILS.s3folders.hangouts}`,
        Key: media.originalFilename,
        Body: blob,
        ACL: "public-read",
      })
      .promise();
    return uploadFile;
  }

module.exports = {
  createQuestion: createQuestion,
  getQuestionDetails: getQuestionDetails,
  getList: getList,
};
