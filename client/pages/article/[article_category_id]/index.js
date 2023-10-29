import { useState, useEffect } from "react";
import ArticleCatogory from "@/components/article/article-catogory";
import ArticleListCard from "@/components/article/article-list-card";
import { useRouter } from "next/router";

export default function ArticleList() {
  const [articlelist, setArticleList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(1);
  const router = useRouter();

  useEffect(() => {
    // 使用useRouter監聽路由變化
    const handleRouteChange = () => {
      // 當路由發生變化時手動重新載入頁面
      // location.reload();
    };

    // 加入路由變化監聽器
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-5 mt-5">
          <ArticleCatogory />
        </div>

        <div>
          <ArticleListCard category={selectedCategory} />
        </div>
      </div>
    </>
  );
}
