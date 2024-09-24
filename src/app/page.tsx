"use client"
import React from "react";
import "./Mainpage.css";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  return (
    <div className="App">
      <div className="mainbutton-container">
        <button className="mainbutton-button" id="darkgreen" onClick={() => router.push('/safety')}>
          安否確認
        </button>
        <button className="mainbutton-button" id="yelow" onClick={() => router.push('/evacuation')}>
          避難誘導
        </button>
        <button className="mainbutton-button" id="darkgreen" onClick={() => router.push('/danger')}>
          危険箇所共有
        </button>
      </div>
    </div>
  );

}
