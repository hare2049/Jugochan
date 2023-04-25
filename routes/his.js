var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('classic', { title: '/his/ - Historija - Jugochan' });
});

router.get('/katalog', function(req, res, next) {
  res.render('catalog', { title: '/his/ - Historija - Katalog - Jugochan' });
});

router.get('/arhiva', function(req, res, next) {
  res.render('archive', { title: '/his/ - Historija - Arhiva - Jugochan' });
});

module.exports = router;
