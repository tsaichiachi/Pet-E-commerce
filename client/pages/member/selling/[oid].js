import React, { useEffect, useState } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsCalendarDateFill } from "react-icons/bs";
import memberService from "@/services/member-service";
import { MdHomeRepairService } from "react-icons/md";
import { RecordDetailTemplate } from "@/components/member/Record-template";
import { useAuth } from "@/context/fakeAuthContext";
import Swal from "sweetalert2";
const SellingDetailPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState(1);
  const [detail, setDetail] = useState({});
  const { oid } = router.query;
  const { isAuthenticated, userId } = useAuth();
  const [helperInfo, setHelperInfo] = useState(null);
  const [customInfo, setCustomInfo] = useState(null);

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
    memberService
      .getReserveDetail(oid)
      .then((response) => {
        const info = response.data.order;
        if (response?.data?.status === 200) {
          setStatus(info.status);
          setCustomInfo(response.data.customer_info);
          setHelperInfo(response.data.helper_info);
          switch (info.status) {
            case 1:
              setDetail({ ...info, status: "待處理" });
              break;
            case 2:
              setDetail({ ...info, status: "進行中" });
              break;
            case 3:
              setDetail({ ...info, status: "已完成" });
              break;
            case 4:
              setDetail({ ...info, status: "已取消" });
              break;
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, [oid]);

  const handleReject = () => {
    Swal.fire({
      title: "是否確定婉拒此筆訂單?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定",
      cancelButtonText: "返回",
      reverseButtons: true,
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        memberService
          .setReserveStatus(oid, 4)
          .then((response) => {
            const result = response.data;
            console.log(response.data);
            if (result.status === 200 && result.affectedRows === 1) {
              Swal.fire({
                timer: 1500,
                icon: "success",
                title: "取消成功!",
                text: "您已婉拒此筆收到訂單",
                showConfirmButton: false,
              });
              setTimeout(() => {
                router.push("/member/selling");
              }, 1800);
            }
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              timer: 1500,
              icon: "error",
              title: "取消失敗",
              text: "請稍後重試一次",
              showConfirmButton: false,
            });
          });
      }
    });
  };
  const handleResolve = () => {
    memberService
      .setReserveStatus(oid, status + 1)
      .then((response) => {
        const result = response.data;
        // console.log(response.data);
        if (result.status === 200 && result.affectedRows === 1) {
          Swal.fire({
            timer: 1800,
            icon: "success",

            title: status === 1 ? "接取成功!" : "您已完成此次服務!",
            text: status === 1 ? "您已接受此次預約" : "感謝您對貓貓的幫助!",
            showConfirmButton: false,
          });
          setTimeout(() => {
            router.push("/member/selling");
          }, 2000);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      {isAuthenticated && (
        <>
          <ListUserM />
          <div className="d-flex container-fluid flex-column justify-content-around flex-md-row my-3">
            <ListD />
            <div className="col-12 col-sm-8 sales-record-detail">
              <RecordDetailTemplate
                icon={<MdHomeRepairService className="icon me-1" />}
                title={"幫手訂單"}
                detail={detail}
                setDetail={setDetail}
                helperInfo={helperInfo}
                customInfo={customInfo}
              />
              {status && status !== 3 && status !== 4 && (
                <div className="d-flex justify-content-end mb-5">
                  <button
                    className="btn-outline-confirm m-2"
                    onClick={handleReject}
                  >
                    {status === 1 ? "婉拒預約" : "取消服務"}
                  </button>
                  <button className="btn-confirm m-2" onClick={handleResolve}>
                    {status === 1 ? "接受預約" : "完成服務"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SellingDetailPage;
