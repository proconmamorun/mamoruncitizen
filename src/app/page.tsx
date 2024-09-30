// src/app/page.tsx
'use client';
import React from 'react';
import styles from './Mainpage.module.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.App}>
      <div className={styles.homeMainbuttonContainer}>
        <button
          className={`${styles.homeMainbuttonButton} ${styles.darkgreen}`}
          onClick={() => router.push('/safety')}
        >
          安否確認
        </button>
        <button
          className={`${styles.homeMainbuttonButton} ${styles.orange}`}
          onClick={() => router.push('/evacuation')}
        >
          避難誘導
        </button>
        <button
          className={`${styles.homeMainbuttonButton} ${styles.green}`}
          onClick={() => router.push('/danger')}
        >
          危険箇所共有
        </button>
      </div>
    </div>
  );
}
