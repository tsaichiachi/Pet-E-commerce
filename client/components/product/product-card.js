import { Fragment, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { BiSolidHeart, BiSolidCart } from "react-icons/bi";

export default function ProductCard() {
  const [isFavorite, setIsFavorite] = useState(false); // 初始狀態為未收藏

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // 切換收藏狀態
  };
  return (
    <>
      <div className="product-card">
        <div className="card" style={{ width: "275px", height: "425px" }}>
          <img
            src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_M3PD150101-e-0.jpg"
            className="card-img-top"
            alt="..."
          />
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              {/* 類別按鈕顏色已建好 btn-color-1 一直到btn-color-7 再依需求調整className即可 */}
              {/* 顏色設定如果需要再調整，可以到以下檔案調整 \final-project-pet\client\styles\components-style\_product-card.scss */}
              <div className="btn btn-color-1 d-flex align-items-center">
                貓草
              </div>
              <div className="" onClick={toggleFavorite}>
                {isFavorite ? (
                  <div className="position-relative inline-block">
                    <BiSolidHeart className="heart-icon-red" />
                    <CiHeart className="heart-icon-red-line" />
                  </div>
                ) : (
                  <CiHeart />
                )}
              </div>
            </div>

            <div className="card-text">單層開放式防濺貓砂盆</div>
            <div
              className="product-sale-price d-flex align-items-center"
              href="#"
            >
              <del>$220</del>
              <div className="price fs-4 mx-2 w-100">NT$140</div>
              <div className="rounded-circle cart p-1 d-flex justify-content-end align-items-center">
                <BiSolidCart className="cart" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
