var express = require('express');
var router = express.Router();
const pool = require('../public/javascripts/database.js')
const multer  = require('multer')
const board = 'b';
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Set up Multer configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 8000000 },
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebM files are allowed.'));
    }
  }
});

router.get('/', function(req, res, next) {
  res.render('classic', { title: '/b/ - Općenito - Jugochan' });
});

router.get('/katalog', function(req, res, next) {

  res.render('catalog', { title: '/b/ - Općenito - Katalog - Jugochan' });

});

router.get('/arhiva', function(req, res, next) {
  res.render('archive', { title: '/b/ - Općenito - Arhiva - Jugochan' });
});



router.get('/thread/:id', function(req, res, next) {
  pool.connect(async (err,client,done) => {
    if(err)
      return res.send(err);
    client.query(`SELECT * FROM post WHERE id = $1`, [req.params.id], async(err, result) => {
      client.query(`SELECT * FROM replies WHERE post_id = $1`, [req.params.id], async(err, replies) => {
        done()
        if (err)
          return res.send(err);
        res.render('thread', {
          title: ('/b/ - ' + result.rows[0].thread_topic + ' ' + result.rows[0].text).substring(0, 47) + '...',
          thread: result.rows[0],
          replies: replies.rows
        });
      });
    });
  });
});

router.post('/post', upload.single('uploaded_file'), function(req, res, next){
  if (!req.body.text) {
    return res.status(400).send('Polje za tekst je neophodno');
  }

  if (req.body.text.length > 2000) {
    return res.status(400).send('Tekst ne može biti duži od 2000 karaktera');
  }

  if (req.body.username.length > 100) {
    return res.status(400).send('Username ne može biti duže od 100 karaktera');
  }

  if (req.body.topic.length > 100) {
    return res.status(400).send('Tema ne može biti duža od 100 karaktera');
  }

  if (!req.file) {
    return res.status(400).send('Morate priložiti fajl');
  }

  var tripcode;
  if(req.body.username.includes('#')){
    split = req.body.username.split('#');
    username = split[0];
    tripcode = split[1];
    bcrypt.hash(tripcode, 10, function (err, hash){
      pool.connect(async (err,client,done) => {
        if(err)
          return res.send(err);
        client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
          if(err)
            return res.send(err);
          client.query(`INSERT INTO post(thread_topic, username, tripcode, text, image_link, board) VALUES($1,$2,$3,$4,$5,$6);`, [req.body.topic, username, hash.substring(0,10), req.body.text, req.file.filename, board], async(err) => {
            done()
            if(err)
              return res.send(err);
            return res.redirect('/b/thread/' + (parseInt(result.rows[0].last_value) + 1));
          })
        })
      })
    });
  }
  else{
    pool.connect(async (err,client,done) => {
      if(err)
        return res.send(err);
      client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
        if(err)
          return res.send(err);
        client.query(`INSERT INTO post(thread_topic, username, text, image_link, board) VALUES($1,$2,$3,$4,$5);`, [req.body.topic, req.body.username, req.body.text, req.file.filename, board], async(err) => {
          done()
          if(err)
            return res.send(err);
          return res.redirect('/b/thread/' + (parseInt(result.rows[0].last_value) + 1));
        })
      })
    })
  }
});


router.post('/reply', upload.single('uploaded_file'), function(req, res, next){
  if (!req.body.text && !req.file) {
    return res.status(400).send('Polje za tekst ili slika su neophodni');
  }

  if (req.body.text.length > 2000) {
    return res.status(400).send('Tekst ne može biti duži od 2000 karaktera');
  }

  if (req.body.username.length > 100) {
    return res.status(400).send('Username ne može biti duže od 100 karaktera');
  }


  var tripcode;

  if (!req.file) {
    if(req.body.username.includes('#')){
      split = req.body.username.split('#');
      username = split[0];
      tripcode = split[1];
      bcrypt.hash(tripcode, 10, function (err, hash){
        pool.connect(async (err,client,done) => {
          if(err)
            return res.send(err);
          client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
            if(err)
              return res.send(err);
            client.query(`INSERT INTO replies(username, tripcode, text, post_id, cookie) VALUES($1,$2,$3,$4,$5);`, [username, hash.substring(0, 10), req.body.text, req.body.thread_id, req.cookies.session_id], async(err) => {
              done()
              if(err)
                return res.send(err);
              return res.redirect('/b/thread/' + req.body.thread_id);
            })
          })
        })
      });
    }
    else{
      pool.connect(async (err,client,done) => {
        if(err)
          return res.send(err);
        client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
          if(err)
            return res.send(err);
          client.query(`INSERT INTO replies(username, text, post_id, cookie) VALUES($1,$2,$3,$4);`, [req.body.username, req.body.text, req.body.thread_id, req.cookies.session_id], async(err) => {
            done()
            if(err)
              return res.send(err);
            return res.redirect('/b/thread/' + req.body.thread_id);
          })
        })
      })
    }
  }

  else{
    if(req.body.username.includes('#')){
      split = req.body.username.split('#');
      username = split[0];
      tripcode = split[1];
      bcrypt.hash(tripcode, 10, function (err, hash){
        pool.connect(async (err,client,done) => {
          if(err)
            return res.send(err);
          client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
            if(err)
              return res.send(err);
            client.query(`INSERT INTO replies(username, tripcode, text, image_link, post_id, cookie) VALUES($1,$2,$3,$4,$5,$6);`, [username, hash.substring(0, 10), req.body.text, req.file.filename, req.body.thread_id, req.cookies.session_id], async(err) => {
              done()
              if(err)
                return res.send(err);
              return res.redirect('/b/thread/' + req.body.thread_id);
            })
          })
        })
      });
    }
    else{
      pool.connect(async (err,client,done) => {
        if(err)
          return res.send(err);
        client.query(`SELECT last_value FROM thread_number`, [], async(err, result) => {
          if(err)
            return res.send(err);
          client.query(`INSERT INTO replies(username, text, image_link, post_id, cookie) VALUES($1,$2,$3,$4,$5);`, [req.body.username, req.body.text, req.file.filename, req.body.thread_id, req.cookie.session_id], async(err) => {
            done()
            if(err)
              return res.send(err);
            return res.redirect('/b/thread/' + req.body.thread_id);
          })
        })
      })
    }
  }
});

router.delete('/delete', function (req, res) {
  const ids = req.body.ids.split(',');
  console.log('admin varijabla: ' + req.app.get('admin'))
  pool.connect(async (err,client,done) => {
    if (err) return res.send(err);

    if(req.app.get('admin' + req.cookies.session_id) === true){
      client.query(`DELETE FROM replies WHERE replies.id = ANY ($1)`, [ids], async(err) => {
        done()
        if (err) return res.send(err)
        return res.send({});
      })
    }
    else{
      client.query(`DELETE FROM replies WHERE replies.id = ANY ($1) AND replies.cookie = $2`, [ids, req.body.cookie], async(err) => {
        done()
        if (err) return res.send(err)
        return res.send({});
      })
    }
  })
});

module.exports = router;
