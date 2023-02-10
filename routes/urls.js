var express = require('express');
var router = express.Router();

router.get("/terms", (req, res) => {
	res.render("../views/terms.ejs", {});
});

router.get("/privacy", (req, res) => {
	res.render("../views/privacy.ejs", {});
});

module.exports = router;