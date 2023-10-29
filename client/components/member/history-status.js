import React, { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import Pagination from "@/components/pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  useInView,
} from "framer-motion";

export default function HistoryStatusOne({
  history,
  getHistory,
  currentScreen,
  idCounts,
  activePage,
  setActivePage,
  sort,
  setHistory,
}) {
  if (sort == 1) {
    console.log(sort);
    const newHistory = history.sort((a, b) => b.mission_id - a.mission_id);
    console.log(newHistory);
    setHistory(newHistory);
  } else if (sort == 2) {
    const newHistory = history.sort((a, b) => a.mission_id - b.mission_id);
    console.log(newHistory);
    setHistory(newHistory);
  }

  const router = useRouter();

  const itemsPerPage = 5;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const type = history.filter((v) => v.mission_status == currentScreen);
  const currentData = type.slice(startIndex, endIndex);

  const [showcontent, setShowContent] = useState(false);
  const [id, setId] = useState(0);
  const toggleContent = (i) => {
    setShowContent(!showcontent);
    setId(i);
  };

  function CustomHTMLRenderer({ htmlContent }) {
    return (
      <div className="item">
        <ul
          className="item-content size-7"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  const transferDate = (date) => {
    const newDay = dayjs(date).format("YYYY-MM-DD");
    return newDay;
  };

  const removetype = async (userid, id) => {
    console.log(userid);
    console.log(id);
    try {
      const response = await axios.put(
        `http://localhost:3005/api/member-history/updatetype`,
        { id }
      );
    } catch (error) {
      console.error("Error:", error);
    }
    getHistory(userid);
  };

  console.log(idCounts);


  const [missionActive, setMissionActive] = useState("move");
  const missionVariant = {
    // 一開始消失，畫面從下側往上移入出現
    initial: {
      opacity: 0,
      y: -10,
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
      transition: { duration: 0.4 },
    }),
  };

  return (
    <>
      <div className="bg">
        {history.length == 0 ? (
          <>
            <div className="nohistory">
              <div className=" d-flex justify-content-center mt-5">
                <p className="size-3">尚無刊登紀錄，快去小貓上工逛逛吧！</p>
              </div>
              <div className="d-flex justify-content-center mt-5">
                <button
                  className="btn-confirm size-4"
                  onClick={() => {
                    router.push("/work/find-mission");
                  }}
                >
                  前往小貓上工
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {currentData.map((v, i) => {
              return (
                <>
                  <p className="size-6 title d-md-none d-block ps-3 bg">
                    任務主題：{v.title}
                  </p>
                  <div className="d-flex justify-content-between py-2 border-bottom mx-md-5 mx-3">
                    <div className="col-md-8 col-9">
                      <p className="size-6 title d-md-block d-none">
                        任務主題：
                        <Link
                          href={`/work/find-mission/${v.mission_id}`}
                          className="size-6"
                        >
                          {v.title}
                        </Link>
                      </p>
                      <p className="size-7" key={i}>
                        <span>刊登日期：</span>
                        {transferDate(v.post_date)}
                      </p>
                      <p className="size-7">
                        <span>任務費用：</span>NT${v.price}/次
                      </p>
                      <p className="size-7">
                        <span>任務地點：</span>
                        {v.city}
                        {v.area}
                        {v.location_detail}
                      </p>
                      <p className="size-7">
                      <span>任務時間：</span>
                        {transferDate(v.start_date)}~{transferDate(v.end_date)}
                      </p>
                      <p className="size-7 content">
                        <span>任務內容：</span>
                        {showcontent && id === v.mission_id ? (
                          <motion.div className=""  initial={"initial"}
                          animate={
                            missionActive === "move"
                              ? "move"
                              : missionActive === "exit"
                                ? "exit"
                                : "initial"
                          }
                          variants={missionVariant}
                          // (index + 1) % 3 == 1 ? 0 : (index + 1) % 3 == 2 ? 1 : 2 整排移動參數
                          custom={i}
                          whileInView="singleMove"
                          viewport={{
                            once: true,
                          }}><CustomHTMLRenderer htmlContent={v.description} /></motion.div>
                        ) : (
                          ""
                        )}

                        <button
                          className="btn-confirm"
                          onClick={() => {
                            if (!showcontent) {
                              setShowContent(true);
                              setId(v.mission_id);
                            } else if (showcontent && id !== v.mission_id) {
                              setId(v.mission_id);
                            } else {
                              setShowContent(false);
                            }
                          }}
                        >
                          {showcontent && id === i ? "隱藏內容" : "顯示內容"}
                        </button>
                      </p>

                      <p className="size-7 follow">
                        {idCounts[v.mission_id] == undefined
                          ? "0"
                          : idCounts[v.mission_id]}
                        人追蹤
                      </p>
                    </div>
                    <div className="d-flex align-items-center col-3 col-md-4 ps-md-5 ms-md-5 ms-0">
                      {v.mission_status === 1 ? (
                        <button
                          className=" btn-confirm m-2 size-6"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal1"
                          onClick={() => {
                            removetype(v.post_user_id, v.mission_id);
                          }}
                        >
                          下架任務
                        </button>
                      ) : (
                        <div className="m-2 size-6 remove px-2 py-2">
                          已下架
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })}

            <div
              class="modal fade"
              id="exampleModal1"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">
                      通知
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body">已將此任務下架</div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-confirm"
                      data-bs-dismiss="modal"
                    >
                      關閉
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              itemsPerPage={itemsPerPage}
              total={type}
              activePage={activePage}
              setActivePage={setActivePage}
            />
          </>
        )}
      </div>
    </>
  );
}
