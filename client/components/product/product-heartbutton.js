import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; 

function HeartButton({ product_id, isSolid, toggleHeart }) {
   
    return (
        <button onClick={toggleHeart} style={{ background: 'transparent', border: 'none' }}>
            {isSolid ? <FaHeart color="#ca526f" size={29} /> : <FaRegHeart color="#d7965b" size={29} />}
        </button>
    );
}

export default HeartButton;
