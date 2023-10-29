import React, { useState, useEffect } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import Pagination from "@/components/pagination";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [wishlisttype, setWishlistType] = useState([]);
  const { cart, setCart } = useCart();
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = wishlist.slice(startIndex, endIndex);
  const router = useRouter();

  const handleSelectChange = (pid, v) => {
    const newList = wishlist.map((w) => {
      if (w.product_id === pid) {
        return {
          ...w, // 复制原始对象的属性
          product_type: v, // 更新type_id
        };
      }
      return w; // 其他项目不受影响，保持原样
    });
    setWishlist(newList);
    console.log(wishlist);
  };

  const addCart = async (user_id, id, type) => {
    const have = cart.find(
      (v) => v.product_id == id && v.product_type_id == type
    );

    console.log(have);
    if (have === undefined) {
      console.log(cart);

      try {
        const response = await axios.put(
          `http://localhost:3005/api/member-wishlist/cart/${user_id}`,
          { id, type }
        );
      } catch (error) {
        console.error("Error:", error);
      }
      getCart(user_id);
    } else {
      try {
        const newQuantity = have.quantity + 1;
        console.log(newQuantity);
        console.log(id);
        const response = await axios.put(
          `http://localhost:3005/api/member-wishlist/cartplus/${user_id}`,
          { id, newQuantity, type }
        );
      } catch (error) {
        console.error("Error:", error);
      }
      getCart(user_id);
    }
  };

  const deleteWishlist = async (user_id, id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3005/api/member-wishlist/${id}/${user_id}`
      );
      // const newWishlist = wishlist.filter((v) => v.collection_id !== id);
      // setWishlist(newWishlist);
    } catch (error) {
      console.error("Error:", error);
    }
    getWishlist(user_id);
  };

  const getWishlist = async (id) => {
    await axios
      .get(`http://localhost:3005/api/member-wishlist/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setWishlist(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getWishlistType = async (id) => {
    await axios
      .get(`http://localhost:3005/api/member-wishlist/type/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setWishlistType(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const getCart = (id) => {
    axios
      .get(`http://localhost:3005/api/product/cart/cart/${id}`)
      .then((response) => {
        const data = response.data.result;
        const newData = data.map((v) => {
          return { ...v, buy: true };
        });
        setCart(newData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    // 沒有token
    if (!token) {
      router.push("/");
    }
    console.log(id);
    console.log(token);
    getWishlistType(id);
    getWishlist(id);
    getCart(id);
  }, []);

  return (
    <>
      <div className="my-3">
        <ListUserM />
        <div className="d-flex justify-content-around pt-2">
          <ListD />
          <div className="d-flex flex-column col-md-8 col-12 wishlist">
            <div className="d-flex justify-content-between">
              <p className="size-4 big mb-2">
                <span className="my">▍</span>追蹤清單
              </p>
              <p className="size-7 mt-2">已追蹤{wishlist.length}樣商品</p>
            </div>
            <div className="bg">
              {wishlist.length == 0 ? (
                <>
                  <div className="nowhislist">
                    <div className=" d-flex justify-content-center mt-5">
                      <p className="size-3">
                        尚無追蹤紀錄，快去小貓商城逛逛吧！
                      </p>
                    </div>
                    <div className="d-flex justify-content-center mt-5">
                      <button
                        className="btn-confirm size-4"
                        onClick={() => {
                          router.push("/product");
                        }}
                      >
                        前往小貓商城
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {currentData.map((v, i) => {
                    return (
                      <>
                        <div
                          className="d-flex justify-content-between border-bottom pt-4 pb-2 mx-md-5"
                          key={v.collection_id}
                        >
                          <div className="d-flex col-7 col-md-9">
                            <img src={v.images} alt={v.product_name} />
                            <div className="ms-3">
                              <Link
                                href={`/product/${v.category_id}/${v.subcategory_id}/${v.product_id}`}
                                className="size-6 m-size-7"
                              >
                                {v.product_name}
                              </Link>
                              <p className="size-6 m-size-7 price">
                                NT${v.price}
                              </p>
                              <div className="">
                                <select
                                  className="form-select"
                                  style={{ width: "150px" }}
                                  onChange={(e) =>
                                    handleSelectChange(
                                      v.product_id,
                                      e.target.value
                                    )
                                  }
                                >
                                  {wishlisttype
                                    .filter(
                                      (t) => t.product_id === v.product_id
                                    )
                                    .map((t, i) => (
                                      <option key={i} value={t.type_id}>
                                        {t.type_name}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="col-5 col-md-3  d-md-flex align-items-center d-none  flex-column justify-content-center">
                            <button
                              className="btn btn-confirm size-6 m-size-7 my-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                              onClick={() =>
                                addCart(v.user_id, v.product_id, v.product_type)
                              }
                            >
                              立即購買
                            </button>
                            <button
                              className="btn btn-outline-confirm size-6 m-size-7 my-2"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                              onClick={() => {
                                // 這裡作刪除的動作
                                deleteWishlist(v.user_id, v.collection_id);
                              }}
                            >
                              取消追蹤
                            </button>
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
                                  <h5
                                    class="modal-title"
                                    id="exampleModalLabel"
                                  >
                                    通知
                                  </h5>
                                  <button
                                    type="button"
                                    class="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div class="modal-body">已取消收藏此商品</div>
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

                          <div className="col-4 d-md-none d-flex flex-column justify-content-between align-items-end">
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-confirm m-2 size-7  m-size-7"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                aria-controls="offcanvasRight"
                                onClick={() =>
                                  addCart(
                                    v.user_id,
                                    v.product_id,
                                    v.product_type
                                  )
                                }
                              >
                                立即購買
                              </button>
                            </div>
                            <div className="d-flex justify-content-center">
                              <button
                                className="delete btn btn-outline-confirm size-6 m-size-7 m-2"
                                data-bs-toggle="modal"
                              data-bs-target="#exampleModal1"
                                onClick={() => {
                                  // 這裡作刪除的動作
                                  deleteWishlist(v.user_id, v.collection_id);
                                }}
                              >
                                取消追蹤
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <div className="mt-4">
                    <Pagination
                      itemsPerPage={itemsPerPage}
                      total={wishlist}
                      activePage={activePage}
                      setActivePage={setActivePage}
                    />
                  </div>
                </>
              )}
            </div>

            <div
              className="offcanvas offcanvas-end"
              tabIndex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div className="offcanvas-header">
                <p id="offcanvasRightLabel" className="size-6">
                  我的購物車({cart.length})
                </p>
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                {cart.map((v, i) => {
                  return (
                    <>
                      <div key={i} className="d-flex mb-3 border-bottom mx-2">
                        <div className="">
                          <img src={v.images}></img>
                        </div>
                        <div className="">
                          <p className="size-7">{v.product_name}</p>
                          <p className="size-7 type">{v.type}</p>
                          <p className="size-7 price">NT${v.newprice}</p>
                          <p className="size-7">數量：{v.quantity}</p>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div className="d-flex justify-content-center my-3 mx-3 mx-md-0">
                  <button
                    type="button"
                    className="btn btn-outline-confirm me-2"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  >
                    繼續購物
                  </button>
                  <button
                    type="button"
                    className="btn btn-confirm ms-md-5 ms-2"
                    onClick={() => {
                      window.location.href = "/product/cart";
                    }}
                  >
                    前往結帳
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
