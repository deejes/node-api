const { json } = require('express');
const e = require('express');
var express = require('express');
var app = express();
var fs = require("fs");
const { v4: uuidv4 } = require('uuid');

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
	[Id] INTEGER PRIMARY KEY NOT NULL,
    [UserID] NVARCHAR(50) NOT NULL,
	[FirstName] NVARCHAR(50) NOT NULL, 
  	[LastName] NVARCHAR(50) NOT NULL, 
	[Email] NVARCHAR(50) NOT NULL, 
  	[Address] NVARCHAR(50), 
    [Version] INTEGER DEFAULT 0 NOT NULL,
    [Active] INTEGER DEFAULT 1, 
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

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("I'm listening at http://%s:%s", host, port)
})

// get all users
app.get('/listUsers', function (req, res) {
   
   let sql = `SELECT * FROM Users`;
   
   db.each(sql,[], (err, result) => {
      // process each row here
      console.log(result)
   });
   res.end('');
   
})

// get a user by id and optional version number
app.get('/:id', function (req, res) {
    id = req.params.id
    if ( !req.body.Version ){
         sql = `SELECT * FROM users WHERE userID="`+id+'" ORDER BY VERSION DESC LIMIT 1';
    } else{
        sql = `SELECT * FROM users WHERE userID="` + id + `" AND Version="` + req.body.Version+ `"`;
    }
    db.each(sql,[], (err, result) => {
        console.log(result)
     });
    res.end('');

 })

// create new user
app.post('/createUser', function (req, res) {
    let defaultVersion = 1;
    let uid = uuidv4();
    let reqVals = [uid,req.body.firstName,req.body.lastName,req.body.email,req.body.address,defaultVersion]
    db.run(`INSERT INTO users(UserID,firstName,lastName,email,address,version) VALUES(?,?, ? ,?, ?,?);`,reqVals,  function(err) {

    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    res.end(uid) 
 })

 // update a user
app.post('/:id', function (req, res) {

    // find most recent record
    let id = req.params.id
    console.log(id);
    let sql = `SELECT * FROM users WHERE userID="`+id+'" ORDER BY VERSION DESC LIMIT 1';
    
    db.each(sql,[], (err, result) => {
         console.log(result);
        let version = result.Version;
        let primaryid = result.Id
       
       
        // mark previous entry inactive
        let sql_update =  `UPDATE users SET Active=0 WHERE Id="`+primaryid+'"';
        db.run(sql_update, [], function(err) {
         if (err) {
           return console.error(err.message);
         }
         console.log(`Row(s) updated: ${this.changes}`);
       
       });

      // create new entry
       let newVersion = version + 1;
       let uid = id;
       let reqVals = [uid,req.body.firstName,req.body.lastName,req.body.email,req.body.address,newVersion]
       db.run(`INSERT INTO users(UserID,firstName,lastName,email,address,version) VALUES(?,?, ? ,?, ?,?);`,reqVals,  function(err) {
   
       if (err) {
         return console.log(err.message);
       }
       // get the last insert id
       console.log(`A row has been inserted with rowid ${this.lastID}`);
       });
   
      //  res.end(uid) 


     });

    // create new record
    // set userId = id
    // set version = old version +1 



    // let reqVals = [uid,req.body.firstName,req.body.lastName,req.body.email,req.body.address,defaultVersion]
    // db.run(`INSERT INTO users(UserID,firstName,lastName,email,address,version) VALUES(?,?, ? ,?, ?,?);`,reqVals,  function(err) {

    // if (err) {
    //   return console.log(err.message);
    // }
    // // get the last insert id
    // console.log(`A row has been inserted with rowid ${this.lastID}`);
    // });

    res.end() 
 })

// delete a user by id
app.delete('/deleteUser', function (req, res) {
    // TODO

 })