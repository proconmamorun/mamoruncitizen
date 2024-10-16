// src/app/safety/where/check/page.tsx
'use client';
import React from 'react';
import styles from './checkpage.module.css';
import { useRouter } from 'next/navigation';

export default function Check() {
  const router = useRouter(); // useRouter フックを使用してルーターを取得

  const handleBackToHome = () => {
    router.push('/'); // ホームページ（'/'）への遷移を実行
  };

  return (
    <div className={styles.App}>
      <p className={styles.safetypageTitle}>送信完了</p>
      <button className={styles.greenButton} onClick={handleBackToHome}>ホームに戻る</button>
    </div>
  );
}
