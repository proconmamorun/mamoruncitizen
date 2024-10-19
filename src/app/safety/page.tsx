'use client';
import React, { useEffect, useState } from 'react';
import styles from './safetypage.module.css';
import { useRouter } from 'next/navigation';
import { db } from "../../services/FirebaseConfig";
import { addDoc, collection } from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// 環境変数からGoogle APIキーを取得
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Google Geolocation APIを使って現在位置を取得
async function getGeolocationFromGoogleAPI() {
  try {
    const response = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Google Geolocation API request failed');
    }

    const data = await response.json();
    const { lat, lng } = data.location;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    console.error('Google Geolocation API failed:', error);
    throw error; // エラーハンドリングのために再スロー
  }
}

// 位置情報を保存する共通関数
async function saveLocationData(name: string, district: string, latitude: number, longitude: number, isSafe: string, router: AppRouterInstance) {
  try {
    await addDoc(collection(db, 'citizen'), {
      name: name,
      district: district,
      latitude: latitude,
      longitude: longitude,
      safety: isSafe,
    });

    // 成功したら次のページに遷移
    router.push('/safety/where/check');
  } catch (error) {
    console.error('データの保存に失敗しました:', error);
  }
}

// 位置情報を取得するメインの関数
async function fetchLocation(isSafe: string, router: AppRouterInstance) {
  const name = localStorage.getItem('userName'); // LocalStorageからユーザー名を取得
  const district = localStorage.getItem('district'); // LocalStorageから地域を取得
  if (!name || !district) {
    console.error('ユーザー情報が保存されていません。');
    return;
  }

  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000, // 5秒でタイムアウト
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        await saveLocationData(name, district, latitude, longitude, isSafe, router);
      },
      async (error) => {
        console.error('navigator.geolocation による位置情報取得に失敗しました:', error);

        // navigator.geolocationが失敗した場合にGoogle Geolocation APIを使用
        try {
          const { latitude, longitude } = await getGeolocationFromGoogleAPI();
          await saveLocationData(name, district, latitude, longitude, isSafe, router);
        } catch (error) {
          console.error('Google Geolocation APIによる位置情報の取得にも失敗しました:', error);
        }
      },
      options
    );
  } else {
    console.error('Geolocationがサポートされていません。');
  }
}

export default function Safety() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // LocalStorageからユーザー名を取得し、stateにセット
    const storedUserName = localStorage.getItem('userName');
    setUserName(storedUserName);
  }, []);

  return (
    <div className={styles.App}>
      <p className={styles.safetypageTitle}>あなたの状況は？</p>
      <div className={styles.safetybuttonContainer}>
        {userName ? (
          <>
            <button
              className={`${styles.safetybuttonButton} ${styles.yellow}`}
              onClick={() => fetchLocation("救助が必要", router)}
            >
              救助が必要
            </button>
            <button
              className={`${styles.safetybuttonButton} ${styles.darkgreen}`}
              onClick={() => fetchLocation("無事", router)}
            >
              無事
            </button>
          </>
        ) : (
          <p>ユーザー情報が見つかりません。ログインしてください。</p>
        )}
      </div>
    </div>
  );
}
