const router = require("express").Router();
const connection=require("../db");


//拿出我的訂單紀錄(僅顯示第一項商品資訊)
router.get("/:userId", (req, res) => {
    const userId=req.params.userId
    console.log(userId);
    connection.execute(
            `SELECT o.*, 
            p.images_one AS image, 
            os.status_name AS status_name, 
            op.payment AS payment, 
            oship.shipment AS shipment 
     FROM orders AS o 
     JOIN userinfo AS u ON o.user_id = u.user_id 
     JOIN (
         SELECT od.order_id, p.product_id, p.images_one
         FROM order_details AS od
         JOIN products AS p ON od.product_id = p.product_id
         GROUP BY od.order_id  
     ) AS p ON o.oid = p.order_id
     JOIN order_status AS os ON o.status_id = os.status_id 
     JOIN order_payment AS op ON o.order_payment = op.id 
     JOIN order_shipment AS oship ON o.order_shipment = oship.id 
     WHERE o.user_id = ?
     ORDER BY o.order_id DESC;`,[userId]
          ,(error,result)=>{
          res.json({result})
          }
  )})
  


  module.exports = router;