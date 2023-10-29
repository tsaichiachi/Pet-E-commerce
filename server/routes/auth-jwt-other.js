const express = require("express");
const router = require("express").Router();
const multer = require('multer');
const jsonwebtoken = require("jsonwebtoken");


const cors = require('cors');
const upload = multer();
const db = require("../db");
//middleware

const accessTokenSecret = "thisistokensecretkey";

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

//  router.get("/private",  authenticate,(req,res)=>{
//     const user = req.user;
//     return res.json({message:"authorized",user});
//  } )

router.get("/check-login",  authenticate,async(req,res)=>{
   const user = req.user;
   return res.json({message:"authorized",user});
} )
// router.get('/private', authenticate, (req, res) => {
//     const user = req.user;
//     return res.json({ message: 'authorized', user });
//   });
router.get("/check-login", authenticate, async (req, res) => {
   const user = req.user;
   return res.json({ message: 'authorized', user });
 
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
       const accessToken = jsonwebtoken.sign(
         {
         email: user.email, // 使用者的名稱
         password: user.password,// 使用者的電子郵件
      
         },
         accessTokenSecret,
         { expiresIn: '1d' }
       );
       res.cookie('accessToken', accessToken, { httpOnly: true });
        return res.status(200).json({ message: 'success login', code: '200', accessToken })
       
     }
   } catch (err) {
     console.error('捕獲到異常：', err);
     return res.status(500).json({ message: '資料庫查詢錯誤', code: '500' });
   }
 });

router.post("/logout",authenticate,(req,res)=>{
   res.clearCookie('accessToken', { httpOnly: true });
   res.json({ message: 'success', code: '200' });
})

// router.post('/logout-ssl-proxy', authenticate, (req, res) => {
//     res.clearCookie('accessToken', {
//       httpOnly: true,
//       sameSite: 'none',
//       secure: true,
//     });  
//     res.json({ message: 'success', code: '200' });
//   });

 function authenticate(req,res,next){
   const token = req.cookies.accessToken;
   console.log(token);

   if(!token){
       return res.json({ message: 'Forbidden-沒token', code: '403' });
   }
   if(token){
       jsonwebtoken.verify(token, accessTokenSecret, (err, user) => {
           if (err) {
             return res.json({ message: 'Forbidden', code: '403' });
           }
     
           // 將user資料加到req中
           req.user = user;
           next();
         });
   }else{
       return res.json({ message: 'Unauthorized', code: '401' });
   }
}

module.exports = router;

