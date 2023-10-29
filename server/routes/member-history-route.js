const router = require("express").Router();
const connection=require("../db");


router.get("/:id", (req, res) => {
const userid=req.params.id
console.log(userid);
    connection.execute(
      `SELECT md.*
      FROM mission_detail AS md 
      WHERE md.post_user_id = ?
      ORDER BY md.post_date DESC;`,
      [userid],
      (error, result) => {
        res.json({ result });
      }
    );
  });

//用來修改刊登任務的狀態
router.put("/updatetype",(req,res)=>{
    console.log(req.body)
   const updateId=req.body.id
   console.log(updateId)
   connection.execute(
    `UPDATE mission_detail SET mission_status=0 WHERE mission_id=?`,
    [updateId],
    (error, result) => {
      if (error) {
        console.error("SQL error:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ result });
      }
    }
  );
})


router.get("/count/count", (req, res) => {
      connection.execute(
        `SELECT * FROM mission_fav;`,
        (error, result) => {
          res.json({ result });
        }
      );
    });





module.exports = router;