var express = require('express');
var router = express.Router();
const QuestionController = require("../controllers/QuestionController");

router.get("/terms", (req, res) => {
	res.render("../views/terms.ejs", {});
});

router.get("/privacy", (req, res) => {
	res.render("../views/privacy.ejs", {});
});

router.get("/user-response", (req, res) => {
	QuestionController.userResponse(req.query)
    .then((data) => {
	  res.render("../views/userResponse.ejs", {data: res});
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