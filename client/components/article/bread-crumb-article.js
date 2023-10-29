import React from "react";

export default function BreadCrumbArticle() {
  return (
    <>
      <nav  className="breadcrumb" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/">首頁</a>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <a href="/article/1">小貓兩三知</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <a href="/">動物百科</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            <a href="/">何謂天然豆腐砂：讓貓咪擁有舒適的體驗 </a>
          </li>
        </ol>
      </nav>
    </>
  );
}
