import React from "react";

import Image from "next/image";
import myProfile from "@/assets/myProfile.svg";

export default function ResetPassword() {
  return (
    <>
      <div className="reset-password">
        <div className="title">
          <p className=" size-4">
            <Image src={myProfile} alt="myProfile-logo" />
            重新設定密碼
          </p>
        </div>

      <form>
        <div className="reset-group">
          <label htmlFor="">原密碼:</label>
          <input
            className="form-input "
            type="password"
            placeholder="請輸入密碼"
          />
        </div>
        <div className="reset-group">
          <label htmlFor="">新密碼:</label>
          <input
            className="form-input "
            type="password"
            placeholder="請輸入新密碼"
          />
        </div>
        <div className="reset-group">
          <label htmlFor="">再輸入一次密碼:</label>
          <input
            className="form-input "
            type="password"
            placeholder="請再輸入一次密碼"
          />
        </div>
        <div className="d-flex justify-content-center gap-4 mt-5">
          <button className="btn-outline-confirm">取消</button>
          <button className="btn-confirm">儲存</button>
        </div>
        </form>
      </div>
    </>
  );
}
