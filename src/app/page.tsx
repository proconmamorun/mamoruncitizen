import React from "react";
import { Mainbotn } from "./component/Mainbotn";
import { Footer } from "./component/footer";


export default function Home() {
  return (
    <div className="App">
      <div className="button-container">
        <Mainbotn name="安否確認" />
        <Mainbotn name="避難誘導" />
        <Mainbotn name="危険箇所共有" />
      </div>
        <Footer/>
      <div className="button-container">
        
      </div>
    </div>
  );
}
