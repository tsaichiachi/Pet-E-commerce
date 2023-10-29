import React,{ useState,useEffect }  from 'react'
import data from '@/data/taiwan.json'
import axios from "axios";
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import moment from "moment";
import { useCart } from '@/hooks/useCart';
import Pagination from '@/components/pagination'

export default function Checkout() {
    const router = useRouter();
    const {setCart,userid} = useCart();
    const [isChecked, setIsChecked] = useState(false);
    const [commonAddress,setCommonAddress]=useState([{}])
    const [city,setCity]=useState(0)
    const [random,setRandom]=useState(0)
    const [area,setArea]=useState([])
    const [areaNumber,setAreaNumber]=useState([{}])
    const [areaName,setAreaName]=useState(0)
    const [payment,setPayment]=useState(1)
    const [shipment,setShipment]=useState(1)
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const itemsPerPage = 4
    const [activePage, setActivePage] = useState(1);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    //警告訊息
    const showAlert = (text) => {
        Swal.fire({
          text: text,
          icon: 'warning',
          confirmButtonText: '確定',
          confirmButtonColor: "#d7965b",
          iconColor: "#ca526f",
          color: "#512f10",
          focusConfirm: false,
        });
    };

    const [allPrice,setAllPrice]=useState(0)
    const [freight,setFreight]=useState(0)
    const [sale,setSale]=useState(0)
    const [discount,setDiscount]=useState([])
    const [finalCart,setFinalCart]=useState([])
    const [nobuyCart,setNobuyCart]=useState([])
    const [currentCart,setCurrentCart]=useState([])

    const getCommonAddress =  (id) => {
        axios.get(`http://localhost:3005/api/product/cart/address/${id}`)
            .then((response) => {
            const data = response.data.result;
            console.log(data);
            setCommonAddress(data)     
            })
            .catch((error) => {
            console.error("Error:", error);
        });
    }

    // const getCart =  (id) => {
    //     axios.get(`http://localhost:3005/api/product/cart/cart/${id}`)
    //      .then((response) => {
    //        const data = response.data.result;
    //        console.log(data);
    //        const newData=data.map((v)=>{
    //            return  { ...v, buy: true }
    //        })
    //        setCart(newData)     
    //      })
    //      .catch((error) => {
    //        console.error("Error:", error);
    //    });
    //  }

    let localCart
 
    useEffect(() => {
       if(!localStorage.getItem('allPrice')){
            router.push("/")
       }else{
             localCart = localStorage.getItem('cart');
            setAllPrice(parseInt(localStorage.getItem('allPrice')))
            setFreight(parseInt(localStorage.getItem('freight')))
            setSale(parseInt(localStorage.getItem('sale')))
            setDiscount(localStorage.getItem('discount'))

            let cartData = JSON.parse(localCart);
            setFinalCart(cartData.filter((v)=>v.buy===true))
            setNobuyCart(cartData.filter((v)=>v.buy===false))

            const userId = parseInt(localStorage.getItem('id'));
            getCommonAddress(userId)
       }
    }, [router.isReady]);

    useEffect(() => {
        setCurrentCart(finalCart.slice(startIndex, endIndex)) 
    }, [finalCart,activePage]);

    const totalPrice=allPrice-sale+freight 
    const orderNumber = Date.now();
    const createtTime=moment().format("YYYY/MM/DD  HH:mm:ss")

    //縣市名字
    let cityName
    if(city!==0){
        cityName=data.find((v)=>v.number==city).name
    }

     //縣市=>找鄉鎮市
    const handleCityChange = (event) => {
        const cityValue = parseInt(event.target.value);
        setCity(cityValue);
        for(let i=1;i<data.length+1;i++){
            if (cityValue ==i) {
                const newArea=data[i-1].districts.map(district => district.name)
                const newAreaNumber=data[i-1].districts
                setArea(newArea) 
                setAreaNumber(newAreaNumber)
                console.log(newAreaNumber);
            return  ;
            }
        }
        if (cityValue ==0) {
            setArea([])
            setAreaName(0)
        }
    };
    //鄉鎮市
    const handleAreaChange = (event) => {
        setAreaName(event.target.value)
    }


    //上一步
    const goPrevious=()=>{
        router.push('/product/cart')
    }

    //儲存常用地址
    const storeAddress=async () => {   
        const district=areaNumber.filter((v)=>v.name==areaName)
        const number=district[0].zip
        if(commonAddress.length==0){
            try {
                const response = await axios.put(`http://localhost:3005/api/product/cart/address`,{userid, city,number,address});        
            } catch (error) {
                console.error("Error:", error);
            }
        }else{
            try {
                const response = await axios.put(`http://localhost:3005/api/product/cart/updateAddress`,{userid, city,number,address});        
            } catch (error) {
                console.error("Error:", error);
            }
        }
    }

    //讀出常用地址
    const goAddress=async() => {   
        setCity(commonAddress[0].city) 
      
        const go = async () => {
            for(let i=1;i<data.length+1;i++){
            if (commonAddress[0].city ==i) {
                const newArea=data[i-1].districts.map(district => district.name)
                const newAreaNumber=data[i-1].districts
                console.log(newAreaNumber);
                setArea(newArea) 
                setAreaNumber(newAreaNumber)
                setRandom(random+1)
                break
            }
        }
        }
        await go();

  
    }

    useEffect(() => {
        if(commonAddress.length!==0){
            const district=areaNumber.filter((v)=>v.zip==commonAddress[0].area)
            console.log(district);
            const name=district[0].name
            console.log(name);          
            setAreaName(name)
            setAddress(commonAddress[0].detail)
        }  

    }, [random]);




    //貨到付款結帳-->寫進資料庫
    const checkout=async () => {    
        const discountArray =discount.split(",")
        const coupon = discountArray[discountArray.length - 1];
        console.log(cityName);
        let allAdress = "";
        if(shipment===1){
            allAdress=cityName+areaName+address
        }else{
            allAdress="小貓兩三隻門市"
        }   
        try {
          const response = await axios.put(`http://localhost:3005/api/product/cart/checkout`,{ coupon,userid,createtTime,totalPrice,orderNumber,allPrice ,sale,freight,payment,shipment,name,phone,allAdress});        
        } catch (error) {
          console.error("Error:", error);
        }
        //訂單明細
        for(let i=0;i<finalCart.length;i++){
            const productId=finalCart[i].product_id
            const productTypeId=finalCart[i].product_type_id
            const quantity=finalCart[i].quantity
            try {
                const response = await axios.put(`http://localhost:3005/api/product/cart/checkout/detail`,{orderNumber,productId,productTypeId,quantity});        
              } catch (error) {
                console.error("Error:", error);
              }

        }
        //刪減購物車
        for(let i=0;i<finalCart.length;i++){
            const id=finalCart[i].cart_id            
            try {
                const response = await axios.delete(`http://localhost:3005/api/product/cart/${id}`);         
            } catch (error) {
                console.error("Error:", error);
            }

        }
        setCart(nobuyCart)
        localStorage.removeItem("discount");
        localStorage.removeItem("cart");
        localStorage.setItem('orderNumber', orderNumber);
        localStorage.setItem('totalPrice',totalPrice );
        localStorage.setItem('finalCart',JSON.stringify(finalCart) );

    }
    //line pay付款結帳-->寫進資料庫
    const createOrder = async() => {
        let newFinalCart=[]
        if(sale>0 && freight==0){
          newFinalCart = [...finalCart, { product_id: 0, product_name: '優惠券', quantity: 1, newprice: -sale }];
        }else if(freight>0 && sale==0){
            newFinalCart = [...finalCart, { product_id: 0, product_name: '運費', quantity: 1, newprice: freight }];
        }else if(sale>0 && freight>0){
            newFinalCart = [...finalCart, { product_id: 0, product_name: '優惠券', quantity: 1, newprice: -sale },{ product_id: 1000, product_name: '運費', quantity: 1, newprice: freight }];
        }else{
          newFinalCart=finalCart
        }
        console.log(newFinalCart);

        const products = newFinalCart.map((item) => {
            return {
              id: item.product_id,
              name: item.product_name,
              quantity: item.quantity,
              price: item.newprice
            };
          });
        //   console.log(products);

          const discountArray =discount.split(",")
          const coupon = discountArray[discountArray.length - 1];
          let allAdress = "";
          if(shipment===1){
              allAdress=cityName+areaName+address
          }else{
              allAdress="小貓兩三隻門市"
          }  

        // 送至server建立訂單，packages與order id由server產生
        // products將會組合在packages屬性之下

        const response = await axios.post(
          `http://localhost:3005/api/pay/create-order`,
          {
            amount: totalPrice,
            coupon_id:coupon,
            user_id:userid,
            oid:orderNumber,
            created_at:createtTime,
            order_price:allPrice,
            sale:sale,
            freight:freight,
            order_payment:payment,
            order_shipment:shipment,
            buyer_name:name,
            buyer_phone:phone,
            buyer_address:allAdress,
            products: products,
          }
        )

        //訂單明細
        for(let i=0;i<finalCart.length;i++){
            const productId=finalCart[i].product_id
            const productTypeId=finalCart[i].product_type_id
            const quantity=finalCart[i].quantity
            try {
                const response = await axios.put(`http://localhost:3005/api/product/cart/checkout/detail`,{orderNumber,productId,productTypeId,quantity});        
              } catch (error) {
                console.error("Error:", error);
              }

        }
        //刪減購物車
        for(let i=0;i<finalCart.length;i++){
            const id=finalCart[i].cart_id  
            console.log(id);          
            try {
                const response = await axios.delete(`http://localhost:3005/api/product/cart/${id}`);         
            } catch (error) {
                console.error("Error:", error);
            }

        }
        setCart(nobuyCart)
        localStorage.setItem('orderNumber', orderNumber);
        localStorage.setItem('totalPrice',totalPrice );
        localStorage.setItem('newFinalCart',JSON.stringify(newFinalCart) );
        localStorage.removeItem("discount");
        localStorage.removeItem("cart");
    }

    //結帳
    const goCheckout=()=>{
        if(name===""){
            showAlert("請填寫收件人姓名")
        }else if(phone==""){
            showAlert("請填寫收件人連絡電話")
        }else if(shipment===1 && (areaName==0 ||city==0||address=="")){
            if(areaName==0 ||city==0){
            showAlert("請選擇宅配區域")
            }else if(address==""){
            showAlert("請填寫完整宅配地址")
            }
        }else if(payment==1 && isChecked && shipment==1){
            storeAddress()
            checkout();
            router.push('/product/cart/checkout/creditCard')
        }else if(payment==1  && (shipment==2 ||(!isChecked && shipment==1))){
            checkout();
            router.push('/product/cart/checkout/creditCard')
        }else if(payment==2 && isChecked && shipment==1){
            storeAddress()
            createOrder()
            router.push('/product/cart/checkout/pay')
        }else if(payment==2 && (shipment==2 ||(!isChecked && shipment==1))){
            createOrder()
            router.push('/product/cart/checkout/pay')
        }else if(payment==3 && isChecked && shipment==1){
            storeAddress()
            checkout();
            router.push('/product/cart/checkout/cash-on-delivery')
        }else if(payment==3 && (shipment==2 ||(!isChecked && shipment==1))){
            checkout();
            router.push('/product/cart/checkout/cash-on-delivery')
        }
    }

   
   
  return (
    <>
        <div className="checkout mt-5">
            <div className='container'>
                {/* 步驟 */}
                <div className='d-flex justify-content-center step text-center mb-4'>
                    <div className='col-lg-2 col-sm-4 col-5 size-6 step1'>
                        購物車
                    </div>
                    <div className='col-lg-2 col-sm-4 col-5 size-6  step2'>
                        運送&付款
                    </div>
                </div>
                {/* 注意事項 */}
                <div className='notice  mb-4 size-7 m-size-7'>
                    <p>【出貨公告】港澳地區貓砂將以多箱出貨方式。 <br />【出貨公告】超商取貨請填寫與證件相符之完整姓名，以確保取件權益。 <br />【出貨公告】貨運配送以一樓運送為主，若有需要增加配送樓層或條件，則須另按照樓層及運送材積酌收費用。 <br />【出貨公告】港澳地區恕不提供智能櫃/順豐站點配送，造成不便請見諒。</p>
                </div>     
                {/* 收件人資訊 */}
                <div className='title size-6 mb-3 py-1 ps-2'>
                    收件人資訊
                </div>
                <div className='information size-7  mb-3'>
                    <div className='row row-cols-1 justify-content-center justify-content-sm-start '>
                        <div className='d-flex mb-3 col-sm-12 col-11 flex-wrap name'>
                            <div className='col-lg-3 col-5 me-3'>
                                <label  className="form-label "><span>* </span>姓名<span >(必填)</span></label>
                                <input type="text" className="form-control " value={name} onChange={(e)=>{setName(e.target.value)}}></input>
                            </div>
                            <div className='col-lg-3 col-6 '>
                                <label  className="form-label "><span>* </span>連絡電話<span >(必填)</span></label>
                                <input type="text" className="form-control " value={phone} onChange={(e)=>{setPhone(e.target.value)}}></input>
                            </div>
                        </div>
                        <div className='col-12'>
                            <div className="accordion size-7 form-check">
                                <div>
                                    <input type="radio" name="shipmentAccordion" id="section1" className='form-check-input mt-2' value={1} checked={shipment==1} onChange={()=>{
                                    setShipment(1)
                                    }}/>
                                    <label for="section1">宅配
                                    {commonAddress.length==0?
                                    ("")
                                    :
                                    ( <button className='btn btn-confirm d-inline ms-3' onClick={()=>{
                                        goAddress()                                      
                                    }}>帶入常用地址</button>)}
                             
                                    </label> 
                                    
                                    <div className="content">
                                        <div className='d-flex mb-3 size-7 col-sm-12 col-11'>
                                            <div className='me-sm-3 col-lg-2 col-6'>
                                                <label>縣/市</label>
                                                <select className="form-select" value={city} onChange={handleCityChange}>
                                                    <option selected value={0}>請選擇</option>
                                                    {data.map((v)=>{
                                                        return(
                                                            <option key={v.name} value={v.number} >{v.name}</option>
                                                        )
                                                })}
                                                </select>
                                            </div>
                                            <div className='col-lg-2 col-6'>
                                                <label>鄉鎮市區</label>
                                                <select className="form-select" value={areaName} onChange={handleAreaChange}>
                                                    <option selected value={0}>請選擇</option>
                                                    {area.map((v, i) => (
                                                        <option key={i} value={v}>
                                                            {v}
                                                        </option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='col-lg-6 col-11 mb-2'>
                                            <label  className="form-label ">街道地址</label>
                                            <input type="text" className="form-control " value={address} onChange={(e)=>{setAddress(e.target.value)}}></input>
                                        </div>
                                        <input type="checkbox"  className='form-check-input me-1 size-7 ms-1 mt-1' checked={isChecked} onChange={(e)=>{
                                        setIsChecked(e.target.checked)
                                        }}/>
                                        <label  className="form-label ">儲存為常用地址</label>
                                       
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <input type="radio" name="shipmentAccordion" id="section2" className='form-check-input mb-3' value={2} checked={shipment==2} onChange={()=>{
                                    setShipment(2)
                                    }}/>
                                    <label for="section2">門市取貨</label>
                                </div>      
                            </div>
                        </div>                                                             
                    </div>
                </div>
                {/* 付款方式 */}
                <div className='title size-6  mb-3 py-1 ps-2'>
                    付款方式
                </div>
                <div className='mb-4 col-sm-12 col-11'>
                    <div className="accordion size-7 form-check">
                        <div>
                            <input type="radio" name="paymentAccordion" id="section3" className='form-check-input mb-3' value={1} checked={payment==1} onChange={()=>{
                                setPayment(1)
                            }}/>
                            <label for="section3">信用卡</label>
                            {/* <div className="content col-lg-5 col-12 m-0">
                                <input type="text" placeholder="信用卡號碼" className="form-control mb-2" />
                                <div className='d-flex'> 
                                    <input type="text" placeholder="到期日" className="form-control " />
                                    <input type="text" placeholder="安全驗證碼" className="form-control " />
                                </div>
                            </div> */}
                        </div>
                        <div>
                            <input type="radio" name="paymentAccordion" id="section4" className='form-check-input mb-3' value={2} checked={payment==2} onChange={()=>{
                                setPayment(2)
                            }}/>
                            <label for="section4">Line Pay</label>
                        </div>
                        <div>
                            <input type="radio" name="paymentAccordion" id="section5" className='form-check-input' value={3} checked={payment==3} onChange={()=>{
                                setPayment(3)
                            }}/>
                            <label for="section5">貨到付款</label>
                        </div>       
                    </div>
                </div>  
                {/* 商品明細 */}
                <div className='title size-6  mb-3 py-1 ps-2'>
                        商品明細
                </div>
                {/* 購物車內商品 */}               
                <div className='d-flex justify-content-center mb-4 '>
                    {/* 桌機板 */}
                    <table  className='col-12  d-none d-sm-block cart-d-content '>
                        <thead >
                            <tr className='size-7' >
                                <th>商品({finalCart.length})</th>
                                <th>商品名稱</th>
                                <th  className='text-center'>單價</th>
                                <th  className='text-center'>數量</th>
                                <th  className='text-center'>小計</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCart.map((v,i)=>{
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
                        <tbody>
                        {currentCart.map((v,i)=>{
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
                {finalCart.length>=5?(
                    <Pagination  itemsPerPage={itemsPerPage} total={finalCart} activePage={activePage} setActivePage={setActivePage}/>
                ):(
                    ""
                )}
                    {/* 優惠碼+明細 */}
                {/* <div className='d-flex justify-content-sm-end justify-content-center  mb-4 col-lg-10 col-sm-11'>      */}
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
            {/* 結帳 */}
            <div className='nextStep py-2 size-7'>
                <div className='container d-flex justify-content-between align-items-center'>
                    <button className='btn btn-brown me-auto' onClick={goPrevious}>上一步</button>
                    <p className='m-0 pe-2'>總計NT${totalPrice}</p>
                    <button className='btn btn-price' onClick={()=>{
                        goCheckout()
                    }}>結帳</button>
                </div> 
            </div>                          
                       
        </div>

    </>
  )
}
