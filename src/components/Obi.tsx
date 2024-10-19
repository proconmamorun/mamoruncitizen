import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";
import "./Obi.css";

type ObiProps = {
  positions: ("top" | "bottom")[];
  isEvacuationPage: boolean;
};

export const Obi: React.FC<ObiProps> = ({ positions, isEvacuationPage }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const sliderRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Firestoreの変更をリアルタイムで監視
    const alertQuery = query(
      collection(db, "alert"),
      orderBy("createdAt", "desc"),
      limit(3)
    );

    const unsubscribe = onSnapshot(alertQuery, (querySnapshot) => {
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
    });

    // クリーンアップ
    return () => unsubscribe();
  }, []);

  const handleAnimationEnd = () => {
    if (messages.length > 0) {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }
  };

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

  if (messages[0] === "") {
    return null;
  }

  return (
    <>
      {positions.map((pos, index) => {
        const isTop = pos === "top";
        const key = isTop ? "obi-top" : "obi-bottom";
        const positionClass = isTop ? "obiTop" : "obiBottom";
        const additionalClass = !isTop && !isEvacuationPage ? "obiBelow" : "";

        return (
          <div
            key={key}
            className={`obiBackground ${positionClass} ${additionalClass}`}
          >
            <div
              className="textSlider"
              ref={(el) => {
                if (el) {
                  sliderRefs.current[index] = el;
                }
              }}
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
