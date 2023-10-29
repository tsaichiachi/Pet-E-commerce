import React, { useState, useEffect, useRef } from 'react'
import axios from "axios"
import Link from "next/link";

// 使圖片高度與寬度同寬
function ImageWithEqualDimensions({ file_path }) {
    const imgRef = useRef(null);

    // 使得圖片高度會在螢幕大小改變時跟著改變 而非在重整時才改變
    const handleResize = () => {
        const image = imgRef.current;
        const imageWidth = image.offsetWidth;
        image.style.height = imageWidth + 'px';
    };

    useEffect(() => {
        // 獲取圖片元素的引用
        const image = imgRef.current;
        // 獲取圖片的寬度
        const imageWidth = image.offsetWidth;
        // 將寬度值分配给高度
        image.style.height = imageWidth + 'px';
        // 添加螢幕大小變化事件監聽器
        window.addEventListener('resize', handleResize);
        // 在組件卸載時移除事件監聽器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className="mission-img">
            <img
                ref={imgRef}
                src={file_path}
                alt="任務"
            />
        </div>
    );
}

export default function MissionCard() {

    const [allMissions, setAllMissions] = useState([]);

    const getAllMissions = async () => {
        try {
            const response = await axios.get("http://localhost:3005/api/mission/all-missions");
            const data = response.data.data;
            console.log(data);
            setAllMissions(data);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        getAllMissions()
    }, [])

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }

    // 為每個卡片創建獨立的isFavorite狀態數組
    const [isFavorites, setIsFavorites] = useState(allMissions.map(() => false));

    const toggleFavorite = (index) => {
        const newFavorites = [...isFavorites];
        newFavorites[index] = !newFavorites[index];
        setIsFavorites(newFavorites);
    };

    return (
        <>
            {allMissions.map((v, i) => {
                return (
                    <div className='col-6 col-md-4 col-lg-6 col-xl-4' key={v.mission_id}>

                        <div className='mission-list-card '>
                            <Link href={`/work/find-mission/${v.mission_id}`} >
                                <ImageWithEqualDimensions file_path={v.file_path} />
                            </Link>
                            <div className='mission-content mx-1 mt-2'>
                                <Link href={`/work/find-mission/${v.mission_id}`} >
                                    <div className='title size-6'>{v.title}</div>
                                </Link>
                                <div className='d-flex justify-content-between mt-2'>
                                    <div className='size-7'>{v.city}{v.area}<br />{formatDate(v.post_date)}</div>
                                    <img src={isFavorites[i] ? "/heart-clicked.svg" : "/heart.svg"} alt={isFavorites[i] ? "已收藏" : "未收藏"} onClick={() => toggleFavorite(i)} />
                                </div>
                                <div className='d-flex justify-content-between align-items-end price'>
                                    <div  >單次<span className='size-6'> NT${v.price}</span></div>
                                    <button className='btn-confirm size-6'>應徵</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
            }
        </>
    )
}

