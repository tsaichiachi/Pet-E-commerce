import { useState, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import Link from "next/link";

export default function ArticleListCard() {
  const [articleListCard, setArticleListCard] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1); //預設停留的slide

  // // 向伺服器要求資料，設定到狀態中
  const getArticleListCard = async () => {
    const res = await fetch("http://localhost:3005/api/article-home");

    const data = await res.json();

    console.log("我愛文章");
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(data)) setArticleListCard(data);
  };

  // // didMount 初次渲染"後", 向伺服器要求資料，設定到狀態中
  useEffect(() => {
    getArticleListCard();
  }, []);

  // 只要前三篇文章
  const firstThreeArticles = articleListCard.slice(0, 3);
  const secondThreeArticles = articleListCard.slice(3, 6);
  const thirdThreeArticles = articleListCard.slice(6, 9);

  //處理按鈕事件
  const handlePreviousClick = () => {
    if (activeIndex > 1) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNextClick = () => {
    if (activeIndex < 3) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <>
      <div id="carouselExample" className="carousel slide">
        <div className="carousel-inner">
          <div className="article-list-card">
            <div
              className={`carousel-item ${
                activeIndex === 1 ? "active" : ""
              } firstThreeArticles`}
            >
              <div className="row g-4 px-5">
                <div className="col">
                  <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                    {firstThreeArticles.map((v, i) => {
                      return (
                        <div
                          className="col"
                          key={`article-card-${v.article_id}`}
                        >
                          <Link
                            href={`/article/${v.article_category_id}/${v.article_id}`}
                          >
                            <div className="card h-100">
                              <img src={v.img} alt="..." />
                              <div className="card-body">
                                <h5 className="card-title size-6 m-size-6">
                                  {v.title}
                                </h5>
                                <p className="card-text size-7 m-size-7">
                                  {v.published_date}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`carousel-item ${
                activeIndex === 2 ? "active" : ""
              } secondThreeArticles`}
            >
              <div className="row g-4 px-5">
                <div className="col">
                  <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                    {secondThreeArticles.map((v, i) => {
                      return (
                        <div
                          className="col"
                          key={`article-card-${v.article_id}`}
                        >
                          <Link
                            href={`/article/${v.article_category_id}/${v.article_id}`}
                          >
                            <div className="card h-100">
                              <img src={v.img} alt="..." />
                              <div className="card-body">
                                <h5 className="card-title size-6 m-size-6">
                                  {v.title}
                                </h5>
                                <p className="card-text size-7 m-size-7">
                                  {v.published_date}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`carousel-item ${
                activeIndex === 3 ? "active" : ""
              } thirdThreeArticles`}
            >
              <div className="row g-4 px-5">
                <div className="col">
                  <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                    {thirdThreeArticles.map((v, i) => {
                      return (
                        <div
                          className="col"
                          key={`article-card-${v.article_id}`}
                        >
                          <Link
                            href={`/article/${v.article_category_id}/${v.article_id}`}
                          >
                            <div className="card h-100">
                              <img src={v.img} alt="..." />
                              <div className="card-body">
                                <h5 className="card-title size-6 m-size-6">
                                  {v.title}
                                </h5>
                                <p className="card-text size-7 m-size-7">
                                  {v.published_date}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
          onClick={handlePreviousClick}
        >
          <FaChevronLeft size={70} style={{ color: "#512f10" }} />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
          onClick={handleNextClick}
        >
          <FaChevronRight size={70} style={{ color: "#512f10" }} />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </>
  );
}
