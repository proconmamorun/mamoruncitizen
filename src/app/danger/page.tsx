"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './danger.module.css';

export default function Danger() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  // カメラのサポートやHTTPS接続を確認する関数
  const checkCameraSupport = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage('このブラウザはカメラアクセスをサポートしていません。');
      return false;
    }

    if (window.location.protocol !== "https:") {
      setErrorMessage('カメラを利用するには、HTTPSで接続してください。');
      return false;
    }

    return true;
  };

  useEffect(() => {
    const startCamera = async () => {
      if (!checkCameraSupport()) {
        return;
      }

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInput = devices.find(
          device =>
            device.kind === 'videoinput' &&
            device.label.toLowerCase().includes('back') // "back"が含まれるデバイスを外カメラとみなす
        );

        const constraints = {
          video: videoInput
            ? { 
                deviceId: { exact: videoInput.deviceId },
                width: { ideal: 720 }, // 幅を小さく
                height: { ideal: 1280 }  // 高さを大きく
              }
            : { 
                facingMode: "environment",
                width: { ideal: 720 }, // 幅を小さく
                height: { ideal: 1280 }  // 高さを大きく
              },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('カメラのアクセスに失敗しました:', err);
        setErrorMessage('カメラのアクセスに失敗しました。設定を確認してください。');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error("Video or canvas is not available.");
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Canvas context is not available.");
      return;
    }

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
        {errorMessage ? (
          <div className={styles.errorMessage}>{errorMessage}</div>
        ) : selectedImage ? (
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
            muted
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
