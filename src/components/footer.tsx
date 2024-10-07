"use client";
import React, { useState, useEffect } from "react";
import "./Footer.css";

export class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: ["./images/obi.png", "./images/obi.png", "./images/obi.png"]
        };
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(prevState => {
                const newImages = [...prevState.images.slice(1), prevState.images[0]];
                return { images: newImages };
            });
        }, 10000); // 10秒ごとに画像を更新
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <>
                <div className="imageSlider">
                    {this.state.images.map((src, index) => (
                        <img key={index} className="sliderImage" src={src} alt="スライド画像" />
                    ))}
                </div>

                <div className="imageSliderBottom">
                    {this.state.images.map((src, index) => (
                        <img key={index} className="sliderImage" src={src} alt="スライド画像" />
                    ))}
                </div>

                <div className="Footer">
                    <img className="Footer-button" src="./images/map.png" alt="マップ" />
                    <img className="Footer-button" src="./images/photo.png" alt="写真" />
                    <img className="Footer-button" src="./images/search.png" alt="検索" />
                    <img className="Footer-button" src="./images/sensors.png" alt="センサー" />
                </div>
            </>
        );
    }
}


