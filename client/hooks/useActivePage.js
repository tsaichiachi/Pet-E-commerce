import { createContext, useState, useContext} from 'react'
import { useRouter } from 'next/router';


const ActivePageContext = createContext();


export function ActivePageProvider ({ children }) {
  const { pathname } = useRouter()
  console.log(pathname);
  let page
  if(pathname=="/member/order"){
    page=1
  }else if(pathname=="/member/purchast"){
    page=2
  }else if(pathname=="/member/wishlist"){
    page=3
  }else if(pathname=="/member/coupon"){
    page=4
  }else if(pathname=="/member/helper"){
    page=5
  }else if(pathname=="/member/joblist"){
    page=6
  }else if(pathname=="/member/history"){
    page=7
  }else if(pathname=="/member/selling"){
    page=8
  }else if(pathname=="/member/reserve"){
    page=9
  }else {
    page=0
  }

  console.log(page);
  const [activeButton, setActiveButton] = useState(page)


  return (
    <ActivePageContext.Provider value={{activeButton, setActiveButton }}>
      { children }
    </ActivePageContext.Provider>
  )
}

export const useActivePage=()=>useContext(ActivePageContext)
