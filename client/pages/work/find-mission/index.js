import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import jwt_decode from "jwt-decode";
// components
import RoleSelection from "@/components/job/role-selection";
// import { ScrollMotionContainer, ScrollMotionItem, } from "@/components/ScrollMotion";
// 用 {} 導入的內容是命名導出的，而不加{}導入的內容是默認導出的。
// import LatestMission, {
//   MobileLatestMission,
// } from "@/components/job/latest-mission";
// import Search from "@/components/job/search";
// import Filter from '@/components/job/filter'
// import MissionCard from '@/components/job/mission-card'
import Pagination from "@/components/pagination";
// react-icons
import { FaCaretUp, FaCaretDown, FaRegHeart, FaHeart } from "react-icons/fa";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { BiSearchAlt } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";
import { FaLocationDot, FaRegCalendarCheck } from "react-icons/fa6";
import { MdDateRange } from "react-icons/md";
import { BsFillCalendar2DateFill } from "react-icons/bs";
// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
// Filter
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// 地區篩選
// import { Cascader } from '@douyinfe/semi-ui';
import { Cascader } from "antd";
import cityData from "@/data/CityCountyData.json";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  useInView,
} from "framer-motion";
import ScrollMotionItem from 'react-scroll-motion';
import 'animate.css'; // 導入動畫庫

// 搜尋
const Search = ({ placeholder, color, onClick, search, setSearch, inputValue, setInputValue, setActivePage, setMissionType, setUpdateDate, setMissionCity, setMissionArea, setSortOrder, setSortBy, setButtonText1, setButtonText2, setSelectedCity, setSelectedArea }) => {
  const rippleBtnRef = useRef(null);
  const inputRef = useRef(null);
  const handleRipple = () => {
    const btn = rippleBtnRef.current;
    btn.classList.add("ripple");
    setTimeout(() => {
      btn.classList.remove("ripple");
    }, 500); //動畫持續時間結束後移除動畫效果，讓動畫可以重複使用
  };

  const handleSearch = () => {
    // 清空篩選的資料
    setMissionType(null);
    setUpdateDate(null);
    setMissionCity(null);
    setMissionArea(null);
    setButtonText1('任務類型');
    setButtonText2('更新時間');
    setSelectedCity(null);
    setSelectedArea(null);
    setSortOrder('asc');
    setSortBy('post_date');
    // 依據input進行搜尋
    setSearch(inputValue);
    // 清空輸入框的值
    setInputValue("");
    console.log("按了搜尋按鈕的inputValue是" + inputValue)
    console.log("按了搜尋按鈕的search是" + search)
    setActivePage(1);
  };

  return (
    <div className="job-search">
      <input
        id="search-input"
        type="text"
        placeholder={placeholder || ""}
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          console.log(e.target.value);
          // 不在這裡觸發搜尋，而是更新 inputValue 狀態
          setInputValue(e.target.value);
          console.log("輸入時的inputValue是" + inputValue)
        }}
      />
      <button
        onClick={() => {
          handleRipple();
          handleSearch();
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

// 最終版篩選
const MyFilter = ({ missionType, setMissionType, missionCity, setMissionCity, missionArea, setMissionArea, updateDate, setUpdateDate, sortOrder, setSortOrder, sortBy, setSortBy, setActivePage, buttonText1, setButtonText1, buttonText2, setButtonText2, selectedCity, setSelectedCity, selectedArea, setSelectedArea }) => {

  // 三：處理任務city下拉選單項的點擊事件
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedArea(null);
    // console.log(`選中的值是: ${selectedCity}`);
    console.log(`選中的城市是: ${city.CityName}`);
    setMissionCity(city.CityName);
    setMissionArea(null); // 要重置area 第二次篩city才能正常
    // console.log(`選中的missionCity是: ${missionCity}`);
    setActivePage(1);
  };

  // 立即更新missionCity的值 否則第一次點擊會是null(因為異步)
  useEffect(() => {
    console.log(`選中的missionCity是: ${missionCity}`);
    console.log(`"現在是接"+http://localhost:3005/api/mission/all-missions?missionType=${missionType}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}`)
  }, [missionCity]);

  // 三：處理任務area下拉選單項的點擊事件
  const handleAreaChange = (area) => {
    setSelectedArea(area);
    console.log(`選中的地區是: ${area.AreaName}`);
    setMissionArea(area.AreaName);
    setActivePage(1);
  };

  useEffect(() => {
    console.log(`選中的missionArea是: ${missionArea}`);
    console.log(`"現在是接"++http://localhost:3005/api/mission/all-missions?missionType=${missionType}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}`)
  }, [missionArea]);

  // 任務類型選項
  const options1 = [
    { label: '到府照顧', value: 'feed' },
    { label: '安親寄宿', value: 'house' },
    { label: '到府美容', value: 'beauty' },
    { label: '行為訓練', value: 'training' },
    { label: '醫療護理', value: 'medical' },
  ];

  // 更新日期選項
  const options2 = [
    { label: '今天以內', value: 'today' },
    { label: '一週以內', value: 'one_week' },
    { label: '一個月內', value: 'one_month' },
  ];

  // 一：處理任務類型下拉選單項的點擊事件
  const handleItemClick1 = (label) => {
    // 獲取選項的value值
    const selectedValue = options1.find(option => option.label === label)?.value;
    // 更新按鈕文字
    setButtonText1(label);
    // 這裡可以使用selectedValue來執行其他操作
    console.log(`選中的值是: ${selectedValue}`);

    setMissionType(selectedValue);
    setActivePage(1);
  };

  // 二：處理更新日期下拉選單項的點擊事件
  const handleItemClick2 = (label) => {
    const selectedValue = options2.find(option => option.label === label)?.value;
    setButtonText2(label);
    console.log(`選中的值是: ${selectedValue}`);

    setUpdateDate(selectedValue);
    setActivePage(1);
  };

  // 清除篩選條件
  const clearFilters = () => {
    setMissionType(null);
    setUpdateDate(null);
    setMissionCity(null);
    setMissionArea(null);
    setButtonText1('任務類型');
    setButtonText2('更新時間');
    setSelectedCity(null);
    setSelectedArea(null);
    console.log("現在的missionType是" + missionType + "現在的updateDate是" + updateDate + "現在的missionCity是" + missionCity + "現在的missionArea是" + missionArea);
  };

  // 點擊標題時 讓button為active（修改樣式用）
  // const buttonRef = useRef(null);  //僅適用只有一組標題時
  const buttonRef1 = useRef(null);
  const buttonRef2 = useRef(null);
  const buttonRef3 = useRef(null);
  const buttonRef4 = useRef(null);
  // const [isActive, setIsActive] = useState(false);  //僅適用只有一組標題時
  const [buttonStates, setButtonStates] = useState({
    button1: false,
    button2: false,
    button3: false,
    button4: false,
  });

  useEffect(() => {
    // 添加點擊頁面其他地方關閉下拉選單的事件監聽器
    function handleClickOutside(event) {
      // 如果按鈕元素存在（即buttonRef.current不為null）且點擊事件發生在按鈕元素之外
      // if (buttonRef.current && !buttonRef.current.contains(event.target)) {   //僅適用只有一組標題時
      //   setIsActive(false);
      // }
      if (buttonRef1.current && !buttonRef1.current.contains(event.target)) {
        setButtonStates((prevButtonStates) => ({
          ...prevButtonStates,
          button1: false,
        }));
      }
      if (buttonRef2.current && !buttonRef2.current.contains(event.target)) {
        setButtonStates((prevButtonStates) => ({
          ...prevButtonStates,
          button2: false,
        }));
      }
      if (buttonRef3.current && !buttonRef3.current.contains(event.target)) {
        setButtonStates((prevButtonStates) => ({
          ...prevButtonStates,
          button3: false,
        }));
      }
      if (buttonRef4.current && !buttonRef4.current.contains(event.target)) {
        setButtonStates((prevButtonStates) => ({
          ...prevButtonStates,
          button4: false,
        }));
      }
    }

    document.addEventListener('click', handleClickOutside);

    // 組件卸載時移除事件監聽器（組件卸載時會自動執行return語句)
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // const handleButtonActive = () => {    //僅適用只有一組標題時
  //   setIsActive(!isActive);
  // };
  const handleButtonActive = (buttonName) => {
    setButtonStates((prevButtonStates) => ({
      ...prevButtonStates,
      [buttonName]: !prevButtonStates[buttonName],
    }));
  };

  return (
    <>
      <div className='filters d-sm-flex justify-content-center align-items-center d-none '>
        {/* 一：任務類型 */}
        <div className={`btn-group mx-2 ${buttonStates.button1 ? 'active' : ''}`}>
          <button
            ref={buttonRef1}
            className={`btn dropdown-toggle ${buttonStates.button1 ? 'active' : ''}`}
            type="button"
            id="defaultDropdown1"
            data-bs-toggle="dropdown"
            data-bs-auto-close="true"
            aria-expanded={buttonStates.button1}
            onClick={() => handleButtonActive('button1')}
          >
            <div className="left-background"></div>
            <img src="/job-icon/plus-service.svg" className="me-3" />
            {buttonText1} {/* 按鈕文字狀態 */}
            <BiSolidDownArrow className="ms-2" />
          </button>
          <ul className={`dropdown-menu ${buttonStates.button1 ? 'show' : ''}`} aria-labelledby="defaultDropdown1">
            {/* 使用map函數動態生成下拉選單項 */}
            {options1.map((option) => (
              <li
                key={option.label}
                className="dropdown-item text-center"
                onClick={() => handleItemClick1(option.label)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>

        {/* 二：更新日期 */}
        <div className={`btn-group mx-2 ${buttonStates.button2 ? 'active' : ''}`}>
          <button
            ref={buttonRef2}
            className={`btn dropdown-toggle ${buttonStates.button2 ? 'active' : ''}`}
            type="button"
            id="defaultDropdown2"
            data-bs-toggle="dropdown"
            data-bs-auto-close="true"
            aria-expanded={buttonStates.button2}
            onClick={() => handleButtonActive('button2')}
          >
            <div className="left-background"></div>
            <img src="/job-icon/Calendar.svg" className="me-3" />
            {buttonText2}
            <BiSolidDownArrow className="ms-2" />
          </button>
          <ul className={`dropdown-menu ${buttonStates.button2 ? 'show' : ''}`} aria-labelledby="defaultDropdown2">
            {options2.map((option) => (
              <li
                key={option.label}
                className="dropdown-item text-center"
                onClick={() => handleItemClick2(option.label)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
        {/* 三：任務地區 */}
        {/* 城市下拉選單 */}
        <div className={`btn-group ms-2 ${buttonStates.button3 ? 'active' : ''}`}>
          <button
            ref={buttonRef3}
            className={`btn dropdown-toggle ${buttonStates.button3 ? 'active' : ''}`}
            type="button"
            id="defaultDropdown3"
            data-bs-toggle="dropdown"
            data-bs-auto-close="true"
            aria-expanded={buttonStates.button3}
            onClick={() => handleButtonActive('button3')}
          >
            <div className="left-background"></div>
            <img src="/job-icon/Discovery-date.svg" className="me-3" />
            {selectedCity ? selectedCity.CityName : '任務地區'}
            <BiSolidDownArrow className="ms-2" />
          </button>
          <ul className={`dropdown-menu ${buttonStates.button3 ? 'show' : ''}`} aria-labelledby="defaultDropdown3">
            {cityData.map((city) => (
              <li
                key={city.CityName}
                className="dropdown-item text-center"
                onClick={() => handleCityChange(city)}
              >
                {city.CityName}
              </li>
            ))}
          </ul>
        </div>
        {/* 地區下拉選單，有選city才會出現 */}
        {selectedCity && (
          <div className={`btn-group ${buttonStates.button4 ? 'active' : ''}`}>
            <button
              ref={buttonRef4}
              className={`btn dropdown-toggle ${buttonStates.button4 ? 'active' : ''}`}
              type="button"
              id="defaultDropdown4"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded={buttonStates.button4}
              onClick={() => handleButtonActive('button4')}
            >
              {selectedArea ? selectedArea.AreaName : '選擇地區'}
              <BiSolidDownArrow className="ms-2" />
            </button>
            <ul className={`dropdown-menu ${buttonStates.button4 ? 'show' : ''}`} aria-labelledby="defaultDropdown4">
              {selectedCity.AreaList.map((area) => (
                <li
                  key={area.ZipCode}
                  className="dropdown-item text-center"
                  onClick={() => handleAreaChange(area)}
                >
                  {area.AreaName}
                </li>
              ))}
            </ul>
          </div>
        )}
        <button className="btn-second ms-4 filter-button" onClick={clearFilters} >清除篩選</button>
      </div>
    </>
  );
};
// 篩選-手機
const FilterMobile = ({ missionType, setMissionType, missionCity, setMissionCity, missionArea, setMissionArea, updateDate, setUpdateDate, sortOrder, setSortOrder, sortBy, setSortBy, setActivePage, buttonText1, setButtonText1, buttonText2, setButtonText2, selectedCity, setSelectedCity, selectedArea, setSelectedArea }) => {

  // 三：處理任務city下拉選單項的點擊事件
  const handleCityChange = (city) => {
    setSelectedCity(city);
    setSelectedArea(null);
    // console.log(`選中的值是: ${selectedCity}`);
    console.log(`選中的城市是: ${city.CityName}`);
    setMissionCity(city.CityName);
    setMissionArea(null); // 要重置area 第二次篩city才能正常
    // console.log(`選中的missionCity是: ${missionCity}`);
    setActivePage(1);
  };

  // 立即更新missionCity的值 否則第一次點擊會是null(因為異步)
  useEffect(() => {
    console.log(`選中的missionCity是: ${missionCity}`);
    console.log(`"現在是接"+http://localhost:3005/api/mission/all-missions?missionType=${missionType}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}`)
  }, [missionCity]);

  // 三：處理任務area下拉選單項的點擊事件
  const handleAreaChange = (area) => {
    setSelectedArea(area);
    console.log(`選中的地區是: ${area.AreaName}`);
    setMissionArea(area.AreaName);
    setActivePage(1);
  };

  useEffect(() => {
    console.log(`選中的missionArea是: ${missionArea}`);
    console.log(`"現在是接"++http://localhost:3005/api/mission/all-missions?missionType=${missionType}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}`)
  }, [missionArea]);

  // 任務類型選項
  const options1 = [
    { label: '到府照顧', value: 'feed' },
    { label: '安親寄宿', value: 'house' },
    { label: '到府美容', value: 'beauty' },
    { label: '行為訓練', value: 'training' },
    { label: '醫療護理', value: 'medical' },
  ];

  // 更新日期選項
  const options2 = [
    { label: '今天以內', value: 'today' },
    { label: '一週以內', value: 'one_week' },
    { label: '一個月內', value: 'one_month' },
  ];

  // 一：處理任務類型下拉選單項的點擊事件
  const handleItemClick1 = (label) => {
    // 獲取選項的value值
    const selectedValue = options1.find(option => option.label === label)?.value;
    // 更新按鈕文字
    setButtonText1(label);
    // 這裡可以使用selectedValue來執行其他操作
    console.log(`選中的值是: ${selectedValue}`);

    setMissionType(selectedValue);
    setActivePage(1);
  };

  // 二：處理更新日期下拉選單項的點擊事件
  const handleItemClick2 = (label) => {
    const selectedValue = options2.find(option => option.label === label)?.value;
    setButtonText2(label);
    console.log(`選中的值是: ${selectedValue}`);

    setUpdateDate(selectedValue);
    setActivePage(1);
  };

  // 清除篩選條件
  const clearFilters = () => {
    setMissionType(null);
    setUpdateDate(null);
    setMissionCity(null);
    setMissionArea(null);
    setButtonText1('任務類型');
    setButtonText2('更新時間');
    setSelectedCity(null);
    setSelectedArea(null);
    console.log("現在的missionType是" + missionType + "現在的updateDate是" + updateDate + "現在的missionCity是" + missionCity + "現在的missionArea是" + missionArea);
  };

  return (
    <>
      <div className='filters d-flex justify-content-center align-items-center d-sm-none '>
        <Swiper slidesPerView="auto" className="mobile-filter" preventClicks={false}>
          <SwiperSlide>
            {/* 一：任務類型 */}
            <div className="btn-group mx-2">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="defaultDropdown1"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
              >
                <div className="left-background"></div>
                <img src="/job-icon/plus-service.svg" className="me-3" />
                {buttonText1} {/* 按鈕文字狀態 */}
                <BiSolidDownArrow className="ms-2" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="defaultDropdown1">
                {/* 使用map函數動態生成下拉選單項 */}
                {options1.map((option) => (
                  <li
                    key={option.label}
                    className="dropdown-item text-center"
                    onClick={() => handleItemClick1(option.label)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {/* 二：更新日期 */}
            <div className="btn-group mx-2">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="defaultDropdown2"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
              >
                <div className="left-background"></div>
                <img src="/job-icon/Calendar.svg" className="me-3" />
                {buttonText2}
                <BiSolidDownArrow className="ms-2" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="defaultDropdown2">
                {options2.map((option) => (
                  <li
                    key={option.label}
                    className="dropdown-item text-center"
                    onClick={() => handleItemClick2(option.label)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            {/* 三：任務地區 */}
            {/* 城市下拉選單 */}
            <div className="btn-group ms-2">
              <button
                className="btn dropdown-toggle"
                type="button"
                id="defaultDropdown1"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
              >
                <div className="left-background"></div>
                <img src="/job-icon/Discovery-date.svg" className="me-3" />
                {selectedCity ? selectedCity.CityName : '任務地區'}
                <BiSolidDownArrow className="ms-2" />
              </button>
              <ul className="dropdown-menu" aria-labelledby="defaultDropdown1">
                {cityData.map((city) => (
                  <li
                    key={city.CityName}
                    className="dropdown-item text-center"
                    onClick={() => handleCityChange(city)}
                  >
                    {city.CityName}
                  </li>
                ))}
              </ul>
            </div>
            {/* 地區下拉選單，有選city才會出現 */}
            {selectedCity && (
              <div className="btn-group">
                <button
                  className="btn dropdown-toggle"
                  type="button"
                  id="defaultDropdown1"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                >
                  {selectedArea ? selectedArea.AreaName : '選擇地區'}
                  <BiSolidDownArrow className="ms-2" />
                </button>
                <ul className="dropdown-menu" aria-labelledby="defaultDropdown1">
                  {selectedCity.AreaList.map((area) => (
                    <li
                      key={area.ZipCode}
                      className="dropdown-item text-center"
                      onClick={() => handleAreaChange(area)}
                    >
                      {area.AreaName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </SwiperSlide>
          <SwiperSlide>
            <button className="btn-second ms-4 filter-button" onClick={clearFilters} >清除篩選</button>
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
};

// 排序
const Sort = ({ missionType, setMissionType, missionCity, setMissionCity, missionArea, setMissionArea, updateDate, setUpdateDate, sortOrder, setSortOrder, sortBy, setSortBy, search }) => {
  const [activeButton, setActiveButton] = useState("post_date");
  const [iconDirection, setIconDirection] = useState({}); // 用於跟蹤圖標方向

  const toggleButton = (sortBy) => {
    // 切換排序順序
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    setSortBy(sortBy === "post_date" ? "post_date" : "price");
    setActiveButton(sortBy);

    // 更新圖標方向
    const newIconDirection = { ...iconDirection };
    newIconDirection[sortBy] = newSortOrder === "asc" ? "up" : "down";
    setIconDirection(newIconDirection);
  };

  useEffect(() => {
    console.log("現在是" + sortOrder);
    console.log(`排序現在是接+http://localhost:3005/api/mission/all-missions?missionType=${missionType}&updateDate=${updateDate}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}&missionSearch=${search}`)
  }, [sortOrder]);

  return (
    <>
      <div className="sort ">
        <div className="sort-btn d-flex justify-content-center text-align-center">
          <button
            className={`size-7 m-1 p-1 ${activeButton === "post_date" ? "active" : ""
              }`}
            onClick={() => toggleButton("post_date")}
          >
            刊登時間{" "}
            {iconDirection["post_date"] === "down" ? (
              <FaCaretDown />
            ) : (
              <FaCaretUp />
            )}
          </button>
          <button
            className={`size-7 m-1 p-1 ${activeButton === "price" ? "active" : ""
              }`}
            onClick={() => toggleButton("price")}
          >
            薪資{" "}
            {iconDirection["price"] === "down" ? (
              <FaCaretDown />
            ) : (
              <FaCaretUp />
            )}
          </button>
        </div>
      </div>
    </>
  );
};


// 最新任務（電腦版）
const LatestMission = ({ userId }) => {

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

  // 收藏
  const [isFavorites, setIsFavorites] = useState([]);
  // 初始化每個按鈕的初始懸停狀態（空心愛心hover時要替換成實心）
  const latestInitialHoverStates = Array(latestMissions.length).fill(false);
  const [latestIsHovered, setLatestIsHovered] = useState(latestInitialHoverStates);
  // 設置 onMouseEnter 處理程序來處理懸停狀態
  const handleLatestMouseEnter = (index) => {
    const newHoverStates = [...latestIsHovered];
    newHoverStates[index] = true;
    setLatestIsHovered(newHoverStates);
  };

  // 設置 onMouseLeave 處理程序來處理取消懸停狀態
  const handleLatestMouseLeave = (index) => {
    const newHoverStates = [...latestIsHovered];
    newHoverStates[index] = false;
    setLatestIsHovered(newHoverStates);
  };

  useEffect(() => {
    // 在組件加載時從後端獲取已收藏的任務
    const fetchFavoriteMissions = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/mission/fav?userId=${userId}`);
        const favoriteMissionIds = response.data.result.map((fav) => fav.mission_id);

        // 根據已收藏的任務和當前任務列表來初始化 isFavorites 數組
        const initialFavorites = latestMissions.map((mission) =>
          favoriteMissionIds.includes(mission.mission_id)
        );
        setIsFavorites(initialFavorites);
      } catch (error) {
        console.error('前端請求錯誤：', error);
      }
    };

    fetchFavoriteMissions();
  }, [latestMissions]);

  const toggleFavorite = async (index) => {
    // 檢查用戶是否已登入
    if (!userId) {
      alert('請先登入會員');
      return;
    }
    try {
      const newFavorites = [...isFavorites];
      newFavorites[index] = !newFavorites[index];
      setIsFavorites(newFavorites); // 立即更新圖標狀態

      const missionId = latestMissions[index].mission_id;
      console.log(missionId)

      if (!isFavorites[index]) {
        // 如果任務未被收藏，發送加入收藏的請求
        await axios.put(`http://localhost:3005/api/mission/add-fav?userId=${userId}`, { missionId });
        console.log('已加入收藏');
      } else {
        // 如果任務已被收藏，發送取消收藏的請求
        await axios.delete(`http://localhost:3005/api/mission/delete-fav?userId=${userId}`, { data: { missionId } });
        console.log('已取消收藏');
      }

    } catch (error) {
      console.error(error);
    }
  };

  // 動畫
  const LatestState = {
    initial: { y: 50, opacity: 0 },
    move: (i) => ({
      y: 0,
      opacity: 1,
      transition: { layout: { duration: 1 }, duration: 1, delay: i * 0.2 },
    }),
    exit: { x: 20, y: 15, opacity: 0 },
  };

  return (
    <>
      {latestMissions.map((v, i) => {
        return (
          <AnimatePresence>
            <motion.div custom={i}
              variants={LatestState}
              animate="move"
              initial="initial"
              exit="exit"
              className='latest-mission-card d-flex align-items-center'>
              <Link href={`/work/find-mission/${v.mission_id}`} >
                <div className='mission-img'>
                  <img src={v.file_path} alt="任務" />
                </div>
              </Link>
              <div className='mission-content ms-3'>
                <Link href={`/work/find-mission/${v.mission_id}`} >
                  <div className='title size-6'>{v.title}</div>

                  <div className='d-flex justify-content-between mt-1 '>
                    <div className='size-7'>
                      <div className="d-flex align-items-center mb-1">
                        <span className="tag-btn mb-1">{(() => {
                          switch (v.mission_type) {
                            case 1:
                              return '到府照顧';
                            case 2:
                              return '安親寄宿';
                            case 3:
                              return '到府美容';
                            case 4:
                              return '行為訓練';
                            case 5:
                              return '醫療護理';
                            default:
                              return '其他';
                          }
                        })()}</span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <FaLocationDot className="me-1" />
                        {v.city}
                        {v.area}
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <FaRegCalendarCheck className="me-1" />
                        {formatDate(v.update_date)}<span className="update-title" >（最後更新）</span>
                      </div>
                    </div>
                    {/* <img src={isFavorites[i] ? "/heart-clicked.svg" : "/heart.svg"} alt={isFavorites[i] ? "已收藏" : "未收藏"} onClick={() => toggleFavorite(i)} /> */}
                  </div>
                </Link>
                <div className='d-flex justify-content-between align-items-center price'>
                  <div >單次<span className='size-6'> NT${v.price}</span></div>
                  {/* <Link href={`/work/find-mission/${v.mission_id}`} >
                  <button className='btn-confirm size-6'>應徵</button>
                </Link> */}
                  <button className=" heart-btn" onClick={() => toggleFavorite(i)} onMouseEnter={() => handleLatestMouseEnter(i)}
                    onMouseLeave={() => handleLatestMouseLeave(i)}>
                    {isFavorites[i] ? (
                      <>
                        <FaHeart className="fill-icon" />
                      </>
                    ) : (
                      <>
                        {latestIsHovered[i] ? (
                          <FaHeart className="empty-icon-hover" />
                        ) : (
                          <FaRegHeart className="empty-icon" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )
      })
      }
    </>
  )
}

// 最新任務（手機版）
const MobileLatestMission = ({ userId }) => {
  const [latestMissions, setLatestMissions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // 追蹤動畫狀態 防止多次快速點擊上一張或下一張按鈕 導致卡片重疊
  const [isAnimating, setIsAnimating] = useState(false);
  const [isIndicatorsDisabled, setIsIndicatorsDisabled] = useState(false);

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

  // 收藏
  const [isFavorites, setIsFavorites] = useState([]);

  useEffect(() => {
    // 在組件加載時從後端獲取已收藏的任務
    const fetchFavoriteMissions = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/mission/fav?userId=${userId}`);
        const favoriteMissionIds = response.data.result.map((fav) => fav.mission_id);

        // 根據已收藏的任務和當前任務列表來初始化 isFavorites 數組
        const initialFavorites = latestMissions.map((mission) =>
          favoriteMissionIds.includes(mission.mission_id)
        );
        setIsFavorites(initialFavorites);
      } catch (error) {
        console.error('前端請求錯誤：', error);
      }
    };

    fetchFavoriteMissions();
  }, [latestMissions]);

  const toggleFavorite = async (index) => {
    // 檢查用戶是否已登入
    if (!userId) {
      alert('請先登入會員');
      return;
    }
    try {
      const newFavorites = [...isFavorites];
      newFavorites[index] = !newFavorites[index];
      setIsFavorites(newFavorites); // 立即更新圖標狀態

      const missionId = latestMissions[index].mission_id;
      console.log(missionId)

      if (!isFavorites[index]) {
        // 如果任務未被收藏，發送加入收藏的請求
        await axios.put(`http://localhost:3005/api/mission/add-fav?userId=${userId}`, { missionId });
        console.log('已加入收藏');
      } else {
        // 如果任務已被收藏，發送取消收藏的請求
        await axios.delete(`http://localhost:3005/api/mission/delete-fav?userId=${userId}`, { data: { missionId } });
        console.log('已取消收藏');
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id="carouselExampleIndicators" className="carousel slide pb-4" data-bs-ride="carousel">
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
            <div className='latest-mission-card d-flex align-items-center'>
              <Link href={`/work/find-mission/${v.mission_id}`} >
                <div className='mission-img'>
                  <img src={v.file_path} alt="任務" />
                </div>
              </Link>
              <div className='mission-content ms-2'>
                <Link href={`/work/find-mission/${v.mission_id}`} >
                  <div className='title size-6'>{v.title}</div>
                  <div className='d-flex justify-content-between mt-1 mt-sm-2'>
                    <div className='size-7'>
                      <div className="d-flex align-items-center mb-1">
                        <span className="tag-btn mb-1">{(() => {
                          switch (v.mission_type) {
                            case 1:
                              return '到府照顧';
                            case 2:
                              return '安親寄宿';
                            case 3:
                              return '到府美容';
                            case 4:
                              return '行為訓練';
                            case 5:
                              return '醫療護理';
                            default:
                              return '其他';
                          }
                        })()}</span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <FaLocationDot className="me-1" />
                        {v.city}
                        {v.area}
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <FaRegCalendarCheck className="me-1" />
                        {formatDate(v.update_date)}
                      </div>
                    </div>
                    {/* <img src={isFavorites[index] ? "/heart-clicked.svg" : "/heart.svg"} alt={isFavorites[index] ? "已收藏" : "未收藏"} onClick={() => toggleFavorite(index)} /> */}
                  </div>
                </Link>
                <div className='d-flex justify-content-between align-items-end price'>
                  <div >單次<span className='size-6'> NT${v.price}</span></div>
                  {/* <Link href={`/work/find-mission/${v.mission_id}`} >
                    <button className='btn-confirm size-6'>應徵</button>
                  </Link> */}
                  <button className=" heart-btn" onClick={() => toggleFavorite(index)}>
                    {isFavorites[index] ? (
                      <>
                        <FaHeart className="fill-icon" />
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="empty-icon" />
                      </>
                    )}
                  </button>
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



// 使任務卡片的圖片高度與寬度同寬
function ImageWithEqualDimensions({ file_path }) {
  const imgRef = useRef(null);

  // 使得圖片高度會在螢幕大小改變時跟著改變 而非在重整時才改變
  const handleResize = () => {
    // 獲取圖片元素的引用
    const image = imgRef.current;
    if (image) {   // 異步操作: 可能需要時間下載圖片，導致handleResize在圖片載入之前被調用，圖片高度仍不等於寬度。增加判斷確保 handleResize 僅在 image 有值時才執行。
      // 獲取圖片的寬度
      const imageWidth = image.offsetWidth;
      // 將寬度值分配给高度
      image.style.height = imageWidth + "px";
    }
  };

  // // 立即在組件加載時調整照片的高度
  // useEffect(() => {
  //   handleResize();
  // }, []);

  useEffect(() => {
    // 立即在組件加載時調整照片的高度
    handleResize();
    // 添加螢幕大小變化事件監聽器
    window.addEventListener("resize", handleResize);
    // 在組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="mission-img">
      <img ref={imgRef} src={file_path} alt="任務" />
    </div>
  );
}

// 任務卡片（這邊的參數如果忘記設定會讓卡片出不來）
const MissionCard = ({ missionType, missionCity, missionArea, setMissionType, updateDate, setUpdateDate, sortOrder, setSortOrder, sortBy, setSortBy, allMissions, currentData, userId, setUserId, missionActive, missionVariant }) => {

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }

  // 收藏
  const [collection, setCollection] = useState([]); //用來儲存收藏
  const getCollection = () => {
    axios.get(`http://localhost:3005/api/mission/collections/${userId}`)
      .then((response) => {
        setCollection(response.data.result);
        console.log(response.data.result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    if (userId) {   // userId存在時才調用getCollection 避免依賴項userId在組件加載前還沒被設置 觸發無效請求
      getCollection(userId);
    }
  }, [userId]);

  const addCollection = async (mission_id) => {
    // 檢查收藏中是否已經存在具有相同 id 的任務
    const have = collection.find((v) => v.mission_id === mission_id);
    console.log(have);
    // 如果收藏中沒有相同的任務
    if (have === undefined) {
      try {
        // 發送HTTP請求將商品添加到購物車
        const response = await axios.put(
          `http://localhost:3005/api/mission/collections/${userId}`,
          { mission_id }
        );
      } catch (error) {
        console.error("錯誤：", error);
      }
      getCollection(userId)
    }
  };

  const deleteCollection = async (mission_id) => {
    // 檢查收藏中是否已經存在具有相同 id 的商品
    const have = collection.find((v) => v.mission_id === mission_id);
    console.log(have);
    // 如果收藏中有相同的任務
    if (have) {
      try {
        // 發送HTTP請求將任務移除收藏，mission_id 放在 URL 中
        const response = await axios.delete(
          `http://localhost:3005/api/mission/collections/${userId}/${mission_id}`
        );
      } catch (error) {
        console.error("錯誤：", error);
      }
      getCollection(userId);
    }
  };

  const toggleCollection = async (mission_id) => {
    const isMissionInCollection = collection.some((item) => item.mission_id === mission_id);
    // 檢查用戶是否已登入
    if (!userId) {
      alert('請先登入會員');
      return;
    }
    if (isMissionInCollection) {
      await deleteCollection(mission_id);
    } else {
      await addCollection(mission_id);
    }
    getCollection(userId);
  };

  // 初始化每個按鈕的初始hover狀態（空心愛心hover時要替換成實心）
  // 設一個陣列，包含了與 currentData 中任務數量相同數量的布林值false，用來表示每個按鈕的初始 hover 狀態。
  const initialHoverStates = Array(currentData.length).fill(false);
  console.log("initialHoverStates是" + initialHoverStates);
  const [isHovered, setIsHovered] = useState(initialHoverStates);
  console.log("isHovered是" + isHovered)

  // 設置 onMouseEnter 處理程序來處理hover狀態
  const handleMouseEnter = (index) => {
    // 複製原陣列，創建新陣列來表示更新後的狀態
    const newHoverStates = [...isHovered];
    newHoverStates[index] = true;
    setIsHovered(newHoverStates);
  };

  // 設置 onMouseLeave 處理程序來處理取消hover狀態
  const handleMouseLeave = (index) => {
    const newHoverStates = [...isHovered];
    newHoverStates[index] = false;
    setIsHovered(newHoverStates);
  };


  return (
    <>
      {currentData.map((v, i) => {
        return (
          <motion.div className="col-6 col-md-4 col-lg-6 col-xl-4" key={v.mission_id} initial={"initial"}
            animate={
              missionActive === "move"
                ? "move"
                : missionActive === "exit"
                  ? "exit"
                  : missionActive === "all_move"
                    ? "all_move"
                    : "initial"
            }
            variants={missionVariant}
            // (index + 1) % 3 == 1 ? 0 : (index + 1) % 3 == 2 ? 1 : 2 整排移動參數
            custom={i}
            whileInView="singleMove"
            viewport={{
              once: true,
            }}>
            <div className="mission-list-card ">
              <Link href={`/work/find-mission/${v.mission_id}`}>
                <ImageWithEqualDimensions file_path={v.file_path} />
              </Link>
              <div className="mission-content mx-1 mt-2">
                <Link href={`/work/find-mission/${v.mission_id}`}>
                  <div className="title size-6">{v.title}</div>
                  <div className="d-flex justify-content-between mt-1 mb-1">
                    <div className="size-7">
                      <div className="d-flex align-items-center mb-1">
                        <span className="tag-btn mb-1">{(() => {
                          switch (v.mission_type) {
                            case 1:
                              return '到府照顧';
                            case 2:
                              return '安親寄宿';
                            case 3:
                              return '到府美容';
                            case 4:
                              return '行為訓練';
                            case 5:
                              return '醫療護理';
                            default:
                              return '其他';
                          }
                        })()}</span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        <FaLocationDot className="me-1" />
                        {v.city}
                        {v.area}
                      </div>
                      <div className="d-flex align-items-center">
                        <FaRegCalendarCheck className="me-1" />
                        {formatDate(v.update_date)}<span className="update-title d-none d-sm-inline" >（最後更新）</span>
                      </div>
                    </div>
                    {/* <img
                    src={isFavorites[i] ? "/heart-clicked.svg" : "/heart.svg"}
                    alt={isFavorites[i] ? "已收藏" : "未收藏"}
                    onClick={() => toggleFavorite(i)}
                  /> */}
                  </div>
                </Link>
                <div className='d-flex justify-content-between align-items-center price'>
                  <div  >單次<span className='size-6'> NT${v.price}</span></div>
                  {/* <Link href={`/work/find-mission/${v.mission_id}`} >
                    <button className='btn-confirm size-6'>應徵</button>
                  </Link> */}
                  <button className=" heart-btn" onClick={() => toggleCollection(v.mission_id)} onMouseEnter={() => handleMouseEnter(i)}
                    onMouseLeave={() => handleMouseLeave(i)}>
                    {collection.some((item) => item.mission_id === v.mission_id) ? (
                      <>
                        <FaHeart className="fill-icon" />
                      </>
                    ) : (
                      <>
                        {isHovered[i] ? (
                          <FaHeart className="empty-icon-hover" />
                        ) : (
                          <FaRegHeart className="empty-icon" />
                        )}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default function MissionList() {
  // 篩選
  const [missionType, setMissionType] = useState(null);
  const [updateDate, setUpdateDate] = useState(null);
  const [missionCity, setMissionCity] = useState("");
  const [missionArea, setMissionArea] = useState(null);
  // 篩選按鈕文字的狀態
  const [buttonText1, setButtonText1] = useState('任務類型');
  const [buttonText2, setButtonText2] = useState('更新時間');
  // 篩選地區文字的狀態
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  // 排序
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState('post_date');
  // 搜尋
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState("");
  // 用於儲存解析後的userID
  const [userId, setUserId] = useState(null);
  // 右側卡片動畫
  const [missionActive, setMissionActive] = useState("move");

  const [allMissions, setAllMissions] = useState([]);

  const getAllMissions = async () => {
    try {
      let apiUrl = `http://localhost:3005/api/mission/all-missions?sortOrder=${sortOrder}&sortBy=${sortBy}`;

      if (missionType) {
        apiUrl += `&missionType=${missionType}`;
      }
      if (updateDate) {
        apiUrl += `&updateDate=${updateDate}`;
      }
      if (missionCity) {
        apiUrl += `&missionCity=${missionCity}`;
      }
      if (missionArea) {
        apiUrl += `&missionArea=${missionArea}`;
      }
      if (search) {
        apiUrl += `&missionSearch=${search}`;
      }
      const response = await axios.get(apiUrl);
      const data = response.data.data;
      console.log(data);
      setAllMissions(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const missionVariant = {
    // 一開始消失，畫面從下側往上移入出現
    initial: {
      opacity: 0,
      y: 20,
      transition: { duration: 0 },
    },
    // 卡片單張單張移動
    move: (i) => ({
      opacity: 1,
      x: 0,
      y: 0,
      // 動畫持續1秒（開始到結束）每張卡片延遲0.1秒（逐張出現）
      transition: { duration: 1, delay: i * 0.1 },
    }),
    exit: (i) => ({
      opacity: 0,
      y: 20,
      transition: { duration: 0.2 },
    }),
    all_move: {
      opacity: 1,
      x: 0,
      y: 0,
      // 動畫持續1秒（開始到結束）
      transition: { duration: 1 },
    },
  };

  // useEffect(() => {
  //   getAllMissions()
  // }, [missionType, updateDate, missionCity, missionArea, sortOrder, sortBy, search]) // 當篩選方式、排序方式發生變化時重新獲取數據（非常重要要記得！忘記好幾次）
  // 這邊不添加 inputValue 否則在input輸入時就直接即時搜尋

  useEffect(() => {
    (async () => {
      if (!missionType && !missionCity && !missionArea && !updateDate && !search) {
        getAllMissions();
        setMissionActive("move");
      }
      // 當篩選及搜尋時
      else if (missionType || missionCity || missionArea || updateDate || search || sortOrder || sortBy) {

        // 使用 Promise 等待一段時間
        await new Promise((resolve) => {
          // 先退出動畫
          setMissionActive("exit");
          setTimeout(resolve, 300);
        });

        // 切換到初始狀態
        setMissionActive("initial");

        // 執行後端資料獲取
        getAllMissions();

        // 執行進入動畫
        setMissionActive("all_move");
      }
    })();
  }, [missionType, missionCity, missionArea, updateDate, search, sortOrder, sortBy]);

  useEffect(() => {
    // 在allMissions狀態更新後輸出內容
    console.log("allMissions是", allMissions);
  }, [allMissions]);

  // 利用token拿到當前登入的userID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentUserID = decodedToken.id;
        console.log("currentUserID", currentUserID);
        setUserId(currentUserID);
        // 在此處將令牌token添加到請求標頭
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error("解析Token時出錯", error);
      }
    }
  }, []);

  // 分頁
  const itemsPerPage = 18;
  const [activePage, setActivePage] = useState(1);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = allMissions.slice(startIndex, endIndex);
  useEffect(() => {
    // console.log("currentData這頁的資料是", currentData);
  }, [currentData]);



  // 在組件加載時重置篩選條件為默認值
  useEffect(() => {
    setMissionType(null);
    setUpdateDate(null);
    setMissionCity(null);
    setMissionArea(null);
    setSortOrder('asc');
    setSortBy('post_date');
    setInputValue('');
    setSearch("");
    // setSelectedCity(null); // 重置城市选择为 null 或默认值
    // setSelectedArea(null); // 重置地区选择为 null 或默认值
    console.log(`重載後是+http://localhost:3005/api/mission/all-missions?missionType=${missionType}&updateDate=${updateDate}&missionCity=${missionCity}&missionArea=${missionArea}&sortOrder=${sortOrder}&sortBy=${sortBy}&missionSearch=${search}`);
  }, []);

  // 點麵包屑重置所有設定
  const clearSettings = () => {
    setMissionType(null);
    setUpdateDate(null);
    setMissionCity("");
    setMissionArea(null);
    setButtonText1('任務類型');
    setButtonText2('更新時間');
    setSelectedCity(null);
    setSelectedArea(null);
    setSortOrder('asc');
    setSortBy('post_date');
    setInputValue('');
    setSearch("");
    setActivePage(1);
    getAllMissions()
    console.log("狀態變數已重置為預設值");
  };
  const handleClearSettings = () => {
    // 使用 setTimeout 延遲執行 clearSettings 本來沒有寫 但clearSettings要點2次才反應
    setTimeout(() => {
      clearSettings();
    }, 0);
  };



  // 換頁時回到上方
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);


  return (
    <>
      <div className="container my-4 find-mission">
        <nav className="breadcrumb-wrapper" aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">首頁</Link>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <Link href="/work/find-mission" onClick={handleClearSettings}>小貓上工(找任務)</Link>
            </li>
            {search ? (
              <>
                <li className="breadcrumb-item" aria-current="page">
                  搜尋結果
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {search}
                </li>
              </>
            ) : (
              <>
                <li className="breadcrumb-item active" aria-current="page">
                  所有任務
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="d-flex flex-column flex-md-row justify-content-between mt-3">
          <RoleSelection defaultActive="mission" />
          <Search placeholder="搜尋任務" search={search} setSearch={setSearch} setActivePage={setActivePage} inputValue={inputValue} setInputValue={setInputValue} setMissionType={setMissionType} setUpdateDate={setUpdateDate} setMissionCity={setMissionCity} setMissionArea={setMissionArea} setSortOrder={setSortOrder} setSortBy={setSortBy} setButtonText1={setButtonText1} setButtonText2={setButtonText2} setSelectedCity={setSelectedCity} setSelectedArea={setSelectedArea} />
        </div>
        <div className='d-flex justify-content-between align-items-center mt-md-3 mb-md-4 position-relative'>
          <div className='filters d-flex justify-content-center align-items-center '>
            {/* <MobileFilter missionType={missionType} /> */}
            <MyFilter missionType={missionType} setMissionType={setMissionType} missionCity={missionCity} setMissionCity={setMissionCity} missionArea={missionArea} setMissionArea={setMissionArea}
              updateDate={updateDate} setUpdateDate={setUpdateDate} sortOrder={sortOrder} setSortOrder={setSortOrder} sortBy={sortBy} setSortBy={setSortBy} setActivePage={setActivePage} buttonText1={buttonText1} setButtonText1={setButtonText1} buttonText2={buttonText2} setButtonText2={setButtonText2} selectedCity={selectedCity} setSelectedCity={setSelectedCity} selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
            <FilterMobile missionType={missionType} setMissionType={setMissionType} missionCity={missionCity} setMissionCity={setMissionCity} missionArea={missionArea} setMissionArea={setMissionArea}
              updateDate={updateDate} setUpdateDate={setUpdateDate} sortOrder={sortOrder} setSortOrder={setSortOrder} sortBy={sortBy} setSortBy={setSortBy} setActivePage={setActivePage} buttonText1={buttonText1} setButtonText1={setButtonText1} buttonText2={buttonText2} setButtonText2={setButtonText2} selectedCity={selectedCity} setSelectedCity={setSelectedCity} selectedArea={selectedArea} setSelectedArea={setSelectedArea} />
          </div>
          <Link href="/work/create-mission" className="position-absolute add-mission-btn-pc-link">
            <button className="add-mission-btn-pc  d-none d-lg-block btn-confirm ">
              <img src="/add-mission.svg" className="me-1 mb-1" />
              新增
            </button>
          </Link>
          <Link href="/work/create-mission">
            <button className="add-mission-btn-mobile size-6 d-bolck d-lg-none">
              <img src="/add-mission.svg" className="" />
            </button>
          </Link>
        </div>

        <div className='d-flex my-lg-2'>
          <Sort missionType={missionType} setMissionType={setMissionType} missionCity={missionCity} setMissionCity={setMissionCity} missionArea={missionArea} setMissionArea={setMissionArea}
            updateDate={updateDate} setUpdateDate={setUpdateDate} sortOrder={sortOrder} setSortOrder={setSortOrder} sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <section className="d-flex all-mission flex-column flex-lg-row mt-2 mt-lg-3">
          {/* 最新任務桌機 */}
          <div className="latest-mission latest-mission-pc d-none d-lg-flex flex-column mb-3 position-relative">
            <h3 className="size-5  ">最新任務</h3>
            <LatestMission userId={userId} />
            <img src='/job-icon/animation4.gif' className='position-absolute animation-paw' />
          </div>
          {/* 最新任務手機 */}
          <div className="latest-mission latest-mission-mobile d-lg-none mb-3 mt-1">
            <h3 className="size-5">最新任務</h3>
            <MobileLatestMission userId={userId} />
          </div>
          {/* 任務列表 */}
          <div className='mission-list d-lg-flex  justify-content-center align-items-start'>
            {/* 不能使用d-flex d-lg-block block會導致MissionCard垂直排列 */}
            {currentData.length > 0 ? (
              <div className="row d-flex mb-3 g-3 g-md-4">
                {/* 使用g-3 不用justify-content-between 預設是start 卡片就會照順序排列 */}
                <MissionCard sortOrder={sortOrder} sortBy={sortBy} missionType={missionType} setMissionType={setMissionType} missionCity={missionCity} setMissionCity={setMissionCity} missionArea={missionArea} setMissionArea={setMissionArea}
                  updateDate={updateDate} setUpdateDate={setUpdateDate} allMissions={allMissions} currentData={currentData} userId={userId} setUserId={setUserId} missionActive={missionActive} missionVariant={missionVariant} />
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center flex-column mt-5">
                {/* <img src='/job-icon/no-data-2.gif' /> */}
                <p>無符合條件任務，建議放寬條件重新查詢！</p>
                <img src='/job-icon/search-cat.gif' />
              </div>
            )}
          </div>
        </section>
        <Pagination itemsPerPage={itemsPerPage} total={allMissions} activePage={activePage} setActivePage={setActivePage} />
      </div>
    </>
  );
}