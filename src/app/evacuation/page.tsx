'use client';
import React from 'react';
import "./evacuationpage.css";
import { useRouter } from 'next/navigation';

export default function Evacuation() {
  const router = useRouter();

  return (
    <div className="App">
        <button className="backbutton-button" onClick={() => router.back()}>
            <img src="/images/back.png" alt="back" className="backbutton-image" />
        </button>
        <div>
            避難誘導
        </div>   
    </div>
  );
}
