var express = require('express');
var router = express.Router();
var db = require('./db');

// 로그인 페이지
router.get('/login', (req, res) => {
  res.sendFile('public/loginpage.html', { root: __dirname + '/../' });
});

// 로그인 프로세스
router.post('/login_process', (req, res) => {
  var hakbun = req.body.hakbun;
  var password = req.body.password;

  if (hakbun && password) {
    db.query('SELECT * FROM usertable WHERE username = ? AND password = ?', [hakbun, password], (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        req.session.is_logined = true;
        req.session.nickname = hakbun;
        req.session.save(() => {
          res.redirect('/');
        });
      } else {
        res.send(`<script>alert("로그인 정보가 일치하지 않습니다."); location.href="/auth/login";</script>`);
      }
    });
  } else {
    res.send(`<script>alert("아이디와 비밀번호를 입력하세요!"); location.href="/auth/login";</script>`);
  }
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// 회원가입 페이지
router.get('/register', (req, res) => {
  res.sendFile('public/signuppage.html', { root: __dirname + '/../' });
});

// 회원가입 프로세스
router.post('/register_process', (req, res) => {
  var hakbun = req.body.hakbun;
  var password = req.body.password;
  var repassword = req.body.repassword;

  if (hakbun && password && repassword) {
    db.query('SELECT * FROM usertable WHERE username = ?', [hakbun], (error, results) => {
      if (error) throw error;
      if (results.length <= 0 && password === repassword) {
        db.query('INSERT INTO usertable (username, password) VALUES (?, ?)', [hakbun, password], (err) => {
          if (err) throw err;
          res.send(`<script>alert("회원가입이 완료되었습니다!"); location.href="/auth/login";</script>`);
        });
      } else if (password !== repassword) {
        res.send(`<script>alert("비밀번호가 일치하지 않습니다."); location.href="/auth/register";</script>`);
      } else {
        res.send(`<script>alert("이미 존재하는 아이디입니다."); location.href="/auth/register";</script>`);
      }
    });
  } else {
    res.send(`<script>alert("입력되지 않은 정보가 있습니다."); location.href="/auth/register";</script>`);
  }
});

module.exports = router;
