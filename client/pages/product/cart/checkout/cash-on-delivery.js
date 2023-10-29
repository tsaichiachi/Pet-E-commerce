import { useState ,useEffect} from 'react'
import { useRouter } from 'next/router';
import {BsCheckCircle} from 'react-icons/bs';


function cashOnDelivery(props) {
  const router = useRouter();
  const [orderPrice, setOrderPrice] = useState(0)
  const [orderNumber, setOrderNumber] = useState(0)
  const [finalCart,setFinalCart]=useState([{product_id:0}])
  const [allPrice,setAllPrice]=useState(0)
  const [freight,setFreight]=useState(0)
  const [sale,setSale]=useState(0)


  useEffect(() => {
    if(!localStorage.getItem('finalCart')){
      router.push("/")
    }else{
      const lastCart = localStorage.getItem('finalCart');
      setFinalCart(JSON.parse(lastCart))  
      setOrderPrice(parseInt(localStorage.getItem('totalPrice')))
      setOrderNumber(localStorage.getItem('orderNumber'))
      setAllPrice(parseInt(localStorage.getItem('allPrice')))
      setFreight(parseInt(localStorage.getItem('freight')))
      setSale(parseInt(localStorage.getItem('sale')))
    }

}, [router.isReady]);

  const handleOrder = () => {
    localStorage.removeItem("orderNumber");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("freight");
    localStorage.removeItem("finalCart");
    localStorage.removeItem("sale");
    localStorage.removeItem("allPrice");
    router.push("/member/order")
  }
  return (
    <>
      <div className='container my-5 pay'>
        <div className='text-center mb-4'>
        <BsCheckCircle className='ischeck'/>
        </div>

        <div className='d-flex justify-content-center mb-4 delivery'>
          <div className=' title'>
            <p className='size-5 fw-bold' >訂單編號：<span>{orderNumber}</span></p>
            <p className='size-5 fw-bold' >訂單金額：<span>{orderPrice}元</span></p>
          </div>
        </div>

        <div className='d-flex justify-content-center mb-5'>
        <button
            className='btn btn-confirm'
            onClick={handleOrder}
        >查看我的訂單
        </button>
        </div>

        <div className='pay'>
         {/* 購物車內商品 */}               
         <div className='d-flex justify-content-center mb-4 '>
                    {/* 桌機板 */}
                    <table  className='col-12  d-none d-sm-block cart-d-content '>
                        <thead >
                          <tr>
                            <th colSpan="4" className='size-6'>訂單明細({finalCart.length})</th>             
                          </tr>
                        </thead>
                        <tbody>
                            {finalCart.map((v,i)=>{
                                if(v.product_id==0){
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
                            <th colSpan="4">訂單明細({finalCart.length})</th>             
                          </tr>
                        </thead>
                        <tbody>
                        {finalCart.map((v,i)=>{
                            if(v.product_id==0){
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

export default cashOnDelivery