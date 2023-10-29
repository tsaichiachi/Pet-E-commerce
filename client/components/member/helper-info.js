import React, { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { BiUpload } from "react-icons/bi";
import { PiPawPrintFill, PiPawPrint } from "react-icons/pi";
import { Switch, message } from "antd";
import memberService from "@/services/member-service";
import { useForm } from "react-hook-form";
import { Upload } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import {
  CheckboxGroup,
  Checkbox,
  TextArea,
  Notification,
} from "@douyinfe/semi-ui";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
import lottie from "lottie-web";
import animationClose from "@/data/Animation-close.json";
import animationClick from "@/data/Animation-click.json";
const countyOption = [
  "台北市",
  "新北市",
  "桃園市",
  "新竹市",
  "新竹縣",
  "苗栗縣",
  "台中市",
  "彰化縣",
  "南投縣",
  "雲林縣",
  "嘉義市",
  "嘉義縣",
  "台南市",
  "高雄市",
  "屏東縣",
  "台東縣",
  "花蓮縣",
  "宜蘭縣",
  "澎湖縣",
  "金門縣",
  "連江縣",
];

const CheckboxInput = ({
  label,
  feedStatus,
  status,
  setStatus,
  info,
  setInfo,
  checked,
  user_id,
}) => {
  const inputWrapperRef = useRef();
  const checkRef = useRef();

  useEffect(() => {
    const checkBox = document.querySelector('input[type="checkbox"]');
    const input = document.querySelector(".number-input");
    if (checked.some((item) => item === label) && input.value !== "") {
      inputWrapperRef.current.classList.remove("input-wrapper-active");
    }
    // inputs.forEach((input) => {
    //   console.log(input.value);
    //   // if()
    // });
    // console.log(inputs);
    // console.log(checkRef.current.props.value);
  }, [checked]);
  console.log(checked);

  return (
    <>
      <Checkbox
        value={label}
        ref={checkRef}
        extra={
          <>
            {checked.some((item) => item === label) && (
              <>
                <p>請輸入您提供該項服務的收費</p>
                <div
                  className="input-wrapper input-wrapper-active"
                  ref={inputWrapperRef}
                >
                  <input
                    type="number"
                    placeholder="輸入金額"
                    value={status.price}
                    className="form-input number-input"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onFocus={() => {
                      inputWrapperRef.current.classList.remove(
                        "input-wrapper-active"
                      );
                    }}
                    onBlur={(e) => {
                      if (e.target.value !== "") {
                        inputWrapperRef.current.classList.remove(
                          "input-wrapper-active"
                        );
                      } else {
                        inputWrapperRef.current.classList.add(
                          "input-wrapper-active"
                        );
                      }
                    }}
                    onChange={(e) => {
                      console.log(e.target.value);
                      setStatus({ ...status, price: e.target.value });
                    }}
                  />
                  <span className="ms-1">
                    / {label === "安親寄宿" ? "天" : "次"}
                  </span>
                </div>
              </>
            )}
          </>
        }
        style={{ width: 220 }}
      >
        {checked.some((item) => item === label) ? (
          <PiPawPrintFill className="check-icon icon-fill" />
        ) : (
          <PiPawPrint className="check-icon icon-hollow" />
        )}

        <span className="size-7 check-title">{label}</span>
      </Checkbox>
    </>
  );
};

const Close = ({ open, setOpen, user_id }) => {
  const lottieRef = useRef();
  const handleOpen = () => {
    console.log(open);
    if (!open) {
      console.log(user_id);
      memberService
        .handleHelperValid(open, user_id)
        .then((response) => {
          console.log(response.data);
          if (response?.data?.status === 200) {
            // alert("開啟小幫手功能成功");
            Notification.success({
              duration: 3,
              position: "top",
              theme: "light",
              // content: "semi-ui-notification",
              title: "已開啟小幫手功能",
            });
            setOpen(true);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  useEffect(() => {
    const closeLottie = lottie.loadAnimation({
      container: document.getElementById("close"), // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationClose, // the animation data
    });

    return () => {
      closeLottie.destroy();
    };
  }, [open]);
  return (
    <div className="close-mask">
      {/* <button className="open-helper btn-brown" onClick={handleOpen}>
        開啟小幫手功能
      </button> */}
      <div id="close" onClick={handleOpen} ref={lottieRef}></div>
    </div>
  );
};

const Open = ({ open, setOpen, info, setInfo, images, setImages, user_id }) => {
  console.log(info);
  const lottieRef = useRef(false);
  const [feedStatus, setFeedStatus] = useState({
    service: info?.feed_service,
    price: info?.feed_price,
  });
  const [houseStatus, setHouseStatus] = useState({
    service: info?.house_service,
    price: info?.house_price,
  });
  const [beautyStatus, setBeautyStatus] = useState({
    service: info?.beauty_service,
    price: info?.beauty_price,
  });
  const [checked, setChecked] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [firstLoad, setFirstLoad] = useState(true);
  let action = "https://api.semi.design/upload";
  useEffect(() => {
    const openLottie = lottie.loadAnimation({
      container: document.getElementById("click"), // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationClick, // the animation data
    });
    lottieRef.current = true;

    return () => {
      openLottie.destroy();
    };
  }, [open]);

  useEffect(() => {
    if (info) {
      if (firstLoad) {
        console.log("info", info);
        console.log(checked);
        console.log(feedStatus);
        setFeedStatus({
          service: Boolean(info.feed_service),
          price: info.feed_price,
        });
        setHouseStatus({
          service: info.house_service,
          price: info.house_price,
        });
        setBeautyStatus({
          service: info.beauty_service,
          price: info.beauty_price,
        });
        setChecked([]);
        if (info.feed_service) {
          setChecked((prevChecked) => [...prevChecked, "到府代餵"]);
        }
        if (info.house_service) {
          setChecked((prevChecked) => [...prevChecked, "安親寄宿"]);
        }
        if (info.beauty_service) {
          setChecked((prevChecked) => [...prevChecked, "到府美容"]);
        }
        setFirstLoad(false);
      }
    }
  }, [info]);
  const handleImage = ({ fileList, currentFile, event }) => {
    console.log("onChange");
    console.log(fileList);
    console.log(currentFile);
    let newFileList = [...fileList]; // spread to get new array
    setImages(newFileList);
  };
  // const editSuccess = () => {
  //   messageApi.open({
  //     type: "success",
  //     content: "小幫手資料修改成功。",
  //   });
  // };
  const editError = () => {
    messageApi.open({
      type: "error",
      content: "資料修改失敗，請稍後重試一次。",
    });
  };
  const editWarning = () => {
    messageApi.open({
      type: "warning",
      content: "網路連線錯誤，修改失敗。",
    });
  };

  const handleOpen = () => {
    if (open) {
      console.log(user_id);
      memberService
        .handleHelperValid(open, user_id)
        .then((response) => {
          console.log(response?.data);
          if (response?.data?.status === 200) {
            Notification.success({
              duration: 3,
              position: "top",
              theme: "light",
              // content: "semi-ui-notification",
              title: "已關閉小幫手功能",
            });
            setOpen(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleEdit = (e) => {
    e.preventDefault();
    // console.log(feedStatus, houseStatus, beautyStatus);
    const formData = new FormData();
    let feed_service, house_service, beauty_service;
    if (checked.some((item) => item === "到府代餵")) {
      feed_service = true;
    } else {
      feed_service = false;
    }
    if (checked.some((item) => item === "安親寄宿")) {
      house_service = true;
    } else {
      house_service = false;
    }
    if (checked.some((item) => item === "到府美容")) {
      beauty_service = true;
    } else {
      beauty_service = false;
    }
    const result = {
      ...info,
      feed_service,
      house_service,
      beauty_service,
      feed_price: feedStatus.price,
      house_price: houseStatus.price,
      beauty_price: beautyStatus.price,
    };
    for (const [key, value] of Object.entries(result)) {
      formData.append(key, value);
    }
    setInfo(result);
    images.forEach((image) => {
      if (!image.status) {
        // 舊的相片
        formData.append("oldImages", image.url);
      } else {
        // 新的相片
        formData.append("newImages", image.fileInstance);
      }
    });
    memberService
      .handleHelperEdit(formData)
      .then((response) => {
        // console.log(response);
        if (response?.data?.status === 200) {
          setInfo(response?.data?.info);
          Notification.success({
            duration: 3,
            position: "top",
            theme: "light",
            // content: "semi-ui-notification",
            title: "資料修改成功",
          });
        } else {
          editError();
        }
      })
      .catch((e) => {
        console.log(e);
        editWarning();
      });
  };
  const handleCancel = () => {
    console.log("有cancel");
    memberService
      .getHelperInfo(user_id)
      .then((response) => {
        console.log(response?.data);
        if (response?.data?.status === 200) {
          const profile = response?.data?.profile[0];
          setInfo(profile);
          setFeedStatus({
            service: profile.feed_service,
            price: profile.feed_price,
          });
          setHouseStatus({
            service: profile.house_service,
            price: profile.house_price,
          });
          setBeautyStatus({
            service: profile.beauty_service,
            price: profile.beauty_price,
          });
          setChecked([]);
          if (profile.feed_service) {
            setChecked((prevChecked) => [...prevChecked, "到府代餵"]);
          }
          if (profile.house_service) {
            setChecked((prevChecked) => [...prevChecked, "安親寄宿"]);
          }
          if (profile.beauty_service) {
            setChecked((prevChecked) => [...prevChecked, "到府美容"]);
          }
          const tempImages = response?.data?.images;
          setImages(() => {
            return tempImages.map((image) => {
              return { uid: image.image_id, url: image.file_path };
            });
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <form
        className=""
        id="helper-form"
        name="helper-form"
        onSubmit={handleEdit}
      >
        <div className="form-item">
          <label className="size-6 m-size-7">姓名</label>
          <input
            className="form-input m-form-input"
            type="text"
            placeholder="請輸入名稱"
            value={info?.name}
            onChange={(e) => {
              const value = e.target.value;
              setInfo({ ...info, name: value });
            }}
          />
        </div>
        <div className="form-item">
          <label className="size-6 m-size-7">個人簡述</label>
          <textarea
            autosize
            rows={8}
            className="form-area m-form-input h-auto"
            type="text"
            placeholder="請簡單輸入自我介紹"
            value={info?.Introduction}
            onChange={(e) => {
              const value = e.target.value;
              setInfo({ ...info, Introduction: value });
            }}
          />
        </div>

        <div className="form-item">
          <label className="size-6 m-size-7">Email</label>
          <input
            className="form-input m-form-input"
            type="text"
            placeholder="請輸入Email"
            value={info?.email}
            onChange={(e) => {
              const value = e.target.value;
              setInfo({ ...info, email: value });
            }}
          />
        </div>
        <div className="form-item">
          <label className="size-6 m-size-7">聯絡電話</label>
          <input
            className="form-input m-form-input"
            type="text"
            placeholder="請輸入聯絡電話"
            value={info?.phone}
            onChange={(e) => {
              const value = e.target.value;
              setInfo({ ...info, phone: value });
            }}
          />
        </div>
        <div className="form-item image-item">
          <label className="size-6 m-size-7">相片/影片</label>
          <Upload
            action={action}
            listType="picture"
            onChange={handleImage}
            fileList={images}
            accept="image/*"
            multiple
          >
            <IconPlus size="extra-large" />
          </Upload>
        </div>
        <div className="service-intro-item form-item">
          <label className="size-6 m-size-7">服務介紹</label>
          <textarea
            className="form-input m-form-input h-auto"
            type="text"
            rows={25}
            cols={40}
            placeholder="請輸入服務介紹"
            value={`📍 住宿部分預約須知：

              1.需有按時吃驅蟲藥以及心絲蟲
              
              2.需自備碗、飼料（鮮食）、牽繩、自家小被被（可有可無）
              
              3.需誠實告知狗狗習性，如：護食、不喜歡公狗、比較敏感、有嚴重區域，不喜歡被摸屁屁、耳朵等等
              
              4.信任彼此 ⚠️毛孩如有任何過敏體質或是食物請告知
              
              📍 家中環境介紹：
              
              家裡有廣大的空地（有安排防護）以及24小時過濾水提供（不是自來水或地下水）陽光充足
              
              住宿不關籠（如有關籠需求提前告知）、睡覺睡室內玩耍再室外，環境不是最乾淨但絕對不無聊，安排多項供貓咪玩耍的玩具及高空環境
              
              老寶貝也可來住宿，有獨立空間感不受打擾，清幽住宿，安心養老。
              
              ✅全職的保姆，寶貝24小時陪伴照顧
              
              ✅有照顧奶貓7年以上經驗
              
              ✅曾在中途之家擔任志工多年
              
              📍 到府照顧服務說明：
              
              🕍毛孩活動環境整潔（大小便狀況皆會說明）
              
              🍖餵食、換水補水（寶貝的罐罐需要秤重可以提前告知我喔～）
              
              💡毛孩狀況照實回報，主人安心出門
              
              🤹🏼‍♀️陪伴娛樂玩耍🎢
              
              📸隨時側拍毛孩給家長看，讓家長身歷其中🥰
              
              ✅✅進門前皆會消毒雙手並且告訴家長已抵達家中服務
              
              ⭐️⭐️第一次預約可找時間安排一個免費家訪，與毛孩彼此互相了解、熟悉。也讓家長更認識我，在出遊期間能更安心❤️❤️如果服務日期接近，家訪時間碰不上，會詳細詢問毛孩狀況以及在家中習慣…等等🐶🐱`}
            // onChange={(e) => {
            //   const value = e.target.value;
            //   setInfo({ ...info, job_description: value });
            // }}
          />
        </div>
        <div className="form-item">
          <label className="size-6 m-size-7">可服務時間</label>
          <input
            className="form-input m-form-input"
            type="text"
            placeholder="請輸入可服務時間"
            value="日、一、二、三、四、五、六"
          />
        </div>
        <div className="form-item">
          <label className="size-6 m-size-7 service-type">可服務類型</label>
          <div className="service-check-group">
            <CheckboxGroup
              type="pureCard"
              value={checked}
              direction="vertical"
              aria-label="CheckboxGroup 示例"
              onChange={(checkedValue) => {
                console.log(checkedValue);
                setChecked(checkedValue);
              }}
            >
              <CheckboxInput
                label={"到府代餵"}
                status={feedStatus}
                setStatus={setFeedStatus}
                info={info}
                setInfo={setInfo}
                checked={checked}
              />
              <CheckboxInput
                label={"安親寄宿"}
                status={houseStatus}
                setStatus={setHouseStatus}
                info={info}
                setInfo={setInfo}
                checked={checked}
              />
              <CheckboxInput
                label={"到府美容"}
                status={beautyStatus}
                setStatus={setBeautyStatus}
                info={info}
                setInfo={setInfo}
                checked={checked}
              />
            </CheckboxGroup>
          </div>
        </div>
        <div className="form-item">
          <label className="size-6 m-size-7">可服務地區</label>
          <div>
            <select
              className="form-select"
              name="service_county"
              onChange={(e) => {
                const value = e.target.value;
                setInfo({ ...info, service_county: value });
              }}
            >
              {countyOption.map((county) => {
                if (info?.service_county === county) {
                  return (
                    <option selected value={county}>
                      {county}
                    </option>
                  );
                }
                return <option value={county}>{county}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="btn-groups d-flex justify-content-center gap-4">
          <button
            className="btn-outline-confirm"
            type="button"
            onClick={handleCancel}
          >
            取消
          </button>
          {contextHolder}
          <button type="submit" className="btn-confirm">
            送出
          </button>
        </div>
        {open && (
          <>
            <div className="close-helper ms-auto" onClick={handleOpen}>
              關閉小幫手
            </div>
            <div id="click" ref={lottieRef}></div>
          </>
        )}
      </form>
    </>
  );
};
const HelperInfo = ({ user_id }) => {
  const [open, setOpen] = useState(true);
  const [info, setInfo] = useState(null);
  const [images, setImages] = useState([]);
  // const { isAuthenticated, userId } = useAuth();
  let defaultInfo, defaultImages;
  // console.log(user_id);
  useEffect(() => {
    if (user_id) {
      memberService
        .getHelperInfo(user_id)
        .then((response) => {
          console.log(response);
          const profile = response?.data?.profile[0];
          console.log(profile);
          setInfo(profile);
          defaultInfo = profile;
          if (!profile.cat_helper) {
            setOpen(false);
          }
          const tempImages = response?.data?.images;
          setImages(() => {
            return tempImages.map((image) => {
              return { uid: image.image_id, url: image.file_path };
            });
          });
          defaultImages = images;
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [user_id]);
  console.log(info);
  // if (process.client) {
  //   console.log("運行在客戶端");
  // }

  return (
    <>
      <div className="col-12 col-sm-8 helper-info ">
        <div className="title">
          <p className="size-4 m-size-5 mb-2">
            <span className="my">▍</span>
            小幫手資料
            {open && (
              <Link
                href={`/work/find-helper/${user_id}`}
                // 修改為user_id
                className="to-detail size-7 m-size-7 active-hover"
              >
                點我查看細節頁
              </Link>
            )}
          </p>
        </div>
        {open ? (
          <Open
            open={open}
            setOpen={setOpen}
            info={info}
            setInfo={setInfo}
            images={images}
            setImages={setImages}
            user_id={user_id}
          />
        ) : (
          <>
            <Open
              open={open}
              setOpen={setOpen}
              info={info}
              setInfo={setInfo}
              images={images}
              setImages={setImages}
              user_id={user_id}
            />
            <Close open={open} setOpen={setOpen} user_id={user_id} />
          </>
        )}
      </div>
    </>
  );
};

export default HelperInfo;
