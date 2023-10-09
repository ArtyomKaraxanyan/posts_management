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

function handleRegister(req, res) {
    if(!req.session.user){
        var validationMessige='';
        const new_user = {
          first_name: '',
          last_name: '',
          email: '',
          password: '',
        };
        res.render('./auth/register', { validationMessige,new_user });
    
       }else{
       
       res.redirect('/');
     }
  }
  function register(req, res) {
    const new_user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
      };
      
      db.query('SELECT * FROM users WHERE email = ?', new_user.email, function (error, results, fields) {
        if (error) throw error;
      
        if (results.length > 0) {
  
          var validationMessige = [{ message: 'Email is already in use' }];
  
          res.render(path.join(__dirname, 'views', './auth/register'), { validationMessige, new_user });
        } else {
  
          const schema = Joi.object({
            first_name: Joi.string().max(20).required(),
            last_name: Joi.string().max(20).required(),
            email: Joi.string().required().email(),
            password: Joi.string().min(6).max(25).required(),
          });
      
          const validation = schema.validate(new_user, { abortEarly: false });
      
          if (validation.error) {
            var validationMessige = validation.error.details;
            res.render(path.join(__dirname, 'views', './auth/register'), { validationMessige, new_user });
          } else {
            const hashedPassword = bcrypt.hashSync(new_user.password, salt);
            new_user.password = hashedPassword;
      
            db.query('INSERT INTO users SET ?', new_user, function (error, results, fields) {
              if (error) throw error;
              console.log('New user ID:', results.insertId);
              new_user.id = results.insertId
               req.session.user=new_user
               res.redirect('/')
            });
          }
        }
      });
  }
  module.exports = { handleRegister, register };
