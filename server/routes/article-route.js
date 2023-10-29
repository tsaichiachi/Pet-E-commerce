const router = require("express").Router();
const connection = require("../db");

router.get("/:cid", (req, res) => {
  let cid = req.params.cid;
  connection.execute(
    `SELECT *
      FROM article
      JOIN article_category ON article.article_category_id = article_category.article_category_id
      JOIN article_images ON article.article_id = article_images.article_id
      WHERE article.article_category_id = ?`,
    [cid], // 使用文章的 article_id 篩選特定文章
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        if (result.length > 0) {
          // 如果找到了文章，回傳
          res.json(result);
        } else {
          // 如果未找到文章，回覆錯誤
          res.status(404).json({ error: "文章未找到" });
        }
      }
    }
  );
});

router.get("/category", (req, res) => {
  connection.execute(
    `SELECT *
      FROM article_category;`,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        res.json({ result });
      }
    }
  );
});

router.get("/:cid/:id", (req, res) => {
  let id = req.params.id;
  connection.execute(
    `SELECT *
      FROM article
      JOIN article_category ON article.article_category_id = article_category.article_category_id
      JOIN article_images ON article.article_id = article_images.article_id
      WHERE article.article_id = ?`,
    [id], // 使用文章的 article_id 篩選特定文章
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        if (result.length > 0) {
          // 如果找到了文章，回傳
          res.json(result[0]);
        } else {
          // 如果未找到文章，回覆錯誤
          res.status(404).json({ error: "文章未找到" });
        }
      }
    }
  );
});

router.get("/home", (req, res) => {
  // connection.execute(
  //   `SELECT *
  //     FROM article
  //     JOIN article_category ON article.article_category_id = article_category.article_category_id
  //     JOIN article_images ON article.article_id = article_images.article_id
  //     ORDER BY article.published_date DESC -- 按日期排序
  //     LIMIT 9 -- 選九個
  //   `,
  //   (error, result) => {
  //     if (error) {
  //       console.error(error);
  //       res.status(500).json({ error: "資料庫查詢失敗" });
  //     } else {
  //       if (result.length > 0) {
  //         res.json(result);
  //       } else {
  //         res.status(404).json({ error: "文章未找到" });
  //       }
  //     }
  //   }
  // );

  res.send("test");
});

router.get("/", (req, res) => {
  connection.execute(
    `SELECT *
      FROM article
      JOIN article_category ON article.article_category_id = article_category.article_category_id
      JOIN article_images ON article.article_id = article_images.article_id
      ORDER BY article.published_date DESC -- 照日期排序
    `,
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        if (result.length > 0) {
          res.json(result);
        } else {
          res.status(404).json({ error: "文章未找到" });
        }
      }
    }
  );
});

// router.get("/test", (req, res) => {
//   res.send("test");
// });

module.exports = router;
