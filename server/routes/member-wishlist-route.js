const router = require("express").Router();
const connection=require("../db");

//收藏清單
router.get("/:id", (req, res) => {
  const userid=req.params.id
  console.log(userid);
    connection.execute(
      `SELECT pc.*, p.product_name AS product_name,pt.type_name AS type_name,p.images_one AS images,p.specialoffer AS price,p.category_id AS category_id,p.subcategory_id AS subcategory_id
      FROM product_collections AS pc 
      JOIN userinfo AS u ON pc.user_id=u.user_id 
      JOIN products AS p ON pc.product_id = p.product_id 
      JOIN product_type AS pt ON pc.product_id=pt.product_id
      WHERE pc.user_id = ?
      GROUP BY pc.product_id
      ORDER BY pc.collection_id  DESC;`,
      [userid],
      (error, result) => {
        res.json({ result });
      }
    );
  });

//收藏商品規格
router.get("/type/:id", (req, res) => {
  const userid=req.params.id
  console.log(userid);
  connection.execute(
    `SELECT pt.type_name AS type_name,pt.type_id AS type_id,pc.product_id FROM product_collections AS pc JOIN userinfo AS u ON pc.user_id=u.user_id JOIN product_type AS pt ON pc.product_id=pt.product_id WHERE pc.user_id = ?`,
    [userid],
    (error, result) => {
      res.json({ result });
    }
  );
});
//刪除收藏清單
router.delete("/:id/:user_id",(req,res)=>{
    const deleteId=req.params.id
    const userid=req.params.user_id
    connection.execute(
        `DELETE FROM product_collections WHERE product_collections.collection_id=? && user_id=?`,
        [deleteId,userid]
        ,(error, result) => {
            if (error) {
              console.error("Error:", error);
              res.status(500).json({ error: "An error occurred" });
            } else {
              res.json({ result });
            }}) 
})
//收藏清單--想先知道購物車內有甚麼商品
router.get("/cart",(req,res)=>{
    connection.execute(
        `SELECT cart.*, p.product_name AS name,pt.type_name AS type,p.images_one AS image,p.specialoffer AS price
        FROM cart 
        JOIN products AS p ON cart.product_id=p.product_id 
        JOIN product_type AS pt ON cart.product_type_id=pt.type_id AND p.product_id=pt.product_id
        WHERE user_id=1;`
        ,(error,result)=>{
            res.json({result})
        }    
    )
})
  //用來新增購物車裡沒有的商品
  router.put("/cart/:user_id",(req,res)=>{
    const userid=req.params.user_id
    console.log(userid);
    const {id ,type}=req.body  
    connection.execute(
        `INSERT INTO cart(user_id, product_id,  product_type_id,quantity) VALUES (?,?,?,1);`,
        [userid,id,type]
        ,(error,result)=>{
            res.json({result})
        }    
    )
})
//用來修改購物車裡已經有的商品數量
router.put("/cartplus/:user_id",(req,res)=>{
  const userid=req.params.user_id
    console.log(userid);
    const {id ,newQuantity,type}=req.body
    connection.execute(
        `UPDATE cart SET quantity=? WHERE user_id=? AND product_id=? AND product_type_id=?`,
        [ newQuantity,userid,id,type]
        ,(error,result)=>{
            res.json({result})
        }    
    )
})

module.exports = router;