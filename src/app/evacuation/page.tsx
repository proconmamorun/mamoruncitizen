// src/app/evacuation/page.tsx
'use client';
import React, { useEffect } from 'react';
import styles from './evacuationpage.module.css';

export default function Evacuation() {
  useEffect(() => {
    // ページロード時にフッターを非表示にする
    const footerElement = document.querySelector('.Footer');
    if (footerElement) {
      footerElement.style.display = 'none';
    }

    // ページ離脱時にフッターを再表示する
    return () => {
      if (footerElement) {
        footerElement.style.display = 'flex';
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>避難誘導</div>
      
      <div className={styles.mapPlaceholder}>
        {/* マップ画像を挿入 */}
        <img src="/images/map-picture.png" alt="Map" className={styles.mapImage} />
        
        {/* アイコンを画像の上にオーバーレイ表示 */}
        <div className={styles.icon} style={{top: "10%", right: "5%"}}>
          <img src="/images/sound-icon.png" alt="Sound" />
        </div>
        <div className={styles.icon} style={{top: "20%", right: "5%"}}>
          <img src="/images/compass-icon.png" alt="Compass" />
        </div>
      </div>
      
      <div className={styles.footer}>
        <div>
          <div className={styles.time}>30 分</div>
          <div className={styles.distance}>1km・22:05</div>
        </div>
        <button className={styles.endButton}>終了</button>
      </div>
    </div>
  );
}
