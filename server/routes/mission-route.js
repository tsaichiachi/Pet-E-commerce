const router = require("express").Router();
const conn = require("../db");
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

router.get("/", (req, res) => {
  res.send("mission-route測試成功");
});

// 共用的 SQL 子查詢，找出每個任務的最小 image_id
const commonSubquery = `
  SELECT mission_id, MIN(image_id) AS min_image_id
  FROM image_mission
  GROUP BY mission_id
`;

// 共用的 SQL 查詢模板
const commonQueryTemplate = `
  SELECT md.*, im.file_path AS file_path
  FROM mission_detail AS md
  JOIN (${commonSubquery}) AS min_ids ON md.mission_id = min_ids.mission_id
  JOIN image_mission AS im ON min_ids.mission_id = im.mission_id AND min_ids.min_image_id = im.image_id
`;

// 任務列表：排序＋篩選＋搜尋
router.get("/all-missions", (req, res) => {
  let sortOrder = req.query.sortOrder;
  let orderBy = req.query.sortBy;

  // 獲取任務類型篩選條件
  let filteredMissionType = req.query.missionType;
  let missionTypeFilter = null; // 先聲明變量（很重要！否則當missionTypeFilter=null會沒資料 會無法清除篩選）

  // 獲取城市和地區篩選條件
  let cityFilter = req.query.missionCity;
  let areaFilter = req.query.missionArea;

  // 獲取日期篩選條件
  let updateFilter = req.query.updateDate;
  let dateRangeStart = null;
  let dateRangeEnd = null;

  // 搜尋
  let searchQuery = req.query.missionSearch;

  // 獲取排序條件
  if (orderBy === "post_date") {
    orderBy = "md.post_date";
  } else if (orderBy === "price") {
    orderBy = "md.price";
  }

  // 獲取篩選條件
  if (filteredMissionType === "feed") {
    missionTypeFilter = 1;
  } else if (filteredMissionType === "house") {
    missionTypeFilter = 2;
  } else if (filteredMissionType === "beauty") {
    missionTypeFilter = 3;
  } else if (filteredMissionType === "training") {
    missionTypeFilter = 4;
  } else if (filteredMissionType === "medical") {
    missionTypeFilter = 5;
  }

  // 根據日期篩選條件計算日期範圍
  if (updateFilter === "today") {
    const today = new Date(); // 獲取今天的日期和時間
    today.setHours(0, 0, 0, 0); // 將時間設為 00:00:00.000
    const tomorrow = new Date(today); // 複製今天的日期
    tomorrow.setDate(tomorrow.getDate() + 1); // 增加一天 到明天的00:00
    dateRangeStart = today.toISOString();
    dateRangeEnd = tomorrow.toISOString();
  } else if (updateFilter === "one_week") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    dateRangeStart = oneWeekAgo.toISOString();
    dateRangeEnd = tomorrow.toISOString();
  } else if (updateFilter === "one_month") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    dateRangeStart = oneMonthAgo.toISOString();
    dateRangeEnd = tomorrow.toISOString();
  }

  let query = commonQueryTemplate;

  // WHERE 子句
  let whereClause = [];

  // 如果提供了任務類型篩選條件，將其包含在 WHERE 子句中
  if (missionTypeFilter) {
    whereClause.push(`md.mission_type = ${missionTypeFilter}`);
  }

  // 如果提供了城市篩選條件，將其包含在 WHERE 子句中
  if (cityFilter) {
    whereClause.push(`md.city = '${cityFilter}'`);
  }

  // 如果提供了地區篩選條件，將其包含在 WHERE 子句中
  if (areaFilter) {
    whereClause.push(`md.area = '${areaFilter}'`);
  }

  // 如果提供了日期篩選條件，將其包含在 WHERE 子句中
  if (dateRangeStart && dateRangeEnd) {
    whereClause.push(`md.update_date BETWEEN '${dateRangeStart}' AND '${dateRangeEnd}'`);
  }

  // 搜尋
  if (searchQuery) {
    whereClause.push(`md.title LIKE '%${searchQuery}%'`);
  }

  // 如果有 WHERE 子句，將其加入查詢
  if (whereClause.length > 0) {
    query += ` WHERE ${whereClause.join(' AND ')}`;
  }

  if (orderBy) {
    // 只有在提供有效的 orderBy 時才應用排序
    query += `
      ORDER BY ${orderBy} ${sortOrder}
    `;
  }

  conn.execute(query, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send({ status: 200, data: result });
  });
});

// 最新任務
router.get("/latest-missions", (req, res) => {
  conn.execute(
    `${commonQueryTemplate}
    ORDER BY md.update_date DESC, md.mission_id DESC  
    LIMIT 11;`,  // 首先按照update_date排序，如果日期相同，則按照mission_id排序
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send({ status: 200, data: result });
    }
  );
});

// 列表頁：先取得收藏的任務有哪些
router.get("/fav", (req, res) => {
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    `SELECT mf.*,md.mission_id AS mission_id
    FROM mission_fav AS mf
    JOIN mission_detail AS md ON mf.mission_id = md.mission_id 
    WHERE mf.user_id = ?;`,
    [userId],
    (error, result) => {
      res.json({ result });
    }
  );
});

// 列表頁：任務加入收藏
router.put("/add-fav", (req, res) => {
  const { missionId } = req.body; // 從請求體中獲取任務的 missionId  
  console.log("req.body:", req.body);
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    `INSERT INTO mission_fav(mission_id, user_id) VALUES (?,?)`,
    [missionId, userId], // 使用參數化查詢來防止 SQL 注入攻擊
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: '加到收藏出錯' });
      } else {
        res.json({ result });
      }
    }
  );
});

// 列表頁：任務取消收藏
router.delete("/delete-fav", (req, res) => {
  const { missionId } = req.body;
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    "DELETE FROM mission_fav WHERE mission_id = ? AND user_id = ?;",
    [missionId, userId],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: '移除收藏出錯' });
      } else {
        res.json({ result });
      }
    }
  );
});

// 任務詳細頁：可以成功併成一筆資料：
router.get("/mission-details/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  conn.execute(
    `
    SELECT md.*, u.name, u.gender, u.cover_photo, u.email, GROUP_CONCAT(DISTINCT im.file_path ORDER BY im.image_id) AS file_paths
    FROM mission_detail AS md 
    JOIN userinfo AS u ON md.post_user_id = u.user_id 
    JOIN image_mission AS im ON md.mission_id = im.mission_id
    WHERE md.mission_id = ?
    GROUP BY md.mission_id;
    `,
    [mission_id],  // 使用 mission_id 進行查詢
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send({ status: 200, data: result });
    }
  );
});

// 任務詳細頁：取得收藏的任務
router.get("/fav/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  console.log("mission_id是:" + mission_id + "userId是:" + userId)
  conn.execute(
    `SELECT mf.*,md.mission_id AS mission_id
    FROM mission_fav AS mf
    JOIN mission_detail AS md ON mf.mission_id = md.mission_id 
    WHERE mf.mission_id = ? AND mf.user_id = ?;`,
    [mission_id, userId],
    (error, result) => {
      res.json({ result });
    }
  );
});
// 任務詳細頁：加入收藏
router.put("/add-fav/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    `INSERT INTO mission_fav(mission_id, user_id) VALUES (?,?)`,
    [mission_id, userId], // 使用參數化查詢來防止 SQL 注入攻擊
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: '加到收藏出錯' });
      } else {
        res.json({ result });
      }
    }
  );
});
// 任務詳細頁：取消收藏
router.delete("/delete-fav/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    "DELETE FROM mission_fav WHERE mission_id = ? AND user_id = ?;",
    [mission_id, userId],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: '移除收藏出錯' });
      } else {
        res.json({ result });
      }
    }
  );
});

// 任務詳細頁：GOOGLE地圖API
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyD3M4Wt4xdyN-LrJyCVDwGSUkQ1B8KpKT8'
});
router.get("/mission-details-map/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  conn.execute(
    `
    SELECT md.*
    FROM mission_detail AS md 
    WHERE md.mission_id = ?
    ;`,
    [mission_id],  // 使用 mission_id 進行查詢
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      // GOOGLE地圖API
      const missionData = result[0];
      const { city, area, location_detail } = missionData;
      console.log("Mission Data:", missionData);

      // 组合成完整的地址
      const address = `${city}, ${area}, ${location_detail}`;

      // 使用 Google 地圖 API 進行地理編碼（地址反查）
      googleMapsClient.geocode({ address }, (geoErr, geoResponse) => {
        if (geoErr) {
          console.error(geoErr);
          res.status(500).send({ status: 500, message: 'Geocoding error' }); // 沒成功連到API的時候會顯示
          return;
        }

        const location = geoResponse.json.results[0].geometry.location;
        // 將地理編碼的結果加到 missionData 中
        missionData.location = location;

        res.send({ status: 200, data: missionData });
      });
      // res.send({ status: 200, data: result });
    }
  );
});

// 任務詳細頁：可以讓照片正常顯示
router.get("/mission-details-img/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  conn.execute(
    `SELECT md.*, im.file_path AS file_path
    FROM mission_detail AS md
    JOIN image_mission AS im ON md.mission_id = im.mission_id
    WHERE md.mission_id = ?
    ;`
    , [mission_id],  // 使用 mission_id 進行查詢
    (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      res.send({ status: 200, data: result });
    }
  );
})

// 應徵紀錄
router.post("/add-record", (req, res) => {
  const { missionId } = req.body; // 從請求體中獲取任務的 missionId  
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 將時間設為 00:00:00.000
  const tomorrow = new Date(today); // 複製今天的日期
  tomorrow.setDate(tomorrow.getDate() + 1); // 增加一天 到明天的00:00
  const formattedDate = tomorrow.toISOString().split('T')[0]; // 格式化成 YYYY-MM-DD 格式的日期字符串
  console.log("req.body:", req.body);
  conn.execute(
    `INSERT INTO mission_record(user_id, mission_id, job_date) VALUES (?,?,?)`,
    [userId, missionId, formattedDate],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: '加到應徵紀錄出錯' });
      } else {
        res.json({ result });
      }
    }
  );
});

// 根據應徵紀錄找出「熱門任務」
router.get("/popular", (req, res) => {
  conn.execute(    // 算出每個mission_id有多少個不同的user_id 並從中選出有最多不同user_id的mission_id
    `SELECT md.*, im.file_path AS file_path, COUNT(DISTINCT mr.user_id) AS user_count
    FROM mission_detail AS md
    JOIN mission_record AS mr ON md.mission_id = mr.mission_id
    JOIN (${commonSubquery}) AS min_ids ON md.mission_id = min_ids.mission_id
    JOIN image_mission AS im ON min_ids.mission_id = im.mission_id AND min_ids.min_image_id = im.image_id
    GROUP BY md.mission_id
    ORDER BY user_count DESC
    LIMIT 6    
    ;`,
    (error, result) => {
      res.json({ result });
    }
  );
});

// 詳細頁：算已應徵人數
router.get("/record-count/:mission_id", (req, res) => {
  const mission_id = req.params.mission_id; // 從路由參數中獲取 mission_id
  conn.execute(    // 算出每個mission_id有多少個不同的user_id 並從中選出有最多不同user_id的mission_id
    `SELECT mission_id, COUNT(DISTINCT user_id) AS user_count
    FROM mission_record
    WHERE mission_id = ?
    ;`,
    [mission_id],  // 使用 mission_id 進行查詢
    (error, result) => {
      res.json({ result });
    }
  );
});

// 彈跳視窗：登入者資訊
router.get("/login-user", (req, res) => {
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    `SELECT u.*
    FROM userinfo AS u
    WHERE u.user_id = ?;`,
    [userId],
    (error, result) => {
      res.json({ result });
    }
  );
});

// 彈跳視窗（勾選）：取得小幫手履歷
router.get("/helper-info", (req, res) => {
  const userId = req.query.userId; // 從請求的 URL 中獲取用戶 token
  conn.execute(
    `SELECT u.cat_helper, h.introduction, h.name, h.email, h.phone
    FROM userinfo AS u
    JOIN mission_helper_info AS h ON u.user_id = h.user_id 
    WHERE u.user_id = ? ;`,
    [userId],
    (error, result) => {
      res.json({ result });
    }
  );
});

// 收藏（寫法二）
// 查看收藏內有什麼任務
router.get("/collections/:user_id", (req, res) => {
  const userid = req.params.user_id
  console.log("收藏的id" + userid)
  conn.execute(
    `SELECT mf.*
      FROM mission_fav AS mf
      WHERE user_id=?;`,
    [userid],
    (error, result) => {
      res.json({ result });
    }
  );
});

// 用來新增收藏裡沒有的商品
router.put("/collections/:user_id", (req, res) => {
  const userid = req.params.user_id
  console.log("收藏的id" + userid)
  const { mission_id } = req.body;
  console.log(mission_id);

  conn.execute(
    `INSERT INTO mission_fav(mission_id, user_id) VALUES (?,?)`,
    [mission_id, userid],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ result });
      }
    }
  );
});

// 取消收藏
router.delete("/collections/:user_id/:mission_id", (req, res) => {
  const userid = req.params.user_id;
  console.log("取消收藏的id:" + userid);
  const mission_id = req.params.mission_id; // 從路由參數中取得 mission_id
  console.log("取消收藏的mission_id:" + mission_id);

  conn.execute(
    "DELETE FROM mission_fav WHERE mission_id = ? AND user_id = ?;",
    [mission_id, userid],
    (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ result });
      }
    }
  );
});

module.exports = router;