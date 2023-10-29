//商品列表頁
import { React, useState, useRef } from 'react';
import ProductCard2 from '@/components/product/product-card2';
import { useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Pagination from '@/components/pagination';
import { HiOutlineFilter } from 'react-icons/hi';
import LoadingOverlay from '@/components/product/loadingoverlay'; //加載畫面尚未成功
import { BiSearchAlt } from "react-icons/bi";
import jwt_decode from 'jwt-decode';
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/router";
import ProductSlick2 from '@/components/product/product-slick2';
import { FaPaw } from 'react-icons/fa';

const Search = ({ handleSearch, placeholder, color, onClick, search, setSearch }) => {

    
    const rippleBtnRef = useRef(null);
    const inputRef = useRef(null);
    const handleRipple = () => {
        const btn = rippleBtnRef.current;
        btn.classList.add("ripple");
        setTimeout(() => {
            btn.classList.remove("ripple");
        }, 500); //動畫持續時間結束後移除動畫效果，讓動畫可以重複使用
    };

    return (
        <div className="job-search">
            <input
                id="search-input"
                type="text"
                placeholder={placeholder || "Search"}
                ref={inputRef}
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    console.log(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    handleRipple();
                    handleSearch(search);
                    console.log("按鈕有被點到");
                }}
                ref={rippleBtnRef}
            >
                <BiSearchAlt className="job-search-icon" />
            </button>
        </div>
    );
};



export default function ProductList() {
    const router = useRouter();
    // 讀取資料庫資料
    const [productDataOrigin, setProductDataOrigin] = useState([]);
    const [productData, setProductData] = useState([]); // 初始化為一個帶有 result 屬性的物件
    useEffect(() => {    
        if (router.isReady) {
          // 確保能得到router.query有值
          const {category_id } = router.query;
          console.log(category_id);
          setActiveKey(parseInt(category_id)-1)
          // 有pid後，向伺服器要求資料，設定到狀態中
          axios.get(`http://localhost:3005/api/product/product/category/${category_id}`).then((response) => {
            const data = response.data.result;
            console.log(data);
            setProductData(data); 
            setProductDataOrigin(data)
            // 將伺服器端的 result 放入物件中
            // setMainPic(data[0].images_one)
            // console.log(response.data.result[0].images_one)
        })
        }
        // eslint-disable-next-line
      }, [router.query]);

    // 用於儲存解析後的userID
    const [userId, setUserId] = useState(null);
    console.log(userId);

    // 利用token拿到當前登入的userID
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                const currentUserID = decodedToken.id;
                console.log("currentUserID", currentUserID);
                setUserId(currentUserID);
                // 在此處將令牌token添加到請求標頭
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error("解析Token時出錯", error);
            }
        }
    }, []);


    //圖片抽換
    const [mainPic, setMainPic] = useState(''); // 初始化為 v.images_one
    // 讀取all product 資料庫資料
    useEffect(() => {
        // axios.get(`http://localhost:3005/api/product/product/category/${category_id}`).then((response) => {
        //     const data = response.data.result;
        //     console.log(data);
        //     setProductData(data); // 將伺服器端的 result 放入物件中
        //     setMainPic(data[0].images_one)
        //     console.log(response.data.result[0].images_one)
        // });
    }, []);

    //分頁
    const itemsPerPage = 18
    const [activePage, setActivePage] = useState(1);
    const startIndex = (activePage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = productData.slice(startIndex, endIndex);

    const total = productData
    // console.log(total)

    const [isUpIconVisible, setIsUpIconVisible] = useState(false);
    const [isPriceIconVisible, setIsPriceIconVisible] = useState(false);

    // 手風琴剛開始只有第一格打開
    const [activeKey, setActiveKey] = useState(0); // 初始值为0，表示第一个格子展开

    //排序按鈕切換
    const toggleUpIcon = () => {
        setIsUpIconVisible(!isUpIconVisible);
        // 如果價格按鈕已經是 $text-main，則切換價格按鈕回 $text-mark
        if (isPriceIconVisible) {
            setIsPriceIconVisible(false);
        }
    };

    const togglePriceIcon = () => {
        setIsPriceIconVisible(!isPriceIconVisible);

        // 如果上架時間按鈕已經是 $text-main，則切換上架時間按鈕回 $text-mark
        if (isUpIconVisible) {
            setIsUpIconVisible(false);
        }
    };

    //讀出大類小類
    // const [subcategoryData, setSubcategoryData] = useState({ result: [] });
    // useEffect(() => {
    //     axios.get("http://localhost:3005/api/product/category").then((response) => {
    //         setSubcategoryData({ result: response.data.result });
    //     });
    // }, [])

    
    //讀出大類
    const [subcategoryData, setSubcategoryData] = useState({ result: [] });
    useEffect(() => {
        axios.get("http://localhost:3005/api/product/category").then((response) => {
            setSubcategoryData({ result: response.data.result });
        });
    }, [])
        //讀出小類
        const [subcategoryDataOne, setSubcategoryDataOne] = useState([]);
        useEffect(() => {
            axios.get("http://localhost:3005/api/product/subcategory").then((response) => {
                setSubcategoryDataOne(response.data.result );
                console.log(subcategoryDataOne);
            });
            
        }, [])

    //篩選＋排序+關鍵字
    // 狀態變數，用於存儲商品數據、加載狀態和其他篩選選項
    //category會導致card的category不見！！！！！！！！！！！！！！！！！！
    const [category, setCategory] = useState(null);
    const [subcategory, setSubcategory] = useState(null);
    const [vendor, setVendor] = useState(null);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // 加載畫面
    const [selectedSort, setSelectedSort] = useState(''); // 定義一個狀態用於存儲排序方式，預設為空字串
    const [search, setSearch] = useState(null);


    // 根據篩選條件發送請求到後端 API
    // useEffect(() => {
    //     setIsLoading(true);
    //     axios.get('http://localhost:3005/api/product/filter_sort', {
    //         params: {

    //             sortBy: selectedSort,
    //         }
    //     })
    //         .then(response => {
    //             // 请求完成后隐藏加载蒙层
    //             setIsLoading(false);
    //             setProductData(response.data.result);
                
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             setIsLoading(false);
    //         });
    // }, [selectedSort]);

    // 當選擇不同的篩選條件時，更新相應的狀態
    // 透過 event.target.value 來找到用戶輸入的值
    const handleCategoryChange = (categoryName) => {
        setCategory(categoryName);
        console.log(categoryName)
        setSubcategory(null);
    };
    <LoadingOverlay isLoading={isLoading} />

    const handlesubCategoryChange = (subcategoryName) => {
        setCategory(null);
        const trimmedSubcategory = subcategoryName.trim();
        setSubcategory(trimmedSubcategory);
        console.log(trimmedSubcategory)
    };

    const handleVendorChange = (event) => {
        setVendor(event.target.value)
    }

    const handleMinPriceChange = (event) => {
        setMinPrice(event.target.value);
    };

    const handleMaxPriceChange = (event) => {
        setMaxPrice(event.target.value);
    };

    // const handleSortByChange = (event) => {
    //     setSortBy(event.target.value);
    // };

    // 處理排序選擇的變化
    const handleSortChange = (event) => {
        const selectedValue = event.target.value;
        if(selectedValue=="price_desc"){
            const newProduct=productData.sort((a, b) => b.specialoffer - a.specialoffer);
            setProductData(newProduct)
        }else if(selectedValue=="price_asc"){
            const newProduct=productData.sort((a, b) => a.specialoffer - b.specialoffer);
            setProductData(newProduct)

        }else{
            const newProduct=productData.sort((a, b) => a.product_id - b.product_id);
            setProductData(newProduct)
        }
        setSelectedSort(selectedValue); // 更新選擇的排序方式
        console.log(selectedValue)
    };


    // //廠商與價錢篩選
    // const handleFilterSubmit = () => {
    //     // 在事件處理程序中構建請求資料
    //     const requestData = {
    //         vendor: vendor,
    //         minPrice: minPrice,
    //         maxPrice: maxPrice
    //     };

    //     // 使用 Axios 或其他方式將資料送到後端
    //     axios.post('http://localhost:3005/api/product/filter_sort', requestData)
    //         .then(response => {
    //             // 處理後端返回的資料
    //             console.log('後端回應:', response.data);
    //             // 更新產品資料或其他操作
    //             setProductData(response.data.result);
    //         })
    //         .catch(error => {
    //             console.error('錯誤:', error);
    //         });
    // };

    //篩選重複的廠商
    const [vendorData, setVendorData] =useState([]);
    // useEffect(() => {
    //     axios.get("http://localhost:3005/api/product/vendor").then((response) => {
    //         console.log(response.data.result);
    //         setVendorData({ result: response.data.result });
    //     });
    // }, []);
        useEffect(() => {
            let newvendor = [];
            for (let i = 0; i < productData.length; i++) {
                let currentVendor = productData[i].vendor;   
                if (newvendor.indexOf(currentVendor) === -1) {
                    newvendor.push(currentVendor);
                }
            }
            setVendorData(newvendor)        
    }, [productDataOrigin]);
    
    //傳送search的到後端
    const handleSearch = (search) => {
        console.log("handleSearch 函数被使用，search結果:", search);
        axios.get('http://localhost:3005/api/product/filter_sort', {
            params: {
                search,
            }
        })
            .then(response => {
                // 请求完成后隐藏加载蒙层
                setIsLoading(false);
                setProductData(response.data.result);
                setSearch(''); //搜尋之後清空搜尋文字
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });
    };

    //傳送vendor, minPrice, maxPrice的到後端
    // const handlePriceVendorfilter = (vendor, minPrice, maxPrice) => {
    //     console.log("handlePriceVendorfilter 函数被使用，search結果:", vendor, minPrice, maxPrice);
    //     axios.get('http://localhost:3005/api/product/filter_sort', {
    //         params: {
    //             vendor, 
    //             minPrice, 
    //             maxPrice
    //         }
    //     })
    //         .then(response => {
    //             // 请求完成后隐藏加载蒙层
    //             setIsLoading(false);
    //             setProductData(response.data.result);
    //             setVendor(''); //搜尋之後清空搜尋文字
    //             setMinPrice('');
    //             setMaxPrice('');
    //         })
    //         .catch(error => {
    //             console.error('Error:', error);
    //             setIsLoading(false);
    //         });
    // };

    const handlePriceVendorfilter = (vendor, minPrice, maxPrice) => {
        console.log("handlePriceVendorfilter 函数被使用，search結果:", vendor, minPrice, maxPrice);
        let lowPrice, highPrice, finalData

        if (minPrice === "" || minPrice == null) {
            lowPrice = productDataOrigin
        } else {
            lowPrice = productDataOrigin.filter((v) => v.specialoffer >= minPrice)
        }
        if (maxPrice === "" || maxPrice == null) {
            highPrice = lowPrice
        } else {
            highPrice = lowPrice.filter((v) => v.specialoffer <= maxPrice)
        }
        if (vendor === "" || vendor == null) {
            finalData = highPrice
        } else {
            finalData = highPrice.filter((v) => v.vendor == vendor)
        }
        if (finalData.length === 0) {
            alert("沒有符合篩選的結果");
        } else {
            if (selectedSort === "" || selectedSort === null) {
                setProductData(finalData);
            } else if (selectedSort === "price_desc") {
                const newProduct = finalData.sort((a, b) => b.specialoffer - a.specialoffer);
                setProductData(newProduct);
            } else if (selectedSort === "price_asc") {
                const newProduct = finalData.sort((a, b) => a.specialoffer - b.specialoffer);
                setProductData(newProduct);
            }
        }
    };

    //sidebar
 



    return (
        <>

            <div className='product-list'>
                <div className='container'>
                    {/* <nav className="breadcrumb-wrapper" aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <Link href="/">首頁</Link>
                            </li>
                            <li class="breadcrumb-item" aria-current="page">
                                <Link href="/product" >
                                    全部商品
                                </Link>
                            </li>
                        </ol>
                    </nav> */}
                    {/* <div className='banner mb-5 '>
                        <ProductSlick2 />
                    </div> */}
                    <div className="search-sort d-flex flex-md-row flex-column justify-content-between align-items-center ms-3 me-3">
                        <Search placeholder={"請輸入商品或品牌關鍵字"} search={search} setSearch={setSearch} handleSearch={handleSearch} />
                        {/* created_at和specialoffer排序 */}
                        <div className='sort d-flex flex-row align-items-center' >
                            {/* <button className={`size-7 m-1 p-1 ${isUpIconVisible ? 'active' : ''}`} onClick={toggleUpIcon}>
                                    上架時間 {isUpIconVisible ? <FaCaretUp /> : <FaCaretDown />}
                                </button>
                                <button className={`size-7 m-1 p-1 ${isPriceIconVisible ? 'active' : ''}`} onClick={togglePriceIcon}>
                                    價格 {isPriceIconVisible ? <FaCaretUp /> : <FaCaretDown />}
                                </button> */}
                            <div className="specialoffer-sort px-1" >排序依據</div>
                            <div>
                                <select
                                    id="specialoffer-sort"
                                    className="form-select"
                                    onChange={handleSortChange} // 選項改變時觸發事件處理程序
                                    value={selectedSort} // 設定選擇的值
                                >
                                    <option value="">請選擇</option>
                                    <option value="price_desc">價格由高到低</option>
                                    <option value="price_asc">價格由低到高</option>
                                    {/* <option value="created_at_desc">上架由新到舊</option>
                                        <option value="created_at_asc">上架由舊到新</option> */}
                                </select>
                            </div>

                        </div>
                    </div>
                    {/* 手機版篩選 */}
                    <div className="product-offcanvas-m d-block d-lg-none ">
                        <button className="product-sidebar-btn btn-confirm size-5" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><HiOutlineFilter /></button>
                        <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasRightLabel">篩選</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>

                            <div className="offcanvas-body ">
                                {/* category及subcategory篩選 */}
                                <div className="accordion" id={`accordionPanelsStayOpenExample`}>
                                    {subcategoryData.result.map((category, index) => (
                                        <div className="accordion-item" key={index}>
                                            <h2 className="accordion-header" id={`panelsStayOpen-headingCategory-${index}`}>
                                                <button
                                                    className="accordion-button size-6"
                                                    type="button"
                                                    data-bs-toggle="collapse"
                                                    data-bs-target={`#panelsStayOpen-collapseCategory-${index}`}
                                                    aria-expanded={activeKey === index}
                                                    aria-controls={`panelsStayOpen-collapseCategory-${index}`}
                                                    data-bs-parent="#accordionPanelsStayOpenExample" // 將這行添加到這個button元素中
                                                    onClick={() => {
                                                        router.push(`/product/${category.category_id}`)
                                                        setActiveKey(index); // 当按钮被点击时，更新activeKey状态
                                                        // handleCategoryChange(category.category_name);
                                                        // console.log(`Button for category ${category.category_name} clicked.`);
                                                    }}
                                                >
                                                    {category.category_name}
                                                </button>
                                            </h2>
                                            <div id={`panelsStayOpen-collapseCategory-${index}`} className={`accordion-collapse collapse ${activeKey === index ? 'show' : ''}`}>
                                                <div className="accordion-body row">
                                                    {subcategoryDataOne.map((v, i) => {
                                                    if (v.category_id === category.category_id) {
                                                        return (
                                                            <button
                                                                className="button-subcategory size-7"
                                                                type="button"
                                                                key={i}
                                                                onClick={() => {
                                                                    router.push(`/product/${category.category_id}/${v.subcategory_id}`);
                                                                    // handlesubCategoryChange(subcategory.trim());
                                                                    // console.log(`Button for subcategory ${subcategory.trim()} clicked.`);
                                                                }}
                                                            >
                                                                {v.subcategory_name}
                                                            </button>
                                                        );
                                                    }
                                                    return null; // 或者直接不返回任何内容
                                                })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             

                                <div className='filter mt-3 '>
                                    <div className="card filter-card">
                                        {/* <div className="card-header">
                                            其他選項
                                        </div> */}
                                        <div className="card-body">
                                            {/* specialoffer篩選 */}
                                            <div className="col-12">
                                                <label for="inputprice size-6" className="form-label">價格區間</label>
                                                <div className="row col-md">
                                                    <div className="col-md-5">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="price"
                                                            placeholder="$最低價"
                                                            value={minPrice}
                                                            onChange={handleMinPriceChange}
                                                        />
                                                    </div>
                                                    <div class="col-md dash">
                                                        ~
                                                    </div>
                                                    <div className="col-md-5">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="price"
                                                            placeholder="$最高價"
                                                            value={maxPrice}
                                                            onChange={handleMaxPriceChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* vendor篩選 */}
                                            <div className="col-12 mt-2">
                                                <label for="brand size-6" className="form-label">品牌</label>
                                                {/* <input type="text" className="form-control" id="brand" placeholder="請輸入品牌關鍵字">
                                            </input> */}
                                                <select
                                                    id="inputsubCategory"
                                                    className="form-select"
                                                    name="subcategory_name"
                                                    value={vendor}
                                                    onChange={handleVendorChange}
                                                >
                                                    <option value="">請選擇</option>
                                                    {vendorData.map((vendor, index) => (
                                                        <option key={index} value={vendor}>{vendor}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-brown col-12 mt-3"
                                                onClick={() => {
                                                    handlePriceVendorfilter(vendor, minPrice, maxPrice);
                                                    console.log("價錢與品牌按鈕有被點到");
                                                }} // 點擊按鈕時觸發事件處理程序
                                            >
                                                確定
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 電腦版篩選 */}
                    <section className='sidebar-product d-flex  flex-column flex-lg-row mt-3' >
                        <div className='sidebar col-md-3 ms-3 me-1 d-none d-lg-block pe-4'>
                            {/* category及subcategory篩選 */}
                            <div className="accordion" id={`accordionPanelsStayOpenExample`}>
                                {subcategoryData.result.map((category, index) => (
                                    <div className="accordion-item" key={index}>
                                        <h2 className="accordion-header" id={`panelsStayOpen-headingCategory-${index}`}>
                                            <button
                                                className="accordion-button size-6"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#panelsStayOpen-collapseCategory-${index}`}
                                                aria-expanded={activeKey === index}
                                                aria-controls={`panelsStayOpen-collapseCategory-${index}`}
                                                data-bs-parent="#accordionPanelsStayOpenExample" // 將這行添加到這個button元素中
                                                onClick={() => {
                                                    router.push(`/product/${category.category_id}`)
                                                    setActiveKey(index); // 当按钮被点击时，更新activeKey状态
                                                    // handleCategoryChange(category.category_name);
                                                    // console.log(`Button for category ${category.category_name} clicked.`);
                                                }}
                                            >
                                                {category.category_name}
                                            </button>
                                        </h2>
                                        <div id={`panelsStayOpen-collapseCategory-${index}`} className={`accordion-collapse collapse ${activeKey === index ? 'show' : ''}`}>
                                            <div className="accordion-body row">
                                                {subcategoryDataOne.map((v, i) => {
                                                    if (v.category_id === category.category_id) {
                                                        return (
                                                            <button
                                                                className={`button-subcategory size-7 p-2 `}
                                                                type="button"
                                                                key={i}
                                                                onClick={() => {
                                                                    router.push(`/product/${category.category_id}/${v.subcategory_id}`);
                                                                    // handlesubCategoryChange(subcategory.trim());
                                                                    // console.log(`Button for subcategory ${subcategory.trim()} clicked.`);
                                                                }}
                                                            >
                                                                {v.subcategory_name}
                                                            </button>
                                                        );
                                                    }
                                                    return null;// 或者直接不返回任何内容
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='filter mt-3 '>
                                <div className="card filter-card">
                                    {/* <div className="card-header">
                                        其他選項
                                    </div> */}
                                    <div className="card-body">
                                        {/* specialoffer篩選 */}
                                        <div className="col-12">
                                            <label for="inputprice size-6" className="form-label">價格區間</label>
                                            <div className="row col-md">
                                                <div className="col-md-5">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="price"
                                                        placeholder="$最低價"
                                                        value={minPrice}
                                                        onChange={handleMinPriceChange}
                                                    />
                                                </div>
                                                <div class="col-md dash">
                                                    ~
                                                </div>
                                                <div className="col-md-5">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="price"
                                                        placeholder="$最高價"
                                                        value={maxPrice}
                                                        onChange={handleMaxPriceChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/*  */}
                                        <div className="col-12 mt-2">
                                            <label for="brand size-6" className="form-label">品牌</label>
                                            {/* <input type="text" className="form-control" id="brand" placeholder="請輸入品牌關鍵字">
                                            </input> */}
                                            <select
                                                id="inputsubCategory"
                                                className="form-select"
                                                name="subcategory_name"
                                                value={vendor}
                                                onChange={handleVendorChange}
                                            >
                                                <option value="">請選擇</option>
                                                {vendorData.map((vendor, index) => (
                                                    <option key={index} value={vendor}>{vendor}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            className="btn btn-brown col-12 mt-3"
                                            onClick={() => {
                                                handlePriceVendorfilter(vendor, minPrice, maxPrice);
                                                console.log("價錢與品牌按鈕有被點到");
                                            }} // 點擊按鈕時觸發事件處理程序
                                        >
                                            確定
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 商品顯示區 */}
                        <div className='product d-lg-flex flex-column '>
                            <div className=" row d-flex mb-3 g-3 g-md-4 ">
                                <ProductCard2 productData={currentData} mainPic={mainPic} setMainPic={setMainPic} />
                                {/* 原本錯的 */}
                                {/* <div className="col-lg-4 col-md-4 col-sm-6">
                                    <ProductCard />
                                </div> */}
                            </div>
                           
                        </div>
                    </section>
                    <Pagination itemsPerPage={itemsPerPage} total={total} activePage={activePage} setActivePage={setActivePage} />




                </div>
            </div>

        </>
    )
}