import React from "react";
import Link from "next/link";

export default function BlockThree() {
  return (
    <>
      <div className="mb-5">
        <div className="text-center">
          <div className="row">
            <div className="col-md-7">
              <div className="mt-5 ms-5">
                <div className="desktop-title">
                  <span className="title size-2 m-size-3 d-flex justify-content-start">
                    開幕慶
                  </span>
                </div>
                <div className="d-flex justify-content-start">
                  <span>限時特賣活動，現在加入會員最划算</span>
                </div>
              </div>
              <div className="m-3 bg-light">
                <div className="text-center">
                  <div className="row align-items-start mt-5 py-3 px-1">
                    <div className="col price size-6">
                      $1000
                      <div className="size-7 content">全館滿額免運</div>
                    </div>
                    <div className="col price size-6">
                      95折券
                      <div className="size-7 content">會員免費領取</div>
                    </div>
                    <div className="col price size-6">
                      買一送一
                      <div className="size-7 content">VIP會員生日禮金</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="m-5 d-flex justify-content-center">
                <Link href="/member/login">
                  <button type="reset" className="btn-brown mx-1">
                    立即註冊
                  </button>
                </Link>
              </div>
            </div>
            <div className="col-5 col-md-5 d-flex align-items-end">
              <div className="row">
                <div className="col-8 ">
                  <img
                    src="/home/homecat1.jpeg"
                    className="img-fluid"
                    alt="..."
                  ></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
