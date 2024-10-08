"use client";
import React from "react";
import "./Footer.css";

export function Footer() {
    return (
        <div className="Footer">
            <img className="Footer-button" src="/images/map.png" alt="マップ" />
            <img className="Footer-button" src="/images/photo.png" alt="写真" />
            <img className="Footer-button" src="/images/search.png" alt="検索" />
            <img className="Footer-button" src="/images/sensors.png" alt="センサー" />
        </div>
    );
}
