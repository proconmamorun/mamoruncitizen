"use client";
import React, { useState, useEffect } from "react";
import "./Footer.css";
import { useRouter, usePathname } from "next/navigation";

export function Footer() {
    const router = useRouter();
    const pathname = usePathname(); // 現在のパスを取得

    // 初期の1ボタン画像をまとめたオブジェクト
    const defaultImages = {
        sensor: "/images/sensors.png",
        map: "/images/map.png",
        search: "/images/search.png",
        photo: "/images/photo.png",
    };

    // ページごとの2ボタン画像を管理するオブジェクト
    const pageSpecificImages = {
        "/": { sensor: "/images/sensors-dark.png" },
        "/evacuation": { map: "/images/map-dark.png" },
        "/evacuation/evacuation-done": { map: "/images/map-dark.png" },
        "/danger": { photo: "/images/photo-dark.png" },
        "/danger/preview": { photo: "/images/photo-dark.png" },
        "/safety": { search: "/images/search-dark.png" },
        "/safety/where/check": { search: "/images/search-dark.png" },
    };

    // ボタン画像の状態を管理するuseState
    const [images, setImages] = useState(defaultImages);

    // 現在のパスに応じて画像を変更する
    useEffect(() => {
        const specificImages = pageSpecificImages[pathname as keyof typeof pageSpecificImages] || {};
        // デフォルト画像とページ用画像をマージして設定
        setImages({ ...defaultImages, ...specificImages });
    }, [pathname]); // パスが変わるたびに実行

    // 一時的に画像を変更する処理
    const changeImageTemporarily = (buttonKey: string | number, darkImage: any, callback: { (): void; (): void; }) => {
        setImages((prev) => ({ ...prev, [buttonKey as keyof typeof defaultImages]: darkImage }));
        setTimeout(() => {
            setImages((prev) => ({ ...prev, [buttonKey as keyof typeof defaultImages]: defaultImages[buttonKey as keyof typeof defaultImages] }));
            if (callback) callback();
        }, 250);
    };

    // ボタンのクリックイベントハンドラ
    const handleButtonClick = (buttonKey: string, darkImage: string, path: string) => {
        changeImageTemporarily(buttonKey, darkImage, () => {
            router.push(path);
        });
    };

    return (
        <div className="Footer">
            <img
                className="Footer-button"
                src={images.sensor}
                alt="センサー"
                onClick={() => handleButtonClick("sensor", "/images/sensors-dark.png", "/")}
            />
            <img
                className="Footer-button"
                src={images.map}
                alt="マップ"
                onClick={() => handleButtonClick("map", "/images/map-dark.png", "/evacuation")}
            />
            <img
                className="Footer-button"
                src={images.search}
                alt="検索"
                onClick={() => handleButtonClick("search", "/images/search-dark.png", "/safety")}
            />
            <img
                className="Footer-button"
                src={images.photo}
                alt="写真"
                onClick={() => handleButtonClick("photo", "/images/photo-dark.png", "/danger")}
            />
        </div>
    );
}
