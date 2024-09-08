"use client"
import React from "react";
import { Footer } from "./component/footer";
import "./danger.css"

export default function Home() {
  return (
    <div className="App">
      <button className="mainbotn-danger" id="darkred">撮り直す</button>

      <div className="camera-preview">
        {/* ここにカメラのプレビューが表示される */}
      </div>

      <button className="mainbotn-danger" id="green">送信</button>
    </div>
  );
}