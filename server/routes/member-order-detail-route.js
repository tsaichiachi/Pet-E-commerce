const router = require("express").Router();
const connection=require("../db");

  //拿訂單細節資料
  router.get("/:oid/:id",(req,res)=>{
    const orderId=req.params.oid
    const id=req.params.id
    connection.execute(
        `SELECT o.*, 
        p.images_one AS image, 
        os.status_name AS status_name, 
        op.payment AS payment, 
        oship.shipment AS shipment,
        p.product_name AS product_name,
        od.quantity AS quantity,
        p.specialoffer AS price,
        pt.type_name AS type,
        od.product_id AS product_id,
        pr.review_content AS review_content,
        pr.review_id AS review_id,
        pr.star_rating AS star_rating,
        p.category_id AS category_id,
        p.subcategory_id AS subcategory_id
 FROM orders AS o 
 JOIN userinfo AS u ON o.user_id = u.user_id 
 JOIN order_details AS od ON o.oid=od.order_id
 JOIN products AS p ON od.product_id = p.product_id   
 JOIN order_status AS os ON o.status_id = os.status_id 
 JOIN order_payment AS op ON o.order_payment = op.id 
 JOIN order_shipment AS oship ON o.order_shipment = oship.id
 JOIN product_type AS pt ON od.product_type=pt.type_id AND od.product_id=pt.product_id
 LEFT JOIN product_reviews AS pr ON od.product_id=pr.product_id AND pr.order_id=o.oid
 WHERE o.user_id = ? AND od.order_id=?;`,
        [id,orderId],
        (error,result)=>{
            res.json({result})
        }    
    )
})


//商品評論
router.post("/comment",(req,res)=>{
    const {comment,star,productid,orderid,user_id,createtTime} =req.body
    connection.execute(
        `INSERT INTO product_reviews(user_id, product_id, review_content,star_rating,order_id ,review_date) VALUES (?,?,?,?,?,?);`,
        [user_id,productid,comment,star,orderid,createtTime]
        ,(error,result)=>{
            res.json({result})
        }    
    )
})


router.post("/comment/update",(req,res)=>{
    const {comment,star,review_id,createtTime} =req.body
    connection.execute(
        `UPDATE product_reviews SET review_content=?,star_rating=?,review_date=? WHERE review_id=?;`,
        [comment,star,createtTime, review_id]
        ,(error,result)=>{
            res.json({result})
        }    
    )
})



module.exports = router;