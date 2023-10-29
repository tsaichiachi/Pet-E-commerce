import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Filter from "../../../components/job/filter";
import LatestMission from "../../../components/job/latest-mission";
import RoleSelection from "../../../components/job/role-selection";
import { Swiper, SwiperSlide } from "swiper/react";
import useRWD from "@/hooks/useRWD";
import { register } from "swiper/element/bundle";
import { Carousel } from "@trendyol-js/react-carousel";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import {
  BsArrowBarRight,
  BsFillHeartFill,
  BsHeart,
  BsTrashFill,
  BsTrash,
} from "react-icons/bs";

import { FaUserClock } from "react-icons/fa";
import { ImLocation2 } from "react-icons/im";
import WorkService from "@/services/work-service";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { Pagination } from "antd";
import { BiSearchAlt } from "react-icons/bi";
import "animate.css";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
// import {
//   ScrollMotionContainer,
//   ScrollMotionItem,
// } from "@/components/ScrollMotion";
register();
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Tune } from "@mui/icons-material";
import { SideSheet, Button } from "@douyinfe/semi-ui";
import workService from "@/services/work-service";
import { useHelper } from "@/context/helperContext";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  useInView,
} from "framer-motion";
// import useLoader from "@/hooks/use-loader";

const Search = ({
  handleSearch,
  placeholder,
  color,
  onClick,
  search,
  setSearch,
  setFilterType,
}) => {
  const rippleBtnRef = useRef(null);
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
        type="text"
        placeholder={"搜尋小幫手"}
        value={search}
        onChange={(e) => {
          console.log(e.target.value);
          setSearch(e.target.value);
        }}
        onKeyDown={(e) => {
          // console.log(e);
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button
        onClick={() => {
          handleRipple();
          handleSearch();
        }}
        ref={rippleBtnRef}
      >
        <BiSearchAlt className="job-search-icon" />
      </button>
    </div>
  );
};
const MobileFilter = ({
  allHelpers,
  setAllHelpers,
  filterType,
  setFilterType,
  order,
  setOrder,
  setPage,
  setTotalRows,
  setCurrentSearch,
  helperControl,
  setHelperActive,
}) => {
  const [titleContent, setTitleContent] = useState("服務類型");
  const handleType = (value) => {
    // 改變filterType類型時，清除search值(如果有search值的話filter改變不會重新打API)、page值回到1，重設filter打API改變info
    setPage(1);
    setCurrentSearch(null);
    setFilterType(value);
  };
  const handleOrder = async (value, parentValue) => {
    setPage(1);
    setOrder({ value, parentValue });
    await new Promise((resolve, reject) => {
      setHelperActive("exit");
      setTimeout(() => {
        resolve();
      }, 600);
    });
    setHelperActive("initial");
    WorkService.getOrderHelper(filterType, parentValue, value, 1)
      .then((response) => {
        console.log(response);
        setAllHelpers(response?.data.data);
        setTotalRows(response?.data?.totalRows);
        setHelperActive("move");
      })
      .catch((e) => {
        console.log(e);
      });
  };
  useEffect(() => {
    // useEffect監聽filterType的狀態，透過狀態來更新title的名稱
    switch (filterType) {
      case "all":
        setTitleContent("服務類型");
        break;
      case "feed":
        setTitleContent("到府代餵");
        break;
      case "house":
        setTitleContent("安親寄宿");
        break;
      case "beauty":
        setTitleContent("到府美容");
        break;
    }
  }, [filterType]);

  return (
    <Swiper slidesPerView="auto" className="mobile-filter">
      <SwiperSlide>
        <Filter
          items={{
            title: titleContent,
            value: "type",
            children: [
              { label: "到府代餵", value: "feed" },
              { label: "安親寄宿", value: "house" },
              { label: "到府美容", value: "beauty" },
            ],
          }}
          src={"/job-icon/plus-service.svg"}
          onClick={handleType}
          order={order}
          filterType={filterType}
          helperControl={helperControl}
          // handleHelperAnimate={handleHelperAnimate}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Filter
          items={{
            title: "服務費用",
            value: "price",
            children: [
              { label: "由高到低", value: "DESC" },
              { label: "由低到高", value: "ASC" },
            ],
          }}
          src={"/job-icon/Heart-price.svg"}
          onClick={handleOrder}
          order={order}
          helperControl={helperControl}
          // handleHelperAnimate={handleHelperAnimate}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Filter
          items={{
            title: "熱門程度",
            value: "hot",
            children: [
              { label: "由高到低", value: "DESC" },
              { label: "由低到高", value: "ASC" },
            ],
          }}
          src={"/job-icon/Discovery-date.svg"}
          onClick={handleOrder}
          order={order}
          helperControl={helperControl}
          // handleHelperAnimate={handleHelperAnimate}
        />
      </SwiperSlide>
      <SwiperSlide>
        <Filter
          items={{
            title: "服務評價",
            value: "rating",
            children: [
              { label: "由高到低", value: "DESC" },
              { label: "由低到高", value: "ASC" },
            ],
          }}
          src={"/job-icon/Discovery-date.svg"}
          onClick={handleOrder}
          order={order}
          helperControl={helperControl}
          // handleHelperAnimate={handleHelperAnimate}
        />
      </SwiperSlide>
    </Swiper>
  );
};
const FamousHelperCard = ({
  helper,
  collection,
  setCollection,
  famousControl,
  index,
  famousState,
  isActive,
  famousRef,
}) => {
  // const [isFavorite, setIsFavorite] = useState(false); // 初始狀態為未收藏
  const [isFavHovered, setIsFavHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isLoading, setIsLoading } = useHelper();
  const [lowerPrice, setLowerPrice] = useState(0);
  const router = useRouter();
  const service = [
    { label: "到府代餵", value: parseInt(helper.feed_service) },
    { label: "安親寄宿", value: parseInt(helper.house_service) },
    { label: "到府美容", value: parseInt(helper.beauty_service) },
  ];
  const value = [helper.feed_price, helper.house_price, helper.beauty_price];
  const handleFav = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      if (!collection.find((item) => item === helper.user_id)) {
        e.currentTarget.classList.add(
          "animate__animated",
          "animate__heartBeat"
        );
        setCollection((prev) => {
          return [...prev, helper.user_id];
        });
      } else {
        e.currentTarget.classList.remove(
          "animate__animated",
          "animate__heartBeat"
        );
        setCollection((prev) => {
          const newArr = prev.filter((item) => item !== helper.user_id);
          console.log(newArr);
          return newArr;
        });
      }
    } else {
      alert("請先登入會員");
      router.push("/member/login");
    }
  };
  useEffect(() => {
    // 取得最低金額的服務價格
    let value = [];
    if (helper.feed_service == 1) {
      value.push(helper.feed_price);
    }
    if (helper.house_service == 1) {
      value.push(helper.house_price);
    }
    if (helper.beauty_service == 1) {
      value.push(helper.beauty_price);
    }
    console.log(value);
    const newValue = value.sort();
    setLowerPrice(newValue[0]);
  }, [helper]);
  return (
    <>
      {/* <AnimatePresence> */}
      <motion.div
        ref={famousRef}
        custom={index}
        variants={famousState}
        initial={"initial"}
        animate={
          isActive === "move"
            ? "move"
            : isActive === "exit"
            ? "exit"
            : "initial"
        }
        exit={"exit"}
        className={`famous-helper-card d-flex align-items-center ${
          collection.find((item) => item === helper.user_id)
            ? ""
            : "active-fav-in-fam-card"
        }`}
        onClick={() => {
          router.push(`/work/find-helper/${helper.user_id}`);
        }}
      >
        <div className="img-wrapper">
          <img
            className="famous-helper-card-img"
            src={helper?.cover_photo}
            alt="任務"
          />
        </div>

        <div className="famous-helper-content ms-2">
          <div className="famous-helper-content-title size-6">
            {helper?.name}
          </div>

          <div className="famous-helper-content-info d-flex justify-content-between">
            <div>
              <div className="service-items m-size-7">
                {service
                  .filter((item) => item.value != 0)
                  .map((item, index, arr) =>
                    index < arr.length - 1 ? (
                      <span className="tag-btns">{item.label}</span>
                    ) : (
                      <span className="tag-btns">{item.label}</span>
                    )
                  )}
              </div>
              <p className="service-time m-size-7">
                <FaUserClock />
                服務時間：<span>周一至周日</span>
              </p>

              <p className="m-size-7 service-county">
                <ImLocation2 />
                {helper.service_county}
              </p>
              <div className="ranking d-flex">
                <Rating
                  name="half-rating-read"
                  value={parseFloat(helper?.average_star)}
                  precision={0.5}
                  readOnly
                  emptyIcon={<StarIcon style={{ opacity: 0.35 }} />}
                />
                <span className="ms-1 size-7">({helper.review_count})</span>
              </div>
            </div>
            <div className="fav-icon">
              {isFavHovered ||
              collection.find((item) => item === helper.user_id) ? (
                <BsFillHeartFill
                  className="fav-icon-fill"
                  onClick={handleFav}
                  onMouseEnter={() => {
                    setIsFavHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsFavHovered(false);
                  }}
                />
              ) : (
                <BsHeart
                  className="fav-icon-hollow"
                  onMouseEnter={() => {
                    setIsFavHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsFavHovered(false);
                  }}
                />
              )}
            </div>
          </div>
          <div className="d-flex align-items-end price">
            <span className="size-5">NT${lowerPrice}</span>
            <span>起</span>
          </div>
        </div>
      </motion.div>
      {/* </AnimatePresence> */}
    </>
  );
};
const MobileFamousHelper = ({
  famous,
  setFamous,
  collection,
  setCollection,
}) => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperContainer = swiperRef.current;
    const params = {
      navigation: true,
      injectStyles: [
        `
          .swiper-button-next,
          .swiper-button-prev {
            background-color: #FFFDFB;
            width:32px;
            height:32px;
            border-radius: 50%;
            color: #F8CB9F;
            box-shadow: 0 0 9px rgba(0, 0, 0, 0.5);
            background-position: center;
            background-size: 18px;
            background-repeat: no-repeat; 
            // opacity:0.5;          
          }
          
          .swiper-button-prev {
            background-image: url("/caret-left.svg");

          }
          .swiper-button-next {
            background-image: url("/caret-right.svg");    
          }
          .swiper-button-next svg,
          .swiper-button-prev svg {
            color: transparent;
          }
      `,
      ],
    };

    Object.assign(swiperContainer, params);
    swiperContainer.initialize();
  }, []);
  return (
    <>
      <>
        <swiper-container
          ref={swiperRef}
          navigation="true"
          space-between="20"
          slides-per-view="auto"
          next-el=".custom-next-button"
          prev-el=".custom-prev-button"
          init="false"
        >
          {famous.map((helper) => (
            <swiper-slide key={helper.user_id}>
              <FamousHelperCard
                helper={helper}
                collection={collection}
                setCollection={setCollection}
              />
            </swiper-slide>
          ))}
        </swiper-container>
      </>
    </>
  );
};
const SingleHelperCard = ({
  helper,
  collection,
  setCollection,
  helperControl,
  helperVariant,
  index,
  // handleHelperAnimate,
}) => {
  const [isFavHovered, setIsFavHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { setIsLoading } = useHelper();
  const router = useRouter();
  const imgRef = useRef(null);
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [lowerPrice, setLowerPrice] = useState(0);

  const service = [
    { label: "到府代餵", value: parseInt(helper.feed_service) },
    { label: "安親寄宿", value: parseInt(helper.house_service) },
    { label: "到府美容", value: parseInt(helper.beauty_service) },
  ];
  const handleFav = (e) => {
    e.stopPropagation();
    if (isAuthenticated) {
      if (!collection.find((item) => item === helper.user_id)) {
        e.currentTarget.classList.add(
          "animate__animated",
          "animate__heartBeat"
        );
        setCollection((prev) => {
          return [...prev, helper.user_id];
        });
      } else {
        e.currentTarget.classList.remove(
          "animate__animated",
          "animate__heartBeat"
        );
        setCollection((prev) => {
          const newArr = prev.filter((item) => item !== helper.user_id);
          console.log(newArr);
          return newArr;
        });
      }
    } else {
      alert("請先登入會員");
      router.push("/member/login");
    }
  };

  // 使得圖片高度會在螢幕大小改變時跟著改變 而非在重整時才改變

  const handleResize = () => {
    // 獲取圖片元素的引用
    const image = imgRef.current;
    // 獲取圖片的寬度
    const imageWidth = image.offsetWidth;
    // 將寬度值分配给高度
    image.style.height = imageWidth + "px";
  };
  useEffect(() => {
    handleResize();
    // 添加螢幕大小變化事件監聽器
    window.addEventListener("resize", handleResize);
    // 在組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // 取得最低金額的服務價格
    let value = [];
    if (helper.feed_service == 1) {
      value.push(helper.feed_price);
    }
    if (helper.house_service == 1) {
      value.push(helper.house_price);
    }
    if (helper.beauty_service == 1) {
      value.push(helper.beauty_price);
    }
    // console.log(value);
    const newValue = value.sort();
    setLowerPrice(newValue[0]);
  }, [helper]);

  return (
    <>
      <motion.div
        className={`single-card d-flex flex-column align-items-center justify-content-between ${
          collection.find((item) => item === helper.user_id)
            ? ""
            : "active-fav-in-card"
        }`}
        onClick={() => {
          router.push(`/work/find-helper/${helper.user_id}`);
        }}
      >
        <img
          // layout
          className="single-card-img"
          src={helper.cover_photo}
          alt="貓頭貼"
          ref={imgRef}
        />
        <div
          // layout
          className="single-card-content d-flex flex-column justify-content-start"
        >
          <div className="single-card-title size-6">{helper.name}</div>
          <div className="single-card-info d-flex justify-content-between">
            <div>
              <div className="service-items m-size-7">
                {service
                  .filter((item) => item.value != 0)
                  .map((item, index, arr) =>
                    index < arr.length - 1 ? (
                      <span className="tag-btns">{item.label}</span>
                    ) : (
                      <span className="tag-btns">{item.label}</span>
                    )
                  )}
              </div>
              <p className="service-time m-size-7">
                <FaUserClock />
                服務時間：<span>周一至周日</span>
              </p>

              <p className="m-size-7 service-county">
                <ImLocation2 />
                {helper.service_county}
              </p>
            </div>

            <div className="fav-icon">
              {isFavHovered ||
              collection.find((item) => item === helper.user_id) ? (
                <BsFillHeartFill
                  className="fav-icon-fill"
                  uid={helper.user_id}
                  onClick={handleFav}
                  onMouseEnter={() => {
                    setIsFavHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsFavHovered(false);
                  }}
                />
              ) : (
                <BsHeart
                  className="fav-icon-hollow"
                  onMouseEnter={() => {
                    setIsFavHovered(true);
                  }}
                  onMouseLeave={() => {
                    setIsFavHovered(false);
                  }}
                />
              )}
            </div>
          </div>

          <div className="d-flex justify-content-start align-items-end ">
            <Rating
              name="half-rating-read"
              value={parseFloat(helper.average_star)}
              precision={0.5}
              readOnly
              emptyIcon={<StarIcon style={{ opacity: 0.35 }} />}
            />
            <span className="ms-1 size-7">
              ({helper.review_count === null ? "0" : helper.review_count})
            </span>
          </div>
        </div>
        <div className="single-card-footer">
          <div className="d-flex align-items-end price">
            <span className="size-5">NT${lowerPrice}</span>
            <span>起</span>
          </div>
        </div>
      </motion.div>
    </>
  );
};
const Collection = ({ collection, setCollection }) => {
  const [visible, setVisible] = useState(false);
  const [favInfo, setFavInfo] = useState([]);
  const change = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    WorkService.getFavHelpers(collection)
      .then((response) => {
        // console.log(response.data.results);
        if (response.data.results.length > 0) {
          setFavInfo(response.data.results);
        } else {
          setFavInfo(response.data.results);
          setVisible(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [collection]);

  return (
    <div className="d-none d-lg-flex">
      <div className="favHelperBox">
        <Button onClick={change}>幫手收藏</Button>
      </div>

      <SideSheet
        className="favorite-helper-sidesheet"
        title={
          <button
            onClick={() => {
              setCollection([]);
            }}
          >
            清除全部
          </button>
        }
        visible={visible}
        onCancel={change}
      >
        {favInfo.map((helper) => (
          <FavCard
            key={helper.user_id}
            helper={helper}
            collection={collection}
            setCollection={setCollection}
          />
        ))}
      </SideSheet>
    </div>
  );
};
const FavCard = ({ helper, collection, setCollection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lowerPrice, setLowerPrice] = useState(0);
  const value = [helper.feed_price, helper.house_price, helper.beauty_price];
  const service = [
    { label: "到府代餵", value: parseInt(helper.feed_service) },
    { label: "安親寄宿", value: parseInt(helper.house_service) },
    { label: "到府美容", value: parseInt(helper.beauty_service) },
  ];

  useEffect(() => {
    // 取得最低金額的服務價格
    let value = [];
    if (helper.feed_service == 1) {
      value.push(helper.feed_price);
    }
    if (helper.house_service == 1) {
      value.push(helper.house_price);
    }
    if (helper.beauty_service == 1) {
      value.push(helper.beauty_price);
    }
    console.log(value);
    const newValue = value.sort();
    setLowerPrice(newValue[0]);
  }, [helper]);
  return (
    <div className={`famous-helper-card d-flex align-items-center`}>
      <div className="img-wrapper">
        <img
          className="famous-helper-card-img"
          src={helper?.cover_photo}
          alt="任務"
        />
      </div>

      <div className="helper-content ms-2">
        <div className="title size-6">{helper?.name}</div>
        <div className="ranking d-flex">
          <Rating
            name="half-rating-read"
            value={parseFloat(helper?.average_star)}
            precision={0.5}
            readOnly
            emptyIcon={<StarIcon style={{ opacity: 0.35 }} />}
          />
          <span className="ms-1 size-7">
            ({helper.review_count ? helper.review_count : 0})
          </span>
        </div>
        <div className="helper-content-info d-flex justify-content-between">
          <div>
            <p className="m-size-7">{helper?.service_county}</p>
            <div className="service-items m-size-7">
              {service
                .filter((item) => item.value != 0)
                .map((item, index, arr) =>
                  index < arr.length - 1 ? (
                    <span className="tag-btns">{item.label}</span>
                  ) : (
                    <span className="tag-btns">{item.label}</span>
                  )
                )}
            </div>
            <p className="m-size-7">
              服務時間：<span>周一至周日</span>
            </p>
          </div>
        </div>
        <div className="d-flex align-items-end price">
          <span className="size-5">NT$140</span>
          <span>起</span>
        </div>
      </div>
      <div className="dlt-icon">
        <BsTrash
          className={isHovered ? "d-none dlt-icon-hollow" : "dlt-icon-hollow"}
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onClick={() => {}}
        />
        <BsTrashFill
          className={!isHovered ? "d-none dlt-icon-fill" : "dlt-icon-fill"}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          onClick={() => {
            setCollection((prev) => {
              const newCol = prev.filter((item) => item != helper.user_id);
              console.log(newCol);
              return newCol;
            });
          }}
        />
      </div>
    </div>
  );
};
const MissionHelperList = () => {
  const arr = Array.from({ length: 12 });
  const router = useRouter();
  const [allHelpers, setAllHelpers] = useState(null);
  const [famous, setFamous] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [order, setOrder] = useState(null);
  const [search, setSearch] = useState(null);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [currentPage, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [tempTotalRows, setTempTotalRows] = useState(0); //用來佔存回到handleback時要恢復成所有筆數
  const { collection, setCollection } = useHelper();
  const { isAuthenticated, userId } = useAuth();
  const helperControl = useAnimationControls();
  const famousControl = useAnimationControls();
  const { isLoading, setIsLoading } = useHelper();
  const [isActive, setIsActive] = useState("move");
  const [helpActive, setHelperActive] = useState("move");
  const [firstLoad, setFirstLoad] = useState(true); //用來判斷是否初次加載，式的話就不進行famousCard的篩選動畫
  // const { showLoader, hideLoader, loader, loading, loadingText } =
  //   useLoader(50);
  const helperVariant = {
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
      transition: { duration: 0.4, delay: i * 0.2 },
    }),
    exit: (i) => ({
      opacity: 0,
      y: 20,
      transition: { duration: 0.1 },
    }),
  };

  const famousState = {
    initial: { y: 50, x: 0, opacity: 0, transition: { duration: 0.1 } },
    move: (i) => ({
      y: 0,
      x: 0,
      opacity: 1,
      transition: { layout: { duration: 0.4 }, duration: 1, delay: i * 0.2 },
    }),
    exit: (i) => ({
      x: -100,
      y: 0,
      opacity: 0,
      transition: { duration: 0.18, delay: i * 0.15 },
    }),
  };
  const famousRef = useRef(null);

  // useEffect(() => {

  // }, [isActive]);
  console.log(isActive, helpActive);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    // showLoader();
    (async () => {
      // 使用一個promise先等待exit動畫完成再做後續的更新資料跟move動畫
      if (!currentSearch) {
        if (!firstLoad) {
          await new Promise((resolve, reject) => {
            setIsActive("exit");
            setHelperActive("exit");
            setTimeout(() => {
              resolve();
            }, 600);
          });
          setIsActive("initial");
          setHelperActive("initial");
        }
        setPage(1);
        if (order) {
          WorkService.getOrderHelper(
            filterType,
            order.parentValue,
            order.value,
            currentPage
          )
            .then((response) => {
              console.log(response);
              setAllHelpers(response?.data?.data);
              setTotalRows(response?.data?.totalRows);
              setHelperActive("move");
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          if (firstLoad) {
            // 第一次加載所有資訊時先存所有的資料筆數tempTotalRows
            WorkService.getAllHelpers(filterType, 1)
              .then((response) => {
                setAllHelpers(response?.data?.data);
                setTotalRows(response?.data?.totalRows);
                setTempTotalRows(response?.data?.totalRows);
                setFirstLoad(false);
                setHelperActive("move");
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            WorkService.getAllHelpers(filterType, 1)
              .then((response) => {
                setAllHelpers(response?.data?.data);
                setTotalRows(response?.data?.totalRows);
                setHelperActive("move");
              })
              .catch((e) => {
                console.log(e);
              });
          }
        }
        WorkService.getFamousHelper(filterType)
          .then((response) => {
            console.log("famous", response?.data.famous);
            setFamous(response?.data.famous);
            setIsActive("move");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })();
  }, [filterType]);

  // useEffect(() => {
  //   (async () => {
  //     await famousControl.start("exit");
  //     await famousControl.start("initial");
  //     await famousControl.start("move");
  //   })();
  // }, [filterType]);

  useEffect(() => {
    (async () => {
      // await new Promise((resolve, reject) => {
      //   setHelperActive("exit");
      //   setTimeout(() => {
      //     resolve();
      //   }, 600);
      // });
      setHelperActive("initial");
      if (order) {
        WorkService.getOrderHelper(
          filterType,
          order.parentValue,
          order.value,
          currentPage
        )
          .then((response) => {
            console.log(response);
            // setTimeout(() => {}, [200]);
            setAllHelpers(response?.data?.data);
            setTotalRows(response?.data?.totalRows);
            setHelperActive("move");
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        WorkService.getAllHelpers(filterType, currentPage)
          .then((response) => {
            // setTimeout(() => {}, [200]);
            setAllHelpers(response?.data?.data);
            setTotalRows(response?.data?.totalRows);
            setHelperActive("move");
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })();
  }, [currentPage]);

  useEffect(() => {
    // 更新localStorage的收藏
    if (collection.length === 0) {
      localStorage.removeItem("helperFav");
    } else {
      localStorage.setItem("helperFav", JSON.stringify(collection));
    }
  }, [collection]);
  const handleBack = () => {
    setFilterType("all");
    setPage(1);
    setOrder(null);
    setCurrentSearch(null);
    setTotalRows(tempTotalRows);
    WorkService.getAllHelpers(filterType, currentPage)
      .then((response) => {
        setAllHelpers(response?.data?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const changePage = (page) => {
    console.log("Page: ", page);
    setPage(page);
  };
  const handleSearch = async () => {
    WorkService.getSearchHelper(search)
      .then((response) => {
        // 查詢時，清除各種state設定值
        // console.log(response);
        // setTimeout(() => {}, [200]);
        setAllHelpers(response?.data?.data);
        setPage(1);
        setTotalRows(response?.data?.totalRows);
        setCurrentSearch(search);
        setSearch("");
        setFilterType("all");
        setOrder(null);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleExit = async () => {
    await Promise.all([
      famousControl.start("exit"),
      helperControl.start("exit"),
    ]);
    await Promise.all([
      famousControl.start("initial"),
      helperControl.start("initial"),
    ]);
    await Promise.all([
      famousControl.start("move"),
      helperControl.start("singleMove"),
    ]);
  };

  const handleMove = async () => {
    famousControl.start("move");
    helperControl.start("singleMove");
    // helperControl.start("exit"), helperControl.start("exit");
  };
  // useEffect(() => {
  //   if (!firstLoad) {
  //     setTimeout(() => {
  //       setIsActive("exit");
  //     }, 0);
  //     setTimeout(() => {
  //       setIsActive("initial");
  //     }, 2000);
  //     setTimeout(() => {
  //       setIsActive("move");
  //     }, 2500);
  //   } else {
  //     setFirstLoad(false);
  //     return;
  //   }
  // }, [filterType]);
  // useEffect(() => {
  //   setIsActive("move");
  // }, [search]);

  // setHelperActive("move");
  // setIsActive("move");

  return (
    <>
      {/* {" "}
      <>{loader()}</> */}
      <div className="mission-helper-list container">
        <nav className="breadcrumb-wrapper my-4 " aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link
                href="/"
                className="active-hover"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/");
                }}
              >
                首頁
              </Link>
            </li>
            <li class="breadcrumb-item" aria-current="page">
              <Link
                href="/work/find-helper"
                className="active-hover"
                onClick={(e) => {
                  e.preventDefault();
                  handleBack();
                  router.push("/work/find-helper");
                }}
              >
                小貓上工(找幫手)
              </Link>
            </li>
            {currentSearch ? (
              <>
                <li class="breadcrumb-item" aria-current="page">
                  搜尋結果
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {currentSearch}
                </li>
              </>
            ) : (
              <>
                <li class="breadcrumb-item active" aria-current="page">
                  {filterType === "feed"
                    ? "到府代餵"
                    : filterType === "house"
                    ? "安親寄宿"
                    : filterType === "beauty"
                    ? "到府美容"
                    : "所有"}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="search d-flex flex-md-row flex-column justify-content-between align-items-center ">
          <RoleSelection defaultActive="helper" />
          <Search
            placeholder={"搜尋小幫手"}
            handleSearch={handleSearch}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="filters">
          <MobileFilter
            allHelpers={allHelpers}
            setAllHelpers={setAllHelpers}
            filterType={filterType}
            setFilterType={setFilterType}
            order={order}
            setOrder={setOrder}
            setPage={setPage}
            setTotalRows={setTotalRows}
            setCurrentSearch={setCurrentSearch}
            helperControl={helperControl}
            setHelperActive={setHelperActive}
            // handleHelperAnimate={handleHelperAnimate}
          />
        </div>
        {isAuthenticated && (
          <Collection collection={collection} setCollection={setCollection} />
        )}

        <div className="mb-2 order-text">
          <p className="size-6 m-size-6 d-flex justify-content-end align-items-center me-2">
            {order?.parentValue === "price" &&
              (order?.value === "ASC" ? (
                <>
                  服務費用 <BsArrowBarRight /> 由低到高
                </>
              ) : (
                <>
                  服務費用 <BsArrowBarRight /> 由高到低
                </>
              ))}
          </p>
          <p className="size-6 m-size-6 d-flex justify-content-end align-items-center me-2 ">
            {order &&
              order?.parentValue === "hot" &&
              (order?.value === "ASC" ? (
                <>
                  熱門程度 <BsArrowBarRight /> 由低到高
                </>
              ) : (
                <>
                  熱門程度 <BsArrowBarRight /> 由高到低
                </>
              ))}
          </p>
          <p className="size-6 m-size-6 d-flex justify-content-end align-items-center me-2 ">
            {order?.parentValue === "rating" &&
              (order?.value === "ASC" ? (
                <>
                  服務評價 <BsArrowBarRight /> 由低到高
                </>
              ) : (
                <>
                  服務評價 <BsArrowBarRight /> 由高到低
                </>
              ))}
          </p>
        </div>

        <div className="d-flex flex-lg-row flex-column align-items-start justify-content-between gap-lg-5 gap-sm-4 gap-4">
          <section className="famous-helper">
            <p className="famous-helper-title size-5">熱門小幫手</p>
            <div className="famous-helper-pc d-lg-block d-none">
              <AnimatePresence>
                {famous.map((helper, index) => (
                  <FamousHelperCard
                    // key={helper.user_id}
                    helper={helper}
                    collection={collection}
                    setCollection={setCollection}
                    famousControl={famousControl}
                    index={index}
                    famousState={famousState}
                    isActive={isActive}
                    famousRef={famousRef}
                  />
                ))}
              </AnimatePresence>
            </div>
            <div className="famous-helper-mobile d-block d-lg-none">
              <MobileFamousHelper
                famous={famous}
                setFamous={setFamous}
                collection={collection}
                setCollection={setCollection}
              />
            </div>
          </section>

          {allHelpers && (
            <div
              // element="section"
              className="helper-list d-flex flex-wrap"
              // initial="ini"
            >
              {/* <AnimatePresence> */}
              {allHelpers?.map((helper, index) => (
                <motion.div
                  className="card-wrapper"
                  // layout
                  // ref={ref}
                  initial={"initial"}
                  animate={
                    helpActive === "move"
                      ? "move"
                      : helpActive === "exit"
                      ? "exit"
                      : "initial"
                  }
                  variants={helperVariant}
                  // (index + 1) % 3 == 1 ? 0 : (index + 1) % 3 == 2 ? 1 : 2 整排移動參數
                  custom={index}
                  whileInView="singleMove"
                  viewport={{
                    once: true,
                  }}
                >
                  <SingleHelperCard
                    // key={helper.user_id}
                    helper={helper}
                    collection={collection}
                    setCollection={setCollection}
                    helperControl={helperControl}
                    index={index}
                    // helperVariant={helperVariant}
                  />
                </motion.div>
              ))}
              {/* </AnimatePresence> */}
            </div>
          )}
        </div>
        <Pagination
          current={currentPage}
          total={totalRows}
          pageSize="18"
          showSizeChanger={false}
          rootClassName="cos-pagination"
          onChange={changePage}
        />
      </div>
    </>
  );
};

export default MissionHelperList;
