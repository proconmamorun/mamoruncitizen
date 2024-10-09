'use client';
import React, { useEffect } from 'react';
import './home.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // クリーンアップ処理を行うuseEffect
  useEffect(() => {
    const eventListener = () => {
      console.log('An event triggered!');
    };

    // イベントリスナーの登録
    window.addEventListener('someEvent', eventListener);

    return () => {
      // イベントリスナーの解除（クリーンアップ）
      window.removeEventListener('someEvent', eventListener);
    };
  }, []);

  // 非同期でページ遷移を行う関数
  const handleNavigation = async (url: string) => {
    try {
      await router.push(url);
      console.log(`${url}へ遷移しました`);
    } catch (error) {
      console.error(`遷移中にエラーが発生しました: ${error}`);
    }
  };

  // ボタンリストのデータ
  const buttons = [
    { url: '/safety', imageSrc: '/images/safety-know.png', alt: '安否確認' },
    { url: '/evacuation', imageSrc: '/images/danger-evacuation.png', alt: '避難誘導' },
    { url: '/danger', imageSrc: '/images/danger-share.png', alt: '危険箇所共有' }
  ];

  return (
    <div className={"main"}>
      <div className={"homeMainbuttonContainer"}>
        {buttons.map((button, index) => (
          <button
            key={index} // keyを追加して重複を防ぐ
            className={"imageButton"}
            onClick={() => handleNavigation(button.url)}
          >
            <img 
              src={button.imageSrc} 
              alt={button.alt} 
              className={"buttonImage"}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
