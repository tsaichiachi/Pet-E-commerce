import React, { useState, useEffect } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import { HiClipboardList } from "react-icons/hi";
import HistoryStatus from "@/components/member/history-status";
import HistoryStatusAll from "@/components/member/history-statusAll";
import { useRouter } from "next/router";

import axios from "axios";

export default function History() {
  const [currentScreen, setCurrentScreen] = useState("2");
  const [history, setHistory] = useState([]);
  const [count, setCount] = useState([]);
  const router = useRouter();
  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState();

  const handleButtonClick = (screenName) => {
    setCurrentScreen(screenName);
  };

  const getHistory = async (id) => {
    await axios
      .get(`http://localhost:3005/api/member-history/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setHistory(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getCount = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/member-history/count/count`
      );
      const data = response.data.result;
      console.log(data);
      setCount(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  let idCounts = [];
  count.forEach((v) => {
    const mission_id = v.mission_id;
    if (idCounts[mission_id]) {
      idCounts[mission_id]++; // 如果 ID 已经存在，增加计数
    } else {
      idCounts[mission_id] = 1; // 如果 ID 不存在，初始化计数为 1
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    // 沒有token
    if (!token) {
      router.push("/");
    }
    console.log(id);
    console.log(token);
    getHistory(id);
    getCount();
  }, []);

  return (
    <>
      <div className="my-3">
        <ListUserM />
        <div className="d-flex justify-content-around py-2">
          <ListD />
          <div className="d-flex flex-column col-12 col-md-8 history">
            <div className="d-flex justify-content-between">
              <p className="size-4 big mb-2 ">
                <span className="my">▍</span>刊登紀錄
              </p>

              <div className="">
                <select
                  className="form-select"
                  style={{ width: "200px" }}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option>排序方法</option>
                  <option value={1}>刊登日期：由近到遠</option>
                  <option value={2}>刊登日期：由遠到近</option>
                </select>
              </div>
            </div>

            <div className="">
              <button
                className={` size-6 listbutton first ${
                  currentScreen === "2" ? "pressed" : ""
                }`}
                onClick={() => {
                  handleButtonClick("2");
                  setActivePage(1);
                }}
              >
                全部
              </button>
              <button
                className={` size-6 listbutton ${
                  currentScreen === "1" ? "pressed" : ""
                }`}
                onClick={() => {
                  handleButtonClick("1");
                  setActivePage(1);
                }}
              >
                刊登中
              </button>
              <button
                className={` size-6 listbutton ${
                  currentScreen === "0" ? "pressed" : ""
                }`}
                onClick={() => {
                  handleButtonClick("0");
                  setActivePage(1);
                }}
              >
                已下架
              </button>
            </div>
            {currentScreen === "2" && (
              <HistoryStatusAll
                history={history}
                getHistory={getHistory}
                idCounts={idCounts}
                activePage={activePage}
                setActivePage={setActivePage}
                sort={sort}
                setHistory={setHistory}
              />
            )}
            {currentScreen === "0" && (
              <HistoryStatus
                history={history}
                getHistory={getHistory}
                currentScreen={currentScreen}
                idCounts={idCounts}
                activePage={activePage}
                setActivePage={setActivePage}
                sort={sort}
                setHistory={setHistory}
              />
            )}
            {currentScreen === "1" && (
              <HistoryStatus
                history={history}
                getHistory={getHistory}
                currentScreen={currentScreen}
                idCounts={idCounts}
                activePage={activePage}
                setActivePage={setActivePage}
                sort={sort}
                setHistory={setHistory}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
