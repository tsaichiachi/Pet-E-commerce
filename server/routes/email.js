
const dotenv = require('dotenv');
dotenv.config();
const router = require("express").Router();


const transporter = require('../config/mail.js');



router.get('/send', function(req, res, next) {
    const mailOptions = {
        from: `"Irene Smith" <${process.env.SMTP_TO_EMAIL}>`,
        to: `bagelscom@gmail.com`,
        subject: '測試信件',
        text: `您好，\r\n這是一封測試信件。 \r\n\r\n小貓兩三隻團隊\r\n\r\n敬上`,
    }

    //寄送
    transporter.transporter.sendMail(mailOptions, (err, response) =>{
        if(err){
            return res.status(400).json({message: '寄送失敗', detail: err});
        }else{
            return res.json({message: '寄送成功'});
        }
    })

});
module.exports = router;
