import React from "react";
// import ListM from "@/components/member/list-m";
// import ListD from "@/components/member/list-d";
// import ListUserM from "@/components/member/list-user-m";
import { RiFileList3Fill } from "react-icons/ri";

export default function Order() {
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-end">{/* <ListM /> */}</div>
        {/* <ListUserM /> */}
        <div className="d-flex justify-content-between py-2">
          {/* <ListD /> */}
          <div className=" col-12 col-sm-8 order p-3">
            <div>
              <h5 className="size-5">
                <RiFileList3Fill />
                我的訂單
              </h5>
              <nav className="">
                <a className="mx-3 size-7">待出貨</a>
                <a className="mx-3 size-7">運送中</a>
                <a className="mx-3 size-7">已完成</a>
                <a className="mx-3 size-7">已取消</a>
              </nav>

              <p className="date my-3 size-7">2023-08-26 訂單編號 : 134868</p>
              <div className="d-flex justify-content-between border-bottom">
                <div>
                  <p className="size-7">狀態 : 尚未付款</p>
                  <p className="size-7">付款方式 : 貨到付款</p>
                  <p className="size-7">寄送方式 : 宅配</p>
                  <img
                    src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_A1MKD200101(1).jpg"
                    className="d-sm-none d-block"
                  ></img>
                  <p className="size-6 price">訂單金額 : NT$380</p>
                </div>
                <div className="d-flex align-self-end">
                  <img
                    src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_A1MKD200101(1).jpg"
                    className="d-sm-block d-none"
                  ></img>

                  <div className="d-flex align-self-center">
                    <button className="btn btn-outline-confirm m-2 size-6">
                      查看明細
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
