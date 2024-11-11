var express = require('express');
var router = express.Router();
const { verifyToken, verifyRole } = require("../middlewares/auth");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Red Social' });
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

// Menú principal (requiere autenticación)
router.get('/menu', verifyToken, verifyRole(['usuario', 'admin']), function (req, res, next) {
  res.render('menu', { title: 'Menú Principal' });
});

module.exports = router;
