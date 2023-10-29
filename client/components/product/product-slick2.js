//商品首頁輪播圖
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProductSlick2() {

    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 1, //一次顯示幾張圖片
        slidesToScroll: 1, //一次要滾動幾張圖片
        initialSlide: 0,
        autoplay: true,
        autoplayspeed: 500,
        cssEase: "linear",
        infinite: true, //是否可以循環

        // responsive: [
        //     {
        //         breakpoint: 1024,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 2,
        //             infinite: true,
        //             dots: true,
        //         },
        //     },
        //     {
        //         breakpoint: 600,
        //         settings: {
        //             slidesToShow: 2,
        //             slidesToScroll: 2,
        //             initialSlide: 2,
        //         },
        //     },
        //     {
        //         breakpoint: 480,
        //         settings: {
        //             slidesToShow: 1,
        //             slidesToScroll: 1,
        //         },
        //     },
        // ],
    };
    return (
        <div className="ProductSlick">
            <Slider {...settings}>
                <img src='https://cdn-front.mao-select.com.tw/upload_files/fonlego-rwd/website/0927-%E5%B0%8A%E7%88%B5-mao-%E9%9B%BB%E8%85%A6.jpg'></img>
                <img src='https://cdn-front.mao-select.com.tw/upload_files/fonlego-rwd/website/%E5%8F%AF%E7%9D%A1%E9%9B%BB%E8%85%A6.jpg'></img>
                <img src='https://cdn-front.mao-select.com.tw/upload_files/fonlego-rwd/website/230905-pidan%E4%B8%89%E5%90%88%E4%B8%80%E5%BD%A2%E8%B1%A1-%E9%9B%BB%E8%85%A6.jpg'></img>
                <img src='https://cdn-front.mao-select.com.tw/upload_files/fonlego-rwd/website/230710-%E6%80%AA%E7%8D%B8%E9%9B%BB%E5%8A%9B%E5%85%AC%E5%8F%B8-%E9%9B%BB%E8%85%A6(1).jpg'></img>
            </Slider>
        </div>
    )
}
