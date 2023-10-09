
const express=require('express');
const app = express();
const sessionMiddleware = require('./session');
const Joi=require('joi');
const { abort } = require('process');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10)
const db=require('./cnonnect_mysql');
const path = require('path');
app.use(sessionMiddleware());

function edit(req,res){
    user=req.session.user

    if(user && user.id==req.params.id){
      validationMessige='';
      res.render('./profile/edit',{user,validationMessige})
  
    }else{
      res.status(404).send('Not found');
  
    }
}
function update(req,res){
    user=req.session.user
    if(user && user.id==req.params.id){
  
      const update_user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
      };
        
      db.query('SELECT * FROM users WHERE id != ? AND email = ?', [user.id, update_user.email], function (error, results, fields) {
        if (error) throw error;
      
        if (results.length > 0) {
  
          var validationMessige = [{ message: 'Email is already in use' }];
  
          res.render(path.join(__dirname, 'views', './profile/edit'), { validationMessige, update_user });
        } else {
          const schema = Joi.object({
            first_name: Joi.string().min(6).required(),
            last_name: Joi.string().min(6).required(),
            email: Joi.string().min(6).required().email(),
            password: Joi.string().min(6)
          });
          
  
          if(update_user.password){
            Joi.password=Joi.string().min(6).required()
            const hashedPassword = bcrypt.hashSync(update_user.password, salt);
            update_user.password = hashedPassword;
          }else{
            update_user.password=user.password
          }
  
        
          const { error, value } = schema.validate(update_user, { abortEarly: false });
      
          if (error) {
            var validationMessige = error.details;
            res.render(path.join(__dirname, 'views', './profile/edit'), { validationMessige, update_user });
          } else {
    
            db.query('UPDATE users SET ? WHERE id = ?', [update_user, user.id], function (error, results, fields) {
          
              if (error) throw error;
      
              update_user.id=user.id
              req.session.user=update_user
               res.redirect('/')
            });
          }
        }
      });
  
    }else{
      res.status(404).send('Not found');
  
    }
  
}

module.exports={edit,update}