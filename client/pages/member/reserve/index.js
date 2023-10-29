import React, { useEffect, useState } from "react";
import ListD from "@/components/member/list-d";
import { BsCalendarDateFill } from "react-icons/bs";
import { RecordTemplate } from "@/components/member/Record-template";
import memberService from "@/services/member-service";
import Link from "next/link";
import ListUserM from "@/components/member/list-user-m";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
import { Pagination } from "antd";
const MemberReserve = () => {
  const [allRequest, setAllRequest] = useState([]);

  const [status, setStatus] = useState(2);
  const { isAuthenticated, userId: user_id } = useAuth();
  const router = useRouter();
  const [currentRequest, setCurrentRequest] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  useEffect(() => {
    // 初始狀態時isAuthenticated為null，等到isAuthenticated有值時(true or false)才做驗證判斷
    if (isAuthenticated === null) {
      return;
    } else {
      if (isAuthenticated === false) {
        router.push("/member/login");
      }
    }
  }, [isAuthenticated]);
  useEffect(() => {
    setPage(1);
    if (user_id) {
      memberService
        .getReserve(user_id, status)
        .then((response) => {
          let result = response?.data?.data;
          console.log(response);
          result.reverse();
          setAllRequest(result);
          console.log(result);
          setCurrentRequest((prev) => {
            const start = 8 * 0;
            const end = 8 * 1;
            const sliceInfo = result.slice(start, end);
            console.log(sliceInfo);
            return sliceInfo;
          });
          setTotalRows(result.length);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [status]);

  const changePage = (page) => {
    console.log("Page: ", page);
    setPage(page);
    setCurrentRequest((prev) => {
      const start = 8 * (page - 1);
      const end = 8 * page;
      const sliceInfo = allRequest.slice(start, end);
      console.log(sliceInfo);
      return sliceInfo;
    });
  };
  return (
    <>
      {isAuthenticated && (
        <>
          <ListUserM />
          <div className="d-flex container-fluid flex-column justify-content-around flex-md-row my-3">
            <ListD />
            <div className="col-12 col-sm-8 sales-and-request">
              <RecordTemplate
                icon={<BsCalendarDateFill className="icon me-1" />}
                title={"預約紀錄"}
                item1={"待回覆"}
                info={currentRequest}
                // setInfo={setAllRequest}
                status={status}
                setStatus={setStatus}
                allRequest={allRequest}
              />
              <Pagination
                current={currentPage}
                total={totalRows}
                pageSize="8"
                showSizeChanger={false}
                rootClassName="cos-pagination"
                onChange={changePage}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MemberReserve;
