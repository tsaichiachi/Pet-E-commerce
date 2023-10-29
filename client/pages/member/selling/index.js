import React, { useState, useEffect } from "react";
import ListD from "@/components/member/list-d";
import { MdHomeRepairService } from "react-icons/md";
import { RecordTemplate } from "@/components/member/Record-template";
import Link from "next/link";
import memberService from "@/services/member-service";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
import ListUserM from "@/components/member/list-user-m";
import { Pagination } from "antd";
const MemberSelling = () => {
  const [selling, setSelling] = useState([]);
  const [status, setStatus] = useState(1);
  const { isAuthenticated, userId: user_id } = useAuth();
  const [currentRequest, setCurrentRequest] = useState([]);
  const [currentPage, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const router = useRouter();
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
        .getSelling(user_id, status)
        .then((response) => {
          let result = response?.data?.data;
          console.log(result);
          result.reverse();
          setSelling(result);
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
      const sliceInfo = selling.slice(start, end);
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
                // icon={<MdHomeRepairService className="icon me-1" />}
                title={"幫手訂單"}
                item1={"待處理"}
                info={currentRequest}
                setInfo={setSelling}
                status={status}
                setStatus={setStatus}
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

export default MemberSelling;
