const express=require('express');
const app = express();
const path = require('path');
const port = 3131;
const bodyParser = require('body-parser');
const db=require('./cnonnect_mysql');
const ejs = require('ejs')
const sessionMiddleware = require('./session');
const userRegister = require('./register');
const userLogin =require('./login');
const profile=require('./profile')
const multer = require('multer');
const upload = multer({ dest: 'post_images/' });
const map =require('./map')
const post=require('./post')
const contact = require('./contact');

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.use(sessionMiddleware());


app.get('/', (req, res) => {
    user=req.session.user
    let posts=null;
    if(user){
        posts=db.query('SELECT * FROM `posts` WHERE user_id='+user.id, function (err, posts, fields) {
          if (err) throw err;
          res.render('index',{user,posts});
        });
    }else{
      res.render('index',{user,posts});
    }
});

app.get('/contact',contact.showContactPage);
app.post('/contact/send',contact.sendContact);
app.get('/register', userRegister.handleRegister);
app.post('/register_user',userRegister.register);

app.get('/login',userLogin.handleLogin);
app.post('/login_user',userLogin.login);
app.post('/log_out',userLogin.log_out)


app.get('/edit/:id',profile.edit)
app.post('/update/:id',profile.update)

app.get('/add/post',post.addPost)

app.post('/save/post',upload.single('image'),post.importPost)

app.post('/delete/post/:id',post.deletePost)
app.get('/edit/post/:user_id/:id',post.editPost)
app.post('/update/post/:id', upload.single('image'),post.updatePost);
app.get('/posts',post.showAll)
app.get('/posts/:address/:query',post.getPost)

app.get('/map',map.map)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });