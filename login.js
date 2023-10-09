const express=require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const db=require('./cnonnect_mysql');
const Joi=require('joi');
const ejs = require('ejs')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10)

const sessionMiddleware = require('./session');

app.use(sessionMiddleware());

function handleLogin(req, res) {

    if(!req.session.user){

        let loginvalidationMessige=null;
        res.render('./auth/login', { loginvalidationMessige });
       }else{
       
       res.redirect('/');
     }
  }
  function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let loginvalidationMessige=null

    db.query("SELECT * FROM users WHERE email = ?", email, function(error, results) {
      if (error) throw error;
     
      if (results.length === 0) {

        loginvalidationMessige='Invalid email or password';
        res.render(path.join(__dirname, 'views', './auth/login'), { loginvalidationMessige });
      } else {
        const hashedPassword = results[0].password;
        bcrypt.compare(password, hashedPassword, function(error, passwordsMatch) {
          if (error) throw error;
  
          if (passwordsMatch) {

            req.session.user = results[0];

            res.redirect('/');

          } else {
            loginvalidationMessige='Invalid email or password';
            res.render(path.join(__dirname, 'views', './auth/login'), { loginvalidationMessige });
          }
        });
      }
    });
  }

  function log_out(req,res){

    req.session.destroy();
    res.redirect('/')
  }
  module.exports = { handleLogin, login,log_out };