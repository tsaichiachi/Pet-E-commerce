import { useRouter } from 'next/router';
import moment from "moment";
import { useEffect,useState } from 'react';
import axios from "axios";

function PayConfirm(props) {
  const [order, setOrder] = useState([{}])
  const [userid, setId] = useState(null);
  const createtTime=moment().format("YYYY-MM-DD HH:mm")
  const router = useRouter();
  const getOrder =  (id) => {
    axios.get(`http://localhost:3005/api/product/cart/order/${id}`)
        .then((response) => {
        const data = response.data.result;
        console.log(data);
        setOrder(data)     
        })
        .catch((error) => {
        console.error("Error:", error);
    });
}

useEffect(() => {
  const userId = parseInt(localStorage.getItem('id'));
  console.log(userId);
  getOrder(userId)
  setId(userId);
}, [router.isReady]);

  

  return (
    <>
      <div className='container my-5 pay-confirm text-center'>
        <img src='/checkout.png'></img>
        <h2 className='mb-2 fw-bold size-4 mb-4'>付  款  成  功</h2>
        <div className='size-6  mb-5 info1 col-lg-8 col-12 m-auto'>
          <div className='py-1 title info fw-bold'>訂單資料</div>
          <div className='py-1 info d-flex justify-content-between px-3'>
            <p>訂單編號</p>
            <p>{order[0].oid}</p>
          </div>
          <div className='py-1 info d-flex justify-content-between px-3'>
            <p>訂單金額</p>
            <p>NT{order[0].total_amount}元</p>
          </div>
          <div className='py-1 info d-flex justify-content-between px-3'>
            <p>付款方式</p>
            <p>{order[0].payment}</p>
          </div>
          <div className='py-1 info d-flex justify-content-between px-3'>
            <p>付款時間</p>
            <p>{createtTime}</p>
          </div>
        </div>
        <div className='d-flex justify-content-center'>       
          <button className="btn btn-confirm" onClick={ () => router.push('/member/order')}>
              查看我的訂單
          </button>
      </div>
      </div>

    </>
  )
}

export default PayConfirm