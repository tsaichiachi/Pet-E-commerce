import React from "react";
import Link from "next/link";

export default function BlockFive() {
  return (
    <>
      <div className="mb-5">
        <div className="text-center">
          <div className="row">
            <div className="col-5 col-md-5 d-flex align-items-end">
              <div className="row">
                <div className="col-4"></div>
                <div className="col-8 ">
                  <img
                    src="/home/homecat2.png"
                    className="img-fluid"
                    alt="..."
                  ></img>
                </div>
              </div>
            </div>
            <div className="col-md-7">
              <div className="mt-5 ms-5">
                <div className="desktop-title">
                  <span className="title size-1 m-size-3 d-flex justify-content-start">
                    小貓上工囉！<br></br>貓咪互助平台
                  </span>
                </div>
                <div className="d-flex justify-content-start">
                  <span>你的貓貓需要幫助嗎？讓其他人來幫助你！</span>
                </div>
              </div>
              <div className="m-5 d-flex justify-content-start">
                <Link href="/work/find-mission">
                  <button type="reset" className="btn-brown mx-1">
                    立即前往
                  </button>
                </Link>
              </div>
              <div className="m-3 bg-light">
                <div className="text-center">
                  <div className="row align-items-start mt-5 py-3 px-1">
                    <div className="col price size-6">
                      100+
                      <div className="size-7 content">超多小幫手</div>
                    </div>
                    <div className="col price size-6">
                      890+
                      <div className="size-7 content">多種刊登需求</div>
                    </div>
                    <div className="col price size-6">
                      300+
                      <div className="size-7 content">真實用戶回饋</div>
                    </div>
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
