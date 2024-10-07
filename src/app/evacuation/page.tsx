'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './evacuationpage.module.css';

export default function Evacuation() {
  const router = useRouter();

  useEffect(() => {
    // フッターを非表示に設定
    const footerElement = document.querySelector('.Footer');
    if (footerElement) {
      footerElement.style.display = 'none'; // 避難ページでは非表示
    }

    // 下側の帯の位置を画面の一番下に設定
    const bottomImageElement = document.querySelector('.imageSliderBottom');
    if (bottomImageElement) {
      bottomImageElement.style.position = 'fixed';
      bottomImageElement.style.bottom = '0';
      bottomImageElement.style.left = '0';
      bottomImageElement.style.width = '100%';
      bottomImageElement.style.zIndex = '15';
    }

    // ページ離脱時に元のスタイルに戻す
    return () => {
      if (footerElement) {
        footerElement.style.display = 'flex'; // 他のページに戻ったら表示
      }
      if (bottomImageElement) {
        bottomImageElement.style.position = '';
        bottomImageElement.style.bottom = '90px'; // デフォルト位置に戻す
        bottomImageElement.style.left = '';
        bottomImageElement.style.width = '';
        bottomImageElement.style.zIndex = '';
      }
    };
  }, []);

  const handleEndClick = () => {
    router.push('/evacuation/evacuation-done');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>避難する</div>
      
      <div className={styles.mapPlaceholder}>
        <img src="/images/map-picture.png" alt="Map" className={styles.mapImage} />
        
        <div className={styles.icon} style={{ top: "23%", right: "5%" }}>
          <img src="/images/sound-icon.png" alt="Sound" />
        </div>
        <div className={styles.icon} style={{ top: "30%", right: "5%" }}>
          <img src="/images/compass-icon.png" alt="Compass" />
        </div>
      </div>
      
      <div className={styles.footer}>
        <div>
          <div className={styles.time}>30 分</div>
          <div className={styles.distance}>1km・22:05</div>
        </div>
        <button className={styles.endButton} onClick={handleEndClick}>終了</button>
      </div>
    </div>
  );
}
