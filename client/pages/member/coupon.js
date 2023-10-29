import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import SingleCoupon from "@/components/user/SingleCoupon";
import SingleCouponFree from "@/components/user/singleCouponFree";
import Image from "next/image";

import Cat2 from "@/assets/cat-02.png";

const UserCouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const searchInput = useRef(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const apiUrl = "http://localhost:3005/api/user/user-coupon";

  useEffect(() => {
    axios
      .get(apiUrl)
      .then((response) => {
        setCoupons(response.data.results);
        setFilteredCoupons(response.data.results);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  //console.log(setCoupons);

  const handleFilter = (filter) => {
    //const filter = event.target.value;
    if (filter === "all") {
      setFilteredCoupons(coupons);
      setShowAll(true);
      setActiveFilter("all");
    } else if (filter === "expiring") {
      const expiringCoupons = coupons.filter((coupon) => {
        const endDate = new Date(coupon.end_date);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);
        return daysDiff <= 30 && daysDiff >= 0;
      });
      setFilteredCoupons(expiringCoupons);
      setShowAll(false);
      setActiveFilter("expiring");
    }
  };

  const handleSearch = () => {
    const searchValue = searchInput.current.value;
    if (searchValue === "") {
      setFilteredCoupons(coupons);
      setShowAll(true);
    } else {
      const searchedCoupons = coupons.filter((coupon) => {
        return coupon.coupon_code
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilteredCoupons(searchedCoupons);
      setShowAll(false);
    }
    searchInput.current.value = "";
  };

  return (
    <div className=" my-3 coupon-style">
      <ListUserM />
      <div className="d-flex justify-content-around pt-2">
        <ListD />
        <div className="user-coupon  d-flex flex-column col-md-8 col-12 ">
          <div className="title my-1">
            <p className=" size-4">
              <span className="my">▍</span>
              我的優惠券
            </p>
          </div>

          <div className="coupon-form">
            <div className="couponSearch d-flex gap-3 mx-auto">
              <input
                className="form-input flex-grow-1"
                type="text"
                placeholder="輸入優惠序號"
                ref={searchInput}
              />
              <button className="btn-confirm" onClick={handleSearch}>
                搜尋
              </button>
            </div>

            <div className="border-bottom coupon-filter mb-3 ">
    
                <button
                  className={`px-2 coupon-listBtn ${activeFilter === "all" ? "active " : ""}`}
                  value="all"
                  onClick={() => handleFilter("all")}
                >
                  全部
                  {/* ({coupons.length}) */}
                </button>
         
              {/* <a className='px-2' value='valid' onClick={handleFilter}>有效期內</a> */}
              <button
                className={`px-2 coupon-listBtn ${
                  activeFilter === "expiring" ? "active" : ""
                }`}
                value="expiring"
                onClick={() => handleFilter("expiring")}
              >
                即將到期
                {/* ({filteredCoupons.length}) */}
              </button>
            </div>

            <div className="coupon-wrapper mx-auto">
              {filteredCoupons.map((v) => (
                <div id="container-coupon">
                  <div id="success-box">
                    <div className="cat-box">
                      <Image
                        src={Cat2}
                        width={80}
                        height={80}
                        className="cat2"
                      />
                    </div>
                    <div className="shadow scale" />
                    <div className="message-coupon">
                      <h1 className="priceCode coupon-h1">
                        {v.title}
                      </h1>
                      <p>
                        <p className="couponCode py-1">- {v.coupon_code} -</p>
                        低消 ${v.usage_min}
                        <br />
                        效期 {v.end_date}
                        <br />
                        {/* <a href="#"> -前往購物-</a> */}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* <SingleCoupon /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCouponPage;
