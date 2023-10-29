import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdHomeRepairService } from "react-icons/md";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { Empty } from "@douyinfe/semi-ui";
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from "@douyinfe/semi-illustrations";
import lottie from "lottie-web";
import animation from "@/data/animation_lnqha2jt.json";
import memberService from "@/services/member-service";
import { useAuth } from "@/context/fakeAuthContext";
import axios from "axios";
export const RecordTemplate = ({
  icon,
  title,
  item1,
  info,
  setInfo,
  status,
  setStatus,
  allRequest,
}) => {
  const router = useRouter();
  const handleStatus = (e) => {
    if (status == e.target.id) {
      return;
    }
    switch (e.target.id) {
      case 1:
        setStatus(1);
        break;
      case 2:
        setStatus(2);
        break;
      case 3:
        setStatus(3);
        break;
      case 4:
        setStatus(4);
        break;
    }
  };
  const handleReviewBubble = (e, case_id) => {
    // console.log(e.currentTarget, e.target);
    if (router.pathname === "/member/reserve" && status === 3) {
      const currentTarget = e.currentTarget;
      memberService
        .getReview(case_id)
        .then((response) => {
          // console.log(response);
          if (response?.data?.data?.review_id !== null) {
            if (e.type === "mouseenter") {
              // console.log("滑鼠移進");
              currentTarget.classList.add("bubble-tip-success");
            } else if (e.type === "mouseleave") {
              // console.log("滑鼠移出");
              currentTarget.classList.remove("bubble-tip-success");
            }
          } else {
            if (e.type === "mouseenter") {
              // console.log("滑鼠移進");
              currentTarget.classList.add("bubble-tip-todo");
            } else if (e.type === "mouseleave") {
              // console.log("滑鼠移出");
              currentTarget.classList.remove("bubble-tip-todo");
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    // if (e.type === "mouseenter") {
    //   console.log("滑鼠移進");
    //   e.target.classList.add(".bubble-tip-success");
    // } else if (e.type === "mouseleave") {
    //   console.log("滑鼠移出");
    //   e.target.classList.remove(".bubble-tip-success");
    // }
  };

  useEffect(() => {
    for (let i = 1; i <= 4; i++) {
      const focusBtn = document.querySelector(`#btn${i}`);
      const lottie = document.querySelector("#lottie");
      if (focusBtn.contains(lottie)) {
        focusBtn.removeChild(document.querySelector("#lottie"));
      }
      focusBtn.classList.remove("btn-focus");
    }
    const lottie = document.createElement("div");
    lottie.id = "lottie";
    const focusBtn = document.querySelector(`#btn${status}`);
    focusBtn.appendChild(lottie);
    focusBtn.classList.add("btn-focus");
  }, [status]);
  useEffect(() => {
    lottie.loadAnimation({
      container: document.getElementById("lottie"), // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation, // the animation data
    });
  }, [status]);
  console.log(info);
  return (
    <>
      <p className="size-4 big mb-2 fw-bold">
        <span className="my">▍</span>
        {title}
      </p>

      <nav className="tab-nav" onClick={handleStatus}>
        <button
          id="btn1"
          className="size-7 "
          onClick={() => {
            setStatus(1);
          }}
        >
          {item1 || "待處理"}
        </button>
        <button
          autoFocus
          id="btn2"
          className="size-7 "
          onClick={() => {
            setStatus(2);
          }}
        >
          <div id="lottie"></div>
          進行中
        </button>
        <button
          id="btn3"
          className="size-7 "
          onClick={() => {
            setStatus(3);
          }}
        >
          已完成
        </button>
        <button
          id="btn4"
          className="size-7 "
          onClick={() => {
            setStatus(4);
          }}
        >
          已取消
        </button>
      </nav>
      <div className="record-info-pc d-none d-sm-block">
        <div className="info-title d-flex align-items-center justify-content-around">
          <p>成立日期</p>
          <p>預約編號</p>
          <p>預約日期</p>
          <p>服務總價</p>
        </div>
        {info?.length === 0 ? (
          <Empty
            image={
              <IllustrationNoContent style={{ width: 300, height: 300 }} />
            }
            title="尚未有訂單紀錄"
          ></Empty>
        ) : (
          <>
            {info &&
              info?.map((item) => (
                <div
                  className="info-content d-flex align-items-center justify-content-around"
                  onMouseEnter={(e) => {
                    handleReviewBubble(e, item.case_id);
                  }}
                  onMouseLeave={(e) => {
                    handleReviewBubble(e, item.case_id);
                  }}
                >
                  <p>{item.created_at}</p>
                  <p>{item.oid}</p>
                  <p>
                    {item.start_day} ~<br className="d-md-none d-block" />
                    {item.end_day}
                  </p>
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <p className="mb-1 size-6 price">NT$ {item.total_price}</p>
                    <button className="animate-button-one">
                      {title === "幫手訂單" && (
                        <Link href={`/member/selling/${item.oid}`}>
                          查看詳細
                        </Link>
                      )}
                      {title === "預約紀錄" && (
                        <Link href={`/member/reserve/${item.oid}`}>
                          查看詳細
                        </Link>
                      )}
                    </button>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      {info.length === 0 ? (
        <div className="record-info-mobile-wrapper">
          <Empty
            image={
              <IllustrationNoContent style={{ width: 300, height: 300 }} />
            }
            title="尚未有訂單紀錄"
            className="d-flex d-sm-none"
          ></Empty>
        </div>
      ) : (
        <div className="record-info-mobile-wrapper">
          {info &&
            info.map((item) => (
              <div className="record-info-mobile d-flex d-sm-none flex-column my-3">
                <div>
                  <p>成立日期</p>
                  <p>{item.created_at}</p>
                </div>
                <div>
                  <p>預約編號</p>
                  <p>{item.oid}</p>
                </div>
                <div>
                  <p>預約日期</p>
                  <p>
                    {item.start_day} ~ {item.end_day}
                  </p>
                </div>
                <div>
                  <p>服務總價</p>
                  <div className="d-flex align-items-center justify-content-center">
                    <p className="size-6 me-2 price">NT$ {item.total_price}</p>
                    <button
                      className="btn-outline-confirm"
                      onClick={() => {
                        if (title === "幫手訂單") {
                          router.push(`/member/selling/${item.oid}`);
                        }
                        if (title === "預約紀錄") {
                          router.push(`/member/reserve/${item.oid}`);
                        }
                      }}
                    >
                      查看詳細
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
};
// icon={reactIcon} 要在使用的icon上加入className <BsCalendarDateFill className="icon me-1" />
// title={大標題名稱}
// item1={第一個button}

export const RecordDetailTemplate = ({
  icon,
  title,
  detail,
  setDetail,
  customInfo,
  helperInfo,
}) => {
  const [days, setDays] = useState(0);
  const year = new Date().getFullYear();
  const { userId } = useAuth();
  const router = useRouter();
  useEffect(() => {
    console.log(detail);
    const start = dayjs(detail.start_day);
    const end = dayjs(detail.end_day);
    setDays(end.diff(start, "day") + 1);
  }, [detail]);
  const handleButtonClick = async () => {
    if (!userId) {
      alert("請先登入會員");
      return;
    }
    let chatlist_userId2;
    if (title === "預約紀錄") {
      chatlist_userId2 = helperInfo.user_id;
    } else {
      chatlist_userId2 = customInfo.user_id;
    }
    // 檢查是否有有效的 userId
    //如果放入targetID 變數 這邊也要把targetID 變數放進來檢查
    if (userId) {
      // 建立要傳送的數據
      const requestData = {
        chatlist_userId1: userId,
        chatlist_userId2, // 放要對話的 targetID 變數
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
          router.push(chatUrl);
        } else if (response.status === 200) {
          // 消息已存在
          // setMessage("消息已存在");
          const chatUrl = response.data.chatUrl;
          console.log("已存在chatUrl" + chatUrl);
          // 在這裡導向到 chatUrl
          router.push(chatUrl);
          // window.location.href = chatUrl;
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
      <p className="size-4 big mb-3 fw-bold">
        <span className="my">▍</span>
        {title}
      </p>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div className="left">
          <p className="date mb-4 size-7 p-1">{detail?.created_at}</p>
          <span className="status size-6">狀態 :</span>
          <span className="status-text ms-2 size-6">{detail.status}</span>
          <p className="size-7">
            服務編號 :<span className="ms-2">{detail.oid}</span>
          </p>
          <p className="info-title size-6">預約資訊 :</p>
          <div className=" d-flex">
            <div className="title me-3">
              <p>開始日期</p>
              <p>結束日期</p>
              <p>服務時間</p>
              <p>每天次數</p>
              <p>地點</p>
              <p>備註</p>
            </div>
            <div className="content ">
              <p>{detail.start_day}</p>
              <p>{detail.end_day}</p>
              <p>{30 * detail.service_time} 分鐘/次</p>
              <p>{detail.frequency} 次</p>
              <p>{detail.location}</p>
              <p>{detail.note}</p>
            </div>
          </div>
        </div>
        <div className="right-info me-2 mt-2 mt-md-0 d-flex flex-row flex-md-column align-items-md-start gap-2 align-items-center">
          <img
            className="align-self-center"
            src={
              title === "預約紀錄"
                ? helperInfo?.cover_photo
                : customInfo?.cover_photo
            }
          ></img>
          <div className="d-flex flex-column gap-1">
            <div className="name size-6">
              {title === "預約紀錄" ? helperInfo?.name : customInfo?.name}
            </div>
            <div className="size-6">
              {title === "預約紀錄" ? helperInfo?.phone : customInfo?.phone}
            </div>
            <div className="size-6">
              {title === "預約紀錄" ? helperInfo?.email : customInfo?.email}
            </div>
            <button className="btn-outline-confirm" onClick={handleButtonClick}>
              {title === "預約紀錄" ? "連絡小幫手" : "聯絡預約人"}
            </button>
          </div>
        </div>
      </div>

      <p className="info-title size-6 mb-2">寵物資訊 :</p>
      <div className="pet d-flex">
        <img className="pet-img" src={detail.image}></img>
        <div className="pet-info ms-3">
          <p>
            <span>{detail.name}</span>
            <span>{year - detail.birthday_year} 歲</span>
            <span>{detail.gender}</span>
            <span>4.5公斤</span>
          </p>
          <p></p>
          <p>
            {detail.ligation ? "已結紮" : "尚未結紮"},
            {detail.vaccine ? "有定期施打疫苗" : "無定期施打疫苗"}
          </p>
          <p>{detail.description}</p>
        </div>
      </div>
      <div className="divider my-2"></div>
      <div className="col-md-6 col-8 offset-md-6 offset-4 settlement-amount ">
        <div className="d-flex justify-content-between">
          <p className="">小計</p>
          <p>
            NT$<span>{detail.subtotal_price}</span>
          </p>
        </div>
        <div className="d-flex justify-content-between">
          <p>天數</p>
          <p>x{days}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>服務時間(每30分鐘)</p>
          <p>x{detail.service_time}</p>
        </div>
        <div className="d-flex justify-content-between">
          <p>每天次數</p>
          <p>x{detail.frequency}</p>
        </div>
        <div className="divider"></div>
        <div className="d-flex justify-content-between">
          <p>總金額</p>
          <p className="price">
            NT$<span>{detail.total_price}</span>
          </p>
        </div>
      </div>
    </>

    //   {/* <div className="">
    //           <h5 className="size-6 mt-3">商品評論</h5>
    //           <textarea className="col-12 textareasize"></textarea>
    //         </div> */}
  );
};
// icon={reactIcon} 要在使用的icon上加入className <BsCalendarDateFill className="icon me-1" />
// title={大標題名稱}
