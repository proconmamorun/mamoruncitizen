import React from "react";
import { Footer } from "./component/footer";


export default function Home() {
  return (
    <div className="App">
      <div className="button-container">
        <button className="mainbotn-button" id="darkred">
          安否確認
        </button>
        <button className="mainbotn-button" id="orange">
          避難誘導
        </button>
        <button className="mainbotn-button" id="green">
          危険箇所共有
        </button>
      </div>
        <Footer/>
    </div>
  );
}
