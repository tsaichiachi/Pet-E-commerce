import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LuCalendarClock } from "react-icons/lu";
import { BiMessageRounded } from "react-icons/bi";
import { PiPawPrintFill } from "react-icons/pi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import Footer from "@/components/footer";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Scrollbar, Navigation } from "swiper/modules";
// import function to register Swiper custom elements
import { register } from "swiper/element/bundle";
import workService from "@/services/work-service";
import { GoStarFill } from "react-icons/go";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useAuth } from "@/context/fakeAuthContext";
import { useHelper } from "@/context/helperContext";
import { Pagination } from "antd";
// import { Button, Modal } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import {
  DatePicker,
  Modal,
  Button,
  RadioGroup,
  Radio,
  Empty,
  Select,
} from "@douyinfe/semi-ui";
import {
  IllustrationConstruction,
  IllustrationConstructionDark,
} from "@douyinfe/semi-illustrations";
import {
  ScrollMotionContainer,
  ScrollMotionItem,
} from "@/components/ScrollMotion";

import dayjs from "dayjs";
import { set } from "react-hook-form";
// register Swiper custom elements
register();
const ImageSwiper = ({ images }) => {
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
            width:45px;
            height:45px;
            border-radius: 50%;
            color: #F8CB9F;
            box-shadow: 0 0 9px rgba(0, 0, 0, 0.5);
            background-size: 22px;
            background-repeat: no-repeat;
          }

          .swiper-button-prev {
            background-image: url("/job-icon/angle-left-solid.svg");
            background-position: 10px 5px;

          }
          .swiper-button-next {
            background-image: url("/job-icon/angle-right-solid.svg"); 
            background-position: 12px 4px;  
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
      <swiper-container
        ref={swiperRef}
        navigation="true"
        space-between="20"
        slides-per-view="auto"
        next-el=".custom-next-button"
        prev-el=".custom-prev-button"
        init="false"
      >
        {images.map((image, index) => (
          <swiper-slide>
            <img src={`${image.file_path}`} />
          </swiper-slide>
        ))}
      </swiper-container>
    </>
  );
};

const Quotation = () => {
  const router = useRouter();
  const { uid } = router.query;
  const today = dayjs();
  const [visible, setVisible] = useState(false);
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [serviceList, setServiceList] = useState([]);
  const [formClear, setFormClear] = useState(false);
  // const [petsName, setPetsName] = useState(null);
  const { userId, isAuthenticated } = useAuth();
  const showDialog = () => {
    if (isAuthenticated) {
      setVisible(true);
    } else {
      alert("請先登入會員");
      router.push("/member/login");
    }
  };

  const handleSubmit = () => {
    setVisible(false);
    const requestData = {
      customer_id: userId,
      startDay,
      endDay,
      days,
      pet_id: petsValue,
      helper_id: uid,
      service_type: serviceType.value,
      time,
      frequency,
      note,
      location,
      subtotal: serviceType.price,
    };
    workService
      .createReqOrder(requestData)
      .then((response) => {
        console.log(response.data);
        if (response.data.status === 200 && response.data.data) {
          setTime(1);
          setFrequency(1);
          setDays(0);
          setStartDay(null);
          setEndDay(null);
          setPetsValue(null);
          setServiceType({});
          setNote("");
          setLocation("");
          // alert("預約成功!");
          Swal.fire({
            position: "center",
            icon: "success",
            title: "預約成功!",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleCancel = () => {
    setVisible(false);
  };
  const handleAfterClose = () => {
    console.log("After Close callback executed");
  };

  const [time, setTime] = useState(1);
  const [frequency, setFrequency] = useState(1);
  const [days, setDays] = useState(0);
  const [startDay, setStartDay] = useState(null);
  const [endDay, setEndDay] = useState(null);
  const [petsValue, setPetsValue] = useState(null);
  const [serviceType, setServiceType] = useState({});
  const [note, setNote] = useState("");
  const [location, setLocation] = useState("");
  const [pets, setPets] = useState([]);
  useEffect(() => {
    if (startDay && endDay) {
      const start = dayjs(startDay);
      const end = dayjs(endDay);
      setDays(end.diff(start, "day") + 1);
      console.log(days);
    } else {
      setDays(0);
    }
  }, [startDay, endDay]);

  useEffect(() => {
    workService
      .getHelperDetail(uid)
      .then((response) => {
        const info = response?.data?.data.profile[0];
        setProfile(info);

        let serviceArr = [{ value: "null", label: "請選擇服務類型", price: 0 }];
        if (info.feed_service) {
          serviceArr.push({
            value: "feed",
            label: "到府代餵",
            price: info.feed_price,
          });
        }
        if (info.beauty_service) {
          serviceArr.push({
            value: "beauty",
            label: "到府美容",
            price: info.beauty_price,
          });
        }
        if (info.house_service) {
          serviceArr.push({
            value: "house",
            label: "安親寄宿",
            price: info.house_price,
          });
        }
        setServiceList(serviceArr);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [uid]);
  useEffect(() => {
    workService
      .getPetInfo(userId)
      .then((response) => {
        setPets(response?.data?.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [userId]);

  useEffect(() => {
    if (
      !startDay ||
      !endDay ||
      !days ||
      !petsValue ||
      !serviceType.value ||
      !time ||
      !frequency ||
      !note ||
      !location
    ) {
      setFormClear(false);
    } else {
      setFormClear(true);
    }
  }, [
    startDay,
    endDay,
    days,
    petsValue,
    serviceType,
    time,
    frequency,
    note,
    location,
  ]);
  const handleDisabledStart = (date) => {
    if (dayjs(date).isBefore(today)) {
      return true;
    }
  };
  const handleDisabledEnd = (date) => {
    if (dayjs(date).isBefore(today)) {
      return true;
    }
    if (startDay && dayjs(date).isBefore(startDay)) {
      return true;
    }
  };
  const handleTime = (e) => {
    const position = e.target.getAttribute("position");

    if (position === "left") {
      setTime((prevTime) => {
        return prevTime <= 1 ? prevTime : prevTime - 1;
      });
    }
    if (position === "right") {
      setTime((prevTime) => {
        return prevTime >= 10 ? prevTime : prevTime + 1;
      });
    }
  };
  const handleFrequency = (e) => {
    const position = e.target.getAttribute("position");
    if (position === "left") {
      setFrequency((prevFrequency) => {
        return prevFrequency <= 1 ? prevFrequency : prevFrequency - 1;
      });
    }
    if (position === "right") {
      setFrequency((prevFrequency) => {
        return prevFrequency >= 10 ? prevFrequency : prevFrequency + 1;
      });
    }
  };
  return (
    <div>
      <button
        onClick={showDialog}
        className="get-price-btn d-flex align-items-center justify-content-center"
      >
        <div className="icon-wrapper">
          <LuCalendarClock className="get-price-icon" />
        </div>

        <span>立即預約</span>
      </button>

      <Modal
        title="預約細節"
        visible={visible}
        closable={false}
        maskClosable={false}
        onOk={handleSubmit}
        afterClose={handleAfterClose} //>=1.16.0
        onCancel={handleCancel}
        closeOnEsc={true}
        className="req-quotation"
        footer={
          <div className="req-quotation-footer">
            <Button type="tertiary" onClick={handleCancel}>
              取消
            </Button>
            <button
              className="btn-confirm"
              onClick={handleSubmit}
              disabled={formClear ? false : true}
            >
              確認
            </button>
          </div>
        }
      >
        <div className="body-item d-flex justify-content-between align-items-center">
          <p className="size-6">寵物</p>
          <Select
            defaultValue="請選擇寵物"
            className="pet-list-btn"
            dropdownClassName="pet-list-dropdown"
            onChange={(value) => {
              console.log(value);
              setPetsValue(value);
            }}
          >
            {pets.map((pet) => (
              <Select.Option value={pet.pet_id} className="pet-list">
                <img className="pet-photo" src={pet.image}></img>
                <p className="size-6 ms-2">{pet.name}</p>
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="body-item d-flex justify-content-between align-items-center">
          <p className="size-6">開始日期</p>
          <DatePicker
            open={startDateOpen}
            autoSwitchDate={false}
            value={startDay}
            dropdownClassName="req-quotation-date"
            position="bottomRight"
            onChange={(date, dateString) => {
              setStartDay(dateString);
              setStartDateOpen(false);
              console.log(startDay, endDay);
              if (endDay && dayjs(endDay).isBefore(dateString)) {
                console.log("要清掉endDay");
                setEndDay(undefined);

                console.log(endDay);
              }
              setEndDateOpen(true);
            }}
            disabledDate={handleDisabledStart}
            triggerRender={({ placeholder }) => (
              <label
                onClick={() => {
                  setEndDateOpen(false);
                  setStartDateOpen(!startDateOpen);
                }}
              >
                {startDay || "選擇開始日期"}
              </label>
            )}
          />
        </div>
        <div className="body-item d-flex justify-content-between align-items-center">
          <p className="size-6">結束日期</p>
          <DatePicker
            open={endDateOpen}
            autoSwitchDate={false}
            value={endDay}
            dropdownClassName="dateRangeTest"
            position="bottomRight"
            onChange={(date, dateString) => {
              setEndDay(dateString);
              setEndDateOpen(false);
            }}
            disabledDate={handleDisabledEnd}
            triggerRender={({ placeholder }) => (
              <label
                onClick={() => {
                  setStartDateOpen(false);
                  setEndDateOpen(!endDateOpen);
                }}
              >
                {endDay || "選擇結束日期"}
              </label>
            )}
          />
        </div>
        <div className="body-item d-flex justify-content-between align-items-center">
          <p className="size-6">服務類型</p>
          <Select
            style={{ width: 150 }}
            onChangeWithObject
            optionList={serviceList}
            className="service-type_list"
            dropdownClassName="service-type-dropdown"
            placeholder="請選擇服務類型"
            defaultValue={serviceList[0]}
            onChange={(value) => {
              console.log(value);
              setServiceType(value);
            }}
          ></Select>
        </div>
        <div className="body-item d-flex justify-content-between align-items-center">
          <p className="size-6">服務時間</p>
          <div className="d-flex align-items-center">
            <CiCircleChevLeft
              position="left"
              className="icon"
              onClick={handleTime}
            />
            <div className="mx-1">{time * 30} 分鐘</div>
            <CiCircleChevRight
              position="right"
              className="icon"
              onClick={handleTime}
            />
          </div>
        </div>
        <div className="body-item d-flex justify-content-between align-items-center">
          <div className="size-6">每天次數</div>
          <div className="d-flex align-items-center">
            <CiCircleChevLeft
              position="left"
              className="icon"
              onClick={handleFrequency}
            />
            <div className="mx-1">{frequency} 次</div>
            <CiCircleChevRight
              position="right"
              className="icon"
              onClick={handleFrequency}
            />
          </div>
        </div>
        <div className="body-item d-flex flex-column justify-content-between">
          <p className="size-6 mb-2">地點</p>
          <input
            className="form-input"
            type="text"
            value={location}
            placeholder="請輸入地址或附近地標"
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
        <div className="body-item d-flex flex-column justify-content-between">
          <p className="size-6 mb-2">備註</p>
          <textarea
            className="form-area"
            rows="8"
            placeholder="輸入備註或是您毛小孩的需求與個性狀況"
            onChange={(e) => {
              console.log(e.target.value);
              setNote(e.target.value);
            }}
          />
        </div>
        <div className="divider my-2"></div>
        <div className="col-md-6 col-8 offset-md-6 offset-4 settlement-amount ">
          <div className="d-flex justify-content-between">
            <p className="">小計</p>
            <p>
              NT$<span>{serviceType?.price || 0}</span>
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p>天數</p>
            <p>x{days}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>服務時間(每30分鐘)</p>
            <p>x{time}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p>每天次數</p>
            <p>x{frequency}</p>
          </div>
          <div className="divider"></div>
          <div className="d-flex justify-content-between">
            <p>總金額</p>
            <p>
              NT$
              <span>{serviceType?.price * days * time * frequency || 0}</span>
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const HelperDetail = () => {
  const router = useRouter();
  const uid = parseInt(router.query.uid);
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [images, setImages] = useState([]);
  const { isAuthenticated, userId } = useAuth();
  const [currentPage, setPage] = useState(1);
  // const [filterReview, setFilterReview] = useState([]);
  const [star, setStar] = useState("all");
  const contentRef = useRef();
  const [totalRows, setTotalRows] = useState(null);
  const [currentReviewCount, setCurrentReviewCount] = useState(null);
  const { collection, setCollection } = useHelper();
  const [fiveStar, setFiveStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  const PaginationRef = useRef();
  const [firstLoad, setFirstLoad] = useState(true);
  const [allService, setAllService] = useState([]);
  const handleFav = (e) => {
    if (isAuthenticated) {
      if (!collection.find((item) => item === uid)) {
        setCollection((prev) => {
          return [...prev, uid];
        });
      } else {
        setCollection((prev) => {
          const newArr = prev.filter((item) => item !== uid);
          console.log(newArr);
          return newArr;
        });
      }
    } else {
      alert("請先登入會員");
      router.push("/member/login");
    }
  };

  const handleChangeStar = (e) => {
    setStar(e.currentTarget.value);
    //先移除所有btn上的樣式，再加樣式在目前點擊的btn上
    const btnItem = document.querySelectorAll(".filter-btn-item");

    btnItem.forEach((btn) => {
      btn.classList.remove("filter-btns-focus");
    });
    e.currentTarget.classList.add("filter-btns-focus");
  };
  const changePage = (page) => {
    console.log("Page: ", page);
    setPage(page);
  };
  useEffect(() => {
    console.log(firstLoad);
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    // // pag y + reviewy = scrollto的距離
    const paginationDom = document.querySelector(".cos-pagination");
    const reviewDom = document.querySelector(".evaluation-bar");

    // scrollY - (review bottom到視口top的距離) = scrollTo高度

    const reviewRect = reviewDom.getBoundingClientRect();
    console.log("window.scrollY", window.scrollY);
    console.log("reviewRect.top", reviewRect.top);
    console.log("window.innerHeight", window.innerHeight);
    const scrollTo = window.scrollY - reviewRect.top * -1 - 100;
    console.log("scrollTo", scrollTo);

    window.scrollTo({
      top: scrollTo,
      behavior: "smooth", // 平滑滾動效果
    });
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const width = window.innerWidth;
      // console.log(width);
      const leftBlock = document.querySelector(".left-block");
      if (width > 992) {
        const scrollY = window.scrollY;
        const dScrollY = document.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const distanceToBottom = documentHeight - (scrollY + windowHeight);
        // console.log(scrollY, windowHeight, documentHeight);
        // console.log(leftBlock);
        // console.log(scrollY, dScrollY);
        if (distanceToBottom < 130) {
          leftBlock.style.position = "relative";
          leftBlock.style.top = `${scrollY - 300}px `;
        } else {
          leftBlock.style.position = "sticky";
          leftBlock.style.top = "10px";
        }
      } else {
        leftBlock.style.position = "static";
      }
    };

    // 添加事件
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    // 移除事件
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (uid) {
      workService
        .getHelperDetail(uid, currentPage)
        .then((response) => {
          const data = response?.data?.data;
          // console.log(response);
          console.log("data.allReviews?.totalRows", data.allReviews?.totalRows);
          setTotalRows(data.allReviews?.totalRows);
          setProfile(data.profile[0]);
          setImages(data.images);
          setAllService(() => {
            let arr = [];
            if (data.profile[0].feed_service == 1) {
              arr.push("到府代餵");
            }
            if (data.profile[0].house_service == 1) {
              arr.push("安親寄宿");
            }
            if (data.profile[0].beauty_service == 1) {
              arr.push("到府美容");
            }
            if (arr.length > 1) {
              arr = arr.join("、");
            }
            return arr;
          });
          // 先清除重渲染可能造成的值再計算每個星數的評論數
          setFiveStar(0);
          setFourStar(0);
          setThreeStar(0);
          setTwoStar(0);
          setOneStar(0);
          data.allReviews?.result.map((review) => {
            switch (parseInt(review.star_rating)) {
              case 5:
                setFiveStar((pre) => {
                  // console.log(pre);
                  return pre + 1;
                });

                break;
              case 4:
                setFourStar((pre) => {
                  return pre + 1;
                });
                break;
              case 3:
                setThreeStar((pre) => {
                  return pre + 1;
                });
                break;
              case 2:
                setTwoStar((pre) => {
                  return pre + 1;
                });
                break;
              case 1:
                setOneStar((pre) => {
                  return pre + 1;
                });
                break;
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [uid]);

  useEffect(() => {
    if (profile?.job_description) {
      contentRef.current.innerHTML = profile.job_description;
    }
  }, [profile]);
  console.log(profile, reviews);
  useEffect(() => {
    if (uid) {
      // 切換星數篩選時，重新回到第一頁
      setPage(1);
      workService
        .getFilterReview(uid, star, currentPage)
        .then((response) => {
          // console.log(response.data);
          // console.log(response.data.reviews);
          setReviews(response.data.reviews);
          setCurrentReviewCount(response.data.review_count);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [uid, star]);
  useEffect(() => {
    workService
      .getFilterReview(uid, star, currentPage)
      .then((response) => {
        // console.log(response.data);
        // console.log(response.data.reviews);
        setReviews(response.data.reviews);
        setCurrentReviewCount(response.data.review_count);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [currentPage]);
  const handleButtonClick = async () => {
    console.log("有執行handleButtonClick");
    if (!userId) {
      alert("請先登入會員");
      return;
    }
    // setIsLoading(true);

    // 檢查是否有有效的 userId
    //如果放入targetID 變數 這邊也要把targetID 變數放進來檢查
    if (userId) {
      // 建立要傳送的數據
      const requestData = {
        chatlist_userId1: userId,
        chatlist_userId2: uid, // 放要對話的 targetID 變數
      };
      console.log("userId1是" + userId);

      try {
        const response = await axios.post(
          "http://localhost:3005/api/chatlist/creatchat",
          requestData
        );

        if (response.status === 201) {
          console.log("請求成功");
          // 請求成功
          // setMessage("請求成功");
          const chatUrl = response.data.chatUrl;
          console.log("chatUrl" + chatUrl);
          // 在這裡導向到 chatUrl
          window.location.href = chatUrl;
        } else if (response.status === 200) {
          // 消息已存在
          // setMessage("消息已存在");
          const chatUrl = response.data.chatUrl;
          console.log("已存在chatUrl" + chatUrl);
          // 在這裡導向到 chatUrl
          window.location.href = chatUrl;
        } else {
          // 請求失敗
          // setMessage("請求失敗: " + response.data.error);
        }
      } catch (error) {
        // 處理錯誤
        // setMessage(error.message || "發生錯誤");
        // } finally {
        // setIsLoading(false);
        console.log(error);
      }
    }
  };

  return (
    <>
      <div className="helper-detail container">
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
              <Link href="/work/find-helper" className="active-hover">
                小貓上工(找幫手)
              </Link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {uid}
            </li>
          </ol>
        </nav>
        <div className="d-flex row align-items-start">
          <section className="left-block col-12 col-lg-3 flex-column justify-content-center align-items-center">
            <div className="avatar">
              <img src={profile.cover_photo} />
            </div>
            <div className="profile row justify-content-center justify-content-md-start">
              <div className="size-5 m-size-5 username col-12 text-center my-2">
                {profile.name || "loading...."}
              </div>
              <hr className="profile-divider" />
              <div className="profile-info">
                <p className="intro size-6 size-6">關於我</p>
                <p className="intro size-7 size-7">{profile.Introduction}</p>
              </div>
              <div className="profile-info">
                <p className="intro size-6">我的服務內容</p>
                <p className="intro size-7">{allService}</p>
              </div>
              <div className="profile-info">
                <p className="intro size-6">我的服務時間</p>
                <p className="intro size-7">日、一、二、三、四、五、六</p>
              </div>
              <div className="profile-info">
                <p className="intro size-6">我的服務地區</p>
                <p className="intro size-7">{profile.service_county}</p>
              </div>

              <div className="left-block-btns-group pc d-none d-lg-flex">
                <div className="d-flex">
                  <button className="btn-message" onClick={handleButtonClick}>
                    <BiMessageRounded />
                    <span>傳送訊息</span>
                  </button>
                  <Quotation />
                </div>

                <button className="heart-icon" onClick={handleFav}>
                  {collection.find((item) => item === uid) ? (
                    <>
                      <FaHeart className="fill-icon" />
                      <span>取消收藏</span>
                    </>
                  ) : (
                    <>
                      <FaRegHeart />
                      <span>加入收藏</span>
                    </>
                  )}
                </button>
              </div>
              <div className="left-block-btns-group mobile d-flex d-lg-none">
                <button className="btn-message" onClick={handleButtonClick}>
                  <div className="icon-wrapper">
                    <BiMessageRounded />
                  </div>
                  <span>傳送訊息</span>
                </button>
                <Quotation />
                <button className="heart-icon" onClick={handleFav}>
                  {collection.find((item) => item === uid) ? (
                    <>
                      <div className="icon-wrapper">
                        {" "}
                        <FaHeart className="fill-icon" />
                      </div>

                      <span>取消收藏</span>
                    </>
                  ) : (
                    <>
                      <div className="icon-wrapper">
                        <FaRegHeart />
                      </div>

                      <span>加入收藏</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
          <section className="right-block col-12 col-lg-8 description">
            {/* <div className="photo">
              <img src="https://s.yimg.com/ny/api/res/1.2/SbkcZy1AilHNsmQs08nHTw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://media.zenfs.com/zh-tw/news_tvbs_com_tw_938/8c0eb4b2ed4519a4a341a90e72f5d93e" />
            </div> */}
            <div className="item">
              <div className="item-title size-6">小幫手服務介紹</div>
              <hr className="item-divider" />
              <di
                className="item-content size-7 d-block"
                ref={contentRef}
                style={{ minHeight: "700px" }}
              ></di>
            </div>
            <div className="item">
              <div className="item-title size-6">服務價格說明</div>
              <hr className="item-divider" />
              <div className="service-price item-content d-flex flex-column gap-2">
                <div className="price-intro-text size-7">
                  到府代餵：<span>單次價格以30分鐘為單位</span>
                </div>
                <div className="price-intro-text size-7">
                  安親寄宿：<span>單次價格以一天為單位</span>
                </div>
                <div className="price-intro-text size-7">
                  到府美容：<span>單次價格以一次美容服務為單位</span>
                </div>

                <div className="d-flex gap-2 gap-md-4 mt-3">
                  {profile?.feed_service == 1 && (
                    <div className="price-intro-card">
                      <img src="/job-icon/cat-tree.svg" className="card-bg" />
                      <div className="card-title">
                        <PiPawPrintFill className="card-icon" />
                        到府代餵
                      </div>
                      <div className="card-content">
                        <div className="d-flex align-items-center">
                          <p className="">NT$</p>
                          <span className="price">{profile.feed_price}</span>
                        </div>
                        <p className="mt-1">/ 半小時</p>
                      </div>
                    </div>
                  )}
                  {profile?.house_service == 1 && (
                    <div className="price-intro-card">
                      <img src="/job-icon/cat-tree.svg" className="card-bg" />
                      <div className="card-title">
                        <PiPawPrintFill className="card-icon" />
                        安親寄宿
                      </div>
                      <div className="card-content">
                        <div className="d-flex align-items-center">
                          <p className="">NT$</p>
                          <span className="price">{profile?.house_price}</span>
                        </div>
                        <p className="mt-1">/ 天</p>
                      </div>
                    </div>
                  )}
                  {profile?.beauty_service == 1 && (
                    <div className="price-intro-card">
                      <img src="/job-icon/cat-tree.svg" className="card-bg" />
                      <div className="card-title">
                        <PiPawPrintFill className="card-icon" />
                        到府美容
                      </div>
                      <div className="card-content">
                        <div className="d-flex align-items-center">
                          <p className="">NT$</p>
                          <span className="price">{profile?.beauty_price}</span>
                        </div>
                        <p className="mt-1">/ 次</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="item">
              <div className="item-title size-6">相片/影片</div>
              <hr className="item-divider" />
              <div className="item-image item-content">
                <ImageSwiper images={images} setImages={setImages} />
              </div>
            </div>

            <div className="item">
              <div className="d-flex align-items-center">
                <div className="item-title size-6">服務評價</div>
                <p className="m-size-7">
                  (共<span>{totalRows}</span>則相關評論)
                </p>
              </div>
              <hr className="item-divider" />
              <div className="evaluation-bar">
                <div className="evaluation-bar-left d-flex flex-column justify-content-center">
                  <p className="size-3 text-center">
                    {profile.average_star === null
                      ? "-"
                      : parseFloat(profile.average_star).toFixed(1)}
                  </p>
                  <div className="ranking mb-2 mx-auto">
                    <Rating
                      name="half-rating-read"
                      value={
                        profile.average_star === null
                          ? 0
                          : parseFloat(profile.average_star).toFixed(2)
                      }
                      size="large"
                      readOnly
                      precision={0.5}
                      emptyIcon={<StarIcon style={{ opacity: 0.35 }} />}
                    />
                  </div>
                </div>
                <hr className="evaluation-bar-divider" />
                <div className="evaluation-bar-right d-flex flex-column justify-content-evenly">
                  <div className="bar-group">
                    <p className="number size-6">5</p>
                    <div className="percentage">
                      <div
                        className="have"
                        style={{
                          width: `${(fiveStar / totalRows) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-group">
                    <p className="number size-6">4</p>
                    <div className="percentage">
                      <div
                        className="have"
                        style={{
                          width: `${(fourStar / totalRows) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-group">
                    <p className="number size-6">3</p>
                    <div className="percentage">
                      <div
                        className="have"
                        style={{
                          width: `${(threeStar / totalRows) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-group">
                    <p className="number size-6">2</p>
                    <div className="percentage">
                      <div
                        className="have"
                        style={{
                          width: `${(twoStar / totalRows) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="bar-group">
                    <p className="number size-6">1</p>
                    <div className="percentage">
                      <div
                        className="have"
                        style={{
                          width: `${(oneStar / totalRows) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-btns " onClick={handleChangeStar}></div>
              <Swiper
                slidesPerView="auto"
                spaceBetween={10}
                className="filter-btns"
              >
                <SwiperSlide>
                  <button
                    value={"all"}
                    className="filter-btns-focus filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    全部評論({totalRows})
                  </button>
                </SwiperSlide>
                <SwiperSlide>
                  <button
                    value={5}
                    className="filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    5星(<span>{fiveStar}</span>)
                  </button>
                </SwiperSlide>
                <SwiperSlide>
                  <button
                    value={4}
                    className="filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    4星(<span>{fourStar}</span>)
                  </button>
                </SwiperSlide>
                <SwiperSlide>
                  <button
                    value={3}
                    className="filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    3星(<span>{threeStar}</span>)
                  </button>
                </SwiperSlide>
                <SwiperSlide>
                  <button
                    value={2}
                    className="filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    2星(<span>{twoStar}</span>)
                  </button>
                </SwiperSlide>
                <SwiperSlide>
                  <button
                    value={1}
                    className="filter-btn-item"
                    onClick={handleChangeStar}
                  >
                    1星({oneStar})
                  </button>
                </SwiperSlide>
              </Swiper>
              {reviews.length > 0 ? (
                <>
                  {reviews.map((review) => (
                    <div className="review-card">
                      <div className="review-card-head d-flex justify-content-center align-items-center">
                        <img
                          className="review-card-avatar"
                          src={`${review.cover_photo}`}
                        />
                        <div className="review-card-info d-flex flex-column justify-content-between ps-2">
                          <div className="d-flex justify-content-between">
                            <div className="username size-6">{review.name}</div>
                            <div className="date size-7">
                              {review.review_date}
                            </div>
                          </div>
                          <div className="ranking mb-2">
                            <Rating
                              name="half-rating-read"
                              value={review.star_rating}
                              readOnly
                              precision={0.5}
                              emptyIcon={<StarIcon style={{ opacity: 0.35 }} />}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="review-card-body mt-3">
                        {review.review_content}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                ""
              )}
              <Pagination
                current={currentPage}
                total={currentReviewCount}
                pageSize="10"
                showSizeChanger={false}
                rootClassName="cos-pagination"
                onChange={changePage}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HelperDetail;
