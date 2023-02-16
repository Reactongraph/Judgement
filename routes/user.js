var express = require("express");
var router = express.Router();
const UserController = require("../controllers/UserController");
const sendResponse = require("../helpers/sendResponse");
const authentication = require("../middlewares/authentication").validateUser;
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

/* Sign Up Api*/
router.post("/register", (req, res) => {
  UserController.register(req.body)
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

/* Login Api*/
router.post("/login", (req, res) => {
  UserController.login(req.body)
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

/* Get User Profile */
router.get("/:id", authentication, (req, res) => {
  UserController.getUserDetails(req.params)
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

/* Update User Api*/
router.put("/", authentication, multipartMiddleware, (req, res) => {
  UserController.updateUser(req.body, req.user, req.files)
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

/* Forgot Password Api*/
router.post("/forgotPassword", (req, res) => {
  UserController.forgotPassword(req.body)
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

/* Verify OTP Api*/
router.post("/verifyPasswordOtp", (req, res) => {
  UserController.verifyPasswordOtp(req.body)
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

/* Change Password Api*/
router.post("/changePassword", (req, res) => {
  UserController.changePassword(req.body)
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

module.exports = router;
