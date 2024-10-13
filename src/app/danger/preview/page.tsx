'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './preview.module.css';
import {uploadImageWithExif} from '@/services/UploadImage';

export default function Preview() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false); // アップロード中のステータス

  useEffect(() => {
    // ローカルストレージから撮影した画像のパスを取得
    const storedImage = localStorage.getItem('capturedImage');
    if (storedImage) {
      setImageUrl(storedImage); // 画像のパス（URL）を状態にセット
    }
  }, []);

  // 送信ボタンを押したときに画像をアップロードし、送信完了ページに飛ぶ処理
  const handleSend = async () => {
    if (!imageUrl) return;

    try {
      setUploading(true); // アップロード中フラグをON

      // 画像のパスをFirebaseにアップロード
      await uploadImageWithExif(imageUrl);

      // アップロード完了後に送信完了ページに遷移
      router.push('/safety/where/check');
    } catch (error) {
      console.error('画像アップロード中にエラーが発生しました:', error);
    } finally {
      setUploading(false); // アップロード中フラグをOFF
    }
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
          disabled={uploading} // アップロード中はボタンを無効化
        >
          {uploading ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
}
