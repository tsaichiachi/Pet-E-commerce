import React, { useEffect, useState } from "react";
import axios from "axios";
import useInterval from "@/hooks/use-interval";
import Image from "next/image";
import showPwdImg from "@/assets/showPwd.svg";
import hidePwdImg from "@/assets/hidePwd.svg";

export default function ForgetPassword() {
  const [viewPwd,SetViewPwd]=useState(false)

  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [count, setCount] = useState(10);
  const [delay, setDelay] = useState(null);

  useInterval(() => {
    setCount(count - 1);
  }, delay);

  useEffect(() => {
    if (count <= 0) {
      setDelay(null);
    }
  }, [count]);

  const getOtp = async () => {
    if (delay !== null) {
      setMessage("60s內無法重新獲得驗証碼");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3005/api/reset-password/otp",
        {
          email,
        }
      );

      //console.log(res.data)
      if (res.data.message === "fail") {
        setMessage("驗証碼取得失敗，請確認Email是否已經註冊");
      }

      if (res.data.message === "email sent") {
        setMessage("驗証碼已寄送到你填寫的Email信箱中");
        setCount(60); // reset countdown
        setDelay(1000); // 1000ms = 1s
      }
    } catch (error) {
      console.error(error);
      setMessage("取得驗證碼時發生錯誤");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3005/api/reset-password/reset",
        {
          email,
          token,
          password,
        }
      );

      if (res.data.message === "Password updated successfully") {
        setMessage("密碼已成功修改!");
      } else if (res.data.message === "Internal Server Error") {
        setMessage("密碼修改失敗，內部伺服器錯誤!");
      } else {
        setMessage("密碼修改失敗，未知錯誤!");
      }
      //console.log(res.data)
    } catch (error) {
      console.error(error);
      setMessage("密碼修改時發生錯誤");
    }
  };

  return (
    <>
      <div className="boxing-padding">
        <div className="forgotPwd-box d-flex align-items-center flex-column justify-content-center mx-auto ">
          <div className="login-header d-flex ">
            <div className="size-4 mx-3  title">忘記密碼</div>
          </div>
          <hr className="hr-divider" />
          <div className="forgotPassword-form ">
            <h5 style={{ color: "#ff6600" }} className="my-4 forgetPassword-msg">{message}</h5>

            <div className="w20 d-flex align-items-center justify-content-center my-2">
              <label className="f3 input-font-size">信箱</label>
              <input
                className="form-input f16"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="w20 d-flex align-items-center justify-content-center my-2">
              <label className="f3 input-font-size">驗證碼</label>
              <input
                className="form-input f8"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
               <button className="btn-confirm f8" onClick={getOtp}>
                {delay ? count + "秒後再次取得驗證碼" : "取得驗證碼"}
              </button>
            </div>

            <div className="w20 d-flex align-items-center justify-content-center mt-2 mb-4"
            style={{position: 'relative'}}
            >
              <label className="f3 input-font-size">
                新密碼
                </label>
                <input
                 className="form-input f16"
                 type={viewPwd ? 'text':'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
            className="eye"
          style={{ cursor: 'pointer',position: 'absolute',right: '35px',top: '5px'}}
              title={viewPwd ? 'Hide password' : 'Show password'}
              src={!viewPwd ? hidePwdImg : showPwdImg}
              onClick={()=> SetViewPwd(prevState => !prevState)}
              alt="show/hide password"
            />
            
            </div>
            
            <div className="w20 py-3 mt-3">
              <button className="btn-confirm f20" onClick={resetPassword}>
                重新設定密碼
              </button>
            </div>
          </div>

          {/* <hr className="hr-divider" /> */}
        </div>
      </div>
    </>
  );
}
