import React from 'react'
import Link from "next/link";
import Membership from '@/components/user/membership';

export default function Testm() {
  return (
    <div>
     <div className="d-flex justify-content-center bg border mx-4 mt-3">
              <div className="my-3 lv">
                <p className="size-7 level text-center px-2">Level.1 幼貓</p>
              </div>
              <Link className="size-7 mt-3 ms-3" href="">
                查看會員等級優惠
              </Link>
              <br/>
                <Membership/>
            </div>
    </div>
  )
}
