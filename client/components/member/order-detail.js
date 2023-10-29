import React from "react";
// import ListM from '@/components/member/list-m'
// import ListD from '@/components/member/list-d'
// import ListUserM from '@/components/member/list-user-m'
import { RiFileList3Fill } from "react-icons/ri";

export default function Orderdetail() {
  return (
    <>
      <div className="container">
        <div className="d-flex justify-content-end">{/* <ListM /> */}</div>
        {/* <ListUserM /> */}
        <div className="d-flex py-2 justify-content-between">
          {/* <ListD /> */}

          <div className="col-12 col-sm-8 order-detail p-3">
            <div>
              <h5 className="size-5">
                <RiFileList3Fill />
                我的訂單
              </h5>

              <p className="date my-4 size-7">2023-08-26</p>
              <p className="size-7">狀態 : 已完成</p>
              <p className="size-7">訂單編號 :1534868</p>
              <p className="size-7">收件資訊 :</p>
              <p className="textcolor size-7">收件人 王大明</p>
              <p className="textcolor size-7">地址 125646台北市信義區福德街</p>
              <p className="textcolor size-7">電話 0988436641</p>
              <p className="size-7">付款資訊 : 貨到付款</p>
              <p className="size-7">寄送方式 : 宅配</p>
              <p className="size-7">購買項目 :</p>

              <table className="col-12">
                <tbody>
                  <tr className="border-bottom">
                    <td className="py-2">
                      <img src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_1(12).jpg"></img>
                    </td>
                    <td className="size-7">巨型開放式貓砂盆 (多色)</td>
                    <td className="size-7">x1</td>
                    <td className="size-7">NT$690</td>
                  </tr>
                </tbody>
              </table>

              <div className="d-flex justify-content-end">
                <button className="btn btn-confirm m-2 size-6">我要評論</button>
              </div>

              <table className="col-12">
                <tbody>
                  <tr className="border-bottom ">
                    <td className="py-2">
                      <img src="https://cdn-front.mao-select.com.tw//upload_files/fonlego-rwd/prodpic/D_M08PD125116-%E8%A6%8F%E6%A0%BC.jpg"></img>
                    </td>
                    <td className="size-7">指套濕巾</td>
                    <td className="size-7">x1</td>
                    <td className="size-7">NT$190</td>
                  </tr>
                </tbody>
              </table>

              <div className="">
                <h5 className="size-6 mt-3">商品評論</h5>
                <textarea className="col-12 textareasize"></textarea>
              </div>
              <div className="d-flex justify-content-end mb-5">
                <button className="btn btn-outline-confirm m-2 size-6">
                  取消
                </button>
                <button className="btn btn-confirm m-2 size-6">儲存</button>
              </div>

              <div className="d-flex justify-content-end">
                <table className="col-12 col-sm-6">
                  <thead>
                    <tr>
                      <td>商品總金額</td>
                      <td>NT$880</td>
                    </tr>
                    <tr>
                      <td>商品小計</td>
                      <td>NT$880</td>
                    </tr>
                    <tr>
                      <td>優惠折扣</td>
                      <td>NT$-80</td>
                    </tr>
                    <tr className="border-bottom">
                      <td>運費</td>
                      <td>NT$80</td>
                    </tr>
                    <tr>
                      <th>訂單金額</th>
                      <td>NT$880</td>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
