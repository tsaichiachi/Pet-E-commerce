import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

const ProductActivePageContext = createContext();

export function ProductActivePageProvider({ children }) {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState(0);

  const { pathname, query } = useRouter();
  useEffect(() => {
    console.log(pathname);
    console.log(query.subcategory_id);

    if (router.isReady) {
      // 确保能得到 router.query 有值
      if (query.subcategory_id == "1") {
        setActiveButton(1);
      } else if (query.subcategory_id == "2") {
        setActiveButton(2);
      } else if (query.subcategory_id == "3") {
        setActiveButton(3);
      } else if (query.subcategory_id == "4") {
        setActiveButton(4);
      } else if (query.subcategory_id == "5") {
        setActiveButton(5);
      } else if (query.subcategory_id == "6") {
        setActiveButton(6);
      } else if (query.subcategory_id == "7") {
        setActiveButton(7);
      } else if (query.subcategory_id == "8") {
        setActiveButton(8);
      } else if (query.subcategory_id == "9") {
        setActiveButton(9);
      } else if (query.subcategory_id == "10") {
        setActiveButton(10);
      } else if (query.subcategory_id == "11") {
        setActiveButton(11);
      } else if (query.subcategory_id == "12") {
        setActiveButton(12);
      } else if (query.subcategory_id == "13") {
        setActiveButton(13);
      } else if (query.subcategory_id == "14") {
        setActiveButton(14);
      } else if (query.subcategory_id == "15") {
        setActiveButton(15);
      } else if (query.subcategory_id == "16") {
        setActiveButton(16);
      } else if (query.subcategory_id == "17") {
        setActiveButton(17);
      } else if (query.subcategory_id == "18") {
        setActiveButton(18);
      }
    }
  }, [router.query]);

  // page = 18;

  return (
    <ProductActivePageContext.Provider
      value={{ activeButton, setActiveButton }}
    >
      {children}
    </ProductActivePageContext.Provider>
  );
}

export const useProductActivePage = () => useContext(ProductActivePageContext);
