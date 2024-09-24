// src/app/safety-where/page.tsx
'use client';
import React from 'react';
import "./safety-wherepage.css";
import { useRouter } from 'next/navigation';

export default function Safety() {
  const router = useRouter();

  return (
    <div className="App">
      <p className="safetypage-title">今どこにいる？</p>
      <div className="safetybutton-container">
        <button className="safetybutton-button" id="yelow" >
          学校か職場
        </button>
        <button className="safetybutton-button" id="darkgreen" >
          自宅
        </button>
        <button className="safetybutton-button" id="darkgreen" >
          建物外
        </button>
      </div>
    </div>
  );
}