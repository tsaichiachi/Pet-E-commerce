import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function ArticleCatogory() {
  const [articlecatogory, setArticleCatogory] = useState([]);
  const [activeButtons, setActiveButtons] = useState([]);
  const router = useRouter();

  const getArticleCatogory = async () => {
    await axios
      .get("http://localhost:3005/api/article-category")
      .then((response) => {
        const data = response.data.result;
        // console.log(data);
        setArticleCatogory(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  useEffect(() => {
    getArticleCatogory();
  }, []);

  useEffect(() => {
    // 讓第一個按鈕預設active
    if (articlecatogory.length > 0) {
      const initialActiveButtons = Array(articlecatogory.length).fill(false);
      initialActiveButtons[0] = true;
      setActiveButtons(initialActiveButtons);
    }
  }, [articlecatogory]);

  useEffect(() => {
    // 獲取當前頁面路徑
    const currentPath = router.asPath;

    // 根據路徑來決定按鈕顏色
    if (currentPath.startsWith("/article/")) {
      const parts = currentPath.split("/");
      if (parts.length >= 3) {
        const categoryID = parseInt(parts[2]);
        const newActiveButtons = Array(articlecatogory.length).fill(false);
        const categoryIndex = articlecatogory.findIndex(
          (v) => v.article_category_id === categoryID
        );
        if (categoryIndex !== -1) {
          newActiveButtons[categoryIndex] = true;
        }
        setActiveButtons(newActiveButtons);
      }
    }
  }, [router.asPath, articlecatogory]);

  const handleButtonClick = (articleCategoryId, index) => {
    // 有按鍵active其他沒有
    const newActiveButtons = Array(articlecatogory.length).fill(false);
    newActiveButtons[index] = true;

    // 設定狀態
    setActiveButtons(newActiveButtons);
  };

  return (
    <>
      {/* <div className="article-catogory"></div> */}
      {articlecatogory.map((v, i) => {
        return (
          <Link
            key={v.article_category_id}
            href={`/article/${v.article_category_id}`}
          >
            <button
              type="button"
              key={v.article_category_id}
              className={`mx-1 ${
                activeButtons[i] ? "btn-brown active" : "btn-outline-confirm"
              }`}
              onClick={() => handleButtonClick(v.article_category_id, i)}
            >
              {v.name}
            </button>
          </Link>
        );
      })}
    </>
  );
}
