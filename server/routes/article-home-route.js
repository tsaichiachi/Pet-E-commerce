const router = require("express").Router();
const connection = require("../db");

router.get("/", (req, res) => {
  connection.execute(
    `SELECT *
        FROM article
        JOIN article_category ON article.article_category_id = article_category.article_category_id
        JOIN article_images ON article.article_id = article_images.article_id
        ORDER BY article.published_date DESC -- 按日期排序
        LIMIT 9 -- 選九個
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

module.exports = router;
