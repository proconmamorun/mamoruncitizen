"use client";
import React from "react";
import "./Footer.css";
import { useRouter } from "next/navigation";

export function Footer() {
    const router = useRouter();
    const handleMapClick = () => {
        console.log("マップがタップされました");
        // マップがタップされた時の処理を追加
        router.push('/evacuation');
    };

    const handlePhotoClick = () => {
        console.log("写真がタップされました");
        // 写真がタップされた時の処理を追加
        router.push('/danger');
    };

    const handleSearchClick = () => {
        console.log("検索がタップされました");
        // 検索がタップされた時の処理を追加
        router.push('/safety');
    };

    const handleSensorsClick = () => {
        console.log("センサーがタップされました");
        // センサーがタップされた時の処理を追加
        router.push('/');
    };

    return (
        <div className="Footer">
            <img
                className="Footer-button"
                src="/images/map.png"
                alt="マップ"
                onClick={handleMapClick}
            />
            <img
                className="Footer-button"
                src="/images/photo.png"
                alt="写真"
                onClick={handlePhotoClick}
            />
            <img
                className="Footer-button"
                src="/images/search.png"
                alt="検索"
                onClick={handleSearchClick}
            />
            <img
                className="Footer-button"
                src="/images/sensors.png"
                alt="センサー"
                onClick={handleSensorsClick}
            />
        </div>
    );
}
