import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ArticleCard() {
  // 1.由router中要獲得動態路由pid(即檔案方括號中的名稱)
  // router.query中會包含pid屬性
  // router.isReady(布林值)，如果為true代表本頁面已完成水合作用(hydration)，router.query已經有值可以使用
  const router = useRouter();

  const [articles, setArticles] = useState({
    article_id: "",
    title: "",
    content: "",
    article_category_id: "",
    published_date: "",
    created_date: "",
    valid: "",
    name: "",
    id: "",
    img: "",
  });

  // 向伺服器要資料設定到狀態中
  const getArticles = async ({ article_category_id, id }) => {
    const res = await fetch(
      "http://localhost:3005/api/article/" + article_category_id + "/" + id
    );

    const data = await res.json();

    // console.log(data);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    setArticles(data);
  };
  useEffect(() => {
    if (router.isReady) {
      // 確保能得到router.query有值
      const { article_category_id, id } = router.query;
      // console.log({ article_category_id, id });
      // 有id後，向伺服器要求資料，設定到狀態中
      getArticles({ article_category_id, id });
    }
    // eslint-disable-next-line
  }, [router.isReady]);

  return (
    <>
      <div className="article-card">
        <div className="card mb-3">
          <div className="card-img">
            <img
              src={articles.img}
              className="card-img-top  img-fluid"
              alt="..."
            />
          </div>
          <div className="card-body">
            <span className="card-title size-3 m-size-4">{articles.title}</span>
            <p className="card-text size-5 m-size-6">
              <small className="text-body-secondary">
                {articles.published_date}
              </small>
            </p>
          </div>
        </div>
        <div className="my-3 p-3 article size-7">
          {/* 使用dangerouslySetInnerHTML渲染带有HTML标签的内容 */}
          <div dangerouslySetInnerHTML={{ __html: articles.content }} />
        </div>
      </div>
    </>
  );
}
