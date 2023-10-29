// import React, { useState, useEffect } from "react";
import ArticleCatogory from "@/components/article/article-catogory";
import ArticleCard from "@/components/article/article-card";
// import axios from "axios";

export default function Article() {
  // const [article, setArticle] = useState(null);

  // useEffect(() => {
  //   // 獲得路由參數中的文章id和文章類別
  //   const { category, id } = props.match.params;

  //   // 請求的URL
  //   const apiUrl = `http://localhost:3005/article/${category}/${id}`;

  //   // 使用axios拿文章資料
  //   axios
  //     .get(apiUrl)
  //     .then((response) => {
  //       const data = response.data;
  //       setArticle(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // }, [props.match.params]);

  return (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-center mt-5">
          <ArticleCatogory />
        </div>
        <div className="mt-5">
          <ArticleCard />
        </div>
      </div>
    </>
  );
}
