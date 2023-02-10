'use strict';

/**
 * Module dependencies.
 */
const dbModel = require('./db-model');
const userCollectionName = 'users';

const userSchema = {
  phone: {
    type: String,
    required: [true, 'phone number is required property']
  },
  userName: { type: String, default: null},
  password: { type: String, default: null},
  syncContacts: { type: Boolean, default: false },
  userContacts: { type: Array, default: null},
  isDeleted: { type: Boolean, default: false },
};

const config = {
  timestamps: true
};
const userModel = new dbModel(userCollectionName, userSchema, config);

/**
 * Function to save user to database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const create = async function(obj) {
  return await userModel.create(obj);
};

/**
 * Function to find user to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOne = async function(conditions, selectparams) {
  return await userModel.findOne(conditions, selectparams);
};

/**
 *  Function to find all user of company to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const find = async function(conditions, selectparams, limit, skip) {
  return await userModel.find(conditions, selectparams, limit, skip);
};

/**
 * Function to update user to database
 * @param conditions {JSON_obj} the json object to be added
 * @param selectparams {JSON_obj} the json object to be added
 * @param options {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const findOneAndUpdate = async function(conditions, selectparams, options) {
  return await userModel.findOneAndUpdate(conditions, selectparams, options);
};

/**
 * Function to delete user from database
 * @param conditions {JSON_obj} the json object to be added
 * @return  the json object to be return
 */
const deleteUser = async function(conditions) {
  return await userModel.delete(conditions);
};

module.exports = {
  create,
  find,
  findOne,
  findOneAndUpdate,
  deleteUser
};
