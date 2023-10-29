import { Fragment, useState, useEffect } from "react";
import { BiSolidCart } from "react-icons/bi";
import axios from "axios";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import jwt_decode from "jwt-decode";

export default function BlockTwoMobile() {
  // 用於儲存解析後的userID
  const [userId, setUserId] = useState(null);
  // console.log(userId);
  // 利用token拿到當前登入的userID
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     try {
  //       const decodedToken = jwt_decode(token);
  //       const currentUserID = decodedToken.id;
  //       console.log("currentUserID", currentUserID);
  //       setUserId(currentUserID);
  //       // 在此處將令牌token添加到請求標頭
  //       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //     } catch (error) {
  //       console.error("解析Token時出錯", error);
  //     }
  //   }
  // }, []);
  // 讀取資料庫資料
  const [productData, setProductData] = useState({ result: [] });

  useEffect(() => {
    axios.get("http://localhost:3005/api/product/home").then((response) => {
      setProductData({ result: response.data.result });
    });
  }, []);

  // const [isFavorites, setIsFavorites] = useState(() =>
  //   Array(productData.result.length).fill(false)
  // );
  // //添加商品到收藏的函式
  // //儲存選中的type_id-selectedTypeId 加到購物車時已經有寫了
  // const [collection, setCollection] = useState([]); //用來儲存收藏
  // // const [selectedTypeId, setSelectedTypeId] = useState('');
  // const getCollection = () => {
  //   axios
  //     .get(`http://localhost:3005/api/product/collections/${userId}`)
  //     .then((response) => {
  //       setCollection(response.data.result);
  //       console.log(response.data.result);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // };

  // const addCollection = async (product_id) => {
  //   console.log(product_id);

  //   // 檢查收藏中是否已經存在具有相同 id 的商品
  //   const have = collection.find((v) => v.product_id === product_id);
  //   console.log(have);

  //   // 如果購物車中沒有相同的商品
  //   if (have === undefined) {
  //     try {
  //       // 發送HTTP請求將商品添加到購物車
  //       const response = await axios.put(
  //         `http://localhost:3005/api/product/collections/${userId}`,
  //         { product_id }
  //       );
  //       alert("已加入收藏囉");
  //     } catch (error) {
  //       console.error("錯誤：", error);
  //     }

  //     getCollection(userId);
  //   } else {
  //     // 如果購物車中已經存在相同的商品
  //     try {
  //       getCollection(userId);
  //       //顯示警告
  //     } catch (error) {
  //       console.error("錯誤：", error);
  //     }
  //   }
  // };

  // const deleteCollection = async (product_id) => {
  //   console.log(product_id);

  //   // 檢查收藏中是否已經存在具有相同 id 的商品
  //   const have = collection.find((v) => v.product_id === product_id);
  //   console.log(have);

  //   // 如果購物車中沒有相同的商品
  //   if (have) {
  //     try {
  //       // 發送HTTP請求將商品添加到購物車，product_id 放在 URL 中
  //       const response = await axios.delete(
  //         `http://localhost:3005/api/product/collections/${userId}/${product_id}`
  //       );
  //       alert("已取消收藏");
  //     } catch (error) {
  //       console.error("錯誤：", error);
  //     }

  //     getCollection(userId);
  //   } else {
  //     // 如果購物車中已經沒有存在相同的商品
  //     try {
  //       getCollection(userId);
  //       //顯示警告
  //     } catch (error) {
  //       console.error("錯誤：", error);
  //     }
  //   }
  // };

  // const toggleCollection = async (product_id) => {
  //   const isProductInCollection = collection.some(
  //     (item) => item.product_id === product_id
  //   );
  //   if (isProductInCollection) {
  //     await deleteCollection(product_id);
  //   } else {
  //     await addCollection(product_id);
  //   }
  //   getCollection(userId);
  // };

  function getButtonColorClass(categoryName) {
    switch (categoryName) {
      case "食物":
        return "btn-color-1";
      case "用品":
        return "btn-color-2";
      case "清潔":
        return "btn-color-3";
      case "保健":
        return "btn-color-4";
      case "護理":
        return "btn-color-5";
      default:
        return "";
    }
  }

  //將產品兩兩一組
  const productGroups = [];
  for (let i = 0; i < productData.result.length; i += 2) {
    const group = productData.result.slice(i, i + 2);
    productGroups.push(group);
  }

  return (
    <div id="carouselExample" className="carousel slide">
      <div className="carousel-inner">
        {productGroups.map((group, groupIndex) => (
          <div
            className={`carousel-item ${groupIndex === 0 ? "active" : ""}`}
            key={groupIndex}
          >
            <div className="row">
              {group.map((v, i) => (
                <div className="col-6 col-md-3 col-lg-3 col-xl-3" key={i}>
                  <div className="product-card2" key={v.product_id}>
                    <div className="card h-100">
                      <Link href={`/product/${v.product_id}`}>
                        <img
                          src={v.images_one}
                          className="card-img-top"
                          alt="..."
                        />
                      </Link>
                      <div className="card-body p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div
                            className={`btn ${getButtonColorClass(
                              v.category_name
                            )} d-flex align-items-center `}
                          >
                            {v.category_name}
                          </div>
                        </div>
                        <Link href={`/product/${v.product_id}`}>
                          <div className="card-text-vendor size-7 m-size-7">
                            {v.vendor}
                          </div>
                          <div className="card-text size-6 m-size-7">
                            {v.product_name}
                          </div>
                          <div
                            className="product-sale-price d-flex align-items-center"
                            href="#"
                          >
                            <div className="price fs-4 size-6 m-size-7 me-3">
                              NT${v.specialoffer}
                            </div>
                            <del>NT${v.price}</del>
                          </div>
                        </Link>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" ariahidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
