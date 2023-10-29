const nodeMailer = require('nodemailer');
//const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

let transport = null;

transport ={
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        user:process.env.SMTP_TO_EMAIL,
        pass:process.env.SMTP_TO_PASSWORD,
    },
}

//呼叫transport函式
const transporter = nodeMailer.createTransport(transport);

//驗證連線設定
transporter.verify((error, success)=>{
    if(error){
        //錯誤
        console.error(error);
    }else{
        //成功
        console.log('SMTP Server Connected. Ready to send mail.')
    }
})

exports.transporter = transporter;