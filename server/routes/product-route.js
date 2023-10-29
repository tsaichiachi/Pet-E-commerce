const router = require("express").Router();
const { log } = require("console");
const connection = require("../db");

//註冊登入
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // 從 Authorization 標頭中提取令牌

  if (token == null) {
    return res.sendStatus(401); // 如果令牌不存在，返回未經授權的狀態碼
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 如果令牌無效，返回禁止狀態碼
    req.user = user;
    next();
  });
};

//product產品資料
router.get("/", (req, res) => {
  connection.execute(
    ` SELECT
        products.*,
        category.category_name AS category_name,
        subcategory.subcategory_name AS subcategory_name,
        GROUP_CONCAT(product_type.type_name SEPARATOR ', ') AS type_names
        FROM products
        JOIN category ON category.category_id = products.category_id
        JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id
        LEFT JOIN product_type ON product_type.product_id = products.product_id
        GROUP BY products.product_id;
        `,
    (error, result) => {
      res.json({ result });
    }
  );
});

// //category&subcategory類別
// router.get("/category", (req, res) => {
//     connection.execute(
//         `SELECT
//         category.category_id,
//         category.category_name,
//         GROUP_CONCAT(subcategory.subcategory_name) as subcategories
//         FROM category
//         JOIN subcategory ON subcategory.category_id = category.category_id
//         GROUP BY category.category_name
//         ORDER BY category.category_id; `,
//         (error, result) => {
//             res.json({ result });
//         }
//     );
// });

//找大類
router.get("/category", (req, res) => {
  connection.execute(
    `SELECT * FROM category`,
    (error, result) => {
      res.json({ result });
    }
  );
});

//找小類
router.get("/subcategory", (req, res) => {
  connection.execute(
    `SELECT * FROM subcategory`,
    (error, result) => {
      res.json({ result });
    }
  );
});


//商品細節頁
router.get("/product-detail/:product_id", (req, res) => {
  const productId = req.params.product_id; // 取得從路由參數中傳入的 product_id
  connection.execute(
    `SELECT
        products.*,
        category.category_name AS category_name,
        subcategory.subcategory_name AS subcategory_name,
        GROUP_CONCAT(product_type.type_name) AS type_names,
        GROUP_CONCAT(product_type.type_id) AS type_ids
        FROM products
        JOIN category ON category.category_id = products.category_id
        JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id
        LEFT JOIN product_type ON product_type.product_id = products.product_id
        WHERE products.product_id = ?
        GROUP BY products.product_id`,
    [productId],
    (error, result) => {
      if (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ result });
      }
    }
  );
});

//商品細節頁-reviews
router.get("/product-detail/:product_id/reviews", (req, res) => {
  const productId = req.params.product_id; // 取得從路由參數中傳入的 product_id
  connection.execute(
    `SELECT
         product_reviews.review_content AS review_content,
         product_reviews.review_date AS review_date,
         userinfo.name AS name,
         product_reviews.star_rating AS star_rating

         FROM product_reviews
         
         JOIN userinfo ON userinfo.user_id = product_reviews.user_id
         WHERE product_reviews.product_id = ?;`,

    [productId],
    (error, result) => {
      if (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.json({ result });
      }
    }
  );
});

//商品細節頁-你可能會喜歡的商品隨機8筆
router.get("/recommend", (req, res) => {
  connection.execute(
    ` SELECT
        products.*,
        category.category_name AS category_name,
        subcategory.subcategory_name AS subcategory_name,
        GROUP_CONCAT(product_type.type_name SEPARATOR ', ') AS type_names
        FROM products
        JOIN category ON category.category_id = products.category_id
        JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id
        LEFT JOIN product_type ON product_type.product_id = products.product_id
        GROUP BY products.product_id, category_name, subcategory_name
        ORDER BY RAND()
        LIMIT 8;
        ;
        `,
    (error, result) => {
      res.json({ result });
    }
  );
});

//查看購物車內有甚麼商品   舊
// router.get("/cart/:userId", (req, res) => {
//     const userId = req.params.userId; // 從請求的 URL 中獲取用戶 token OK
//     console.log("會員:::::::"+ userId);
//     connection.execute(
//         `SELECT cart.*,
//         p.product_name AS name,
//         pt.type_name AS type,
//         p.images_one AS image,
//         p.specialoffer AS price
//         FROM cart
//         JOIN products AS p ON cart.product_id=p.product_id
//         JOIN product_type AS pt ON cart.product_type_id=pt.type_id AND p.product_id=pt.product_id
//         WHERE user_id=?;`,
//         [userId],
//         (error, result) => {
//             res.json({ result })
//         }
//     )
// })

//用來新增購物車裡沒有的商品 舊
// router.post("/cart", (req, res) => {
//     const userId = req.params.userId; // 從請求的 URL 中獲取用戶 token OK
//     const { product_id, product_type_id, quantity } = req.body; // 從請求主體中獲取 quantity 參數
//     connection.execute(
//         `INSERT INTO cart(user_id, product_id, product_type_id, quantity) VALUES (?, ?, ?, ?);`,
//         [userId,product_id, product_type_id, quantity], // 將 quantity 參數傳遞到 SQL 查詢中
//         (error, result) => {
//             if (error) {
//                 console.error("Error inserting into cart:", error);
//                 res.status(500).json({ error: "Internal Server Error" });
//             } else {
//                 res.json({ result });
//             }
//         }
//     );
// });

//用來新增購物車裡沒有的商品  舊
// router.put("/cart", (req, res) => {
//   const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token OK
//   const { product_id, product_type_id, quantity } = req.body; // 從請求主體中獲取 quantity 參數
//   connection.execute(
//     `INSERT INTO cart(user_id, product_id, product_type_id, quantity) VALUES (?, ?, ?, ?);`,
//     [userId, product_id, product_type_id, quantity], // 將 quantity 參數傳遞到 SQL 查詢中
//     (error, result) => {
//       if (error) {
//         console.error("Error inserting into cart:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json({ result });
//       }
//     }
//   );
// });

//用來修改購物車裡已經有的商品數量 舊
// router.put("/cartplus", (req, res) => {
//     console.log(req);
//     const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token OK
//     console.log("會員~~~~~" + userId);
//     const { id, newQuantity, type } = req.body;
//     connection.execute(
//         `UPDATE cart SET quantity=? WHERE user_id=? AND product_id=? AND product_type_id=?`,
//         [userId, newQuantity, id, type],
//         (error, result) => {
//             res.json({ result });
//         }
//     );
// });


//查看購物車
router.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId; // 從請求的 URL 中獲取用戶 token OK
  console.log("會員:::::::" + userId);
  connection.execute(
    `SELECT cart.*, 
        p.product_name AS name,
        pt.type_name AS type,
        p.images_one AS image,
        p.specialoffer AS price
        FROM cart 
        JOIN products AS p ON cart.product_id=p.product_id 
        JOIN product_type AS pt ON cart.product_type_id=pt.type_id AND p.product_id=pt.product_id
        WHERE user_id=?;`,
    [userId],
    (error, result) => {
      res.json({ result });
    }
  );
});

//新增購物車
router.put("/cart1/:user_id", (req, res) => {
  const userid = req.params.user_id
  console.log(userid);
  const { product_id, product_type_id, quantity } = req.body
  connection.execute(
    `INSERT INTO cart(user_id, product_id,  product_type_id,quantity) VALUES (?,?,?,?);`,
    [userid, product_id, product_type_id, quantity]
    , (error, result) => {
      res.json({ result })
    }
  )
})

//用來修改購物車裡已經有的商品數量
router.put("/cart2/:user_id", (req, res) => {
  console.log(req);
  const userid = req.params.user_id
  console.log(userid);
  const { product_id, newQuantity, product_type_id } = req.body
  console.log(product_id);
  connection.execute(
    `UPDATE cart SET quantity=? WHERE user_id=? AND product_id=? AND product_type_id=?`,
    [newQuantity, userid, product_id, product_type_id]
    , (error, result) => {
      res.json({ result })
    }
  )
})



//大類重新更新productdata //麵包屑連結
router.get("/product/category/:category_id", (req, res) => {
  const category_id = req.params.category_id;
  connection.execute(
    `SELECT products.*, category.category_name AS category_name, subcategory.subcategory_name AS subcategory_name FROM products JOIN category ON category.category_id = products.category_id JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id WHERE category.category_id=?;`,
    [category_id],
    (error, result) => {
      res.json({ result });
    }
  );
});
//小類重新更新productdata //麵包屑連結
router.get("/product/subcategory/:subcategory_id", (req, res) => {
  const subcategory_id = req.params.subcategory_id;
  connection.execute(
    `SELECT products.*, category.category_name AS category_name, subcategory.subcategory_name AS subcategory_name FROM products JOIN category ON category.category_id = products.category_id JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id WHERE subcategory.subcategory_id=?;`,
    [subcategory_id],
    (error, result) => {
      res.json({ result });
    }
  );
});


//產品列表頁大類小類篩選＋價格篩選＋上架時間與價格排序
router.get("/filter_sort", (req, res) => {
  const { search, vendor, subcategory, category, minPrice, maxPrice, sortBy } =
    req.query;
  console.log(req.query);


  // 創建查詢參數數組，將參數添加到數組中
  const queryParams = [];

  // 初始化 SQL 查詢字符串
  let sqlQuery = `
        SELECT p.*
        FROM products AS p
        JOIN subcategory AS s ON p.subcategory_id = s.subcategory_id
        JOIN category AS c ON p.category_id = c.category_id
        WHERE 1 = 1 
    `;

  if (category != null) {
    sqlQuery += "AND c.category_name = ? ";
    queryParams.push(category);
  }
  if (subcategory != null) {
    sqlQuery += "AND s.subcategory_name = ? ";
    queryParams.push(subcategory);
  }
  if (vendor != null) {
    sqlQuery += "AND vendor LIKE ? ";
    queryParams.push(`%${vendor}%`);
  }
  if (search != null) {
    sqlQuery += "AND (product_name LIKE ? OR vendor LIKE ?) ";
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  // 如果指定了最小價格和最大價格，將價格篩選條件添加到 SQL 查詢中
  if (minPrice && maxPrice) {
    sqlQuery += `AND p.specialoffer BETWEEN ? AND ? `;
    queryParams.push(minPrice, maxPrice);
  }

  // 根據 sortBy 條件添加升序或降序排序方式
  if (sortBy === "price_asc") {
    sqlQuery += `ORDER BY p.specialoffer ASC;`;
  } else if (sortBy === "price_desc") {
    sqlQuery += `ORDER BY p.specialoffer DESC;`;
  } else {
    // 添加默認排序方式，如果未提供 sortBy 條件
    sqlQuery += `ORDER BY p.created_at DESC, p.specialoffer ASC;`;
  }

  console.log("category:" + category);
  console.log("subcategory:" + subcategory);
  console.log("vendor:" + vendor);
  // console.log('vendor:' +`%${vendor}%`)
  console.log("qqqqqq");
  console.log(sqlQuery);
  console.log("qqqqqqaa");

  // 執行 SQL 查詢
  connection.execute(sqlQuery, queryParams, (error, result) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json({ result });
    }
  });
});

//商品列表頁vendor篩選
router.get("/vendor", (req, res) => {
  connection.execute(
    ` SELECT
          products.vendor
          FROM
          products
          GROUP BY
           products.vendor
          HAVING
          COUNT(products.vendor) > 1;
        `,
    (error, result) => {
      res.json({ result });
    }
  );
});

//加入收藏
//查看收藏內有甚麼商品
router.get("/collections/:user_id", (req, res) => {
  const userid = req.params.user_id
  console.log("收藏的id" + userid)
  connection.execute(
    `SELECT product_collections.*
        FROM product_collections
        WHERE user_id=?;`,
    [userid],
    (error, result) => {
      res.json({ result });
    }
  );
});

//用來新增收藏裡沒有的商品
router.put("/collections/:user_id", (req, res) => {
  const userid = req.params.user_id
  console.log("收藏的id" + userid)
  const { product_id } = req.body;
  console.log(product_id);
  const product_type = 1; // 如果 product_type 需要使用先設定

  connection.execute(
    `INSERT INTO product_collections(user_id, product_id, product_type) VALUES (?, ?, ?);`,
    [userid, product_id, product_type],
    (error, result) => {
      if (error) {
        console.error("Error inserting into cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ result });
      }
    }
  );
});

//取消收藏
router.delete("/collections/:user_id/:product_id", (req, res) => {
  const userid = req.params.user_id;
  console.log("取消收藏的id:" + userid);
  const product_id = req.params.product_id; // 從路由參數中取得 product_id
  console.log("取消收藏的product_id:" + product_id);
  const product_type = 1; // product_type 需要使用先設定

  connection.execute(
    `DELETE FROM product_collections WHERE user_id = ? AND product_id = ? AND product_type = ?;`,
    [userid, product_id, product_type],
    (error, result) => {
      if (error) {
        console.error("Error inserting into cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ result });
      }
    }
  );
});

// 首頁用商品資料新品 nono
router.get("/home", (req, res) => {
  connection.execute(
    `SELECT
        products.*,
        category.category_name AS category_name,
        subcategory.subcategory_name AS subcategory_name,
        GROUP_CONCAT(product_type.type_name SEPARATOR ', ') AS type_names
        FROM products
        JOIN category ON category.category_id = products.category_id
        JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id
        LEFT JOIN product_type ON product_type.product_id = products.product_id
        GROUP BY products.product_id
        ORDER BY created_at DESC
        LIMIT 8;
        `,
    (error, result) => {
      res.json({ result });
    }
  );
});

// 首頁用商品資料熱賣 nono
router.get("/home/sales", (req, res) => {
  connection.execute(
    `SELECT
        products.*,
        category.category_name AS category_name,
        subcategory.subcategory_name AS subcategory_name,
        GROUP_CONCAT(product_type.type_name SEPARATOR ', ') AS type_names
        FROM products
        JOIN category ON category.category_id = products.category_id
        JOIN subcategory ON subcategory.subcategory_id = products.subcategory_id
        LEFT JOIN product_type ON product_type.product_id = products.product_id
        GROUP BY products.product_id
        ORDER BY sales DESC
        LIMIT 8;
        `,
    (error, result) => {
      res.json({ result });
    }
  );
});

module.exports = router;