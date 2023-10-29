const express = require('express');
const router = require("express").Router();
const multer = require('multer');
//const moment = require('moment');

const mysql = require("mysql2");

const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = "secretkey";
const upload = multer();

//const bcrypt = require('bcrypt');

//連接資料庫
const db = require("../db");
//---------------------------------------------


// 設定部份
let whitelist = [
  "http://127.0.0.1:3005",
  "http://localhost:3005",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  undefined
];
let corsOptions = {
credentials: true,
origin: function (origin, callback) {
  if (whitelist.indexOf(origin) !== -1) {
    callback(null, true)
  } else {
    callback(new Error('Not allowed by CORS'))
  }
}
}
const app = express()
app.use(cors(corsOptions))
//解析 json 格式的要求主體
app.use(express.json())
//解析 URL 編碼的要求主體
app.use(express.urlencoded({extended:true}))
//---------------------------------------------


router.get("/", (req,res)=>{
    res.send("auth-jwt測試成功，這是 auth-jwt 路由的根路徑");
})
router.get("/test", (req, res) => {
    const user = req.user
    return res.json({message: 'authorized', user})
  });

router.post("/login", upload.none(), async (req, res) => {
    const { email, password } = req.body;
    try {
      const results = await new Promise((resolve, reject) => {
        // 使用email和password進行登入驗證
        db.query('SELECT * FROM userinfo WHERE email = ? AND password = ?', [email, password], (err, results) => {
          if (err) {
            console.error('資料庫-查詢錯誤：', err);
            reject(err);
            return
          }
          if (results.length === 0) {
            reject('帳號或密碼錯誤');
            return
          } else {
            resolve(results[0]);
          }
        });
      });
  
      if (results.length === 0) {
        res.status(401).json({ message: '帳號或密碼錯誤', code: '401' });
        return;
      } else {
        // 登入成功，執行你的JWT發送邏輯
        const user = results;
        const token = jwt.sign(
          {
            name: user.name, // 使用者的唯一識別符
          email: user.email, // 使用者的名稱
          password: user.password,// 使用者的電子郵件
          avatar: user.cover_photo,
          id: user.user_id
          },
          secretKey,
          { expiresIn: '1d' }
        );
         return res.status(200).json({ message: 'success login', code: '200', token: token })
        
      }
    } catch (err) {
      console.error('捕獲到異常：', err);
      return res.status(500).json({ message: '資料庫查詢錯誤', code: '500' });
    }
  });

router.post("/logout", checkToken,(req,res)=>{
  console.log(req.decoded) //解碼後的資料-終端機
  const currentUser = req.decoded.id;
  db.query('SELECT * FROM users WHERE email = ?', [currentUser], (err, results) => {
    if(err){
      console.error('資料庫-查詢錯誤：', err);
      res.status(500).json({ message: '登出失敗請洽管理人員', code: '500' });
    }else{
      if(results.length>0){
        const token = jwt.sign(
          {
          //清空
          },
          secretKey,
          { expiresIn: '-10s' }
        );
        res.status(200).json({ message: 'success login', code: '200', token: token });
    }
  }})
})

router.post("/checkLogin", checkToken,(req,res)=>{
  const currentUser = req.decoded;
  const token=jwt.sign(
    {
      name: currentUser .name, // 使用者的唯一識別符
          email: currentUser .email, // 使用者的名稱
          password: currentUser .password,// 使用者的電子郵件
          avatar: currentUser .cover_photo,
          id: user.user_id
    },
    secretKey,
    { expiresIn: '1d' }

  );
  res.status(200).json({
    message:"用戶已登入",
    code:"200",
    user:{
      name: currentUser.name,
      email: currentUser.email,
      password: currentUser.password,
      avatar: currentUser.cover_photo,
      id: currentUser.user_id,
    },
    token:token
  })

})

//會員基本資料api
router.get("/profile", checkToken, (req, res) => {
  const currentUser = req.decoded.email;
  db.query("SELECT * FROM userinfo WHERE email = ?", [currentUser], (err, results) => {
    if (err) {
      console.error("資料庫-查詢錯誤：", err);
      res.status(500).json({ message: "資料庫查詢錯誤", code: "500" });
    } else {
      if (results.length > 0) {
        res.status(200).json({ message: "success", code: "200", results: results });
      }
    }
  });
});
//會員基本資料修改api
router.put("/profile", checkToken, (req, res) => {
  const currentId = req.decoded.user_id;
  const { name,phone, city, area, address, birthday, pet_number, gender } = req.body;
  db.query(
    "UPDATE userinfo SET name = ?, phone = ?, city = ?, area = ?, address = ?, birthday = ?, pet_number = ?, gender = ? WHERE user_id = ?",
    [name,phone, city, area, address, birthday, pet_number, gender, currentId],
    (err, results) => {
      if (err) {
        console.error("資料庫-查詢錯誤：", err);
        res.status(500).json({ message: "資料庫查詢錯誤", code: "500" });
      } else {
        res.status(200).json({ message: "success", code: "200" });
      }
    }
  );
});

// router.post("/register",  async(req, res) => {
//   const { name, email, password, confPassword } = req.body;
//   if (password !== confPassword)
//     return res.status(400).json({ msg: "密碼不一致" });
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(password, salt);
//   const checkUserQuery = "SELECT * FROM users WHERE email = ?";
//   db.query(checkUserQuery, [email], async (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "已經有這個email" });
//     }
//     if (results.length > 0) {
//       return res.status(400).json({ msg: "Email 已存在" });
//     }
//     // 如果email不存在於數據庫中，則創建新用戶記錄
//     const createUserQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
//     db.query(createUserQuery, [name, email, hashPassword], (insertError) => {
//       if (insertError) {
//         console.error(insertError);
//         return res.status(500).json({ error: "資料庫輸入有問題" });
//       }
//       res.json({ msg: "Register Success" });
//       // 關閉連接
//       db.end();
//     });
//   });
//   // try {
//   //   const results = await new Promise((resolve, reject) => {
//   //     // 使用email和password進行登入驗證
//   //     db.query('SELECT * FROM users WHERE email = ?', [email, password], (err, results) => {
//   //       if (err) {
//   //         console.error('資料庫-查詢錯誤：', err);
//   //         reject(err);
//   //         return
//   //       }
//   //       if (results.length === 0) {
//   //         reject('帳號或密碼錯誤');
//   //         return
//   //       } else {
//   //         resolve(results[0]);
//   //       }
//   //     });
//   //   });

//   //   if (results.length === 0) {
//   //     res.status(401).json({ message: '帳號或密碼錯誤', code: '401' });
//   //     return;
//   //   } else {
//   //     // 登入成功，執行你的JWT發送邏輯
//   //     const user = results;
//   //     const token = jwt.sign(
//   //       {
//   //         user_id: user.user_id, // 使用者的唯一識別符
//   //       username: user.username, // 使用者的名稱
//   //       email: user.email // 使用者的電子郵件
//   //       },
//   //       secretKey,
//   //       { expiresIn: '30m' }
//   //     );
//   //      return res.status(200).json({ message: 'success login', code: '200', token: token })
      
//   //   }
//   // } catch (err) {
//   //   console.error('捕獲到異常：', err);
//   //   return res.status(500).json({ message: '資料庫查詢錯誤', code: '500' });
//   // }
// });



// router.get('/private', authenticate, (req, res) => {
//     const user = req.user
//     return res.json({ message: 'authorized', user })
// })
// 檢查登入狀態用
// router.get('/check-login', authenticate, async (req, res) => {
//   const user = req.user
//   return res.json({ message: 'authorized', user })
// })
// router.post('/login', async (req, res) => {
//   console.log(req.body);
//   // 從要求的req.body獲取username與password
//   const { username, password } = req.body;

//   // 先查詢資料庫是否有同username/password的資料
//   const isMember = await verifyUser({
//     username,
//     password,
//   });

//   console.log(isMember);

//   if (!isMember) {
//     return res.json({ message: 'fail', code: '400' });
//   }

//   // 會員存在，將會員的資料取出
//   const member = await getUser({
//     username,
//     password,
//   });

//   console.log(member);

//   // 如果沒必要，member的password資料不應該，也不需要回應給瀏覽器
//   delete member.password;

//   // 產生存取令牌(access token)，其中包含會員資料
//   const accessToken = jsonwebtoken.sign({ ...member }, accessTokenSecret, {
//     expiresIn: '24h',
//   });

//   // 使用httpOnly cookie來讓瀏覽器端儲存access token
//   res.cookie('accessToken', accessToken, { httpOnly: true });

//   // 傳送access token回應(react可以儲存在state中使用)
//   res.json({
//     message: 'success',
//     code: '200',
//     accessToken,
//   });
// });

// router.post('/logout', authenticate, (req, res) => {
//   // 清除cookie
//   res.clearCookie('accessToken', { httpOnly: true });

//   res.json({ message: 'success', code: '200' });
// });

// router.post('/logout-ssl-proxy', authenticate, (req, res) => {
//   // 清除cookie
//   res.clearCookie('accessToken', {
//     httpOnly: true,
//     sameSite: 'none',
//     secure: true,
//   });

//   res.json({ message: 'success', code: '200' });
// });

//---------------------------------------------
// const Register = async (req, res) => {
  
//   const { userName, signupEmail, signupPassword } = req.body;
//   // if (password !== confPassword)
//   //   return res.status(400).json({ msg: "password 不一致" });

//   //  const salt = await bcrypt.genSalt(10);
//   //  const hashPassword = await bcrypt.hash(password, salt);
  
//   const connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "admin",
//     password: "12345",
//     database: "cat",
//   });

//   // 檢查數據庫中是否存在具有相同email的用戶
//   const checkUserQuery = "SELECT * FROM userinfo WHERE email = ?";
//   connection.query(checkUserQuery, [email], async (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ error: "資料庫錯誤" });
//     }

//     if (results.length > 0) {
//       return res.status(400).json({ msg: "Email 已存在" });
//     }

//     // 如果email不存在於數據庫中，則創建新用戶記錄
//     const createUserSql = `INSERT INTO users (name, email, password) VALUES ('${userName}', '${signupEmail}', '${signupPassword}')`;
//     connection.query(createUserSql ,  (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ error: "註冊失敗資料庫輸入有問題" });
//       }else{
//         console.log(result);
//       res.status(200).send('註冊成功');
//       }
  
//       // 關閉連接
//       connection.end();
//       res.json({ msg: "Register Success" });
//     });
//   });
// };
const Register = async (req, res) => {
  const { userName, signupEmail, signupPassword } = req.body;

  // 檢查數據庫中是否存在具有相同 email 的用戶
  const checkUserQuery = "SELECT * FROM userinfo WHERE email = ?";
  db.query(checkUserQuery, [signupEmail], async (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "資料庫錯誤" });
    }

    if (results.length > 0) {
      return res.status(400).json({ msg: "Email 已存在" });
    }

    // 如果 email 不存在於數據庫中，創建新用戶記錄
    const createUserSql = "INSERT INTO userinfo (name, email, password) VALUES (?, ?, ?)";
    db.query(createUserSql, [userName, signupEmail, signupPassword], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "註冊失敗，資料庫輸入有問題" });
      }
      //獲得最新新增的使用者id
      //const userId = result.insertId;

      //新增使用者優惠券
      //const addUserCoupon = " INSERT INTO users_coupon (user_id,coupon_id, valid) VALUES (?,30, 1)"
      // db.query(addUserCoupon, [userId], (error, result) =>{
      //   if(error){
      //     console.log(error);
      //     return res.status(500).json({error: '增加優惠券失敗，資料庫輸入有問題'})
      //   }
      // })

      console.log(result);
      res.status(200).json({ msg: "註冊成功" });
    });
    
  });
};


router.post("/register", Register);

function checkToken(req,res,next){
const token = req.headers.authorization;
if(token){
  jwt.verify(token,secretKey,(err,decoded)=>{
    if(err){
      res.status(400).json({message: '登入驗證失效', code: '400'})
      return;
    }
    //成功驗證
    req.decoded = decoded;
    next();
   
  })
}else{
  res.status(400).json({message: 'fail logout 無登入資料', code: '400'})
}
}

 module.exports = router;