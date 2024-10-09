// src/app/safety/page.tsx
'use client';
import React from 'react';
import styles from './safetypage.module.css';
import { useRouter } from 'next/navigation';
import {db} from "../../services/FirebaseConfig"
import { addDoc, collection } from 'firebase/firestore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

function uploadSafety(isSafe:boolean, router:AppRouterInstance){

  // 現在位置の取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          // Firestoreにデータを追加
          await addDoc(collection(db, 'citizen'), {
            latitude: latitude, // 緯度
            longitude: longitude, // 経度
            safety: isSafe, // 引数からの安全情報
          });

          // 成功したら次のページに遷移
          router.push('/safety/where/check');
        } catch (error) {
          console.error('データの保存に失敗しました:', error);
        }
      },
      (error) => {
        console.error('現在位置の取得に失敗しました:', error);
      }
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
