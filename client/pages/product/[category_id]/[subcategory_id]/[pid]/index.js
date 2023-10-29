import React, { useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import axios from 'axios';
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/useCart"
import { FiPlus } from 'react-icons/fi';
import { FiMinus } from 'react-icons/fi';
import jwt_decode from "jwt-decode";
import { FaPaw } from 'react-icons/fa';
import ProductSlick from '@/components/product/product-slick';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import dayjs from "dayjs";
import { color } from 'framer-motion';



//next裡innerhtml語法
function ProductDescription({ htmlContent }) {
    return (
        <div className="item" dangerouslySetInnerHTML={{ __html: htmlContent }}>
        </div>
    );
}


export default function ProductDetail() {


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

    //計算數量
    const [count, setCount] = useState(1);
    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    }; const handleIncrement = () => { setCount(count + 1); };

    //商品介紹和推薦跳頁
    const [activeSection, setActiveSection] = useState('product-description')

    // 讀取product個別id資料
    const router = useRouter();
    const product_id = router.query.pid;

    const [productData, setProductData] = useState([]);
    useEffect(() => {
        if (product_id) {
            axios.get(`http://localhost:3005/api/product/product-detail/${product_id}`)
                .then((response) => {
                    setProductData(response.data.result); // 直接设置为数组
                    setMainPic(response.data.result[0].images_one)
                    // console.log(response.data.result[0].images_one)
                })
                .catch((error) => {
                    console.error("Error fetching product data:", error);
                });
        }
    }, [product_id]);
    // console.log(productData)


    //圖片抽換
    const [mainPic, setMainPic] = useState(''); // 初始化為 v.images_one

    // 點擊事件處理函數，更新主圖片的 URL
    const handleImageClick = (newImageUrl) => {
        setMainPic(newImageUrl);
    };

    // 讀取review資料
    const [reviewData, setReviewData] = useState([]); // 使用空数组作为默认值
    useEffect(() => {
        if (product_id) {
            axios.get(`http://localhost:3005/api/product/product-detail/${product_id}/reviews`)
                .then((response) => {
                    setReviewData(response.data.result); // 直接设置为数组
                    // console.log(response.data.result);
                })
                .catch((error) => {
                    console.error("Error fetching product data:", error);
                });
        }
    }, [product_id]);

    // 從 response.data.result 中獲取星級的數據
    const starRatings = reviewData.map((review) => review.star_rating);


    // 計算星星平均數
    const calculateAverageRating = (starRatings) => {
        if (starRatings.length === 0) {
            return 0; //如果沒有星星，平均數等於0
        }
        //(accumulator, rating) => accumulator + rating, 0 這句看不懂!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const totalRating = starRatings.reduce((accumulator, rating) => accumulator + rating, 0);
        const averageRating = totalRating / starRatings.length;
        return averageRating;
    };

    const averageRating = calculateAverageRating(starRatings);

    // 星星評論的長度，例如 [5, 4, 3, 2, 1]
    const starRatingLengths = [5, 4, 3, 2, 1];

    // 計算每個星級的百分比長度
    const calculatePercentageLengths = (starRatingLengths, starRatings) => {
        const percentageLengths = starRatingLengths.map((rating) => {
            // 計算每個星級評分的數量
            const ratingCount = starRatings.filter((ratingValue) => ratingValue === rating).length;
            // 計算百分比長度，假設總數量為 starRatings.length
            const percentage = (ratingCount / starRatings.length) * 100;
            return percentage;
        });
        return percentageLengths;
    };

    // 獲取星星評分的百分比長度數組
    const percentageLengths = calculatePercentageLengths(starRatingLengths, starRatings);
    // 渲染<p>元素，根據平均分數來渲染不同內容
    const ratingText = averageRating === 0 ? "尚無評價" : `${averageRating} 顆星`;
    const transferDate = (date) => {
        const newDay = dayjs(date).format("YYYY年MM月DD日");
        return newDay;
    };

    //推薦隨機8筆
    const [randomProducts, setRandomProducts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3005/api/product/recommend') // 設有一個API可以獲取隨機產品
            .then((response) => {
                // 從API響應中獲取隨機產品
                const randomProducts = response.data;
                // 將隨機產品設置為狀態
                setRandomProducts(randomProducts);
            })
            .catch((error) => {
                console.error('Error fetching random products:', error);
            });
    }, []);



    // 添加商品到購物車的函式
    const { cart, setCart } = useCart();
    //儲存選中的type_id-selectedTypeId
    const [selectedTypeId, setSelectedTypeId] = useState('');
    const getCart = (id) => {
        axios.get(`http://localhost:3005/api/product/cart/cart/${id}`)
            .then((response) => {
                const data = response.data.result;
                const newData = data.map((v) => {
                    return { ...v, buy: true }
                })
                setCart(newData)
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const addCart = async (product_id, product_type_id, quantity) => {
        console.log(parseInt(product_type_id));
        console.log(typeof (parseInt(product_type_id)));
        console.log(product_id, product_type_id, quantity)
        // 檢查購物車中是否已經存在具有相同 id 和類型的商品
        const have = cart.find((v) => v.product_id == product_id && v.product_type_id == parseInt(product_type_id));
        console.log(have);

        // 如果購物車中沒有相同的商品
        if (userId === null) {
            alert('請先登入會員');
        } else if (have === undefined) {
            console.log(cart);

            try {
                // 發送HTTP請求將商品添加到購物車
                const response = await axios.put(
                    `http://localhost:3005/api/product/cart1/${userId}`,
                    { product_id, product_type_id, quantity },
                    // console.log(userId,product_id, product_type_id, quantity),
                    // console.log('我是會員'+ userId)
                );
            } catch (error) {
                console.error("錯誤：", error);
            }

            // 獲取最新的購物車資料
            getCart(userId);
        } else { // 如果購物車中已經存在相同的商品
            try {
                // 計算新的商品數量（增加1）
                const newQuantity = have.quantity + quantity;
                console.log(newQuantity);

                // 發送HTTP請求將商品數量更新為新數量
                const response = await axios.put(
                    `http://localhost:3005/api/product/cart2/${userId}`,
                    { product_id, newQuantity, product_type_id }
                );
            } catch (error) {
                console.error("錯誤：", error);
            }

            // 獲取最新的購物車資料
            getCart(userId);
        }
    };

    //添加商品到收藏的函式
    //儲存選中的type_id-selectedTypeId 加到購物車時已經有寫了
    const [collection, setCollection] = useState([]); //用來儲存收藏
    // const [selectedTypeId, setSelectedTypeId] = useState('');
    const getCollection = () => {
        axios.get(`http://localhost:3005/api/product/collections/${userId}`)
            .then((response) => {
                setCollection(response.data.result);
                console.log(response.data.result);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const addCollection = async (product_id) => {
        console.log(product_id);

        // 檢查收藏中是否已經存在具有相同 id 的商品
        const have = collection.find((v) => v.product_id === product_id);
        console.log(have);

        // 如果購物車中沒有相同的商品
        if (have === undefined) {
            try {
                // 發送HTTP請求將商品添加到購物車
                const response = await axios.put(
                    `http://localhost:3005/api/product/collections/${userId}`,
                    { product_id }
                );
                alert('已加入收藏囉');
            } catch (error) {
                console.error("錯誤：", error);
            }

            getCollection(userId)
        } else { // 如果購物車中已經存在相同的商品
            try {
                getCollection(userId);
                //顯示警告


            } catch (error) {
                console.error("錯誤：", error);
            }
        }
    };

    const deleteCollection = async (product_id) => {
        console.log(product_id);

        // 檢查收藏中是否已經存在具有相同 id 的商品
        const have = collection.find((v) => v.product_id === product_id);
        console.log(have);

        // 如果購物車中沒有相同的商品
        if (have) {
            try {
                // 發送HTTP請求將商品添加到購物車，product_id 放在 URL 中
                const response = await axios.delete(
                    `http://localhost:3005/api/product/collections/${userId}/${product_id}`
                );
                alert('已取消收藏');
            } catch (error) {
                console.error("錯誤：", error);
            }

            getCollection(userId);
        } else { // 如果購物車中已經沒有存在相同的商品
            try {
                getCollection(userId);
                //顯示警告

            } catch (error) {
                console.error("錯誤：", error);
            }
        }
    };

    const toggleCollection = async (product_id) => {
        const isProductInCollection = collection.some((item) => item.product_id === product_id);
        if (isProductInCollection) {
            await deleteCollection(product_id);
        } else {
            await addCollection(product_id);
        }
        getCollection(userId);
    };

    useEffect(() => {
        // 獲取商品列表
        getCollection(userId);
    }, [userId]);


    //type款式按鈕
    const handleButtonClick = (typeId) => {
        setSelectedTypeId(typeId);
    };




    return (
        <>
            <div className='product-detail'>
                <div className="container ">
                    {productData.map((v, i) => {
                        return (
                            <>
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
                                        <li class="breadcrumb-item" aria-current="page">
                                            {v.product_name}
                                        </li>
                                    </ol>
                                </nav> */}
                                <section className="product-itembox row justify-content-center" key={v.product_id} >
                                    <div className="product-pic d-flex col-lg-6" >
                                        <div className='d-flex flex-column other-pic'>
                                            <img
                                                src={v.images_one}
                                                alt="..."
                                                onClick={() => handleImageClick(v.images_one)}
                                                className={v.images_one === mainPic ? 'selected-image' : ''}

                                            ></img>
                                            <img
                                                src={v.images_two}
                                                alt="..."
                                                onClick={() => handleImageClick(v.images_two)}
                                                className={v.images_two === mainPic ? 'selected-image' : ''}

                                            ></img>
                                        </div>
                                        <figure className="main-pic  ">
                                            <img src={mainPic} alt="..."></img>
                                        </figure>

                                    </div>

                                    <div className="product-detail col-lg-6">
                                        <div className="brand d-flex size-7">{v.vendor}</div>
                                        <h4 className="name size-4 mt-2"><strong>{v.product_name}</strong></h4>

                                        <div className="price-wrapper mt-2">
                                            <div className="pricebox_detail  d-flex">
                                                <div className="priceBlock me-4" >
                                                    <span className="PriceName1 size-5 ">折扣後NT$</span>
                                                    <span className="font-big size-5">{v.specialoffer}</span>
                                                </div>
                                                <div className="font-delete size-7" >原價NT${v.price}</div>
                                            </div>
                                        </div>
                                        <div className="delivery-coupon size-7 d-flex flex-row mt-2">
                                            <div className="free-delivery size-7 d-flex pe-2 ">
                                                <div className="free-delivery-1 size-7 d-flex " >免運</div>
                                                <div className="free-delivery-2 size-7 d-flex ">滿千限時送</div>
                                            </div>
                                            <div className="coupon size-7 d-flex  ">
                                                <div className="coupon-1 size-7 d-flex " >會員</div>
                                                <div className="coupon-2 size-7 d-flex ">即領折扣券</div>
                                            </div>
                                        </div>

                                        <div className="type d-flex flex-column mt-2">
                                            <div className="type-chinese">規格</div>
                                            <div className="type-btn d-flex mt-1 ">
                                                {v.type_names.split(',').map((typeName, i) => {
                                                    const typeId = v.type_ids.split(',')[i].trim();
                                                    const isSelected = typeId === selectedTypeId;
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            style={{
                                                                //選中/沒選中
                                                                backgroundColor: isSelected ? '#512f10' : '#fffdfb',
                                                                border: isSelected ? '1px solid #512f10' : '1px solid #6d6868',
                                                                color: isSelected ? '#FFFDFB' : '#6d6868',
                                                                borderRadius: isSelected ? '2px' : '2px',
                                                                padding: isSelected ? '3px 15px' : '3px 15px',
                                                                marginRight: isSelected ? '20px ' : '20px ',
                                                            }}
                                                            onClick={() => handleButtonClick(typeId)}
                                                        >
                                                            {typeName.trim()}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        {/* 計算數量 */}
                                        <div className="quantity-counter mt-2">
                                            <div className="type-chinese">數量</div>
                                            <div className="quantity-counter d-flex mt-1">
                                                <button className="decrement  " onClick={handleDecrement}>
                                                    <FiMinus />
                                                </button>
                                                <div className="count d-flex justify-content-center align-items-center ">{count}</div>
                                                <button className="increment  " onClick={handleIncrement}>
                                                    <FiPlus />
                                                </button>
                                            </div>
                                        </div>
                                        <div className='additional-information mt-3'>
                                            <li><FaPaw />  商品享7日鑑賞期</li>
                                            <li><FaPaw />  付款後，3日內配送，台灣本島最快隔天送達</li>
                                            <li><FaPaw />  商品提供宅配到府和超商取貨付款服務</li>
                                            <li><FaPaw />  小貓上工服務上線! </li>
                                            <li><FaPaw />  如有任何問題，歡迎詢問</li>
                                        </div>

                                        <div className="add-to-cart-fav mt-3 d-flex flex-row">
                                            <div className='add-to-cart'>
                                                <button
                                                    className="btn btn-confirm size-7  m-size-7"
                                                    data-bs-toggle="offcanvas"
                                                    data-bs-target="#offcanvasRight"
                                                    aria-controls="offcanvasRight"
                                                    onClick={() => {
                                                        addCart(v.product_id, selectedTypeId, count);
                                                        console.log(v.product_id, selectedTypeId, count)
                                                    }
                                                    }
                                                >
                                                    加入購物車
                                                </button>
                                            </div>
                                            <button onClick={() => toggleCollection(v.product_id)} style={{ background: 'transparent', border: 'none' }}>
                                                {collection.some((item) => item.product_id === v.product_id) ? <FaHeart color="#ca526f" size={29} /> : <FaRegHeart color="#d7965b" size={29} />}
                                            </button>

                                        </div>

                                        <div className="add-to-favorites mt-3">
                                            {/* <button
                                                type="button"
                                                className=" btn-second"
                                                onClick={() => {
                                                    addCollection(v.product_id)
                                                    console.log('收藏:', v.product_id)
                                                }}

                                            >
                                                加入收藏
                                            </button>

                                            <button
                                                type="button"
                                                className=" btn-second"
                                                onClick={() => {
                                                    deleteCollection(v.product_id)
                                                    console.log('取消收藏:', v.product_id)
                                                }}
                                            >
                                                取消收藏
                                            </button> */}

                                        </div>

                                    </div>
                                    {/* 加到購物車 */}
                                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel" >
                                        <div className="offcanvas-header">
                                            <p id="offcanvasRightLabel" className="size-6">我的購物車({cart.length})</p>
                                            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>
                                        <div className="offcanvas-body">
                                            {cart.map((v, i) => {
                                                return (
                                                    <>
                                                        <div key={i} className="d-flex mb-3 border-bottom mx-2">
                                                            <div className="">
                                                                <img src={v.images}></img>
                                                            </div>
                                                            <div className="">
                                                                <p className="size-7">{v.product_name}</p>
                                                                <p className="size-7 type">{v.type}</p>
                                                                <p className="size-7 price" style={{ color: '#ca526f' }}>NT${v.newprice}</p>
                                                                <p className="size-7">數量：{v.quantity}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                            <div className="d-flex justify-content-around mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-confirm"
                                                    data-bs-dismiss="offcanvas"
                                                    aria-label="Close"
                                                >
                                                    繼續購物
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-confirm  ms-5"
                                                    onClick={() => {
                                                        window.location.href = "/product/cart";
                                                    }}
                                                >
                                                    前往結帳
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                </section>

                                <section className='product-detail-tabs d-flex justify-content-center'>
                                    <ul className="nav nav-underline d-flex w-100 justify-content-around ">
                                        <li className="nav-item1">
                                            <a
                                                className={`nav-link size-6 ${activeSection === 'product-description' ? 'active' : ''}`}
                                                aria-current="page"
                                                // href="#product-description"
                                                onClick={() => setActiveSection('product-description')}
                                            >
                                                商品介紹
                                            </a>
                                        </li>
                                        <li className="nav-item2">
                                            <a
                                                className={`nav-link size-6 ${activeSection === 'customer-message' ? 'active' : ''}`}
                                                aria-current="page"
                                                // href="#customer-message"
                                                onClick={() => setActiveSection('customer-message')}
                                            >
                                                顧客評價
                                            </a>
                                        </li>
                                    </ul>
                                </section>
                                {/* 商品介紹 */}
                                {activeSection === 'product-description' && (
                                    <section className="product-description  " >
                                        <div className="description">
                                            <ProductDescription htmlContent={v.description} />

                                        </div>
                                        <div className="product-description-pic text-center ">
                                            <figure className="product-description-pic-1 ">
                                                <img src={v.images_one} alt="..."></img>
                                            </figure>
                                            <figure className="product-description-pic-1 ">
                                                <img src={v.images_two} alt="..."></img>
                                            </figure>
                                        </div>
                                    </section>
                                )}

                            </>
                        );
                    })}

                    {/* 顧客評價 */}
                    {activeSection === 'customer-message' && (
                        <section className="customer-message" >
                            <div className="star">
                                <div className="Overall-rating-detail">
                                    <div className="evaluation-bar">
                                        <div className="evaluation-bar-left d-flex flex-column justify-content-center">
                                            <p className="size-4 text-center">{ratingText}</p>
                                            <div className="ranking mb-2 mx-auto">
                                                {/* 渲染平均星級 */}
                                                {Array.from({ length: Math.floor(averageRating) }, (_, index) => (
                                                    <AiFillStar key={index} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="evaluation-bar-divider"></div>
                                        <div className="evaluation-bar-right d-flex flex-column justify-content-evenly">
                                            {starRatingLengths.map((rating, index) => (
                                                <div className="bar-group" key={index}>
                                                    <p className="number size-6">{rating}</p> 
                                                    <div className="percentage">
                                                        <div className="have" style={{ width: `${percentageLengths[index]}%` }}></div>
                                                        <div className="no-have" style={{ width: `${100 - percentageLengths[index]}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {reviewData.map((v, i) => {
                                return (
                                    <div className="customer" key={i}>
                                        <div className='d-flex flex-row justify-content-between'>
                                            <div className="customer-name">{v.name}</div>
                                            <div className="customer-content">
                                                {transferDate(v.review_date)}</div>
                                        </div>
                                        
                                        <div className="customer-star">
                                            {/* _佔位符，要再了解 */}
                                            {Array.from({ length: v.star_rating }, (_, index) => (
                                                <AiFillStar key={index} />
                                            ))}
                                        </div>
                                        <div className="customer-content">
                                            {v.review_content}
                                        </div>
                                       
                                    </div>
                                );
                            })}
                        </section>
                    )}

                    <section className='recommend-product p-4 mt-2 mb-5'>
                        <div className="customer-message-title text-center mb-4 ">
                            <h4 className="name size-5">你可能會喜歡的商品</h4>
                        </div>
                        {/* <div id="carouselExampleControls" className="carousel slide " data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <div className="carousel-item active row d-flex" >
                                        <ProductCard3 />
                                        <ProductCard3 />
                                        <ProductCard3 />   
                                        <ProductCard3 />
                                </div>
                                <div className="carousel-item active">
                                    <div className="row d-lg-flex  justify-content-center ">
                                        <ProductCard3 />
                                    </div>
                                </div>
                            </div>
                            <button className="carousel-control-prev " type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                                <FaChevronLeft size={60} style={{ color: '#512f10' }} />
                                <span className="visually-hidden">Previous</span>
                            </button>

                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                                <FaChevronRight size={60} style={{ color: '#512f10' }} />
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div> */}
                        <ProductSlick  />
                    </section>
                </div>
            </div>
        </>
    );
}