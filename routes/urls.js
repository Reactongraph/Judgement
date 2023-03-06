var express = require('express');
var router = express.Router();
const QuestionController = require("../controllers/QuestionController");
const Response = require('../config/response');

router.get("/terms", (req, res) => {
	res.render("../views/terms.ejs", {});
});

router.get("/privacy", (req, res) => {
	res.render("../views/privacy.ejs", {});
});

router.get("/thank-you", (req, res) => {
	res.render("../views/thankYou.ejs", {});
});

router.get("/link-expired", (req, res) => {
	res.render("../views/linkExpired.ejs", {});
});

router.get("/user-response", (req, res) => {
	QuestionController.userResponse(req.query)
    .then((data) => {
	  res.render("../views/userResponse.ejs", {data: data});
    })
    .catch((err) => {
      res.render("../views/linkExpired.ejs", {});
    });
});

module.exports = router;