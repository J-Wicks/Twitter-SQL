'use strict';
var express = require('express');
var router = express.Router();
var client = require('../db/index.js');
var tweetBank = require('../tweetBank');

module.exports = router;

// a reusable function
function respondWithAllTweets (req, res, next){
  var allTheTweets = tweetBank.list();
  res.render('index', {
    title: 'Twitter.js',
    tweets: allTheTweets,
    showForm: true
  });
}

// here we basically treet the root view and tweets view as identical
router.get('/', function(req,res){
client.query('SELECT tweets.id, tweets.content, users.name FROM tweets INNER JOIN users ON users.id = tweets.user_id', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
}); 
});

router.get('/tweets', function(req,res){
client.query('SELECT tweets.id, tweets.content, users.name FROM tweets INNER JOIN users ON users.id = tweets.user_id', function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js', tweets: tweets, showForm: true });
}); 
});

// single-user page
router.get('/users/:username', function(req, res, next){
  // var tweetsForName = tweetBank.find({ name: req.params.username });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsForName,
  //   showForm: true,
  //   username: req.params.username
  // });

  client.query(`SELECT tweets.id, tweets.content, users.name FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE users.name = '${req.params.username}'`, function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js User', tweets: tweets, showForm: true });
}); 
});

// single-tweet page
router.get('/tweets/:id', function(req, res, next){
  // var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
  // res.render('index', {
  //   title: 'Twitter.js',
  //   tweets: tweetsWithThatId // an array of only one element ;-)
  // });

  client.query(`SELECT tweets.id, tweets.content, users.name FROM tweets INNER JOIN users ON users.id = tweets.user_id WHERE tweets.id = '${req.params.id}'`, function (err, result) {
  if (err) return next(err); // pass errors to Express
  var tweets = result.rows;
  res.render('index', { title: 'Twitter.js User', tweets: tweets, showForm: true });
}); 
});

// create a new tweet
router.post('/tweets', function(req, res, next){
  console.log('test');
   client.query('select name from users', function(err, names){
      var nameArr = names.rows.map(function(a){
        return a.name
      });
      if(nameArr.indexOf(req.body.name) === -1) {
        client.query("INSERT into users (name) VALUES ($1)", [req.body.name],  function (err, result) {
          if(err) throw err
        });
      }
    client.query("INSERT into tweets (user_id, content) VALUES ( (SELECT id from users WHERE name = $1), $2 )", [req.body.name, req.body.content],  function (err, result) {
    if (err) return next(err); // pass errors to Express
    res.redirect('/');
  
    });
   });
});

// // replaced this hard-coded route with general static routing in app.js
// router.get('/stylesheets/style.css', function(req, res, next){
//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
// });
