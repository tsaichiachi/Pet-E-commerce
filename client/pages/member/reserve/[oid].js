import React, { useEffect, useState } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import Link from "next/link";
import { RecordDetailTemplate } from "@/components/member/Record-template";
import { BsCalendarDateFill } from "react-icons/bs";
import memberService from "@/services/member-service";
import { Modal, Button, Rating, Notification } from "@douyinfe/semi-ui";
// import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const CreateReview = ({ user_id, detail, oid, setIsReviewed }) => {
  // const user = 1;
  const [visible, setVisible] = useState(false);
  const [starValue, setStarValue] = useState(0);
  const [starHover, setStarHover] = useState(undefined);
  const [review, setReview] = useState("");
  const labels = {
    1: "很糟糕",
    2: "糟糕",
    3: "普通",
    4: "不錯",
    5: "超級棒!",
  };
  const showDialog = () => {
    setVisible(true);
  };
  const handleSubmit = () => {
    memberService
      .createReview(
        detail.case_id,
        user_id,
        detail.helper_userId,
        review,
        starValue
      )
      .then(async (response) => {
        // console.log(response.data);
        if (response.data.status === 200) {
          setIsReviewed(true);
          await setVisible(false);
          Notification.success({
            duration: 3,
            position: "top",
            title: "感謝您的評價",
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleCancel = () => {
    setStarHover(undefined);
    setStarValue(0);
    setVisible(false);
    console.log("Cancel button clicked");
  };
  const handleAfterClose = () => {
    console.log("After Close callback executed");
  };
  return (
    <>
      <button className="btn-outline-confirm mt-2" onClick={showDialog}>
        給予評價
      </button>
      <Modal
        title="評價此次服務"
        visible={visible}
        afterClose={handleAfterClose} //>=1.16.0
        closeOnEsc={true}
        maskClosable={false}
        closable={false}
        className="reserve-review-modal"
        footer={
          <div className="reserve-review-footer">
            <Button type="tertiary" onClick={handleCancel}>
              取消
            </Button>
            <button
              className="btn-confirm"
              disabled={!starValue}
              onClick={handleSubmit}
            >
              確認
            </button>
          </div>
        }
      >
        <div className="size-6 mb-2">滿意度</div>
        <Rating
          value={starValue}
          onHoverChange={(value) => {
            setStarHover(value);
          }}
          onChange={(value) => {
            setStarValue(value);
          }}
        />
        {starValue !== null && (
          <span>{labels[starHover ? starHover : starValue]}</span>
        )}
        <div>
          <textarea
            className="form-area mt-2 size-7"
            rows={6}
            cols={50}
            type="text"
            onChange={(e) => {
              setReview(e.target.value);
            }}
          ></textarea>
        </div>
      </Modal>
    </>
  );
};

const CheckReview = ({ review }) => {
  // const user = 1;
  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setVisible(false);
  };

  const handleAfterClose = () => {
    console.log("After Close callback executed");
  };
  return (
    <>
      <button className="btn-outline-confirm mt-2" onClick={showDialog}>
        查看評價
      </button>
      <Modal
        title="您的服務評價"
        visible={visible}
        afterClose={handleAfterClose} //>=1.16.0
        closeOnEsc={true}
        maskClosable={false}
        closable={false}
        className="reserve-review-modal"
        footer={
          <div className="reserve-review-footer">
            <button className="btn-confirm" onClick={handleOk}>
              關閉
            </button>
          </div>
        }
      >
        {/* {starValue !== null && (
          <span>{labels[starHover ? starHover : starValue]}</span>
        )}
        <div>
          <textarea
            type="text"
            onChange={(e) => {
              setReview(e.target.value);
            }}
          ></textarea>
        </div> */}
        <div className="review-card-head d-flex justify-content-start align-items-start">
          <img className="review-card-avatar" src={`${review?.cover_photo}`} />
          <div className="review-card-info d-flex flex-column justify-content-between ps-2">
            <div className="username size-6 mb-1">{review?.name}</div>
            <div className="ranking my-1">
              <Rating
                disabled
                value={review && review?.star_rating}
                onHoverChange={(value) => {
                  setStarHover(value);
                }}
                onChange={(value) => {
                  setStarValue(value);
                }}
              />
            </div>
            <div className="date size-7">{review?.review_date}</div>
          </div>
        </div>
        <div className="review-card-body mt-3 size-7">
          {review?.review_content}
        </div>
      </Modal>
    </>
  );
};
const ReserveDetailPage = () => {
  const router = useRouter();
  const [detail, setDetail] = useState({});
  const [status, setStatus] = useState(1);
  const [review, setReview] = useState(null);
  const [isReviewed, setIsReviewed] = useState(false);
  const [helperInfo, setHelperInfo] = useState(null);
  const [customInfo, setCustomInfo] = useState(null);
  const { oid } = router.query;
  const { isAuthenticated, userId: user_id } = useAuth();
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
        console.log(response.data);
        const info = response.data.order;
        setStatus(info.status);
        setCustomInfo(response.data.customer_info);
        setHelperInfo(response.data.helper_info);
        if (response?.data?.status === 200) {
          switch (info.status) {
            case 1:
              setDetail({ ...info, status: "待回覆" });
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
  useEffect(() => {
    if (status === 3) {
      memberService
        .getReview(detail.case_id)
        .then((response) => {
          if (response.data.data.review_count === 1) {
            setIsReviewed(true);
            console.log(response.data.data);
            setReview(response.data.data);
          } else {
            setIsReviewed(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [status, isReviewed]);
  const handleReject = () => {
    // alert("是否確定取消預約?");
    Swal.fire({
      title: "是否確定取消預約?",
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
                title: "取消預約成功!",
                text: "您已取消本次預約服務",
                showConfirmButton: false,
              });
              setTimeout(() => {
                router.push("/member/reserve");
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

    Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    // Swal.fire({
    //   title: "確定是否取消預約?",
    //   // text: "You won't be able to revert this!",
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonText: "確定",
    //   cancelButtonText: "返回",
    //   reverseButtons: true,
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     swalWithBootstrapButtons.fire(
    //       "Deleted!",
    //       "Your file has been deleted.",
    //       "success"
    //     );
    //   } else if (
    //     /* Read more about handling dismissals below */
    //     result.dismiss === Swal.DismissReason.cancel
    //   ) {
    //     swalWithBootstrapButtons.fire(
    //       "Cancelled",
    //       "Your imaginary file is safe :)",
    //       "error"
    //     );
    //   }
    // });
  };

  return (
    <>
      {isAuthenticated && (
        <>
          <div className="d-flex justify-content-end">
            {/* mobile版的左側tab */}
          </div>
          <ListUserM />
          <div className="d-flex container-fluid flex-column justify-content-around flex-md-row my-3 ">
            {/* <ListUserM /> */}
            <ListD />
            <div className="col-12 col-sm-8 sales-record-detail">
              <RecordDetailTemplate
                icon={<BsCalendarDateFill className="icon me-1" />}
                title={"預約紀錄"}
                detail={detail}
                setDetail={setDetail}
                helperInfo={helperInfo}
                customInfo={customInfo}
              />

              {status && status !== 3 && status !== 4 && (
                <div className="d-flex justify-content-end mb-5">
                  <button
                    className="btn-outline-confirm mt-2"
                    onClick={handleReject}
                  >
                    {status === 1 ? "取消預約" : "取消服務"}
                  </button>
                </div>
              )}
              {status && status === 3 && !isReviewed && (
                <div className="d-flex justify-content-end mb-5">
                  <CreateReview
                    detail={detail}
                    oid={oid}
                    setIsReviewed={setIsReviewed}
                    user_id={user_id}
                  />
                </div>
              )}
              {status && status === 3 && isReviewed && (
                <div className="d-flex justify-content-end mb-5">
                  <CheckReview review={review} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReserveDetailPage;
