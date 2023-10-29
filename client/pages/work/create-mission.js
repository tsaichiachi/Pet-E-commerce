import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { Cascader } from "antd";
import cityData from "@/data/CityCountyData.json";
import { DatePicker } from "@douyinfe/semi-ui";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";
import { register } from "swiper/element";
import workService from "@/services/work-service";
import { Upload, Select } from "@douyinfe/semi-ui";
import { IconPlus } from "@douyinfe/semi-icons";
import Swal from "sweetalert2";
import Link from "next/link";
const options = cityData.map((city) => {
  return {
    value: city.CityName,
    label: city.CityName,
    children: city.AreaList.map((area) => {
      return { value: area.ZipCode, label: area.AreaName };
    }),
  };
});

const CreateMission = () => {
  const user = 1;
  const uploadRef = useRef();
  const router = useRouter();
  const imgRef = useRef();
  const today = new Date();
  const [startDay, setStartDay] = useState(undefined);
  const [endDay, setEndDay] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [area, setArea] = useState(undefined);
  const [imageList, setImageList] = useState([]);
  const [morning, setMorning] = useState(false);
  const [noon, setNoon] = useState(false);
  const [night, setNight] = useState(false);
  const onChange = (value, selectedOptions) => {
    // console.log(value, selectedOptions);
    setCity(selectedOptions[0].label);
    setArea(selectedOptions[1].label);
  };
  const handleDateChange = (date, dateString) => {
    console.log("date changed", date, dateString);
    setStartDay(dateString[0]);
    setEndDay(dateString[1]);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.querySelector("#form");
    const formData = new FormData(form);
    const price = formData.get("price");
    const img = document.getElementById("missionImage");
    if (!startDay || !endDay || !city || !area || !price) {
      // alert("請完整填寫所有必填項目");
      Swal.fire({
        timer: 1500,
        icon: "warning",
        title: "請完整填寫所有必填項目",
        showConfirmButton: false,
      });
      return;
    }
    imageList.forEach((image) => {
      formData.append("missionImage", image);
    });
    formData.append("user_id", user);
    formData.append("startDay", startDay);
    formData.append("endDay", endDay);
    formData.append("city", city);
    formData.append("area", area);
    formData.append("morning", morning);
    formData.append("noon", noon);
    formData.append("night", night);
    // uploadRef.current.upload(); //照片手動上傳
    workService
      .createMission(formData)
      .then((response) => {
        if (response?.data?.status === 200) {
          // console.log(response);
          // alert("新增任務成功，準備跳轉");
          Swal.fire({
            timer: 1500,
            icon: "success",
            title: "新增任務成功",
            text: "即將為您跳轉至任務頁",
            showConfirmButton: false,
          });
          setTimeout(() => {
            router.push(`/work/find-mission/${response.data.insertId}`);
          }, 1800);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  // const action = "http://localhost:3005/api/work/mission/image";
  const action = "http://localhost:3000/work/create-mission";
  const getPrompt = (isListType) => {
    let basicStyle = {
      display: "flex",
      alignItems: "center",
      color: "grey",
      height: isListType ? "100%" : 32,
    };
    let marginStyle = {
      left: { marginRight: 10 },
      right: { marginLeft: 10 },
    };
    let style = { ...basicStyle, ...marginStyle["right"] };

    return <div style={style}>請上傳相關相片</div>;
  };
  const positions = ["right", "bottom"];
  return (
    <div className="container">
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
            <Link href="/work/find-mission" className="active-hover">
              小貓上工(找任務)
            </Link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            新增任務
          </li>
        </ol>
      </nav>

      <form
        id="form"
        name="form"
        onSubmit={handleSubmit}
        className="create-mission"
      >
        <div className="block">
          <div className="block-title size-5">編輯任務</div>
          <div className="block-body">
            <div className="body-item">
              <label className="size-6">
                任務名稱<span className="text-danger">*</span>
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="請輸入任務名稱"
                name="title"
              />
            </div>
            <div className="body-item">
              <label className="size-6">
                任務日期<span className="text-danger">*</span>
              </label>
              <br />
              <DatePicker
                // disabledDate={startDead}
                placeholder={["開始日期", "結束日期"]}
                autoSwitchDate={false}
                type={"dateRange"}
                dropdownClassName="dateRangeTest"
                // renderFullDate={renderFullDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="body-item">
              <label className="size-6">任務相片</label>

              {/* <input
              id="missionImage"
              name="missionImage"
              multiple
              ref={imgRef}
              type="file"
            /> */}
              <Upload
                action={action}
                prompt={getPrompt(true)}
                promptPosition={"right"}
                listType="picture"
                name="missionImage"
                ref={uploadRef}
                multiple
                // uploadTrigger="custom"
                onSuccess={(responseBody, file, fileList) => {
                  console.log(fileList);
                  setImageList(() => {
                    let files = [];
                    fileList.map((file) => {
                      files = [...files, file.fileInstance];
                    });
                    console.log(files);
                    return files;
                    // return fileList[0].fileInstance;
                  });
                }}
              >
                <IconPlus size="extra-large" />
              </Upload>
            </div>
            <div className="body-item">
              <label className="size-6">
                任務地點<span className="text-danger">*</span>
              </label>

              <Cascader
                options={options}
                onChange={onChange}
                placeholder="選擇縣市"
                className="location-select"
                popupClassName="location-cascader"
              />

              <input
                placeholder="請輸入街道地址"
                className="form-input m-size-7"
                name="location_detail"
              />
            </div>
            <div className="body-item">
              <label className="size-6">任務類型</label>

              <div></div>
              <select className="form-select" name="mission_type">
                <option selected value={1}>
                  到府照顧
                </option>
                <option value={2}>安親寄宿</option>
                <option value={3}>到府美容</option>
                <option value={4}>行為訓練</option>
                <option value={5}>醫療護理</option>
              </select>
            </div>
            <div className="body-item">
              <label className="size-6">任務說明</label>

              <textarea
                className="form-area"
                placeholder="請輸入任務說明"
                name="description"
                rows={8}
              />
            </div>
            <div className="body-item">
              <label className="size-6">聯絡時段</label>
              <Select
                multiple
                // style={{ width: "320px" }}
                placeholder="請選擇可聯絡時段"
                onChange={(string, number, array) => {
                  setMorning(string.some((item) => item === "morning"));
                  setNoon(string.some((item) => item === "noon"));
                  setNight(string.some((item) => item === "night"));
                }}
              >
                <Select.Option value="morning">9:00~12:00</Select.Option>
                <Select.Option value="noon">13:00~18:00</Select.Option>
                <Select.Option value="night">19:00~21:00</Select.Option>
              </Select>
            </div>
          </div>
        </div>
        <div className="block">
          <div className="block-title size-5">任務預算</div>
          <div className="block-body">
            <div className="body-item">
              <label className="size-6">
                預算金額<span className="text-danger">*</span>
              </label>
              <br />
              <input
                className="form-input"
                type="number"
                placeholder="請輸入任務預算"
                name="price"
              />
            </div>
            <div className="body-item">
              <label className="size-6">支付方式</label>
              <br />
              <select className="form-select" name="payment">
                <option selected value={1}>
                  現金
                </option>
                <option value={2}>轉帳匯款</option>
              </select>
            </div>
          </div>
        </div>
        <div className="block"></div>
        <div className="btn-groups d-flex justify-content-center ">
          <button
            type="button"
            className="btn-outline-brown m-2"
            onClick={() => {
              router.push("/work/find-mission");
            }}
          >
            取消
          </button>
          <button type="submit" className="btn-brown m-2">
            送出
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMission;
