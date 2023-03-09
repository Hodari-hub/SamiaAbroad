var mysql = require('mysql');  
var con = mysql.createConnection({host:"localhost", user:"root", password:"", database: "newsapi"});  
con.connect(function(err) {  
  if (err) throw err;  
  //console.log("Connected!"); Online database password: $Pmtv_2022@+ht=  
});

module.exports={con}

