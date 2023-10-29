import React from 'react';

function LoadingOverlay({ isLoading }) {
    console.log('LoadingOverlay is rendering with isLoading:', isLoading);

    return (
        isLoading && (
            <div className="loading-overlay">
                <div className="loader"></div>
                <p>Loading...</p>
            </div>
        )
    );
}

export default LoadingOverlay;

