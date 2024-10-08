// src/app/danger/page.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './danger.module.css';

export default function Danger() {
  const [selectedImage, setSelectedImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('カメラのアクセスに失敗しました:', err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL('image/png');
    setSelectedImage(imageUrl);

    // ローカルストレージに画像を保存して preview ページへ移動
    localStorage.setItem('capturedImage', imageUrl);
    router.push('/danger/preview');
  };

  return (
    <div className={styles.App}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <img src="/images/return.png" alt="戻る" />
        </button>
        <div className={styles.headerTitle}>危険箇所共有</div>
      </div>

      <div className={styles.alertMessage}>周囲に注意！</div>

      <div className={styles.cameraPreview}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Captured"
            style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
          />
        )}
      </div>

      <div className={styles.cameraContainer}>
        <button className={styles.captureButton} onClick={capturePhoto}></button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}
