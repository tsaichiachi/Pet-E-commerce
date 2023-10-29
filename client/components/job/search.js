import React, { useRef } from "react";
import { set } from "react-hook-form";
import { BiSearchAlt } from "react-icons/bi";

const Search = ({ placeholder, color, onClick, search, setSearch }) => {
  const rippleBtnRef = useRef(null);
  const inputRef = useRef(null);
  const handleRipple = () => {
    const btn = rippleBtnRef.current;
    btn.classList.add("ripple");
    setTimeout(() => {
      btn.classList.remove("ripple");
    }, 500); //動畫持續時間結束後移除動畫效果，讓動畫可以重複使用
  };

  return (
    <div className="job-search">
      <input
        id="search-input"
        type="text"
        placeholder={placeholder || ""}
        ref={inputRef}
        value={search}
        onChange={(e) => {
          console.log(e.target.value);
          setSearch(e.target.value);
        }}
      />
      <button
        onClick={() => {
          handleRipple();
          if (onClick) {
            onClick(inputRef.current.value);
          }
        }}
        ref={rippleBtnRef}
      >
        <BiSearchAlt className="job-search-icon" />
      </button>
    </div>
  );
};

export default Search;

// Search元件可傳入變數(props)：
// placehoder={輸入自訂的placeholder文字}
// onClick={handleBack} 函式可自訂，第一個參數value可以取得input的值
