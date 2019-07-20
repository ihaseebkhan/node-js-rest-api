const express = require('express');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express();

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'facebook22',
    database: 'logindb'
});

app.post('/api/login', verifyToken, (req,res)=>{
      jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
          res.sendStatus(401);
        } else {
          res.json({
            message: 'Authentication successful',
            authData
          });
        };
      });
});

function createUser() {
    const user = {
        id: 1, 
        username: 'Haseeb',
        email: 'ihaseeb1995@gmail.com'
      };   
      
      jwt.sign({user}, 'secretkey', { expiresIn: '1h' }, (err, token) => {
        if (err) throw err;
        console.log('JWT = '+`${token}`);

        connection.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            connection.query("INSERT INTO jwttable(jwt) VALUES('"+token+"')", function (err) {
              if (err) throw err;
              console.log("JWT stored in MySQL");
            });
        });
      });
};  

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(401);
    };  
  };

createUser();
app.listen(3000,()=>console.log('Express server listening at port 3000!'));