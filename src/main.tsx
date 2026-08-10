/**
 * External dependencies.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

/**
 * Internal dependencies.
 */
import "@/styles/global.css";
import { App } from "@/App.tsx";
import { APP_BASENAME } from "@/constants";
import { AppProvider } from "@/store/providers/AppProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router basename={APP_BASENAME}>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </StrictMode>
);
