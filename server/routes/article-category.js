const router = require("express").Router();
const connection = require("../db");

router.get("/", (req, res) => {
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

module.exports = router;
