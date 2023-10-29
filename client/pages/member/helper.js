import React, { useEffect } from "react";
import ListD from "@/components/member/list-d";
import HelperInfo from "@/components/member/helper-info";
import ListUserM from "@/components/member/list-user-m";
import Link from "next/link";
import { useAuth } from "@/context/fakeAuthContext";
import { useRouter } from "next/router";
const HelperInfoPage = () => {
  const { isAuthenticated, userId } = useAuth();
  const router = useRouter();
  console.log(isAuthenticated);
  // console.log(userId);
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

  return (
    <>
      {isAuthenticated && (
        <>
          <ListUserM />
          <div className="d-flex container-fluid flex-column justify-content-around flex-md-row my-3">
            <ListD />
            <HelperInfo user_id={userId} />
          </div>
        </>
      )}
    </>
  );
};

export default HelperInfoPage;
