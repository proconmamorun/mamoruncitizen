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
