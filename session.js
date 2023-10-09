const session = require('express-session');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');

module.exports = () => session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 6000000
  }
});