import React, { useState, useEffect } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import Image from "next/image";
import useRWD from "@/hooks/useRWD";
import jwt_decode from "jwt-decode";
import showPwdImg from "@/assets/showPwd.svg";
import hidePwdImg from "@/assets/hidePwd.svg";
import Link from "next/link";

const ResetUserPassword = () => {
  //eye icon
  const [viewPwd, SetViewPwd] = useState(false);
  const [viewPwdConf, SetViewPwdConf] = useState(false);

  //RWD
  const device = useRWD();
  const userRfs = device == "mobile" ? "m-size-6" : "size-6";

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordCheck, setNewPasswordCheck] = useState("");

  //設置id狀態 解token
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const u = localStorage.getItem("id");
    setUserId(u);
    //const token = localStorage.getItem("token");
    // if(token){
    //   try{
    //     const decodeToken = jwt_decode(token);
    //     const currentUserId =decodeToken.id;
    //     console.log(userId)

    //     //更新userId狀態
    //     setUserId(currentUserId)
    //   }catch(error){
    //     console.error("token解析錯誤",error)
    //   }
    // }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordCheck) {
      alert("新密碼與確認密碼不相符");
      return;
    } else {
      alert("密碼修改成功");
    }
    try {
      const response = await fetch(
        `http://localhost:3005/api/user/change-password/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
            newPassword,
          }),
        }
      );
      const data = await response.json();
      //alert(data.message);
      setPassword("");
      setNewPassword("");
      setNewPasswordCheck("");
    } catch (error) {
      console.error(error);
      //alert("修改密碼失敗");
    }
  };

  const handleCancel = () => {
    setPassword("");
    setNewPassword("");
    setNewPasswordCheck("");
  };

  return (
    <div className="my-3">
     <ListUserM />
      <div className="d-flex justify-content-around pt-2">
        
        <ListD />
        <div className="reset-password  d-flex flex-column col-md-8 col-12 ">
          <div className="title my-1">
            <p className=" size-4">
            <span className="my">▍</span>
              重新設定密碼
            </p>
          </div>

          <div className="reset-form d-flex justify-content-center ">
            <div className="reset-form-width">
              <div className="reset-group"   style={{position: 'relative'}}>
                <label htmlFor="" className={userRfs}>
                  原密碼
                </label>
                <input
                  className="form-input  "
                  type={viewPwd ? 'text':'password'}
                  placeholder="請輸入密碼"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Image
                  className="eye"
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "15px",
                    top: "5px",
                  }}
                  title={viewPwd ? "Hide password" : "Show password"}
                  src={!viewPwd ? hidePwdImg : showPwdImg}
                  onClick={() => SetViewPwd((prevState) => !prevState)}
                  alt="show/hide password"
                />
              </div>
              <div className="reset-group" style={{position: 'relative'}}>
                <label htmlFor="" className={userRfs}>
                  新密碼
                </label>
                <input
                  className="form-input "
                  type={viewPwdConf ? 'text':'password'}
                  placeholder="請輸入新密碼"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                      <Image
            className="eye"
          style={{ cursor: 'pointer',position: 'absolute',right: '15px',top: '5px'}}
              title={viewPwdConf ? 'Hide passwordConf' : 'Show passwordConf'}
              src={!viewPwdConf ? hidePwdImg : showPwdImg}
              onClick={()=> SetViewPwdConf(prevStateConf => !prevStateConf)}
              alt="show/hide password"
            />
              </div>
              <div className="reset-group"  >
                <label htmlFor="" className={userRfs}>
                  確認新密碼
                </label>
                <input
                  className="form-input "
                  type="password"
                  placeholder="請再輸入一次密碼"
                  value={newPasswordCheck}
                  onChange={(e) => setNewPasswordCheck(e.target.value)}
                />
           
              </div>
              <div className="d-flex justify-content-center gap-5 mt-5">
              <Link href="http://localhost:3000/member/profile">
                <button className="btn-outline-confirm" >
                  取消
                </button>
                </Link>
                <button className="btn-confirm" onClick={handleSubmit}>
                  儲存
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetUserPassword;
