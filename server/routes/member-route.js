const router = require("express").Router();
const dayjs = require("dayjs");
const conn = require("../db");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/helper-image")); // 設置上傳文件的儲存路徑
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // 設置上傳文件的文件名
  },
});

const upload = multer({ storage: storage });
router.get("/", (req, res) => {
  res.send("member-route測試成功");
});

router.get("/helper", async (req, res) => {
  const { user_id } = req.query;
  console.log(req.query);
  const profile = await new Promise((resolve, reject) => {
    return conn.execute(
      `SELECT h.*,u.cat_helper FROM mission_helper_info h LEFT JOIN userinfo u ON u.user_id = h.user_id WHERE h.user_id = ?`,
      [user_id],
      (err, results) => {
        if (err) {
          console.log(err);

          reject({ status: 500, data: "資料庫查詢失敗" });
        }
        resolve(results);
      }
    );
  });
  const images = await new Promise((resolve, reject) => {
    return conn.execute(
      `SELECT * FROM image_helper WHERE group_id =?`,
      [user_id],
      (err, results) => {
        if (err) {
          console.log(err);
          reject({ status: 500, data: "資料庫查詢失敗" });
        }
        resolve(results);
      }
    );
  });
  return res.send({ status: 200, profile, images });
});
router.patch("/helper/valid", async (req, res) => {
  const { user_id, valid } = req.body;
  console.log(user_id);

  // 驗證使用者是否存在
  const checkUser = await new Promise((resolve, reject) => {
    return conn.execute(
      `SELECT * FROM userinfo WHERE user_id = ?`,
      [user_id],
      (err, results) => {
        if (err) {
          reject({ status: 500, error: "使用者查詢錯誤" });
        }
        resolve(results.length);
      }
    );
  });

  if (!checkUser) {
    return res.status(400).send({ status: 400, msg: "查無該使用者" });
  }

  if (!valid) {
    // valid當前為false(代表想要開啟)，先檢查是否有該使用者的小幫手資料
    const isExist = await new Promise((resolve, reject) => {
      return conn.execute(
        `SELECT user_id FROM mission_helper_info WHERE user_id = ?`,
        [user_id],
        (err, results) => {
          if (err) {
            reject({ status: 500, error: "查詢錯誤" });
          }
          resolve(results.length);
        }
      );
    });
    if (isExist) {
      console.log(
        "有找到該使用者的小幫手資料，修改user的cat_helper值後將資料帶回給客戶端"
      );

      // 修改cat_helper值
      await new Promise((resolve, reject) => {
        return conn.execute(
          "UPDATE `userinfo` SET `cat_helper` = ? WHERE `userinfo`.`user_id` = ?",
          [1, user_id],
          (err, results) => {
            if (err) {
              reject({ status: 500, error: "查詢錯誤" });
            } else if (results.affectedRows === 0) {
              reject({ status: 500, error: "更新失敗" });
            }
            resolve(results);
          }
        );
      });

      const helper_info_promise = new Promise((resolve, reject) => {
        return conn.execute(
          `SELECT * FROM mission_helper_info WHERE user_id = ?`,
          [user_id],
          (err, results) => {
            if (err) {
              reject({ status: 500, error: "查詢錯誤" });
            }
            resolve(results);
          }
        );
      });
      const helper_image_promise = new Promise((resolve, reject) => {
        return conn.execute(
          `SELECT file_path FROM image_helper WHERE group_id = ?`,
          [user_id],
          (err, results) => {
            if (err) {
              reject({ status: 500, error: "查詢錯誤" });
            }
            resolve(results);
          }
        );
      });
      let [info, image] = await Promise.all([
        helper_info_promise,
        helper_image_promise,
      ]);
      return res.send({ status: 200, info, image });
    } else {
      console.log("沒找到，要幫使用者建立一筆新的小幫手資料");

      // 先查詢對應的user資料
      const { name, phone, city, email } = await new Promise(
        (resolve, reject) => {
          return conn.execute(
            `SELECT ui.*FROM userinfo WHERE ui.user_id = ?`,
            [user_id],
            (err, results) => {
              if (err) {
                reject({ status: 500, error: "查詢錯誤" });
              }
              resolve(results[0]);
            }
          );
        }
      );

      // 用取得的user資料新增一筆小幫手資料
      const newHelperInfo = await new Promise((resolve, reject) => {
        return conn.execute(
          "INSERT INTO `mission_helper_info` (`user_id`, `name`, `Introduction`, `email`, `phone`, `job_description`, `service_county`, `feed_service`, `house_service`, `beauty_service`, `feed_price`, `house_price`, `beauty_price`) VALUES (?, ?, '', ?, ?, '', ?, 0, 0, 0, 0, 0, 0)",
          [user_id, name, email, phone, city],
          (err, results) => {
            if (err) {
              reject({ status: 500, error: "小幫手資料寫入錯誤" });
            }
            resolve(results);
          }
        );
      });

      // 將userinfo 的 cat_helper值改為1
      await new Promise((resolve, reject) => {
        return conn.execute(
          "UPDATE `userinfo` SET `cat_helper` = ? WHERE `userinfo`.`user_id` = ?",
          [1, user_id],
          (err, results) => {
            if (err) {
              reject({ status: 500, error: "小幫手資料寫入錯誤" });
            }
            resolve(results);
          }
        );
      });

      // 將新增成功的小幫手資料帶回client端
      conn.execute(
        `SELECT * FROM mission_helper_info WHERE user_id = ?`,
        [user_id],
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              status: 500,
              msg: "伺服器查詢小幫手資料錯誤",
            });
          }
          return res.send({ status: 200, data: results[0] });
        }
      );
    }
  } else {
    // valid為true(要關閉)，修改userinfo的cat_helper資料 = 0
    conn.execute(
      "UPDATE `userinfo` SET `cat_helper` = ? WHERE `userinfo`.`user_id` = ?",
      [0, user_id],
      (err, results) => {
        if (err) {
          return res.status(500).send({ status: 500, error: "伺服器錯誤" });
        } else if (results.affectedRows === 0) {
          return res.status(500).send({ status: 500, error: "更新失敗" });
        }
        return res.send({ status: 200, msg: "修改valid成功" });
      }
    );
  }
});
router.put("/helper", upload.array("newImages"), async (req, res) => {
  try {
    const {
      user_id,
      name,
      Introduction,
      email,
      phone,
      feed_price,
      house_price,
      beauty_price,
      service_county,
      feed_service,
      house_service,
      beauty_service,
      oldImages,
    } = req.body;
    console.log(req.body);

    // 更新小幫手資料
    const updateResult = await new Promise((resolve, reject) => {
      conn.execute(
        "UPDATE `mission_helper_info` SET `name` = ?, `Introduction` = ?, `email` = ?, `phone` = ?, `service_county` = ?, `feed_service` = ?, `house_service` = ?, `beauty_service` = ?, `feed_price` = ?, `house_price` = ?, `beauty_price` = ? WHERE `mission_helper_info`.`user_id` = ?",
        [
          name,
          Introduction,
          email,
          phone,
          service_county,
          parseBoolean(feed_service),
          parseBoolean(house_service),
          parseBoolean(beauty_service),
          feed_price,
          house_price,
          beauty_price,
          user_id,
        ],
        (err, results) => {
          if (err) {
            reject({ status: 500, error: "查詢錯誤" });
          }
          resolve(results);
        }
      );
    });

    // 先刪除舊的被使用者移除的小幫手照片
    const placeholders = oldImages.map((image) => "?").join(","); //依舊相片數量動態產生佔位符陣列，再用join將陣列中的?用逗點區隔成一個字串
    const sql = `DELETE FROM image_helper WHERE image_helper.group_id = ? AND image_helper.file_path NOT IN(${placeholders})`;
    const params = [user_id, ...oldImages];
    const deleteImageResult = await new Promise((resolve, reject) => {
      conn.execute(sql, params, (err, results) => {
        if (err) {
          reject({ status: 500, error: "查詢錯誤" });
        }
        resolve(results);
      });
    });

    // 再增加新的小幫手照片
    if (req.files.length > 0) {
      const insertImageResults = await Promise.all(
        req.files.map(async (image) => {
          try {
            const file_path = `http://localhost:3005/helper-image/${image.filename}`;
            return await new Promise((resolve, reject) => {
              conn.execute(
                "INSERT INTO `image_helper` (`image_id`, `group_id`, `file_path`) VALUES (NULL, ?, ?)",
                [user_id, file_path],
                (err, results) => {
                  if (err) {
                    reject({ status: 500, error: "查詢錯誤" });
                  }
                  resolve(results);
                }
              );
            });
          } catch (error) {
            throw error;
          }
        })
      );
    }

    // 將更新後的資料回傳至client端
    const infoPromise = new Promise((resolve, reject) => {
      conn.execute(
        `SELECT * FROM mission_helper_info WHERE user_id = ?`,
        [user_id],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(result[0]);
        }
      );
    });
    const imagesPromise = new Promise((resolve, reject) => {
      conn.execute(
        `SELECT * FROM image_helper WHERE group_id = ?`,
        [user_id],
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          }
          resolve(result);
        }
      );
    });
    // 使用 Promise.all 等待所有查詢完成
    const [info, images] = await Promise.all([infoPromise, imagesPromise]);

    return res.send({ status: 200, info, images });
  } catch (error) {
    // 錯誤處理
    console.error(error);
  }
});
router.get("/reserve", (req, res) => {
  const { user_id, status } = req.query;
  conn.execute(
    `SELECT * FROM mission_req_orders WHERE status = ? AND customer_userId = ?`,
    [status, user_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ status: 500, error: "資料查詢錯誤" });
      }
      console.log(results);
      results = results.map((item) => {
        const start_day = transferDate(item.start_day);
        const end_day = transferDate(item.end_day);
        const created_at = transferDate(item.created_at);
        return { ...item, start_day, end_day, created_at };
      });
      return res.send({ status: 200, data: results });
    }
  );
});
router.get("/reserve/review", (req, res) => {
  const { case_id } = req.query;
  conn.execute(
    `SELECT r.*,u.cover_photo,u.name ,COUNT(*) AS review_count FROM mission_helper_reviews r LEFT JOIN userinfo u ON u.user_id = r.user_id WHERE request_id = ?`,
    [case_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("資料庫查詢錯誤");
      }
      result = result.map((item) => {
        return { ...item, review_date: transferDate(item.review_date) };
      });
      console.log(result);
      return res.send({ status: 200, data: result[0] });
    }
  );
});
router.post("/reserve/review", (req, res) => {
  const { case_id, user_id, helper_id, review_content, star_rating } = req.body;
  console.log(req.body);
  conn.execute(
    "INSERT INTO `mission_helper_reviews` (`review_id`, request_id,`user_id`, `helper_id`, `review_content`, `star_rating`, `review_date`) VALUES (NULL,?, ?, ?, ?, ?, current_timestamp())",
    [case_id, user_id, helper_id, review_content, star_rating],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("資料庫寫入錯誤");
      }
      return res.send({ status: 200, data: results });
    }
  );
});
router.patch("/reserve/detail/status", (req, res) => {
  const { oid, status } = req.body;
  // console.log(pid, status);

  conn.execute(
    "UPDATE `mission_req_orders` SET `status` = ? WHERE `mission_req_orders`.`oid` = ?",
    [status, oid],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("資料庫修改失敗");
      }
      console.log(results);
      return res.send({ status: 200, affectedRows: results.affectedRows });
    }
  );
});
router.get("/reserve/detail/:oid", async (req, res) => {
  const { oid } = req.params;
  try {
    const order = await new Promise((resolve, reject) => {
      return conn.execute(
        `SELECT q.*,p.* FROM mission_req_orders q LEFT JOIN users_pet_info p ON q.pet_info_id = p.pet_id WHERE q.oid = ?`,
        [oid],
        (err, results) => {
          if (err) {
            console.log(err);
            reject({ status: 500, error: "資料查詢錯誤" });
          }
          results = results.map((item) => {
            const start_day = transferDate(item.start_day);
            const end_day = transferDate(item.end_day);
            const created_at = transferDate(item.created_at);
            return { ...item, start_day, end_day, created_at };
          });
          resolve(results[0]);
        }
      );
    });
    const helper_id = order?.helper_userId;
    const customer_id = order?.customer_userId;
    const helper_info = await new Promise((resolve, reject) => {
      return conn.execute(
        `SELECT h.user_id,h.name,h.email,h.phone,u.cover_photo FROM mission_helper_info h LEFT JOIN userinfo u ON h.user_id = u.user_id WHERE h.user_id = ?`,
        [helper_id],
        (err, results) => {
          if (err) {
            console.log(err);
            reject({ status: 500, error: "資料查詢錯誤" });
          }
          resolve(results[0]);
        }
      );
    });
    const customer_info = await new Promise((resolve, reject) => {
      return conn.execute(
        `SELECT u.user_id,u.name,u.phone,u.cover_photo,u.email FROM userinfo u WHERE user_id = ?`,
        [customer_id],
        (err, results) => {
          if (err) {
            console.log(err);
            reject({ status: 500, error: "資料查詢錯誤" });
          }
          resolve(results[0]);
        }
      );
    });
    return res.send({ status: 200, customer_info, helper_info, order });
  } catch (e) {
    console.log(e);
    return res.status(500).send("服務器查詢錯誤");
  }
});

router.get("/selling", (req, res) => {
  const { user_id, status } = req.query;
  // console.log(user_id);
  conn.execute(
    `SELECT * FROM mission_req_orders WHERE status = ? AND helper_userId = ?`,
    [status, user_id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ status: 500, error: "資料查詢錯誤" });
      }
      results = results.map((item) => {
        const start_day = transferDate(item.start_day);
        const end_day = transferDate(item.end_day);
        const created_at = transferDate(item.created_at);
        return { ...item, start_day, end_day, created_at };
      });
      return res.send({ status: 200, data: results });
    }
  );
});
// router.get("/selling/detail/:pid", (req, res) => {
//   const { pid } = req.params;
//   console.log(pid);
//   conn.execute(
//     `SELECT q.*,p.* FROM mission_req_orders q LEFT JOIN users_pet_info p ON q.pet_info_id = p.pet_id WHERE q.oid = ?`,
//     [pid],
//     (err, results) => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send({ status: 500, error: "資料查詢錯誤" });
//       }
//       results = results.map((item) => {
//         const start_day = transferDate(item.start_day);
//         const end_day = transferDate(item.end_day);
//         const created_at = transferDate(item.created_at);
//         return { ...item, start_day, end_day, created_at };
//       });
//       return res.send({ status: 200, data: results[0] });
//     }
//   );
// });
module.exports = router;

function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-7); // 取得時間戳記的後六位數
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomLetters = "";

  // 生成隨機的三個英文字母
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    randomLetters += letters.charAt(randomIndex);
  }

  // 組合訂單編號
  const orderNumber = randomLetters + timestamp;
  return orderNumber;
}

const transferDate = (date) => {
  const newDay = dayjs(date).format("YYYY-MM-DD");
  return newDay;
};

function parseBoolean(str) {
  if (str === "true" || str === "1") {
    return true;
  } else if (str === "false" || str === "0") {
    return false;
  }
}
