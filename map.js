const express=require('express');
const app = express();
const path = require('path');
const db=require('./cnonnect_mysql');
const Joi=require('joi');
const sessionMiddleware = require('./session');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use(fileUpload());
app.use(sessionMiddleware());


function map(req,res){
    user=req.session.user
    const sql = `SELECT lat,lng,place FROM posts;`;
    db.query(sql, function (error, address, fields) 
    {
        res.render('./map/map',{ address,user })

    });

}


module.exports = {
   map
  };