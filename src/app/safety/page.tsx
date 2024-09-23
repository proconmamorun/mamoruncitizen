// src/app/safety/page.tsx
'use client';
import React from 'react';
import "./safetypage.css";
import { useRouter } from 'next/navigation';

export default function safety() {
  const router = useRouter();

  return (
    <div className="App">
      <div className="safetybutton-container">
        <button className="safetybutton-button" id="darkred" >
          救助が必要
        </button>
        <button className="safetybutton-button" id="green" >
          無事
        </button>
      </div>
    </div>
  );
};


