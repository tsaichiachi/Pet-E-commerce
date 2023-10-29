import React from "react";
import { useRouter } from "next/router";

export default function BreadCrumb() {
  const router = useRouter();
  const getBreadcrumbText = () => {
    const pathname = router.pathname;
    switch (pathname) {
      case "/":
        return "首頁";
      case "/article":
        return "小貓兩三知";
      case "/article/1":
        return "日常提案";
    }
  };

  return (
    <>
      <nav className="breadcrumb" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">首頁</a>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <a href="/">小貓兩三知</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <a href="/">動物百科</a>
          </li>
        </ol>
      </nav>
    </>
  );
}
