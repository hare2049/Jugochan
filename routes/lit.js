var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('classic', { title: '/lit/ - Literatura - Jugochan' });
});

router.get('/katalog', function(req, res, next) {
  res.render('catalog', { title: '/lit/ - Literatura - Katalog - Jugochan' });
});

router.get('/arhiva', function(req, res, next) {
  res.render('archive', { title: '/lit/ - Literatura - Arhiva - Jugochan' });
});

module.exports = router;
