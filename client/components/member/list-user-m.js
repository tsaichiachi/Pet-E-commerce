import { React, useState, useEffect } from "react";
import Link from "next/link";
import { useActivePage } from "@/hooks/useActivePage";
import { HiClipboardList } from "react-icons/hi";
import { LiaListAltSolid } from "react-icons/lia";
import { FaPencilAlt } from "react-icons/fa";
import { BiSolidShoppingBag } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";
import { FaList } from "react-icons/fa";
import { RiFileList3Fill } from "react-icons/ri";
import { FaChartLine } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useRouter } from "next/router";
import Membership from "@/components/user/membership";
import jwt_decode from "jwt-decode";

export default function ListUserM() {
  const [memberData, setMemberData] = useState(null);
  const { activeButton, setActiveButton } = useActivePage();
  const router = useRouter();

  //設置id狀態 解token
  const [userId, setUserId] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [currentName, setCurrentName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodeToken = jwt_decode(token);
        const currentUserId = decodeToken.id;
        const currentAvatar = decodeToken.avatar;
        const currentName = decodeToken.name;

        //更新狀態
        setUserId(currentUserId);
        setCurrentAvatar(currentAvatar);
        setCurrentName(currentName);
      } catch (error) {
        console.error("token解析錯誤", error);
      }
    }
  }, [userId]);

  return (
    <>
      <div className="listuserm d-md-none d-block">
        <div className="useravatar">
          <div className="d-flex justify-content-center">
            <div>
              <div className="text-center">
                <img src={currentAvatar} className="mt-5"></img>
              </div>
              <p className="size-5 my-3 text-center">Hi,{currentName}</p>
              <Link className="size-7" href="">
                <span className="me-2">管理個人資料</span>
                <FaPencilAlt />
              </Link>
            </div>
          </div>
          <div className="d-flex justify-content-center bg border mx-4 mt-3 align-items-center">
            <div className="my-3 lv">
              <p className="size-7 level text-center px-2">Level.1 幼貓</p>
            </div>
            <div>
              <div>
                {/* <Link className="size-7 mt-3 ms-3" href="">
                  查看會員等級優惠
                </Link> */}
                <Membership />
              </div>
              <div>
                <Link
                  className="size-7 mt-3 ms-3"
                  href="http://localhost:3000/member/coupon"
                >
                  查看我的優惠券
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div>
            <button
              className={`size-6 ${activeButton === 1 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(1);
                router.push("/member/order");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <RiFileList3Fill />
                </div>
                <div>
                  <p>我的訂單</p>
                </div>
              </div>
            </button>
            <button
              className={`size-6 ${activeButton === 2 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(2);
                router.push("/member/purchast");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <BiSolidShoppingBag />
                </div>
                <div>
                  <p>購買紀錄</p>
                </div>
              </div>
            </button>
            <button
              className={`size-6 ${activeButton === 3 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(3);
                router.push("/member/wishlist");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <FaList />
                </div>
                <div>
                  <p>追蹤清單</p>
                </div>
              </div>
            </button>

            <button
              className={`size-6 ${activeButton === 6 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(6);
                router.push("/member/joblist");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <LiaListAltSolid />
                </div>
                <div>
                  <p>任務清單</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div>
            <button
              className={`size-6 ${activeButton === 5 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(5);
                router.push("/member/helper");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <FaIdBadge />
                </div>
                <div>
                  <p>幫手資料</p>
                </div>
              </div>
            </button>

            <button
              className={`size-6 ${activeButton === 8 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(8);
                router.push("/member/selling");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <FaChartLine />
                </div>
                <div>
                  <p>幫手訂單</p>
                </div>
              </div>
            </button>

            <button
              className={`size-6 ${activeButton === 7 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(7);
                router.push("/member/history");
              }}
            >
              <div className="mx-1 my-3">
                <div>
                  <HiClipboardList />
                </div>
                <div>
                  <p>刊登紀錄</p>
                </div>
              </div>
            </button>

            <button
              className={`size-6 ${activeButton === 9 ? "active" : ""}`}
              onClick={() => {
                setActiveButton(9);
                router.push("/member/reserve");
              }}
            >
              <div className="mx-1 mt-3 pb-3">
                <div>
                  <FaRegCalendarCheck />
                </div>
                <div>
                  <p>預約紀錄</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}