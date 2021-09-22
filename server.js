const { json } = require('express');
var express = require('express');
var app = express();
var fs = require("fs");
app.use(express.json()); 

// initialize database
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/user_db.db', (err) => {
        if (err) {
      return console.error(err.message);
    }    
    console.log('Connected to the SQlite database.'); 
});

db.run(`
CREATE TABLE IF NOT EXISTS [Users] (  
	[Id] INTEGER  PRIMARY KEY NOT NULL,
	[FirstName] NVARCHAR(50) NOT NULL, 
  	[LastName] NVARCHAR(50) NOT NULL, 
	[Email] NVARCHAR(50) NOT NULL, 
  	[Address] NVARCHAR(50) NOT NULL, 
    [Version] INTEGER DEFAULT 0,
	[Deleted] INTEGER DEFAULT 0 
  )
  `,
    (err)=> {
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

    let sql = `SELECT * FROM Users`;

    db.each(sql,[], (err, result) => {
        // process each row here
        console.log(result)
     });
    res.end('');

})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})


 
 app.post('/addUser', function (req, res) {

    let reqVals = [req.body.firstName,req.body.lastName,req.body.email,req.body.address]

    db.run(`INSERT INTO users(firstName,lastName,email,address) VALUES(?, ? ,?, ?);`,reqVals,  function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
    
    res.end() 
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