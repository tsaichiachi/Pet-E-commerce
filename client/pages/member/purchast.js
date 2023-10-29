import React, { useState, useEffect } from "react";
import ListD from "@/components/member/list-d";
import ListUserM from "@/components/member/list-user-m";
import { useCart } from "@/hooks/useCart";
import axios from "axios";
import Pagination from "@/components/pagination";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Purchast() {
  const [product, setProduct] = useState([]);
  const { cart, setCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const itemsPerPage = 5;
  const [activePage, setActivePage] = useState(1);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const router = useRouter();

  const getProduct = (id) => {
    axios
      .get(`http://localhost:3005/api/member-purchast/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addCart = async (user_id, id, type) => {
    const have = cart.find(
      (v) => v.product_id == id && v.product_type_id == type
    );
    console.log(have);
    if (have === undefined) {
      try {
        const response = await axios.put(
          `http://localhost:3005/api/member-purchast/cart/${user_id}`,
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
          `http://localhost:3005/api/member-purchast/cartplus/${user_id}`,
          { id, newQuantity, type }
        );
      } catch (error) {
        console.error("Error:", error);
      }
      getCart(user_id);
    }
  };

  const getWishlist = async (id) => {
    await axios
      .get(`http://localhost:3005/api/member-purchast/wishlist/${id}`)
      .then((response) => {
        const data = response.data.result;
        console.log(data);
        setWishlist(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const addWishlist = async (user_id, id) => {
    const have = wishlist.find((v) => v.product_id === id);
    console.log(have);
    if (have === undefined) {
      try {
        const response = await axios.put(
          `http://localhost:3005/api/member-purchast/addwishlist/${user_id}`,
          { id }
        );
      } catch (error) {
        console.error("Error:", error);
      }
      getWishlist(user_id);
    }
  };

  const deleteWishlist = async (user_id, id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `http://localhost:3005/api/member-purchast/deletewishlist/${user_id}`,
        { data: { id } }
      );
    } catch (error) {
      console.error("Error:", error);
    }
    getWishlist(user_id);
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
    getProduct(id);
    getWishlist(id);
    getCart(id);
  }, []);

  let newProduct = [];
  product.forEach(v => {
    const hasDuplicate = newProduct.some(n => n.product_id === v.product_id);
    if (!hasDuplicate) {
      newProduct.push(v);
    }
  })

  let idCounts = [];
  product.forEach(v => {
    const product_name = v.product_name;
    const type_id = v.type_id;
    if (idCounts[`${product_name}+${type_id}`]) {
        idCounts[`${product_name}+${type_id}`]++; // 如果 ID 已经存在，增加计数
    } else {
        idCounts[`${product_name}+${type_id}`] = 1; // 如果 ID 不存在，初始化计数为 1
    }
  });

  const currentData = newProduct.slice(startIndex, endIndex);


  return (
    <>
      <div className="my-3">
        <ListUserM />
        <div className="d-flex justify-content-around py-2">
          <ListD />
          <div className="d-flex flex-column col-md-8 col-12 purchast-bg ">
            <p className="size-4 big mb-2">
              <span className="my">▍</span>購買紀錄
            </p>
            <div className="bg">
              {product.length == 0 ? (
                <>
                  <div className="nopurchast">
                    <div className=" d-flex justify-content-center mt-5">
                      <p className="size-3">
                        尚無購買紀錄，快去小貓商城逛逛吧！
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
                        <div className="d-flex border-bottom pt-4 pb-2 justify-content-between mx-md-5">
                          <div className="d-flex  col-8 col-md-9" key={i}>
                            <img className="picture me-4" src={v.image}></img>

                            <div className="">
                              <Link href={`/product/${v.category_id}/${v.subcategory_id}/${v.product_id}`} className="size-6">{v.product_name}</Link>
                              <p className="size-6 type">{v.type}</p>
                              <p className="size-6 price">NT${v.price}</p>
                              <p className="size-7 type">購買過{idCounts[`${v.product_name}+${v.type_id}`]}次</p>
                            </div>
                          </div>

                          <div className="col-4 col-md-3 d-flex flex-column align-items-center">
                            <button
                              className="btn btn-confirm m-2 size-6 m-size-7"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                              onClick={() =>
                                addCart(v.user_id, v.product_id, v.type_id)
                              }
                            >
                              再次購買
                            </button>

                            {wishlist.find(
                              (w) => w.product_id === v.product_id
                            ) === undefined ? (
                              <button
                                className="btn btn-outline-confirm m-2 size-6 m-size-7"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() =>
                                  addWishlist(v.user_id, v.product_id)
                                }
                              >
                                加入追蹤
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-confirm m-2 size-6 m-size-7"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal1"
                                onClick={() => {
                                  deleteWishlist(v.user_id, v.product_id);
                                }}
                              >
                                取消追蹤
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })}
                  <div className="mt-4">
                    <Pagination
                      itemsPerPage={itemsPerPage}
                      total={product}
                      activePage={activePage}
                      setActivePage={setActivePage}
                    />
                  </div>
                </>
              )}
            </div>

            <div
              class="modal fade"
              id="exampleModal"
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
                  <div class="modal-body">已成功將商品加入收藏</div>
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
                      <div key={i} className="d-flex mb-3 border-bottom mx-2 ">
                        <div className="">
                          <img className="picture" src={v.images}></img>
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
