import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/App.jsx";
import "./index.css";
import "leaflet/dist/leaflet.css";
import "./styles/leaflet.css";
import "./lib/leafletIconFix.js";
import { I18nProvider } from "./i18n/i18n.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nProvider>
    </HelmetProvider>
  </React.StrictMode>,
);
