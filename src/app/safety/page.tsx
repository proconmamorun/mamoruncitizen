// src/app/safety/page.tsx
'use client';
import React from 'react';
import styles from './safetypage.module.css';
import { useRouter } from 'next/navigation';

export default function Safety() {
  const router = useRouter();

  return (
    <div className={styles.App}>
      <p className={styles.safetypageTitle}>あなたの状況は？</p>
      <div className={styles.safetybuttonContainer}>
        <button
          className={`${styles.safetybuttonButton} ${styles.yellow}`}
          onClick={() => router.push('/safety/where/check')}
        >
          救助が必要
        </button>
        <button
          className={`${styles.safetybuttonButton} ${styles.darkgreen}`}
          onClick={() => router.push('/safety/where/check')}
        >
          無事
        </button>
      </div>
    </div>
  );
}
