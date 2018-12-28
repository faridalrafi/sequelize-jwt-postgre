var express = require('express');
var jwt = require('jsonwebtoken');
// var bcrypt = require('bcryptjs');
var router = express.Router();
var models = require('../models');

function isAuthenticated (req, res, next) {
  var token = req.body.token || req.query.token || req.headers.authorization; // mengambil token di antara request
  if (token) { // jika ada token
    jwt.verify(token, 'jwtsecret', function (err, decoded) { // jwt melakukan verify
      if (err) { // apa bila ada error
        res.json({ message: 'Failed to authenticate token' }); // jwt melakukan respon
      } else { // apa bila tidak error
        req.decoded = decoded; // menyimpan decoded ke req.decoded
        next(); // melajutkan proses
      }
    });
  } else { // apa bila tidak ada token
    return res.status(403).send({ message: 'No token provided.' }); // melkukan respon kalau token tidak ada
  }
}

/* GET users listing. */

router.get('/', function (req, res) {
  models.User.findAll({}).then(function (users) { res.send(users) })
})

router.post('/create', function (req, res) {
  models.User.create({ name: req.body.name, username: req.body.username, email: req.body.email, password: req.body.password }).then(function () {
    res.send('Success')
  })
});

router.delete('/:user_id/destroy', function (req, res) {
  models.User.destroy({
    where: {
      id: req.params.user_id
    }
  }).then(function () {
    res.redirect('/');
  });
});

router.post('/signin', function (req, res) {
  models.User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (!user) {
      return res.status(404).send('User Not Found.');
    } else {
      // res.status(200).send({ auth: true, accessToken: token });
      if (user.password === req.body.password) { // apabila data password sama dengan user password
        var token = jwt.sign(user.toJSON(), 'jwtsecret', { // melakukan generate token di jwt
          algorithm: 'HS256'
        });

        res.json({ message: 'berhasil login', token: token });
      } else { // apabila salah password
        res.json({ message: 'password salah' });
      }
    }
  }).catch(err => {
    res.status(500).send('Error -> ' + err);
  });
})

// #routes:20 router kusus buat yang sudah login atau sudah punya token
router.get('/private', isAuthenticated, function (req, res, next) {
  res.json({ message: 'halaman harus menggunakan token' });
});
// #routes:30 router yang bersifat public atau bisa di akses semua orang
router.get('/public', function (req, res, next) {
  res.json({ message: 'halaman bisa di akses siapa saja' });
});

module.exports = router;
