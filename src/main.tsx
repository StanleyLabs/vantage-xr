import React from "react";
import ReactDOM from "react-dom/client";
import { useGLTF } from "@react-three/drei";
import App from "./App";
import "./index.css";

// Configure DRACO decoder path for compressed GLB models (before any models load)
useGLTF.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
