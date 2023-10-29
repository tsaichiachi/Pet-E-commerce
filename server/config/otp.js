const dotenv = require('dotenv');
dotenv.config();
const OTPAuth = require('otpauth');
const otpSecret = process.env.OTP_SECRET;

let totp = null;

//產生token
const generateToken = (email = '')=>{
     // 建立新的 TOTP 物件
  // 註: issuer和label是當需要整合Google Authenticator使用的
    totp = new OTPAuth.TOTP({
        issuer: 'express-base',
        label: email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromLatin1(email + otpSecret)
    })
    return totp.generate();
    //函數返回由 TOTP 生成的 OTP 令牌
}

// Validate a token (returns the token delta or null if it is not found in the search window, in which case it should be considered invalid).
// 驗証totp在step window期間產生的token一致用的(預設30s)
//定義 verifyToken 函數，它接受一個令牌（token）作為參數。
const verifyToken = (token)=>{
    //使用 totp 物件的 validate 方法來驗證令牌
    //如果令牌在驗證窗口內有效，則 validate 方法將返回一個非空的 delta 值，否則返回 null
    const delta = totp.validate({token, window:1});
    return delta === null ? false : true;
}

module.exports ={generateToken, verifyToken}