import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer d-flex flex-column justify-content-evenly align-items-center">
      <div className="footer-links size-6 d-flex w-50 justify-content-around">
        <Link href="#" className="active-hover">
          關於我們
        </Link>
        <Link href="#" className="active-hover">
          會員制度
        </Link>
        <Link href="#" className="active-hover">
          常見問題
        </Link>
        <Link href="#" className="active-hover">
          聯絡我們
        </Link>
      </div>
      <div className="copyright m-size-7">
        © 2023 小貓兩三隻 All Right Reserved
      </div>
    </div>
  );
};

export default Footer;
