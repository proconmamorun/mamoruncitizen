'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './preview.module.css';
import { uploadImageWithExif } from '../../../services/UploadImage'; // 必要な関数をインポート

export default function Preview() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // 画像ファイルを保持するstate
  const [uploading, setUploading] = useState<boolean>(false); // アップロード中のステータス

  useEffect(() => {
    // ローカルストレージから撮影した画像を取得
    const storedImage = localStorage.getItem('capturedImage');
    if (storedImage) {
      setImageUrl(storedImage);
      // Blobデータとして画像ファイルを再生成
      const imageBlob = new Blob([storedImage], { type: 'image/jpeg' });
      const file = new File([imageBlob], 'capturedImage.jpg', { type: 'image/jpeg' });
      setImageFile(file);
    }
  }, []);

  // 送信ボタンを押したときに画像をアップロードし、送信完了ページに飛ぶ処理
  const handleSend = async () => {
    if (!imageFile) return;

    try {
      setUploading(true); // アップロード中フラグをON
      
      // 画像をFirebaseにアップロード
      const { imageUrl, coordinates, address } = await uploadImageWithExif(imageFile);

      console.log('アップロード完了:', { imageUrl, coordinates, address });

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
