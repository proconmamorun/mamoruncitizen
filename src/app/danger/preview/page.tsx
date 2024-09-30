// src/app/danger/preview/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './preview.module.css';

export default function Preview() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // ローカルストレージから撮影した画像を取得
    const storedImage = localStorage.getItem('capturedImage');
    if (storedImage) {
      setImageUrl(storedImage);
    }
  }, []);

  // 送信ボタンを押したときに送信完了ページに飛ぶ処理
  const handleSend = () => {
    router.push('/safety/where/check'); // 送信完了ページに遷移
  };

  return (
    <div className={styles.App}>
      <div className={styles.previewContainer}>
        <button
          className={`${styles.mainButtonDanger} ${styles.darkred}`}
          onClick={() => router.back()}
        >
          撮り直す
        </button>

        <div className={styles.cameraPreview}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Captured"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <p>写真を表示できません</p>
          )}
        </div>

        <button
          className={`${styles.mainButtonDanger} ${styles.green}`}
          onClick={handleSend}
        >
          送信
        </button>
      </div>
    </div>
  );
}
