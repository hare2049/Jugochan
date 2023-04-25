var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('classic', { title: '/mu/ - Muzika - Jugochan' });
});

router.get('/katalog', function(req, res, next) {
  res.render('catalog', { title: '/mu/ - Muzika - Katalog - Jugochan' });
});

router.get('/arhiva', function(req, res, next) {
  res.render('archive', { title: '/mu/ - Muzika - Arhiva - Jugochan' });
});

module.exports = router;
