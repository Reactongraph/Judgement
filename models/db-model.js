'use strict';

/**
 * Model gives common functions that are used in other models.The auditing of database operations are performed in this module
 * @module models/db_model
 * @type {connectionInstance|exports}
 */
const mongoConnection = require('../dbConnection');
const dbObj = mongoConnection.connectDB;
const Schema = mongoConnection.Schema;
const promise = require('promise');
const pagination = require('mongoose-paginate');

module.exports = function(collection, DBSchema, config) {
  let options = { collection, versionKey: false };
  let schemaConfig = {
    counter: false,
    writeConcern: false,
    strict: true,
    minimize: false,
    readPref: false,
    timestamps: false,
    underscoreId: true
  };
  schemaConfig = Object.assign(schemaConfig, config);
  const counter = schemaConfig.counter;
  options = setMinimizeOption(
    schemaConfig.minimize,
    schemaConfig.strict,
    options
  );
  options = setStrictOption(schemaConfig.strict, options);
  options = setWriteConcern(schemaConfig.writeConcern, options);
  options = setReadConcernOptions(schemaConfig.readPref, options);
  options = setDefaultTimeStamp(schemaConfig.timestamps, options);
  options = unsetDefaultUnderscoreId(schemaConfig.underscoreId, options);
  this.accessSchema = new Schema(DBSchema, options);
  this.accessSchema.plugin(pagination);
  this.collectionObj = dbObj.model(collection, this.accessSchema);
  this.collectionName = collection;
  this.accessSchema.pre('save', function preSave(next) {
    next();
  });

  /**
   * Function finds a document in the collection using its id
   * @param objId {String} object id of the document to fetch
   * @param cb {String} the callback function
   */
  this.findById = function(objid, selectparams) {
    return new Promise((resolve, reject) => {
      const query = this.collectionObj.findById(objid);
      if (selectparams) {
        query.select(selectparams);
      }
      query.lean().exec((err, docs) => {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Finds a single document in the collection using criteria passed
   * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
   * @param selectparams {string} the select parameters 'usr_id email'
   * @param cb {String} the callback function
   */
  this.findOne = function(conditions, selectparams, pref) {
    return new Promise((resolve, reject) => {
      let query = this.collectionObj.findOne(conditions);
      query = setReadPref(pref, query);

      if (selectparams) {
        query.select(selectparams);
      }
      query.lean().exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Finds  document by the criteria passed and the limit from the database
   * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
   * @param selectparams {String} the select parameters 'usr_id email'
   * @param limit {int} the limit to decide row count, default
   * @param sort {JSON_obj} the sorting attributes
   * @param cb {String} the callback function
   */
  this.find = function(conditions, selectparams, limit, sort, skip, pref) {
    return new Promise((resolve, reject) => {
      let query = this.collectionObj.find(conditions);
      query = setReadPref(pref, query);
      query = setQueryLimit(limit, query);
      query = setQuerySkip(skip, query);
      query = setQuerySortOptions(sort, query);
      query = setQuerySelectParams(selectparams, query);
      query.lean().exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };
  /**
   * Finds  document by the criteria passed and the limit from the database
   * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
   * @param selectparams {String} the select parameters 'usr_id email'
   * @param limit {int} the limit to decide row count, default
   * @param sort {JSON_obj} the sorting attributes
   * @param cb {String} the callback function
   */
  this.findByPopulate = function(conditions, selectparams, limit, sort, skip, pref) {
    return new Promise((resolve, reject) => {
      let query = this.collectionObj.find(conditions).populate({path: "",select: ''});
      query = setReadPref(pref, query);
      query = setQueryLimit(limit, query);
      query = setQuerySkip(skip, query);
      query = setQuerySortOptions(sort, query);
      query = setQuerySelectParams(selectparams, query);
      query.lean().exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };
  /**
   * Finds  document by the criteria passed and the limit from the database
   * @param conditions {JSON_obj} the condition criteria{eml:'test@gmail.com'}
   * @param selectparams {String} the select parameters 'usr_id email'
   * @param limit {int} the limit to decide row count, default
   * @param skip {int} the skip to skip number of result
   * @param sort {JSON_obj} the sorting attributes
   * @param cb {String} the callback function
   */
  this.findWithSkip = function(
    conditions,
    selectparams,
    limit,
    sort,
    skip,
    pref
  ) {
    return new Promise((resolve, reject) => {
      let query = this.collectionObj.find(conditions);
      query = setReadPref(pref, query);
      query = setQueryLimit(limit, query);
      query = setQuerySortOptions(sort, query);
      query = setQuerySelectParams(selectparams, query);
      query = setQuerySkipOptions(query, skip, limit);
      query.lean().exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Function to get total search count
   * @param condition {JSON_obj} the search condition
   * @param selectParams {JSON_obj} the selected parameters
   * @param cb {String} the callback function
   */
  this.findSearchCount = function(condition, selectParams) {
    return new Promise((resolve, reject) => {
      const query = this.collectionObj.find(condition);
      if (selectParams) {
        query.select(selectParams);
      }
      query.lean().exec(function(err, docs) {
        if (err) {
          err.message = 'No matching records';
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Function creates a document, inserts a document in the collection with autoincrement id
   * @param data {JSON_obj} the object data to be inserted
   * @param cb {String} the callback function
   */
  this.create = function(data) {
    return new Promise((resolve, reject) => {
      const conn = this.collectionObj;
      insertRec(conn, data)
        .then(doc => {
          resolve(doc);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  /**
   * Function to creates a document, inserts a document in the collection
   * @param conn {JSON_obj} the collection object
   * @param data {JSON_obj} the object data to be inserted
   * @param cb {String} the callback function
   */
  const insertRec = function(conn, data) {
    return new Promise((resolve, reject) => {
      const newRecord = conn(data);
      newRecord.save((err, obj) => {
        if (err) {
          reject(err);
        } else {
          const leanObject = obj.toObject();
          leanObject.schema = null;
          resolve(leanObject);
        }
      });
    });
  };

  this.insertMany = function(data) {
    return new Promise((resolve, reject) => {
      this.collectionObj.insertMany(data, function(err, docs) {
        if (docs) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  };

  /**
   * Function to updates a document
   * @param conditions {JSON_obj} containing the where clause
   * @param update {JSON_obj} contains the values to be set
   * @param options {JSON_obj} can contain such as {upsert:true}
   * @param cb {String} the callback function
   */
  this.update = function(conditions, update, options) {
    return new Promise((resolve, reject) => {
      if (!update.mod_on) {
        //update.mod_on = parseInt(ts);
      }
      this.collectionObj.update(conditions, update, options, function(
        err,
        docs
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Function to delete a document
   * @param conditions {JSON_obj}containing where clause
   * @param cb {String} the callback function
   */
  this.delete = function(conditions) {
    return new Promise((resolve, reject) => {
      this.collectionObj.remove(conditions, function(err, resp) {
        if (err) {
          reject(err);
        }
        resolve(resp);
      });
    });
  };

  /**
   * Function to delete all document
   * @param conditions {JSON_obj}containing where clause
   * @param options sets query optio
   */
  this.deleteMany = function(conditions) {
    return new Promise((resolve, reject) => {
      this.collectionObj.remove(conditions, function(err, resp) {
        if (err) {
          reject(err);
        }
        resolve(resp);
      });
    });
  };
  /**
   * Function finds document by id and updates doc
   * @param Id {String} containing object Id
   * @param update {JSON_obj} contains the set parameters
   * @param {JSON_obj} options include:
   * new: bool - true to return the modified document rather than the original. defaults to true
   * upsert: bool - creates the object if it doesn't exist. defaults to false.
   * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
   * select: sets the document fields to return
   * @param cb {String} the callback function
   */
  this.findByIdAndUpdate = function(Id, update, options) {
    return new Promise((resolve, reject) => {
      this.collectionObj.findByIdAndUpdate(Id, update, options, (err, resp) => {
        if (err) {
          reject(err);
        } else {
          const leanObject = resp.toObject();
          leanObject.schema = null;
          resolve(leanObject);
        }
      });
    });
  };

  /**
   * to get the sub document of a clollection
   * @param1 match {JSON_obj} eliminates parents with no children
   * @param2 unwind {String} considers useful documents
   * @param3 match2 {JSON_obj} removes $unwind output that doesn't match,
   * @param callback {String} the callback function
   */
  this.aggregate = function(stages) {
    return new Promise((resolve, reject) => {
      this.collectionObj.aggregate(
        stages,
        (err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        }
      );
    });
  };

  this.fieldsAggregate = function(match, group) {
    return new Promise((resolve, reject) => {
      this.collectionObj.aggregate(
        { $match: match },
        { $group: group },
        (err, docs) => {
          if (err) {
            reject(err);
          } else {
            resolve(docs);
          }
        }
      );
    });
  };

  /**
   * Function creates a document, inserts a document in the collection with autoincrement id
   * @param data {JSON_obj} the object data to be inserted
   * @param cb {String} the callback function
   */

  this.create = async function(data) {
    const collectionObj = this.collectionObj;
    const collectionName = this.collectionName;
    if (counter) {
      const output = await this.getNextSequence(collectionName);
      data.id = output.seq;
    }
    const doc = await insertRec(collectionObj, data);
    return doc;
  };

  this.insertMany = function(data) {
    return new Promise((resolve, reject) => {
      this.collectionObj.insertMany(data, function(err, docs) {
        if (docs) {
          resolve(docs);
        } else {
          reject(err);
        }
      });
    });
  };

  /**
   * Function to updates a document
   * @param conditions {JSON_obj} containing the where clause
   * @param update {JSON_obj} contains the values to be set
   * @param options {JSON_obj} can contain such as {upsert:true}
   * @param cb {String} the callback function
   */
  this.update = function(conditions, update, options, cb) {
    return new Promise((resolve, reject) => {
      if (!update.mod_on) {
        //update.mod_on = parseInt(ts);
      }
      this.collectionObj.update(conditions, update, options, function(
        err,
        docs
      ) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };

  /**
   * Function to delete a document
   * @param conditions {JSON_obj}containing where clause
   * @param cb {String} the callback function
   */
  this.delete = function(conditions) {
    return new Promise((resolve, reject) => {
      this.collectionObj.remove(conditions, function(err, resp) {
        if (err) {
          reject(err);
        }
        resolve(resp);
      });
    });
  };

  /**
   * Function finds document by id and updates doc
   * @param Id {String} containing object Id
   * @param update {JSON_obj} contains the set parameters
   * @param {JSON_obj} options include:
   * new: bool - true to return the modified document rather than the original. defaults to true
   * upsert: bool - creates the object if it doesn't exist. defaults to false.
   * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
   * select: sets the document fields to return
   * @param cb {String} the callback function
   */
  this.findByIdAndUpdate = function(Id, update, options) {
    return new Promise((resolve, reject) => {
      this.collectionObj.findByIdAndUpdate(Id, update, options, (err, resp) => {
        if (err) {
          reject(err);
        } else {
          const leanObject = resp.toObject();
          leanObject.schema = null;
          resolve(leanObject);
        }
      });
    });
  };

  /**
   * Function finds document by id and updates document
   * @param conditions {JSON_obj} the condition for selection criteria
   * @param update {JSON_obj} contains the set parameters
   * @param options {JSON_obj}  include:
   * new: bool - true to return the modified document rather than the original. defaults to true
   * upsert: bool - creates the object if it doesn't exist. defaults to false.
   * sort: if multiple docs are found by the conditions, sets the sort order to choose which doc to update
   * select: sets the document fields to return
   */
  this.findOneAndUpdate = function(conditions, update, options) {
    return new Promise((resolve, reject) => {
      this.collectionObj.findOneAndUpdate(conditions, update, options, function(
        err,
        resp
      ) {
        if (err) {
          reject(err);
        } else {
          const leanObject = resp.toObject();
          leanObject.schema = null;
          resolve(leanObject);
        }
      });
    });
  };

  /**
   * get count
   * @param condition {JSON_obj} where conditions
   * @param callback {String} the callback function
   */
  this.getCount = function(condition) {
    return new Promise((resolve, reject) => {
      this.collectionObj.count(condition, (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
    });
  };

  this.findStream = function(conditions, selectparams, limit, sort) {
    return new promise((resolve, reject) => {
      let query = this.collectionObj.find(conditions);
      query = setQueryLimit(limit, query);
      query = setQuerySortOptions(sort, query);
      query = setQuerySelectParams(selectparams, query);
      query.lean(true);

      const modelStream = query.cursor();
      resolve(modelStream);
    });
  };

  /**
   * Function to get distinct values
   * @param field key to be distinct
   * @param conditions
   */
  this.distinct = function(field, conditions) {
    return new Promise((resolve, reject) => {
      const query = this.collectionObj.distinct(field, conditions);
      query.lean().exec(function(err, docs) {
        if (err) {
          reject(err);
        } else {
          resolve(docs);
        }
      });
    });
  };
};

function setReadPref(pref, query) {
  if (pref && pref.sp) {
    query = query.read('sp');
  }
  return query;
}

function setQueryLimit(limit, query) {
  if (limit) {
    query.limit(limit);
  }
  return query;
}

function setQuerySkip(skip, query) {
  if (skip) {
    query.skip(skip);
  }
  return query;
}

function setQuerySortOptions(sort, query) {
  if (sort) {
    query.sort(sort);
  }
  return query;
}

function setQuerySkipOptions(query, skip, limit) {
  if (skip) {
    query.skip((skip - 1) * limit);
  }
  return query;
}

function setQuerySelectParams(selectparams, query) {
  if (selectparams) {
    query.select(selectparams);
  }
  return query;
}

function setMinimizeOption(minimize, strict, options) {
  if (minimize == false) {
    options.minimize = strict;
  }
  return options;
}

function setStrictOption(strict, options) {
  if (strict == false) {
    options.strict = strict;
  }
  return options;
}

function setWriteConcern(writeConcern, options) {
  if (writeConcern == true) {
    options.safe = { w: 'majority', wtimeout: 5000 };
  }
  return options;
}

function setReadConcernOptions(readPref, options) {
  if (readPref) {
    options.safe = { read: 'nearest' };
  }
  return options;
}

function setDefaultTimeStamp(isDefault, options) {
  if (isDefault) {
    options.timestamps = true;
  }
  return options;
}
function unsetDefaultUnderscoreId(isDefault, options) {
  if (!isDefault) {
    options._id = false;
  }
  return options;
}
