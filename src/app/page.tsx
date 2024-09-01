"use client"
import React from "react";
import "./Mainpage.css";
import { useRouter } from 'next/navigation';


export default function Home() {
  const router = useRouter();

  return (
    <div className="App">
      <div className="button-container">
        <button className="mainbutton-button" id="darkred" onClick={() => router.push('/safety')}>
          安否確認
        </button>
        <button className="mainbutton-button" id="orange">
          避難誘導
        </button>
        <button className="mainbutton-button" id="green">
          危険箇所共有
        </button>
      </div>
    </div>
  );

}
