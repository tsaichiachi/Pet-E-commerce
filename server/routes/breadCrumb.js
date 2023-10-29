const router = require("express").Router();
const connection = require("../db");

  router.get("/article",(req,res)=>{
    // console.log(req);

      connection.execute(
           `
           SELECT * FROM article`
          
          ,(error,result)=>{
          res.json({result})
          }
  )})
  router.get("/mission",(req,res)=>{
    // console.log(req);

      connection.execute(
           `
           SELECT * FROM mission_detail`
          
          ,(error,result)=>{
          res.json({result})
          }
  )})
  router.get("/subcategory",(req,res)=>{
    // console.log(req);

      connection.execute(
           `
           SELECT * FROM subcategory`
          
          ,(error,result)=>{
          res.json({result})
          }
  )})





module.exports = router;