var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  console.log('admin varijabla: ' + req.app.get('admin'))
  res.render('index', { title: 'Jugochan' });
});

module.exports = router;
