import React from "react";
import Image from "next/image";

import Cat2 from "@/assets/cat-02.png";

export default function SingleCoupon() {
  return (
    <>
      <div id="container-coupon">
        <div id="success-box">
          <div className="dot" />
          <div className="dot two" />

          <div className="cat-box">
            <Image src={Cat2} width={80} height={80} className="cat2" />
          </div>
          <div className="shadow scale" />
          <div className="message-coupon">
            <h1 className="priceCode">$200</h1>
            <p>
              序號：200PPDD
              <br />
              最低消費：1000
              <br />
              使用期限：2023/12/12
              <br />
              <a> -前往購物-</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
