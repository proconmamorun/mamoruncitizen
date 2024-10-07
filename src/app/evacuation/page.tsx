'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import styles from './evacuationpage.module.css';
import detectRotationAndUpload from './RotationDetector';

const containerStyle = {
  width: '100%',
  height: '400px',  // マップの高さを適切に調整
};

const center = {
  lat: 35.682839,  // 東京の緯度
  lng: 139.759455, // 東京の経度
};

export default function Evacuation() {
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // APIキーを環境変数から取得
  });

  useEffect(() => {
    // ページロード時にフッターを非表示にする
    const footerElement = document.querySelector('.Footer') as HTMLElement;
    if (footerElement) {
      footerElement.style.display = 'none'; // 避難ページでは非表示
    }

    // 下側の帯の位置を画面の一番下に設定
    const bottomImageElement = document.querySelector('.imageSliderBottom');
    if (bottomImageElement) {
      bottomImageElement.style.position = 'fixed';
      bottomImageElement.style.bottom = '0';
      bottomImageElement.style.left = '0';
      bottomImageElement.style.width = '100%';
      bottomImageElement.style.zIndex = '15';
    }
    const cancelDetectLocation = detectRotationAndUpload();
    return () => {
      if (footerElement) {
        footerElement.style.display = 'flex'; // 他のページに戻ったら表示
      }
      if (bottomImageElement) {
        bottomImageElement.style.position = '';
        bottomImageElement.style.bottom = '90px'; // デフォルト位置に戻す
        bottomImageElement.style.left = '';
        bottomImageElement.style.width = '';
        bottomImageElement.style.zIndex = '';
      }
      cancelDetectLocation();
    };
  }, []);

  const handleEndClick = () => {
    router.push('/evacuation/evacuation-done');
  };
  if (loadError) {
    return <div>マップの読み込み中にエラーが発生しました。</div>;
  }

  if (!isLoaded) {
    return <div>マップを読み込んでいます...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>避難する</div>
      
      <div className={styles.mapPlaceholder}>
        {/* Google Maps コンポーネント */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
        />
        
        <div className={styles.icon} style={{ top: "23%", right: "5%" }}>
          <img src="/images/sound-icon.png" alt="Sound" />
        </div>
        <div className={styles.icon} style={{ top: "30%", right: "5%" }}>
          <img src="/images/compass-icon.png" alt="Compass" />
        </div>
      </div>
      
      <div className={styles.footer}>
        <div>
          <div className={styles.time}>30 分</div>
          <div className={styles.distance}>1km・22:05</div>
        </div>
        <button className={styles.endButton} onClick={handleEndClick}>終了</button>
      </div>
    </div>
  );
}
