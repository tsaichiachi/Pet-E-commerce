const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "admin",
  password: "12345",
  database: "cat",
});

connection.connect((err)=>{
  if(err){
    console.error("Database Connection Failed")
    console.log(err);
  }
  console.log("~~~~~~~~Database Connection Successfully~~~~~~~~")
 // connection.end();
})

module.exports = connection;
