'use strict';

/**
 * Module dependencies.
 */
const mongoose = require("mongoose");
const { Schema } = mongoose;
const dbModel = require('./db-model');
const answerCollectionName = 'answers';

const answerSchema = {
  text: { type: String, default: null },
  media: { type: String, default: null },
  questionId: { type: Schema.Types.ObjectId, ref: "questions" },
  count: { type: Number, default: 0 },
  usersAnswered: { type: Array, default: [] },
};

const config = {
  timestamps: true
};
const answerModel = new dbModel(answerCollectionName, answerSchema, config);

/**
 * Function to save answer to database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const create = async function(obj) {
  return await answerModel.create(obj);
};

/**
 * Function to find answer to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOne = async function(conditions, selectparams) {
  return await answerModel.findOne(conditions, selectparams);
};

/**
 *  Function to find all answer of company to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const find = async function(conditions, selectparams, limit, sort, skip) {
  return await answerModel.find(conditions, selectparams, limit, sort, skip);
};

/**
 * Function to update answer to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @param options {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOneAndUpdate = async function(conditions, selectparams, options) {
  return await answerModel.findOneAndUpdate(conditions, selectparams, options);
};

/**
 * Function to delete answer from database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const deleteanswer = async function(conditions) {
  return await answerModel.deleteMany(conditions);
};

module.exports = {
  create,
  find,
  findOne,
  findOneAndUpdate,
  deleteanswer
};
