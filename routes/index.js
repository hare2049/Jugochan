var express = require('express');
var router = express.Router();
const pool = require('../public/javascripts/database.js')

router.get('/', function(req, res, next) {
  pool.connect(async (err, client, done) => {
    if(err)
      return res.send(err)
    client.query(`SELECT * FROM post ORDER BY most_recent_reply DESC LIMIT 5`, async(err, result) => {
      res.render('index', {
        title: 'Jugochan',
        threads: result.rows
      });

    })
  })
});

module.exports = router;
