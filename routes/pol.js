var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('classic', { title: '/pol/ - Politika - Jugochan' });
});

router.get('/katalog', function(req, res, next) {
  res.render('catalog', { title: '/pol/ - Politika - Katalog - Jugochan' });
});

router.get('/arhiva', function(req, res, next) {
  res.render('archive', { title: '/pol/ - Politika - Arhiva - Jugochan' });
});

module.exports = router;
