const router = require("express").Router();
const connection=require("../db");

router.get("/cart/:id",(req,res)=>{   
  console.log(req);
  const id= req.params.id;  
  console.log(req.params);
    connection.execute(
        `SELECT c.*,p.product_name AS product_name,p.price AS price,p.specialoffer AS newprice,p.images_one AS images,t.type_name AS type,p.category_id AS category_id,p.subcategory_id AS subcategory_id
        FROM cart AS c 
        JOIN products AS p ON c.product_id = p.product_id 
        JOIN product_type AS t ON c.product_id = t.product_id AND t.type_id=c.product_type_id
        WHERE c.user_id=?  `
        ,[id]
        ,(error,result)=>{
        res.json({result})
        }
)})

router.get("/coupon/coupon",(req,res)=>{
  // console.log(req);
  const allPrice= req.query.allPrice; 
  const id= req.query.id; 
    connection.execute(
         `
        SELECT u.*,c.title AS title,c.discount_type AS type,c.usage_min AS min,c.discount_amount AS amount,c.discount AS discount 
        FROM users_coupon AS u 
        JOIN coupon AS c on c.coupon_id=u.coupon_id
        WHERE u.valid=1 AND u.user_id=? AND c.usage_min < ?`
        ,[id,allPrice]
        ,(error,result)=>{
        res.json({result})
        }
)})

router.put("/",(req,res)=>{
  // console.log(req.query);
    const { id,newquantity } = req.body; 
    connection.execute(
        `UPDATE cart AS c SET c.quantity=? WHERE c.cart_id=?`,
        [newquantity ,id]
        ,(error, result) => {
            if (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "An error occurred" });
            } else {
              res.json({ result });
            }})
})


router.delete("/:id",(req,res)=>{
    const cartIdToDelete = req.params.id;
    connection.execute(
        `DELETE FROM cart WHERE cart.cart_id=?`,
        [cartIdToDelete]
        ,(error, result) => {
            if (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "An error occurred" });
            } else {
              res.json({ result });
            }})
  
})

router.put("/checkout",(req,res)=>{
    const { coupon,userid,createtTime,totalPrice,orderNumber,allPrice ,sale,freight,payment,shipment,name,phone,allAdress } = req.body; 
    connection.execute(
        `INSERT INTO orders( coupon_id, user_id, status_id, created_at, total_amount, oid, order_price, sale, freight, order_payment, order_shipment, buyer_name, buyer_phone, buyer_address) VALUES (?,?,1,?,?,?,?,?,?,?,?,?,?,?)`,
        [coupon,userid,createtTime,totalPrice,orderNumber,allPrice ,sale,freight,payment,shipment,name,phone,allAdress]
        ,(error, result) => {
            if (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "An error occurred" });
            } else {
              res.json({ result });
            }})
})
router.put("/checkout/detail",(req,res)=>{
  const {orderNumber,productId,productTypeId,quantity} = req.body; 
  connection.execute(
      `INSERT INTO order_details(order_id, product_id, product_type, quantity) VALUES (?,?,?,?)`,
      [orderNumber,productId,productTypeId,quantity]
      ,(error, result) => {
          if (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
          } else {
            res.json({ result });
          }})
})
//拿訂單
router.get("/order/:id",(req,res)=>{   
  console.log(req);
  const id= req.params.id;  
  console.log(req.params);
    connection.execute(
        `SELECT *
        FROM orders AS o
        JOIN userinfo AS u ON u.user_id = o.user_id
        JOIN order_payment AS op ON op.id = o.order_payment
        WHERE u.user_id = ? AND o.order_id = (SELECT MAX(o.order_id) FROM orders AS o WHERE user_id = ?);`
        ,[id,id]
        ,(error,result)=>{
        res.json({result})
        }
)})
//拿常用地址
router.get("/address/:id",(req,res)=>{   
  console.log(req);
  const id= req.params.id;  
  console.log(req.params);
    connection.execute(
        `SELECT * FROM address WHERE user_id=?;`
        ,[id]
        ,(error,result)=>{
        res.json({result})
        }
)})

//儲存常用地址，資料庫沒有儲存過
router.put("/address",(req,res)=>{
  const { userid, city,number,address } = req.body; 
  connection.execute(
      `INSERT INTO address(user_id, city, area, detail) VALUES (?,?,?,?)`,
      [userid, city,number,address]
      ,(error, result) => {
          if (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
          } else {
            res.json({ result });
          }})
})

//儲存常用地址，資料庫有儲存過，所以修改地址
router.put("/updateAddress",(req,res)=>{
  const { userid, city,number,address } = req.body; 
  connection.execute(
      `UPDATE address SET city=?,area=?,detail=? WHERE user_id=?`,
      [ city,number,address,userid]
      ,(error, result) => {
          if (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
          } else {
            res.json({ result });
          }})
})

module.exports = router;