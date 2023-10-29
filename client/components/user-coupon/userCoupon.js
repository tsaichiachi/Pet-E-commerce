import React from 'react'

const dataAll = [
  {name: "貓咪節快樂!", value: 100, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:1},
  {name: "來吃罐罐!", value: 200, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:2},
  {name: "清涼一下", value: 300, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:3},
  {name: "想當貓!", value: 455, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:4},
  {name: "學貓叫", value: 540, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:5},
  {name: "會員禮", value: 1000, startDate: "2023-08-28", endDate: "2023-09-05", limitCost:500,couponCode:"happy",couponId:6},
]

export default function UserCoupon() {
 
  

  return (
    <>
           <div className="user-coupon">
        <div className="title">
          <p className=" size-4">
          {/* <Image src={myProfile} alt="myProfile-logo" /> */}
            我的優惠券
          </p>
        </div>
        <div className='couponSearch d-flex gap-3 '>
          <input className='form-input flex-grow-1' type='text' placeholder='輸入優惠序號'/>
          <button className='btn-confirm '>新增</button>
        </div>
        <div className='border-bottom my-3 py-1'>
          <a className='px-2' href='#'>全部(12)</a>
          <a className='px-2'  href='#'>即將到期(3)</a>
        </div>

        <table className='userTable'>
        <thead>
        <tr>
            <th>名稱</th>
            <th >面額</th>
            <th >生效日</th>
            <th >到期日</th>
            <th >說明</th>
          </tr>
        </thead>
        <tbody>
        {dataAll.map((v)=>{
          return(
            <tr  key={v.id}>
            <td  data-label="名稱:">{v.name}</td>
            <td data-label="面額:">${v.value}</td>
            <td data-label="生效日:">{v.startDate}</td>
            <td data-label="到期日:">{v.endDate}</td>
            <td data-label="說明:" className='pl-3'>
            最低消費金額：{v.limitCost}<br/>
            序號：{v.couponCode}<br/>
            適用商品：<a href='#'>查看</a>
            </td>
          </tr>
          )
        })}
          
        </tbody>
       
        </table>
        </div>
    </>
  )
}