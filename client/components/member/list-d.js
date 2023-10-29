import React, { useState, useEffect, useContext } from "react";
import { useName } from "@/context/nameContext";
import { HiClipboardList } from "react-icons/hi";
import { LiaListAltSolid } from "react-icons/lia";
import { FaPencilAlt } from "react-icons/fa";
import { BiSolidShoppingBag } from "react-icons/bi";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdHomeRepairService } from "react-icons/md";
import { MdDiscount } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import Link from "next/link";
import { useActivePage } from "@/hooks/useActivePage";
import { useRouter } from "next/router";
import Membership from "@/components/user/membership";
import jwt_decode from "jwt-decode";

export default function ListD() {
  //context
  const { contextName, setContextName } = useName();

  const { activeButton, setActiveButton } = useActivePage();
  console.log(activeButton);
  const router = useRouter();
  //設置id狀態 解token
  const [userId, setUserId] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  //const [currentName, setCurrentName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodeToken = jwt_decode(token);
        const currentUserId = decodeToken.id;
        const currentAvatar = decodeToken.avatar;
        //const currentName = decodeToken.name;
        //console.log(userId);

        //更新userId狀態
        setUserId(currentUserId);
        setCurrentAvatar(currentAvatar);
        //setCurrentName(currentName);
      } catch (error) {
        console.error("token解析錯誤", error);
      }
    }
  }, [userId]);

  return (
    <>
      <div className="list-d col-3 d-md-block d-none">
        <div className="user">
          <div className="useravatar">
            <div className="d-flex justify-content-center">
              <div>
                <div className="text-center">
                  <img
                    //src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_A1VK080502.jpg"
                    //src={memberData ? memberData.cover_photo : "loading..."}
                    src={currentAvatar}
                    className="mt-5"
                  ></img>
                </div>
                <p className="size-5 my-3 text-center title">
                  Hi,{contextName}
                </p>
                <Link className="size-7" href="/member/profile">
                  <span className="me-2">管理個人資料</span>
                  <FaPencilAlt />
                </Link>
              </div>
            </div>
            <div className="d-flex justify-content-center bg border mx-4 mt-3 py-3 align-items-center">
              <div className="lv">
                <p className="size-7 level text-center px-2">Level.1 幼貓</p>
              </div>
              {/* <button className="size-7 ms-3" >
                查看會員等級優惠
              </button> */}
              <Membership />
            </div>
          </div>
          <ul className="mt-2 text-center">
            <li>
              <div className="py-2">
                <p className="size-5 title">小 貓 商 城</p>
              </div>
            </li>
            <li className="">
              <button
                className={`size-6 col-12  ${
                  activeButton === 1 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(1);
                  router.push("/member/order");
                }}
              >
                <div className="my-3">
                  <RiFileList3Fill />
                  <span className="ms-2">我的訂單</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 2 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(2);
                  router.push("/member/purchast");
                }}
              >
                <div className="my-3">
                  <BiSolidShoppingBag />
                  <span className="ms-2">購買紀錄</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 3 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(3);
                  router.push("/member/wishlist");
                }}
              >
                <div className="my-3">
                  <FaList />
                  <span className="ms-2">追蹤清單</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 4 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(4);
                  router.push("/member/coupon");
                }}
              >
                <div className="my-3">
                  <MdDiscount />
                  <span className="ms-2">優惠票券</span>
                </div>
              </button>
            </li>
            <li>
              <div className="p-2">
                <p className="size-5 title">小 貓 上 工</p>
              </div>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 5 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(5);
                  router.push("/member/helper");
                }}
              >
                <div className="my-3">
                  <FaIdBadge />
                  <span className="ms-2">幫手資料</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 8 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(8);

                  router.push("/member/selling");
                }}
              >
                <div className="my-3">
                  <FaChartLine />
                  <span className="ms-2">幫手訂單</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 6 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(6);
                  router.push("/member/joblist");
                }}
              >
                <div className="my-3">
                  <LiaListAltSolid />
                  <span className="ms-2">任務清單</span>
                </div>
              </button>
            </li>
            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 7 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(7);
                  router.push("/member/history");
                }}
              >
                <div className="my-3">
                  <HiClipboardList />
                  <span className="ms-2">刊登紀錄</span>
                </div>
              </button>
            </li>

            <li>
              <button
                className={`size-6 col-12 ${
                  activeButton === 9 ? "active" : ""
                }`}
                onClick={() => {
                  setActiveButton(9);

                  router.push("/member/reserve");
                }}
              >
                <div className="mt-3 pb-3">
                  <FaRegCalendarCheck />
                  <span className="ms-2">預約紀錄</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
