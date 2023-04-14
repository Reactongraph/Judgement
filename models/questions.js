'use strict';

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const dbModel = require('./db-model');
const questionCollectionName = 'questions';

const questionSchema = {
  text: { type: String, default: null },
  media: { type: String, default: null },
  userId: { type: Schema.Types.ObjectId, ref: "users" },
  usersAnswered: { type: Array, default: [] },
  linkExpiredDate: { type: Date },
  isMajority: { type: Boolean },
  userVoteCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
};

const config = {
  timestamps: true
};
const questionModel = new dbModel(questionCollectionName, questionSchema, config);

/**
 * Function to save question to database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const create = async function(obj) {
  return await questionModel.create(obj);
};

/**
 * Function to find question to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOne = async function(conditions, selectparams) {
  return await questionModel.findOne(conditions, selectparams);
};

/**
 *  Function to find all question of company to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const find = async function(conditions, selectparams, limit, sort, skip) {
  return await questionModel.find(conditions, selectparams, limit, sort, skip);
};

/**
 *  Function to find all hangout of user to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const aggregate = async (conditions) => {
  return await questionModel.aggregate(conditions);
};

/**
 * Function to update question to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @param options {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOneAndUpdate = async function(conditions, selectparams, options) {
  return await questionModel.findOneAndUpdate(conditions, selectparams, options);
};

/**
 * Function to delete question from database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const deleteQuestion = async function(conditions) {
  return await questionModel.deleteMany(conditions);
};

module.exports = {
  create,
  find,
  findOne,
  findOneAndUpdate,
  deleteQuestion,
  aggregate,
};
