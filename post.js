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


function addPost(req,res){
    user=req.session.user
    validationMessige='';
    if(user ){
        res.render('./posts/add',{user,validationMessige})
    
      }else{
        res.redirect('/login')
    
      }
}
function importPost(req,res){
    user=req.session.user
 
    if(user){

        const new_post = {
            title: req.body.title,
            description: req.body.description,
            address: req.body.address,
         
          };
          let place= req.body.place,
           lat= req.body.lat,
           lng= req.body.lng;
          const schema = Joi.object({
            title: Joi.string().min(2).max(40).required(),
            description: Joi.string().max(3000).required(),
            address: Joi.string().required(),
          });
          
          const validation = schema.validate(new_post, { abortEarly: false });
          
          const uploadedFile = req.file;

          if (!uploadedFile) {
            
            return   res.redirect('/');
          }
       
          if (validation.error) {
            var validationMessige = validation.error.details;
            res.render(path.join(__dirname, 'views', './posts/add'), { validationMessige, new_post });
          } else {
      
            createPost(new_post,uploadedFile,place,lat,lng);
           return res.redirect('/');
          }
    
      }else{
        return res.redirect('/login')
 
      }

  

     
}
function createPost(new_post,uploadedFile,place,lat,lng){

  const newFileName = Date.now() + '-' + uploadedFile.originalname;
  const sourcePath = uploadedFile.path;
  const imagePath = sourcePath; 
  const outputFolder = path.join(__dirname, 'views', './post_images/'); 

  const outputPath = path.join(outputFolder, newFileName);

  sharp(imagePath)
    .resize(240, 340)
    .toFile(outputPath)
    .catch((err) => {
      console.error(err);
    });

  let post=[user.id,new_post.title, new_post.description ,newFileName ,new_post.address,place,lat,lng,];
  var sql = "INSERT INTO posts (user_id, title,text,image,address,place,lat,lng) VALUES (?, ?, ?, ?,?, ?, ?, ?)";
  db.query(sql,post, function (error, results, fields) {
    if (error) throw error
  });


}
function editPost(req, res) {
  validationMessige='';
  user=req.session.user
  if(user){
if(req.params.user_id == user.id){
  db.query('SELECT * FROM `posts` WHERE '+user.id+' AND id='+req.params.id, function (err, user_post, fields) {
    if (err) throw err;
    user_post=JSON.parse(JSON.stringify(user_post))

    res.render('posts/edit',{user_post,validationMessige});
   });
}else{
  return res.redirect('/')
}
}else{
  return res.redirect('/')
}

}
function updatePost(req, res) {
      
  const post = {
    title: req.body.title,
    text: req.body.description,
    address: req.body.address,
  };
          
  
          const schema = Joi.object({
            title: Joi.string().min(6).max(15).required(),
            text: Joi.string().max(3000).required(),
            address: Joi.string().required(),
          });
          
          const validation = schema.validate(post, { abortEarly: false });
        
          const uploadedFile = req.file;
    
          let newFileName;
          
          if (!uploadedFile) {
             newFileName=req.body.image_name
          }else{
             newFileName = Date.now() + '-' + uploadedFile.originalname;
            const sourcePath = uploadedFile.path;
            const imagePath = sourcePath; 
            const outputFolder = path.join(__dirname, 'views', './post_images/'); 
          
            const outputPath = path.join(outputFolder, newFileName);
          
            sharp(imagePath)
              .resize(240, 340)
              .toFile(outputPath)
              .catch((err) => {
                console.error(err);
              });
          }
         post.image=newFileName
         post.place=req.body.place
         post.lat=req.body.lat
         post.lng=req.body.lng
         post.id=req.params.id
       
          if (validation.error) {
            const validationMessige = validation.error.details;
            const user_post=[post]

            res.render('posts/edit',{user_post,validationMessige});
      
          } else {
            
            db.query('UPDATE posts SET ? WHERE id = ?', [post, req.params.id],function (error, updated_post, fields) {

              if (error) throw error
          
            return res.redirect('/')
          });
          }


}
function deletePost(req, res) {

  var sql = "DELETE FROM posts WHERE id="+req.params.id;
  db.query(sql, function (error, results, fields) {
    if (error) throw error
  });
  return res.redirect('/')
}

function showAll(req,res){
  user=req.session.user
  const sql = `SELECT * FROM posts;`;
  db.query(sql, function (error, posts, fields) 
  {
    if (error) throw error
    db.query('SELECT DISTINCT address,place FROM posts;', function (error, search_address) {
      if (error) throw error;
      
      res.render(path.join(__dirname, 'views', './posts/all_posts'), { posts,search_address,user });
      
    });
  

  });


}
function getPost(req,res){
  user=req.session.user
  let address, query;
      address = req.params.address;
      query = req.params.query;

  
    sql = `SELECT * FROM posts WHERE 1=1`;
  
    if (address == 'all' && query == 'all') {
      sql = `SELECT * FROM posts`;
    } else if (address !== 'all' && query == 'all') {
      sql += ` AND TRIM(address) LIKE '%${address.trim()}%'`;
    } else if (query !== 'all' && address == 'all') {
      sql += ` AND title LIKE '%${query}%'`;
    } else {
      sql += ` AND TRIM(address) LIKE '%${address.trim()}%' AND title LIKE '%${query}%'`;
    }


  db.query(sql, function (error, posts, fields) {
    if (error) throw error
    res.render(path.join(__dirname, 'views', './posts/get_posts'), { posts,user }, (err, renderedContent) => {
    if (err) {
      res.status(500).send('Error rendering EJS file');
    } else {
      res.send(renderedContent);
    }
  });
});


}

module.exports = {
  addPost,
  importPost,
  deletePost,
  editPost,
  updatePost,
  showAll,
  getPost
};