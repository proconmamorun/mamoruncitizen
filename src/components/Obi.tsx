"use client";
import React, { useState, useEffect } from "react";
import "./Obi.css";

export function Obi() {
    const [images, setImages] = useState(["./images/obi.png", "./images/obi.png", "./images/obi.png"]);

    useEffect(() => {
        const interval = setInterval(() => {
            setImages(prevImages => [...prevImages.slice(1), prevImages[0]]);
        }, 10000); // 10秒ごとに画像を更新

        return () => clearInterval(interval); // コンポーネントがアンマウントされたときにインターバルをクリア
    }, []);

    return (
        <>
            <div className="imageSlider">
                {images.map((src, index) => (
                    <img key={index} className="sliderImage" src={src} alt="スライド画像" />
                ))}
            </div>

            <div className="imageSliderBottom">
                {images.map((src, index) => (
                    <img key={index} className="sliderImage" src={src} alt="スライド画像" />
                ))}
            </div>
        </>
    );
}
