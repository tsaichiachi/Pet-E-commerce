import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Pagination from "@/components/pagination";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  motion,
  useAnimationControls,
  AnimatePresence,
  useInView,
} from "framer-motion";

export default function JobStatusTwo({
  job,
  currentScreen,
  getJob,
  idCounts,
  activePage,
  setActivePage,
}) {
  const itemsPerPage = 5;

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  console.log(job);
  let type = [];
  if (currentScreen == 0 || currentScreen == 1) {
    type = job.filter((v) => v.mission_status == currentScreen);
  } else if (currentScreen == 2) {
    type = job.filter((v) => v.record_mission_id == null);
  } else if (currentScreen == 3) {
    type = job.filter((v) => v.record_mission_id !== null);
  } else {
    type = job;
  }

  const currentData = type.slice(startIndex, endIndex);
  const router = useRouter();

  const [showcontent, setShowContent] = useState(false);
  const [id, setId] = useState(0);
  const toggleContent = (i) => {
    setShowContent(!showcontent);
    setId(i);
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // 切換收藏狀態
  };

  const transferDate = (date) => {
    const newDay = dayjs(date).format("YYYY-MM-DD");
    return newDay;
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

  const deletefav = async (user_id, id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/api/member-joblist/${id}`
      );
    } catch (error) {
      console.error("Error:", error);
    }
    getJob(user_id);
  };

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
        {job.length == 0 ? (
          <>
            <div className="nojoblist">
              <div className=" d-flex justify-content-center mt-5">
                <p className="size-3">尚無收藏紀錄，快去小貓上工逛逛吧！</p>
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
                  <div className="d-md-none d-flex pt-3 ps-3 " key={i}>
                    <p className="size-6 title">
                      <span>任務主題：</span>
                      {v.title}
                      {v.mission_status == 0 ? (
                        <>
                          <span className="title1">(已關閉)</span>
                        </>
                      ) : (
                        <>
                          <span className="title1">(刊登中) </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div
                    className="d-flex border-bottom py-md-3 justify-content-between mx-md-5 ps-3 bg"
                    key={i}
                  >
                    <div className=" d-flex ">
                      {/* 1 */}
                      <div className="">
                        <div className="d-md-flex d-none">
                          <p className="size-6 title">
                            <span>任務主題：</span>
                            <Link
                              href={`/work/find-mission/${v.mission_id}`}
                              className="size-6"
                            >
                              {v.title}
                            </Link>
                          </p>
                          {v.mission_status == 0 ? (
                            <>
                              <p className="size-7 status mt-1 ms-3">
                                (已關閉)
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="size-7 status mt-1 ms-3">
                                (刊登中)
                              </p>
                            </>
                          )}
                        </div>

                        <p className="size-7 ">
                          <span>刊登者：</span>
                          {v.post_name}
                        </p>
                        <p className="size-7 ">
                          <span>任務費用：</span>
                          {v.price}元/次
                        </p>
                        <p className="size-7">
                          <span>任務地點：</span>
                          {v.city}
                          {v.area}
                          {v.location_detail}
                        </p>
                        <p className="size-7">
                          <span>任務時間：</span>
                          {transferDate(v.post_date)}
                        </p>
                        <p className="size-7">
                          <span>任務內容：</span>
                          {showcontent && id === i ? (
                            <motion.div
                              className=""
                              initial={"initial"}
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
                              }}
                            >
                              <CustomHTMLRenderer htmlContent={v.description} />
                            </motion.div>
                          ) : (
                            ""
                          )}
                          <button
                            className="btn-confirm"
                            onClick={() => {
                              if (!showcontent) {
                                setShowContent(true);
                                setId(i);
                              } else if (showcontent && id !== i) {
                                setId(i);
                              } else {
                                setShowContent(false);
                              }
                            }}
                          >
                            {showcontent && id === i ? "隱藏內容" : "顯示內容"}
                          </button>
                        </p>
                        <p className="size-7 follow mt-2">
                          {idCounts[v.mission_id] == undefined
                            ? "0"
                            : idCounts[v.mission_id]}
                          人追蹤
                        </p>
                      </div>
                    </div>
                    {/* 2 */}
                    <div className="me-1 me-md-0 d-flex flex-column align-items-center justify-content-center col-md-2 col-4">
                      <button
                        className="btn-outline-confirm size-6 text-center px-3 py-2 mb-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal1"
                        onClick={() => {
                          deletefav(v.user_id, v.mission_fav_id);
                        }}
                      >
                        取消追蹤
                      </button>






                      {v.mission_status == 0 ? (
                        v.record_mission_id == null ? (
                          <>
                            <p className="size-6 text-center apply px-3 py-2">
                              未應徵
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="apply p-2">
                              <p className="size-7 text-center">
                                {transferDate(v.job_date)}
                              </p>
                              <p className="size-7 text-center">已應徵</p>
                            </div>
                          </>
                        )
                      ) : v.record_mission_id == null ? (
                        <>
                          <button
                            className="btn-confirm size-6 text-center px-3 py-2"
                            onClick={() => {
                              router.push(`/work/find-mission/${v.mission_id}`);
                            }}
                          >
                            立即應徵
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="apply p-2">
                            <p className="size-7 text-center">
                              {transferDate(v.job_date)}
                            </p>
                            <p className="size-7 text-center">已應徵</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
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
                        <div class="modal-body">已取消追蹤此任務</div>
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
                </>
              );
            })}
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
