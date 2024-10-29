/**Index.js handles core endpoints */

var express = require('express');
var router = express.Router();
const authorization = require("../middleware/authorization");

/* GET base of API. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'This is the base of the video-streaming API made for QUTube' });
});

module.exports = router;
