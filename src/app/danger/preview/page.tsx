"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../danger.css";

export default function Preview() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // ローカルストレージから撮影した画像を取得
    const storedImage = localStorage.getItem("capturedImage");
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, []);

  return (
    <div className="App">
      <div className="preview-container">
      <button className="mainbotn-danger" id="darkred" onClick={() => router.back()}>
        撮り直す
      </button>

        <div className="camera-preview">
          {imageUrl ? (
            <img src={imageUrl} alt="Captured" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <p>写真を表示できません</p>
          )}
        </div>

        <button className="mainbotn-danger" id="green">
          送信
        </button>
      </div>
    </div>
  );
}
