import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// 中文路徑對照陣列，移出到config/index.js中設定
import { pathnameLocale } from "@/config/index";
import Link from "next/link";

function BreadCrumb(props) {
  const { pathname, query } = useRouter();
  // console.log(pathname);
  console.log(query);

  const [product, setProduct] = useState([]);
  const [article, setArticle] = useState([]);
  const [mission, setMission] = useState([]);
  const [subcategory, setSubcategory] = useState([]);

  const getProduct = () => {
    axios
      .get("http://localhost:3005/api/product")
      .then((response) => {
        const data = response.data.result;
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getArticle = () => {
    axios
      .get("http://localhost:3005/api/breadcrumb/article")
      .then((response) => {
        const data = response.data.result;
        setArticle(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const getSubcategory = () => {
    axios
      .get("http://localhost:3005/api/breadcrumb/subcategory")
      .then((response) => {
        const data = response.data.result;
        setSubcategory(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    getProduct();
    getArticle();
    getSubcategory();
  }, []);

  let pathArray = [];

  const formatTextLocale = (pathname) => {
    pathArray = pathname.split("/");

    // console.log(pathArray);

    const pathArrayLocale = pathArray.map((v, i) => {
      if (!v) return "";

      //訂單
      if (v == "[oid]") return "訂單明細";
      const pid = query.pid;
      const aid = query.id;
      const sid = query.subcategory_id;
      //產品
      if (v == "[pid]" && Number(query.pid))
        return product[pid - 1].product_name;
      if (v == "[pid]" && query.pid == "category") return "";

      if (v == "[category_id]" && query.category_id == 1) return "食物";
      if (v == "[category_id]" && query.category_id == 2) return "用品";
      if (v == "[category_id]" && query.category_id == 3) return "清潔";
      if (v == "[category_id]" && query.category_id == 4) return "保健";
      if (v == "[category_id]" && query.category_id == 5) return "護理";
      if (v == "[subcategory_id]" && query.subcategory_id)
        return subcategory[sid - 1].subcategory_name;

      //文章ok
      if (v == "[article_category_id]" && query.article_category_id == 1)
        return "日常提案";
      if (v == "[article_category_id]" && query.article_category_id == 2)
        return "毛孩知識";
      if (v == "[article_category_id]" && query.article_category_id == 3)
        return "好物研究";
      if (v == "[id]" && query.id) return article[aid - 1].title;

      //結帳
      if (v == "checkout") return "";

      //其他
      return pathnameLocale[v] ? pathnameLocale[v] : v;
    });

    const listArray = pathArrayLocale.map((v, i, array) => {
      // 第一個 與 id類(數字類型)的最後結尾params會忽略, 首頁不需要
      if (i === 0 || v === "") return "";

      // 最後一個
      if (i === array.length - 1) {
        console.log(query.oid);
        return (
          <li key={i} className="breadcrumb-item active" aria-current="page">
            {v}
          </li>
        );
      }
      if (i !== array.length - 1 && v == "會員中心") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/member/profile">{v}</Link>
          </li>
        );
      }

      if (i !== array.length - 1 && v == "日常提案") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/article/1">{v}</Link>
          </li>
        );
      }
      if (i !== array.length - 1 && v == "毛孩知識") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/article/2">{v}</Link>
          </li>
        );
      }
      if (i !== array.length - 1 && v == "好物研究") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/article/3">{v}</Link>
          </li>
        );
      }

      if ((i == array.length - 2 || i == array.length - 3) && v == "食物") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/product/1">{v}</Link>
          </li>
        );
      }
      if ((i == array.length - 2 || i == array.length - 3) && v == "用品") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/product/2">{v}</Link>
          </li>
        );
      }
      if ((i == array.length - 2 || i == array.length - 3) && v == "清潔") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/product/3">{v}</Link>
          </li>
        );
      }
      if ((i == array.length - 2 || i == array.length - 3) && v == "保健") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/product/4">{v}</Link>
          </li>
        );
      }
      if ((i == array.length - 2 || i == array.length - 3) && v == "護理") {
        return (
          <li key={i} className="breadcrumb-item">
            <Link href="/product/5">{v}</Link>
          </li>
        );
      }

      if (i == array.length - 2 && query.subcategory_id) {
        const type = subcategory.map((a) => {
          if (i == array.length - 2 && a.subcategory_name == v) {
            return (
              <li key={i} className="breadcrumb-item">
                <Link href={`/product/${a.category_id}/${a.subcategory_id}`}>
                  {v}
                </Link>
              </li>
            );
          }
        });
        return type;
      }

      // 其它中間樣式
      return (
        <li key={i} className="breadcrumb-item">
          <Link href={pathArray.slice(0, i + 1).join("/")}>{v}</Link>
        </li>
      );
    });
    return listArray;
  };
  return (
    <>
      {pathname == "/" ||
      pathname == "/product/cart/checkout" ||
      pathname == "/chatlist/[id]" ||
      pathname == "/chatlist" ||
      pathname == "/product/cart/checkout/pay" ||
      pathname == "/pay-confirm" ||
      pathname == "/product/cart/checkout/cash-on-delivery" ||
      pathname == "/work/find-mission" ||
      pathname == "/product/cart/checkout/creditCard" ||
      pathname == "/member/login" ||
      pathname == "/work/find-mission/[mission_id]" ||
      pathname == "/work/create-mission" ||
      pathname == "/member/forget-password" ||
      pathname == "/work/find-helper/[uid]" ? (
        ""
      ) : (
        <>
          <nav aria-label="breadcrumb " className="my-4 container">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">首頁</Link>
              </li>
              {formatTextLocale(pathname)}
            </ol>
          </nav>
        </>
      )}
    </>
  );
}

export default BreadCrumb;
