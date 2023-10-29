import React,{ useEffect, useState } from 'react'

export default function Star({startRating = 0,valid, edit,onRatingChange = () => {} }) {
    const [rating, setRating] = useState(startRating)
    const [hoverRating, setHoverRating] = useState(0)
    useEffect(() => {
        setRating(startRating)
      }, [startRating])
  return (
    <>
    {(valid==null||edit==true)?(
        <div className='star'>
        {/* 快速產生5個成員都是1陣列，表達式語法 */}
        {Array(5)
          .fill(1)
          .map((v, i) => {
            //每個星星的分數
            const score = i + 1
            return (
              <button
                className='star-btn'
                key={i}
                onClick={() => {
                  //點按後設定分數到狀態
                  setRating(score)
                  //回傳值到父母元件
                  onRatingChange(score)
                }}
                onMouseEnter={() => {
                  setHoverRating(score)
                }}
                onMouseLeave={() => {
                  setHoverRating(0)
                }}
              >
                <span
                  //判斷分數(score)如果小於等於目前的評分(rating)狀態，則套用亮起樣式
                  className={
                    score <= rating || score <= hoverRating
                      ? 'on'
                      : 'off'
                  }
                >
                  &#9733;
                </span>
              </button>
            )
          })}
      </div>
    ):(
      <div className='star'>
      <span>商品評分：</span>
        {/* 快速產生5個成員都是1陣列，表達式語法 */}
        {Array(5)
          .fill(1)
          .map((v, i) => {
            //每個星星的分數
            const score = i + 1
            return (
              <button
                className='star-btn'
                key={i}
              >
                <span
                  //判斷分數(score)如果小於等於目前的評分(rating)狀態，則套用亮起樣式
                  className={
                    score <= rating
                      ? 'on'
                      : 'off'
                  }
                >
                  &#9733;
                </span>
              </button>
            )
          })}
      </div>

    )}

    </>
  )
}

