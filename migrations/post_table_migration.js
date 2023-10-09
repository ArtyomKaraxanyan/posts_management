
const db= require('../cnonnect_mysql');

var sql = "CREATE TABLE posts (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, title VARCHAR(255), text TEXT, image VARCHAR(255), address VARCHAR(255),  place VARCHAR(255), lat FLOAT,lng FLOAT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id))";
    db.query(sql, function (err, result) {
      if (err) throw err;
      
      console.log("Post Table created");
      process.exit();
    });
  