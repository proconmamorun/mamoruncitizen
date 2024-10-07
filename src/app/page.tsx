'use client';
import React from 'react';
import './home.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className={"main"}>
      <div className={"homeMainbuttonContainer"}>
        {/* 安否確認のボタン */}
        <button
          className={"imageButton"}
          onClick={() => router.push('/safety')}
        >
          <img 
            src="/images/safety-know.png" 
            alt="安否確認" 
            className={"buttonImage"}
          />
        </button>

        {/* 避難誘導のボタン */}
        <button
          className={"imageButton"}
          onClick={() => router.push('/evacuation')}
        >
          <img 
            src="/images/danger-evacuation.png" 
            alt="避難誘導" 
            className={"buttonImage"}
          />
        </button>

        {/* 危険箇所共有のボタン */}
        <button
          className={"imageButton"}
          onClick={() => router.push('/danger')}
        >
          <img 
            src="/images/danger-share.png" 
            alt="危険箇所共有" 
            className={"buttonImage"}
          />
        </button>
      </div>
    </div>
  );
}
