const router = require("express").Router();
const connection=require("../db");


router.get("/:id", (req, res) => {
  const userid=req.params.id
  console.log(userid);
    connection.execute(
      `SELECT mf.*,md.title AS title,md.price AS price ,md.start_date AS start_date ,md.end_date AS end_date,md.city AS city ,md.area AS area ,
      md.location_detail AS location_detail ,md.description AS description,md.mission_status AS mission_status ,md.post_date AS post_date,md.post_user_id AS post_user_id,u.name AS post_name,mr.mission_id AS record_mission_id,mr.job_date AS job_date
      FROM mission_fav AS mf
      JOIN mission_detail AS md ON mf.mission_id=md.mission_id
      JOIN userinfo AS u ON u.user_id =md.post_user_id
      LEFT JOIN mission_record AS mr ON mr.mission_id = md.mission_id AND mr.user_id = mf.user_id
      WHERE mf.user_id = ?;`,
      [userid],
      (error, result) => {
        res.json({ result });
      }
    );
  });

  router.delete("/:id",(req,res)=>{
    const deleteId=req.params.id
    connection.execute(
        `DELETE FROM mission_fav WHERE mission_fav.mission_fav_id=?`,
        [deleteId]
        ,(error, result) => {
            if (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "An error occurred" });
            } else {
              res.json({ result });
            }}) 
})

module.exports = router;