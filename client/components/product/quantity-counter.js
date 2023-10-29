import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { FiMinus } from 'react-icons/fi';

export default function Counter() {
    const [count, setCount] = useState(1);

    const handleDecrement = () => {
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const handleIncrement = () => {
        setCount(count + 1);
    };

    return (
        <>
            <div className="quantity-counter d-flex">
                <button className="decrement  " onClick={handleDecrement}>
                    <FiMinus />
                </button>
                <div className="count d-flex justify-content-center align-items-center ">{count}</div>
                <button className="increment  " onClick={handleIncrement}>
                    <FiPlus />
                </button>
            </div>
        </>
    );
}
