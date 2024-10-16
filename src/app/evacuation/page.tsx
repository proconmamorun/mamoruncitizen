'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';
import styles from './evacuationpage.module.css';
import { GetSafePedestrianRoute } from '@/services/routeService';
import { Point } from '@/services/firebaseService';
import detectRotationAndUpload from './RotationDetector';

const containerStyle = {
  width: '100%',
  height: '80vh',
};

const defaultCenter = {
  lat: 35.682839,
  lng: 139.759455,
};

const fixedEndPoint = {
  lat: 33.969532,
  lng: 134.359609,
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

export default function Evacuation() {
  const router = useRouter();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(defaultCenter);
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
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(
      //     (position) => {
      //       const { latitude, longitude } = position.coords;
      //       const location = { lat: latitude, lng: longitude };
      //       setCurrentLocation(location);

      //       // ユーザーがマップを動かしていない場合のみ、マップの中心を現在地に更新
      //       if (!userMovedMap.current) {
      //         setMapCenter(location);
      //       }
      //     },
      //     (error) => {
      //       console.error("位置情報の取得に失敗しました", error);
      //       setError('位置情報の取得中にエラーが発生しました。');
      //     },
      //     { enableHighAccuracy: true }
      //   );
      // } else {
      //   setError('Geolocationがサポートされていません。');
      // }
      const location = { lat: 33.973797, lng: 134.359609 };
      setCurrentLocation(location);

      if (!userMovedMap.current) {
        setMapCenter(location);
      }
    };

    getGeolocation();
    const locationInterval = setInterval(getGeolocation, 10000);
    const resetDetectRotation = detectRotationAndUpload();
    return () => {
      clearInterval(locationInterval);
      resetDetectRotation();
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

  // ユーザーがマップを動かした場合にフラグを立てる
  const handleMapDragStart = () => {
    userMovedMap.current = true;
  };

  const handleMapDragEnd = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setMapCenter({ lat: center.lat(), lng: center.lng() });
      }
    }
  };

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
          center={mapCenter}
          mapTypeId={mapType}
          options={options}
          onLoad={(mapInstance) => setMap(mapInstance)}
          onDragStart={handleMapDragStart}  // ドラッグ開始時にフラグを更新
          onDragEnd={handleMapDragEnd}      // ドラッグ終了時に中心を更新
        >
          {routeData.path.length > 0 && (
            <Polyline path={routeData.path} options={{ strokeColor: '#0000FF', strokeWeight: 5 }} />
          )}

          {currentLocation && <Marker
            position={currentLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 16,
              fillColor: '#0000FF',
              fillOpacity: 1,
              strokeWeight: 10,
              strokeColor: '#FFFFFF',
              strokeOpacity: 0.7
            }}/>}

          <Marker
            position={fixedEndPoint}
            icon={{
              url: '/images/shelter.png',  // publicディレクトリ経由でのパス
              scaledSize: new google.maps.Size(50, 50),  // アイコンのサイズ調整
              anchor: new google.maps.Point(25, 25),  // 基準点の設定
            }}/>

          {routeData.risks.map((risk, index) => (
            risk.lat && risk.lng && (
              <Marker
                key={index}
                position={{ lat: risk.lat, lng: risk.lng }}
                label={`${risk.risk}`}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#FF0000',
                  fillOpacity: 1,
                  strokeWeight: 1,
                  strokeColor: '#000000',
                }}
              />
            )
          ))}
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
