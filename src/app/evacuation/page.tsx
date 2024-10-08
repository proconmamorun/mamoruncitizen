'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import styles from './evacuationpage.module.css';

const containerStyle = {
  width: '100%',
  height: '100vh',  // 画面の縦幅いっぱいに設定
};

const center = {
  lat: 35.682839,  // 東京の緯度
  lng: 139.759455, // 東京の経度
};

// Google Maps オプション
const options = {
  fullscreenControl: false,  // フルスクリーンボタンを非表示
  mapTypeControl: false,  // マップタイプ切り替えボタンを非表示
  streetViewControl: false,  // ストリートビューを非表示
  zoomControl: false,  // 拡大縮小ボタンを非表示
  styles: [
    {
      featureType: 'poi',  // ランドマークアイコンを非表示
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

export default function Evacuation() {
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // APIキーを環境変数から取得
  });

  const handleEndClick = () => {
    router.push('/evacuation/evacuation-done');
  };

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');  // マップの種類を切り替えるための state

  const toggleMapType = () => {
    setMapType(prevType => (prevType === 'roadmap' ? 'satellite' : 'roadmap'));
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
          mapTypeId={mapType}  // マップの種類を設定
          options={options}  // カスタムオプションを適用
        />
        
        {/* マップの種類を切り替えるボタン */}
        <button className={styles.mapToggleButton} onClick={toggleMapType}>
          {mapType === 'roadmap' ? 'サテライト表示' : 'マップ表示'}
        </button>
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
