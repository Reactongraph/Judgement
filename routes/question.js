var express = require("express");
var router = express.Router();
const QuestionController = require("../controllers/QuestionController");
const sendResponse = require("../helpers/sendResponse");
const authentication = require("../middlewares/authentication").validateUser;
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

/* Create Question*/
router.post("/", authentication, multipartMiddleware, (req, res) => {
    QuestionController.createQuestion(req.body, req.user, req.files)
    .then((data) => {
      sendResponse.sendSuccessMessage("success", data, res);
    })
    .catch((err) => {
      if (err.isJoi) {
        sendResponse.sendErrorMessage(err.details[0].message, err.name, res);
      } else {
        sendResponse.sendErrorMessage(err.message, {}, res);
      }
    });
});

/* Get Question Details */
router.get("/:id", authentication, (req, res) => {
  QuestionController.getQuestionDetails(req.params)
    .then((data) => {
      sendResponse.sendSuccessMessage("success", data, res);
    })
    .catch((err) => {
      if (err.isJoi) {
        sendResponse.sendErrorMessage(err.details[0].message, {}, res);
      } else {
        sendResponse.sendErrorMessage(err.message, {}, res);
      }
    });
});

/* Get Questions List Api*/
router.get("/", authentication, (req, res) => {
	QuestionController.getList(req.query, req.user).then((data) => {
        sendResponse.sendSuccessMessage('success', data, res);
    }).catch((err) => {
        if (err.isJoi) {
            sendResponse.sendErrorMessage(err.details[0].message, err.name, res);
        }
        else {
            sendResponse.sendErrorMessage(err.message, {}, res);
        }
    });
});

/* Update question Api*/
router.put("/userVoting", (req, res) => {
  QuestionController.userVoting(req.body)
    .then((data) => {
      sendResponse.sendSuccessMessage("success", data, res);
    })
    .catch((err) => {
      if (err.isJoi) {
        sendResponse.sendErrorMessage(err.details[0].message, {}, res);
      } else {
        sendResponse.sendErrorMessage(err.message, {}, res);
      }
    });
});

/* Update Preference Api*/
router.put("/userPreference", authentication, (req, res) => {
  QuestionController.userPreference(req.body, req.user)
    .then((data) => {
      sendResponse.sendSuccessMessage("success", data, res);
    })
    .catch((err) => {
      if (err.isJoi) {
        sendResponse.sendErrorMessage(err.details[0].message, {}, res);
      } else {
        sendResponse.sendErrorMessage(err.message, {}, res);
      }
    });
});

/*Web Page for Question Response*/
router.get("/user-response", (req, res) => {
  QuestionController.userResponse(req.body, req.user)
    .then((data) => {
      sendResponse.sendSuccessMessage("success", data, res);
    })
    .catch((err) => {
      if (err.isJoi) {
        sendResponse.sendErrorMessage(err.details[0].message, {}, res);
      } else {
        sendResponse.sendErrorMessage(err.message, {}, res);
      }
    });
});

module.exports = router;
