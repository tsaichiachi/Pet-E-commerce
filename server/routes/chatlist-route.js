const router = require("express").Router();
const connection = require("../db");

// 同時找u1 u2 都有某位user的時候
router.get("/:uid", (req, res) => {
  const uid = req.params.uid;
  connection.execute(
    `SELECT c.*,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.user_id
        WHEN c.chatlist_userId2 = ? THEN u1.user_id
      END AS user_id,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.name
        WHEN c.chatlist_userId2 = ? THEN u1.name
      END AS name,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.cover_photo
        WHEN c.chatlist_userId2 = ? THEN u1.cover_photo
      END AS cover_photo
      FROM chatlist AS c
      JOIN userinfo AS u1 ON c.chatlist_userId1 = u1.user_id
      JOIN userinfo AS u2 ON c.chatlist_userId2 = u2.user_id
      WHERE u1.user_id = ? OR u2.user_id = ?`,
    [uid, uid, uid, uid, uid, uid, uid, uid], // 筛选 chatlist_userId1 或 chatlist_userId2 包含 uid 的记录
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        if (result.length > 0) {
          // 如果找到了内容，回傳
          res.json(result);
        } else {
          // 如果未找到内容，回覆錯誤
          res.status(404).json({ error: "未找到聊天紀錄" });
        }
      }
    }
  );
});

//
router.get("/:uid/:cid", (req, res) => {
  const uid = req.params.uid;
  const cid = req.params.cid;
  connection.execute(
    `SELECT c.*,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.user_id
        WHEN c.chatlist_userId2 = ? THEN u1.user_id
      END AS user_id,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.name
        WHEN c.chatlist_userId2 = ? THEN u1.name
      END AS name,
      CASE
        WHEN c.chatlist_userId1 = ? THEN u2.cover_photo
        WHEN c.chatlist_userId2 = ? THEN u1.cover_photo
      END AS cover_photo
      FROM chatlist AS c
      JOIN userinfo AS u1 ON c.chatlist_userId1 = u1.user_id
      JOIN userinfo AS u2 ON c.chatlist_userId2 = u2.user_id
      WHERE c.chatlist_id = ? AND (u1.user_id = ? OR u2.user_id = ?)`,
    [uid, uid, uid, uid, uid, uid, cid, uid, uid],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "資料庫查詢失敗" });
      } else {
        if (result.length > 0) {
          // 如果找到了内容，回傳
          res.json(result);
        } else {
          // 如果未找到内容，回覆錯誤
          res.status(404).json({ error: "未找到聊天紀錄" });
        }
      }
    }
  );
});

router.post("/creatchat", (req, res) => {
  console.log("接收到新增聊天請求");
  const { chatlist_userId1, chatlist_userId2 } = req.body;
  console.log("chatlist_userId1:", chatlist_userId1);
  console.log("chatlist_userId2:", chatlist_userId2);

  if (!chatlist_userId1 || !chatlist_userId2) {
    console.log("請提供有效的使用者ID");
    return res.status(400).json({ error: "請提供有效的使用者ID" });
  }
  // 查詢是否已有存在紀錄
  connection.execute(
    `SELECT chatlist_id FROM chatlist WHERE
    (chatlist_userId1 = ? AND chatlist_userId2 = ?) OR
    (chatlist_userId1 = ? AND chatlist_userId2 = ?);`,
    [chatlist_userId1, chatlist_userId2, chatlist_userId2, chatlist_userId1],
    (error, results) => {
      if (error) {
        console.error("查詢聊天紀錄錯誤", error);
        return res.status(500).json({ error: "伺服器錯誤" });
      }

      if (results.length > 0) {
        // 如果已存在對應的資料，取得該資料的 chatlist_id
        const existingChatlistId = results[0].chatlist_id;
        const chatlistId = results[0].chatlist_id;
        console.log("existingChatlistId", existingChatlistId);
        const chatUrl = `/chatlist/${existingChatlistId}`;
        console.log("chatUrl", chatUrl);
        return res
          .status(200)
          .json({ message: "訊息已成功傳送", chatUrl, chatlistId });
      }

      // 如果没有就新增一筆
      connection.execute(
        `INSERT INTO chatlist (chatlist_userId1, chatlist_userId2)
        VALUES (?, ?);`,
        [chatlist_userId1, chatlist_userId2],
        (insertError, insertResult) => {
          if (insertError) {
            console.error("插入聊天记录时出错", insertError);
            return res.status(500).json({ error: "伺服器錯誤" });
          }

          const newChatlistId = insertResult.insertId;
          const chatlistId = insertResult.insertId;
          console.log("newChatlistId", newChatlistId);
          const chatUrl = `/chatlist/${newChatlistId}`;
          console.log("newchatUrl", chatUrl);
          return res
            .status(201)
            .json({ message: "訊息已成功傳送", chatUrl, chatlistId });
        }
      );
    }
  );
});

router.get("/", (req, res) => {
  res.send("測試");
});

module.exports = router;
