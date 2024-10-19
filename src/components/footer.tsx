"use client";
import React, { useState } from "react";
import "./Footer.css";
import { useRouter } from "next/navigation";

export function Footer() {
    const router = useRouter();

    // 各画像の状態を管理するuseStateフック
    const [sensorImage, setSensorImage] = useState("/images/sensors.png");
    const [mapImage, setMapImage] = useState("/images/map.png");
    const [searchImage, setSearchImage] = useState("/images/search.png");
    const [photoImage, setPhotoImage] = useState("/images/photo.png");

    // 画像の一時変更処理
    const changeImageTemporarily = (setImage, darkImage, originalImage, callback) => {
        setImage(darkImage); // ダークモードの画像に変更
        setTimeout(() => {
            setImage(originalImage); // 2秒後に元の画像に戻す
            if (callback) callback(); // 必要ならページ遷移などの処理を実行
        }, 250);
    };

    // 各ボタンのクリックイベントハンドラ
    const handleSensorsClick = () => {
        console.log("センサーがタップされました");
        changeImageTemporarily(setSensorImage, "/images/sensors-dark.png", "/images/sensors.png", () => {
            router.push('/');
        });
    };

    const handleMapClick = () => {
        console.log("マップがタップされました");
        changeImageTemporarily(setMapImage, "/images/map-dark.png", "/images/map.png", () => {
            router.push('/evacuation');
        });
    };

    const handleSearchClick = () => {
        console.log("検索がタップされました");
        changeImageTemporarily(setSearchImage, "/images/search-dark.png", "/images/search.png", () => {
            router.push('/safety');
        });
    };

    const handlePhotoClick = () => {
        console.log("写真がタップされました");
        changeImageTemporarily(setPhotoImage, "/images/photo-dark.png", "/images/photo.png", () => {
            router.push('/danger');
        });
    };

    return (
        <div className="Footer">
            <img
                className="Footer-button"
                src={sensorImage}
                alt="センサー"
                onClick={handleSensorsClick}
            />
            <img
                className="Footer-button"
                src={mapImage}
                alt="マップ"
                onClick={handleMapClick}
            />
            <img
                className="Footer-button"
                src={searchImage}
                alt="検索"
                onClick={handleSearchClick}
            />
            <img
                className="Footer-button"
                src={photoImage}
                alt="写真"
                onClick={handlePhotoClick}
            />
        </div>
    );
}
