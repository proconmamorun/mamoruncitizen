// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定情報をFirebaseコンソールから取得してください。
const firebaseConfig = {
    apiKey: "AIzaSyDiZvgKMPCWbx6ut3RFSVf_K-FM7H49iig",
    authDomain: "risk-level-e2a33.firebaseapp.com",
    projectId: "risk-level-e2a33",
    storageBucket: "risk-level-e2a33.appspot.com",
    messagingSenderId: "104452915833",
    appId: "1:104452915833:web:78463f72842e1386f78aa8",
    measurementId: "G-9TVR62QTY7"
  };

// Firebaseアプリを初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンスを作成
export const db = getFirestore(app);
