import React, { useState, useEffect } from 'react';
import axios from "axios"
import Link from "next/link";

// pc版（默認導出）
export default function LatestMission() {

  const [latestMissions, setLatestMissions] = useState([])

  const getLatestMissions = async () => {
    await axios.get("http://localhost:3005/api/mission/latest-missions")
      .then((response) => {
        const data = response.data.data;
        console.log("data是" + data);
        setLatestMissions(data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    getLatestMissions()
  }, [])

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  // 為每個卡片創建獨立的isFavorite狀態數組
  const [isFavorites, setIsFavorites] = useState(latestMissions.map(() => false));

  const toggleFavorite = (index) => {
      const newFavorites = [...isFavorites];
      newFavorites[index] = !newFavorites[index];
      setIsFavorites(newFavorites);
  };

  return (
    <>
      {latestMissions.map((v, i) => {
        return (
          <div className='latest-mission-card d-flex'>
            <Link href={`/work/find-mission/${v.mission_id}`} >
              <div className='mission-img'>
                <img src={v.file_path} alt="任務" />
              </div>
            </Link>
            <div className='mission-content ms-2'>
              <Link href={`/work/find-mission/${v.mission_id}`} >
                <div className='title size-6'>{v.title}</div>
              </Link>
              <div className='d-flex justify-content-between mt-1 mt-sm-2'>
                <div className='size-7'>{v.city}{v.area}<br />{formatDate(v.post_date)}</div>
                <img src={isFavorites[i] ? "/heart-clicked.svg" : "/heart.svg"} alt={isFavorites[i] ? "已收藏" : "未收藏"} onClick={() => toggleFavorite(i)} />
              </div>
              <div className='d-flex justify-content-between align-items-end price'>
                <div >單次<span className='size-6'> NT${v.price}</span></div>
                <button className='btn-confirm size-6'>應徵</button>
              </div>
            </div>
          </div>
        )
      })
      }
    </>
  )
}

// mobile版（命名導出）
export const MobileLatestMission = () => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [latestMissions, setLatestMissions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // 追蹤動畫狀態 防止多次快速點擊上一張或下一張按鈕 導致卡片重疊
  const [isAnimating, setIsAnimating] = useState(false);
  const [isIndicatorsDisabled, setIsIndicatorsDisabled] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const getLatestMissions = async () => {
    try {
      const response = await axios.get("http://localhost:3005/api/mission/latest-missions");
      const data = response.data.data;
      setLatestMissions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getLatestMissions();
  }, []);

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true); // 開始動畫
      // 參數為先前的索引值（預設0）也就是當前活動的幻燈片索引
      setActiveIndex((prevIndex) => (prevIndex + 1) % latestMissions.length);  // 取餘數確保索引保持在有效範圍內
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true); // 開始動畫
      setActiveIndex((prevIndex) =>
        prevIndex === 0 ? latestMissions.length - 1 : prevIndex - 1
      );
    }
  };

  // 監聽過渡結束事件，並在過渡結束後重置 isAnimating
  // 在動畫完成後重置狀態以啟用按鈕
  useEffect(() => {
    const transitionEndHandler = () => {
      setIsAnimating(false);
      setIsIndicatorsDisabled(false);
    };

    const carousel = document.querySelector('.carousel-inner');
    carousel.addEventListener('transitionend', transitionEndHandler);

    // 組件卸載（或下一次 useEffect 執行時）時，移除之前附加的事件處理程序
    return () => {
      carousel.removeEventListener('transitionend', transitionEndHandler);
    };
  }, []);

  const handleIndicatorClick = (index) => {
    setIsIndicatorsDisabled(true);
    setActiveIndex(index);
  };

  return (
    <div id="carouselExampleIndicators" className="carousel slide pb-3" data-bs-ride="carousel">
      <div className="carousel-indicators mt-5">
        {latestMissions.map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide-to={index}
            // className={index === activeIndex ? "active" : ""}
            // aria-current={index === activeIndex ? "true" : ""}
            // aria-label={`Slide ${index + 1}`}
            className={`${index === activeIndex ? "active" : ""} ${isIndicatorsDisabled ? "disabled" : ""}`}
            aria-current={index === activeIndex ? "true" : ""}
            aria-label={`Slide ${index + 1}`}
            onClick={() => handleIndicatorClick(index)}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {latestMissions.map((v, index) => (
          <div key={v.id} className={`carousel-item ${index === activeIndex ? "active" : ""}`}>
            <div className='latest-mission-card d-flex'>
              <div className='mission-img'>
                <img src={v.file_path} alt="任務" />
              </div>
              <div className='mission-content ms-2'>
                <div className='title size-6'>{v.title}</div>
                <div className='d-flex justify-content-between mt-1 mt-sm-2'>
                  <div className='size-7'>{v.city}{v.area}<br />{formatDate(v.post_date)}</div>
                  <img src={isFavorite ? "/heart-clicked.svg" : "/heart.svg"} alt={isFavorite ? "已收藏" : "未收藏"} onClick={toggleFavorite} />
                </div>
                <div className='d-flex justify-content-between align-items-end price'>
                  <div >單次<span className='size-6'> NT${v.price}</span></div>
                  <button className='btn-confirm size-6'>應徵</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 上一張 */}
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev" onClick={prevSlide}>
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      {/* 下一張 */}
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next" onClick={nextSlide}>
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};