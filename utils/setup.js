// Allow form submissions
function bodyParser() {
  var bodyParser = require('body-parser');
  return bodyParser.urlencoded({ extended: true });
}

// Set up cookies and set session
function cookieSession() {
  var session = require('cookie-session');
  return session({
    secret: 'logged in',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 }  // 14 days
  });
}

// Security checking
function helmet() {
  var helmet = require('helmet');
  return helmet({
    // Options go here
  });
}

module.exports = {
  bodyParser,
  helmet,
  cookieSession
}