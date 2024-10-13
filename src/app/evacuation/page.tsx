'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import styles from './evacuationpage.module.css';
import { GetSafePedestrianRoute } from '@/services/routeService';
import { Point } from '@/services/firebaseService';

const containerStyle = {
  width: '100%',
  height: '100vh',  // 画面の縦幅いっぱいに設定
};

const defaultCenter = {
  lat: 35.682839,  // 東京の緯度
  lng: 139.759455, // 東京の経度
};

// 固定のエンドポイント
const fixedEndPoint = {
  lat: 33.973618,  // 固定の緯度
  lng: 134.367512, // 固定の経度
};

// Google Maps オプション
const options = {
  fullscreenControl: false,  // フルスクリーンボタンを非表示
  mapTypeControl: false,  // マップタイプ切り替えボタンを非表示
  streetViewControl: false,  // ストリートビューを非表示
  zoomControl: true,  // 拡大縮小ボタンを表示
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

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null); // 現在地の管理
  const [routeData, setRouteData] = useState<{ path: google.maps.LatLngLiteral[]; risks: Point[] }>({ path: [], risks: [] });
  const [error, setError] = useState<string | null>(null);

  const handleEndClick = () => {
    router.push('/evacuation/evacuation-done');
  };

  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');  // マップの種類を切り替えるための state

  const toggleMapType = () => {
    setMapType(prevType => (prevType === 'roadmap' ? 'satellite' : 'roadmap'));
  };

  // 現在地を取得し、マップの中心を更新する関数
  useEffect(() => {
    const getGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ lat: latitude, lng: longitude }); // 現在地を保存
          },
          (error) => {
            console.error("位置情報の取得に失敗しました", error);
            setError('位置情報の取得中にエラーが発生しました。');
          },
          { enableHighAccuracy: true }
        );
      } else {
        setError('Geolocationがサポートされていません。');
      }
    };

    getGeolocation();  // 初期位置取得
    const locationInterval = setInterval(getGeolocation, 5000);  // 5秒ごとに位置情報を取得

    // コンポーネントのアンマウント時にインターバルをクリア
    return () => clearInterval(locationInterval);
  }, []);

  // ルートを取得する非同期関数
  const fetchSafeRoute = useCallback(
    async () => {
      if (currentLocation) {
        try {
          const start: [number, number] = [currentLocation.lng, currentLocation.lat];
          const end: [number, number] = [fixedEndPoint.lng, fixedEndPoint.lat];  // 固定のエンドポイント

          const [routePolyline, risks] = await GetSafePedestrianRoute(start, end);
          setRouteData({ path: routePolyline, risks });
        } catch (error) {
          setError('ルート取得中にエラーが発生しました。');
        }
      }
    },
    [currentLocation]
  );

  // 現在地が更新されるたびにルートを取得
  useEffect(() => {
    if (currentLocation) {
      fetchSafeRoute();
    }
  }, [currentLocation, fetchSafeRoute]);

  if (loadError) {
    return <div>マップの読み込み中にエラーが発生しました。</div>;
  }

  if (!isLoaded) {
    return <div>マップを読み込んでいます...</div>;
  }

  if (error) {
    return <p>{error}</p>;
  }
  console.log(routeData.risks);
  return (
    <div className={styles.container}>
      <div className={styles.header}>避難する</div>

      <div className={styles.mapPlaceholder}>
        {/* Google Maps コンポーネント */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={16}
          center={currentLocation || defaultCenter}  // 現在地またはデフォルトの東京を中心に表示
          mapTypeId={mapType}  // マップの種類を設定
          options={options}  // カスタムオプションを適用
          onLoad={mapInstance => setMap(mapInstance)}  // マップインスタンスを取得
        >
          {/* ルートを表示 */}
          {routeData.path.length > 0 && (
            <Polyline path={routeData.path} options={{ strokeColor: '#0000FF', strokeWeight: 5 }} />
          )}

          {/* 現在地のマーカー */}
          {currentLocation && (
            <Marker position={currentLocation} label="Start" />
          )}

          {/* 固定のエンドポイントのマーカー */}
          <Marker position={fixedEndPoint} label="End" />

          {/* リスクの表示 */}
          {routeData.risks.map((risk, index) => (
            risk.lat && risk.lng && (
              <Marker
                key={index}
                position={{ lat: risk.lat, lng: risk.lng }}
                label={`${risk.risk}`}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,  // 真円を指定
                  scale: 10,  // 円の大きさを指定
                  fillColor: '#FF0000',  // 塗りつぶし色
                  fillOpacity: 1,  // 塗りつぶしの透明度
                  strokeWeight: 1,  // 枠線の太さ
                  strokeColor: '#000000',  // 枠線の色
                }}
              />
            )
          ))}
        </GoogleMap>
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
