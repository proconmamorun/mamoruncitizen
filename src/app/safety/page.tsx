// src/app/safety/page.tsx
'use client';
import React from 'react';
import styles from './safetypage.module.css';
import { useRouter } from 'next/navigation';
import {db} from "../../services/FirebaseConfig"
import { addDoc, collection } from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function uploadSafety(isSafe: boolean, router: AppRouterInstance) {
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

        try {
          await addDoc(collection(db, 'citizen'), {
            latitude: latitude,
            longitude: longitude,
            safety: isSafe,
          });

          router.push('/safety/where/check');
        } catch (error) {
          console.error('データの保存に失敗しました:', error);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('ユーザーが位置情報の取得を拒否しました。');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('位置情報が利用できません。');
            break;
          case error.TIMEOUT:
            console.error('位置情報の取得がタイムアウトしました。');
            break;
          default:
            console.error('未知のエラーが発生しました。', error);
            break;
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

  return (
    <div className={styles.App}>
      <p className={styles.safetypageTitle}>あなたの状況は？</p>
      <div className={styles.safetybuttonContainer}>
        <button
          className={`${styles.safetybuttonButton} ${styles.yellow}`}
          onClick={() => uploadSafety(false, router)}
        >
          救助が必要
        </button>
        <button
          className={`${styles.safetybuttonButton} ${styles.darkgreen}`}
          onClick={() => uploadSafety(true, router)}
        >
          無事
        </button>
      </div>
    </div>
  );
}
