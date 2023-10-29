import React from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import { RiFileList3Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import axios from "axios";
import OrderStatus from "@/components/member/order-status";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from 'next/router';


export default function Order() {
  const [currentScreen, setCurrentScreen] = useState("1");
  const [order, setOrder] = useState([])
  const router = useRouter();
  const [sort,setSort]=useState()
  const [activePage, setActivePage] = useState(1)

  const getOrder = async (userId) => {
    await axios.get(`http://localhost:3005/api/member-order/${userId}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setOrder(data)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id")
    // 沒有token
    if (!token) {
      router.push("/")
    }
    console.log(id);
    console.log(token);
    getOrder(id);
  }, []);

  // useEffect(() => {
  //     getOrder(id)
  //   }, [])

  const handleButtonClick = (screenName) => {
    setCurrentScreen(screenName);
  };


  return (
    <div className="my-3">
      <ListUserM />
      <div className="d-flex justify-content-around py-2">
        <ListD />
        <div className="d-flex flex-column col-md-8 col-12 order">

          <div className="d-flex justify-content-between">
            <p className="size-4 big mb-2">
              <span className="my">▍</span>我的訂單
            </p>

            <div className="">
              <select
                className="form-select"
                style={{ width: "200px" }}
                onChange={(e) =>
                 setSort(e.target.value)
                }
              >
              <option>
                排序方法
              </option>
                <option value={1} >
                  訂單日期：由近到遠
                </option>
                <option value={2} >
                  訂單日期：由遠到近
                </option>
              </select>
            </div>
          </div>


          <div className="col-12">

            <button
              className={` size-6 listbutton first ${currentScreen === "1" ? 'pressed' : ''}`}
              onClick={() => {
                handleButtonClick("1");
                setActivePage(1)
              }}
            >
              待出貨
            </button>


            <button
              className={` size-6 listbutton ${currentScreen === "2" ? 'pressed' : ''}`}
              onClick={() => {
                handleButtonClick("2");
                setActivePage(1)

              }}
            >
              運送中
            </button>
            <button
              className={` size-6 listbutton ${currentScreen === "3" ? 'pressed' : ''}`}
              onClick={() => {
                handleButtonClick("3");
                setActivePage(1)

              }}
            >
              已完成
            </button>
            <button
              className={` size-6 listbutton  ${currentScreen === "4" ? 'pressed' : ''}`}
              onClick={() => {
                handleButtonClick("4");
                setActivePage(1)

              }}
            >
              已取消
            </button>
          </div>
          <OrderStatus order={order} currentScreen={currentScreen} activePage={activePage} setActivePage={setActivePage} sort={sort} setOrder={setOrder}/>
        </div>
      </div>
    </div>

  );
}