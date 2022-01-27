// Get our dependencies
var express = require('express');
var app = express();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var mysql = require("mysql2");

var connection = mysql.createConnection({
  host     : process.env.DB_HOST || 'mysql-test.cxrpknmq0hfi.us-west-2.rds.amazonaws.com',
  user     : process.env.DB_USER || 'applicationuser',
  password : process.env.DB_PASS || 'applicationuser',
  database : process.env.DB_NAME || 'movie_db',
  
});

connection.connect();

function getMovies(callback) {    
        connection.query("SELECT * FROM movie_db.moviereview",
            function (err, rows) {
                callback(err, rows); 
            }
        );    
}
function getAuthors(callback) {    
  connection.query("SELECT * FROM movie_db.reviewer",
      function (err, rows) {
          callback(err, rows); 
      }
  );    
}

function getPublications(callback) {    
  connection.query("SELECT * FROM movie_db.publication",
      function (err, rows) {
          callback(err, rows); 
      }
  );    
}

//Testing endpoint

// Implement the movies API endpoint
app.get('/movies', function(req, res){
  getMovies(function (err, movies){
    res.json(movies);

 });
});

app.get('/', function(req, res, next) {   
    getMovies(function (err, moviesResult){   
       res.json(moviesResult);
    });
});


// Implement the reviewers API endpoint
app.get('/reviewers', function(req, res){ 
  getAuthors(function (err, authors){ 
    res.json(authors);
  });
});

// Implement the publications API endpoint
app.get('/publications', function(req, res){
  getPublications(function (err, publications){
    res.json(publications);
  });
});

// Implement the pending reviews API endpoint
app.get('/pending', function(req, res){
  var pending = [
    {title : 'Superman: Homecoming', release: '2017', score: 10, reviewer: 'Chris Harris', publication: 'International Movie Critic'},
    {title : 'Wonder Woman', release: '2017', score: 8, reviewer: 'Martin Thomas', publication : 'TheOne'},
    {title : 'Doctor Strange', release : '2016', score: 7, reviewer: 'Anthony Miller', publication : 'ComicBookHero.com'}
  ]
  res.json(pending);
})
console.log("server listening through port: "+process.env.PORT);
// Launch our API Server and have it listen on port 3000.
app.listen(process.env.PORT || 3000);
module.exports = app;
