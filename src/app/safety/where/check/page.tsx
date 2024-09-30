// src/app/safety/where/check/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import styles from './checkpage.module.css';
import { useRouter } from 'next/navigation';

export default function Check() {
  const [fadeOut, setFadeOut] = useState(false); // フェードアウト状態を管理
  const router = useRouter();

  useEffect(() => {
    // 1秒後にフェードアウトを開始
    const timer1 = setTimeout(() => {
      setFadeOut(true); // フェードアウトを開始
    }, 500); // 1秒後にフェードアウト開始

    // フェードアウト後にホームページに遷移
    const timer2 = setTimeout(() => {
      router.push('/');
    }, 1200); // 2秒後にホームページに遷移

    // クリーンアップ関数でタイマーをクリア
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [router]);

  return (
    <div className={`${styles.App} ${fadeOut ? styles.fadeOut : ''}`}>
      <p className={styles.safetypageTitle}>送信完了</p>
    </div>
  );
}
