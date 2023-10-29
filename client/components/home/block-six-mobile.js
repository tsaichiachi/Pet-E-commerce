import React from "react";
import { useState, useEffect } from "react";

export default function NewCarousel() {
  const [articleListCard, setArticleListCard] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === articleListCard.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? articleListCard.length - 1 : prevIndex - 1
    );
  };

  // Fetch article data and set it to the state
  const getArticleListCard = async () => {
    const res = await fetch("http://localhost:3005/api/article/");
    const data = await res.json();
    if (Array.isArray(data)) setArticleListCard(data);
  };

  useEffect(() => {
    getArticleListCard();
  }, []);

  return (
    <div id="carouselExampleDark" className="carousel carousel-dark slide">
      <div className="carousel-indicators">
        {articleListCard.map((article, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleDark"
            data-bs-slide-to={index}
            className={activeIndex === index ? "active" : ""}
            aria-current={activeIndex === index}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {articleListCard.map((article, index) => (
          <div
            key={index}
            className={`carousel-item ${activeIndex === index ? "active" : ""}`}
            data-bs-interval={10000}
          >
            <img src={article.img} className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>{article.title}</h5>
              <p>{article.published_date}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        onClick={handlePrev}
        data-bs-target="#carouselExampleDark"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        onClick={handleNext}
        data-bs-target="#carouselExampleDark"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
