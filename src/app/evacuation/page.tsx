'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import styles from './evacuationpage.module.css';
import { GetSafePedestrianRoute } from '@/services/routeService';
import { Point } from '@/services/firebaseService';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const defaultCenter = {
  lat: 33.968860,
  lng: 134.345329,
};

const fixedEndPoint = {
  lat: 33.972830,
  lng: 134.362823,
};

const options = {
  fullscreenControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  zoomControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// リスクアイコンのマッピング
const riskIcons = [
  '/images/risk-1.png',
  '/images/risk-2.png',
  '/images/risk-3.png',
  '/images/risk-4.png',
  '/images/risk-5.png',
];

export default function Evacuation() {
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [routeData, setRouteData] = useState<{ path: google.maps.LatLngLiteral[]; risks: Point[]; duration: number; length: number }>({
    path: [],
    risks: [],
    duration: 0,
    length: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // マップがユーザーによって動かされたかどうかを追跡
  const userMovedMap = useRef(false);

  const handleEndClick = () => {
    router.push('/evacuation/evacuation-done');
  };

  // 現在地の取得
  useEffect(() => {
    const getGeolocation = () => {
      const location = defaultCenter;
      setCurrentLocation(location);
    };

    getGeolocation();
    const locationInterval = setInterval(getGeolocation, 10000);
    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  const fetchSafeRoute = useCallback(async () => {
    if (currentLocation) {
      try {
        const start: [number, number] = [currentLocation.lng, currentLocation.lat];
        const end: [number, number] = [fixedEndPoint.lng, fixedEndPoint.lat];

        const [routePolyline, risks, { duration, length }] = await GetSafePedestrianRoute(start, end);
        setRouteData({ path: routePolyline, risks, duration, length });
      } catch (error) {
        setError('ルート取得中にエラーが発生しました。');
      }
    }
  }, [currentLocation]);

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

  const formattedDistance = (routeData.length / 1000).toFixed(2);
  const formattedTime = Math.floor(routeData.duration / 60);

  return (
    <div className={styles.container}>
      <div className={styles.header}>避難する</div>

      <div className={styles.mapPlaceholder}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={15}
          center={defaultCenter}
          mapTypeId={mapType}
          options={options}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {routeData.path.length > 0 && (
            <Polyline path={routeData.path} options={{ strokeColor: '#0000FF', strokeWeight: 5 }} />
          )}

          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 16,
                fillColor: '#0000FF',
                fillOpacity: 1,
                strokeWeight: 10,
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.7,
              }}
            />
          )}

          <Marker
            position={fixedEndPoint}
            icon={{
              url: '/images/shelter.png', // publicディレクトリ経由でのパス
              scaledSize: new google.maps.Size(50, 50), // アイコンのサイズ調整
              anchor: new google.maps.Point(25, 25), // 基準点の設定
            }}
          />

          {routeData.risks.map((risk, index) => (
            risk.lat && risk.lng && (
              <Marker
                key={index}
                position={{ lat: risk.lat, lng: risk.lng }}
                icon={{
                  url: riskIcons[risk.risk - 1] || '/images/risk-1.png', // リスクに応じたアイコンを表示
                  scaledSize: new google.maps.Size(50, 50), // サイズを調整
                  anchor: new google.maps.Point(25, 25), // 基準点を設定
                }}
              />
            )
          ))}

          {/* danger-grade.pngを追加 */}
          <img
            src="/images/danger-grade.png" // 画像のパスを調整
            alt="Danger Grade"
            className={styles['danger-grade']}
          />
        </GoogleMap>
      </div>

      <div className={styles.footer}>
        <div>
          <div className={styles.time}>{formattedTime}分</div>
          <div className={styles.distance}>{formattedDistance} km</div>
        </div>
        <button className={styles.endButton} onClick={handleEndClick}>終了</button>
      </div>
    </div>
  );
}
