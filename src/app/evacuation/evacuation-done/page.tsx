// Reactコンポーネント部分
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './evacuationDone.module.css'; 

export default function EvacuationDone() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <p className={styles.firstMessage}>避難完了</p>
      <p className={styles.secondMessage}>お疲れ様でした</p> {/* secondMessageクラスを適用 */}
      <p className={styles.message}>安全が確保できた方は</p>
      <p className={styles.message}>下のボタンから</p>
      <p className={styles.message}>
        <span className={styles.important}>安否を知らせる</span>を
      </p>
      <p className={styles.message}>お願いします。</p>
      <button className={styles.button} onClick={() => router.push('/safety')}>
        安否を知らせる
      </button>
    </div>
  );
}
