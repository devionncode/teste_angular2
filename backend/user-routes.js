var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres://postgres:142536@192.168.0.115:5432/teste_usuario');

var user = sequelize.define('usuario', {
  user: Sequelize.TEXT,
  password: Sequelize.TEXT
});

sequelize.sync();

var app = module.exports = express.Router();

// XXX: This should be a database of users :).
var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

app.post('/users', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  // if (_.find(users, {username: req.body.username})) {
  //  return res.status(400).send("A user with that username already exists");
  // }

  // var profile = _.pick(req.body, 'username', 'password', 'extra');
  // profile.id = _.max(users, 'id').id + 1;
  //
  // users.push(profile);

  user.create({user: req.body.username, password: req.body.password});

  res.status(201).send({
    id_token: createToken(profile)
  });
});

app.post('/sessions/create', function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  var user = _.find(users, {username: req.body.username});
  if (!user) {
    return res.status(401).send("The username or password don't match");
  }

  if (!(user.password === req.body.password)) {
    return res.status(401).send("The username or password don't match");
  }

  res.status(201).send({
    id_token: createToken(user)
  });
});
