"use client";
import React, { useState, useEffect, useRef } from "react";
import "./Obi.css";

export function Obi() {
    const message = "土砂崩れに注意してください";
    const [messages, setMessages] = useState([message, message, message]);
    const sliderRef = useRef(null);  // スライダーのDOM参照用
    const lastItemRef = useRef(null); // 最後のアイテムを参照

    useEffect(() => {
        // Intersection Observer を設定して、最後の帯が画面に入ったら新しいメッセージを追加
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // 新しいメッセージを追加し、古いメッセージを削除して無限にスライド
                    setMessages((prevMessages) => {
                        const newMessage = `新しい警告: ${Math.random()}`;  // 動的に新しいメッセージを生成
                        const updatedMessages = [...prevMessages.slice(1), newMessage];
                        return updatedMessages;
                    });
                }
            },
            { root: null, threshold: 1.0 } // 3枚目が完全に表示されたら発火
        );

        if (lastItemRef.current) {
            observer.observe(lastItemRef.current);
        }

        return () => {
            if (lastItemRef.current) {
                observer.unobserve(lastItemRef.current);
            }
        };
    }, [messages]);

    return (
        <>
            <div className="textSlider" ref={sliderRef}>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className="sliderTextWithIcon"
                        ref={index === messages.length - 1 ? lastItemRef : null} // 最後のアイテムを監視
                    >
                        {/* 左側に矢印アイコンを追加 */}
                        <img src="/images/obi-arrow.png" alt="矢印" className="arrowIcon" />
                        <img src="/images/warning.png" alt="警告" className="warningIcon" />
                        {msg}
                    </div>
                ))}
            </div>

            <div className="textSliderBottom">
                {messages.map((msg, index) => (
                    <div key={index} className="sliderTextWithIcon">
                        <img src="/images/obi-arrow.png" alt="矢印" className="arrowIcon" />
                        <img src="/images/warning.png" alt="警告" className="warningIcon" />
                        {msg}
                    </div>
                ))}
            </div>
        </>
    );
}
