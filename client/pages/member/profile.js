import React, { useState, useEffect, useContext } from "react";
import {NameContext} from "@/context/nameContext";
import Link from "next/link";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import useRWD from "@/hooks/useRWD";
import TWZipCode from "@/components/user/TWZipCode";
 import ProtectedRoute from "@/components/protectedRoute";
// import { useAuth } from "@/context/fakeAuthContext";


import jwt_decode from "jwt-decode";

const ProfilePage = () => {
  //context
  const {contextName, setContextName} = useContext(NameContext);

  //RWD
  const device = useRWD();
  const userRfs = device == "mobile" ? "m-size-6" : "size-6";

 
  //取得資料

  //const [userData, setUserData] = useState({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressTown, setAddressTown] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [countryIndex, setCountryIndex] = useState(-1);
  const [townshipIndex, setTownshipIndex] = useState(-1);
  const [postcode, setPostcode] = useState("");
  const [petCount, setPetCount] = useState(1);

  const [address, setAddress] = useState({
     country: '',
     township: '',
    postcode: '',
  });

  //設置id狀態
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodeToken = jwt_decode(token);
        const currentUserId = decodeToken.id;
        //console.log(userId);

        //更新userId狀態
        setUserId(currentUserId);
      } catch (error) {
        console.error("token解析錯誤", error);
      }
    }
    const apiURL = `http://localhost:3005/api/user/user-profile/${userId}`;
    fetch(apiURL)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        //console.log(data.results[0]);
        //把結果放進user
        const user = data.results[0];
        setContextName(user.name)
        setEmail(user.email);
        setName(user.name);
        setGender(user.gender);
        //birthday資料成為可用數字
        setBirthday(new Date(user.birthday).toISOString().split("T")[0]);
        //console.log(birthday)
        setPhone(user.phone);
        //console.log(phone);
        // setAddressCity(user.city);
        // setAddressTown(user.area);
        setDetailAddress(user.address);
        //console.log(detailAddress);
        setPetCount(user.pet_number);
        setAddress({
          country: user.city,
          township: user.area,
          postcode: user.postcode,
        })
        //console.log(address)
      })
      .catch((error) => console.error("api請求錯誤", error));
  }, [userId]);

  const handleSave = (event) => {
    event.preventDefault();

    // 驗證姓名不為空
    if (!name.trim()) {
      alert("請輸入姓名");
      return;
    }
    // 驗證生日不為空
    if (!birthday) {
      alert("請輸入生日");
      return;
    }
    // 驗證手機格式
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      alert("請輸入正確的手機號碼格式");
      return;
    }
    //驗證地址不為空
    if (!detailAddress) {
      alert("請輸入完整的地址");
      return;
    }
    const updatedUserData = {
      email,
      name,
      gender,
      birthday,
      phone,
      // city: addressCity,
      // area: addressTown,
    
      city: address.country,
      area: address.township,
      postcode: address.postcode,

      address: detailAddress,
      pet_number: petCount,
    };

    fetch(`http://localhost:3005/api/user/user-profile-change/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => res.json()) .then((data) => {
       
        console.log(data);
        
       //setName(data.results[0].name)
        //setContextName( data.results[0].name)
        // setContextName(name)
       alert("會員資料修改完成");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <ProtectedRoute>
    <div className=" my-3">
       <ListUserM />
      <div className="d-flex justify-content-around pt-2">
        <ListD />
        <div className="user-profile d-flex flex-column col-md-8 col-12  ">
   
          <div className="title my-1">
            <p className=" size-4">
            <span className="my">▍</span> 個人資料
            </p>
          </div>

          <div className="user-form ">
          
            <div className="user-form-item">
              <div className="ws20 mb-5 d-flex justify-content-center">
                <label className={`fs3 ${userRfs}`}>Email</label>
                <input
                  className="form-input fs11"
                  type="text"
                  value={email}
                  disabled="true"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="ws20 mb-5 d-flex justify-content-center">
              <label className={`fs3 ${userRfs}`}>姓名</label>
              <input
                className="form-input fs11"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="ws20  mb-5 d-flex justify-content-center">
              <label className={`fs3 ${userRfs}`}>密碼</label>
              <div className="fs11 ">
                <Link href="http://localhost:3000/member/reset-password">
                  <button className="btn-confirm fs-btn">設定新密碼</button>
                </Link>
              </div>
            </div>

            <div className="ws20 gender mb-5 d-flex justify-content-center gender-radio">
              <label className={`fs3 ${userRfs}`}>性別</label>
              <div className="fs11 d-flex align-items-center">
                <div className="radio-box">
                  <label >
                    <input
                      type="radio"
                      name="label"
                      id="male"
                      className={userRfs}
                      value="gender"
                      checked={gender === "男"}
                      onChange={() => setGender("男")}
                      aria-label="..."
                    />
                    <span className="gender-btn round" >男</span>
                  </label>
                </div>
                <div className="radio-box">
                <label >
                  <input
                    type="radio"
                    name="label"
                    id="female"
                    className={userRfs}
                    value="gender"
                    checked={gender === "女"}
                    onChange={() => setGender("女")}
                    aria-label="..."
                  />
                  <span  className="gender-btn round">女</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="ws20  mb-5 d-flex justify-content-center">
              <label className={`fs3 ${userRfs}`}>生日</label>
              <input
                className="form-input fs11"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className="ws20  mb-5 d-flex justify-content-center">
              <label className={`fs3 ${userRfs}`}>手機</label>
              <input
                className="form-input fs11"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

          
            <div className="ws20   d-flex justify-content-center">
              <label className={`fs3 py-2 ${userRfs}`}>地址</label>
              <TWZipCode
              initPostcode={address.postcode}
              onPostcodeChange={(country, township, postcode) => {
                setAddress({
                  country,
                  township,
                  postcode,
                });
              }}
            />
            </div>
            <div className="d-flex justify-content-center">
              <div className="address-w20 ">
                {/* <label className={` ${userRfs}`}></label> */}
                <input
                  type="text"
                  className="form-control address-11"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="ws20   d-flex justify-content-center">
              <label className={`fs3 ${userRfs}`}>毛孩數量</label>
              <div className="fs11 ">
                <input
                  className="form-input fs5"
                  type="number"
                  value={petCount}
                  onChange={(e) => setPetCount(e.target.value)}
                />
              </div>
            </div>

            <div className="user-btn-group d-flex justify-content-center gap-5">
              <button id="save" className="btn-confirm" onClick={handleSave}>
                儲存
              </button>
              {/* <button className="btn-outline-confirm" onClick={handleCancel}>
                取消
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
