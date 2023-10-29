const express = require("express");
const cors = require("cors");
const router = express.Router();
const connection = require("../db");
const dotenv = require("dotenv");
dotenv.config();

const multer = require("multer");
const upload = multer();
const transporter = require("../config/mail.js");
const { generateToken, verifyToken } = require("../config/otp.js");

const exp = 30; // 定義 exp 為 30 分鐘

const mailText = (otpToken) => `親愛的網站會員 您好，
通知重設密碼所需要的驗証碼，
請輸入以下的6位數字，重設密碼頁面的"電子郵件驗証碼"欄位中。
請注意驗証碼將於寄送後30分鐘後到期，如有任何問題請洽網站客服人員:

${otpToken}

小貓兩三隻團隊 敬上`;

// 檢查 email 是否存在
const checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const checkUserQuery = "SELECT * FROM userinfo WHERE email = ?";
    connection.query(checkUserQuery, [email], (error, results) => {
      if (error) {
        console.error(error);
        reject("內部伺服器錯誤");
      } else if (results.length === 0) {
        reject("fail Email");
      } else {
        //resolve(results[0]);
        const user_id = results[0].user_id;
        resolve(user_id);
      }
    });
  });
};

// 檢查是否已經產生過 OTP
const checkOtp = (email) => {
  return new Promise((resolve, reject) => {
    const checkOtpQuery = "SELECT * FROM otp WHERE email = ?";
    connection.query(checkOtpQuery, [email], (error, results) => {
      if (error) {
        console.error(error);
        reject("內部伺服器錯誤");
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};
// 檢查是否已經產生過 OTP
const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    const checkOtpQuery = "SELECT * FROM otp WHERE token = ?";
    connection.query(checkOtpQuery, [token], (error, results) => {
      if (error) {
        console.error(error);
        reject("內部伺服器錯誤");
      } else {
        resolve(results.length > 0 ? results[0] : null);
      }
    });
  });
};

// 產生新的 OTP
const generateOtp = async (email) => {
  try {
    const user_id = await checkEmail(email); // 先取得user_id
    const token = generateToken(email);
    const exp_timestamp = +new Date() + exp * 60 * 1000;
    const otpTable = {
      user_id, // 将user_id存入otpTable
      email,
      token,
      exp_timestamp,
    };
    const insertOtpQuery = "INSERT INTO otp SET ?";

    const results = await new Promise((resolve, reject) => {
      connection.query(insertOtpQuery, [otpTable], (error, results) => {
        if (error) {
          console.error(error);
          reject("內部伺服器錯誤");
        } else {
          resolve(results);
        }
      });
    });

    return { id: results.insertId, ...otpTable };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updatePassword =(email, password)=>{
 const updatePasswordQuery = "UPDATE userinfo SET password = ? WHERE email = ?";
 return new Promise((resolve, reject) =>{
    connection.query(updatePasswordQuery, [password, email], (error, results) =>{
        if(error){
            console.error(error);
            reject("內部伺服器錯誤");
        }else{
            resolve(results);
        }
    })
 })
}

// 刪除 OTP 記錄
const deleteOtp = (id) => {
  const deleteOtpQuery = "DELETE FROM otp WHERE id = ?";
  return new Promise((resolve, reject) => {
    connection.query(deleteOtpQuery, [id], (error, results) => {
      if (error) {
        console.error(error);
        reject("內部伺服器錯誤");
      } else {
        resolve();
      }
    });
  });
};

// 發送電子郵件
const sendEmail = (email, otpToken) => {
  const mailOptions = {
    from: `"Irene Smith" <${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: "重設密碼的電子郵件驗証碼",
    text: mailText(otpToken),
  };
  return new Promise((resolve, reject) => {
    transporter.transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        reject("電子郵件發送失敗");
      } else {
        resolve("電子郵件發送成功");
      }
    });
  });
};

// 產生新的 OTP 並發送電子郵件
router.post("/otp", upload.none(), async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      throw "fail email";
    }
    const userData = await checkEmail(email);
    console.log(userData); //顯示user_id

    const foundOtp = await checkOtp(email);
    console.log(foundOtp);

    if (
      foundOtp &&
      +new Date() - (foundOtp.exp_timestamp - exp * 60 * 1000) < 60 * 1000
    ) {
      throw "60秒內不可重複產生otp";
      console.log(foundOtp, 123);
    } else if (foundOtp === null) {
      return res.json({ message: "error null", code: "400" });
      // const newOtp = await generateOtp(email);
      // await sendEmail(email, newOtp.token);
      // res.json({ message: 'email sent', code: '200' });
      // return;
    } else {
      const newOtp = await generateOtp(email);
      await sendEmail(email, newOtp.token);
      res.json({ message: "email sent", code: "200" });
      return;
    }
    // const newOtp = await generateOtp(email);
    // await sendEmail(email, newOtp.token);
    // res.json({ message: 'email sent', code: '200' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error });
  }
});

// 驗證 OTP 並更新密碼
router.post("/reset", async (req, res) => {
  const { email, token, password } = req.body;
  try {
    if (!token) {
      throw "fail";
    }
    //尋找合法的(未過期的)otp記錄
    const otp = await checkToken(token);
    //const userId = opt.user_id;
    if (otp.exp_timestamp > new Date()) {
        const update = await updatePassword(email, password);
        //console.log(update);
        const otpId =otp.id;

       await deleteOtp(otpId);
       return res.json({ message: "Password updated successfully", code: "200" });
        // const updatePasswordQuery =
        // "UPDATE userinfo SET password = ? WHERE user_id = ?";
        // const [updateResult] = await connection.query(updatePasswordQuery, [
        //     password,
        //     userId,
        //   ]);
        //   if(updateResult.affectedRows === 1){
        //     await deleteOtp(otp.id);
        // res.json({ message: "Password updated successfully", code: "200" });
        //   }
//throw "in there 123";
    }else{
        //過期
        throw "Invalid OTP";
    } 
        //throw "in there";
        //console.log(1234)
    //   const updatePasswordQuery =
    //     "UPDATE userinfo SET password = ? WHERE user_id = ?";
    //   const [updateResult] = await connection.query(updatePasswordQuery, [
    //     password,
    //     userId,
    //   ]);

    //   if (updateResult.affectedRows === 1) {
    //     await deleteOtp(otp.id);
    //     res.json({ message: "Password updated successfully", code: "200" });
    //   } else {
    //     throw "Internal Server Error";
    //   }
    
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'error' });
  }
});

module.exports = router;
