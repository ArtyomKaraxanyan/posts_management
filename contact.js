const express=require('express');
const app = express()
const sessionMiddleware = require('./session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const Joi=require('joi');
const path = require('path');

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.use(sessionMiddleware());

function showContactPage(req,res){
    user=req.session.user
    validationMessige=''
    res.render('contact',{user,validationMessige});
}

function sendContact(req,res){
    user=req.session.user
let contactMessige={
    subject: req.body.subject,
    email: req.body.email,
    message: req.body.message,
}

const schema = Joi.object({
    subject: Joi.string().max(40).required(),
    email: Joi.string().max(80).required().email(),
    message: Joi.string().max(3000).required(),
  });
  
  const validation = schema.validate(contactMessige, { abortEarly: false });
  if (validation.error) {
    const validationMessige = validation.error.details;
      user=req.session.user
      return res.render(path.join(__dirname, 'views', 'contact'), { validationMessige, user });

  
  }
  const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: 'Sendgrid_api_key'
    })
);
    
    var mailOptions = {
      from: 'artyomkaraxanyan@gmial.com',
      to: 'artyomkaraxanyan@gmial.com',
      subject: 'Sending Email using Node.js',
      text: 'That was easy!'
    };
    
    transport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        return res.redirect('/')
      } else {
        console.log('Email sent: ' + info.response);
        return res.redirect('/')
      }
    });
}



module.exports={showContactPage,sendContact};