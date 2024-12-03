import React, { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../services/FirebaseConfig";
import "./Obi.css";

type ObiProps = {
  positions: ("top" | "bottom")[];
  isEvacuationPage: boolean;
};

export const Obi: React.FC<ObiProps> = ({ positions, isEvacuationPage }) => {
  const [message, setMessage] = useState<string>("");
  const sliderRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Firestoreの変更をリアルタイムで監視
    const alertQuery = query(
      collection(db, "alert"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(alertQuery, (querySnapshot) => {
      const fetchedMessage = querySnapshot.empty
        ? ""
        : querySnapshot.docs[0].data().text || "";

      setMessage(fetchedMessage);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {message != "" && positions.map((pos, positionIndex) => {
        const isTop = pos === "top";
        const key = isTop ? "obi-top" : "obi-bottom";
        const positionClass = isTop ? "obiTop" : "obiBottom";
        const additionalClass = !isTop && !isEvacuationPage ? "obiBelow" : "";

        return (
          <div
            key={key}
            className={`obiBackground ${positionClass} ${additionalClass}`}
          >
            {[...Array(3)].map((_, index) => (
              <div
                key={`slider-${positionIndex}-${index}`}
                className="textSlider"
                ref={(el) => {
                  if (el) sliderRefs.current[index] = el;
                }}
              >
                <div className="sliderTextWithIcon">
                  <img src="/images/obi-arrow.png" alt="矢印" className="arrowIcon" />
                  <img src="/images/warning.png" alt="警告" className="warningIcon" />
                  <p className="ObiMessage">{message}</p>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};
