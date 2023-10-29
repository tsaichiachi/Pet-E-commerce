import { Fragment, useState } from "react";
import { BiSolidCart } from "react-icons/bi";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import jwt_decode from "jwt-decode";

export default function HomeProductCardHot() {
  // // 用於儲存解析後的userID
  // const [userId, setUserId] = useState(null);
  // console.log(userId);
  // // 利用token拿到當前登入的userID
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
  // // 讀取資料庫資料
  const [productData, setProductData] = useState({ result: [] }); // 初始化為一個帶有 result 屬性的物件

  useEffect(() => {
    axios
      .get("http://localhost:3005/api/product/home/sales")
      .then((response) => {
        setProductData({ result: response.data.result }); // 將伺服器端的 result 放入物件中
      });
  }, []);

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

  // useEffect(() => {
  //   // 獲取商品列表
  //   getCollection(userId);
  // }, [userId]);

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
        return ""; // 如果找不到匹配的類別名稱，可以返回空字符串或其他適當的值
    }
  }

  return (
    <>
      {productData.result.map((v, i) => {
        return (
          <div className="col-6 col-md-3 col-lg-3 col-xl-3" key={v.product_id}>
            <div className="product-card2">
              <div className="card h-100">
                <div className="card-img">
                  <Link
                    href={`/product/${v.category_id}/${v.subcategory_id}/${v.product_id}`}
                  >
                    <img
                      src={v.images_one}
                      className="card-img-top"
                      alt="..."
                    />
                  </Link>
                </div>
                <div className="card-body p-2">
                  <div className="d-flex justify-content-between align-items-center">
                    {/* 類別按鈕顏色已建好 btn-color-1 一直到btn-color-7 再依需求調整className即可 */}
                    {/* 顏色設定如果需要再調整，可以到以下檔案調整 \final-project-pet\client\styles\components-style\_product-card.scss */}
                    <div
                      className={`btn ${getButtonColorClass(
                        v.category_name
                      )} d-flex align-items-center `}
                    >
                      {v.category_name}
                    </div>
                    {/* <button
                      onClick={() => toggleCollection(v.product_id)}
                      style={{ background: "transparent", border: "none" }}
                    >
                      {collection.some(
                        (item) => item.product_id === v.product_id
                      ) ? (
                        <FaHeart color="#ca526f" size={20} />
                      ) : (
                        <FaRegHeart color="#d7965b" size={20} />
                      )}
                    </button> */}
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
                      <div className="price fs-4  size-6 m-size-7 me-3">
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
        );
      })}
    </>
  );
}
