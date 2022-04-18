import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Game from "./Components/Game";
import reportWebVitals from "./reportWebVitals";
import App from "./App"

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <div style={{display:'flex', flexDirection:'row',width:'100vw',height:'100vh'}}>
      <div style={{display:'flex', flexDirection:'row',width:'50vw',height:'90vh'}}>
        <App />
      </div>
      <div style={{display:'flex', flexDirection:'row',width:'50vw',height:'90vh'}}>
        <Game />
      </div>
    </div>
  </React.StrictMode>
);

reportWebVitals();