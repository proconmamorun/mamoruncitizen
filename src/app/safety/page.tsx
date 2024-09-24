// src/app/safety/page.tsx
'use client';
import React from 'react';
import "./safetypage.css";
import { useRouter } from 'next/navigation';

export default function safety() {
  const router = useRouter();

  return (
    <div className="App">
      <p className="safetypage-title">あなたの状況は？</p>
      <div className="safetybutton-container">
        <button className="safetybutton-button" id="yelow" onClick={() => router.push('/safety/where')}>
          救助が必要
        </button>
        <button className="safetybutton-button" id="darkgreen" onClick={() => router.push('/safety/where')}>
          無事
        </button>
        <button className="safetybutton-button" id="darkgreen" onClick={() => router.push('/safety/where')}>
          その他
        </button>
      </div>
    </div>
  );
};