// Obi.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";
import "./Obi.css";

type ObiProps = {
  positions: ("top" | "bottom")[];
  isEvacuationPage: boolean;
};

export const Obi: React.FC<ObiProps> = ({ positions, isEvacuationPage }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // 各帯ごとに参照を持つ
  const sliderRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Firestoreから最新のアラートメッセージを取得
    const fetchAlertMessage = async () => {
      try {
        const alertQuery = query(
          collection(db, "alert"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(alertQuery);

        if (!querySnapshot.empty) {
          const fetchedMessages = querySnapshot.docs.map(
            (doc) => doc.data().text || "警告: データがありません"
          );
          setMessages(fetchedMessages);
        } else {
          setMessages([
            "警告: データがありません",
            "警告: データがありません",
            "警告: データがありません",
          ]);
        }
      } catch (error) {
        console.error("Firestoreからメッセージの取得に失敗しました:", error);
        setMessages([
          "エラー: メッセージを取得できません",
          "エラー: メッセージを取得できません",
          "エラー: メッセージを取得できません",
        ]);
      }
    };

    fetchAlertMessage();
  }, []);

  // アニメーション終了を監視し、次のメッセージを表示
  const handleAnimationEnd = () => {
    if (messages.length > 0) {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }
  };

  // スライダーの参照が取得できたら、アニメーション終了を監視するイベントを設定
  useEffect(() => {
    sliderRefs.current.forEach((sliderElement) => {
      if (sliderElement) {
        sliderElement.addEventListener("animationend", handleAnimationEnd);
      }
    });

    return () => {
      sliderRefs.current.forEach((sliderElement) => {
        if (sliderElement) {
          sliderElement.removeEventListener("animationend", handleAnimationEnd);
        }
      });
    };
  }, [messages.length]);

  return (
    <>
      {positions.map((pos, index) => {
        const isTop = pos === "top";
        const key = isTop ? "obi-top" : "obi-bottom"; // キーを固定
        const positionClass = isTop ? "obiTop" : "obiBottom"; // クラス名を固定
        const additionalClass = !isTop && !isEvacuationPage ? "obiBelow" : ""; // 非避難ページで下部帯の場合、obiBelowを追加

        return (
          <div
            key={key}
            className={`obiBackground ${positionClass} ${additionalClass}`}
          >
            <div
              className="textSlider"
              ref={(el) => (sliderRefs.current[index] = el!)}
            >
              <div className="sliderTextWithIcon" key={currentMessageIndex}>
                <img src="/images/obi-arrow.png" alt="矢印" className="arrowIcon" />
                <img src="/images/warning.png" alt="警告" className="warningIcon" />
                <p className="ObiMessage">{messages[currentMessageIndex]}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
