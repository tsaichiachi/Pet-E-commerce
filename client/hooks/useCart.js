import { createContext, useState, useContext,useEffect } from 'react'
import { useRouter } from 'next/router';
// import { useAuth } from '@/context/fakeAuthContext';
import axios from "axios";
// 習慣上都以null作為初始化值
const cartContext = createContext(null)

export function CartProvider({ children }) {
    const router = useRouter();
    const [cart, setCart] = useState([])
    const [userid, setId] = useState(null);


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
    useEffect(() => {
        const userId = parseInt(localStorage.getItem('id'));
        setId(userId);
    }, [router.isReady]);

    useEffect(() => {
      
      if(userid){
        getCart(userid)
     }
    }, [userid]) 


  return (
    <cartContext.Provider value={{cart, setCart,userid }}>
      {children}
    </cartContext.Provider>
  )
}

export const useCart = () => useContext(cartContext)