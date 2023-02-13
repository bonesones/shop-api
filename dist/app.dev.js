"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var app = express();

var jsonfile = require('jsonfile');

var urlencodedParser = require('urlencoded-parser');

var bodyParser = require('body-parser');

var bcrypt = require('bcryptjs');

var _require = require('body-parser'),
    json = _require.json;

var mysql = require('mysql2');

var PORT = 3000;
var conn = mysql.createConnection({
  host: "192.168.25.23",
  post: '3306',
  user: "Tarasov",
  database: "Tarasov",
  password: "12345"
});
app.listen(PORT, function () {
  return console.log('success');
});
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(urlencodedParser);

var hashPassword = function hashPassword(password) {
  var salt = bcrypt.genSaltSync(10);
  var hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}; // USER ROUTES


app.get('/api/users/:id', function (req, res) {
  var userId = req.params.id;
  conn.query("SELECT * FROM users WHERE id = ?", [userId], function (err, result) {
    if (err) throw err;
    res.status(200).json({
      success: true,
      user: result
    });
  });
});
app.post('/registration', function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      surname = _req$body.surname,
      role = _req$body.role,
      phone_number = _req$body.phone_number,
      email = _req$body.email,
      password = _req$body.password;
  var data = jsonfile.readFileSync(USERS);
  data.push({
    id: data.length + 1,
    role: role,
    full_name: "".concat(name, " ").concat(surname),
    phone_number: phone_number,
    email: email,
    password: hashPassword(password),
    isDelete: false
  });
  jsonfile.writeFile(USERS, data, {
    spaces: 2
  });
  res.status(200).json({
    success: true,
    message: "user added"
  });
});
app.put("/api/users/:id", function (req, res) {
  conn.query("SELECT * FROM users WHERE id = ?", [userId], function (err, result) {
    if (err) throw err;
    var user = {
      email: result.email
    };
    conn.query();
  });
  conn.query("UPDATE users SET ");
  var userId = req.params.id;
  var newData = req.body;

  if (newData.password) {
    newData.password = hashPassword(newData.password);
  }

  var idNumber = parseInt(userId);
  var data = jsonfile.readFileSync(USERS);
  var user = data.findIndex(function (_ref) {
    var id = _ref.id;
    return id === idNumber;
  });

  if (user === -1) {
    res.status(404).json({
      success: false,
      message: "user not found"
    });
  }

  data[user] = _objectSpread({}, data[user], {}, newData);
  jsonfile.writeFileSync(USERS, data, {
    spaces: 2
  });
  res.status(200).json({
    success: true,
    message: "user has been edited"
  });
});
app["delete"]("/api/users/:id", function (req, res) {
  var userId = req.params.id;
  var idNumber = parseInt(userId);
  var data = jsonfile.readFileSync(USERS);
  var user = data.findIndex(function (_ref2) {
    var id = _ref2.id;
    return id === idNumber;
  });

  if (user === -1) {
    res.status(404).json({
      success: false,
      message: "user not found"
    });
  }

  data[user] = _objectSpread({}, data[user], {
    isDelete: true
  });
  jsonfile.writeFileSync(USERS, data, {
    spaces: 2
  });
  res.status(200).json({
    success: true,
    message: "user has been deleted"
  });
}); // GOODS ROUTES

app.get('/api/goods', function (req, res) {
  conn.query("SELECT * FROM goods", [], function (err, result) {
    console.log(result);
    res.status(200).json({
      success: true,
      goods: result
    });
  });
});
app.get('/api/goods/:id', function (req, res) {
  var userId = req.params.id;
  conn.query("SELECT * FROM goods WHERE id = ?", [userId], function (err, result) {
    res.status(200).json({
      success: true,
      goods: result
    });
  });
});
app.post('/goods', function (req, res) {
  var _req$body2 = req.body,
      name = _req$body2.name,
      image = _req$body2.image,
      description = _req$body2.description,
      cost = _req$body2.cost;
  var receivedData = [name, image, description, cost];

  if (receivedData.some(function (el) {
    return el === undefined;
  })) {
    res.status(422).json({
      success: 'false',
      message: "incomplete data"
    });
  }

  var data = jsonfile.readFileSync(GOODS);
  data.push(_objectSpread({
    id: data.length + 1
  }, data));
  jsonfile.writeFile(GOODS, data, {
    spaces: 2
  });
  res.status(200).json({
    success: true,
    message: "good has been added"
  });
});
app["delete"]('/good/:id', function (req, res) {
  res.send('delete good');
});
app.put('/good/:id', function (req, res) {
  res.send('edit good');
}); // REVIEWS ROUTES

app.get('/reviews', function (req, res) {
  res.send('get 5 reviews');
});
app.post('/reviews', function (req, res) {
  req.send('post review');
});
app.put('/reviews/:id', function (req, res) {
  res.send('edit review');
});
app["delete"]('/reviews/:id', function (req, res) {
  res.send('delete review');
});