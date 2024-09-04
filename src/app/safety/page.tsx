// src/app/safety/page.tsx
import React from 'react';
import "./safetypage.css";

const SafetyPage = () => {
  return (
    <div className="App">
      <div className="safetybutton-container">
        <button className="safetybutton-button" id="darkred">
        救助が必要
        </button>
        <button className="safetybutton-button" id="green">
        無事
        </button>
      </div>
    </div>
  );
};

export default SafetyPage;
