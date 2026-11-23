import React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import "./styles.css";
try { document.documentElement.dataset.theme = localStorage.getItem("info-theme")==="dark"?"dark":"light"; } catch {}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
