

const db= require('../cnonnect_mysql');

    var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255),email VARCHAR(255) UNIQUE,password VARCHAR(255),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP , updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP )";
    db.query(sql, function (err, result) {
      if (err) throw err;
      
      console.log("Users Table created");
      process.exit();
    });
  