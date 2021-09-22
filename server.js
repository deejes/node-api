var express = require('express');
var app = express();
var fs = require("fs");

// initialize database
const sqlite3 = require('sqlite3').verbose();
// let db = new sqlite3.Database(':memory:', (err) => {
//     if (err) {
//       return console.error(err.message);
//     }    
//     console.log('Connected to the in-memory SQlite database.');
//   });

let db = new sqlite3.Database('./db/sample.db', (err) => {
        if (err) {
      return console.error(err.message);
    }    
    console.log('Connected to the SQlite database.'); 
});

db.run('CREATE TABLE langs(name text)',(err)=> {
    if (err) {
        return console.error(err.message);
      }    
});


// close database

function closeDB() {
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
}


app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})


 
 app.post('/addUser', function (req, res) {
    // First read existing users.
    // fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    data = JSON.parse( data );
    //    data["user4"] = user["user4"];
    //    console.log( data );
    //    res.end( JSON.stringify(data));
// });
    res.end("ASD");
    closeDB();
 })

 app.get('/:id', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       var users = JSON.parse( data );
       var user = users["user" + req.params.id] 
       console.log( user );
       res.end( JSON.stringify(user));
    });
 })

 app.delete('/deleteUser', function (req, res) {
    // First read existing users.
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       delete data["user" + 2];
        
       console.log( data );
       res.end( JSON.stringify(data));
    });
 })