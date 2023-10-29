import axios from 'axios'
import { useState ,useEffect} from 'react'
// import { confirmAlert } from 'react-confirm-alert'
// import 'react-confirm-alert/src/react-confirm-alert.css'
import { useRouter } from 'next/router';
import {BsCheckCircle} from 'react-icons/bs';


function Pay(props) {
  const router = useRouter();
  const [orderPrice, setOrderPrice] = useState(0)
  const [orderNumber, setOrderNumber] = useState(0)
  const [finalCart,setFinalCart]=useState([{product_id:0}])
  const [allPrice,setAllPrice]=useState(0)
  const [freight,setFreight]=useState(0)
  const [sale,setSale]=useState(0)

  useEffect(() => {
    if(!localStorage.getItem('allPrice')){
      router.push("/")
    }else{
      const newFinalCart = localStorage.getItem('newFinalCart');
      setFinalCart(JSON.parse(newFinalCart))  
      setOrderPrice(parseInt(localStorage.getItem('totalPrice')))
      setOrderNumber(localStorage.getItem('orderNumber'))
      setAllPrice(parseInt(localStorage.getItem('allPrice')))
      setFreight(parseInt(localStorage.getItem('freight')))
      setSale(parseInt(localStorage.getItem('sale')))
    }
}, [router.isReady]);

  const handleLinePay = () => {
    // confirmAlert({
    //   title: '確認付款',
    //   message: '確認要導向至LINE Pay進行付款？',
    //   buttons: [
    //     {
    //       label: '確定',
    //       onClick: () => {

    //         // 在本window直接導至node付款(reverse)url，之後會導向至line pay
    //         window.location.href =
    //         'http://localhost:3005/api/pay/reserve'  +
    //           '?orderId=' +
    //           orderNumber
    //       },
    //     },
    //     {
    //       label: '取消',
    //       onClick: () => {},
    //     },
    //   ],
    // })
    window.location.href =
    'http://localhost:3005/api/pay/reserve'  +
      '?orderId=' +
      orderNumber
    localStorage.removeItem("orderNumber");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("freight");
    localStorage.removeItem("newFinalCart");
    localStorage.removeItem("sale");
    localStorage.removeItem("allPrice");
  }
  return (
    <>
      <div className='container my-5 pay'>
        <div className='text-center mb-4'>
        <BsCheckCircle className='ischeck'/>
        </div>

        <div className='d-flex justify-content-center mb-4'>
          <div className=' title'>
            <p className='size-5  fw-bold' >訂單編號：<span>{orderNumber}</span></p>
            <p className='size-5  fw-bold' >訂單金額：<span>{orderPrice}元</span></p>
          </div>
        </div>

        <div className='d-flex justify-content-center mb-5'>
        <img src="/LINEPay.png" alt="LINE Pay" className='me-3'></img>


        <button
            data-bs-toggle="modal" data-bs-target="#exampleModal"
            className='btn btn-confirm'
            // 限制有orderId產生後才能點按
            disabled={!orderNumber}
        >前往付款
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">通知</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
              確認要導向至LINE Pay進行付款？
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-confirm" data-bs-dismiss="modal">取消</button>
                <button type="button" class="btn btn-price" onClick={()=>{
                  handleLinePay()
                }}>確認</button>
              </div>
            </div>
          </div>
        </div>

        </div>

        <div className='pay'>
         {/* 購物車內商品 */}               
         <div className='d-flex justify-content-center mb-4 '>
                    {/* 桌機板 */}
                    <table  className='col-12  d-none d-sm-block cart-d-content '>
                        <thead >
                          <tr>
                            <th colSpan="4" className='size-6'>訂單明細({finalCart[finalCart.length-1].product_id==0?(finalCart.length-1):finalCart[finalCart.length-1].product_id==1000?(finalCart.length-2):(finalCart.length)})</th>             
                          </tr>
                        </thead>
                        <tbody>
                            {finalCart.map((v,i)=>{
                                if(v.product_id==0 ||v.product_id==1000){
                                  return ""
                                }
                                return(
                                    <tr className='size-7' key={i}>
                                    <td><img src={v.images} /></td>
                                    <td>
                                        <p>{v.product_name}</p>
                                        <p className='size-7 type'>{v.type}</p>
                                    </td>
                                    <td className='text-center'>
                                    <p className='price size-7 mb-0'>NT${v.price}</p>
                                    <p className='newprice '>NT${v.newprice}</p> 
                                    </td>
                                    <td className='text-center'>x{v.quantity}</td>
                                    <td className='text-center'>NT${v.newprice*v.quantity}</td>                               
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {/* 手機板 */}
                    <table className='d-sm-none d-block cart-m-content col-11'>
                        <thead>
                          <tr>
                            <th colSpan="4">訂單明細({finalCart[finalCart.length-1].product_id==0?(finalCart.length-1):finalCart[finalCart.length-1].product_id==1000?(finalCart.length-2):(finalCart.length)})</th>             
                          </tr>
                        </thead>
                        <tbody>
                        {finalCart.map((v,i)=>{
                            if(v.product_id==1000||v.product_id==0){
                                  return ""
                                }
                            return(
                                <tr className='m-size-7' key={i}>
                                    <td><img src={v.images}></img></td>
                                    <td className=''>
                                        <p className='m-0'>{v.product_name}</p>
                                        <p className='m-size-7 type m-0'>{v.type}</p>
                                        <p className='m-0 newprice'>NT${v.newprice}</p>                                 
                                    </td>
                                    <td className='text-center'>x{v.quantity}</td>
                                    <td className='text-center'>NT${v.newprice*v.quantity}</td> 
                                </tr>
                            )
                            })}
                        </tbody>
                    </table>
                </div>
          </div>
          <div className='d-flex justify-content-sm-end justify-content-center mb-5'>     
                    <div className='col-lg-4 col-sm-6 col-11 detail d-flex justify-content-center p-sm-4  '>
                        <table className='col-sm-11 col-12'>
                            <tbody >
                                <tr>
                                    <td className=''>商品總金額</td>
                                    <td className='text-end'>NT${allPrice}</td>
                                </tr>
                                <tr>
                                    <td>優惠折扣</td>
                                    <td className='text-end'>NT$-{sale}</td>
                                </tr>
                                <tr className='cal'> 
                                    <td className='pb-2'>運費</td>
                                    <td className='text-end'>NT${freight}</td>
                                </tr>
                                <tr > 
                                    <th className='pt-2'>總計</th>
                                    <th className='text-end'>NT${orderPrice}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
          </div>
        </div>

    </>
  )
}

export default Pay