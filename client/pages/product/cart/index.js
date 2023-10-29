import React,{useState,useEffect } from 'react'
import {RiDeleteBin5Fill} from 'react-icons/ri';
import { useRouter } from 'next/router';
import axios from "axios";
import { useCart } from '@/hooks/useCart';
import Swal from 'sweetalert2';
import Link from 'next/link';
// import { useAuth } from '@/context/fakeAuthContext';

// import moment from "moment";

export default function Cart() {
    const { cart, setCart ,userid} = useCart();
    // const {userId} = useAuth()
    // const id=parseInt(userId)
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(true);
    const [coupon, setCoupon] = useState([])
    const [allPrice, setAllPrice] = useState(0)
    const [selectedOption, setSelectedOption] = useState(["no",0,0])
    const [discount, setDiscount] = useState(["no",0,0])
    const [sale,setSale]=useState(0)
    const [freight,setFreight]=useState(100)

    const buyLength=cart.filter((v)=>v.buy===true)

    let all=0

    //抓購物車內所有商品 ，並增加屬性
    const getCart =  (id) => {
         axios.get(`http://localhost:3005/api/product/cart/cart/${id}`)
          .then((response) => {
            const data = response.data.result;
            const newData=data.map((v)=>{
                return  { ...v, buy: true }
            })
            setCart(newData)     
          })
          .catch((error) => {
            console.error("Error:", error);
        });
      }
    //抓可使用優惠券
    const getCoupon =  async(id, allPrice) => {   
        let data = await axios.get("http://localhost:3005/api/product/cart/coupon/coupon",{ params: {allPrice,id}})
          .then((response) => {
            if(allPrice!==0){
                const data = response.data.result;
                setCoupon(data);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            return {};
        });

      }
    //第一次渲染，抓購物車內所有商品  
    // useEffect(() => {
    //     let cartData
    //     if (localStorage.getItem('cart')) {
    //         // 如果有資料，將其轉換為JavaScript對象或陣列
    //         cartData = JSON.parse(localStorage.getItem('cart'));
    //         setCart(cartData)

    //     }else{
    //         getCart()
    //     }
    //   }, []) 

    useEffect(() => {
        if(!localStorage.getItem('id')){
          router.push("/")
        }
    }, [router.isReady]);
    useEffect(() => {
        //判斷是否全選
        setIsChecked(allChange(cart,isChecked))
        //設定總金額到allPrice   
        let total = 0;
        cart.forEach((v) => {
            if (v.buy) {
            total += v.newprice * v.quantity;
            }
        });
        setAllPrice(total);
    }, [cart])
      //判斷該引入哪些優惠券
    useEffect(() => {
        setCoupon([])
        getCoupon(userid, allPrice)
        setSale(0)
        setSelectedOption(["no",0,0])
    }, [allPrice])
    //判斷運費是0或是100
    useEffect(() => {
        if((allPrice-sale)>=1000 ||(allPrice-sale)===0){
            setFreight(0)
        }else{
            setFreight(100)
        }
    }, [sale,allPrice])

    //全選時所有商品都打勾
    const toggleSelectedAll=(cart,selected)=>{
        return cart.map((v)=>{
            return {...v,buy:selected}
        })
    }
    //單選時打勾或取消打勾
    const toggleSelected=(cart,selected,id)=>{
        return cart.map((v)=>{
            if(v.cart_id==id) return {...v,buy:selected}
            return {...v}
        })
    }
    //是否全選
    const allChange=(cart,isChecked)=>{
        const isAllTrue = cart.find((v)=>v.buy === false)
        if(isAllTrue===undefined){
            return true
        }else{
            return false
        }
    }
    //更改數量
    const updateQuantity = (cart, id, value) => {
        return cart.map((v) => {
          //展開每個成員時，如果符合條件(v.id === id)則count:v.count+value
          if (v.cart_id === id) return { ...v, quantity: v.quantity + value }
          else return { ...v }
        })
    }
    //更改資料庫數量
    const changeInfo=async (quantity,id,value) => {
        const newquantity= parseInt(quantity) + parseInt(value);
        try {
          const response = await axios.put(`http://localhost:3005/api/product/cart`,{ newquantity ,id});        
        } catch (error) {
          console.error("Error:", error);
        }
    } 
    //刪除
    const deleteCart=async (id) => {     
            try {
              const response = await axios.delete(`http://localhost:3005/api/product/cart/${id}`);      
              const newCart=cart.filter((v)=>v.cart_id!==id)
              setCart(newCart)   
            } catch (error) {
              console.error("Error:", error);
            }
        } 
    //全選
    const handleToggleSelectedAll=(selected)=>{
        setCart(toggleSelectedAll(cart, selected))
        setIsChecked(selected)
    } 
    //單選
    const handleToggleSelected=(selected,id)=>{
        setCart(toggleSelected(cart, selected,id))
    }
    //+按鈕 
    const handleIncreaseQuantity = (id) => {
        setCart(updateQuantity(cart, id, 1))
      }
    //-按鈕
    const handleDecreaseQuantity = (id) => {
        setCart(updateQuantity(cart, id, -1))
      } 
    //change優惠券
    const handleDiscountChange=(value)=>{
        const[type,amount,id]=value.split(",")
        setDiscount([type,amount,id])
        if(type==="minus"){
            setSale(amount) 
        }else if(type==="off"){
            setSale(Math.ceil(allPrice*(100-amount)/100))
        }else{
            setSale(0)
        }
    }
    //下一步
    const saveCartToLocalStorage=()=>{
        const buy=cart.find((v)=>v.buy===true)
        if(buy){
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('allPrice', allPrice);
            localStorage.setItem('sale',sale );
            localStorage.setItem('freight',freight );
            localStorage.setItem('discount', discount);
            router.push('/product/cart/checkout');
        }else{
            Swal.fire({
                text: '請先勾選商品再進行結帳',
                icon: 'info',
                confirmButtonText: '確定',
                confirmButtonColor: "#d7965b",
                iconColor: "#ca526f",
                color: "#512f10",
                focusConfirm: false,
              });
        }

    }  
    // let time=moment().format("YYYY MM DD")

  return (
    <>
        {cart.length==0?
        (<div className="cart my-3">
            <div className='container'>
                {/* 步驟 */}
                <div className='d-flex justify-content-center step text-center  '>
                    <div className='col-lg-2 col-sm-4 col-5 size-6 step1 '>
                        購物車
                    </div>
                    <div className='col-lg-2 col-sm-4 col-5 size-6  step2'>
                        運送&付款
                    </div>
                </div>
                <div className=' text-center zero d-flex flex-column justify-content-center align-items-center'>
                    <p className='size-3'>購物車空空的</p>
                    <Link href="/product" className='size-2  mt-4 btn btn-outline-brown col-lg-6 col-9'>快去小貓商城逛逛吧</Link>

                </div>
            </div>
        </div>)
        :      
        (<div className="cart mt-4">
            <div className='container'>
            {/* 步驟 */}
                <div className='d-flex justify-content-center step text-center  mb-4'>
                    <div className='col-lg-2 col-sm-4 col-5 size-6 step1 '>
                        購物車
                    </div>
                    <div className='col-lg-2 col-sm-4 col-5 size-6  step2'>
                        運送&付款
                    </div>
                </div>
            {/* 購物車內商品 */}               
                <div className='d-flex justify-content-center mb-sm-5 mb-4 '>
                    {/* 桌機板 */}
                    <table  className='col-12  d-none d-sm-block cart-d-content'>
                 
                        <thead >
                            <tr className='size-6' >
                                <th className='text-center'><input type="checkbox"  className='form-check-input m-0 size-7' checked={isChecked} onChange={(e)=>{
                                    handleToggleSelectedAll(e.target.checked)
                                }}/></th>
                                <th>商品({buyLength.length})</th>
                                <th>商品名稱</th>
                                <th  className='text-center'>單價</th>
                                <th  className='text-center'>數量</th>
                                <th  className='text-center'>小計</th>
                                <th  className='text-center'>刪除</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((v,i)=>{
                                  // 在这里计算每个项目的total
                                    let total1=0
                                    if(v.buy){
                                        total1 = v.newprice * v.quantity;
                                    }
                                    // 累加到总和
                                    all += total1;                                
                                return(
                                <tr className='size-6' key={i}>
                                <td className='text-center '><input type="checkbox" checked={v.buy}  className="form-check-input size-7" onChange={(e)=>{
                                    handleToggleSelected(e.target.checked,v.cart_id)
                                }}/></td>
                                <td><img src={v.images} /></td>
                                <td>
                                    <Link href={`/product/${v.category_id}/${v.subcategory_id}/${v.product_id}`}>{v.product_name}</Link>
                                    <p className='size-7 type'>{v.type}</p>
                                </td>
                                <td className='text-center'>
                                    <p className='price size-7 mb-0'>NT${v.price}</p>
                                    <p className='newprice '>NT${v.newprice}</p> 
                                </td>
                                
                                <td>
                                    <div className="input-group ">
                                        <button type="button" className="btn btn-outline-brown" onClick={() => {
                                            if(v.quantity==1){
                                                deleteCart(v.cart_id)
                                            }else{
                                                handleDecreaseQuantity(v.cart_id)
                                                changeInfo(v.quantity,v.cart_id,-1)
                                            }                                           
                                        }}>-</button>
                                        <input type="text" className="form-control  text-center  w-25"  value={v.quantity} name="quantity" />
                                        <button type="button" className="btn btn-outline-brown" onClick={() => {
                                            handleIncreaseQuantity(v.cart_id)
                                            changeInfo(v.quantity,v.cart_id,1)
                                        }}>+</button>
                                    </div>
                                </td>
                                <td className='text-center'>NT${v.newprice * v.quantity}</td>
                                <td className='text-center'><button className='delete' 
                                    onClick={() => {deleteCart(v.cart_id) }}
                                    ><RiDeleteBin5Fill /></button></td>
                                </tr>
                                )

                            })}
                        </tbody>
                    </table>
                    {/* 手機板 */}
                    <table className='d-sm-none d-block cart-m-content col-11'>
                        <thead>
                            <tr className='m-size-5'>
                                <th className='text-center'><input type="checkbox" className='form-check-input m-0 m-size-7' checked={isChecked} onChange={(e)=>{
                                    handleToggleSelectedAll(e.target.checked)
                                }}/></th>
                                <th colSpan="4">我的購物車({buyLength.length})</th>                              
                            </tr>
                        </thead>
                        <tbody>                           
                            {cart.map((v,i)=>{    
                                return(
                            <tr className='m-size-7' key={i}>
                                <td className='text-center'><input type="checkbox" className='form-check-input' checked={v.buy} onChange={(e)=>{
                                    handleToggleSelected(e.target.checked,v.cart_id)
                                }}/></td>
                                <td><img src={v.images}></img></td>
                                <td className=''>
                                    <Link href={`/product/${v.category_id}/${v.subcategory_id}/${v.product_id}`}>{v.product_name}</Link>
                                    <p className='m-size-7 type m-0'>{v.type}</p>
                                    <p className='m-0 newprice'>NT${v.newprice}</p>
                                    
                                </td>
                                <td>
                                    <div className="input-group input-group-sm ">
                                        <button type="button" className="btn btn-outline-brown" onClick={() => {
                                           if(v.quantity==1){
                                                deleteCart(v.cart_id)
                                            }else{
                                                handleDecreaseQuantity(v.cart_id)
                                                changeInfo(v.quantity,v.cart_id,-1)
                                            }       
                                        }}>-</button>
                                        <input type="text" className="form-control  text-center "  value={v.quantity}/>
                                        <button type="button" className="btn btn-outline-brown" onClick={() => {
                                            handleIncreaseQuantity(v.cart_id)
                                            changeInfo(v.quantity,v.cart_id,1)
                                        }}>+</button>
                                    </div>
                                </td>
                                <td className='text-center'><button className='delete' 
                                        onClick={() => {deleteCart(v.cart_id) }} >
                                        <RiDeleteBin5Fill /></button>
                                </td>
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
            {/* 優惠碼+明細 */}
                <div className='d-flex flex-wrap justify-content-around mb-sm-5 mb-4'>
                    <div className='col-lg-3 col-sm-4 col-11 mb-3'>
                        <h6 className="discount size-6">優惠碼</h6>
                        <select className="form-select mb-2" value={selectedOption} onChange={(e)=>{
                            handleDiscountChange(e.target.value)
                            setSelectedOption(e.target.value)
                        }}>                           
                            <option selected value={`no,${0},${0}`}>請選擇</option>
                            {coupon.map((v,i)=>{
                                return(
                                    <option key={`coupon${i}`} value={`${v.type},${v.amount},${v.coupon_id}`}>{v.title}</option>
                                )
                            })}
                        </select>
                        <div className='d-grid size-6'>
                            <button type="button" className="btn btn-confirm ">確定使用</button>
                        </div>
                    </div>
                    <div className='col-lg-4 col-sm-7 col-11 detail d-flex justify-content-center p-sm-4 '>
                        <table className='col-sm-11 col-12'>
                            <tbody className=''>
                                <tr>
                                    <td className=''>商品總金額</td>
                                    <td className='text-end'>NT${all}</td>
                                </tr>
                                <tr>
                                    <td>優惠折扣</td>
                                    <td className='text-end'>NT$-{sale}</td>
                                    {/* <td className='text-end'>NT$-{discount[0]==="minus"?discount[1]:discount[0]==="off"?Math.ceil(allPrice*(100-discount[1])/100):0}</td> */}
                                </tr>
                                <tr className='cal'> 
                                    <td className='pb-2'>運費</td>
                                    <td className='text-end'>NT${freight}</td>
                                </tr>
                                <tr > 
                                    <th className='pt-2'>總計</th>
                                    <th className='text-end'>NT${allPrice-sale+freight}</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* 進度條 */}
            <div className='progress-part size-7'>
                <div className='container py-3 col-11'>
                    <div className='d-flex justify-content-between'>
                        <p>運費</p>                    
                        <p>{(allPrice-sale)>=1000?"已達免運金額":`再消費NT${1000-(allPrice-sale)}免運`}</p>
                    </div>
                    <div className="progress" role="progressbar" aria-label="" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{ width: `${(allPrice - sale) / 1000*100}%` }}></div>
                    </div>
                </div>
            </div>
            {/* 下一步 */}
            <div className='next py-2 size-7'>
                <div className='container d-flex justify-content-end align-items-center'>
                    <p className='m-0 pe-2'>總計NT${allPrice-sale+freight}</p>
                    <button className='btn btn-brown' onClick={saveCartToLocalStorage}>下一步</button>
                </div> 
            </div>           
        </div>
        )}

    </>
  )
}
