import React from 'react'
import Image from "next/image";
import Cat1 from "@/assets/cat-01.png";

export default function SingleCouponNew() {
  return (
    <>
      <div id="container-coupon">
  <div id="error-box">
    
    <Image src={Cat1} width={80} height={80} className="cat1" />
    <div className="shadow move" />
    <div className="message-coupon">
      <h1 className="priceCode">新會員</h1>
      <p>指定商品買一送一</p>
    </div>
  </div>
  </div>
    </>
  )
}
