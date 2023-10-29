import React from 'react'
import Image from "next/image";
import Cat3 from "@/assets/cat-03.png";

export default function SingleCouponFree() {
  return (
  <>
  <div id="container-coupon">
  <div id="error-box">
    
    <Image src={Cat3} width={80} height={80} className="cat1" alt='cat3' />
    <div className="shadow move" />
    <div className="message-coupon">
      <h1 className="priceCode">免運!</h1>
      <p>不限金額免運費</p>
    </div>
  </div>
  </div>

  </>
  )
}
