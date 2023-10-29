import React, { useState ,useEffect} from 'react';
import Cards from 'react-credit-cards-2';
import { useRouter } from 'next/router';
import 'react-credit-cards-2/dist/lib/styles.scss';

export default function CreditCard() {
  const router = useRouter();
  const [orderPrice, setOrderPrice] = useState(0)
  const [orderNumber, setOrderNumber] = useState(0)


  useEffect(() => {
    if(!localStorage.getItem('totalPrice')){
      router.push("/")
    }else{
      setOrderPrice(parseInt(localStorage.getItem('totalPrice')))
      setOrderNumber(localStorage.getItem('orderNumber'))
    }

  }, [router.isReady]);

        const [state, setState] = useState({
          number: '',
          expiry: '',
          cvc: '',
          focus: '',
        });
      
        const handleInputChange = (evt) => {
          const { name, value } = evt.target;
          setState((prev) => ({ ...prev, [name]: value }));
        }
      
        const handleInputFocus = (evt) => {
          setState((prev) => ({ ...prev, focus: evt.target.name }));
        }

        const handleOrder = () => {
          localStorage.removeItem("orderNumber");
          localStorage.removeItem("totalPrice");
          localStorage.removeItem("freight");
          localStorage.removeItem("finalCart");
          localStorage.removeItem("sale");
          localStorage.removeItem("allPrice");
          router.push("/pay-confirm")
        }
      
        return (

          <div className='credit-card mt-5'>
          <div className='d-flex justify-content-center mb-4 '>
            <div className=' title'>
              <p className='size-5 fw-bold' >訂單編號：<span>{orderNumber}</span></p>
              <p className='size-5 fw-bold' >訂單金額：<span>{orderPrice}元</span></p>
            </div>
          </div>
          <div className='d-flex justify-content-center flex-column flex-sm-row align-items-center'>
            <div className='d-flex justify-content-end  me-3'>
              <Cards
              number={state.number}
              expiry={state.expiry}
              cvc={state.cvc}
              focused={state.focus}
              />
            </div>
            <div className='d-flex flex-column justify-content-between my-sm-0 my-5'>
            <form className=' '>
              <div className='mb-2'>
                <input
                  type="text"
                  name="number"
                  placeholder="卡片號碼"
                  value={state.number}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  pattern="[0-9]{16}"
                />
              </div>
              <div className='mb-2'>
                <input
                  type="text"
                  name="expiry"
                  placeholder="到期日"
                  value={state.expiry}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  max="4"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="cvc"
                  placeholder="檢查碼"
                  value={state.cvc}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  max="3"
                />
              </div>


            </form>
            <button
                className='btn btn-confirm mt-4'
                onClick={()=>{
                  handleOrder()
                }}
                >確認付款
            </button>
            </div>
          </div>
          </div>
        );
      

}
