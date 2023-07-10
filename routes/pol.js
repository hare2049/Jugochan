var express = require('express');
var router = express.Router();
const pool = require('../public/javascripts/database.js')
const multer  = require('multer')
const board = 'pol';
const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

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

//ovde sam STAO!!
router.get('/', function(req, res, next) {
  pool.connect(async (err,client,done) => {
    if(err)
      return res.send(err);
    client.query(`SELECT * FROM post WHERE board = $1 ORDER BY most_recent_reply DESC LIMIT 20`, [board], async (err, result) => {
      let thread_ids = result.rows.map(row => row.id);
      client.query(`SELECT * FROM replies WHERE post_id = ANY($1::int[]) ORDER BY created_at`, [thread_ids], async(err, resultreplies) => {
        done()
        if(err) return res.send(err)
        res.render('classic', {
          title: '/pol/ - Politika - Jugochan',
          threads: result.rows,
          replies: resultreplies.rows,
          board: board,
          pagenum: 1,
          browser_cookie: req.cookies.session_id
        });
      })
    })
  })
});

router.get('/katalog', function(req, res, next) {
  pool.connect(async (err,client,done) => {
    if(err)
      return res.send(err);
    client.query(`
              SELECT post.*, COUNT(replies.id) AS reply_count 
              FROM post 
              LEFT JOIN replies ON post.id = replies.post_id 
              WHERE post.board = $1 
              GROUP BY post.id 
              ORDER BY most_recent_reply DESC
              LIMIT 200
      `, [board], async (err, result) => {
      done()
      console.log(result.rows)
      if(err) return res.send(err)
      console.log(result);
      res.render('catalog', {
        title: '/pol/ - Politika - Katalog - Jugochan' ,
        board: board,
        threads: result.rows
      });
    })
  })
});

router.get('/arhiva', function(req, res, next) {
  pool.connect(async (err, client, done) => {
    if(err)
      return res.send(err)
    client.query(`SELECT * FROM post WHERE board = $1 ORDER BY most_recent_reply DESC OFFSET 200`, [board], async(err, result) => {
      done()
      if(err) res.send(err);
      console.log(result);
      res.render('archive', {
        title: '/pol/ - Politika - Arhiva - Jugochan',
        threads: result.rows,
        board: board
      });
    })
  })
});



router.get('/thread/:id', function(req, res, next) {
  pool.connect(async (err,client,done) => {
    if(err)
      return res.send(err);
    client.query(`SELECT * FROM post WHERE id = $1`, [req.params.id], async(err, result) => {
      if(err) return res.send(err)
      if(result.rows.length === 0)
        return res.send("Thread does not exist")
      if(result.rows[0].board !== board) {
        return res.send("Board and thread do not match")
      }
      client.query(`SELECT * FROM replies WHERE post_id = $1`, [req.params.id], async(err, replies) => {
        done()
        if (err)
          return res.send(err);
        res.render('thread', {
          title: ('/pol/ - ' + result.rows[0].thread_topic + ' ' + result.rows[0].text).substring(0, 47) + '...',
          thread: result.rows[0],
          board: board,
          replies: replies.rows,
          browser_cookie: req.cookies.session_id
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
            return res.redirect('/pol/thread/' + (parseInt(result.rows[0].last_value) + 1));
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
          return res.redirect('/pol/thread/' + (parseInt(result.rows[0].last_value) + 1));
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
              return res.redirect('/pol/thread/' + req.body.thread_id);
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
            return res.redirect('/pol/thread/' + req.body.thread_id);
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
              return res.redirect('/pol/thread/' + req.body.thread_id);
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
          client.query(`INSERT INTO replies(username, text, image_link, post_id, cookie) VALUES($1,$2,$3,$4,$5);`, [req.body.username, req.body.text, req.file.filename, req.body.thread_id, req.cookies.session_id], async(err) => {
            done()
            if(err)
              return res.send(err);
            return res.redirect('/pol/thread/' + req.body.thread_id);
          })
        })
      })
    }
  }
});

router.delete('/delete', function (req, res) {
  const ids = req.body.ids.split(',');
  const thread_ids_with_t = ids.filter(val => val.startsWith('t-'));
  const thread_ids = thread_ids_with_t.map(val => val.slice(2));
  const reply_ids = ids.filter(val => !val.startsWith('t-'));

  console.log(ids);
  console.log(thread_ids);
  console.log(reply_ids);
  console.log('admin varijabla: ' + req.app.get('admin'))
  pool.connect(async (err,client,done) => {
    if (err) return res.send(err);

    if(req.app.get('admin' + req.cookies.session_id) === true){
      client.query(`DELETE FROM replies WHERE replies.id = ANY ($1)`, [reply_ids], async(err) => {
        if (err) {
          done();
          return res.send(err);
        }

        client.query(`DELETE FROM replies WHERE post_id IN (SELECT id FROM post WHERE id=ANY($1))`, [thread_ids], async (err) => {
          if (err) {
            done();
            return res.send(err);
          }

          client.query(`DELETE FROM post WHERE id = ANY($1)`, [thread_ids], async (err) => {
            done();
            if(err) return res.send(err);
            return res.send({});
          })


        })

      })
    }
    else{
      client.query(`DELETE FROM replies WHERE replies.id = ANY ($1) AND replies.cookie = $2`, [reply_ids, req.body.cookie], async(err) => {
        done()
        if (err) return res.send(err)
        return res.send({});
      })
    }
  })
});


router.get('/:pagenum', function(req, res, next) {
  const pagenum = req.params.pagenum;

  if(pagenum > 10){
    res.sendStatus(404);
  }

  const offset = (pagenum-1) * 20;

  pool.connect(async (err,client,done) => {
    if(err)
      return res.send(err);
    client.query(`SELECT * FROM post WHERE board = $1 ORDER BY most_recent_reply DESC LIMIT 20 OFFSET $2`, [board, offset], async (err, result) => {
      let thread_ids = result.rows.map(row => row.id);
      client.query(`SELECT * FROM replies WHERE post_id = ANY($1::int[]) ORDER BY created_at`, [thread_ids], async(err, resultreplies) => {
        done()
        if(err) return res.send(err)
        res.render('classic', {
          title: '/pol/ - Politika - Jugochan',
          threads: result.rows,
          replies: resultreplies.rows,
          board: board,
          pagenum: pagenum,
          browser_cookie: req.cookies.session_id
        });
      })
    })
  })
});

module.exports = router;
